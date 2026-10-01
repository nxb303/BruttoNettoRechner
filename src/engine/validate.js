/**
 * Fachliche Validierung der Rechner-Eingaben (Wertebereiche). Syntaxfehler beim
 * Lesen von Formularfeldern (z. B. „abc“ statt einer Zahl) fängt die Oberfläche ab.
 * Fehlercodes: `{ field, code }`; die Oberfläche übersetzt sie über `err.<code>`.
 */
import { BigDecimal } from './decimal.js';
import { SUPPORTED_YEARS } from '../data/years.js';
import { STATE_CODES } from '../data/states.js';

export const LIMITS = Object.freeze({
  maxGross: 10_000_000,
  maxPremium: 100_000,
  maxChildren: 10,
  maxChildAllowances: 6,
  maxAdditionalRate: 10,
});

const decimalPlaces = (x) => {
  const bd = BigDecimal.valueOf(x);
  return bd.scale === 0 ? 0 : bd.toString().replace(/0+$/, '').split('.')[1]?.length ?? 0;
};
const isMoney = (x, max) => Number.isFinite(x) && x >= 0 && x <= max && decimalPlaces(x) <= 2;

/**
 * @param {object} input CalcInput
 * @returns {{field: string, code: string}[]}
 */
export function validateInput(input) {
  const errors = [];
  const fail = (field, code) => errors.push({ field, code });

  if (!Number.isFinite(input.gross) || input.gross <= 0 || input.gross > LIMITS.maxGross) fail('gross', 'gross.range');
  else if (decimalPlaces(input.gross) > 2) fail('gross', 'gross.decimals');
  if (!['month', 'year'].includes(input.period)) fail('period', 'period.invalid');
  if (!SUPPORTED_YEARS.includes(input.year)) fail('year', 'year.invalid');
  if (![1, 2, 3, 4, 5, 6].includes(input.taxClass)) fail('taxClass', 'taxClass.invalid');
  if (!STATE_CODES.includes(input.state)) fail('state', 'state.invalid');

  if (input.factor !== undefined) {
    if (!(input.factor >= 0.001 && input.factor <= 0.999) || decimalPlaces(input.factor) > 3) {
      fail('factor', 'factor.range');
    }
  }
  const kfb = input.childAllowances;
  if (!(kfb >= 0 && kfb <= LIMITS.maxChildAllowances && Number.isInteger(kfb * 2))) {
    fail('childAllowances', 'childAllowances.range');
  }
  if (!isMoney(input.monthlyTaxAllowance, LIMITS.maxGross)) fail('monthlyTaxAllowance', 'allowance.range');

  const { health, care } = input;
  if (health.type === 'statutory') {
    if (
      !(health.additionalRate >= 0 && health.additionalRate <= LIMITS.maxAdditionalRate) ||
      decimalPlaces(health.additionalRate) > 2
    ) {
      fail('additionalRate', 'additionalRate.range');
    }
  } else if (health.type === 'private') {
    if (!isMoney(health.kvPremium, LIMITS.maxPremium)) fail('kvPremium', 'premium.range');
    if (!isMoney(health.pvPremium, LIMITS.maxPremium)) fail('pvPremium', 'premium.range');
  } else {
    fail('healthType', 'healthType.invalid');
  }
  if (care.hasChildren && !(Number.isInteger(care.childrenUnder25) && care.childrenUnder25 >= 0 && care.childrenUnder25 <= LIMITS.maxChildren)) {
    fail('childrenUnder25', 'children.range');
  }
  return errors;
}
