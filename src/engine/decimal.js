/**
 * Kleine BigDecimal-Teilmenge auf BigInt-Basis mit Java-Semantik.
 *
 * Der amtliche Programmablaufplan (PAP) ist in Java-`BigDecimal`-Pseudocode
 * geschrieben; Gleitkomma ist für die Steuerberechnung verboten. Wert =
 * `unscaled × 10^-scale`. Die interne Skala darf von Java abweichen, solange
 * der Wert exakt ist – der PAP vergleicht und rundet nur wertbasiert.
 */

const ROUND_UP = 0;
const ROUND_DOWN = 1;
const ROUND_CEILING = 2;
const ROUND_FLOOR = 3;
const ROUND_HALF_UP = 4;
const ROUND_HALF_DOWN = 5;
const ROUND_HALF_EVEN = 6;
const ROUND_UNNECESSARY = 7;

const pow10 = (n) => 10n ** BigInt(n);
const abs = (x) => (x < 0n ? -x : x);

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Ganzzahlige Division n/d, gerundet nach Java-Modus (BigInt teilt Richtung 0). */
function divRound(n, d, mode) {
  const q = n / d;
  const r = n % d;
  if (r === 0n) return q;
  const away = (n < 0n) !== (d < 0n) ? q - 1n : q + 1n;
  const twice = 2n * abs(r);
  const half = abs(d);
  switch (mode) {
    case ROUND_UP:
      return away;
    case ROUND_DOWN:
      return q;
    case ROUND_CEILING:
      return away > q ? away : q;
    case ROUND_FLOOR:
      return away < q ? away : q;
    case ROUND_HALF_UP:
      return twice >= half ? away : q;
    case ROUND_HALF_DOWN:
      return twice > half ? away : q;
    case ROUND_HALF_EVEN:
      if (twice === half) return q % 2n === 0n ? q : away;
      return twice > half ? away : q;
    case ROUND_UNNECESSARY:
      throw new RangeError('Rounding necessary');
    default:
      throw new RangeError(`Invalid rounding mode: ${mode}`);
  }
}

const NUMBER_PATTERN = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

export class BigDecimal {
  /**
   * @param {bigint} unscaled
   * @param {number} [scale] Anzahl der Nachkommastellen (≥ 0 nach außen)
   */
  constructor(unscaled, scale = 0) {
    this.unscaled = unscaled;
    this.scale = scale;
  }

  /**
   * Entspricht `BigDecimal.valueOf(…)`: Zahlen werden über ihre kürzeste
   * Zeichenkettendarstellung gelesen (`valueOf(0.1)` ist exakt 0,1).
   * @param {number|string|bigint|BigDecimal} x
   * @returns {BigDecimal}
   */
  static valueOf(x) {
    if (x instanceof BigDecimal) return x;
    if (typeof x === 'bigint') return new BigDecimal(x, 0);
    if (typeof x === 'number' && !Number.isFinite(x)) {
      throw new RangeError(`Not a finite number: ${x}`);
    }
    const text = String(x).trim();
    const m = NUMBER_PATTERN.exec(text);
    if (!m || !(m[2] || m[3])) throw new SyntaxError(`Invalid decimal: "${text}"`);
    const fraction = m[3] ?? '';
    let unscaled = BigInt(m[2] + fraction || '0');
    let scale = fraction.length - Number(m[4] ?? 0);
    if (scale < 0) {
      unscaled *= pow10(-scale);
      scale = 0;
    }
    return new BigDecimal(m[1] === '-' ? -unscaled : unscaled, scale);
  }

  /** Beide Operanden auf die größere Skala bringen. */
  #align(o) {
    const scale = Math.max(this.scale, o.scale);
    return [
      this.unscaled * pow10(scale - this.scale),
      o.unscaled * pow10(scale - o.scale),
      scale,
    ];
  }

  add(o) {
    const [a, b, scale] = this.#align(o);
    return new BigDecimal(a + b, scale);
  }

  subtract(o) {
    const [a, b, scale] = this.#align(o);
    return new BigDecimal(a - b, scale);
  }

  /** Exaktes Produkt (Skala = Summe der Skalen). */
  multiply(o) {
    return new BigDecimal(this.unscaled * o.unscaled, this.scale + o.scale);
  }

  /**
   * `divide(d)`: exakte Division; wirft bei nicht abbrechender Dezimalbruchentwicklung
   * (wie Java). `divide(d, scale, mode)`: auf `scale` Nachkommastellen gerundet.
   */
  divide(d, scale, mode) {
    if (d.unscaled === 0n) throw new RangeError('Division by zero');
    if (scale !== undefined) {
      if (scale < 0) throw new RangeError('Negative scale is not supported');
      const e = scale - this.scale + d.scale;
      const num = e >= 0 ? this.unscaled * pow10(e) : this.unscaled;
      const den = e >= 0 ? d.unscaled : d.unscaled * pow10(-e);
      return new BigDecimal(divRound(num, den, mode), scale);
    }
    const g = gcd(abs(this.unscaled), abs(d.unscaled)) || 1n;
    let num = this.unscaled / g;
    let den = d.unscaled / g;
    if (den < 0n) [num, den] = [-num, -den];
    let twos = 0;
    let fives = 0;
    for (; den % 2n === 0n; den /= 2n) twos++;
    for (; den % 5n === 0n; den /= 5n) fives++;
    if (den !== 1n) {
      throw new RangeError('Non-terminating decimal expansion; no exact representable decimal result.');
    }
    // num / (2^twos · 5^fives) = num · 2^(k-twos) · 5^(k-fives) / 10^k
    const k = Math.max(twos, fives);
    const unscaled = num * 2n ** BigInt(k - twos) * 5n ** BigInt(k - fives);
    const resultScale = k + this.scale - d.scale;
    return resultScale >= 0
      ? new BigDecimal(unscaled, resultScale)
      : new BigDecimal(unscaled * pow10(-resultScale), 0);
  }

  /**
   * Rundet bzw. erweitert auf `scale` Nachkommastellen.
   * Ohne Modus wirft die Methode, wenn gerundet werden müsste (Java: UNNECESSARY).
   */
  setScale(scale, mode = ROUND_UNNECESSARY) {
    if (scale < 0) throw new RangeError('Negative scale is not supported');
    if (scale >= this.scale) {
      return new BigDecimal(this.unscaled * pow10(scale - this.scale), scale);
    }
    return new BigDecimal(divRound(this.unscaled, pow10(this.scale - scale), mode), scale);
  }

  /** @returns {-1|0|1} */
  compareTo(o) {
    const [a, b] = this.#align(o);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  signum() {
    return this.unscaled < 0n ? -1 : this.unscaled > 0n ? 1 : 0;
  }

  negate() {
    return new BigDecimal(-this.unscaled, this.scale);
  }

  abs() {
    return this.unscaled < 0n ? this.negate() : this;
  }

  min(o) {
    return this.compareTo(o) <= 0 ? this : o;
  }

  max(o) {
    return this.compareTo(o) >= 0 ? this : o;
  }

  /** Ganze Cent (Number) → Euro-Betrag mit zwei Nachkommastellen. */
  static fromCents(cents) {
    if (!Number.isSafeInteger(cents)) throw new RangeError(`Not an integer cent amount: ${cents}`);
    return new BigDecimal(BigInt(cents), 2);
  }

  /** Ganzzahlanteil (Richtung 0 abgeschnitten) als Number. */
  longValue() {
    return Number(this.unscaled / pow10(this.scale));
  }

  toNumber() {
    return Number(this.toString());
  }

  /** Euro-Betrag → ganze Cent (Number), kaufmännisch gerundet. */
  toCents() {
    return this.multiply(HUNDRED).setScale(0, ROUND_HALF_UP).longValue();
  }

  /** Plain-Notation ohne Exponent, z. B. `-12.30`. */
  toString() {
    const negative = this.unscaled < 0n;
    const digits = abs(this.unscaled).toString().padStart(this.scale + 1, '0');
    const cut = digits.length - this.scale;
    const text = this.scale > 0 ? `${digits.slice(0, cut)}.${digits.slice(cut)}` : digits;
    return negative ? `-${text}` : text;
  }

  static ZERO = new BigDecimal(0n, 0);
  static ONE = new BigDecimal(1n, 0);
  static TEN = new BigDecimal(10n, 0);
  static ROUND_UP = ROUND_UP;
  static ROUND_DOWN = ROUND_DOWN;
  static ROUND_CEILING = ROUND_CEILING;
  static ROUND_FLOOR = ROUND_FLOOR;
  static ROUND_HALF_UP = ROUND_HALF_UP;
  static ROUND_HALF_DOWN = ROUND_HALF_DOWN;
  static ROUND_HALF_EVEN = ROUND_HALF_EVEN;
  static ROUND_UNNECESSARY = ROUND_UNNECESSARY;
}

const HUNDRED = new BigDecimal(100n, 0);
