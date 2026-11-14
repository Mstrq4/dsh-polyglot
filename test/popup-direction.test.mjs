import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { ARABIC_STYLES } from '../src/runtime.js';

test('the repair ships as an explicit patch generation and keeps direction tests in normal verification', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(manifest.version, '1.0.3');
  assert.ok(manifest.scripts.test.includes('test/popup-direction.test.mjs'));
  assert.ok(manifest.scripts['test:coverage'].includes('test/popup-direction.test.mjs'));
});

// Source-contract regressions, NOT a browser renderer or proof of placement.
// The shipped Menu combines anchor(left/right) with justify-self start/end.
// Keeping its coordinate box LTR prevents Arabic inheritance reversing those.
const css = ARABIC_STYLES.replace(/\/\*[\s\S]*?\*\//g, '');

test('Arabic does not reverse the physical document coordinate system used by native portals', () => {
  assert.match(css, /:root:lang\(ar\)\s*\{\s*direction:\s*ltr;/);
  assert.doesNotMatch(css, /:has\(>\s*\[data-shell-overlay\]\)\s*>\s*\*\s*\{/);
});

test('frame-local RTL excludes overlay, chrome, rightbar coordinate column and resize hit areas', () => {
  assert.match(css, /:has\(> \[data-shell-overlay\]\) > div:not\(:where\([^)]*\[data-shell-overlay\][^)]*\[data-shell-leading\][^)]*\[data-shell-bottom\][^)]*\[data-rightbar-col\][^)]*\[data-sidebar-mask\][^)]*\[data-side\][^)]*\)\)\)\s*\{[^}]*direction:\s*rtl;/);
  assert.match(css, /:where\([^)]*\[data-sidebar-right-panel\][^)]*\[role="tablist"\][^)]*\)\s*\{[^}]*direction:\s*ltr;/);
});

test('menu material and backing preserve native anchor bounds while visible menu contents get RTL', () => {
  assert.match(css, /:where\([^)]*\[data-menu-material\][^)]*\[data-menu-backing\][^)]*\)\s*\{[^}]*direction:\s*ltr;/);
  assert.match(css, /\[data-menu-material\] > :not\(\[aria-hidden="true"\][^)]*\)\)\s*\{[^}]*direction:\s*rtl;[^}]*text-align:\s*start;/);
  assert.match(css, /:where\([^)]*\[role="menuitem"\][^)]*\[role="menuitemradio"\][^)]*\[role="menuitemcheckbox"\][^)]*\)\s*\{[^}]*direction:\s*rtl;[^}]*text-align:\s*start;/);
  assert.doesNotMatch(css, /(?:^|[;{])\s*(?:left|right|top|bottom|position|transform|z-index|position-try-fallbacks)\s*:/m);
});

test('dialog content and technical exceptions adapt independently without changing centering or native handlers', () => {
  assert.match(css, /:where\([^)]*\[role="dialog"\][^)]*\[role="alertdialog"\][^)]*\)\s*\{[^}]*direction:\s*rtl;[^}]*text-align:\s*start;/);
  assert.match(css, /\[dir="ltr"\]\s*\{[^}]*direction:\s*ltr;/);
  assert.match(css, /\[data-model-id\]\s*\{[^}]*unicode-bidi:\s*isolate;/);
});

test('broad Arabic content selectors cannot outrank explicit LTR islands or later technical-field exceptions', () => {
  assert.match(css, /:root:lang\(ar\) :where\(:has\(> \[data-shell-overlay\]\) > div:not\(:where\([^)]*\)\)\)\s*\{/);
  assert.match(css, /:root:lang\(ar\) :where\(\[data-menu-material\] > :not\(\[aria-hidden="true"\], \[data-menu-material\], \[data-menu-backing\], \[data-submenu-layout\]\)\)\s*\{/);
  assert.ok(css.indexOf('input[autocomplete="new-password"]') > css.indexOf('[data-menu-material] >'));
  assert.match(css, /:root:lang\(ar\) :where\(button\[aria-haspopup="menu"\]\)\s*\{/);
});

test('all repair rules are Arabic-only and introduce no theme, size, icon or motion redesign', () => {
  const ruleHeaders = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim());
  assert.ok(ruleHeaders.length > 5);
  for (const header of ruleHeaders) assert.ok(header.startsWith(':root:lang(ar)'), header);
  assert.doesNotMatch(css, /!important|font-family|font-size|animation|transition|\.[\w-]+_[\w-]+/);
});
