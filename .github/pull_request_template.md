## Summary and scope

<!-- Arabic or English is welcome. Describe one focused change and link an issue if relevant. -->

- Change:
- Why it helps:
- Scope / intentionally unchanged:

## Test-first evidence

<!-- For behavior changes, start with the smallest failing regression, then show the fix.
For documentation-only work, state that runtime checks are not applicable. Never invent results. -->

- Smallest test and observed failure before the fix:
- Passing result after the fix:
- Runtime and exact DSH version:
- `node scripts/build.mjs` result, if runtime/catalog changed:
- `npm run test:portable` result (if present; otherwise state unavailable):
- Full `npm test` result, or the installed-source/Electron/Node 24 limitation:

## Native activation and manual layout evidence

<!-- Native/source/Cordis/HTTP-boundary tests and portable CI are not browser UI automation.
Server readiness is not evidence that a Desktop window executed native adapters.
Use nonsensitive sample content. Record unavailable checks rather than claiming production RTL. -->

- Bundle version and carrier (carrier copied from native status only, otherwise unavailable):
- Existing app window refreshed, and nativeLayout/nativeRows evidence:
- Actual-window checks completed, or unavailable and why:
  - Arabic and English, narrow and wide widths:
  - Menus/submenus, dialogs, and popup anchors:
  - Switch thumb/state and language switching:
  - Sidebar dragging, tabs, and composer/send position:
  - Keyboard shortcuts, code, credentials, and other technical fields remain LTR/isolate:
- Screenshots/logs, if useful: redacted before upload; no private conversation content or profile exports.

## Checklist

- [ ] This is one small scope; behavior changes started with a regression test.
- [ ] I followed [the contribution guide](<../CONTRIBUTING.md>) and [agent/setup rules](<../AGENTS.md>).
- [ ] Runtime/catalog changes regenerate [the client bundle](<../client.js>); I did not hand-edit generated code (or not applicable).
- [ ] Namespace/key/placeholder parity, Arabic grammar, and invisible-control checks are preserved (or not applicable).
- [ ] Original user messages and saved preferences remain unchanged; no network translation was added.
- [ ] Locale direction is scoped; physical shell/popup/switch geometry and technical LTR isolation are preserved (or not applicable).
- [ ] Exact version and both native SHA-256 guards remain intact; any compatibility/hash change is reviewed with provenance, tests, and documentation, not arbitrary relaxation.
- [ ] No DSH installation/app.asar writes, application-root replacement, shared-route takeover, or automatic version exemption was introduced.
- [ ] Native and visual evidence is reported honestly, including unavailable checks; I do not claim full production RTL from test results.
- [ ] Public artifacts contain no credentials, profile tokens, private URLs, conversation content, or vulnerability/exploit details.
- [ ] Relevant docs and [MIT license/copyright provenance](<../LICENSE>) are preserved or updated within the change's scope.

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
