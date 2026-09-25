import { compile } from 'tailwindcss';
import { readFile, writeFile } from 'node:fs/promises';

// Build just the utilities present in this small app from the installed Tailwind package.
const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const tailwind = await readFile(new URL('../node_modules/tailwindcss/index.css', import.meta.url), 'utf8');
const candidates = [...new Set(source.match(/[!a-zA-Z0-9_:[\].%/-]+/g) || [])];
const compiler = await compile(tailwind);
await writeFile(new URL('../src/tailwind.generated.css', import.meta.url), compiler.build(candidates));
