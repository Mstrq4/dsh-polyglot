/** Arabic is a native locale contribution, never a DOM translation layer. */
export const ARABIC_STYLES = `
/* The installed shell and portal anchors use a physical LTR coordinate system.
   Arabic belongs to content flow, not to the viewport or drag coordinates. */
:root:lang(ar) {
  direction: ltr;
}
:root:lang(ar) :has(> [data-shell-overlay]) {
  direction: ltr;
}
:root:lang(ar) :where(:has(> [data-shell-overlay]) > div:not(:where([data-shell-overlay], [data-shell-leading], [data-shell-bottom], [data-rightbar-col], [data-sidebar-mask], [data-side]))) {
  direction: rtl;
  text-align: start;
}
/* Docking/scroll geometry remains physical; the tab bodies carry Arabic flow. */
:root:lang(ar) :where([data-sidebar-right-panel], [role="tablist"]) {
  direction: ltr;
}
:root:lang(ar) :where([role="tabpanel"], [role="dialog"], [role="alertdialog"]) {
  direction: rtl;
  text-align: start;
}
/* Menus retain the owner's anchors, collision fallbacks, bounds and hit boxes.
   Do not reverse justify-self:start/end against unchanged anchor(left/right).
   This also protects the model MenuSurface and nested submenu portal geometry. */
:root:lang(ar) :where([data-menu-material], [data-menu-backing]) {
  direction: ltr;
}
:root:lang(ar) :where([data-menu-material] > :not([aria-hidden="true"], [data-menu-material], [data-menu-backing], [data-submenu-layout])) {
  direction: rtl;
  text-align: start;
}
:root:lang(ar) :where([role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]) {
  direction: rtl;
  text-align: start;
}
/* A menu trigger's label/icon flow is independent of its parent's geometry. */
:root:lang(ar) :where(button[aria-haspopup="menu"]) {
  direction: rtl;
  text-align: start;
}
/* Preserve model identifiers as indivisible mixed-script technical values. */
:root:lang(ar) [data-model-id] {
  unicode-bidi: isolate;
}
/* Original paragraphs choose their own base direction from their actual text. */
:root:lang(ar) :where(p, blockquote, [contenteditable="true"], textarea, input[type="text"], input[type="search"]) {
  unicode-bidi: plaintext;
  text-align: start;
}
/* Editors and technical values must not inherit the interface's direction. */
:root:lang(ar) :where(pre, code, textarea, input[type="url"], input[type="email"], input[type="password"], input[type="number"], input[autocomplete="new-password"], .monaco-editor, .cm-editor, .xterm) {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: start;
}
/* Composer content remains first-strong/automatic, even for English messages. */
:root:lang(ar) textarea:not([data-arabic-ui-technical]) {
  unicode-bidi: plaintext;
}
/* The native Switch uses a block thumb and physical positive translateX(16px).
   Isolate its coordinate box, not the surrounding Arabic label or checked state. */
:root:lang(ar) [role="switch"] {
  direction: ltr;
}
/* An explicitly marked technical island always wins over generic UI flow. */
:root:lang(ar) [dir="ltr"] {
  direction: ltr;
}
`;

/** Explicit user preference: primary action left; label right and glyph left. */
export const ARABIC_REFINEMENTS = `
:root:lang(ar) [data-composer-card] > div:last-child {
  direction: rtl;
}
:root:lang(ar) [data-composer-card] > div:last-child > div:last-child {
  direction: rtl;
  margin-inline: 0;
  margin-inline-start: auto;
}
:root:lang(ar) [data-sidebar-scrollport] > nav button:has(> span[aria-hidden="true"] + span),
:root:lang(ar) [data-shortcut-modal="settings"] > nav > div > button {
  direction: rtl;
  flex-direction: row-reverse;
}
:root:lang(ar) [data-sidebar-scrollport] > nav button:has(> span[aria-hidden="true"] + span) > span:last-child,
:root:lang(ar) [data-shortcut-modal="settings"] > nav > div > button > span:last-child {
  flex: 1;
  min-inline-size: 0;
  text-align: start;
}
:root:lang(ar) :has(> [data-shell-overlay]) > div:has([data-sidebar-toggle]) button span:has(> svg + span) {
  direction: rtl;
  flex-direction: row-reverse;
  justify-content: space-between;
  flex: 1;
  min-inline-size: 0;
}
:root:lang(ar) :has(> [data-shell-overlay]) > div:has([data-sidebar-toggle]) button span:has(> svg + span) > span:last-child {
  flex: 1;
  min-inline-size: 0;
  max-inline-size: none;
  text-align: start;
}
:root:lang(ar) header[data-window-drag]:has(> [data-conversation-header-leading]) > div:has([role="tablist"]) {
  direction: ltr;
}
`;

/** Applied ONLY after the fingerprint-verified native drag implementation loads. */
export const ARABIC_MIRRORED_STYLES = `
:root:lang(ar) :has(> [data-shell-overlay]) {
  direction: rtl;
}
:root:lang(ar) :where([data-shell-overlay], [data-shell-bottom]) {
  direction: ltr;
}
:root:lang(ar) [data-sidebar-right-panel] {
  direction: rtl;
  inset-inline-start: auto;
  inset-inline-end: 0;
}
:root:lang(ar) [data-sidebar-right-panel] > div {
  direction: ltr;
}
/* Native handle width/hit area is 8px, centered by its original -4px margin. */
:root:lang(ar) :has(> [data-shell-overlay]) > [data-side] {
  margin-inline-start: -4px;
  margin-inline-end: 0;
}
:root:lang(ar) :has(> [data-shell-overlay]) > div:has([data-sidebar-toggle]) {
  border-inline-start: 0;
  border-inline-end: 0.5px solid var(--dsw-alias-border-l3);
}
:root:lang(ar) :has(> [data-shell-overlay])[data-sidebar-drawer] > div:has([data-sidebar-toggle]) {
  inset-inline-start: 0;
  inset-inline-end: auto;
}
:root:lang(ar) :has(> [data-shell-overlay])[data-sidebar-drawer][data-sidebar-collapsed] > div:has([data-sidebar-toggle]) {
  transform: translateX(100%);
}
/* Slide only docked items. Fixed floating panels retain user-controlled geometry. */
:root:lang(ar) [data-sidebar-right-panel]:not([data-sidebar-right-open]) :is([data-dockkit-host="dock"], [data-dockkit-empty], [data-dockkit-divider]) {
  transform: translateX(calc(-1 * var(--dsh-sidebar-width)));
}
@starting-style {
  :root:lang(ar) [data-sidebar-right-panel][data-sidebar-right-opening] :is([data-dockkit-host="dock"], [data-dockkit-empty], [data-dockkit-divider]) {
    transform: translateX(calc(-1 * var(--dsh-sidebar-width)));
  }
}
:root:lang(ar) [data-sidebar-toggle] > svg {
  transform: scaleX(-1);
}
:root:lang(ar) [data-sidebar-right-expand] > svg {
  transform: none;
}
/* Native leading seats follow the sidebar, without moving OS traffic lights. */
:root:lang(ar) :has(> [data-shell-overlay]) > [data-shell-leading] {
  direction: rtl;
  inset-inline-start: 12px;
  inset-inline-end: auto;
}
:root:lang(ar)[data-platform="darwin"] :has(> [data-shell-overlay]) > [data-shell-leading] {
  inset-inline-start: 88px;
}
:root:lang(ar)[data-platform="darwin"][data-fullscreen] :has(> [data-shell-overlay]) > [data-shell-leading] {
  inset-inline-start: 12px;
}
/* Move only the native sidebar toggle below the English Windows caption row.
   6px comes from sidebar padding; 48px and 36px reuse native control clearances. */
:root:lang(ar)[data-windows-titlebar] :has(> [data-shell-overlay]) > div:has([data-sidebar-toggle]) [data-window-drag] > button[data-sidebar-toggle] {
  direction: rtl;
  inset-inline-start: 12px;
  inset-inline-end: auto;
  top: calc(var(--dsh-windows-titlebar-height) + 6px);
}
:root:lang(ar)[data-windows-titlebar] :has(> [data-shell-overlay])[data-sidebar-collapsed] {
  --dsh-frame-leading-clearance: 48px;
}
:root:lang(ar)[data-windows-titlebar] :has(> [data-shell-overlay]):not([data-sidebar-collapsed]) > div:has([data-sidebar-toggle]) [data-window-drag]:has(> button[data-sidebar-toggle]) {
  padding-inline-start: 36px;
}
:root:lang(ar) header[data-window-drag]:has(> [data-conversation-header-leading]) {
  padding-inline-start: 20px;
  padding-inline-end: 28px;
}
:root:lang(ar) header[data-window-drag]:has(> [data-conversation-header-leading]) div:has(> [data-sidebar-right-expand]) {
  direction: rtl;
  margin-inline: 0;
  margin-inline-start: 8px;
  margin-inline-end: -16px;
}
:root:lang(ar) header[data-window-drag]:has(> [data-conversation-header-leading]):not(:has([role="tablist"])) div:has(> [data-sidebar-right-expand]) {
  margin-inline-start: auto;
}
/* Header tabs remain LTR; this does not translate or mirror OS caption chrome. */
:root:lang(ar) [role="tablist"] {
  direction: ltr;
}
`;

/** Keep primary artwork at the left edge and text at the right; controls remain independent. */
export const ARABIC_CARD_STYLES = `
:root:lang(ar) [data-plugin-panel] :is([data-plugin-item], [data-plugin-package]) > div:first-child {
  direction: rtl;
  flex-direction: row;
}
:root:lang(ar) [data-plugin-panel] :is([data-plugin-item], [data-plugin-package]) > div:first-child > div:nth-child(2) {
  order: 0;
  text-align: start;
}
:root:lang(ar) [data-plugin-panel] :is([data-plugin-item], [data-plugin-package]) > div:first-child > span[aria-hidden="true"]:first-child {
  order: 2;
}
:root:lang(ar) [data-plugin-panel] :is([data-plugin-item], [data-plugin-package]) > div:first-child > div:nth-child(3) {
  order: 1;
}
:root:lang(ar) [data-plugin-panel] :is([data-plugin-item], [data-plugin-package]) > div:first-child > div:nth-child(2) > div:first-child > button[type="button"][aria-label] {
  text-align: start;
}
:root:lang(ar) [data-plugin-panel] [data-plugin-row] > div:first-child {
  direction: rtl;
  flex-direction: row;
}
:root:lang(ar) [data-plugin-panel] [data-plugin-row] > div:first-child > div:nth-child(2) {
  order: 0;
  text-align: start;
}
:root:lang(ar) [data-plugin-panel] [data-plugin-row] > div:first-child > span:nth-child(3) {
  order: 1;
}
:root:lang(ar) [data-plugin-panel] [data-plugin-row] > div:first-child > [role="switch"] {
  order: 2;
}
:root:lang(ar) [data-plugin-panel] [data-plugin-row] > div:first-child > span[aria-hidden="true"]:first-child {
  order: 3;
}
:root:lang(ar) [data-plugin-panel] [data-plugin-row] > div:first-child > div:nth-child(2) > button[type="button"][aria-label] {
  text-align: start;
}
`;

/** Row layout is paired with native negative-scrollLeft support, never CSS alone. */
export const ARABIC_ROWS_STYLES = `
:root:lang(ar) [data-row-key^="workspace:"][role="treeitem"],
:root:lang(ar) [data-row-key^="session:"][role="treeitem"] {
  direction: rtl;
  flex-direction: row-reverse;
}
:root:lang(ar) [data-row-key^="workspace:"][role="treeitem"] > span:nth-child(3) {
  text-align: start;
}
:root:lang(ar) [data-row-key^="session:"][role="treeitem"] > span:nth-child(2) {
  direction: rtl;
  text-align: start;
  unicode-bidi: plaintext;
}
:root:lang(ar) [data-row-key^="session:"][role="treeitem"] > span:nth-child(2)[data-scrolled] {
  mask-image: linear-gradient(to left, transparent, #000 12px);
}
:root:lang(ar) [data-row-key^="session:"][role="treeitem"] > span:nth-child(2)[data-clipped] {
  mask-image: linear-gradient(to right, transparent, #000 12px);
}
:root:lang(ar) [data-row-key^="session:"][role="treeitem"] > span:nth-child(2)[data-scrolled][data-clipped] {
  mask-image: linear-gradient(to right, transparent, #000 12px, #000 calc(100% - 12px), transparent);
}
`;

/** Public, side-effect-free diagnostic. No user messages or DOM are read. */
export function getArabicStatus(locale, catalog, nativeState = { nativeLayout: false, carrier: 'unknown' }) {
  const { active, locales, revision } = locale.getLocale();
  const namespaces = Object.entries(catalog);
  const mismatches = [];
  let keyCount = 0;
  let matchedCount = 0;
  for (const [namespace, dictionary] of namespaces) {
    const translate = locale.bind(namespace);
    for (const [key, expected] of Object.entries(dictionary)) {
      keyCount += 1;
      if (translate(key) === expected) matchedCount += 1;
      else if (mismatches.length < 20) mismatches.push({ namespace, key });
    }
  }
  return { active, locales, revision, layoutRevision: '1.0.3', nativeLayout: nativeState.nativeLayout, nativeRows: nativeState.nativeRows ?? false, carrier: nativeState.carrier, namespaceCount: namespaces.length, keyCount, matchedCount, mismatches };
}

/**
 * Native Cordis owns language/dictionaries/style and optional inspect teardown.
 * Style is a React component supplied by the browser's sole React module.
 * The bundle patch chooses the first preference; this function never writes it.
 */
export function applyArabic(ctx, catalog, Style, nativeState = () => ({ nativeLayout: false, carrier: 'unknown' })) {
  ctx.effect(() => ctx.locale.addLanguage({ id: 'ar', label: 'العربية', fallback: 'en' }), 'arabic-ui: language');
  for (const [namespace, dictionary] of Object.entries(catalog)) {
    ctx.effect(() => ctx.locale.register(namespace, 'ar', dictionary), `arabic-ui: ${namespace}`);
  }
  ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'dsh-arabic-ui.styles', order: 100,
  }, Style)), 'arabic-ui: language-dependent styles');
  const inspect = ctx.get('cordisInspect');
  if (inspect !== undefined) {
    ctx.effect(() => inspect.register({
      manifest: {
        id: '@local/dsh-arabic-ui',
        description: 'Read-only Arabic language-pack registration and lookup diagnostics (no DOM or user content).',
        methods: [{
          name: 'status',
          description: 'Count native Arabic dictionary matches for the active locale and report up to 20 mismatched keys.',
          inputSchema: { type: 'object', properties: {}, additionalProperties: false },
          outputSchema: {
            type: 'object',
            properties: {
              active: { type: 'string' }, locales: { type: 'array', items: { type: 'object' } },
              revision: { type: 'number' }, layoutRevision: { type: 'string' }, nativeLayout: { type: 'boolean' }, nativeRows: { type: 'boolean' }, carrier: { type: 'string' }, namespaceCount: { type: 'number' }, keyCount: { type: 'number' }, matchedCount: { type: 'number' },
              mismatches: { type: 'array', items: { type: 'object', properties: { namespace: { type: 'string' }, key: { type: 'string' } }, required: ['namespace', 'key'], additionalProperties: false } },
            },
            required: ['active', 'locales', 'revision', 'layoutRevision', 'nativeLayout', 'nativeRows', 'carrier', 'namespaceCount', 'keyCount', 'matchedCount', 'mismatches'],
            additionalProperties: false,
          },
        }],
      },
      async query() { return getArabicStatus(ctx.locale, catalog, nativeState()); },
    }), 'arabic-ui: read-only inspect provider');
  }
}
