# Installation

[Overview](<../README.md>) · [العربية](<../README.ar.md>) · [Compatibility](<compatibility.md>) · [Architecture](<architecture.md>)

> **Experimental community project.** Arabic is the first and only added language shipped today. Native Desktop mirroring is not visually certified. **العربية:** ثبّت نسخة موثوقة، واحترم اختيار اللغة المحفوظ، ثم حدّث النافذة.

## 1. Check compatibility and review the checkout

Use **DSH `0.2.2-rc.2` exactly**. The version pin in [the manifest](<../package.json>) and the native fingerprints are deliberate safety boundaries; do not bypass them for a different build. See [the evidence and risk matrix](<compatibility.md>).

Clone the community repository into a persistent folder you control:

```sh
gh repo clone Mstrq4/dsh-polyglot
cd dsh-polyglot
```

Only **after maintainers publish the `v1.0.3` release tag** (which may be a prerelease), you can pin it:

```sh
git checkout v1.0.3
```

If that tag is not published, use a reviewed commit and record its revision; do not assume a release exists. Review [the manifest](<../package.json>), [bundle patch](<../cordis.patch.yml>), [Host entry](<../index.js>), [native bridge](<../src/native-bridge.js>) and [Client source](<../src/runtime.js>) before activation. Installing a plugin executes code in the application; local installation is not a sandbox guarantee.

The package keeps the stable identifier `@local/dsh-arabic-ui` at `1.0.3`, with `private: true` and MIT licensing. It has no additional dependencies, installation scripts or external translation service. [The prebuilt Client](<../client.js>) is committed: **ordinary users do not need to install dependencies or build anything**.

## 2. Install through the GUI (recommended)

1. Open **Plugins → Add plugin** in your existing DSH application.
2. Paste the **absolute path to the clone folder**, not a source file or the repository URL. For example: `D:\Projects\dsh-polyglot`.
3. Review the package and activation result. This changes the current profile and affects its other sessions too.
4. Follow any restart instruction, then **refresh the actual application page/window**. HMR alone does not reload the native frame modules.

Local directory installation links that folder. Keep it in place while installed; moving or deleting it can break resolution. Do not use a guessed installation CLI, edit profile manifests, or run a package manager directly inside the profile.

## 3. Safe installation by an agent

An agent must have the user's explicit permission to install/enable this checkout in the current profile. Explain the shared-profile effect and experimental status first. Each JSON block below is an argument object for `functions.plugin_manager`, **not a shell command**; replace the illustrative path with the user's verified absolute clone path.

List inventories first to obtain exact existing identifiers and avoid duplicating an installed bundle; paginate if more entries are available:

```json
{ "action": "list_bundles", "limit": 100 }
```

```json
{ "action": "list_plugins", "limit": 100 }
```

After checking the running DSH version, reviewed revision and user authorization:

```json
{ "action": "install_bundle", "target": "D:\\Projects\\dsh-polyglot" }
```

Read the complete result: installation, selection and live activation are separate outcomes. Follow `nextStep` when present; diagnose `failed`, preserve `overridden` and honor `restart-required`. Replacing an installed package may require a Host restart before the page refresh. Never silently grant a version exemption, approve build scripts, write credentials, or change the profile with shell commands. If management tools/permission are unavailable, hand off the GUI instructions instead.

## 4. Choose Arabic and verify the window

The bundle supplies the low-priority default `locale.preference: ar`; a saved English preference wins. Activation never forces `setLocale`. If needed, choose **Settings → General → Language → العربية**. Later language changes remain the user's choice.

When Arabic is active, the verified catalog contains **57 namespaces / 2,886 keys**. Optional read-only Client diagnostics report `active`, `matchedCount`, `nativeLayout`, `nativeRows` and `carrier`; discover the provider before querying `@local/dsh-arabic-ui` / `status`. A match count verifies lookups, not rendering.

Native frame and row CSS require these respective markers in the **refreshed window**:

```js
window.__DSH_ARABIC_NATIVE_LAYOUT__ === '1.0.2'
window.__DSH_ARABIC_NATIVE_ROWS__ === '1.0.2'
```

The Host endpoint `/__arabic-ui-native/1.0.2/status` reporting readiness proves only HTTP adapter readiness. It does **not** prove that your window loaded it. Check sidebar opening/resizing, menus, wrapped composer/send placement, long titles, tabs/docking, switches and reduced motion in the actual application. The Desktop carrier has not yet passed this fresh-window native activation/visual check.

## Updates, rollback and troubleshooting

Before upgrading, review the target tag/commit and [compatibility](<compatibility.md>); do not automatically pull and activate unreviewed code. A DSH update normally leaves the clone intact but may block activation or change native APIs/assets.

To roll back: select English, disable the bundle in **Plugins**, then follow the reported restart step and refresh the window. Disable removes the owned registrations/styles/routes, not your saved language preference or installed DSH files. Code already executed in a window stays there until reload. Remove the linked installation through the manager before moving/deleting its folder; reinstall a reviewed compatible revision if desired.

For absent Arabic, inspect activation and saved preference. For absent native markers, refresh after any required restart and consult [the troubleshooting matrix](<compatibility.md>). For distorted layout, disable rather than overriding guards. Report a minimal reproduction with versions, revision, carrier and redacted diagnostics; **never include credentials, conversations or private URLs**. See [security reporting](<../SECURITY.md>) and [contribution guidance](<../CONTRIBUTING.md>).

## Optional contributor build

After reviewing the source scripts, use **Node.js 24 or newer** in the repository, not the DSH profile:

```sh
node scripts/build.mjs
```

This regenerates [the Client artifact](<../client.js>) from [runtime source](<../src/runtime.js>) and [Arabic dictionaries](<../dictionaries/ar.json>). Do not edit the artifact by hand. Portable CI checks do not replace the installed-native suite: that suite requires `DSH_INSTALL_DIR`, the matching DSH Electron executable with `ELECTRON_RUN_AS_NODE=1`, and ASAR-aware access on Windows. See [test limits](<compatibility.md>) before interpreting results.
