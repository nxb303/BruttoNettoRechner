/**
 * Sozialversicherungsbeiträge des Arbeitnehmers (und Arbeitgeberanteile) für
 * reguläre Beschäftigung, Übergangsbereich (Midijob) und Minijob.
 *
 * Alle Beträge laufen über BigDecimal; jeder Posten wird einzeln kaufmännisch
 * auf Cent gerundet. Die Funktionen sind vollständig parametrisiert (Grenzen,
 * Faktor F, Beitragssätze), damit auch das Rechenbeispiel des Gemeinsamen
 * Rundschreibens mit seinen eigenen Werten nachgerechnet werden kann.
 * Die Engine ist sprachneutral und liefert Erklärungsschritte als Schlüssel + Werte.
 */
import { BigDecimal } from './decimal.js';
import { eur, pct } from './units.js';

const { ROUND_HALF_UP } = BigDecimal;
const D = (x) => BigDecimal.valueOf(x);
const HUNDRED = D(100);
const TWO = D(2);

/** Betrag × Satz in Prozent, exakt gerechnet und kaufmännisch auf Cent gerundet. */
const share = (base, ratePercent) => base.multiply(D(ratePercent)).divide(HUNDRED, 2, ROUND_HALF_UP);
const half = (percent) => D(percent).divide(TWO).toNumber();
const cents = (euro) => euro.toCents();
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * @typedef {{total: number, employee: number}} SplitRate  Satz in Prozent (gesamt / Arbeitnehmeranteil)
 * @typedef {{
 *   kv: SplitRate, kvAdditional: SplitRate, pv: SplitRate, rv: SplitRate, av: SplitRate,
 *   pvSurcharge: number, pvReduction: number, pvReductionChildren: number, pvSaxony: boolean
 * }} Rates
 */

/** Beschäftigungsart anhand des monatlichen Bruttos (Cent). */
export function classifyEmployment(grossCents, limits) {
  if (grossCents <= limits.minijob) return 'minijob';
  if (grossCents <= limits.transitionUpper) return 'midijob';
  return 'regular';
}

/**
 * Beitragssätze für eine Person aus den Jahresdaten.
 * @param {object} data Jahresdaten (src/data/<Jahr>.js)
 * @param {{state: string, health: object, care: object}} input
 * @returns {Rates}
 */
export function buildRates(data, input) {
  const { health, care, pension, unemployment } = data;
  const additional = input.health.type === 'statutory' ? input.health.additionalRate : 0;
  const hasChildren = input.care.hasChildren;
  const reductionChildren = hasChildren
    ? clamp(input.care.childrenUnder25 - 1, 0, care.maxReductionChildren)
    : 0;
  const saxony = input.state === 'SN';
  return {
    kv: { total: health.rate.value, employee: health.employeeRate.value },
    kvAdditional: { total: additional, employee: half(additional) },
    pv: {
      total: care.rate.value,
      employee: saxony ? care.employeeRateSaxony.value : care.employeeRate.value,
    },
    pvSurcharge: !hasChildren && input.care.age23OrOlder ? care.childlessSurcharge.value : 0,
    pvReduction: D(care.reductionPerChild.value).multiply(D(reductionChildren)).toNumber(),
    pvReductionChildren: reductionChildren,
    pvSaxony: saxony,
    rv: { total: pension.rate.value, employee: half(pension.rate.value) },
    av: { total: unemployment.rate.value, employee: half(unemployment.rate.value) },
  };
}

// ----------------------------------------------------------- Übergangsbereich

/**
 * Beitragspflichtige Einnahmen im Übergangsbereich (§ 20 Abs. 2a SGB IV), in Euro, auf Cent gerundet:
 *   BE   = F·G + (OG/(OG−G) − G/(OG−G)·F) · (AE − G)   Grundlage Gesamtbeitrag und Kinderlosenzuschlag
 *   BE_AN = OG/(OG−G) · (AE − G)                        Grundlage Arbeitnehmeranteil
 * Die Division durch (OG − G) bricht nicht ab; deshalb wird erst am Ende einmal gerundet.
 * @param {number} grossCents Arbeitsentgelt AE
 * @param {{minijob: number, transitionUpper: number, factorF: number}} limits G, OG in Cent
 */
export function midijobBases(grossCents, limits) {
  const ae = BigDecimal.fromCents(grossCents);
  const g = BigDecimal.fromCents(limits.minijob);
  const og = BigDecimal.fromCents(limits.transitionUpper);
  const f = D(limits.factorF);
  const span = og.subtract(g);
  const be = f
    .multiply(g)
    .multiply(span)
    .add(og.subtract(g.multiply(f)).multiply(ae.subtract(g)))
    .divide(span, 2, ROUND_HALF_UP);
  const beAn = og.multiply(ae.subtract(g)).divide(span, 2, ROUND_HALF_UP);
  return { be, beAn };
}

// ------------------------------------------------------------- Beitragszweige

/**
 * Beschreibung der Versicherungszweige. `ceiling` verweist auf die Beitragsbemessungsgrenze
 * in `limits`; `rate(rates)` liefert Gesamt- und Arbeitnehmersatz.
 */
const BRANCHES = [
  {
    id: 'health',
    ceiling: 'ceilingKvPv',
    rate: (r) => r.kv,
    sources: ['sgb5-241', 'sgb5-249', 'svbezgrv-2026'],
  },
  {
    id: 'healthAdditional',
    ceiling: 'ceilingKvPv',
    rate: (r) => r.kvAdditional,
    sources: ['sgb5-242', 'sgb5-242a', 'bmg-zusatzbeitrag-2026', 'svbezgrv-2026'],
  },
  {
    id: 'care',
    ceiling: 'ceilingKvPv',
    rate: (r) => r.pv,
    sources: ['sgb11-55', 'sgb11-58', 'svbezgrv-2026'],
  },
  {
    id: 'pension',
    ceiling: 'ceilingRvAv',
    rate: (r) => r.rv,
    sources: ['sgb6-158', 'svbezgrv-2026'],
  },
  {
    id: 'unemployment',
    ceiling: 'ceilingRvAv',
    rate: (r) => r.av,
    sources: ['sgb3-341', 'svbezgrv-2026'],
  },
];

const MIDIJOB_SOURCES = ['sgb4-20', 'rs-uebergangsbereich', 'bvv-2', 'bmas-faktor-f-2026'];

/** Erklärungsschritt zum Beitragssatz des Zweigs. */
function rateStep(def, rates) {
  const { total, employee } = def.rate(rates);
  switch (def.id) {
    case 'care':
      return rates.pvSaxony
        ? { key: 'explain.care.step.rateSaxony', values: { total: pct(total), rate: pct(employee), employerRate: pct(total - employee) } }
        : { key: 'explain.care.step.rate', values: { total: pct(total), rate: pct(employee) } };
    default:
      return { key: `explain.${def.id}.step.rate`, values: { total: pct(total), rate: pct(employee) } };
  }
}

function reductionStep(rates) {
  return {
    key: 'explain.care.step.reduction',
    values: {
      count: rates.pvReductionChildren,
      perChild: pct(rates.pvReduction / rates.pvReductionChildren),
      reduction: pct(rates.pvReduction),
    },
  };
}

const amountStep = (baseCents, ratePercent, amountCents) => ({
  key: 'explain.sv.step.amount',
  values: { base: eur(baseCents), rate: pct(ratePercent), amount: eur(amountCents) },
});

/** Reguläre Beschäftigung: Beiträge aus dem auf die BBG begrenzten Entgelt. */
function regularBranches(ctx, active) {
  const { grossCents, limits, rates } = ctx;
  const result = {};
  for (const def of BRANCHES.filter((b) => active.has(b.id))) {
    const ceiling = limits[def.ceiling];
    const baseCents = Math.min(grossCents, ceiling);
    const base = BigDecimal.fromCents(baseCents);
    const { total, employee } = def.rate(rates);
    const reduction = def.id === 'care' ? rates.pvReduction : 0;
    const employeeRate = D(employee).subtract(D(reduction)).toNumber();
    const employeeAmount = cents(share(base, employeeRate));
    const steps = [
      {
        key: grossCents > ceiling ? 'explain.sv.step.baseCapped' : 'explain.sv.step.base',
        values: { gross: eur(grossCents), ceiling: eur(ceiling), base: eur(baseCents) },
      },
      rateStep(def, rates),
    ];
    if (reduction > 0) steps.push(reductionStep(rates));
    steps.push(amountStep(baseCents, employeeRate, employeeAmount));
    result[def.id] = {
      base: baseCents,
      employee: employeeAmount,
      employer: cents(share(base, D(total).subtract(D(employee)).toNumber())),
      steps,
      sources: def.sources,
    };
  }
  if (active.has('careSurcharge')) {
    const baseCents = Math.min(grossCents, limits.ceilingKvPv);
    const amount = cents(share(BigDecimal.fromCents(baseCents), rates.pvSurcharge));
    result.careSurcharge = {
      base: baseCents,
      employee: amount,
      employer: 0,
      steps: [
        {
          key: grossCents > limits.ceilingKvPv ? 'explain.sv.step.baseCapped' : 'explain.sv.step.base',
          values: { gross: eur(grossCents), ceiling: eur(limits.ceilingKvPv), base: eur(baseCents) },
        },
        { key: 'explain.careSurcharge.step.rate', values: { rate: pct(rates.pvSurcharge) } },
        amountStep(baseCents, rates.pvSurcharge, amount),
      ],
      sources: ['sgb11-55', 'svbezgrv-2026'],
    };
  }
  return result;
}

/**
 * Übergangsbereich nach § 20 Abs. 2a SGB IV und § 2 Abs. 2 BVV:
 * Gesamtbeitrag je Zweig = round(BE × halber Satz) × 2; Arbeitnehmeranteil aus BE_AN;
 * Arbeitgeberanteil = Gesamtbeitrag − Arbeitnehmeranteil (ohne Zuschlag und ohne
 * den durch Kinderabschläge verminderten Betrag).
 */
function midijobBranches(ctx, active) {
  const { grossCents, limits, rates } = ctx;
  const { be, beAn } = midijobBases(grossCents, limits);
  const beCents = cents(be);
  const beAnCents = cents(beAn);
  const bases = { gross: eur(grossCents), g: eur(limits.minijob), og: eur(limits.transitionUpper), f: limits.factorF };
  const beStep = { key: 'explain.midijob.step.be', values: { ...bases, be: eur(beCents) } };
  const beAnStep = { key: 'explain.midijob.step.beAn', values: { ...bases, beAn: eur(beAnCents) } };
  const result = {};
  for (const def of BRANCHES.filter((b) => active.has(b.id))) {
    const { total, employee } = def.rate(rates);
    const employeeShare = share(beAn, employee);
    const reduction = def.id === 'care' && rates.pvReduction > 0 ? share(beAn, rates.pvReduction) : null;
    const totalContribution = share(be, half(total)).multiply(TWO);
    const employeeAmount = cents(reduction ? employeeShare.subtract(reduction) : employeeShare);
    const steps = [beAnStep, rateStep(def, rates), amountStep(beAnCents, employee, cents(employeeShare))];
    if (reduction) {
      steps.push({
        key: 'explain.care.step.reductionMidijob',
        values: {
          count: rates.pvReductionChildren,
          base: eur(beAnCents),
          reduction: pct(rates.pvReduction),
          amount: eur(cents(reduction)),
          result: eur(employeeAmount),
        },
      });
    }
    result[def.id] = {
      base: beAnCents,
      employee: employeeAmount,
      employer: cents(totalContribution.subtract(employeeShare)),
      steps,
      sources: [...def.sources, ...MIDIJOB_SOURCES],
    };
  }
  if (active.has('careSurcharge')) {
    const amount = cents(share(be, rates.pvSurcharge));
    result.careSurcharge = {
      base: beCents,
      employee: amount,
      employer: 0,
      steps: [
        beStep,
        { key: 'explain.careSurcharge.step.rate', values: { rate: pct(rates.pvSurcharge) } },
        amountStep(beCents, rates.pvSurcharge, amount),
      ],
      sources: ['sgb11-55', ...MIDIJOB_SOURCES],
    };
  }
  return { branches: result, be: beCents, beAn: beAnCents };
}

/**
 * Minijob: Arbeitnehmer zahlt nur den Eigenanteil zur Rentenversicherung
 * (Beitragssatz abzüglich Pauschalbeitrag des Arbeitgebers), sofern nicht befreit.
 */
function minijobBranches(ctx) {
  const { grossCents, rates, minijob, pensionInsured } = ctx;
  if (!pensionInsured) return {};
  if (minijob.exempt) {
    const steps = [{ key: 'explain.minijob.step.pensionExempt', values: {} }];
    return { pension: { base: grossCents, employee: 0, employer: 0, steps, sources: ['sgb6-168', 'sgb4-8'] } };
  }
  const amount = cents(share(BigDecimal.fromCents(grossCents), minijob.employeePensionRate));
  const steps = [
    {
      key: 'explain.minijob.step.pensionRate',
      values: {
        total: pct(rates.rv.total),
        employer: pct(minijob.employerPensionRate),
        rate: pct(minijob.employeePensionRate),
      },
    },
    amountStep(grossCents, minijob.employeePensionRate, amount),
  ];
  return {
    pension: { base: grossCents, employee: amount, employer: 0, steps, sources: ['sgb6-168', 'sgb6-172', 'sgb4-8'] },
  };
}

/**
 * @param {{
 *   grossCents: number,
 *   limits: {minijob: number, transitionUpper: number, ceilingKvPv: number, ceilingRvAv: number, factorF: number},
 *   rates: Rates,
 *   statutory: boolean,
 *   pensionInsured: boolean,
 *   unemploymentInsured: boolean,
 *   minijob: {exempt: boolean, employeePensionRate: number, employerPensionRate: number, employerHealthRate: number, employerFlatTaxRate: number}
 * }} ctx
 */
export function calculateSocialInsurance(ctx) {
  const employment = classifyEmployment(ctx.grossCents, ctx.limits);
  if (employment === 'minijob') {
    const branches = minijobBranches(ctx);
    const { grossCents, minijob, statutory } = ctx;
    const flat = (rate) => cents(share(BigDecimal.fromCents(grossCents), rate));
    return {
      employment,
      branches,
      employerExtra: {
        minijobPension: flat(minijob.employerPensionRate),
        minijobHealth: statutory ? flat(minijob.employerHealthRate) : 0,
        minijobTax: flat(minijob.employerFlatTaxRate),
      },
    };
  }

  const active = new Set();
  if (ctx.statutory) {
    active.add('health');
    if (ctx.rates.kvAdditional.total > 0) active.add('healthAdditional');
    active.add('care');
    if (ctx.rates.pvSurcharge > 0) active.add('careSurcharge');
  }
  if (ctx.pensionInsured) active.add('pension');
  if (ctx.unemploymentInsured) active.add('unemployment');

  if (employment === 'midijob') {
    const { branches, be, beAn } = midijobBranches(ctx, active);
    return { employment, branches, midijob: { be, beAn } };
  }
  return { employment, branches: regularBranches(ctx, active) };
}

// ------------------------------------------------- Private Krankenversicherung

/**
 * Steuerfreier Arbeitgeberzuschuss zur privaten Kranken- und Pflege-Pflichtversicherung
 * (§ 257 Abs. 2 SGB V, § 61 Abs. 2 SGB XI): Hälfte des Beitrags, höchstens der Betrag,
 * den der Arbeitgeber bei gesetzlicher Versicherung trüge.
 * @param {{
 *   kvPremiumCents: number, pvPremiumCents: number,
 *   ceilingKvPv: number, employerHealthRate: number, averageAdditionalRate: number,
 *   employerCareRate: number
 * }} p
 */
export function privateSubsidy(p) {
  const ceiling = BigDecimal.fromCents(p.ceilingKvPv);
  const healthRate = D(p.employerHealthRate).add(D(p.averageAdditionalRate).divide(TWO)).toNumber();
  const part = (premiumCents, ratePercent) => {
    const halfPremium = BigDecimal.fromCents(premiumCents).divide(TWO, 2, ROUND_HALF_UP);
    const cap = share(ceiling, ratePercent);
    const result = halfPremium.min(cap);
    return { premium: premiumCents, half: cents(halfPremium), cap: cents(cap), result: cents(result), rate: ratePercent };
  };
  const health = part(p.kvPremiumCents, healthRate);
  const care = part(p.pvPremiumCents, p.employerCareRate);
  return { health, care, total: health.result + care.result, ceiling: p.ceilingKvPv };
}
