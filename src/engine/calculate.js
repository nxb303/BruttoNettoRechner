/**
 * Orchestrierung der Brutto-Netto-Berechnung (sprachneutral).
 *
 * Alle Beträge im Ergebnis sind ganze Cent. Jahreswerte = 12 × Monatswerte
 * (Annahme: gleichbleibendes Gehalt in allen Monaten).
 *
 * @typedef {{
 *   year: number, gross: number, period: 'month'|'year',
 *   taxClass: 1|2|3|4|5|6, factor?: number, childAllowances: number,
 *   state: string, churchTax: boolean,
 *   health: { type: 'statutory', additionalRate: number }
 *         | { type: 'private', kvPremium: number, pvPremium: number, employerSubsidy: boolean },
 *   care: { hasChildren: boolean, childrenUnder25: number, age23OrOlder: boolean },
 *   pensionInsured: boolean, unemploymentInsured: boolean, minijobRvExempt: boolean,
 *   monthlyTaxAllowance: number
 * }} CalcInput
 */
import { BigDecimal } from './decimal.js';
import { getYear } from '../data/years.js';
import { findState } from '../data/states.js';
import { eur, pct } from './units.js';
import { buildRates, calculateSocialInsurance, privateSubsidy } from './sozialversicherung.js';
import { computeWageTax } from './lohnsteuer.js';
import { churchTax } from './kirchensteuer.js';
import { validateInput } from './validate.js';

const D = (x) => BigDecimal.valueOf(x);
const sum = (values) => values.reduce((a, b) => a + b, 0);
const toCents = (euros) => D(euros).multiply(D(100)).setScale(0, BigDecimal.ROUND_HALF_UP).longValue();

/** Fehlende optionale Felder mit den Standardwerten des Formulars füllen. */
export function normalizeInput(input) {
  return {
    period: 'month',
    childAllowances: 0,
    churchTax: false,
    pensionInsured: true,
    unemploymentInsured: true,
    minijobRvExempt: false,
    monthlyTaxAllowance: 0,
    ...input,
    care: { hasChildren: false, childrenUnder25: 0, age23OrOlder: true, ...input.care },
  };
}

const item = (id, group, monthly, explanation, months) => ({
  id,
  group,
  monthly,
  yearly: monthly * months,
  explanation,
});

/** Monatsbrutto in Cent; bei Jahreseingabe Jahresbrutto / 12, kaufmännisch auf Cent gerundet. */
function monthlyGrossCents(input, months) {
  const cents = D(input.gross).multiply(D(100)).setScale(0, BigDecimal.ROUND_HALF_UP);
  return input.period === 'year'
    ? cents.divide(D(months), 0, BigDecimal.ROUND_HALF_UP).longValue()
    : cents.longValue();
}

/**
 * @param {CalcInput} rawInput
 * @returns {object} CalcResult (siehe docs/PLAN.md, Abschnitt 5.5)
 */
export function calculate(rawInput) {
  const input = normalizeInput(rawInput);
  const errors = validateInput(input);
  if (errors.length) {
    const error = new RangeError(`Ungültige Eingabe: ${errors.map((e) => `${e.field} (${e.code})`).join(', ')}`);
    error.errors = errors;
    throw error;
  }

  const yearEntry = getYear(input.year);
  const { data } = yearEntry;
  const months = data.months;
  const state = findState(input.state);
  const grossCents = monthlyGrossCents(input, months);
  const statutory = input.health.type === 'statutory';

  const limits = {
    minijob: data.minijob.limitMonthly.value,
    transitionUpper: data.transition.upperLimitMonthly.value,
    ceilingKvPv: data.ceilings.healthCareMonthly.value,
    ceilingRvAv: data.ceilings.pensionUnemploymentMonthly.value,
    factorF: data.transition.factorF.value,
  };
  const rates = buildRates(data, input);
  const social = calculateSocialInsurance({
    grossCents,
    limits,
    rates,
    statutory,
    pensionInsured: input.pensionInsured,
    unemploymentInsured: input.unemploymentInsured,
    minijob: {
      exempt: input.minijobRvExempt,
      employeePensionRate: data.minijob.employeePensionRate.value,
      employerPensionRate: data.minijob.employerPensionRate.value,
      employerHealthRate: data.minijob.employerHealthRate.value,
      employerFlatTaxRate: data.minijob.employerFlatTaxRate.value,
    },
  });
  const { employment } = social;

  // Private Kranken- und Pflegeversicherung (nur oberhalb des Minijobs)
  let subsidy = null;
  const privateHealth = !statutory && employment !== 'minijob';
  if (privateHealth && input.health.employerSubsidy) {
    subsidy = privateSubsidy({
      kvPremiumCents: toCents(input.health.kvPremium),
      pvPremiumCents: toCents(input.health.pvPremium),
      ceilingKvPv: limits.ceilingKvPv,
      employerHealthRate: data.health.employeeRate.value,
      averageAdditionalRate: data.health.averageAdditionalRate.value,
      employerCareRate: (rates.pvSaxony ? data.privateInsurance.employerCareRateSaxony : data.privateInsurance.employerCareRate).value,
    });
  }

  const items = [];

  // Lohnsteuer, Solidaritätszuschlag, Kirchensteuer
  if (employment === 'minijob') {
    items.push(
      item(
        'incomeTax',
        'tax',
        0,
        {
          steps: [{ key: 'explain.incomeTax.step.minijob', values: { rate: pct(data.minijob.employerFlatTaxRate.value) } }],
          sources: ['estg-40a', 'sgb4-8'],
        },
        months,
      ),
    );
  } else {
    const tax = computeWageTax({ yearEntry, input, grossCents, rates, subsidyCents: subsidy?.total ?? 0 });
    items.push(item('incomeTax', 'tax', tax.incomeTax.monthly, tax.incomeTax.explanation, months));
    items.push(item('solidarity', 'tax', tax.solidarity.monthly, tax.solidarity.explanation, months));
    if (input.churchTax) {
      const churchAmount = churchTax(tax.churchBase.monthly, state.churchTaxRate);
      const steps = [
        {
          key: 'explain.churchTax.step.base',
          values: { annual: eur(tax.churchBase.annual * 100), result: eur(tax.churchBase.monthly) },
          sources: ['estg-51a', 'bmf-pap-2026'],
        },
        {
          key: 'explain.churchTax.step.amount',
          values: {
            base: eur(tax.churchBase.monthly),
            rate: pct(state.churchTaxRate),
            state: { state: state.code },
            amount: eur(churchAmount),
          },
          sources: state.sources,
        },
      ];
      items.push(item('churchTax', 'tax', churchAmount, { steps, sources: [...new Set(steps.flatMap((s) => s.sources))] }, months));
    }
  }

  // Sozialversicherung in Anzeige-Reihenfolge
  for (const id of ['health', 'healthAdditional', 'care', 'careSurcharge', 'pension', 'unemployment']) {
    const branch = social.branches[id];
    if (!branch) continue;
    items.push(item(id, 'social', branch.employee, { steps: branch.steps, sources: branch.sources }, months));
  }

  if (privateHealth) {
    const { kvPremium, pvPremium } = input.health;
    const premium = (id, euros, key) =>
      item(id, 'private', toCents(euros), {
        steps: [{ key, values: { premium: eur(toCents(euros)) } }],
        sources: id === 'pkv' ? ['sgb5-257'] : ['sgb11-61'],
      }, months);
    items.push(premium('pkv', kvPremium, 'explain.pkv.step.premium'));
    items.push(premium('ppv', pvPremium, 'explain.ppv.step.premium'));
    if (subsidy) {
      const steps = [
        {
          key: 'explain.employerSubsidy.step.health',
          values: {
            premium: eur(subsidy.health.premium),
            half: eur(subsidy.health.half),
            ceiling: eur(subsidy.ceiling),
            rate: pct(subsidy.health.rate),
            cap: eur(subsidy.health.cap),
            result: eur(subsidy.health.result),
          },
        },
        {
          key: 'explain.employerSubsidy.step.care',
          values: {
            premium: eur(subsidy.care.premium),
            half: eur(subsidy.care.half),
            ceiling: eur(subsidy.ceiling),
            rate: pct(subsidy.care.rate),
            cap: eur(subsidy.care.cap),
            result: eur(subsidy.care.result),
          },
        },
        { key: 'explain.employerSubsidy.step.total', values: { result: eur(subsidy.total) } },
      ];
      items.push(item('employerSubsidy', 'subsidy', subsidy.total, { steps, sources: ['sgb5-257', 'sgb11-61'] }, months));
    }
  }

  // Summen
  const monthlyOf = (group) => sum(items.filter((i) => i.group === group).map((i) => i.monthly));
  const taxes = monthlyOf('tax');
  const socialTotal = monthlyOf('social') + monthlyOf('private') - monthlyOf('subsidy');
  const net = grossCents - taxes - socialTotal;
  const pair = (monthly) => ({ monthly, yearly: monthly * months });
  const totals = { gross: pair(grossCents), taxes: pair(taxes), social: pair(socialTotal), net: pair(net) };

  const netExplanation = {
    steps: [
      {
        key: privateHealth ? 'explain.net.step.sumPrivate' : 'explain.net.step.sum',
        values: { gross: eur(grossCents), taxes: eur(taxes), social: eur(socialTotal), net: eur(net) },
      },
    ],
    sources: [],
  };

  // Arbeitgeberanteile (nur zur Anzeige der Arbeitgeberkosten)
  const employerItems = [];
  for (const id of ['health', 'healthAdditional', 'care', 'pension', 'unemployment']) {
    const branch = social.branches[id];
    if (branch) employerItems.push({ id, monthly: branch.employer });
  }
  if (subsidy) employerItems.push({ id: 'subsidy', monthly: subsidy.total });
  if (social.employerExtra) {
    employerItems.push(
      { id: 'minijobPension', monthly: social.employerExtra.minijobPension },
      { id: 'minijobHealth', monthly: social.employerExtra.minijobHealth },
      { id: 'minijobTax', monthly: social.employerExtra.minijobTax },
    );
  }
  const employerFiltered = employerItems.filter((e) => e.monthly > 0).map((e) => ({ ...e, yearly: e.monthly * months }));
  const employerTotal = grossCents + sum(employerFiltered.map((e) => e.monthly));

  // Hinweise
  const warnings = [];
  const warn = (key, values) => warnings.push(values ? { key, values } : { key });
  if (input.factor !== undefined && input.taxClass !== 4) warn('warn.factorOnlyClass4');
  if (input.taxClass === 2 && input.childAllowances === 0) warn('warn.class2NeedsChild');
  if (input.taxClass >= 5 && input.childAllowances > 0) warn('warn.childAllowancesClass56');
  if (employment === 'minijob') {
    warn('warn.minijobFlatTax', { rate: pct(data.minijob.employerFlatTaxRate.value) });
    if (!statutory) warn('warn.minijobNoHealth');
  }
  if (employment === 'midijob') warn('warn.midijob', { limit: eur(limits.minijob), upper: eur(limits.transitionUpper) });
  if (!statutory && employment !== 'minijob' && totals.gross.yearly <= data.ceilings.compulsoryInsuranceLimitYearly.value) {
    warn('warn.pkvBelowJaeg', { limit: eur(data.ceilings.compulsoryInsuranceLimitYearly.value) });
  }

  return {
    employment,
    input,
    items,
    totals,
    netExplanation,
    employer: { items: employerFiltered, total: pair(employerTotal) },
    warnings,
    meta: {
      year: input.year,
      legalStatus: data.legalStatus,
      dataAsOf: data.dataAsOf,
      papStand: yearEntry.papInfo.xmlStand,
      papSha256: yearEntry.papInfo.xmlSha256,
      months,
    },
  };
}
