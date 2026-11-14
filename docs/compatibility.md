# Compatibility and verification limits

[Overview](<../README.md>) · [العربية](<../README.ar.md>) · [Installation](<installation.md>) · [Architecture](<architecture.md>)

> **Experimental, Arabic-first community plugin.** Native Desktop mirroring and cross-platform visual behavior are not certified. **العربية:** نجاح الاختبارات أو جاهزية الخادم لا يثبتان أن النافذة تعرض الإطار المعكوس.

## Version boundaries

| Surface | Current boundary |
| --- | --- |
| Community package | `@local/dsh-arabic-ui` `1.0.3`; stable identifier retained for existing installations |
| DSH activation | Exact `engines.dsh: 0.2.2-rc.2` in [the manifest](<../package.json>) |
| UI layout diagnostic | `layoutRevision: '1.0.3'` |
| Native adapter | Revision `1.0.2`, independently versioned from the package/UI changes |
| Arabic catalog | 57 namespaces / 2,886 keys matching the pinned baseline |
| Contributor build | Node.js 24+; no extra dependencies or installation scripts |

The native bridge checks the bootstrap release and SHA-256 of the targeted installed Client sources. The accepted fingerprints in [the bridge](<../src/native-bridge.js>) are:

| Native module | Exact SHA-256 |
| --- | --- |
| `@deepseek-ai/dsh-client-ui-layout` | `814486863a32f73e7184a66312ec2d7f5884766000af21f60891a0c01b592630` |
| `@deepseek-ai/dsh-client-ui-workspace` | `a6e71ef7ae8581e33a9e2a9f48787b8390c192e3e3f6b23a37b19f71137b34f8` |

A matching version string alone is insufficient: rebuilt native assets can have different hashes. Unknown releases, missing modules, unexpected URLs, or mismatched native/combo payloads **fail closed**; no guessed native patch is applied. The activation pin can block the bundle entirely. A safe fallback is not a compatibility promise for other releases, and there are no automatic version exemptions.

## What is translated, and what is not

The bundle registers Arabic UI dictionaries through DSH's native locale service. English fallback covers missing keys; saved user language choices override the bundle default. Arabic is the only additional language shipped by this project; other languages are future contribution work, not an existing feature matrix.

It does **not** translate conversations, generated answers, files, terminal output, operating-system chrome, or arbitrary external/third-party plugins. Interface language does not change a model's language or provider settings. Code, editors, API/password/URL fields and other technical islands remain LTR. Popup/root coordinates, docking geometry and tab order stay LTR while appropriate content uses Arabic flow; this is deliberately **not blanket full-RTL mirroring**.

## Evidence, with its scope

| Evidence recorded for the pinned build | What it establishes | What it does not establish |
| --- | --- | --- |
| Latest recorded Windows native suite: **62/62 passed**; line **99.36%**, branch **87.21%**, function **100%** coverage | Source contracts, real Cordis/locale lifecycle, guarded native artifacts, HTTP boundaries and cleanup within the instrumented scope | Browser layout, measured positions, screenshot quality, or an exhaustive security audit |
| Live Arabic lookup diagnostics: **2,886/2,886 matches** across 57 namespaces | Registered translations resolve against the active Arabic locale | Visual placement, wording quality in every context, or all future upstream keys |
| Host HTTP adapter reports native revision `1.0.2` ready | Aliases can be served by the existing Host | That a specific page/window executed those aliases |
| Actual Desktop `dsh-app` carrier reported `nativeLayout: false` | Native frame mirroring was not activated in that observed window | A successful fresh-page activation or visually certified Desktop RTL |
| Repository portable checks/CI | Repository-only catalog, source and artifact contracts covered by those checks | The complete installed-native suite, Electron/ASAR behavior, or cross-platform UI proof |

These are recorded evidence, not a claim that every checkout/platform was retested. Source/CSS assertions and HTTP/Slots fixtures are **not browser/React renderer tests**. macOS/Linux, cross-browser behavior and fresh-window Desktop native activation remain unverified.

## Risk and response matrix

| Situation | Risk | Safe response |
| --- | --- | --- |
| Different DSH release or same release with changed native hashes | Activation blocked or native adapter refused | Disable; wait for a reviewed compatibility update, not an exemption |
| Host ready but old window or non-HTTP Desktop carrier | Locale/CSS can load without native code replacement | Follow restart instructions and refresh; inspect actual window markers |
| Checkout moved/deleted while locally linked | Package/module resolution failure | Keep the clone; remove through the manager before relocating it |
| DSH upgrade | Clone usually survives, but services/assets/version requirements may change | Review upgrade guidance and target artifacts before reactivation |
| New upstream keys or external plugins | English fallback or untranslated third-party labels | Report the namespace/key without private data; do not DOM-rewrite text |
| Unreviewed repository revision | Plugin code executes inside DSH | Review/pin a tag or commit before activation or running any script |

## Troubleshooting without bypassing safeguards

| Symptom | Checks and next action |
| --- | --- |
| UI stays English | Confirm activation, then inspect saved language preference; select Arabic explicitly if desired. Saved English wins by design. |
| `failed`, `overridden`, or `restart-required` | Read the manager result and `nextStep`; diagnose the failure, respect the higher-priority layer, or perform the requested restart. |
| `unsupported-release` / `native-source-mismatch` | Verify the exact DSH release and native build. Leave guards intact and report the mismatch. |
| Native markers absent | Refresh after any required Host restart. Check Client `nativeLayout`, `nativeRows` and `carrier`; a ready Host endpoint is not enough. |
| Menus, drag handles or long titles behave incorrectly | Select English, disable the bundle, refresh, and compare a minimal reproduction. Do not force frame/row CSS on. |
| Labels remain stale after changing language | Reopen the affected page or re-enable its owning plugin; some existing command descriptions were captured before the switch. |

Expected marker values are `window.__DSH_ARABIC_NATIVE_LAYOUT__ === '1.0.2'` and `window.__DSH_ARABIC_NATIVE_ROWS__ === '1.0.2'`. Their presence establishes adapter execution, **not** a visual pass. Verify opening/resizing both sidebars, empty/wrapped composer with left-edge send, menus, plugin cards/switches, long titles, tabs/docking, fullscreen and reduced motion in the real application before claiming a UI result.

## Updating, native tests and rollback

A DSH update normally does not delete a separately cloned folder. It can nevertheless change public services, native assets, activation rules or the page carrier. Review a pinned release/commit and the relevant DSH upgrade guidance; no unattended pull-and-activate or automatic exemption is recommended.

Full native tests use [the manifest's test lists](<../package.json>) and [the native test adapter](<../test/native-runtime.mjs>). They require `DSH_INSTALL_DIR` plus the matching installed Electron runtime with `ELECTRON_RUN_AS_NODE=1`; on Windows its ASAR-aware filesystem access is necessary. Plain Node.js can build/check repository artifacts but cannot substitute for Electron when fixtures read installed ASAR members. A portable CI pass must not be relabeled a native or rendered-UI pass.

For rollback, select English, disable through **Plugins**, honor any restart request and refresh the actual window. Owned locale/styles/routes are disposed; installed native files and `app.asar` were never written. Existing executed JavaScript requires reload to return to the original implementation. Keep the local clone until the linked installation is removed. See [installation details](<installation.md>).

Reports should include DSH/package/adapter versions, reviewed revision, platform/carrier, marker flags, lookup counts and a minimal reproduction. Redact screenshots/logs; omit credentials, conversations, account details and private URLs. Use [security reporting](<../SECURITY.md>) for vulnerabilities and [contribution guidance](<../CONTRIBUTING.md>) for future language/compatibility work.
