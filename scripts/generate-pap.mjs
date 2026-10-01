#!/usr/bin/env node
/**
 * Übersetzt den amtlichen BMF-Programmablaufplan (XML-Pseudocode) in ein
 * JavaScript-Modul. Der BMF empfiehlt ausdrücklich die maschinelle Übersetzung
 * statt einer Handportierung (Rundungsfehler).
 *
 * Aufruf: node scripts/generate-pap.mjs [Jahr]          (Standard: 2026)
 *         node scripts/generate-pap.mjs [Jahr] --check   (Exit 1 bei Abweichung)
 *
 * Eingabe:  vendor/bmf/Lohnsteuer<Jahr>.xml
 * Ausgabe:  src/engine/pap/lst<Jahr>.js
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GENERATOR = 'scripts/generate-pap.mjs';

// ---------------------------------------------------------------- XML

const ENTITIES = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };

const decodeEntities = (text) =>
  text.replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (all, dec, hex, name) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    if (name in ENTITIES) return ENTITIES[name];
    throw new Error(`Unbekannte XML-Entität ${all}`);
  });

const TAG =
  /<!--([\s\S]*?)-->|<\?[\s\S]*?\?>|<(\/?)([A-Za-z_][\w.-]*)((?:\s+[\w:.-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
const ATTRIBUTE = /([\w:.-]+)\s*=\s*"([^"]*)"/g;

/**
 * Minimaler XML-Parser für die einfache PAP-Struktur (keine Textknoten,
 * keine CDATA, keine Namensräume). Kommentare werden dem folgenden Element
 * als `comment` mitgegeben (nur für lesbaren Generator-Output).
 */
export function parseXml(text) {
  const root = { name: '#document', attrs: {}, children: [], comment: '' };
  const stack = [root];
  let pendingComments = [];
  let last = 0;
  for (const m of text.matchAll(TAG)) {
    if (text.slice(last, m.index).includes('<')) {
      throw new Error(`Nicht verarbeitbares Markup bei Position ${last}`);
    }
    last = m.index + m[0].length;
    const [, comment, closing, name, rawAttrs, selfClosing] = m;
    if (comment !== undefined) {
      pendingComments.push(comment.replace(/\s+/g, ' ').trim());
      continue;
    }
    if (name === undefined) continue; // Verarbeitungsanweisung
    if (closing) {
      const open = stack.pop();
      if (open.name !== name) throw new Error(`Schließendes <${name}> passt nicht zu <${open.name}>`);
      continue;
    }
    const attrs = {};
    for (const a of rawAttrs.matchAll(ATTRIBUTE)) attrs[a[1]] = decodeEntities(a[2]);
    const element = { name, attrs, children: [], comment: pendingComments.filter(Boolean).join(' ') };
    pendingComments = [];
    stack.at(-1).children.push(element);
    if (!selfClosing) stack.push(element);
  }
  if (text.slice(last).includes('<')) throw new Error('Nicht verarbeitbares Markup am Dateiende');
  if (stack.length !== 1) throw new Error('XML nicht wohlgeformt (offene Elemente)');
  return root.children[0];
}

const child = (el, name) => el.children.find((c) => c.name === name);
const children = (el, name) => el.children.filter((c) => c.name === name);

// ---------------------------------------------------- Ausdrucksübersetzung

const TOKEN = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|(==|!=|<=|>=|&&|\|\||[-+*()[\],.<>!]))/y;
const BINARY = new Set(['+', '-', '*', '==', '!=', '<', '>', '<=', '>=', '&&', '||']);
const JS_OPERATOR = { '==': '===', '!=': '!==' };

function tokenize(source) {
  const tokens = [];
  TOKEN.lastIndex = 0;
  let position = 0;
  while (position < source.length) {
    TOKEN.lastIndex = position;
    const m = TOKEN.exec(source);
    if (!m) {
      if (source.slice(position).trim() === '') break;
      throw new Error(`Nicht unterstütztes Zeichen in „${source}“ bei Position ${position}`);
    }
    position = TOKEN.lastIndex;
    if (m[1] !== undefined) tokens.push({ type: 'number', text: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: 'ident', text: m[2] });
    else tokens.push({ type: 'op', text: m[3] });
  }
  return tokens;
}

/**
 * Java-Ausdruck → JavaScript. Bezeichner bekannter Variablen erhalten `this.`,
 * Konstanten bleiben Modulkonstanten, alles nach einem Punkt bleibt unverändert.
 */
function translateExpression(source, scope) {
  let out = '';
  let previous = null;
  for (const token of tokenize(source)) {
    const { type, text } = token;
    if (type === 'number') {
      out += String(Number(text));
    } else if (type === 'ident') {
      if (previous?.text === '.' || text === 'BigDecimal' || scope.constants.has(text)) out += text;
      else if (scope.variables.has(text)) out += `this.${text}`;
      else throw new Error(`Unbekannter Bezeichner „${text}“ in „${source}“`);
    } else if (BINARY.has(text)) {
      const unary =
        text === '-' && (!previous || (previous.type === 'op' && !['.', ')', ']'].includes(previous.text)));
      out += unary ? '-' : ` ${JS_OPERATOR[text] ?? text} `;
    } else if (text === ',') {
      out += ', ';
    } else {
      out += text; // . ( ) [ ] !
    }
    previous = token;
  }
  return out;
}

/** Trennt `a, f(b, c), d` an Kommas der obersten Klammerebene. */
function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts.map((p) => p.trim());
}

function translateConstant(constant, scope) {
  const { type, value } = constant.attrs;
  if (!type.endsWith('[]')) return translateExpression(value, scope);
  const inner = value.trim().replace(/^\{/, '').replace(/\}$/, '');
  const items = splitTopLevel(inner);
  const numeric = items.map((item) => {
    const m = /^BigDecimal\.(?:valueOf\(\s*(-?\d+(?:\.\d+)?)\s*\)|(ZERO))$/.exec(item);
    return m ? (m[1] ?? '0') : null;
  });
  if (numeric.every((n) => n !== null)) {
    return `[${numeric.map((n) => String(Number(n))).join(', ')}].map((x) => BigDecimal.valueOf(x))`;
  }
  return `[${items.map((item) => translateExpression(item, scope)).join(', ')}]`;
}

// ------------------------------------------------------- Anweisungen

const lineComment = (text, indent) =>
  text ? `${indent}// ${text.replace(/\*\//g, '* /')}\n` : '';

function emitStatements(nodes, scope, indent) {
  let out = '';
  for (const node of nodes) {
    if (node.name === 'EVAL') {
      const m = /^\s*([A-Za-z_]\w*)\s*=(?!=)\s*([\s\S]+?)\s*$/.exec(node.attrs.exec);
      if (!m) throw new Error(`EVAL nicht lesbar: ${node.attrs.exec}`);
      if (!scope.variables.has(m[1])) throw new Error(`Zuweisung an unbekannte Variable ${m[1]}`);
      out += `${indent}this.${m[1]} = ${translateExpression(m[2], scope)};\n`;
    } else if (node.name === 'EXECUTE') {
      const method = node.attrs.method;
      if (!scope.methods.has(method)) throw new Error(`EXECUTE auf unbekannte Methode ${method}`);
      out += `${indent}this.${method}();\n`;
    } else if (node.name === 'IF') {
      out += emitIf(node, scope, indent);
    } else {
      throw new Error(`Unbekanntes Element <${node.name}>`);
    }
  }
  return out;
}

function emitIf(node, scope, indent) {
  const thenBranch = child(node, 'THEN');
  const elseBranch = child(node, 'ELSE');
  if (!thenBranch) throw new Error(`IF ohne THEN: ${node.attrs.expr}`);
  let out = `${indent}if (${translateExpression(node.attrs.expr, scope)}) {\n`;
  out += emitStatements(thenBranch.children, scope, `${indent}  `);
  if (elseBranch) {
    const only = elseBranch.children.length === 1 && elseBranch.children[0].name === 'IF';
    if (only) {
      // else { if … } → else if …
      out += `${indent}} else ${emitIf(elseBranch.children[0], scope, indent).trimStart()}`;
      return out;
    }
    out += `${indent}} else {\n${emitStatements(elseBranch.children, scope, `${indent}  `)}`;
  }
  return `${out}${indent}}\n`;
}

// ----------------------------------------------------------- Generator

/**
 * @param {Buffer|string} xml  Inhalt der amtlichen XML-Datei (unverändert)
 * @param {{year: number|string, sourceUrl?: string}} options
 * @returns {string} JavaScript-Quelltext
 */
export function generatePap(xml, { year, sourceUrl }) {
  const raw = Buffer.isBuffer(xml) ? xml : Buffer.from(xml);
  const sha256 = createHash('sha256').update(raw).digest('hex');
  const text = raw.toString('utf8').replace(/^﻿/, '');
  const stand = /<!--\s*Stand:\s*([^>]*?)\s*-->/.exec(text)?.[1] ?? 'unbekannt';
  const pap = parseXml(text);
  if (pap.name !== 'PAP') throw new Error('Wurzelelement <PAP> fehlt');
  const className = pap.attrs.name;

  const variables = new Map();
  const fields = { inputs: [], outputs: [], internals: [] };
  for (const group of child(pap, 'VARIABLES').children) {
    const list = { INPUTS: fields.inputs, OUTPUTS: fields.outputs, INTERNALS: fields.internals }[group.name];
    if (!list) throw new Error(`Unbekannte Variablengruppe <${group.name}>`);
    for (const el of group.children) {
      const { name, type } = el.attrs;
      if (variables.has(name)) throw new Error(`Variable ${name} doppelt definiert`);
      variables.set(name, type);
      list.push({ ...el.attrs, comment: el.comment });
    }
  }

  const constants = new Map();
  const scope = { variables, constants: new Set(), methods: new Set() };
  for (const c of children(child(pap, 'CONSTANTS'), 'CONSTANT')) scope.constants.add(c.attrs.name);

  const methodsElement = child(pap, 'METHODS');
  const methodNodes = methodsElement.children.map((m) => ({
    name: m.name === 'MAIN' ? 'MAIN' : m.attrs.name,
    node: m,
  }));
  for (const { name } of methodNodes) {
    if (variables.has(name) || scope.constants.has(name)) throw new Error(`Methode ${name} kollidiert mit Variable`);
    scope.methods.add(name);
  }

  for (const c of children(child(pap, 'CONSTANTS'), 'CONSTANT')) {
    constants.set(c.attrs.name, { code: translateConstant(c, scope), comment: c.comment });
  }

  const defaultFor = ({ type, default: value }) => {
    if (value !== undefined) return translateExpression(value, scope);
    return type === 'BigDecimal' ? 'BigDecimal.ZERO' : '0'; // z. B. VJAHR (Tippfehler „defaul“), R
  };

  const typeMap = Object.fromEntries(fields.inputs.map((f) => [f.name, f.type]));

  let out = `// GENERIERT aus amtlichem BMF-PAP – nicht bearbeiten (npm run gen:pap).
// Quelle:    ${sourceUrl ?? `vendor/bmf/Lohnsteuer${year}.xml`}
// XML-Stand: ${stand}
// SHA-256:   ${sha256}
// Generator: ${GENERATOR}
import { BigDecimal } from '../decimal.js';

export const PAP_INFO = { year: ${Number(year)}, xmlStand: '${stand}', xmlSha256: '${sha256}' };

`;
  for (const [name, { code, comment }] of constants) {
    out += `${lineComment(comment, '')}const ${name} = ${code};\n`;
  }
  out += `\n// Typ der Eingabeparameter (für die Umwandlung in setInputs)\nconst INPUT_TYPES = {\n`;
  for (const [name, type] of Object.entries(typeMap)) out += `  ${name}: '${type}',\n`;
  out += `};

/**
 * Amtlicher Programmablaufplan ${year}. Eine Instanz entspricht genau einem Lauf:
 * interne Felder (z. B. EFA) werden zwischen Läufen nicht zurückgesetzt.
 */
export class ${className} {
  constructor() {
`;
  for (const [title, list] of [
    ['Eingabeparameter', fields.inputs],
    ['Ausgabeparameter', fields.outputs],
    ['Interne Felder', fields.internals],
  ]) {
    out += `    // ${title}\n`;
    for (const f of list) {
      out += lineComment(f.comment, '    ');
      out += `    this.${f.name} = ${defaultFor(f)};\n`;
    }
  }
  out += `  }

  /** Setzt Eingabeparameter; BigDecimal-Felder akzeptieren BigDecimal, Zahl oder String. */
  setInputs(inputs) {
    for (const [name, value] of Object.entries(inputs)) {
      const type = INPUT_TYPES[name];
      if (!type) throw new Error(\`Unbekannter Eingabeparameter \${name}\`);
      if (type === 'BigDecimal') {
        this[name] = BigDecimal.valueOf(value);
      } else {
        const number = Number(value);
        if (!Number.isFinite(number) || (type === 'int' && !Number.isInteger(number))) {
          throw new RangeError(\`Ungültiger Wert für \${name}: \${value}\`);
        }
        this[name] = number;
      }
    }
    return this;
  }

  /** Führt den Programmablaufplan aus und liefert die Ausgabeparameter. */
  run() {
    this.MAIN();
    return this.getOutputs();
  }

  getOutputs() {
    return {
`;
  for (const f of fields.outputs) out += `      ${f.name}: this.${f.name},\n`;
  out += `    };
  }
`;
  for (const { name, node } of methodNodes) {
    out += `\n${lineComment(node.comment, '  ')}  ${name}() {\n${emitStatements(node.children, scope, '    ')}  }\n`;
  }
  out += '}\n';
  return out;
}

// ----------------------------------------------------------------- CLI

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const year = args.find((a) => /^\d{4}$/.test(a)) ?? '2026';
  const xmlPath = join(ROOT, 'vendor/bmf', `Lohnsteuer${year}.xml`);
  const target = join(ROOT, 'src/engine/pap', `lst${year}.js`);
  const sourceUrl = `https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer${year}.xml.xhtml`;
  const generated = generatePap(readFileSync(xmlPath), { year, sourceUrl });
  if (check) {
    let current = '';
    try {
      current = readFileSync(target, 'utf8');
    } catch {
      // fehlt → Abweichung
    }
    if (current !== generated) {
      console.error(`${target} weicht vom Generator-Output ab – npm run gen:pap ausführen.`);
      process.exit(1);
    }
    console.log('PAP-Modul ist aktuell.');
    return;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, generated);
  console.log(`${target} geschrieben (${generated.length} Zeichen).`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
