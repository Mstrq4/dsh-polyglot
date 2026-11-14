import { readFile, writeFile } from 'node:fs/promises';
import { buildClient } from './build-client.mjs';

const source = await readFile(new URL('../src/runtime.js', import.meta.url), 'utf8');
const catalog = JSON.parse(await readFile(new URL('../dictionaries/ar.json', import.meta.url), 'utf8'));
await writeFile(new URL('../client.js', import.meta.url), buildClient({ source, catalog }), 'utf8');
console.log(`Built Arabic Client: ${Object.keys(catalog).length} namespaces / ${Object.values(catalog).reduce((sum, entries) => sum + Object.keys(entries).length, 0)} keys.`);
