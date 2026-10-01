import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { generatePap, parseXml } from '../scripts/generate-pap.mjs';

const xmlPath = new URL('../vendor/bmf/Lohnsteuer2026.xml', import.meta.url);
const xml = readFileSync(xmlPath);

test('amtliche XML-Datei ist unverändert (SHA-256 laut vendor/bmf/README.md)', () => {
  assert.equal(
    createHash('sha256').update(xml).digest('hex'),
    '63d8981646d139eba2f4dd990c13b43c4fb3883b402a5a40cddf253aa7aa96b4',
  );
});

test('Drift-Schutz: lst2026.js entspricht exakt dem Generator-Output', () => {
  const generated = generatePap(xml, {
    year: 2026,
    sourceUrl: 'https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml',
  });
  const committed = readFileSync(new URL('../src/engine/pap/lst2026.js', import.meta.url), 'utf8');
  assert.equal(committed, generated, 'npm run gen:pap ausführen');
});

test('XML-Parser: Attribute, Entities, Kommentare und Selbstschließer', () => {
  const root = parseXml(
    '<A x="1"><!-- Hinweis --><B expr = "a &lt; b &amp;&amp; c &gt; d"/><C>\n<D name="n"></D></C></A>',
  );
  assert.equal(root.name, 'A');
  const [b, c] = root.children;
  assert.equal(b.attrs.expr, 'a < b && c > d');
  assert.equal(b.comment, 'Hinweis');
  assert.equal(c.children[0].attrs.name, 'n');
  assert.throws(() => parseXml('<A><B></A>'), /passt nicht/);
  assert.throws(() => parseXml('<A><B x=1/></A>'), /Markup/);
});

test('Generator weist unbekannte Bezeichner und Operatoren zurück', () => {
  const pap = (expr) =>
    `<PAP name="Lohnsteuer2099"><VARIABLES><INPUTS><INPUT name="A" type="int" default="1"/></INPUTS>` +
    `<OUTPUTS type="STANDARD"/><INTERNALS/></VARIABLES><CONSTANTS/>` +
    `<METHODS><MAIN><EVAL exec="${expr}"/></MAIN></METHODS></PAP>`;
  assert.match(generatePap(pap('A = A + 1'), { year: 2099 }), /this\.A = this\.A \+ 1;/);
  assert.throws(() => generatePap(pap('A = Unbekannt'), { year: 2099 }), /Unbekannter Bezeichner/);
  assert.throws(() => generatePap(pap('A = A / 2'), { year: 2099 }), /Nicht unterstütztes Zeichen/);
});

test('setInputs validiert Namen und Typen', async () => {
  const { Lohnsteuer2026 } = await import('../src/engine/pap/lst2026.js');
  assert.throws(() => new Lohnsteuer2026().setInputs({ GIBTESNICHT: 1 }), /Unbekannter Eingabeparameter/);
  assert.throws(() => new Lohnsteuer2026().setInputs({ STKL: 1.5 }), RangeError);
  assert.throws(() => new Lohnsteuer2026().setInputs({ LZZ: 'x' }), RangeError);
  const pap = new Lohnsteuer2026().setInputs({ STKL: '3', RE4: '100000', KVZ: 2.9 });
  assert.equal(pap.STKL, 3);
  assert.equal(pap.RE4.toString(), '100000');
});
