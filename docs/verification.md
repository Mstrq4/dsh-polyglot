# Verification record

This document separates code/runtime evidence from actual visual certification. **Passing source tests is not browser or rendered UI certification.**

## Recorded native/source baseline — bundle 1.0.3

The complete pre-publication suite ran on the installed **DSH 0.2.2-rc.2 Windows Desktop distribution**, using its ASAR-aware Electron runtime with `ELECTRON_RUN_AS_NODE=1` and the installation's `DSH_INSTALL_DIR`.

- **62 tests passed, 0 failed** before publication-only tests were added.
- Coverage of authored JS: **99.36% lines / 87.21% branches / 100% functions**.
- Arabic catalog: **57 namespaces / 2,886 keys**; English key/placeholder parity verified.
- Native layout and workspace artifacts passed exact fingerprint checks; copied patched JS and realistic combo bodies passed syntax/preservation tests.
- Tests covered locale ownership/disposal, preference preservation, lazy Client generation, technical bidi boundaries, two-phase resize deltas, alias routing/headers/graph/disposal, literal replacement safety, row-scroll adaptation and requested CSS source contracts.
- The universal switch regression uses the **actual shipped primitive CSS** (36px track, 16px thumb and positive 16px travel). Its numeric check describes the original coordinate bounds; it is **not an observed DOM measurement**.

Test fixtures use real Cordis, locale and inspect implementations plus service-boundary HTTP/Slot fixtures. They are not a fabricated browser, React renderer or screenshot engine. Native JS syntax validation does not prove interaction placement.

## Current integration check

After adding the five publication tests, the same pinned native/source setup ran **67/67 tests successfully, 0 failures**. JS coverage remained **99.36% lines / 87.21% branches / 100% functions**. The additional five checks cover publication/docs safety; they do not add native rendered evidence. The local portable subset also passed **30/30**. Workflow and all issue-form YAML parsed successfully, and `pnpm pack --dry-run --json` confirmed the intended runtime/documentation file list with no profiles, private paths or workspace backups.

## Publication / portable CI

The publication suite adds checks for repository identity, agent guidance, documentation links, provenance privacy and packaging declarations. GitHub's **Portable checks** workflow:

1. Rebuilds the committed Client without installing dependencies.
2. Requires a deterministic generated artifact.
3. Syntax-checks authored/generated JavaScript.
4. Runs selected bidi/source/publication contracts on Node.js 24.

It **does not install DSH, execute the full native suite or run browser E2E**. Do not combine the portable count with a native UI claim. CI status is available on [GitHub Actions](https://github.com/Mstrq4/dsh-polyglot/actions/workflows/portable.yml).

## Not yet certified

- Rendered native RTL activation in a refreshed Desktop `dsh-app:` window.
- Physical positions, click hitboxes and resize drags in the actual GUI.
- Narrow/wrapped composers, long-title marquee appearance and focus behavior.
- Floating/docked tools, fullscreen, light/dark, zoom and reduced-motion visual matrix.
- Linux/macOS or other DSH releases/builds.

Earlier live inspection confirmed Arabic registration and catalog matching, while the Desktop native frame marker was **false** before a confirmed fresh native boot. A ready Host alias status must not be presented as proof that a particular window has loaded the adapter.

## Required rendered matrix

For each reviewed DSH build, record OS, DSH version, bundle version, adapter revision, carrier, viewport/zoom, theme and motion preference. Save only redacted evidence.

- [ ] Existing GUI, not a substitute server: fresh boot and both native activation markers.
- [ ] Chat/workspace right; tools left; both openers adjacent and caption untouched.
- [ ] Resize both boundaries in both directions and release; collapse/reopen.
- [ ] Send at the actual left edge, including wrapped toolbar/blank conversation.
- [ ] Switches checked/unchecked/disabled/busy, thumb inside track and action intact.
- [ ] Plugin cards/rows: title right, artwork left, independent controls clickable.
- [ ] Menus/submenus/settings/tabs: collision anchors, keyboard focus and native handlers.
- [ ] Long Arabic/Latin/mixed titles, code, URLs and revealed API-key fields.
- [ ] Narrow, wide, fullscreen, floating/docked, light/dark and reduced motion.

## Coverage limitation / initial import

The initial experimental release retains the baseline's incomplete native branch coverage, explicitly accepted by the integration lead rather than advertised as 100%. Additional carrier failure/reconciliation behavior and rendered interaction evidence remain contribution targets. The implementation was developed before Git initialization; no historical RED commit hashes are invented.

## Reproducing full native tests

Use the installed DSH-owned runtime and resources, not a guessed SDK or fake DOM. Normal Node.js cannot traverse Electron ASAR members. In a compatible DSH session, use its managed `DSH_NODE_EXECUTABLE` / `DSH_INSTALL_DIR` facts and set `ELECTRON_RUN_AS_NODE=1`; invoke the files listed by the manifest's native `test` / `test:coverage` scripts. With an unpacked compatible installation, the normal Node path can work if those exact modules/assets are present.

The [installation guide](<installation.md>) and [agent rules](<../AGENTS.md>) describe generation and activation verification. Failed/missing native resources are a real setup limitation: report them instead of substituting mocks or changing guards.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
