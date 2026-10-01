/**
 * Registry der Abrechnungsjahre. Ein neues Jahr = Datenmodul + generierter PAP
 * (siehe docs/UPDATING-TAX-YEAR.md); die Oberfläche zeigt die Jahresauswahl
 * automatisch, sobald mehr als ein Jahr registriert ist.
 */
import data2026 from './2026.js';
import { Lohnsteuer2026, PAP_INFO as papInfo2026 } from '../engine/pap/lst2026.js';

export const YEARS = Object.freeze({
  2026: Object.freeze({ data: data2026, Pap: Lohnsteuer2026, papInfo: papInfo2026 }),
});

export const SUPPORTED_YEARS = Object.keys(YEARS).map(Number);
export const DEFAULT_YEAR = Math.max(...SUPPORTED_YEARS);

/** @param {number} year */
export function getYear(year) {
  const entry = YEARS[year];
  if (!entry) throw new RangeError(`Abrechnungsjahr ${year} wird nicht unterstützt`);
  return entry;
}
