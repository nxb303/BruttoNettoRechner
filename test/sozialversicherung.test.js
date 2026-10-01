import { test } from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/2026.js';
import {
  buildRates,
  calculateSocialInsurance,
  classifyEmployment,
  midijobBases,
  privateSubsidy,
} from '../src/engine/sozialversicherung.js';

const LIMITS_2026 = {
  minijob: data.minijob.limitMonthly.value,
  transitionUpper: data.transition.upperLimitMonthly.value,
  ceilingKvPv: data.ceilings.healthCareMonthly.value,
  ceilingRvAv: data.ceilings.pensionUnemploymentMonthly.value,
  factorF: data.transition.factorF.value,
};
const MINIJOB = {
  exempt: false,
  employeePensionRate: data.minijob.employeePensionRate.value,
  employerPensionRate: data.minijob.employerPensionRate.value,
  employerHealthRate: data.minijob.employerHealthRate.value,
  employerFlatTaxRate: data.minijob.employerFlatTaxRate.value,
};
const person = (overrides = {}) => ({
  state: 'NW',
  health: { type: 'statutory', additionalRate: 2.9 },
  care: { hasChildren: false, childrenUnder25: 0, age23OrOlder: true },
  ...overrides,
});

/** Beiträge aus Cent-Bruttoentgelt; Rückgabe: Arbeitnehmeranteile je Zweig in Cent. */
function run(grossCents, personOverrides = {}, ctxOverrides = {}) {
  const input = person(personOverrides);
  return calculateSocialInsurance({
    grossCents,
    limits: LIMITS_2026,
    rates: buildRates(data, input),
    statutory: input.health.type === 'statutory',
    pensionInsured: true,
    unemploymentInsured: true,
    minijob: MINIJOB,
    ...ctxOverrides,
  });
}
const employee = (result) => Object.fromEntries(Object.entries(result.branches).map(([k, v]) => [k, v.employee]));
const employer = (result) => Object.fromEntries(Object.entries(result.branches).map(([k, v]) => [k, v.employer]));

test('Gemeinsames Rundschreiben, Beispiel 8 (Übergangsbereich) mit den Werten des Beispiels', () => {
  // G = 520, OG = 2.000, F = 0,6922, KV 14,6 %, ZB 1,5 %, PV 3,05 % + 0,35 %, RV 18,6 %, AV 2,6 %
  const limits = { ...LIMITS_2026, minijob: 52000, factorF: 0.6922 };
  const rates = {
    kv: { total: 14.6, employee: 7.3 },
    kvAdditional: { total: 1.5, employee: 0.75 },
    pv: { total: 3.05, employee: 1.525 },
    pvSurcharge: 0.35,
    pvReduction: 0,
    pvReductionChildren: 0,
    pvSaxony: false,
    rv: { total: 18.6, employee: 9.3 },
    av: { total: 2.6, employee: 1.3 },
  };
  const bases = midijobBases(95000, limits);
  assert.equal(bases.be.toString(), '836.45');
  assert.equal(bases.beAn.toString(), '581.08');

  const result = calculateSocialInsurance({
    grossCents: 95000,
    limits,
    rates,
    statutory: true,
    pensionInsured: true,
    unemploymentInsured: true,
    minijob: MINIJOB,
  });
  assert.equal(result.employment, 'midijob');
  assert.deepEqual(result.midijob, { be: 83645, beAn: 58108 });
  assert.deepEqual(employee(result), {
    health: 4242,
    healthAdditional: 436,
    care: 886,
    careSurcharge: 293,
    pension: 5404,
    unemployment: 755,
  });
  const ag = employer(result);
  assert.equal(ag.health + ag.healthAdditional, 8788); // 79,70 + 8,18
  assert.equal(ag.care, 1666);
  assert.equal(ag.pension, 10154);
  assert.equal(ag.unemployment, 1419);
  assert.equal(ag.careSurcharge, 0);
});

test('Übergangsbereich 2026 (kinderlos, ≥ 23, ZB 2,9 %): 1.000 €', () => {
  const r = run(100000);
  assert.deepEqual(r.midijob, { be: 85406, beAn: 56836 });
  assert.deepEqual(employee(r), {
    health: 4149,
    healthAdditional: 824,
    care: 1023,
    careSurcharge: 512,
    pension: 5286,
    unemployment: 739,
  });
  assert.equal(Object.values(employee(r)).reduce((a, b) => a + b, 0), 12533);
});

test('Übergangsbereich 2026: 1.500 €', () => {
  const r = run(150000);
  assert.deepEqual(r.midijob, { be: 142703, beAn: 128418 });
  assert.deepEqual(employee(r), {
    health: 9375,
    healthAdditional: 1862,
    care: 2312,
    careSurcharge: 856,
    pension: 11943,
    unemployment: 1669,
  });
  assert.equal(Object.values(employee(r)).reduce((a, b) => a + b, 0), 28017);
});

test('Übergangsbereich 2026: 2.000 € – BE = BE_AN, stetig zur regulären Berechnung', () => {
  const mid = run(200000);
  assert.deepEqual(mid.midijob, { be: 200000, beAn: 200000 });
  assert.equal(Object.values(employee(mid)).reduce((a, b) => a + b, 0), 43500);
  // Ein Cent darüber: reguläre Berechnung mit identischen Ergebnissen am Rand
  const regular = run(200000, {}, { limits: { ...LIMITS_2026, transitionUpper: 199999 } });
  assert.equal(regular.employment, 'regular');
  assert.deepEqual(employee(regular), employee(mid));
  assert.deepEqual(employer(regular), employer(mid));
});

test('Beschäftigungsart: Grenzen 603,00 / 603,01 / 2.000,00 / 2.000,01', () => {
  assert.equal(classifyEmployment(60300, LIMITS_2026), 'minijob');
  assert.equal(classifyEmployment(60301, LIMITS_2026), 'midijob');
  assert.equal(classifyEmployment(200000, LIMITS_2026), 'midijob');
  assert.equal(classifyEmployment(200001, LIMITS_2026), 'regular');
});

test('Übergangsbereich: Arbeitgeberanteil = Gesamtbeitrag − Arbeitnehmeranteil, Zuschlag nur Arbeitnehmer', () => {
  const r = run(100000);
  // Gesamtbeitrag KV: round(854,06 × 7,3 %) × 2 = 62,35 × 2 = 124,70; AN 41,49
  assert.equal(r.branches.health.employer, 12470 - 4149);
  assert.equal(r.branches.careSurcharge.employer, 0);
});

test('Übergangsbereich: Kinderabschlag mindert nur den Arbeitnehmeranteil (§ 2 Abs. 2 BVV)', () => {
  const noKids = run(100000, { care: { hasChildren: true, childrenUnder25: 1, age23OrOlder: true } });
  const threeKids = run(100000, { care: { hasChildren: true, childrenUnder25: 3, age23OrOlder: true } });
  // 2 Abschläge × 0,25 % von BE_AN 568,36 = 2 × 1,42 → round(568,36 × 0,5 %) = 2,84
  assert.equal(noKids.branches.care.employee - threeKids.branches.care.employee, 284);
  assert.equal(noKids.branches.care.employer, threeKids.branches.care.employer);
  assert.equal(threeKids.branches.careSurcharge, undefined);
});

test('Regulär: Kappung an den Beitragsbemessungsgrenzen', () => {
  const at7000 = run(700000);
  assert.equal(at7000.branches.health.base, 581250);
  assert.equal(at7000.branches.care.base, 581250);
  assert.equal(at7000.branches.pension.base, 700000);
  assert.equal(at7000.branches.pension.employee, 65100);
  const at10000 = run(1000000);
  assert.equal(at10000.branches.pension.base, 845000);
  assert.equal(at10000.branches.pension.employee, 78585);
  assert.equal(at10000.branches.unemployment.employee, 10985);
  assert.equal(at10000.branches.health.employee, 42431); // 5.812,50 × 7,3 %
  assert.equal(at10000.branches.healthAdditional.employee, 8428); // 5.812,50 × 1,45 %
});

test('Regulär: 5.000 € wie im Referenzfall', () => {
  assert.deepEqual(employee(run(500000)), {
    health: 36500,
    healthAdditional: 7250,
    care: 9000,
    careSurcharge: 3000,
    pension: 46500,
    unemployment: 6500,
  });
});

test('Sachsen: Arbeitnehmer trägt 2,3 %, Arbeitgeber 1,3 % der Pflegeversicherung', () => {
  const r = run(500000, { state: 'SN' });
  assert.equal(r.branches.care.employee, 11500);
  assert.equal(r.branches.care.employer, 6500);
});

test('Pflegeversicherung: Abschläge ab dem 2. Kind, höchstens vier, nur ohne Kinderlosenzuschlag', () => {
  const careEmployee = (children, extra = {}) =>
    run(500000, { care: { hasChildren: true, childrenUnder25: children, age23OrOlder: true, ...extra } }).branches.care.employee;
  assert.equal(careEmployee(0), 9000); // 1,8 % ohne Abschlag
  assert.equal(careEmployee(1), 9000);
  assert.equal(careEmployee(2), 9000 - 1250); // 1,55 %
  assert.equal(careEmployee(3), 9000 - 2500);
  assert.equal(careEmployee(5), 9000 - 5000); // vier Abschläge
  assert.equal(careEmployee(6), 9000 - 5000); // gedeckelt
  assert.equal(careEmployee(10), 9000 - 5000);
  const parent = run(500000, { care: { hasChildren: true, childrenUnder25: 2, age23OrOlder: true } });
  assert.equal(parent.branches.careSurcharge, undefined);
  const childlessYoung = run(500000, { care: { hasChildren: false, childrenUnder25: 0, age23OrOlder: false } });
  assert.equal(childlessYoung.branches.careSurcharge, undefined);
  assert.equal(childlessYoung.branches.care.employee, 9000);
});

test('Ohne Rentenversicherungs- bzw. Arbeitslosenversicherungspflicht entfallen die Zweige', () => {
  const r = run(500000, {}, { pensionInsured: false, unemploymentInsured: false });
  assert.equal(r.branches.pension, undefined);
  assert.equal(r.branches.unemployment, undefined);
  assert.ok(r.branches.health);
});

test('Zusatzbeitrag 0: kein Zusatzbeitragsposten', () => {
  const r = run(500000, { health: { type: 'statutory', additionalRate: 0 } });
  assert.equal(r.branches.healthAdditional, undefined);
});

test('PKV: nur Renten- und Arbeitslosenversicherung vom Lohn', () => {
  const r = run(500000, { health: { type: 'private', kvPremium: 600, pvPremium: 120, employerSubsidy: true } }, { statutory: false });
  assert.deepEqual(Object.keys(r.branches).sort(), ['pension', 'unemployment']);
  const mid = run(100000, { health: { type: 'private', kvPremium: 600, pvPremium: 120, employerSubsidy: true } }, { statutory: false });
  assert.deepEqual(Object.keys(mid.branches).sort(), ['pension', 'unemployment']);
  assert.equal(mid.branches.pension.employee, 5286);
});

test('Minijob: 500 € → RV-Eigenanteil 18,00 €; befreit → 0; Arbeitgeber-Pauschalen', () => {
  const r = run(50000);
  assert.equal(r.employment, 'minijob');
  assert.deepEqual(employee(r), { pension: 1800 });
  assert.deepEqual(r.employerExtra, { minijobPension: 7500, minijobHealth: 6500, minijobTax: 1000 });
  const exempt = run(50000, {}, { minijob: { ...MINIJOB, exempt: true } });
  assert.deepEqual(employee(exempt), { pension: 0 });
  const privateInsured = run(50000, {}, { statutory: false });
  assert.equal(privateInsured.employerExtra.minijobHealth, 0);
  const notInsured = run(50000, {}, { pensionInsured: false });
  assert.deepEqual(notInsured.branches, {});
  assert.deepEqual(employee(run(60300)), { pension: 2171 }); // 603 × 3,6 % = 21,708
});

test('Jeder Zweig hat Erklärungsschritte und Quellen', () => {
  for (const cents of [50000, 100000, 500000, 1000000]) {
    for (const branch of Object.values(run(cents).branches)) {
      assert.ok(branch.steps.length >= 1);
      assert.ok(branch.sources.length >= 1);
    }
  }
});

const SUBSIDY = {
  ceilingKvPv: 581250,
  employerHealthRate: 7.3,
  averageAdditionalRate: 2.9,
  employerCareRate: 1.8,
};

test('PKV-Zuschuss: Hälfte des Beitrags, begrenzt auf 508,59 € (KV) und 104,63 € (PV)', () => {
  assert.equal(privateSubsidy({ ...SUBSIDY, kvPremiumCents: 10000, pvPremiumCents: 10000 }).health.result, 5000);
  const capped = privateSubsidy({ ...SUBSIDY, kvPremiumCents: 120000, pvPremiumCents: 30000 });
  assert.equal(capped.health.result, 50859);
  assert.equal(capped.health.cap, 50859);
  assert.equal(capped.care.cap, 10463);
  assert.equal(capped.care.result, 10463);
  assert.equal(capped.total, 50859 + 10463);
  const uncapped = privateSubsidy({ ...SUBSIDY, kvPremiumCents: 60001, pvPremiumCents: 12001 });
  assert.equal(uncapped.health.half, 30001); // 300,005 kaufmännisch gerundet
  assert.equal(uncapped.care.result, 6001);
});

test('PKV-Zuschuss Sachsen: Pflege höchstens 75,56 €', () => {
  const r = privateSubsidy({ ...SUBSIDY, employerCareRate: 1.3, kvPremiumCents: 50000, pvPremiumCents: 30000 });
  assert.equal(r.care.cap, 7556);
  assert.equal(r.care.result, 7556);
});
