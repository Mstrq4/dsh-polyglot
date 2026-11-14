import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const text = path => readFileSync(resolve(root, path), 'utf8');
const manifest = () => JSON.parse(text('package.json'));
const documents = ['README.md', 'README.ar.md', 'AGENTS.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md', 'docs/installation.md', 'docs/compatibility.md', 'docs/architecture.md', 'docs/verification.md'];

test('published identity is DSH Polyglot while the installed bundle id and compatibility contract stay stable', () => {
  const pkg = manifest();
  assert.equal(pkg.name, '@local/dsh-arabic-ui');
  assert.equal(pkg.engines.dsh, '0.2.2-rc.2');
  assert.equal(pkg.repository.url, 'https://github.com/Mstrq4/dsh-polyglot.git');
  for (const file of ['docs', 'AGENTS.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md']) assert.ok(pkg.files.includes(file), file);
  for (const locale of ['en', 'ar', 'zh']) assert.ok(text(`locale/${locale}.json`).includes(pkg.version), `metadata version: ${locale}`);
  assert.ok(pkg.scripts['test:portable'].includes('test/publication.test.mjs'));
});

test('public docs exist, use the chosen brand, and clearly separate source tests from visual certification', () => {
  for (const path of documents) assert.ok(existsSync(resolve(root, path)), path);
  assert.match(text('README.md'), /DSH Polyglot/);
  assert.match(text('README.ar.md'), /DSH Polyglot/);
  assert.match(text('README.md'), /experimental/i);
  assert.match(text('docs/verification.md'), /not.*(?:visual|browser)|(?:visual|browser).*not/i);
  assert.match(text('AGENTS.md'), /install_bundle/);
  assert.match(text('AGENTS.md'), /version.*exemption|exemption.*version/i);
});

test('published provenance and docs do not disclose the original workstation identity or link to workspace-only backups', () => {
  const provenance = JSON.parse(text('test/fixtures/catalog-sources.json'));
  assert.ok(!Object.hasOwn(provenance, 'installationRoot'));
  for (const path of documents) {
    const value = text(path);
    assert.doesNotMatch(value, /[A-Z]:\\+(?:Users|Documents and Settings)\\+|\.dsh[/\\]profiles|\.\.\/localdocs|\uFFFD/i, path);
  }
});

test('local Markdown file links remain inside the standalone repository and resolve to real targets', () => {
  for (const path of documents) {
    const value = text(path);
    for (const match of value.matchAll(/\]\(<?([^\s)>]+)>?(?:\s+"[^"]*")?\)/g)) {
      const destination = match[1];
      if (/^(?:https?:|mailto:|#)/.test(destination)) continue;
      const file = decodeURIComponent(destination.split('#')[0]);
      if (!file) continue;
      const target = resolve(dirname(resolve(root, path)), file);
      assert.ok(target === root.slice(0, -1) || target.startsWith(root), `${path}: link escapes repository: ${destination}`);
      assert.ok(existsSync(target), `${path}: missing link target ${destination}`);
    }
  }
});

test('portable verification does not claim or import the installed native DSH runtime', () => {
  const portable = manifest().scripts['test:portable'];
  assert.doesNotMatch(portable, /(?:native-frame-bridge|native-control-direction|language-pack|distribution|build-safety)\.test/);
  const workflow = text('.github/workflows/portable.yml');
  assert.match(workflow, /test:portable/);
  assert.match(workflow, /client\.js/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/);
});
