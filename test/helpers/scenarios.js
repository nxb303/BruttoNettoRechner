/** Gemeinsame Eingaben für Engine-, i18n- und UI-Tests. */
export const BASE_INPUT = Object.freeze({
  year: 2026,
  gross: 5000,
  period: 'month',
  taxClass: 1,
  state: 'NW',
  churchTax: true,
  childAllowances: 0,
  health: { type: 'statutory', additionalRate: 2.9 },
  care: { hasChildren: false, childrenUnder25: 0, age23OrOlder: true },
  pensionInsured: true,
  unemploymentInsured: true,
  minijobRvExempt: false,
  monthlyTaxAllowance: 0,
});

export const input = (overrides = {}) => ({ ...BASE_INPUT, ...overrides });

const parents = (n) => ({ hasChildren: true, childrenUnder25: n, age23OrOlder: true });
const privateHealth = (extra = {}) => ({
  type: 'private',
  kvPremium: 620,
  pvPremium: 120,
  employerSubsidy: true,
  ...extra,
});

/** Vielfältige Szenarien, die alle Erklärungsschlüssel der Engine auslösen sollen. */
export const SCENARIOS = Object.freeze([
  ['Referenzfall', input()],
  ['Minijob', input({ gross: 500 })],
  ['Minijob befreit', input({ gross: 603, minijobRvExempt: true })],
  ['Minijob ohne RV-Pflicht', input({ gross: 400, pensionInsured: false })],
  ['Minijob PKV', input({ gross: 500, health: privateHealth() })],
  ['Midijob', input({ gross: 1200 })],
  ['Midijob mit Kindern', input({ gross: 1800, care: parents(4), taxClass: 4, factor: 0.912 })],
  ['Midijob Sachsen', input({ gross: 1000, state: 'SN' })],
  ['Midijob PKV', input({ gross: 1900, health: privateHealth({ employerSubsidy: false }) })],
  ['Regulär 2.001', input({ gross: 2001 })],
  ['Steuerklasse II', input({ taxClass: 2, childAllowances: 1, care: parents(1) })],
  ['Steuerklasse III mit Kindern', input({ gross: 8000, taxClass: 3, childAllowances: 2, care: parents(3) })],
  ['Steuerklasse IV mit Faktor', input({ taxClass: 4, factor: 0.912, childAllowances: 0.5 })],
  ['Steuerklasse V', input({ gross: 3000, taxClass: 5 })],
  ['Steuerklasse VI', input({ gross: 3000, taxClass: 6, churchTax: false })],
  ['Steuerklasse V hoch', input({ gross: 30000, taxClass: 5 })],
  ['Steuerklasse VI sehr hoch', input({ gross: 40000, taxClass: 6 })],
  ['Spitzensteuersatz', input({ gross: 30000 })],
  ['Reichensteuer', input({ gross: 300000, period: 'year' })],
  ['Soli Milderungszone', input({ gross: 7000 })],
  ['Soli volle Höhe', input({ gross: 15000, taxClass: 3, childAllowances: 3 })],
  ['Grundtarif Zone 1', input({ gross: 1500, churchTax: false })],
  ['Jahreseingabe', input({ gross: 60000, period: 'year', state: 'BY' })],
  ['Baden-Württemberg', input({ state: 'BW', gross: 4200 })],
  ['Sachsen mit Abschlägen', input({ state: 'SN', care: parents(6) })],
  ['Kinderlos unter 23', input({ care: { hasChildren: false, childrenUnder25: 0, age23OrOlder: false } })],
  ['Ohne RV/AV', input({ pensionInsured: false, unemploymentInsured: false, gross: 4000 })],
  ['PKV mit Zuschuss', input({ gross: 9000, health: privateHealth() })],
  ['PKV ohne Zuschuss', input({ gross: 9000, health: privateHealth({ employerSubsidy: false }), taxClass: 3 })],
  ['PKV Steuerklasse VI', input({ gross: 9000, health: privateHealth(), taxClass: 6 })],
  ['PKV Sachsen', input({ gross: 9000, state: 'SN', health: privateHealth() })],
  ['Freibetrag', input({ monthlyTaxAllowance: 250.5 })],
  ['Zusatzbeitrag null', input({ health: { type: 'statutory', additionalRate: 0 } })],
  ['Oberhalb aller BBG', input({ gross: 12000 })],
]);
