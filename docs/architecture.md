# Architecture

[Overview](<../README.md>) · [العربية](<../README.ar.md>) · [Installation](<installation.md>) · [Compatibility](<compatibility.md>)

> DSH Polyglot is an Arabic-first **community bundle**, not a fork or replacement of DSH. **العربية:** قواميس أصلية وتنسيق محدود وجسر محمي بالبصمات؛ لا تعديل لملفات التطبيق ولا ترجمة للمحادثات.

## Components and ownership

| Component | Responsibility |
| --- | --- |
| [Manifest](<../package.json>) | Stable `@local/dsh-arabic-ui` identity, package `1.0.3`, exact DSH `0.2.2-rc.2` pin, Host/Client exports |
| [Bundle patch](<../cordis.patch.yml>) | Low-priority `locale.preference: ar` and Host plugin entry; user preferences remain higher priority |
| [Host entry](<../index.js>) | Declares `webServer` and `clientModules` dependencies; activates the native bridge |
| [Native bridge](<../src/native-bridge.js>) | Read-only native source validation and owned HTTP aliases for two targeted native modules |
| [Client runtime](<../src/runtime.js>) | Native language/dictionary registration, scoped styles and optional read-only diagnostics |
| [Arabic catalog](<../dictionaries/ar.json>) | 57 namespaces / 2,886 translated UI keys matching the pinned baseline |
| [Build script](<../scripts/build.mjs>) / [generator](<../scripts/build-client.mjs>) | Embed catalog/runtime in [the committed Client artifact](<../client.js>); no external translation or dependency install |
| [Native test adapter](<../test/native-runtime.mjs>) | Installed Cordis/locale/Inspect behavior and service-boundary fixtures, not a browser renderer |

```text
reviewed local checkout → DSH bundle manager → current profile
  ├─ Host: native release/hash guards → owned HTTP aliases → next index/bootstrap
  └─ Client: native locale dictionaries + shell.overlay style contribution
              └─ exact window markers gate frame and row refinements separately
```

The public project name can evolve without renaming the installed package or plugin identifier. `private: true` prevents accidental npm publication; reviewed local/GitHub/tarball installation remains possible. MIT licensing permits community reuse. There are no extra package dependencies or installation scripts.

## Locale and lifecycle

Client activation requires DSH's `locale` and `slots` services. It contributes the language `ar` with English fallback and registers each namespace through the native locale service. It does **not** replace DOM text, intercept conversations, call a translation API, or force `setLocale`.

The bundle default is below durable user overrides: saved English wins, and later language switches stick. A `shell.overlay` contribution supplies styles scoped to `:root:lang(ar)` rather than replacing the application root or its state/services. React comes from the page's shared module, not a second bundled copy.

Cordis effects own the language, dictionaries, style contribution and optional Inspect registration. Disposal removes only those contributions. The Host likewise owns its routes, index tap and graph observer. Unload does not erase user preferences or modify installed DSH files; a window that already executed adapted native code still needs a reload.

## Native adapter: constrained transport, not installation patching

Adapter revision **`1.0.2`** is independent of package/UI layout revision **`1.0.3`**. The Host uses public `clientModules.graph`, `clientPath`, `fetchBundle`, `onGraphChanged` and `webServer.getOrigin`, `register`, `tapIndex` surfaces. It does not write native code files or the immutable `app.asar`, does not intercept the shared `/plugins/` route, and does not reach into private loader state.

1. Read the current module graph and require release `0.2.2-rc.2`.
2. Read the targeted installed native Client sources and verify the exact SHA-256 fingerprints recorded in [compatibility](<compatibility.md>).
3. Require exact single-occurrence patch anchors; refuse unknown native code.
4. Admit only graph-selected, same-origin `/plugins/` URLs containing those targets. Register new **owned aliases** below `/__arabic-ui-native/1.0.2/`; do not replace the shared route.
5. Fetch the original bundle through `clientModules.fetchBundle`. Copy its text and replace only a verified native core that appears exactly once; a combo mismatch returns the original payload rather than a partial patch.
6. Preserve other modules' literal payload and source-mapping text. Only the verified native file's exact trailing source-map metadata is removed from its adapted copy.
7. Rewrite matching bootstrap/graph payload and preload URLs in the existing index response via `tapIndex`. Serve aliases with `Cache-Control: no-store`; observe graph changes and dispose all owned resources on unload.

This boundary avoids source-archive mutation and stale original cache identities. It is not a security sandbox: activation still executes reviewed plugin code inside DSH. Unknown releases/hashes fail closed; the activation pin may reject the bundle before the adapter runs.

## The two native changes

- **UI layout:** physical handle placement becomes `insetInlineStart`. Pointer-down captures the actual frame's `getComputedStyle(...).direction`; the captured sign applies to both rAF drag updates and final pointer-up. Native capture, cancellation, callbacks and width behavior remain intact. The Windows content corner becomes logical without changing its radius.
- **UI workspace rows:** a small direction-aware offset adapter supports negative `scrollLeft` for RTL titles. Native scrolling speed, reset behavior and reduced-motion handling are retained.

No native replacement of React, actions, themes, application state, docking logic or OS window controls is introduced.

## Bidirectional boundaries

Arabic content flow is separated from physical coordinates rather than setting global `direction: rtl`:

| Area | Deliberate behavior |
| --- | --- |
| Page root, portals and menu collision/anchor geometry | LTR coordinate system; Arabic menu/dialog text uses local RTL flow |
| Docking geometry and tab lists | LTR ordering/coordinates; tab content can be Arabic |
| Frame mirroring | Only with `window.__DSH_ARABIC_NATIVE_LAYOUT__ === '1.0.2'` |
| Workspace/session row refinements | Only with `window.__DSH_ARABIC_NATIVE_ROWS__ === '1.0.2'` |
| Composer and primary labels | First-strong message content; send at far left, labels right and primary icons left |
| Plugin cards | Text right, primary artwork far left, independent control slots |
| Native `role="switch"` control | LTR coordinate box preserves the native 36px track and positive 16px thumb travel; no size/theme/action change |
| Technical content | Code, terminal/editors, URL/email/password/number and marked API-secret fields remain LTR, including revealed values |
| OS titlebar/chrome | Not translated or mirrored; scoped sidebar-toggle positioning does not replace OS controls |

These are source-level design contracts, not a claim of fully certified RTL on every platform. Arabic-only content refinements can load while guarded native mirroring remains inactive.

## Diagnostics, refresh and future languages

The optional Client Inspect provider `@local/dsh-arabic-ui` exposes `status`: locale/key-match counts, `layoutRevision`, native marker flags and carrier, with no DOM, conversation or private URL reads. Discover its manifest before querying; an Inspect method is not a business Service for plugin code.

The Host status endpoint `/__arabic-ui-native/1.0.2/status` reports adapter readiness, **not execution in a specific window**. Native transport changes require a fresh index/bootstrap load: HMR of locale/styles alone is insufficient, and package replacement may first require a Host restart. The recorded Desktop carrier had `nativeLayout: false`; fresh-window activation and visual certification remain pending. See [verification limits](<compatibility.md>).

Future languages should add native catalog resources with key/placeholder parity, preserve user preference and technical islands, and supply direction-specific behavior only where justified. Arabic is the only additional language shipped now; broader locale selection or compatibility must be designed, tested and reviewed before being advertised. See [contribution guidance](<../CONTRIBUTING.md>).
