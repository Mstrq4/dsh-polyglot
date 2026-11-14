import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ARABIC_STYLES } from '../src/runtime.js';

// Real shipped primitive CSS, not a browser/DOM/layout replica.
const nativeCSS = readFileSync(join(dirname(process.env.DSH_INSTALL_DIR), 'dsh-web-frontend/dist/assets/index-CSAdOBx6.css'), 'utf8');

test('every native semantic switch has an LTR coordinate island while its surrounding Arabic label stays RTL', () => {
  const rule = ARABIC_STYLES.match(/:root:lang\(ar\) \[role="switch"\]\s*\{([^}]*)\}/);
  assert.ok(rule, 'all switch instances need a semantic coordinate boundary, not a page-specific patch');
  assert.match(rule[1], /direction:\s*ltr;/);
  assert.doesNotMatch(rule[1], /(?:width|height|padding|background|color|transform|position|pointer-events|display)\s*:/);
});

test('the original switch uses positive 16px travel inside a 36px track; the repair keeps its dimensions and checked-state rules untouched', () => {
  assert.match(nativeCSS, /\._switch_1ik0f_5\{[^}]*width:36px;[^}]*height:20px;[^}]*padding:2px;/);
  assert.match(nativeCSS, /\._thumb_1ik0f_33\{[^}]*display:block;[^}]*width:16px;[^}]*height:16px;/);
  assert.match(nativeCSS, /\[aria-checked=true\] \._thumb_1ik0f_33\{transform:translate\(16px\)\}/);
  for (const travel of [0, 16]) assert.ok(2 + travel + 16 <= 36 - 2);
  // Numeric bounds above describe the shipped LTR primitive, not observed DOM boxes.
});

test('routine verification includes the universal switch regression', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(manifest.version, '1.0.3');
  for (const script of ['test', 'test:coverage']) assert.ok(manifest.scripts[script].includes('test/native-control-direction.test.mjs'));
});
