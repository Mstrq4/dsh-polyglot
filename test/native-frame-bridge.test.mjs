import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Script } from 'node:vm';
import { Context } from './native-runtime.mjs';
import { patchNativeLayout, NATIVE_REVISION } from '../src/native-bridge.js';
import * as bridge from '../src/native-bridge.js';
import * as host from '../index.js';

const nativePath = join(dirname(process.env.DSH_INSTALL_DIR), 'dsh-client-ui-layout/lib/client.js');
const native = readFileSync(nativePath, 'utf8');
const rowsPath = join(dirname(process.env.DSH_INSTALL_DIR), 'dsh-client-ui-workspace/lib/client.js');
const nativeRows = readFileSync(rowsPath, 'utf8');
const rowsId = '@deepseek-ai/dsh-client-ui-workspace';
const id = '@deepseek-ai/dsh-client-ui-layout';
const layoutUrl = `/plugins/??${id}/client.js&rev=test-native`;
const batchUrl = `/plugins/??@example/other/client.js,${id}/client.js&rev=test-batch`;

// HTTP/service boundary only: real Cordis owns effects; no DOM or UI renderer.
function carrier({ version = '0.2.2-rc.2', path = nativePath, body = native } = {}) {
  const root = new Context();
  const routes = new Map();
  const taps = new Set();
  const observers = new Set();
  const requests = [];
  const current = { graph: { release: { version }, entries: [{ id, url: layoutUrl }], batches: [{ entries: ['@example/other', id], url: batchUrl }] } };
  const server = {
    getOrigin: () => 'http://127.0.0.1:12964',
    register(route) { assert.equal(route.kind, 'exact'); if (routes.has(route.path)) throw new Error('collision'); routes.set(route.path, route); return () => routes.delete(route.path); },
    tapIndex(fn) { taps.add(fn); return () => taps.delete(fn); },
  };
  const modules = {
    graph: () => current.graph,
    clientPath: id => id === rowsId ? rowsPath : path,
    async fetchBundle(request) { requests.push(request); return new Response(body, { headers: { 'Content-Type': 'text/javascript', 'Cache-Control': 'public, max-age=31536000, immutable', 'ETag': 'original', 'Content-Encoding': 'identity' } }); },
    onGraphChanged(fn) { observers.add(fn); return () => observers.delete(fn); },
  };
  root.provide('webServer', server); root.provide('clientModules', modules);
  return { root, routes, taps, observers, requests, current };
}
async function mount(c) {
  const fiber = c.root.plugin(host);
  await fiber.await(); return fiber;
}
const render = (c, html) => [...c.taps].reduce((value, tap) => tap(value), html);
const scripts = c => [...c.routes.values()].filter(route => route.path.endsWith('.js'));

test('native geometry repair changes both move and final-release delta, preserving original capture, rAF and callbacks', () => {
  const patched = patchNativeLayout(native);
  assert.match(patched, /style:\{insetInlineStart:props.left\}/);
  assert.ok(patched.includes('border-start-start-radius:var(--dsh-windows-content-radius)'));
  assert.ok(!patched.includes('border-radius:var(--dsh-windows-content-radius) 0 0 0'));
  assert.doesNotMatch(patched, /onDrag\(latest.current-origin.current\)|onDrag\(e.clientX-origin.current\)/);
  assert.match(patched, /onDrag\(\(latest.current-origin.current\)\*arabicDragDirection.current\)/);
  assert.match(patched, /onDrag\(\(e.clientX-origin.current\)\*arabicDragDirection.current\)/);
  assert.match(patched, /arabicDragDirection.current=getComputedStyle\(e.currentTarget.parentElement\).direction===`rtl`\?-1:1/);
  for (const code of ['setPointerCapture', 'releasePointerCapture', 'requestAnimationFrame', 'onLostPointerCapture:onPointerCancel']) assert.ok(patched.includes(code), code);
  assert.ok(patched.includes(`window.__DSH_ARABIC_NATIVE_LAYOUT__=${JSON.stringify(NATIVE_REVISION)}`));
  new Script(patched); // Syntax only; do not execute a fake React/DOM application.
});

test('native session-title marquee uses negative RTL scroll offsets while retaining reset, speed and reduced-motion behavior', () => {
  assert.equal(typeof bridge.patchNativeRows, 'function');
  const patched = bridge.patchNativeRows(nativeRows);
  assert.ok(patched.includes('const physicalLeft=getComputedStyle(title).direction===`rtl`?-left:left;'));
  assert.ok(patched.includes('title.scrollTo({left:physicalLeft,behavior:`instant`})'));
  assert.ok(patched.includes('title.scrollLeft=physicalLeft'));
  assert.ok(patched.includes('title.scrollTo({left:0,behavior:`instant`})'));
  assert.ok(patched.includes('prefers-reduced-motion: reduce'));
  assert.ok(patched.includes('__DSH_ARABIC_NATIVE_ROWS__'));
  new Script(patched);
  assert.throws(() => bridge.patchNativeRows(nativeRows + '/* unknown */'), /native-source-mismatch/);
});

test('paired native frame and rows aliases repair only their advertised combo factories', async t => {
  const c = carrier({ body: native + '\n' + nativeRows }); t.after(() => c.root.fiber.dispose());
  c.current.graph.entries.push({ id: rowsId, url: `/plugins/??${rowsId}/client.js&rev=rows` });
  c.current.graph.batches[0].entries.push(rowsId);
  await mount(c);
  const route = c.routes.get(render(c, batchUrl));
  const output = await (await route.resource(new Request(`http://127.0.0.1:12964${route.path}`))).text();
  assert.ok(output.includes('__DSH_ARABIC_NATIVE_LAYOUT__')); assert.ok(output.includes('__DSH_ARABIC_NATIVE_ROWS__'));
  assert.ok(!render(c, c.current.graph.entries[1].url).startsWith('/plugins/'));
  new Script(output);
});

test('native source substitution keeps replacement metacharacters literal and rejects non-unique anchors', () => {
  assert.equal(typeof bridge.replaceOnce, 'function');
  const payload = "$& | $$ | $` | $'";
  assert.equal(bridge.replaceOnce('before <factory> after', '<factory>', payload), `before ${payload} after`);
  assert.throws(() => bridge.replaceOnce('none', '<factory>', payload), /anchor-mismatch/);
  assert.throws(() => bridge.replaceOnce('<factory><factory>', '<factory>', payload), /anchor-mismatch/);
});

test('native artifact fingerprint rejects any unknown source rather than modifying it speculatively', () => {
  assert.throws(() => patchNativeLayout(native + '/* changed */'), /native-source-mismatch/);
});

test('index rewrites only advertised layout-bearing entry, batch and preload URLs to isolated routes', async t => {
  const c = carrier(); t.after(() => c.root.fiber.dispose()); await mount(c);
  const untouched = '/plugins/??@example/other/client.js&rev=other';
  const html = `<link href="${batchUrl}"><script>window.__DSH_BOOT__=${JSON.stringify(c.current.graph)}</script><link href="${untouched}">`;
  const rewritten = render(c, html);
  assert.ok(!rewritten.includes(layoutUrl)); assert.ok(!rewritten.includes(batchUrl));
  assert.ok(rewritten.includes(untouched)); assert.equal(scripts(c).length, 2);
  assert.ok(!c.routes.has('/plugins/')); // Combo paths are shared; never intercept them.
});

test('alias serves copied, patched native bytes with fresh headers and delegates only a whitelisted original URL', async t => {
  const c = carrier(); t.after(() => c.root.fiber.dispose()); await mount(c);
  const route = scripts(c)[0];
  const response = await route.resource(new Request(`http://127.0.0.1:12964${route.path}`));
  assert.equal(response.status, 200); assert.match(await response.text(), /__DSH_ARABIC_NATIVE_LAYOUT__/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('etag'), null); assert.equal(response.headers.get('content-encoding'), null);
  assert.ok([layoutUrl, batchUrl].some(url => c.requests[0].url === `http://127.0.0.1:12964${url}`));
  const head = await route.resource(new Request(`http://127.0.0.1:12964${route.path}`, { method: 'HEAD' }));
  assert.equal(await head.text(), '');
  const post = await route.resource(new Request(`http://127.0.0.1:12964${route.path}`, { method: 'POST' }));
  assert.equal(post.status, 405);
});

test('unknown release leaves native boot URLs and geometry unchanged and reports unavailable', async t => {
  const c = carrier({ version: '0.2.3' }); t.after(() => c.root.fiber.dispose()); await mount(c);
  assert.equal(scripts(c).length, 0); assert.equal(render(c, layoutUrl), layoutUrl);
  const statusRoute = [...c.routes.values()].find(route => route.path.endsWith('/status'));
  const status = await (await statusRoute.resource(new Request(`http://127.0.0.1:12964${statusRoute.path}`))).json();
  assert.equal(status.available, false); assert.equal(status.reason, 'unsupported-release');
});

test('unexpected combo body fails closed to original code and disables further boot rewriting', async t => {
  const c = carrier({ body: 'window.unrelated = true;' }); t.after(() => c.root.fiber.dispose()); await mount(c);
  const route = scripts(c)[0];
  const response = await route.resource(new Request(`http://127.0.0.1:12964${route.path}`));
  assert.equal(await response.text(), 'window.unrelated = true;');
  assert.equal(render(c, layoutUrl), layoutUrl);
});

test('realistic combos preserve unrelated literal and multiline-template sourceMappingURL text exactly', async t => {
  const unrelated = 'window.other = "//# sourceMappingURL=literal";\nwindow.template = `\n//# sourceMappingURL=template-data\n`;\n';
  const c = carrier({ body: unrelated + native }); t.after(() => c.root.fiber.dispose()); await mount(c);
  const route = scripts(c)[0];
  const output = await (await route.resource(new Request(`http://127.0.0.1:12964${route.path}`))).text();
  assert.ok(output.startsWith(unrelated)); new Script(output);
});

test('unrecognized combo fallback preserves even sourceMappingURL-like string bytes exactly', async t => {
  const body = 'window.other = "//# sourceMappingURL=literal";\n';
  const c = carrier({ body }); t.after(() => c.root.fiber.dispose()); await mount(c);
  const route = scripts(c)[0];
  assert.equal(await (await route.resource(new Request(`http://127.0.0.1:12964${route.path}`))).text(), body);
});

test('graph reconciliation creates current aliases and retires old aliases without touching non-owned routes', async t => {
  const c = carrier(); t.after(() => c.root.fiber.dispose()); await mount(c);
  const old = scripts(c).map(route => route.path);
  c.current.graph = { ...c.current.graph, entries: [{ id, url: layoutUrl.replace('test-native', 'next') }], batches: [] };
  for (const listener of c.observers) listener();
  assert.equal(scripts(c).length, 1); for (const path of old) assert.ok(!c.routes.has(path));
});

test('unloading removes routes, index taps and graph observers; native resources are never overwritten', async () => {
  const c = carrier(); const fiber = await mount(c);
  await fiber.dispose(); assert.equal(c.routes.size, 0); assert.equal(c.taps.size, 0); assert.equal(c.observers.size, 0);
  assert.equal(readFileSync(nativePath, 'utf8'), native);
  await c.root.fiber.dispose();
});
