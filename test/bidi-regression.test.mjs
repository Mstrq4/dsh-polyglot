import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { ARABIC_STYLES } from '../src/runtime.js';

 test('revealed API-key fields retain left-to-right isolation through their autocomplete semantic hint', () => {
  assert.match(ARABIC_STYLES, /:root:lang\(ar\)\s*:where\([^)]*input\[autocomplete="new-password"\][^)]*\)\s*\{[^}]*direction:\s*ltr;[^}]*unicode-bidi:\s*isolate;/);
 });

 test('ordinary text and search fields use first-strong bidi, preserving Arabic names and Latin URLs without forcing all fields LTR', () => {
  assert.match(ARABIC_STYLES, /:root:lang\(ar\)\s*:where\([^)]*input\[type="text"\][^)]*input\[type="search"\][^)]*\)\s*\{[^}]*unicode-bidi:\s*plaintext;[^}]*text-align:\s*start;/);
  assert.doesNotMatch(ARABIC_STYLES, /:where\([^)]*input\[type="text"\][^)]*\)\s*\{[^}]*direction:\s*ltr/);
 });

 test('test verification never imports the mutating build CLI or writes the installed artifact', () => {
  const distribution = readFileSync(new URL('./distribution.test.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(distribution, /import\(['"]\.\.\/scripts\/build\.mjs['"]\)|writeFile|writeFileSync/);
 });

 test('English and Arabic metadata disclose the saved-preference exception to initial Arabic selection', () => {
  const readLocale = id => JSON.parse(readFileSync(new URL(`../locale/${id}.json`, import.meta.url), 'utf8'));
  assert.match(readLocale('ar').meta.description, /ما لم يكن لديك اختيار لغة محفوظ/);
  assert.match(readLocale('en').meta.description, /unless.*saved.*preference/i);
 });
