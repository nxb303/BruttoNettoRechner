#!/usr/bin/env node
/** Prüft alle gebauten HTML-Seiten (dist/**\/*.html) mit html-validate. */
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HtmlValidate } from 'html-validate';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });

const validator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    // Die Ergebnistabellen setzen ihre Rollen bewusst explizit: Auf schmalen Bildschirmen baut CSS die
    // Zeilen um (display: grid), und nur explizite Rollen erhalten dabei die Tabellensemantik.
    'no-redundant-role': ['error', { exclude: ['table', 'rowgroup', 'row', 'columnheader', 'rowheader', 'cell'] }],
  },
});

let failures = 0;
const files = htmlFiles(DIST);
if (!files.length) {
  console.error('Keine HTML-Dateien in dist/ – zuerst npm run build ausführen.');
  process.exit(1);
}
for (const file of files) {
  const report = await validator.validateFile(file);
  const name = relative(DIST, file);
  if (report.valid) {
    console.log(`ok     ${name}`);
    continue;
  }
  failures += report.errorCount;
  console.log(`FEHLER ${name}`);
  for (const result of report.results) {
    for (const m of result.messages) console.log(`  ${m.line}:${m.column}  ${m.ruleId}  ${m.message}`);
  }
}
if (failures) {
  console.error(`${failures} HTML-Fehler`);
  process.exit(1);
}
console.log(`${files.length} Seiten valide.`);
