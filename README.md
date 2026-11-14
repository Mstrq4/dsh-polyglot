<div align="center">

<img src="icon.svg" width="64" height="64" alt="DSH Polyglot community language-pack icon">

# DSH Polyglot

**Arabic first. More languages next. Built with the community.**

A community localization bundle for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), with native Arabic dictionaries and a carefully guarded RTL adapter.

[![Portable checks](https://github.com/Mstrq4/dsh-polyglot/actions/workflows/portable.yml/badge.svg)](https://github.com/Mstrq4/dsh-polyglot/actions/workflows/portable.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-blue)](<LICENSE>)
[![Status: experimental](https://img.shields.io/badge/status-experimental-orange)](<docs/compatibility.md>)
[![GitHub stars](https://img.shields.io/github/stars/Mstrq4/dsh-polyglot?style=social)](https://github.com/Mstrq4/dsh-polyglot/stargazers)

**English** · [العربية](<README.ar.md>)

[Install](<docs/installation.md>) · [Compatibility & risks](<docs/compatibility.md>) · [Contribute](<CONTRIBUTING.md>) · [Discussions](https://github.com/Mstrq4/dsh-polyglot/discussions)

</div>

> **Experimental, not an official DeepSeek product.** The current bundle targets **DSH `0.2.2-rc.2` only**. Automated source/runtime tests have passed; full rendered Desktop RTL, resizing and cross-platform behavior are **not visually certified**. Read the [verification record](<docs/verification.md>) before enabling it on a valuable workspace.

## Why Polyglot?

An interface should speak the language of the person using it—without rearranging their code, breaking their controls, or silently rewriting their preferences.

This project starts with Arabic. **Polyglot** is the direction, not a claim that every language already ships. We want native speakers, accessibility testers and developers to help turn a useful Arabic-first bundle into a maintainable multilingual community project.

## What ships today

| Capability | Current scope |
|---|---|
| Arabic language pack | **57 namespaces / 2,886 keys**, registered through DSH's native locale service |
| Preference-safe activation | Arabic is suggested at the bundle layer; an existing saved language choice takes precedence |
| Arabic component flow | Right-aligned labels, left-side primary artwork, and isolated technical content |
| Native switches | LTR coordinate islands preserve the original thumb travel, appearance and toggle actions |
| Guarded frame mirroring | Chat/workspace sidebar right; tools panel left—**only when the verified native adapter actually loads** |
| Composer and tabs | Left-edge send action; tab/dock coordinate strips remain LTR |
| Safer native integration | Exact version + SHA256 guards, plugin-owned HTTP aliases, disposal, unchanged installation files |
| More language packs | **Planned**, community contributions welcome |

The package/module identifier remains **`@local/dsh-arabic-ui`** for compatibility with existing installations. The repository and community project are **DSH Polyglot**. It is not currently published as an npm package.

## Quick start

### 1. Get a local checkout

```bash
gh repo clone Mstrq4/dsh-polyglot
cd dsh-polyglot
```

For a reproducible install, use a reviewed release tag instead of tracking an evolving development branch. The initial release is [v1.0.3](https://github.com/Mstrq4/dsh-polyglot/releases/tag/v1.0.3), marked **prerelease**:

```bash
git checkout --detach v1.0.3
```

The generated [client.js](<client.js>) is committed, so installing a reviewed checkout does **not** require Node.js, a dependency install, or a build. Keep this folder: local-directory installation links the checkout.

### 2. Install through DSH—not a profile-file edit

1. Confirm DSH is **`0.2.2-rc.2`** and uses the Web GUI/native locale services.
2. Open **Plugins → Add plugin**.
3. Paste the **absolute path to the cloned repository folder** containing [package.json](<package.json>), not its parent folder and not the README.
4. Follow the installer result. A saved selection is not necessarily a live activation; restart if requested.
5. Open **Settings → General → Language → العربية** if a previous language preference remains selected.
6. Refresh the actual application window for native frame code, then verify the behavior—not merely the installed entry.

For agent-assisted installation, give the agent [AGENTS.md](<AGENTS.md>) and ask it to use DSH's `plugin_manager` tool. See the [complete installation and troubleshooting guide](<docs/installation.md>).

## Important limits

- **Not a translation service:** conversations, file contents, terminal output, model identifiers and external/third-party text are not rewritten. OS window chrome intentionally remains native/English.
- **No blanket `dir="rtl"`:** the document and portal anchors remain LTR; Arabic flow is scoped. Code, editors, URLs and password/API-key fields stay technically correct.
- **No promise of complete mirroring on every carrier:** Desktop `dsh-app:` activation still needs real-window confirmation. If native activation markers are absent, the layout uses its conservative fallback rather than unsafe CSS-only mirroring.
- **Source tests are not screenshots:** menus, click targets, sidebar dragging, long-title scrolling, narrow layouts and fullscreen still require rendered testing.
- **No guarantee of compatibility with future DSH builds**, even when their release label looks similar.

## DSH updates: what can break?

Ordinary DSH updates do not normally delete a separate local checkout. That is **not** the same as keeping the plugin compatible.

The bundle pins `engines.dsh`, and its native adapters verify the exact shipped artifacts before changing served code. A new DSH version or rebuilt native module can change services, slots, markup, assets or coordinates. Activation may be blocked; native mirroring may be unavailable; translations may need new keys.

**Do not remove guards to “make it work.”** Do not grant automatic version exemptions. Such exemptions can cause crashes or data loss. Disable the bundle, refresh/restart, and report the version/build evidence for a reviewed migration. Keep your checkout and review the [risk, upgrade and rollback guide](<docs/compatibility.md>).

## Help shape the next languages

You do not need to be a framework expert to help:

- **Native Arabic speakers:** improve wording, terminology, plurals and clarity.
- **RTL users:** test switches, menus, tabs, focus, mixed-script content and sidebar resizing.
- **New-language contributors:** propose a pack, preserve placeholders and establish correct LTR/RTL behavior.
- **Developers:** replace brittle release-specific adaptations with reviewed upstream extension points.
- **Technical writers:** make installation and recovery easier.

Start with [CONTRIBUTING.md](<CONTRIBUTING.md>), a [language request](https://github.com/Mstrq4/dsh-polyglot/issues/new?template=language_request.yml), or a [discussion](https://github.com/Mstrq4/dsh-polyglot/discussions). Small, focused improvements are welcome.

**If this project is useful, a star and a thoughtful share help other users discover it.** Stars are appreciated; accurate bug reports and real-world testing are equally valuable.

## Roadmap

- [ ] Native-speaker Arabic review and a shared terminology glossary.
- [ ] Reproducible rendered RTL/LTR, accessibility and resize test matrix.
- [ ] Carrier-specific Desktop verification and safer DSH upgrade migrations.
- [ ] A reusable language-pack definition and additional community locales.
- [ ] Upstream collaboration for direction-aware public layout APIs.

These are goals, not shipped features or promised delivery dates.

## Development

Use **Node.js 24+**. There are no runtime npm dependencies or install scripts.

```bash
node scripts/build.mjs
npm run test:portable
```

Portable CI checks the generated artifact, publication links/privacy and selected bidi/source contracts. It does **not** install DSH or run native UI E2E. The full native suite requires the installed, pinned DSH distribution and an ASAR-aware Electron runtime when applicable; see [verification](<docs/verification.md>).

Edit [runtime.js](<src/runtime.js>) or the [Arabic catalog](<dictionaries/ar.json>), then rebuild. Do not hand-edit the generated client. Read [AGENTS.md](<AGENTS.md>) before automated changes.

| Documentation | Purpose |
|---|---|
| [Installation](<docs/installation.md>) | Clone, install, verify, refresh and recover |
| [Compatibility](<docs/compatibility.md>) | Version/build guards, update risks and rollback |
| [Architecture](<docs/architecture.md>) | Locale registration, owned styles and native carrier adapters |
| [Verification](<docs/verification.md>) | What passed, what remains unverified, and coverage limits |
| [Agent rules](<AGENTS.md>) | Safe installation and contributor automation |
| [Contributing](<CONTRIBUTING.md>) | Translation and engineering contribution workflow |
| [Security](<SECURITY.md>) | Private vulnerability reporting and sensitive-data handling |
| [Changelog](<CHANGELOG.md>) | Release notes |

## License and attribution

[MIT](<LICENSE>). Source-derived English locale keys/fixtures retain DeepSeek attribution. Arabic translations and the community icon are project contributions. DeepSeek Harness and its names remain their respective owners' property; this project is independent and unaffiliated.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
