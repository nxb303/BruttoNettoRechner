/**
 * Kirchensteuer: Maßstabsteuer (PAP-Ausgabe BK, in Cent je Lohnzahlungszeitraum)
 * × Landessatz, auf volle Cent abgerundet (§ 51a EStG).
 */
import { BigDecimal } from './decimal.js';

/**
 * @param {number} baseCents Maßstabsteuer BK in Cent
 * @param {number} ratePercent 8 oder 9
 * @returns {number} Kirchensteuer in Cent
 */
export function churchTax(baseCents, ratePercent) {
  return BigDecimal.valueOf(baseCents)
    .multiply(BigDecimal.valueOf(ratePercent))
    .divide(BigDecimal.valueOf(100), 0, BigDecimal.ROUND_DOWN)
    .longValue();
}
