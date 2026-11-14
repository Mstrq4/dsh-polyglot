import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as runtime from '../src/runtime.js';
import { buildClient } from '../scripts/build-client.mjs';
import { readFileSync } from 'node:fs';

test('Host enables the public native carrier bridge rather than replacing root or overwriting native assets', async () => {
  const host = await import('../index.js');
  assert.deepEqual(host.inject, ['webServer', 'clientModules']);
  const text = readFileSync(new URL('../index.js', import.meta.url), 'utf8');
  assert.match(text, /applyNativeBridge\(ctx\)/);
});

test('the installed generation includes both native and requested layout tests in routine verification', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(manifest.version, '1.0.3');
  for (const script of ['test', 'test:coverage']) for (const name of ['native-frame-bridge', 'requested-layout']) assert.ok(manifest.scripts[script].includes(`test/${name}.test.mjs`));
});

// Exported styles are source contracts; these tests do not simulate a browser.
test('send remains at the physical left edge of RTL wrapped toolbar without a competing physical auto margin', () => {
  assert.match(runtime.ARABIC_REFINEMENTS, /\[data-composer-card\] > div:last-child\s*\{[^}]*direction:\s*rtl;/);
  assert.match(runtime.ARABIC_REFINEMENTS, /\[data-composer-card\] > div:last-child > div:last-child\s*\{[^}]*direction:\s*rtl;[^}]*margin-inline:\s*0;[^}]*margin-inline-start:\s*auto;/);
});

test('expanded sidebar and settings rows put their glyph at the left and allow label to fill the right', () => {
  assert.ok(runtime.ARABIC_REFINEMENTS.includes('[data-sidebar-scrollport] > nav button:has(> span[aria-hidden="true"] + span)'));
  assert.ok(runtime.ARABIC_REFINEMENTS.includes('[data-shortcut-modal="settings"] > nav > div > button'));
  assert.match(runtime.ARABIC_REFINEMENTS, /flex-direction:\s*row-reverse;/);
  assert.match(runtime.ARABIC_REFINEMENTS, /span:last-child\s*\{[^}]*flex:\s*1;[^}]*min-inline-size:\s*0;[^}]*text-align:\s*start;/);
});

test('native-enabled shell mirrors grid tracks, positions the tools panel left and preserves LTR inner dock geometry', () => {
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /:has\(> \[data-shell-overlay\]\)\s*\{[^}]*direction:\s*rtl;/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /\[data-sidebar-right-panel\]\s*\{[^}]*direction:\s*rtl;[^}]*inset-inline-start:\s*auto;[^}]*inset-inline-end:\s*0;/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /\[data-sidebar-right-panel\] > div\s*\{[^}]*direction:\s*ltr;/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /\[data-side\]\s*\{[^}]*margin-inline-start:\s*-4px;[^}]*margin-inline-end:\s*0;/);
  const frame = runtime.ARABIC_MIRRORED_STYLES.match(/:root:lang\(ar\) :has\(> \[data-shell-overlay\]\)\s*\{([^}]*)\}/)[1];
  assert.doesNotMatch(frame, /transform|scaleX/); // targeted icon flips are not frame transforms
});

test('drawer and docked items slide outward on their new edges, without flipping fixed floating panels', () => {
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /translateX\(100%\)/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /\[data-dockkit-host="dock"\]/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /translateX\(calc\(-1 \* var\(--dsh-sidebar-width\)\)\)/);
  assert.doesNotMatch(runtime.ARABIC_MIRRORED_STYLES, /\[data-dockkit-float\][^{]*\{[^}]*transform/);
});

test('new-session glyph and label occupy opposite edges of their evidenced full-width wrapper', () => {
  assert.ok(runtime.ARABIC_REFINEMENTS.includes('button span:has(> svg + span)'));
  assert.match(runtime.ARABIC_REFINEMENTS, /justify-content:\s*space-between;/);
  assert.match(runtime.ARABIC_REFINEMENTS, /max-inline-size:\s*none;/);
});

test('caption-adjacent toggle moves into the right content edge while native English caption controls stay untouched', () => {
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /:root:lang\(ar\)\[data-windows-titlebar\][^{]*\[data-window-drag\] > button\[data-sidebar-toggle\]\s*\{[^}]*direction:\s*rtl;[^}]*inset-inline-start:\s*12px;[^}]*inset-inline-end:\s*auto;[^}]*top:\s*calc\(var\(--dsh-windows-titlebar-height\) \+ 6px\);/);
  assert.ok(runtime.ARABIC_MIRRORED_STYLES.includes('--dsh-frame-leading-clearance: 48px'));
  assert.doesNotMatch(runtime.ARABIC_MIRRORED_STYLES, /(?:data-window-(?:close|minimize|maximize)|data-windows-menu)[^{]*\{/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /> \[data-shell-leading\]\s*\{[^}]*direction:\s*rtl;[^}]*inset-inline-start:\s*12px;[^}]*inset-inline-end:\s*auto;/);
});

test('conversation tab parent aligns its LTR strip left rather than just changing text direction inside a right-aligned cluster', () => {
  assert.match(runtime.ARABIC_REFINEMENTS, /> div:has\(\[role="tablist"\]\)\s*\{[^}]*direction:\s*ltr;/);
});

test('header corner uses original logical 8px / -16px spacing and blank-header auto margin on its new left edge', () => {
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /div:has\(> \[data-sidebar-right-expand\]\)\s*\{[^}]*direction:\s*rtl;[^}]*margin-inline:\s*0;[^}]*margin-inline-start:\s*8px;[^}]*margin-inline-end:\s*-16px;/);
  assert.match(runtime.ARABIC_MIRRORED_STYLES, /:not\(:has\(\[role="tablist"\]\)\)[^{]*\{[^}]*margin-inline-start:\s*auto;/);
});

test('workspace/session icons move left and labels fill right only with paired RTL-aware native marquee code', () => {
  assert.match(runtime.ARABIC_ROWS_STYLES, /\[data-row-key\^="workspace:"\][^{]*\{[^}]*direction:\s*rtl;[^}]*flex-direction:\s*row-reverse;/);
  assert.match(runtime.ARABIC_ROWS_STYLES, /\[data-row-key\^="session:"\][^}]*span:nth-child\(2\)[^{]*\{[^}]*direction:\s*rtl;[^}]*text-align:\s*start;/);
  const generated = buildClient({ source: readFileSync(new URL('../src/runtime.js', import.meta.url), 'utf8'), catalog: {} });
  assert.ok(generated.includes("window.__DSH_ARABIC_NATIVE_ROWS__ === '1.0.2'"));
  assert.ok(generated.includes("nativeState().nativeRows ? ARABIC_ROWS_STYLES : ''"));
});

test('plugin card heads put text right, independent controls inward-left, and artwork at the far-left edge', () => {
  const css = runtime.ARABIC_CARD_STYLES;
  assert.match(css, /:is\(\[data-plugin-item\], \[data-plugin-package\]\) > div:first-child\s*\{[^}]*direction:\s*rtl;[^}]*flex-direction:\s*row;/);
  assert.match(css, /> div:nth-child\(2\)\s*\{[^}]*order:\s*0;[^}]*text-align:\s*start;/);
  assert.match(css, /> span\[aria-hidden="true"\]:first-child\s*\{[^}]*order:\s*2;/);
  assert.match(css, /> div:nth-child\(3\)\s*\{[^}]*order:\s*1;/);
  assert.doesNotMatch(css, /(?:z-index|position|pointer-events|background|color|font-size|transform)\s*:/);
});

test('component rows keep their native switches/state controls independent of left-edge artwork and preserve title hitboxes', () => {
  const css = runtime.ARABIC_CARD_STYLES;
  assert.match(css, /\[data-plugin-row\] > div:first-child > span\[aria-hidden="true"\]:first-child\s*\{[^}]*order:\s*3;/);
  assert.match(css, /\[data-plugin-row\] > div:first-child > \[role="switch"\]\s*\{[^}]*order:\s*2;/);
  assert.ok(css.includes('[data-plugin-panel]'));
  const generated = buildClient({ source: readFileSync(new URL('../src/runtime.js', import.meta.url), 'utf8'), catalog: {} });
  assert.ok(generated.includes('+ ARABIC_CARD_STYLES'));
});

test('generated client enables grid mirroring only after the verified native module marker and reports it', () => {
  const generated = buildClient({ source: readFileSync(new URL('../src/runtime.js', import.meta.url), 'utf8'), catalog: {} });
  assert.ok(generated.includes("window.__DSH_ARABIC_NATIVE_LAYOUT__ === '1.0.2'"));
  assert.match(generated, /ARABIC_STYLES \+ ARABIC_REFINEMENTS \+ \(nativeState\(\)\.nativeLayout \? ARABIC_MIRRORED_STYLES : ''\)/);
  assert.match(generated, /applyArabic\(ctx, catalog, ArabicStyles, nativeState\)/);
});
