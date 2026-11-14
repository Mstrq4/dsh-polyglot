import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const NATIVE_REVISION = '1.0.2';
const LAYOUT_ID = '@deepseek-ai/dsh-client-ui-layout';
const ROWS_ID = '@deepseek-ai/dsh-client-ui-workspace';
const ROWS_SHA256 = 'a6e71ef7ae8581e33a9e2a9f48787b8390c192e3e3f6b23a37b19f71137b34f8';
const RELEASE = '0.2.2-rc.2';
const LAYOUT_SHA256 = '814486863a32f73e7184a66312ec2d7f5884766000af21f60891a0c01b592630';
const PREFIX = `/__arabic-ui-native/${NATIVE_REVISION}`;
const hash = text => createHash('sha256').update(text).digest('hex');
// Only the verified native file's exact final metadata line is removed.
// Never parse or strip sourceMappingURL-like text from unrelated combo modules.
const withoutMap = text => text.replace(/\r?\n\/\/# sourceMappingURL=client\.js\.map\s*$/, '').trim();

export function replaceOnce(text, from, to) {
  if (text.split(from).length !== 2) throw new Error('native-patch-anchor-mismatch');
  return text.replace(from, () => to);
}

/** Modify only the verified shipped frame, not React, events, or Slot ownership. */
export function patchNativeLayout(source) {
  if (hash(source) !== LAYOUT_SHA256) throw new Error('native-source-mismatch');
  let patched = withoutMap(source);
  patched = replaceOnce(patched, 'const origin=(0,react.useRef)(0);', 'const origin=(0,react.useRef)(0);const arabicDragDirection=(0,react.useRef)(1);');
  patched = replaceOnce(patched, 'origin.current=e.clientX;', 'arabicDragDirection.current=getComputedStyle(e.currentTarget.parentElement).direction===`rtl`?-1:1;origin.current=e.clientX;');
  patched = replaceOnce(patched, 'onDrag(latest.current-origin.current)', 'onDrag((latest.current-origin.current)*arabicDragDirection.current)');
  patched = replaceOnce(patched, 'onDrag(e.clientX-origin.current)', 'onDrag((e.clientX-origin.current)*arabicDragDirection.current)');
  patched = replaceOnce(patched, 'style:{left:props.left}', 'style:{insetInlineStart:props.left}');
  patched = replaceOnce(patched, 'border-radius:var(--dsh-windows-content-radius) 0 0 0;corner-shape:round', 'border-start-start-radius:var(--dsh-windows-content-radius);corner-shape:round');
  return `${patched}\nwindow.__DSH_ARABIC_NATIVE_LAYOUT__=${JSON.stringify(NATIVE_REVISION)};\n`;
}

/** Preserve native marquee semantics in CSS RTL scrollports (negative scrollLeft). */
export function patchNativeRows(source) {
  if (hash(source) !== ROWS_SHA256) throw new Error('native-source-mismatch');
  let patched = withoutMap(source);
  patched = replaceOnce(patched, 'function placeTitle(title,left,range){', 'function placeTitle(title,left,range){const physicalLeft=getComputedStyle(title).direction===`rtl`?-left:left;');
  patched = replaceOnce(patched, 'title.scrollTo({left,behavior:`instant`})', 'title.scrollTo({left:physicalLeft,behavior:`instant`})');
  patched = replaceOnce(patched, 'title.scrollLeft=left;', 'title.scrollLeft=physicalLeft;');
  return `${patched}\nwindow.__DSH_ARABIC_NATIVE_ROWS__=${JSON.stringify(NATIVE_REVISION)};\n`;
}

/** Public HTTP carrier extension. Never edit the installation or intercept /plugins/. */
export function applyNativeBridge(ctx) {
  const status = { available: false, revision: NATIVE_REVISION, reason: 'initializing', aliasCount: 0 };
  ctx.effect(() => {
    let aliases = new Map();
    let disposed = false;
    const clear = () => { for (const alias of aliases.values()) alias.dispose(); aliases.clear(); status.aliasCount = 0; };
    const unavailable = reason => { status.available = false; status.reason = reason; clear(); };
    const sync = () => {
      if (disposed) return;
      const graph = ctx.clientModules.graph();
      if (graph.release?.version !== RELEASE) { unavailable('unsupported-release'); return; }
      const patches = new Map();
      for (const [id, patch] of [[LAYOUT_ID, patchNativeLayout], [ROWS_ID, patchNativeRows]]) {
        if (id !== LAYOUT_ID && !graph.entries.some(entry => entry.id === id)) continue;
        const sourcePath = ctx.clientModules.clientPath(id);
        if (!sourcePath) { unavailable('native-module-missing'); return; }
        try {
          const source = readFileSync(sourcePath, 'utf8');
          patches.set(id, { core: withoutMap(source), patched: patch(source) });
        } catch { unavailable('native-source-mismatch'); return; }
      }
      const urls = new Map();
      for (const entry of graph.entries) if (patches.has(entry.id)) urls.set(entry.url, [entry.id]);
      for (const batch of graph.batches) {
        const targets = batch.entries.filter(id => patches.has(id));
        if (targets.length) urls.set(batch.url, targets);
      }
      const next = new Map();
      const acquired = [];
      try {
        for (const [url, targets] of urls) {
          const original = new URL(url, `${ctx.webServer.getOrigin()}/`);
          if (original.origin !== ctx.webServer.getOrigin() || original.pathname !== '/plugins/') throw new Error('unexpected-native-url');
          const patchKey = targets.join(',');
          const prior = aliases.get(url);
          if (prior?.patchKey === patchKey) { next.set(url, prior); continue; }
          const path = `${PREFIX}/${hash(`${url}:${patchKey}`).slice(0, 24)}.js`;
          const alias = { path, patchKey, dispose: undefined };
          alias.dispose = ctx.webServer.register({
            kind: 'exact', path,
            async resource(request) {
              if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
              const response = await ctx.clientModules.fetchBundle(new Request(original, { method: 'GET' }));
              if (response.status !== 200) return response;
              const body = await response.text(); // copy; never mutate a native held Buffer
              let result = body;
              for (const id of targets) {
                const { core, patched } = patches.get(id);
                if (result.split(core).length === 2) result = replaceOnce(result, core, patched);
                else { status.available = false; status.reason = 'native-combo-mismatch'; result = body; break; }
              }
              return new Response(request.method === 'HEAD' ? null : result, {
                headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store', 'X-Arabic-Native-Revision': NATIVE_REVISION },
              });
            },
          });
          acquired.push(alias); next.set(url, alias);
        }
      } catch {
        for (const alias of acquired) alias.dispose();
        unavailable('native-route-registration-failed'); return;
      }
      for (const [url, alias] of aliases) if (next.get(url) !== alias) alias.dispose();
      aliases = next;
      status.available = urls.size > 0;
      status.reason = status.available ? 'ready-refresh-required' : 'native-urls-missing';
      status.aliasCount = aliases.size;
    };
    const statusDispose = ctx.webServer.register({
      kind: 'exact', path: `${PREFIX}/status`,
      async resource(request) {
        if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
        return new Response(request.method === 'HEAD' ? null : JSON.stringify(status), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
      },
    });
    const tapDispose = ctx.webServer.tapIndex(html => {
      if (!status.available) return html;
      let result = html;
      for (const [url, alias] of aliases) {
        result = result.replaceAll(url, alias.path);
        result = result.replaceAll(url.replaceAll('&', '&amp;'), alias.path);
      }
      return result;
    });
    const observerDispose = ctx.clientModules.onGraphChanged(sync);
    sync();
    return () => { disposed = true; observerDispose(); tapDispose(); clear(); statusDispose(); status.available = false; status.reason = 'unloaded'; };
  }, 'arabic-ui: verified native frame transport');
  return status;
}
