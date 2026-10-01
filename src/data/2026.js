/**
 * Parameter für das Abrechnungsjahr 2026 (Rechtsstand 01.01.2026).
 *
 * Beträge in Cent, Sätze in Prozent. Jeder Wert nennt seine Quellen-IDs
 * (siehe sources.js). Die Lohnsteuer-Parameter selbst (Grundfreibetrag,
 * Pauschbeträge, Soli-Freigrenze, BBG-Werte der Vorsorgepauschale, …) stecken im
 * amtlichen PAP und werden nicht doppelt gepflegt; `incomeTax` und `solidarity`
 * enthalten nur die Tarifkonstanten, die die Erklärung anzeigt. Ein Test
 * gleicht sie mit dem PAP ab.
 */
const p = (value, ...sources) => ({ value, sources });

export default {
  year: 2026,
  legalStatus: '2026-01-01',
  dataAsOf: '2026-10-01',
  /** Anzahl der Arbeitslohn-Monate je Jahr (Annahme: gleichbleibendes Gehalt). */
  months: 12,

  ceilings: {
    pensionUnemploymentMonthly: p(845000, 'svbezgrv-2026'),
    healthCareMonthly: p(581250, 'svbezgrv-2026'),
    compulsoryInsuranceLimitYearly: p(7740000, 'svbezgrv-2026'),
  },

  health: {
    rate: p(14.6, 'sgb5-241'),
    employeeRate: p(7.3, 'sgb5-249'),
    averageAdditionalRate: p(2.9, 'sgb5-242a', 'bmg-zusatzbeitrag-2026'),
  },

  care: {
    rate: p(3.6, 'sgb11-55'),
    employeeRate: p(1.8, 'sgb11-55'),
    employeeRateSaxony: p(2.3, 'sgb11-58'),
    childlessSurcharge: p(0.6, 'sgb11-55'),
    childlessFromAge: 23,
    reductionPerChild: p(0.25, 'sgb11-55'),
    maxReductionChildren: 4,
  },

  pension: { rate: p(18.6, 'sgb6-158') },
  unemployment: { rate: p(2.6, 'sgb3-341') },

  minijob: {
    limitMonthly: p(60300, 'sgb4-8', 'milov5'),
    employeePensionRate: p(3.6, 'sgb6-168', 'sgb6-172'),
    employerPensionRate: p(15, 'sgb6-172'),
    employerHealthRate: p(13, 'sgb5-249b'),
    employerFlatTaxRate: p(2, 'estg-40a'),
  },

  transition: {
    upperLimitMonthly: p(200000, 'sgb4-20'),
    factorF: p(0.6619, 'bmas-faktor-f-2026'),
  },

  privateInsurance: {
    /** Höchstzuschuss PV: Beitragssatz des Arbeitgebers × BBG (Sachsen: 1,3 %). */
    employerCareRate: p(1.8, 'sgb11-61'),
    employerCareRateSaxony: p(1.3, 'sgb11-61'),
    /** Höchstzuschuss KV: (AG-Satz + halber durchschnittlicher Zusatzbeitrag) × BBG. */
    subsidySources: ['sgb5-257'],
  },

  incomeTax: {
    tariff: {
      // § 32a Abs. 1 EStG; zone1: (a·y + b)·y mit y = (x − 12.348) / 10.000
      zone1: { from: 12349, to: 17799, a: 914.51, b: 1400 },
      // zone2: (a·z + b)·z + c mit z = (x − 17.799) / 10.000
      zone2: { from: 17800, to: 69878, offset: 17799, a: 173.1, b: 2397, c: 1034.87 },
      zone3: { from: 69879, to: 277825, rate: 0.42, constant: 11135.63 },
      zone4: { from: 277826, rate: 0.45, constant: 19470.38 },
      sources: ['estg-32a', 'bmf-pap-2026'],
    },
    /** Höchstbetrag für AV-, KV- und PV-Teilbeträge der Vorsorgepauschale (Cent). */
    provisionCap: p(190000, 'estg-39b', 'bmf-vsp-2026'),
    sources: ['estg-39b', 'bmf-pap-2026'],
  },

  solidarity: {
    rate: p(5.5, 'solzg-4'),
    mitigationRate: p(11.9, 'solzg-4'),
    sources: ['solzg-3', 'solzg-4'],
  },
};
