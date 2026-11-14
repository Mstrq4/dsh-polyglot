# Contributing to DSH Polyglot

Thank you for helping make DeepSeek Harness easier to use across languages.
**DSH Polyglot is an Arabic-first, nonofficial community plugin.** Arabic is the
implemented interface language; additional project languages are **planned, not shipped**.
English and Arabic contributions are welcome, from first-time contributors to native-language reviewers.

مرحبًا بمساهماتكم بالعربية أو الإنجليزية. نحتاج خصوصًا إلى مراجعة المتحدثين الأصليين
لدقة العربية وسلامة القواعد ووضوح المصطلحات، وإلى بلاغات قابلة لإعادة الإنتاج تحمي الخصوصية.

## Start with something useful

- Review a small set of Arabic labels for grammar, consistency, and clarity.
- Report a reproducible bug with sanitized evidence, or improve an unclear instruction.
- Propose a language in the [language-request form](<.github/ISSUE_TEMPLATE/language_request.yml>).
- Discuss larger changes in [Discussions](<https://github.com/Mstrq4/dsh-polyglot/discussions>) before implementing them.

Read the [project overview](<README.md>), [agent and installation rules](<AGENTS.md>),
and [Code of Conduct](<CODE_OF_CONDUCT.md>). Setup details belong in the
[installation guide](<docs/installation.md>); compatibility details belong in the
[compatibility guide](<docs/compatibility.md>). Do not guess CLI installation commands.
Use [the security policy](<SECURITY.md>) instead of public issues for vulnerabilities.

## What is verified, and what is not

The current bundle is `@local/dsh-arabic-ui` **1.0.3**, MIT-licensed, with an exact
`engines.dsh` target of **0.2.2-rc.2** in [the manifest](<package.json>).
The Arabic catalog has **57 namespaces / 2,886 keys**. Recorded evidence is
**62 passing native/source/Cordis/HTTP-boundary tests**, not browser-layout proof.
Actual Desktop native activation still requires a refreshed-window check and is
not visually certified. Do not describe this as fully production-ready RTL.

## Translation contributions

Edit [the Arabic catalog](<dictionaries/ar.json>) rather than the generated
[client bundle](<client.js>). Keep each namespace and key aligned with
[the English fixture](<test/fixtures/english.json>).

- Preserve placeholder names and counts exactly, such as `{name}` or `{count}`.
- Preserve meaningful newlines, markup, keyboard shortcuts, and technical identifiers.
- Avoid invisible bidi controls, zero-width separators, or hidden characters as layout fixes.
- Explain terminology changes; ask a native Arabic speaker to review grammar and context.
- Keep keyboard shortcuts, code, paths, URLs, credentials, and technical inputs LTR and isolated.
- Preserve original user messages, file contents, and outputs; do not rewrite DOM text or add network translation.

Interface direction and a message's own writing direction are different concerns.
Keep English/mixed-script message behavior and technical-field isolation intact.

## Adding a future language

A copied Arabic directory does **not** constitute a working language pack.
First propose the language name, intended locale ID, native-speaking reviewers,
and whether its interface direction is LTR or RTL.

1. Check DSH's native language list: it already includes eight languages. An
   existing ID may need a scoped dictionary extension, not a duplicate definition.
2. For an unsupported ID, implement a native language definition with an appropriate
   label and English fallback, using the locale service and owned cleanup effects.
3. Provide namespace/key/placeholder parity against the English catalog; document any staged coverage honestly.
4. Implement direction scoped to that locale. Preserve physical shell, popup,
   docking, switch, and technical-input coordinate boundaries where required.
5. Add tests for fallback, registration/disposal, existing language ownership,
   saved preferences, mixed-script content, and generated distribution consistency.
6. Supply refreshed-window native evidence and a manual layout review, or explicitly
   record that these checks are unavailable. A proposal remains planned until implemented and reviewed.

Use [the locale runtime](<src/runtime.js>) and [native lifecycle tests](<test/language-pack.test.mjs>)
as references, not as permission to overwrite another language owner's dictionaries.

## Small, test-first changes

Keep one pull request to one scope. For behavior changes, first add the smallest
regression test, show the failure, then make the minimal fix. Documentation-only
changes should verify their links, facts, and examples without claiming runtime tests.

```sh
node scripts/build.mjs
npm run test:portable
npm test
```

Run the build after changing runtime code or the catalog; commit the regenerated
client artifact rather than editing it manually. See [the build script](<scripts/build.mjs>).
Run `test:portable` only when it is available in [the manifest](<package.json>);
otherwise report it as unavailable. Portable CI checks are limited to catalog,
build, and source contracts, **not native UI automation**.
Full `npm test` needs an installed DSH source target via `DSH_INSTALL_DIR` and a
Node 24-capable runtime; Desktop ASAR reads require DSH's Electron in Node mode.
Follow [the installation rules](<AGENTS.md>) and [native test loader](<test/native-runtime.mjs>).
Record exact commands, runtime/version, and results; do not mark unavailable tests as passed.

For UI changes manually check Arabic and English at narrow and wide widths:
menus/submenus, dialogs, switches, sidebar dragging, send placement, language
switching, and technical fields. Refresh the existing app window before checking
native execution. Server readiness or a CSS/source test is not visual evidence.

## Compatibility and safety boundaries

[The native adapter](<src/native-bridge.js>) serves narrowly patched copies of
native UiLayout/UiWorkspace code through plugin-owned web resource aliases.
It checks the exact DSH version and two native-file SHA-256 fingerprints; unknown
assets fail closed. It does not write the DSH installation or `app.asar`, replace
the application root, or take ownership of core state services.

Do not relax guards, hashes, tests, or user-preference protections to make a change pass.
A DSH update can break compatibility even though the cloned plugin folder survives.
Version exemptions risk crashes and data loss: agents must not grant one without
explicit consent for the exact plugin/runtime version pair, and it does not certify native assets.

## Pull requests and provenance

Use [the PR template](<.github/pull_request_template.md>). Include a focused summary,
test evidence, native evidence or its absence, and any documentation/compatibility impact.
Redact screenshots and logs; never publish profile tokens, private URLs, or conversation content.
Retain [the MIT license and copyright notices](<LICENSE>): English keys/fixtures
are source-derived from DSH; Arabic translations and project changes are authored here.
Credit any additional sources and verify their license before including them.
Useful reviews and careful reproductions matter more than volume; participation
never guarantees acceptance, release timing, or repository stars.
