import { test } from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/2026.js';
import { SOURCES } from '../src/data/sources.js';
import { STATES, STATE_CODES, findState } from '../src/data/states.js';
import { YEARS, DEFAULT_YEAR, getYear } from '../src/data/years.js';
import { BigDecimal } from '../src/engine/decimal.js';
import { Lohnsteuer2026 } from '../src/engine/pap/lst2026.js';

const D = (x) => BigDecimal.valueOf(x);

/** Alle `{ value, sources }`-Blätter eines Datenobjekts. */
function leaves(node, path = []) {
  if (node && typeof node === 'object' && 'value' in node && Array.isArray(node.sources)) return [[path.join('.'), node]];
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [];
}

test('Jahresregistry', () => {
  assert.equal(DEFAULT_YEAR, 2026);
  assert.equal(getYear(2026), YEARS[2026]);
  assert.throws(() => getYear(1999), RangeError);
});

test('Jeder Datenwert nennt mindestens eine existierende Quelle', () => {
  const all = leaves(data);
  assert.ok(all.length >= 25);
  for (const [path, leaf] of all) {
    assert.ok(leaf.sources.length >= 1, `${path} ohne Quelle`);
    for (const id of leaf.sources) assert.ok(SOURCES[id], `${path}: ${id}`);
  }
  for (const id of [...data.incomeTax.tariff.sources, ...data.incomeTax.sources, ...data.solidarity.sources, ...data.privateInsurance.subsidySources]) {
    assert.ok(SOURCES[id], id);
  }
});

test('Quellenkatalog: vollständige Einträge, https-URLs, Abrufdatum', () => {
  for (const [id, source] of Object.entries(SOURCES)) {
    assert.equal(source.id, id);
    assert.ok(source.label && source.publisher, id);
    assert.match(source.url, /^https:\/\//, id);
    assert.equal(source.accessed, '2026-10-01', id);
    if (source.date) assert.match(source.date, /^\d{4}-\d{2}-\d{2}$/, id);
  }
  assert.equal(new Set(Object.values(SOURCES).map((s) => s.url)).size, Object.keys(SOURCES).length, 'doppelte URLs');
});

test('Bundesländer: 16 eindeutige Kürzel, Kirchensteuer 8 % nur in BW und BY, Quellen vorhanden', () => {
  assert.equal(STATES.length, 16);
  assert.equal(new Set(STATE_CODES).size, 16);
  for (const state of STATES) {
    assert.equal(state.churchTaxRate, ['BW', 'BY'].includes(state.code) ? 8 : 9, state.code);
    for (const id of state.sources) assert.ok(SOURCES[id], `${state.code}: ${id}`);
  }
  assert.equal(findState('NW').code, 'NW');
  assert.equal(findState('XX'), undefined);
});

test('Datenmodul stimmt mit den Konstanten des amtlichen PAP überein', () => {
  const pap = new Lohnsteuer2026();
  pap.MPARA();
  const months = data.months;
  assert.equal(pap.BBGRVALV.toCents(), data.ceilings.pensionUnemploymentMonthly.value * months);
  assert.equal(pap.BBGKVPV.toCents(), data.ceilings.healthCareMonthly.value * months);
  assert.equal(data.ceilings.compulsoryInsuranceLimitYearly.value, 6450_00 * months);
  // Vorsorgepauschale: RV-/AV-Anteile des Arbeitnehmers, KV 7 % + Zusatz/2, PV 1,8 %
  assert.equal(pap.RVSATZAN.multiply(D(100)).toNumber(), data.pension.rate.value / 2);
  assert.equal(pap.AVSATZAN.multiply(D(100)).toNumber(), data.unemployment.rate.value / 2);
  assert.equal(pap.PVSATZAN.multiply(D(100)).toNumber(), data.care.employeeRate.value); // ohne Zuschlag/Abschlag
  assert.equal(data.health.employeeRate.value * 2, data.health.rate.value);
  assert.equal(data.care.employeeRate.value * 2, data.care.rate.value);
  assert.equal(data.minijob.employeePensionRate.value + data.minijob.employerPensionRate.value, data.pension.rate.value);
  assert.equal(data.transition.factorF.value, 0.6619);
  assert.equal(data.minijob.limitMonthly.value, 60300);
});

test('Höchstbetrag der Vorsorgepauschale (1.900 €) entspricht dem PAP', () => {
  const pap = new Lohnsteuer2026().setInputs({ LZZ: 2, RE4: 1_500_000, STKL: 1, KVZ: 2.9, PVZ: 1 });
  pap.run();
  assert.equal(pap.VSPHB.toCents(), data.incomeTax.provisionCap.value);
});

/** Einkommensteuertarif § 32a EStG aus den Datenkonstanten (nur Grundtarif, X in vollen Euro). */
function tariff(x) {
  const t = data.incomeTax.tariff;
  if (x <= 12348) return 0n;
  const X = D(x);
  const down = (v) => v.setScale(0, BigDecimal.ROUND_DOWN);
  if (x <= t.zone1.to) {
    const y = X.subtract(D(12348)).divide(D(10000), 6, BigDecimal.ROUND_DOWN);
    return down(y.multiply(D(t.zone1.a)).add(D(t.zone1.b)).multiply(y)).unscaled;
  }
  if (x <= t.zone2.to) {
    const z = X.subtract(D(t.zone2.offset)).divide(D(10000), 6, BigDecimal.ROUND_DOWN);
    return down(z.multiply(D(t.zone2.a)).add(D(t.zone2.b)).multiply(z).add(D(t.zone2.c))).unscaled;
  }
  if (x <= t.zone3.to) return down(X.multiply(D(t.zone3.rate)).subtract(D(t.zone3.constant))).unscaled;
  return down(X.multiply(D(t.zone4.rate)).subtract(D(t.zone4.constant))).unscaled;
}

test('Tarifkonstanten der Erklärung ergeben exakt die Steuer des amtlichen PAP (§ 32a EStG)', () => {
  const pap = new Lohnsteuer2026();
  pap.MPARA();
  pap.KZTAB = 1;
  const xs = new Set([12347, 12348, 12349, 12350, 17798, 17799, 17800, 17801, 69877, 69878, 69879, 69880, 277825, 277826, 277827, 1_000_000]);
  for (let x = 12000; x <= 300000; x += 37) xs.add(x);
  for (const x of xs) {
    pap.X = D(x);
    pap.UPTAB26();
    assert.equal(pap.ST.unscaled, tariff(x), `X = ${x}`);
  }
});

test('Soli-Parameter: Freigrenze aus dem PAP, Sätze aus den Daten stimmen mit dem PAP-Ergebnis überein', () => {
  const run = (re4, extra = {}) => {
    const pap = new Lohnsteuer2026().setInputs({ LZZ: 1, RE4: re4, STKL: 1, KVZ: 2.9, PVZ: 1, ...extra });
    pap.run();
    return pap;
  };
  const pap = run(15_000_000); // 150.000 € Jahresbrutto
  const jbmg = pap.JBMG;
  const full = jbmg.multiply(D(data.solidarity.rate.value)).divide(D(100), 2, BigDecimal.ROUND_DOWN);
  const mitigation = jbmg.subtract(pap.SOLZFREI).multiply(D(data.solidarity.mitigationRate.value)).divide(D(100), 2, BigDecimal.ROUND_DOWN);
  assert.equal(pap.SOLZJ.compareTo(full.min(mitigation)), 0);
  assert.equal(pap.SOLZFREI.toString(), '20350');
  const splitting = run(15_000_000, { STKL: 3 });
  assert.equal(splitting.SOLZFREI.toString(), '40700');
});
