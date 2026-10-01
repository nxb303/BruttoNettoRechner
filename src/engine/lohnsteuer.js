/**
 * Adapter zwischen Rechner-Eingaben und dem amtlichen Programmablaufplan (PAP).
 *
 * Der PAP überschreibt bei Kinderfreibeträgen (ZKF > 0) interne Felder, weil er
 * die Steuer ein zweites Mal für Soli und Kirchensteuer berechnet. Deshalb gibt
 * es bei Kinderfreibeträgen zwei Läufe: einen mit ZKF = 0 (Zwischenwerte für die
 * Lohnsteuer-Erklärung) und einen mit den echten Eingaben (Soli, Kirchensteuer).
 * Die Lohnsteuer selbst ist in beiden Läufen identisch.
 */
import { BigDecimal } from './decimal.js';
import { eur, pct, num } from './units.js';

const D = (x) => BigDecimal.valueOf(x);
const HUNDRED = D(100);
const { ROUND_DOWN } = BigDecimal;

/** Euro-Betrag (BigDecimal, ≤ 2 Nachkommastellen) → Erklärungswert. */
const euro = (bd) => eur(bd.toCents());
/** PAP-Ausgabe in Cent → Erklärungswert. */
const centValue = (bd) => eur(bd.longValue());
/** Anteil als Prozentwert (0,0725 → 7,25 %). */
const percentOf = (fraction) => pct(fraction.multiply(HUNDRED).toNumber());

/**
 * PAP-Eingaben aus den Rechner-Eingaben.
 * @param {object} input CalcInput
 * @param {number} grossCents Monatsbrutto in Cent
 * @param {{rates: object, subsidyCents: number}} context
 */
export function papInputs(input, grossCents, { rates, subsidyCents }) {
  const privateHealth = input.health.type === 'private';
  const inputs = {
    LZZ: 2,
    RE4: grossCents,
    STKL: input.taxClass,
    ZKF: input.taxClass <= 4 ? input.childAllowances : 0,
    R: input.churchTax ? 1 : 0,
    PVS: rates.pvSaxony ? 1 : 0,
    PVZ: rates.pvSurcharge > 0 ? 1 : 0,
    PVA: rates.pvSurcharge > 0 ? 0 : rates.pvReductionChildren,
    KRV: input.pensionInsured ? 0 : 1,
    ALV: input.unemploymentInsured ? 0 : 1,
    LZZFREIB: Math.round(input.monthlyTaxAllowance * 100),
    af: input.taxClass === 4 && input.factor ? 1 : 0,
    f: input.taxClass === 4 && input.factor ? input.factor : 1,
  };
  if (privateHealth) {
    inputs.PKV = 1;
    inputs.PKPV = Math.round((input.health.kvPremium + input.health.pvPremium) * 100);
    inputs.PKPVAGZ = subsidyCents;
  } else {
    inputs.KVZ = input.health.additionalRate;
  }
  return inputs;
}

function runPap(Pap, inputs) {
  const pap = new Pap().setInputs(inputs);
  const out = pap.run();
  return { pap, out };
}

// --------------------------------------------------------------- Erklärung

/** Vorsorgepauschale (§ 39b Abs. 2 Satz 5 Nr. 3 EStG) mit ihren Teilbeträgen. */
function vorsorgeSteps(pap, hbCap) {
  const steps = [];
  const sources = ['estg-39b', 'bmf-vsp-2026'];
  const annual = pap.ZRE4VP;
  const rvBase = annual.min(pap.BBGRVALV);
  const kvBase = annual.min(pap.BBGKVPV);
  const hasAv = pap.ALV === 0 && pap.STKL !== 6;
  if (pap.KRV === 0) {
    steps.push({
      key: 'explain.incomeTax.step.vspPension',
      values: { base: euro(rvBase), ceiling: euro(pap.BBGRVALV), rate: percentOf(pap.RVSATZAN), amount: euro(pap.VSPR) },
      sources,
    });
  }
  if (pap.PKV > 0) {
    if (pap.STKL !== 6) {
      steps.push({
        key: 'explain.incomeTax.step.vspPrivate',
        values: {
          premium: centValue(pap.PKPV),
          subsidy: centValue(pap.PKPVAGZ),
          amount: euro(pap.VSPKVPV),
        },
        sources,
      });
    }
  } else {
    steps.push({
      key: 'explain.incomeTax.step.vspHealth',
      values: {
        base: euro(kvBase),
        ceiling: euro(pap.BBGKVPV),
        kvRate: percentOf(pap.KVSATZAN),
        pvRate: percentOf(pap.PVSATZAN),
        amount: euro(pap.VSPKVPV),
      },
      sources,
    });
  }
  const sumRvKvPv = pap.VSPR.add(pap.VSPKVPV).setScale(0, BigDecimal.ROUND_UP);
  if (hasAv) {
    steps.push({
      key: 'explain.incomeTax.step.vspUnemployment',
      values: { base: euro(rvBase), rate: percentOf(pap.AVSATZAN), amount: euro(pap.VSPALV) },
      sources,
    });
    steps.push({
      key: 'explain.incomeTax.step.vspCap',
      values: { sum: euro(pap.VSPALV.add(pap.VSPKVPV)), cap: eur(hbCap), result: euro(pap.VSPHB) },
      sources,
    });
    steps.push({
      key: 'explain.incomeTax.step.vspTotal',
      values: { a: euro(sumRvKvPv), b: euro(pap.VSPN), result: euro(pap.VSP) },
      sources,
    });
  } else {
    steps.push({ key: 'explain.incomeTax.step.vspTotalSimple', values: { result: euro(pap.VSP) }, sources });
  }
  return steps;
}

/** Tarifzone nach § 32a EStG anhand des abgerundeten zu versteuernden Einkommens. */
function tariffZone(x, tariff) {
  if (x.compareTo(D(tariff.zone1.from)) < 0) return 0;
  if (x.compareTo(D(tariff.zone2.from)) < 0) return 1;
  if (x.compareTo(D(tariff.zone3.from)) < 0) return 2;
  if (x.compareTo(D(tariff.zone4.from)) < 0) return 3;
  return 4;
}

function tariffSteps(pap, tariff) {
  const sources = tariff.sources;
  const x = pap.X;
  const gfb = euro(pap.GFB);
  if (pap.STKL >= 5) {
    const zone = x.compareTo(pap.W3STKL5) > 0 ? 4 : x.compareTo(pap.W2STKL5) > 0 ? 3 : x.compareTo(pap.W1STKL5) > 0 ? 2 : 1;
    return [
      {
        key: `explain.incomeTax.step.tariffV56Zone${zone}`,
        values: {
          x: euro(x),
          w1: euro(pap.W1STKL5),
          w2: euro(pap.W2STKL5),
          w3: euro(pap.W3STKL5),
          result: euro(pap.ST),
        },
        sources: ['estg-39b', 'bmf-pap-2026'],
      },
    ];
  }
  const splitting = pap.KZTAB === 2;
  const single = splitting ? pap.ST.divide(D(2)) : pap.ST;
  const steps = [
    {
      key: splitting ? 'explain.incomeTax.step.tariffBaseSplitting' : 'explain.incomeTax.step.tariffBase',
      values: { zve: euro(pap.ZVE), x: euro(x) },
      sources,
    },
  ];
  const zone = tariffZone(x, tariff);
  const result = euro(single);
  const values = { x: euro(x), gfb, result };
  if (zone === 1) {
    Object.assign(values, { y: num(pap.Y.toNumber(), 6), a: num(tariff.zone1.a, 2), b: eur(tariff.zone1.b * 100) });
  } else if (zone === 2) {
    Object.assign(values, {
      offset: eur(tariff.zone2.offset * 100),
      z: num(pap.Y.toNumber(), 6),
      a: num(tariff.zone2.a, 2),
      b: eur(tariff.zone2.b * 100),
      c: eur(Math.round(tariff.zone2.c * 100)),
    });
  } else if (zone === 3 || zone === 4) {
    const t = zone === 3 ? tariff.zone3 : tariff.zone4;
    Object.assign(values, { rate: num(t.rate, 2), constant: eur(Math.round(t.constant * 100)) });
  }
  steps.push({ key: `explain.incomeTax.step.tariffZone${zone}`, values, sources });
  if (splitting) {
    steps.push({ key: 'explain.incomeTax.step.splittingDouble', values: { single: euro(single), result: euro(pap.ST) }, sources });
  }
  return steps;
}

function incomeTaxExplanation(pap, out, data, grossCents, input) {
  const { tariff, provisionCap } = data.incomeTax;
  const hbCap = provisionCap.value;
  const steps = [
    {
      key: 'explain.incomeTax.step.annual',
      values: { monthly: eur(grossCents), annual: euro(pap.ZRE4J) },
      sources: ['estg-39b'],
    },
  ];
  if (pap.JLFREIB.signum() > 0) {
    steps.push({
      key: 'explain.incomeTax.step.allowance',
      values: { monthly: centValue(pap.LZZFREIB), annual: euro(pap.JLFREIB) },
      sources: ['estg-39b'],
    });
  }
  if (pap.ANP.signum() > 0) {
    steps.push({ key: 'explain.incomeTax.step.anp', values: { amount: euro(pap.ANP) }, sources: ['estg-9a'] });
  }
  if (pap.SAP.signum() > 0) {
    steps.push({ key: 'explain.incomeTax.step.sap', values: { amount: euro(pap.SAP) }, sources: ['estg-10c'] });
  }
  if (pap.EFA.signum() > 0) {
    steps.push({ key: 'explain.incomeTax.step.efa', values: { amount: euro(pap.EFA) }, sources: ['estg-24b'] });
  }
  steps.push(...vorsorgeSteps(pap, hbCap));
  steps.push({
    key: 'explain.incomeTax.step.taxableIncome',
    values: {
      annual: euro(pap.ZRE4),
      deductions: euro(pap.ZTABFB),
      vsp: euro(pap.VSP),
      zve: euro(pap.ZVE),
    },
    sources: ['estg-39b'],
  });
  steps.push(...tariffSteps(pap, tariff));
  if (input.taxClass === 4 && pap.af === 1 && pap.f !== 1) {
    steps.push({
      key: 'explain.incomeTax.step.factor',
      values: { tax: euro(pap.ST), factor: num(pap.f, 3), result: euro(pap.LSTJAHR) },
      sources: ['estg-39b'],
    });
  }
  steps.push({ key: 'explain.incomeTax.step.annualTax', values: { result: euro(pap.LSTJAHR) }, sources: ['estg-32a', 'estg-39b'] });
  steps.push({
    key: 'explain.incomeTax.step.monthlyTax',
    values: { annual: euro(pap.LSTJAHR), result: centValue(out.LSTLZZ) },
    sources: ['estg-39b', 'bmf-pap-2026'],
  });
  if (input.taxClass <= 4 && input.childAllowances > 0) {
    steps.push({
      key: 'explain.incomeTax.step.childrenNote',
      values: { count: input.childAllowances },
      sources: ['estg-32'],
    });
  }
  return { steps, sources: collectSources(steps, ['bmf-pap-2026', 'bmf-pap-2026-xml']) };
}

function solidarityExplanation(pap, out, data, taxWithoutChildAllowances) {
  const { rate, mitigationRate, sources: base } = data.solidarity;
  const steps = [];
  if (pap.ZKF.signum() > 0) {
    steps.push({
      key: 'explain.solidarity.step.baseChildren',
      values: { tax: euro(taxWithoutChildAllowances), allowances: euro(pap.KFB), base: euro(pap.JBMG) },
      sources: ['estg-32', ...base],
    });
  } else {
    steps.push({ key: 'explain.solidarity.step.base', values: { base: euro(pap.JBMG) }, sources: base });
  }
  const limit = euro(pap.SOLZFREI);
  if (pap.JBMG.compareTo(pap.SOLZFREI) <= 0) {
    steps.push({ key: 'explain.solidarity.step.belowLimit', values: { base: euro(pap.JBMG), limit }, sources: ['solzg-3'] });
  } else {
    const full = pap.JBMG.multiply(D(rate.value)).divide(HUNDRED, 2, ROUND_DOWN);
    const mitigation = pap.JBMG.subtract(pap.SOLZFREI).multiply(D(mitigationRate.value)).divide(HUNDRED, 2, ROUND_DOWN);
    steps.push({
      key: 'explain.solidarity.step.aboveLimit',
      values: {
        base: euro(pap.JBMG),
        limit,
        rate: pct(rate.value),
        full: euro(full),
        mitigationRate: pct(mitigationRate.value),
        mitigation: euro(mitigation),
        result: euro(pap.SOLZJ),
      },
      sources: base,
    });
  }
  steps.push({
    key: 'explain.solidarity.step.monthly',
    values: { annual: euro(pap.SOLZJ), result: centValue(out.SOLZLZZ) },
    sources: ['solzg-4', 'bmf-pap-2026'],
  });
  return { steps, sources: collectSources(steps, []) };
}

function collectSources(steps, extra) {
  return [...new Set([...steps.flatMap((s) => s.sources ?? []), ...extra])];
}

// ----------------------------------------------------------------- API

/**
 * Berechnet Lohnsteuer, Solidaritätszuschlag und Kirchensteuer-Bemessungsgrundlage
 * für einen Monat nach dem amtlichen PAP.
 * @returns {{
 *   incomeTax: {monthly: number, annual: number, explanation: object},
 *   solidarity: {monthly: number, explanation: object},
 *   churchBase: {monthly: number, annual: number},
 *   outputs: Record<string, string>
 * }}
 */
export function computeWageTax({ yearEntry, input, grossCents, rates, subsidyCents }) {
  const { Pap, data } = yearEntry;
  const inputs = papInputs(input, grossCents, { rates, subsidyCents });
  const base = runPap(Pap, { ...inputs, ZKF: 0 });
  const full = inputs.ZKF > 0 ? runPap(Pap, inputs) : base;
  if (base.out.LSTLZZ.compareTo(full.out.LSTLZZ) !== 0) {
    throw new Error('PAP-Läufe mit und ohne Kinderfreibeträge liefern unterschiedliche Lohnsteuer');
  }
  return {
    incomeTax: {
      monthly: full.out.LSTLZZ.longValue(),
      annual: base.pap.LSTJAHR.longValue(),
      explanation: incomeTaxExplanation(base.pap, base.out, data, grossCents, input),
    },
    solidarity: {
      monthly: full.out.SOLZLZZ.longValue(),
      explanation: solidarityExplanation(full.pap, full.out, data, base.pap.LSTJAHR),
    },
    churchBase: { monthly: full.out.BK.longValue(), annual: full.pap.JBMG.longValue() },
    outputs: Object.fromEntries(Object.entries(full.out).map(([k, v]) => [k, v.toString()])),
  };
}
