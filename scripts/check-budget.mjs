#!/usr/bin/env node
/**
 * Prüft das Größenbudget: Für jede Startseite (/ und /en/) werden alle für den
 * First View nötigen Dateien (HTML, JS, Favicon) gzip-komprimiert gezählt.
 * Budget: ≤ 40 KB gzip gesamt und ≤ 3 Requests. Bei Überschreitung Exit-Code 1.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { LOCALES } from '../src/i18n/locales.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const BUDGET_BYTES = 40 * 1024;
const MAX_REQUESTS = 3;

/** Datei in dist/ zu einer URL (Basispfad wird abgeschnitten, bis die Datei existiert). */
function resolveAsset(url) {
  const segments = new URL(url, 'https://example.invalid').pathname.split('/').filter(Boolean);
  while (segments.length) {
    const candidate = join(DIST, ...segments);
    if (existsSync(candidate)) return candidate;
    segments.shift();
  }
  throw new Error(`Datei zu ${url} nicht gefunden`);
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
let failed = false;

for (const locale of LOCALES) {
  const indexFile = join(DIST, ...locale.path.split('/').filter(Boolean), 'index.html');
  const html = readFileSync(indexFile, 'utf8');
  const references = [...html.matchAll(/<(?:script|link|img)\b[^>]*?(?:src|href)="([^"#]+)"[^>]*>/g)]
    .filter((m) => /<script|rel="(?:icon|stylesheet|preload|modulepreload)"|<img/.test(m[0]))
    .map((m) => m[1]);
  const files = [indexFile, ...references.map(resolveAsset)];
  const rows = files.map((file) => {
    const data = readFileSync(file);
    return { name: file.slice(DIST.length + 1), raw: data.length, gzip: gzipSync(data, { level: 9 }).length };
  });
  const total = rows.reduce((sum, r) => ({ raw: sum.raw + r.raw, gzip: sum.gzip + r.gzip }), { raw: 0, gzip: 0 });

  console.log(`\nStartseite ${locale.path} (${locale.code})`);
  console.log('Datei'.padEnd(34), 'roh'.padStart(10), 'gzip'.padStart(10));
  for (const r of rows) console.log(r.name.padEnd(34), kb(r.raw).padStart(10), kb(r.gzip).padStart(10));
  console.log('Summe'.padEnd(34), kb(total.raw).padStart(10), kb(total.gzip).padStart(10), `  Requests: ${rows.length}`);

  if (total.gzip > BUDGET_BYTES) {
    console.error(`FEHLER: ${kb(total.gzip)} gzip überschreiten das Budget von ${kb(BUDGET_BYTES)}.`);
    failed = true;
  }
  if (rows.length > MAX_REQUESTS) {
    console.error(`FEHLER: ${rows.length} Requests, erlaubt sind ${MAX_REQUESTS}.`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log(`\nBudget eingehalten (≤ ${kb(BUDGET_BYTES)} gzip, ≤ ${MAX_REQUESTS} Requests).`);
