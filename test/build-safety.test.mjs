import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { Script } from 'node:vm';
import { createNativeRuntime, mountArabic } from './native-runtime.mjs';

 test('generated dictionaries remain literal data even when a translation contains markup or JavaScript separators', async t => {
  const { buildClient } = await import('../scripts/build-client.mjs');
  const source = readFileSync(new URL('../src/runtime.js', import.meta.url), 'utf8');
  const value = '</script><script>throw new Error("never executes")</script>\u2028\u2029';
  const catalog = { 'test.safety': { html: value } };
  const artifact = buildClient({ source, catalog });
  assert.doesNotMatch(artifact, /<\/script>|[\u2028\u2029]/);
  const registrations = [];
  new Script(artifact).runInNewContext({ window: { __ModuleLoader__: { load(value) { registrations.push(value); } } } });
  const plugin = registrations[0].factory(name => { assert.equal(name, 'react'); return { createElement() { throw new Error('not rendering'); } }; });
  const runtime = createNativeRuntime({ preference: 'ar' });
  t.after(() => runtime.root.fiber.dispose());
  await mountArabic(runtime, ctx => plugin.apply(ctx), catalog);
  assert.equal(runtime.locale.bind('test.safety')('html'), value);
 });

 test('empty catalog still provides a selectable native language and owned style', async t => {
  const { applyArabic, getArabicStatus } = await import('../src/runtime.js');
  const runtime = createNativeRuntime();
  t.after(() => runtime.root.fiber.dispose());
  await mountArabic(runtime, applyArabic, {});
  runtime.locale.setLocale('ar');
  const status = getArabicStatus(runtime.locale, {});
  assert.equal(status.keyCount, 0);
  assert.equal(status.matchedCount, 0);
  assert.equal(status.namespaceCount, 0);
  assert.deepEqual(status.mismatches, []);
  assert.equal(runtime.slots.entries.size, 1);
 });

 test('style registration waits without touching the app until shell.overlay is declared', async t => {
  const { applyArabic } = await import('../src/runtime.js');
  const runtime = createNativeRuntime();
  t.after(() => runtime.root.fiber.dispose());
  runtime.slots.setDeclared(false);
  const fiber = await mountArabic(runtime, applyArabic, { common: { cancel: 'إلغاء' } });
  assert.equal(runtime.slots.entries.size, 0);
  assert.equal(runtime.slots.controllers.size, 1);
  runtime.slots.setDeclared(true);
  assert.equal(runtime.slots.entries.size, 1);
  await fiber.dispose();
  assert.equal(runtime.slots.entries.size, 0);
 });

 test('unloading while the slot is absent retires the waiting injection', async t => {
  const { applyArabic } = await import('../src/runtime.js');
  const runtime = createNativeRuntime();
  t.after(() => runtime.root.fiber.dispose());
  runtime.slots.setDeclared(false);
  const fiber = await mountArabic(runtime, applyArabic, {});
  await fiber.dispose();
  runtime.slots.setDeclared(true);
  assert.equal(runtime.slots.entries.size, 0);
  assert.equal(runtime.slots.controllers.size, 0);
 });
