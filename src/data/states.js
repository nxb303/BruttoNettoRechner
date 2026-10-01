/**
 * Bundesländer mit Kirchensteuersatz (in Prozent der Maßstabsteuer) und Quellen.
 * Die Anzeigenamen stehen im Wörterbuch (`state.<code>`).
 * `sources`: gemeinsame Quellen für alle Länder plus – soweit geprüft erreichbar – das Landesgesetz.
 */
const COMMON = ['estg-51a', 'kist-saetze'];

const state = (code, churchTaxRate, ...lawSources) => ({
  code,
  churchTaxRate,
  sources: [...COMMON, ...lawSources],
});

export const STATES = Object.freeze([
  state('BW', 8),
  state('BY', 8),
  state('BE', 9),
  state('BB', 9, 'kistg-bb'),
  state('HB', 9, 'kistg-hb'),
  state('HH', 9),
  state('HE', 9),
  state('MV', 9),
  state('NI', 9),
  state('NW', 9, 'kistg-nw'),
  state('RP', 9),
  state('SL', 9),
  state('SN', 9),
  state('ST', 9),
  state('SH', 9),
  state('TH', 9),
]);

export const STATE_CODES = STATES.map((s) => s.code);

/** @param {string} code */
export const findState = (code) => STATES.find((s) => s.code === code);
