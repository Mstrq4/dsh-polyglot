import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createNativeRuntime, mountArabic, queryStatus } from './native-runtime.mjs';

const getCatalog = () => ({ common: { cancel: 'إلغاء', close: 'إغلاق' }, 'test.feature': { title: 'مرحبًا {name}' } });
const production = () => import('../src/runtime.js');

 test('adds Arabic and namespace dictionaries without overwriting an explicit English preference', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime({ preference: 'en', languages: ['ar-SA', 'en'] });
  t.after(() => runtime.root.fiber.dispose());
  const before = runtime.locale.getSnapshot().revision;
  const fiber = await mountArabic(runtime, applyArabic, getCatalog());
  assert.equal(runtime.locale.getLocale().active, 'en');
  assert.deepEqual(runtime.locale.getLocale().locales.find(value => value.id === 'ar'), { id: 'ar', label: 'العربية', fallback: 'en' });
  assert.ok(runtime.locale.getSnapshot().revision > before);
  runtime.locale.setLocale('ar');
  assert.equal(runtime.locale.bind('common')('cancel'), 'إلغاء');
  assert.equal(runtime.locale.bind('test.feature')('title', { name: 'Sami' }), 'مرحبًا Sami');
  assert.equal(runtime.locale.bind('test.feature')('missing'), 'Fallback');
  assert.equal(runtime.locale.bind('test.feature')('close'), 'إغلاق');
  assert.equal(runtime.locale.bind('test.feature')('unregistered-key'), 'unregistered-key');
  await fiber.dispose();
  assert.equal(runtime.locale.getLocale().active, 'en');
  assert.equal(runtime.locale.getLocale().locales.some(value => value.id === 'ar'), false);
 });

 test('native provisional language selection recognizes Arabic once its definition arrives', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime({ languages: ['ar-SA', 'en'] });
  t.after(() => runtime.root.fiber.dispose());
  assert.equal(runtime.locale.getLocale().active, 'en');
  await mountArabic(runtime, applyArabic, getCatalog());
  assert.equal(runtime.locale.getLocale().active, 'ar');
 });

 test('user language switches survive disable, re-enable and plugin restart', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime({ preference: 'ar', languages: ['en'] });
  t.after(() => runtime.root.fiber.dispose());
  const first = await mountArabic(runtime, applyArabic, getCatalog());
  assert.equal(runtime.locale.getLocale().active, 'ar');
  runtime.locale.setLocale('en');
  await first.restart();
  assert.equal(runtime.locale.getLocale().active, 'en');
  await first.dispose();
  const second = await mountArabic(runtime, applyArabic, getCatalog());
  assert.equal(runtime.locale.getLocale().active, 'en');
  assert.equal(runtime.slots.entries.size, 1);
  await second.dispose();
  assert.equal(runtime.slots.entries.size, 0);
  assert.equal(runtime.slots.controllers.size, 0);
 });

 test('unloading removes every dictionary and active Arabic selection without changing other language owners', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime({ preference: 'ar' });
  t.after(() => runtime.root.fiber.dispose());
  const snapshots = [];
  const stop = runtime.locale.subscribe(() => snapshots.push(runtime.locale.getSnapshot()));
  const fiber = await mountArabic(runtime, applyArabic, getCatalog());
  assert.equal(runtime.locale.bind('test.feature')('title'), 'مرحبًا {name}');
  await fiber.dispose();
  await fiber.dispose();
  assert.equal(runtime.locale.getLocale().active, 'en');
  assert.equal(runtime.locale.bind('common')('cancel'), 'Cancel');
  const removeLanguage = runtime.locale.addLanguage({ id: 'ar', label: 'other Arabic owner', fallback: 'en' });
  runtime.locale.setLocale('ar');
  assert.equal(runtime.locale.bind('test.feature')('title'), 'Hello {name}');
  const removeDictionary = runtime.locale.register('common', 'ar', { cancel: 'another owner' });
  assert.equal(runtime.locale.bind('common')('cancel'), 'another owner');
  assert.ok(snapshots.length >= 6);
  stop();
  removeDictionary();
  removeLanguage();
 });

 test('slot collapse removes the owned style registration and reinstalls it only when shell.overlay returns', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime();
  t.after(() => runtime.root.fiber.dispose());
  const Style = () => null;
  const fiber = await mountArabic(runtime, applyArabic, getCatalog(), Style);
  const entry = [...runtime.slots.entries.values()][0];
  assert.equal(entry.options.name, 'shell.overlay');
  assert.equal(entry.options.id, 'dsh-arabic-ui.styles');
  assert.equal(entry.component, Style);
  assert.equal(runtime.slots.entries.size, 1);
  runtime.slots.setDeclared(false);
  assert.equal(runtime.slots.entries.size, 0);
  runtime.slots.setDeclared(true);
  assert.equal(runtime.slots.entries.size, 1);
  runtime.locale.setLocale('ar');
  assert.equal(runtime.slots.entries.size, 1);
  await fiber.dispose();
  runtime.slots.setDeclared(false);
  runtime.slots.setDeclared(true);
  assert.equal(runtime.slots.entries.size, 0);
 });

 test('duplicate Arabic ownership fails safely and does not remove an existing language', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime();
  t.after(() => runtime.root.fiber.dispose());
  runtime.locale.addLanguage({ id: 'ar', label: 'Existing Arabic', fallback: 'en' });
  await assert.rejects(mountArabic(runtime, applyArabic, getCatalog()), /already registered/);
  assert.equal(runtime.locale.getLocale().locales.find(value => value.id === 'ar').label, 'Existing Arabic');
  assert.equal(runtime.slots.entries.size, 0);
 });

 test('dictionary conflict rolls back only this plugin effects', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime();
  t.after(() => runtime.root.fiber.dispose());
  runtime.locale.register('test.feature', 'ar', { title: 'Existing translation' });
  await assert.rejects(mountArabic(runtime, applyArabic, getCatalog()), /already has locale/);
  assert.equal(runtime.locale.getLocale().locales.some(value => value.id === 'ar'), false);
  const removeLanguage = runtime.locale.addLanguage({ id: 'ar', label: 'Other Arabic', fallback: 'en' });
  runtime.locale.setLocale('ar');
  assert.equal(runtime.locale.bind('test.feature')('title'), 'Existing translation');
  assert.equal(runtime.locale.bind('common')('cancel'), 'Cancel');
  removeLanguage();
 });

 test('optional read-only status verifies every registered key and is removed on unload', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime({ preference: 'ar', inspect: true });
  t.after(() => runtime.root.fiber.dispose());
  const fiber = await mountArabic(runtime, applyArabic, getCatalog());
  const before = runtime.locale.getSnapshot();
  const status = await queryStatus(runtime);
  assert.equal(status.ok, true);
  assert.equal(status.data.active, 'ar');
   assert.equal(status.data.layoutRevision, '1.0.3');
   assert.equal(status.data.nativeLayout, false);
   assert.equal(status.data.nativeRows, false);
   assert.equal(status.data.carrier, 'unknown');
  assert.equal(status.data.namespaceCount, 2);
  assert.equal(status.data.keyCount, 3);
  assert.equal(status.data.matchedCount, 3);
  assert.deepEqual(status.data.mismatches, []);
  assert.equal(runtime.locale.getSnapshot(), before);
  runtime.locale.setLocale('en');
  const english = await queryStatus(runtime, 'english-status');
  assert.equal(english.data.active, 'en');
  assert.equal(english.data.matchedCount, 0);
  assert.equal(english.data.mismatches.length, 3);
  await fiber.dispose();
  const unloaded = await queryStatus(runtime, 'disabled-status');
  assert.equal(unloaded.ok, false);
  assert.equal(unloaded.reason, 'provider-missing');
 });

 test('read-only status caps mismatch details while retaining exact catalog totals', async t => {
  const { applyArabic } = await production();
  const runtime = createNativeRuntime({ inspect: true });
  t.after(() => runtime.root.fiber.dispose());
  const catalog = { 'test.many': Object.fromEntries(Array.from({ length: 25 }, (_, index) => [`key${index}`, `عربي ${index}`])) };
  await mountArabic(runtime, applyArabic, catalog);
  const status = await queryStatus(runtime);
  assert.equal(status.data.keyCount, 25);
  assert.equal(status.data.matchedCount, 0);
  assert.equal(status.data.mismatches.length, 20);
 });
