import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createI18n, LANG_MARKUP } from '../src/i18n/index.js';
import { LOCALES, DEFAULT_LOCALE, isRuntimeKey } from '../src/i18n/locales.js';
import { SOURCES } from '../src/data/sources.js';
import { STATE_CODES } from '../src/data/states.js';
import { calculate } from '../src/engine/calculate.js';
import { SCENARIOS } from './helpers/scenarios.js';

const root = new URL('..', import.meta.url).pathname;
const dictionaries = Object.fromEntries(
  await Promise.all(LOCALES.map(async (l) => [l.code, (await import(`../src/i18n/${l.code}.js`)).default])),
);
const placeholders = (entry) => {
  const texts = typeof entry === 'string' ? [entry] : Object.values(entry);
  return [...new Set(texts.flatMap((text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1])))].sort();
};

test('Registry: genau eine Standardsprache, eindeutige Codes, Wörterbuchdateien vorhanden', () => {
  assert.equal(LOCALES.filter((l) => l.default).length, 1);
  assert.equal(DEFAULT_LOCALE.code, 'de');
  assert.equal(new Set(LOCALES.map((l) => l.code)).size, LOCALES.length);
  assert.equal(new Set(LOCALES.map((l) => l.path)).size, LOCALES.length);
  for (const l of LOCALES) {
    assert.match(l.path, /^\/(.+\/)?$/, `${l.code}: Pfad endet mit /`);
    assert.ok(['ltr', 'rtl'].includes(l.dir));
    assert.ok(dictionaries[l.code], l.code);
  }
  const files = readdirSync(join(root, 'src/i18n')).filter((f) => /^[a-z]{2,3}(-[A-Za-z]+)?\.js$/.test(f));
  assert.deepEqual(files.map((f) => f.replace('.js', '')).sort(), LOCALES.map((l) => l.code).sort());
});

test('Parität: alle Sprachen haben dieselben Schlüssel und dieselben Platzhalter', () => {
  const reference = dictionaries[DEFAULT_LOCALE.code];
  for (const [code, dictionary] of Object.entries(dictionaries)) {
    assert.deepEqual(Object.keys(dictionary).sort(), Object.keys(reference).sort(), `Schlüssel von ${code}`);
    for (const [key, entry] of Object.entries(dictionary)) {
      assert.deepEqual(placeholders(entry), placeholders(reference[key]), `${code}: Platzhalter von ${key}`);
      const texts = typeof entry === 'string' ? [entry] : Object.values(entry);
      for (const text of texts) {
        assert.ok(text.trim() === text && text.length > 0, `${code}: ${key} leer oder mit Leerraum am Rand`);
        assert.ok(!text.includes('  '), `${code}: ${key} enthält doppelte Leerzeichen`);
        const markups = [...text.matchAll(LANG_MARKUP)];
        assert.ok(markups.every((m) => m[1] === 'de'), `${code}: ${key} unbekanntes Markup`);
      }
      if (typeof entry === 'object') assert.ok('other' in entry, `${code}: ${key} braucht Form „other“`);
    }
  }
});

test('Quellen und Bundesländer haben in jeder Sprache einen Titel bzw. Namen', () => {
  for (const [code, dictionary] of Object.entries(dictionaries)) {
    for (const id of Object.keys(SOURCES)) assert.ok(dictionary[`source.${id}.title`], `${code}: source.${id}.title`);
    for (const state of STATE_CODES) assert.ok(dictionary[`state.${state}`], `${code}: state.${state}`);
  }
});

/** Alle `.js`-Dateien unter src/. */
function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : path.endsWith('.js') ? [path] : [];
  });
}

test('Alle im Code verwendeten Schlüssel (t(…), tr(…), Engine, Templates) existieren', () => {
  const keys = new Set();
  const literal = /\b(?:t|tr)\(\s*'([\w.-]+)'/g;
  for (const file of sourceFiles(join(root, 'src'))) {
    if (file.includes('/i18n/') || file.includes('/pap/')) continue;
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(literal)) keys.add(m[1]);
    for (const m of text.matchAll(/'((?:explain|warn|err|js|result|item)\.[\w.-]+)'/g)) keys.add(m[1]);
  }
  const templates = join(root, 'src/template');
  for (const name of existsSync(templates) ? readdirSync(templates) : []) {
    for (const m of readFileSync(join(templates, name), 'utf8').matchAll(/\{\{(?:t|plain):([\w.-]+)\}\}/g)) keys.add(m[1]);
  }
  assert.ok(keys.size > 40);
  for (const [code, dictionary] of Object.entries(dictionaries)) {
    for (const key of keys) assert.ok(key in dictionary, `${code}: Schlüssel ${key} fehlt`);
  }
});

test('Alle Erklärungs- und Hinweisschlüssel der Engine existieren (aus allen Szenarien)', () => {
  const used = new Set();
  for (const [, scenario] of SCENARIOS) {
    const r = calculate(scenario);
    for (const item of [...r.items, { explanation: r.netExplanation }]) {
      for (const step of item.explanation.steps) used.add(step.key);
    }
    for (const w of r.warnings) used.add(w.key);
    for (const e of r.employer.items) used.add(`item.employer.${e.id}`);
    for (const i of r.items) used.add(`item.${i.id}`);
    used.add(`result.employment.${r.employment}`);
  }
  assert.ok(used.size > 45, `nur ${used.size} Schlüssel`);
  for (const [code, dictionary] of Object.entries(dictionaries)) {
    for (const key of used) assert.ok(key in dictionary, `${code}: ${key}`);
  }
});

test('Alle Erklärungstexte lassen sich mit den Engine-Werten fehlerfrei formatieren (strict)', () => {
  for (const { code, intl } of LOCALES) {
    const i18n = createI18n({ code, intl, dictionary: dictionaries[code], strict: true });
    for (const [name, scenario] of SCENARIOS) {
      const r = calculate(scenario);
      const steps = [...r.items.flatMap((i) => i.explanation.steps), ...r.netExplanation.steps];
      for (const step of steps) {
        const text = i18n.t(step.key, step.values);
        assert.ok(text.length > 10, `${code}/${name}: ${step.key}`);
        assert.ok(!/undefined|NaN|\[object/.test(text), `${code}/${name}: ${step.key} → ${text}`);
      }
      for (const w of r.warnings) assert.ok(i18n.t(w.key, w.values ?? {}).length > 10);
    }
  }
});

test('Zahlenformate: Euro, Prozent, Zahl, Datum – de und en', () => {
  const de = createI18n({ code: 'de', intl: 'de-DE', dictionary: dictionaries.de });
  const en = createI18n({ code: 'en', intl: 'en-GB', dictionary: dictionaries.en });
  const nbsp = (s) => s.replace(/[  ]/g, ' ');
  assert.equal(nbsp(de.formatEur(305968)), '3.059,68 €');
  assert.equal(nbsp(de.formatEur(-5)), '-0,05 €');
  assert.equal(nbsp(en.formatEur(305968)), '€3,059.68');
  assert.equal(nbsp(de.formatPct(7.3)), '7,3 %');
  assert.equal(nbsp(de.formatPct(1.525)), '1,525 %');
  assert.equal(nbsp(en.formatPct(18.6)), '18.6%');
  assert.equal(de.formatNumber(0.912, 3), '0,912');
  assert.equal(de.formatNumber(3.2201, 6), '3,220100');
  assert.equal(en.formatNumber(0.6619), '0.6619');
  assert.equal(de.t('result.sources.metaNoDate', { publisher: 'BMF', accessed: { date: '2026-10-01' } }), 'BMF, abgerufen am 1. Oktober 2026');
  assert.equal(en.t('result.sources.metaNoDate', { publisher: 'BMF', accessed: { date: '2026-10-01' } }), 'BMF, retrieved on 1 October 2026');
});

test('Pluralformen und Sprach-Markup', () => {
  const de = createI18n({ code: 'de', intl: 'de-DE', dictionary: dictionaries.de });
  const en = createI18n({ code: 'en', intl: 'en-GB', dictionary: dictionaries.en });
  const params = { perChild: { pct: 0.25 }, reduction: { pct: 0.25 } };
  assert.match(de.t('explain.care.step.reduction', { ...params, count: 1 }), /für 1 berücksichtigtes Kind/);
  assert.match(de.t('explain.care.step.reduction', { ...params, count: 3 }), /für 3 berücksichtigte Kinder/);
  assert.match(en.t('explain.care.step.reduction', { ...params, count: 1 }), /for 1 child taken/);
  assert.equal(en.t('item.incomeTax'), 'Wage tax (Lohnsteuer)');
  assert.equal(en.tr('item.incomeTax'), 'Wage tax ([de:Lohnsteuer])');
  assert.equal(de.t('state.NW'), 'Nordrhein-Westfalen');
  assert.equal(en.t('state.BY'), 'Bavaria (Bayern)');
  // Fehlende Schlüssel: Laufzeit liefert den Schlüssel, strict wirft
  assert.equal(de.t('gibt.es.nicht'), 'gibt.es.nicht');
  assert.throws(() => createI18n({ code: 'de', dictionary: {}, strict: true }).t('x'), /Fehlender Übersetzungsschlüssel/);
  assert.throws(() => createI18n({ code: 'de', dictionary: { x: '{a}' }, strict: true }).t('x'), /Fehlender Parameter/);
});

test('Parser für lokalisierte Zahlen', () => {
  const de = createI18n({ code: 'de', intl: 'de-DE', dictionary: {} });
  const en = createI18n({ code: 'en', intl: 'en-GB', dictionary: {} });
  const cases = [
    [de, '3.500,50', 3500.5], [de, '3500,5', 3500.5], [de, '3.500', 3500], [de, '4000', 4000], [de, ' 4 000 € ', 4000],
    [de, '1.234.567,89', 1234567.89], [de, '0,5', 0.5], [de, ',5', 0.5], [de, '4’000', 4000],
    [en, '3,500.50', 3500.5], [en, '3500.5', 3500.5], [en, '3,500', 3500], [en, '€ 4,000', 4000], [en, '4000 EUR', 4000],
  ];
  for (const [i18n, text, expected] of cases) assert.equal(i18n.parseDecimal(text), expected, `${i18n.code}: ${text}`);
  for (const [i18n, text] of [[de, ''], [de, 'abc'], [de, '-5'], [de, '1.2.3'], [de, '12,3,4'], [de, '1,234.5'], [en, '3.500,50'], [de, '1e3'], [de, '4 5 a']]) {
    assert.ok(Number.isNaN(i18n.parseDecimal(text)), `${i18n.code}: ${text} soll ungültig sein`);
  }
});

test('Laufzeit-Schlüssel erkennt die Präfixe aus der Registry', () => {
  assert.ok(isRuntimeKey('explain.sv.step.base'));
  assert.ok(isRuntimeKey('state.NW'));
  assert.ok(!isRuntimeKey('form.gross.label'));
});
