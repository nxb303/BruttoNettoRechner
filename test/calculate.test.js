import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from '../src/engine/calculate.js';
import { SOURCES } from '../src/data/sources.js';
import { STATE_CODES } from '../src/data/states.js';
import { BASE_INPUT, SCENARIOS, input } from './helpers/scenarios.js';

const monthly = (result) => Object.fromEntries(result.items.map((i) => [i.id, i.monthly]));

test('Referenzfall: 5.000 €, StKl I, NRW, kirchensteuerpflichtig → Netto 3.059,68 €', () => {
  const result = calculate(BASE_INPUT);
  assert.equal(result.employment, 'regular');
  assert.deepEqual(monthly(result), {
    incomeTax: 78241,
    solidarity: 0,
    churchTax: 7041, // 78.241 Cent × 9 % abgerundet
    health: 36500,
    healthAdditional: 7250,
    care: 9000,
    careSurcharge: 3000,
    pension: 46500,
    unemployment: 6500,
  });
  assert.equal(result.totals.gross.monthly, 500000);
  assert.equal(result.totals.taxes.monthly, 85282);
  assert.equal(result.totals.social.monthly, 108750);
  assert.equal(result.totals.net.monthly, 305968);
  assert.equal(result.totals.net.yearly, 3671616);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.employer.total.monthly, 500000 + 36500 + 7250 + 9000 + 46500 + 6500);
});

test('Konsistenz in allen Szenarien: Netto, Jahreswerte, Gruppensummen', () => {
  for (const [name, scenario] of SCENARIOS) {
    const r = calculate(scenario);
    const sign = { tax: -1, social: -1, private: -1, subsidy: 1 };
    const net = r.totals.gross.monthly + r.items.reduce((acc, i) => acc + sign[i.group] * i.monthly, 0);
    assert.equal(r.totals.net.monthly, net, `${name}: Netto = Brutto − Abzüge`);
    for (const i of r.items) assert.equal(i.yearly, i.monthly * 12, `${name}: ${i.id} Jahr = 12 × Monat`);
    for (const t of Object.values(r.totals)) assert.equal(t.yearly, t.monthly * 12, name);
    assert.equal(r.totals.net.monthly + r.totals.taxes.monthly + r.totals.social.monthly, r.totals.gross.monthly, name);
    assert.ok(r.totals.net.monthly > 0 && r.totals.net.monthly <= r.totals.gross.monthly, `${name}: Netto plausibel`);
    assert.ok(r.items.every((i) => Number.isInteger(i.monthly) && i.monthly >= 0), `${name}: ganze Cent, nicht negativ`);
  }
});

test('Jeder Posten hat Rechenweg (≥ 1 Schritt) und gültige Quellen (≥ 1 ID)', () => {
  for (const [name, scenario] of SCENARIOS) {
    const r = calculate(scenario);
    for (const i of r.items) {
      assert.ok(i.explanation.steps.length >= 1, `${name}: ${i.id} ohne Schritte`);
      assert.ok(i.explanation.sources.length >= 1, `${name}: ${i.id} ohne Quellen`);
      for (const id of i.explanation.sources) assert.ok(SOURCES[id], `${name}: ${i.id} unbekannte Quelle ${id}`);
      for (const step of i.explanation.steps) {
        for (const id of step.sources ?? []) assert.ok(SOURCES[id], `${name}: ${step.key} unbekannte Quelle ${id}`);
      }
    }
    assert.ok(r.netExplanation.steps.length >= 1);
  }
});

test('Monats- und Jahreseingabe sind gleichwertig', () => {
  const month = calculate(input({ gross: 4000, period: 'month' }));
  const year = calculate(input({ gross: 48000, period: 'year' }));
  assert.deepEqual(monthly(month), monthly(year));
  assert.deepEqual(month.totals, year.totals);
  // Jahresbrutto wird auf Cent gerundet geteilt: 50.001 € / 12 = 4.166,75 €
  assert.equal(calculate(input({ gross: 50001, period: 'year' })).totals.gross.monthly, 416675);
});

test('Beschäftigungsarten und Hinweise', () => {
  const mini = calculate(input({ gross: 603 }));
  assert.equal(mini.employment, 'minijob');
  assert.deepEqual(monthly(mini), { incomeTax: 0, pension: 2171 });
  assert.equal(mini.totals.net.monthly, 60300 - 2171);
  assert.ok(mini.warnings.some((w) => w.key === 'warn.minijobFlatTax'));
  assert.deepEqual(
    mini.employer.items.map((e) => e.id).sort(),
    ['minijobHealth', 'minijobPension', 'minijobTax'],
  );

  assert.equal(calculate(input({ gross: 603.01 })).employment, 'midijob');
  const midi = calculate(input({ gross: 700 }));
  assert.equal(midi.employment, 'midijob');
  assert.ok(midi.warnings.some((w) => w.key === 'warn.midijob'));
  assert.ok(monthly(midi).health > 0);

  // Übergangsbereich ist steuerlich unbeachtlich: Lohnsteuer wie bei regulärer Beschäftigung
  const taxAt2000 = calculate(input({ gross: 2000 })).items[0].monthly;
  const reference = calculate(input({ gross: 2000, taxClass: 1 }));
  assert.equal(reference.employment, 'midijob');
  assert.equal(taxAt2000, reference.items[0].monthly);

  assert.equal(calculate(input({ gross: 2000.01 })).employment, 'regular');
});

test('Hinweise zu Steuerklassen, Faktor und PKV', () => {
  const keys = (overrides) => calculate(input(overrides)).warnings.map((w) => w.key);
  assert.deepEqual(keys({ taxClass: 2 }), ['warn.class2NeedsChild']);
  assert.deepEqual(keys({ taxClass: 3, factor: 0.9 }), ['warn.factorOnlyClass4']);
  assert.deepEqual(keys({ taxClass: 5, childAllowances: 1 }), ['warn.childAllowancesClass56']);
  const pkv = { type: 'private', kvPremium: 500, pvPremium: 100, employerSubsidy: true };
  assert.deepEqual(keys({ gross: 5000, health: pkv }), ['warn.pkvBelowJaeg']);
  assert.deepEqual(keys({ gross: 7000, health: pkv }), []);
});

test('Faktorverfahren wirkt nur in Steuerklasse IV', () => {
  const plain = calculate(input({ taxClass: 4 })).items[0].monthly;
  const withFactor = calculate(input({ taxClass: 4, factor: 0.912 })).items[0].monthly;
  const ignored = calculate(input({ taxClass: 1, factor: 0.912 })).items[0].monthly;
  assert.ok(withFactor < plain);
  assert.equal(ignored, calculate(input({ taxClass: 1 })).items[0].monthly);
});

test('Kinderfreibeträge mindern Soli und Kirchensteuer, nicht die Lohnsteuer', () => {
  const none = calculate(input({ gross: 9000, childAllowances: 0 }));
  const two = calculate(input({ gross: 9000, childAllowances: 2 }));
  assert.equal(monthly(two).incomeTax, monthly(none).incomeTax);
  assert.ok(monthly(two).solidarity < monthly(none).solidarity);
  assert.ok(monthly(two).churchTax < monthly(none).churchTax);
  // Steuerklassen V/VI ignorieren Kinderfreibeträge
  assert.deepEqual(monthly(calculate(input({ taxClass: 5, childAllowances: 2 }))), monthly(calculate(input({ taxClass: 5 }))));
});

test('Kirchensteuer: 8 % in BW und BY, sonst 9 %; ohne Pflicht kein Posten', () => {
  const church = (state) => calculate(input({ state, gross: 4000 }));
  const base = monthly(church('NW')).incomeTax;
  assert.equal(monthly(church('NW')).churchTax, Math.floor((base * 9) / 100));
  assert.equal(monthly(church('BY')).churchTax, Math.floor((base * 8) / 100));
  assert.equal(monthly(church('BW')).churchTax, Math.floor((base * 8) / 100));
  for (const code of STATE_CODES) assert.ok(church(code).items.some((i) => i.id === 'churchTax'));
  assert.equal(calculate(input({ churchTax: false })).items.some((i) => i.id === 'churchTax'), false);
});

test('Sachsen: höhere Pflegeversicherung des Arbeitnehmers', () => {
  assert.equal(monthly(calculate(input({ state: 'SN' }))).care, 11500);
  assert.equal(monthly(calculate(input({ state: 'BY' }))).care, 9000);
});

test('Private Krankenversicherung: Beiträge, Zuschuss und Netto', () => {
  const r = calculate(
    input({ gross: 9000, churchTax: false, health: { type: 'private', kvPremium: 600, pvPremium: 120, employerSubsidy: true } }),
  );
  const m = monthly(r);
  assert.equal(m.pkv, 60000);
  assert.equal(m.ppv, 12000);
  assert.equal(m.employerSubsidy, 30000 + 6000); // Hälfte der Beiträge, unter den Höchstbeträgen
  assert.equal(m.health, undefined);
  assert.equal(m.pension, 78585);
  assert.equal(r.totals.social.monthly, 78585 + 10985 + 60000 + 12000 - 36000);
  const without = calculate(
    input({ gross: 9000, churchTax: false, health: { type: 'private', kvPremium: 600, pvPremium: 120, employerSubsidy: false } }),
  );
  assert.equal(monthly(without).employerSubsidy, undefined);
  // Ohne Zuschuss ist die Vorsorgepauschale höher → niedrigere Lohnsteuer
  assert.ok(monthly(without).incomeTax <= m.incomeTax);
});

test('Lohnsteuer-Freibetrag (ELStAM) mindert die Lohnsteuer', () => {
  const with250 = calculate(input({ monthlyTaxAllowance: 250 }));
  assert.ok(monthly(with250).incomeTax < monthly(calculate(BASE_INPUT)).incomeTax);
  assert.ok(with250.items[0].explanation.steps.some((s) => s.key === 'explain.incomeTax.step.allowance'));
});

test('Erklärung der Lohnsteuer enthält Vorsorgepauschale, Tarif und Monatsanteil', () => {
  const steps = calculate(BASE_INPUT).items[0].explanation.steps.map((s) => s.key);
  for (const key of [
    'annual', 'anp', 'sap', 'vspPension', 'vspHealth', 'vspUnemployment', 'vspCap', 'vspTotal',
    'taxableIncome', 'tariffBase', 'tariffZone2', 'annualTax', 'monthlyTax',
  ]) {
    assert.ok(steps.includes(`explain.incomeTax.step.${key}`), key);
  }
});

test('Erklärung der Steuer ist in sich stimmig (Soli, Vorsorgepauschale, zvE)', () => {
  for (const [name, scenario] of SCENARIOS) {
    const r = calculate(scenario);
    const byKey = (item, key) => r.items.find((i) => i.id === item)?.explanation.steps.find((s) => s.key === key);
    const soli = byKey('solidarity', 'explain.solidarity.step.aboveLimit');
    if (soli) {
      const { full, mitigation, result } = soli.values;
      assert.equal(result.eur, Math.min(full.eur, mitigation.eur), `${name}: Soli = Minimum`);
    }
    const total = byKey('incomeTax', 'explain.incomeTax.step.vspTotal');
    if (total) {
      const { a, b, result } = total.values;
      assert.equal(result.eur, Math.max(a.eur, b.eur), `${name}: VSP = höherer Wert`);
    }
    const zve = byKey('incomeTax', 'explain.incomeTax.step.taxableIncome');
    if (zve) {
      const { annual, deductions, vsp, zve: result } = zve.values;
      assert.equal(result.eur, Math.max(0, annual.eur - deductions.eur - vsp.eur), `${name}: zvE`);
    }
  }
});

test('Ungültige Eingaben werden mit Fehlercodes abgelehnt', () => {
  const fails = (overrides) => {
    try {
      calculate(input(overrides));
    } catch (error) {
      return error.errors.map((e) => e.code);
    }
    return null;
  };
  assert.deepEqual(fails({ gross: 0 }), ['gross.range']);
  assert.deepEqual(fails({ gross: 1000.123 }), ['gross.decimals']);
  assert.deepEqual(fails({ taxClass: 7 }), ['taxClass.invalid']);
  assert.deepEqual(fails({ state: 'XX' }), ['state.invalid']);
  assert.deepEqual(fails({ taxClass: 4, factor: 1.2 }), ['factor.range']);
  assert.deepEqual(fails({ taxClass: 4, factor: 0.9123 }), ['factor.range']);
  assert.deepEqual(fails({ childAllowances: 0.7 }), ['childAllowances.range']);
  assert.deepEqual(fails({ health: { type: 'statutory', additionalRate: -1 } }), ['additionalRate.range']);
  assert.deepEqual(fails({ year: 2020 }), ['year.invalid']);
  assert.equal(fails({ factor: 0.5 }), null); // Faktor außerhalb IV ist nur ein Hinweis
});
