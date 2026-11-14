// Test-only adapters. Load the installed native classes, never replicas of them.
import { readFileSync } from 'node:fs';
import { createRequire, stripTypeScriptTypes } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runInThisContext } from 'node:vm';

const anchor = process.env.DSH_INSTALL_DIR;
if (!anchor) throw new Error('Run native contract tests with DSH_INSTALL_DIR and the DSH Electron runtime.');
const require = createRequire(join(anchor, 'package.json'));
const cordisPath = require.resolve('@deepseek-ai/cordis');
export const { Context, Service } = await import(pathToFileURL(cordisPath).href);
const packageDir = name => dirname(require.resolve(`${name}/package.json`));
const localeDir = packageDir('@deepseek-ai/dsh-client-locale');
const version = JSON.parse(readFileSync(join(localeDir, 'package.json'), 'utf8')).version;
if (version !== '0.2.2-rc.2') throw new Error(`Native extraction is verified for 0.2.2-rc.2, not ${version}.`);

// The source owns all lookup, catalog, preference and snapshot behavior. Drop
// only imports/types and the React settings-row activation, which is not shipped
// with a Node-loadable test runtime in Desktop. Do not change class methods.
const localeSource = readFileSync(join(localeDir, 'src/client/index.ts'), 'utf8');
const settingsSource = readFileSync(join(localeDir, 'src/locale-settings.ts'), 'utf8');
const constants = settingsSource.slice(settingsSource.indexOf('export const LOCALE_SETTINGS_NAMESPACE'), settingsSource.indexOf('/** Baseline locale required'));
const core = localeSource.slice(localeSource.indexOf('export const FALLBACK_LOCALE'), localeSource.indexOf('/** Required services:'));
const nativeJS = stripTypeScriptTypes(`${constants}\n${core}`, { mode: 'transform' }).replace(/^export /gm, '');
export const LocaleRuntime = runInThisContext(`(function () { ${nativeJS}\nreturn LocaleRuntime; })()`, { filename: 'installed-locale-core.js' });

const inspectSource = readFileSync(join(packageDir('@deepseek-ai/dsh-cordis-client-runner'), 'src/client/inspect-registry.ts'), 'utf8');
const inspectJS = stripTypeScriptTypes(inspectSource, { mode: 'transform' }).replace(/^export /gm, '');
export const ClientCordisInspectRegistry = runInThisContext(`(function () { ${inspectJS}\nreturn ClientCordisInspectRegistry; })()`, { filename: 'installed-inspect-registry.js' });

// A service-boundary fixture, NOT a renderer or DOM emulator. Native Cordis
// supplies caller scoping and effect disposal. Native SlotRegistry is not
// separately shipped with its SlotCore Node dependency in Desktop.
class SlotBoundary extends Service {
  entries = new Map();
  controllers = new Set();
  declared = true;
  constructor(ctx) { super(ctx, 'slots'); }
  register(options, component) {
    const key = `${options.name}:${options.id}`;
    if (this.entries.has(key)) throw new Error(`occupied slot entry ${key}`);
    const entry = { options, component };
    return this.ctx.effect(() => {
      this.entries.set(key, entry);
      return () => { if (this.entries.get(key) === entry) this.entries.delete(key); };
    });
  }
  inject(key, callback) {
    const ctx = this.ctx;
    return ctx.effect(() => {
      const controller = { key, dispose: undefined, mount() { this.dispose = ctx.effect(callback); } };
      this.controllers.add(controller);
      if (this.declared) controller.mount();
      return () => { controller.dispose?.(); this.controllers.delete(controller); };
    });
  }
  setDeclared(value) {
    this.declared = value;
    for (const controller of this.controllers) {
      if (value) controller.mount();
      else { controller.dispose?.(); controller.dispose = undefined; }
    }
  }
}

export function createNativeRuntime({ preference = null, languages = ['en'], inspect = false } = {}) {
  const root = new Context();
  const locale = new LocaleRuntime(root, undefined, { preference, languages });
  root.provide('locale', locale);
  locale.register('common', { en: { cancel: 'Cancel', close: 'Close' }, zh: { cancel: '取消', close: '关闭' } });
  locale.register('test.feature', { en: { title: 'Hello {name}', missing: 'Fallback' }, zh: { title: '你好 {name}', missing: '回退' } });
  const slots = new SlotBoundary(root);
  const resolutions = [];
  const manifests = [];
  const registry = inspect ? new ClientCordisInspectRegistry({
    async sync(value) { manifests.push(value); },
    async resolve(agentId, requestId, resolution) { resolutions.push({ agentId, requestId, resolution }); },
  }) : undefined;
  if (registry) root.provide('cordisInspect', registry);
  return { root, locale, slots, registry, resolutions, manifests };
}

export async function mountArabic(runtime, applyArabic, catalog, component = () => null) {
  const fiber = runtime.root.plugin({ inject: ['locale', 'slots'], apply(ctx) { applyArabic(ctx, catalog, component); } });
  await fiber.await();
  return fiber;
}

export async function queryStatus(runtime, requestId = 'arabic-status') {
  await runtime.registry.query({ provider: '@local/dsh-arabic-ui', method: 'status', input: {}, agentId: 'test-session', requestId });
  return runtime.resolutions.at(-1).resolution;
}
