import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { Script } from 'node:vm';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { createNativeRuntime, mountArabic } from './native-runtime.mjs';

const require = createRequire(join(process.env.DSH_INSTALL_DIR, 'package.json'));
const yaml = require('js-yaml');
const semver = require('semver');
const read = relative => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');
const json = relative => JSON.parse(read(relative));

 test('manifest publishes a dependency-free installable bundle compatible with the tested prerelease', () => {
  const manifest = json('package.json');
  assert.equal(manifest.name, '@local/dsh-arabic-ui');
  assert.equal(manifest.type, 'module');
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
  assert.equal(manifest.dsh.client.platform, 'web');
  assert.equal(manifest.dsh.client.immediately, true);
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-locale'));
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-layout'));
  assert.equal(manifest.exports['.'], './index.js');
  assert.equal(manifest.exports['./client'], './client.js');
  assert.equal(manifest.exports['./locale/*.json'], './locale/*.json');
  assert.equal(manifest.exports['./icon'], './icon.svg');
  assert.equal(semver.satisfies('0.2.2-rc.2', manifest.engines.dsh), true);
  assert.equal(semver.satisfies('0.2.1', manifest.engines.dsh), false);
  for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies', 'devDependencies']) assert.deepEqual(manifest[field] ?? {}, {});
  for (const script of ['preinstall', 'install', 'postinstall', 'prepare']) assert.equal(manifest.scripts?.[script], undefined);
  for (const resource of ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'README.md', 'src', 'dictionaries', 'scripts', 'locale/*.json']) assert.ok(manifest.files.includes(resource), resource);
 });

 test('bundle selects Arabic at the lower-priority bundle layer and never writes the preference from Client code', () => {
  const patch = yaml.load(read('cordis.patch.yml'));
  assert.ok(patch.some(item => item.insert?.some(row => row.id === 'dsh-arabic-ui' && row.name === '@local/dsh-arabic-ui')));
  assert.deepEqual(patch.find(item => item.id === 'locale'), { id: 'locale', name: '@deepseek-ai/dsh-client-locale', config: { preference: 'ar' } });
  assert.doesNotMatch(read('src/runtime.js'), /\.setLocale\s*\(/);
 });

 test('the Host uses declared carrier services and locales have truthful localized metadata', async () => {
  const host = await import('../index.js');
  assert.equal(typeof host.apply, 'function');
  assert.deepEqual(host.inject, ['webServer', 'clientModules']);
  for (const locale of ['en', 'ar', 'zh']) {
    const value = json(`locale/${locale}.json`);
    assert.equal(typeof value.meta.title, 'string');
    assert.ok(value.meta.title.trim());
    assert.equal(typeof value.meta.description, 'string');
    assert.ok(value.meta.description.length > 40);
    assert.equal(value.meta.detail, undefined);
  }
  assert.match(json('locale/ar.json').meta.title, /[\u0600-\u06ff]/);
  assert.match(json('locale/zh.json').meta.title, /[\u4e00-\u9fff]/);
 });

 test('icon is original self-contained 36-pixel SVG geometry without a background tile or text nodes', () => {
  const icon = read('icon.svg');
  assert.match(icon, /<svg[^>]*width="36"[^>]*height="36"[^>]*viewBox="0 0 36 36"/);
  assert.match(icon, /<path\b/);
  assert.doesNotMatch(icon, /<\s*(text|script|style|image|foreignObject|animate)\b|\son\w+=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
  assert.ok(Buffer.byteLength(icon) < 256 * 1024);
 });

 test('generated Client is self-contained, lazy, service-gated and uses only the shared React identity', async t => {
  const artifact = read('client.js');
  const registrations = [];
  new Script(artifact, { filename: 'client.js' }).runInNewContext({ window: { __ModuleLoader__: { load(value) { registrations.push(value); } } } });
  assert.equal(registrations.length, 1);
  const registration = registrations[0];
  assert.equal(registration.id, '@local/dsh-arabic-ui');
  assert.equal(typeof registration.factory, 'function');
  const requests = [];
  const react = { createElement() { throw new Error('A component must not render while its lazy factory materializes.'); } };
  const plugin = registration.factory(name => { requests.push(name); assert.equal(name, 'react'); return react; });
  assert.deepEqual(Array.from(plugin.inject), ['locale', 'slots']);
  assert.deepEqual(requests, ['react']);
  assert.equal(typeof plugin.apply, 'function');
  assert.doesNotMatch(read('src/runtime.js'), /\bfetch\s*\(|MutationObserver|querySelector|document\.body|textContent|innerHTML|localStorage|@deepseek-ai\/dsh-client[^'"`]*['"`]\s*\)/);
  const runtime = createNativeRuntime({ preference: 'ar' });
  t.after(() => runtime.root.fiber.dispose());
  const catalog = json('dictionaries/ar.json');
  const fiber = await mountArabic(runtime, ctx => plugin.apply(ctx), catalog);
  for (const [namespace, entries] of Object.entries(catalog)) {
    const translate = runtime.locale.bind(namespace);
    for (const [key, value] of Object.entries(entries)) assert.equal(translate(key), value, `${namespace}.${key}`);
  }
  await fiber.dispose();
  assert.equal(runtime.slots.entries.size, 0);
 });

 test('build regeneration is deterministic and inlines the current authored source and catalog without browser fetches', async () => {
  const { buildClient } = await import('../scripts/build-client.mjs');
  const first = buildClient({ source: read('src/runtime.js'), catalog: json('dictionaries/ar.json') });
  const second = buildClient({ source: read('src/runtime.js'), catalog: json('dictionaries/ar.json') });
  assert.equal(first, second);
  assert.equal(first, read('client.js'));
  assert.doesNotMatch(first, /\bimport\s|\bexport\s|\bfetch\s*\(/);
 });

 test('catalog has exact English key sets, no invisible separators and identical placeholder names', () => {
  const arabic = json('dictionaries/ar.json');
  const english = json('test/fixtures/english.json');
  assert.deepEqual(Object.keys(arabic).sort(), Object.keys(english).sort());
  assert.ok(Object.keys(arabic).length >= 30);
  const placeholders = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const [namespace, entries] of Object.entries(english)) {
    assert.deepEqual(Object.keys(arabic[namespace]).sort(), Object.keys(entries).sort(), namespace);
    for (const [key, value] of Object.entries(entries)) {
      assert.equal(typeof arabic[namespace][key], 'string', `${namespace}.${key}`);
      assert.doesNotMatch(arabic[namespace][key], /[\u200b\ufeff]/, `${namespace}.${key}`);
      assert.deepEqual(placeholders(arabic[namespace][key]), placeholders(value), `${namespace}.${key}`);
    }
  }
 });

 test('RTL is language-bound, preserves shell drag coordinates and isolates technical and original paragraph content', async () => {
  const { ARABIC_STYLES } = await import('../src/runtime.js');
  assert.match(ARABIC_STYLES, /:root:lang\(ar\)\s*\{[^}]*direction:\s*ltr/);
  assert.match(ARABIC_STYLES, /:has\(>\s*\[data-shell-overlay\]\)\s*\{[^}]*direction:\s*ltr/);
  assert.match(ARABIC_STYLES, /:has\(>\s*\[data-shell-overlay\]\)\s*>\s*div:not\(:where\([^)]*\)\)\)\s*\{[^}]*direction:\s*rtl/);
  for (const selector of ['pre', 'code', '.monaco-editor', '.cm-editor', '.xterm', 'textarea', 'input[type="url"]', 'input[type="email"]', 'input[type="password"]']) assert.ok(ARABIC_STYLES.includes(selector), selector);
  assert.match(ARABIC_STYLES, /unicode-bidi:\s*plaintext/);
  assert.match(ARABIC_STYLES, /text-align:\s*start/);
  assert.doesNotMatch(ARABIC_STYLES, /font-family|font-size|position:\s*fixed|!important|transform|z-index|\.[\w-]+_[\w-]+/);
 });
