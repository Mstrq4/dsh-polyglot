# Security policy

DSH Polyglot is an Arabic-first, nonofficial community plugin for DeepSeek Harness.
Arabic is implemented; additional project languages are planned, not shipped.
This policy is maintained for [Mstrq4/dsh-polyglot](<https://github.com/Mstrq4/dsh-polyglot>).

## Private vulnerability reports

**Do not disclose vulnerabilities in public issues or Discussions.** Do not post
credentials, profile tokens, private URLs, conversation contents, or working
exploits in a public report.

If GitHub private vulnerability reporting is enabled, use
[GitHub Security Advisories / Report a vulnerability](<https://github.com/Mstrq4/dsh-polyglot/security/advisories/new>).
Otherwise, check the contact methods actually published by the maintainer on
[Mstrq4's GitHub profile](<https://github.com/Mstrq4>) and request a private channel
without including sensitive details. This project does not publish a security
email address here. If no private channel is available, do not turn the report
into a public issue; wait for a safe contact method.

A useful private report includes:

- Bundle version, exact DSH version, operating system, and affected component.
- A minimal description of impact, relevant preconditions, and safe reproduction steps.
- Sanitized evidence and suggested mitigations, if known; share sensitive artifacts only through the agreed private channel.

Please coordinate any disclosure with the maintainer. There is **no guaranteed
response SLA, fix deadline, paid bounty, or promise of uninterrupted support**.

## Current review target

[The current manifest](<package.json>) identifies `@local/dsh-arabic-ui` **1.0.3**
and exactly **DSH 0.2.2-rc.2**. Reports about other combinations are welcome
privately, but older versions and future DSH releases have no support guarantee.
The MIT license supplies the software as-is; compatibility is not a security certification.

## Boundaries to preserve

- The plugin registers native locale dictionaries; it does not send user messages to a translation service.
- Original messages, file contents, and outputs must remain unchanged. Technical inputs and credentials remain LTR and isolated.
- [The native adapter](<src/native-bridge.js>) checks an exact DSH release and two
  native-file SHA-256 fingerprints before serving narrowly patched copies through
  plugin-owned web resource aliases. Unknown assets must fail closed.
- Do not write DSH installation files or `app.asar`, replace the application root,
  intercept shared core routes, or weaken version/hash guards to work around a mismatch.
- A DSH update may leave the cloned plugin folder intact while changing native
  assets and disabling the adapter. Check [compatibility guidance](<docs/compatibility.md>).
- Agents must not grant version exemptions without explicit consent for the exact
  plugin/runtime pair after explaining crash and data-loss risks. An exemption
  does not establish native compatibility or relax fingerprint checks.

Recorded **62 passing native/source/Cordis/HTTP-boundary tests** are not a browser
layout audit, penetration test, or production RTL certification. Actual Desktop
native activation remains pending refreshed-window verification and visual review.

For ordinary, nonsecurity bugs, use the public issue forms only with redacted
reproductions. Follow [the contribution guide](<CONTRIBUTING.md>) and retain
[MIT provenance and copyright notices](<LICENSE>) when sharing source-derived fixtures.
