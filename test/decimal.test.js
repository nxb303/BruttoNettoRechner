import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BigDecimal } from '../src/engine/decimal.js';

const D = (x) => BigDecimal.valueOf(x);
const { ROUND_UP, ROUND_DOWN, ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN } =
  BigDecimal;

test('Rundungskonstanten entsprechen den Java-Werten', () => {
  assert.deepEqual(
    [ROUND_UP, ROUND_DOWN, ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN],
    [0, 1, 2, 3, 4, 5, 6],
  );
});

test('valueOf: Zahlen über ihre Zeichenkettendarstellung', () => {
  const cases = [
    [5, '5'],
    [0.1, '0.1'],
    [2.9, '2.9'],
    [-0.0025, '-0.0025'],
    [914.51, '914.51'],
    [1e-7, '0.0000001'],
    [1.5e21, '1500000000000000000000'],
    ['  12.50 ', '12.50'],
    ['-.5', '-0.5'],
    ['1E+3', '1000'],
    ['0', '0'],
    [-0, '0'],
  ];
  for (const [input, expected] of cases) assert.equal(D(input).toString(), expected, String(input));
  assert.throws(() => D('abc'), SyntaxError);
  assert.throws(() => D('.'), SyntaxError);
  assert.throws(() => D(Number.NaN), RangeError);
  assert.equal(D(D(3)).toString(), '3');
  assert.equal(D(12n).toString(), '12');
});

test('add, subtract, multiply sind exakt (kein Gleitkomma)', () => {
  assert.equal(D('0.1').add(D('0.2')).toString(), '0.3');
  assert.equal(D('0.3').subtract(D('0.1')).toString(), '0.2');
  assert.equal(D('1.5').multiply(D('2.50')).toString(), '3.750');
  assert.equal(D('914.51').multiply(D('0.1234')).toString(), '112.850534');
  assert.equal(D('-2').multiply(D('0.5')).toString(), '-1.0');
  assert.equal(D('5').subtract(D('7.25')).toString(), '-2.25');
});

// Referenzfälle: setScale(scale, mode) wie in Java (ROUND_DOWN schneidet auch negative Werte Richtung 0 ab).
const SET_SCALE = [
  // [Wert, Skala, Modus, erwartet]
  ['2.5', 0, ROUND_HALF_UP, '3'],
  ['-2.5', 0, ROUND_HALF_UP, '-3'],
  ['2.4', 0, ROUND_HALF_UP, '2'],
  ['-2.4', 0, ROUND_HALF_UP, '-2'],
  ['0.5', 0, ROUND_HALF_UP, '1'],
  ['-0.5', 0, ROUND_HALF_UP, '-1'],
  ['1.005', 2, ROUND_HALF_UP, '1.01'],
  ['1.0049', 2, ROUND_HALF_UP, '1.00'],
  ['2.9', 0, ROUND_DOWN, '2'],
  ['-2.9', 0, ROUND_DOWN, '-2'],
  ['-0.99', 0, ROUND_DOWN, '0'],
  ['12.3456', 2, ROUND_DOWN, '12.34'],
  ['-12.3456', 2, ROUND_DOWN, '-12.34'],
  ['2.1', 0, ROUND_UP, '3'],
  ['-2.1', 0, ROUND_UP, '-3'],
  ['2.0', 0, ROUND_UP, '2'],
  ['1.001', 2, ROUND_UP, '1.01'],
  ['-1.001', 2, ROUND_UP, '-1.01'],
  ['2.1', 0, ROUND_CEILING, '3'],
  ['-2.9', 0, ROUND_CEILING, '-2'],
  ['2.0', 0, ROUND_CEILING, '2'],
  ['2.9', 0, ROUND_FLOOR, '2'],
  ['-2.1', 0, ROUND_FLOOR, '-3'],
  ['2.5', 0, ROUND_HALF_DOWN, '2'],
  ['2.6', 0, ROUND_HALF_DOWN, '3'],
  ['-2.5', 0, ROUND_HALF_DOWN, '-2'],
  ['2.5', 0, ROUND_HALF_EVEN, '2'],
  ['3.5', 0, ROUND_HALF_EVEN, '4'],
  ['-2.5', 0, ROUND_HALF_EVEN, '-2'],
  ['2.51', 0, ROUND_HALF_EVEN, '3'],
  ['5', 2, ROUND_DOWN, '5.00'],
  ['0.125', 2, ROUND_HALF_UP, '0.13'],
];

test('setScale: alle Rundungsmodi wie Java', () => {
  for (const [value, scale, mode, expected] of SET_SCALE) {
    assert.equal(D(value).setScale(scale, mode).toString(), expected, `${value} → ${scale}, Modus ${mode}`);
  }
});

test('setScale ohne Modus wirft, wenn gerundet werden müsste (Java: UNNECESSARY)', () => {
  assert.equal(D('2.50').setScale(1).toString(), '2.5');
  assert.throws(() => D('2.55').setScale(1), RangeError);
  assert.throws(() => D('2').setScale(-1, ROUND_DOWN), RangeError);
});

const DIVIDE_SCALE = [
  // [Dividend, Divisor, Skala, Modus, erwartet]
  ['7', '3', 6, ROUND_DOWN, '2.333333'],
  ['2', '3', 6, ROUND_HALF_UP, '0.666667'],
  ['2', '3', 6, ROUND_DOWN, '0.666666'],
  ['-2', '3', 6, ROUND_DOWN, '-0.666666'],
  ['-2', '3', 6, ROUND_UP, '-0.666667'],
  ['2', '-3', 6, ROUND_UP, '-0.666667'],
  ['5000000', '12', 0, ROUND_DOWN, '416666'],
  ['1', '8', 2, ROUND_HALF_UP, '0.13'],
  ['12345', '100', 2, ROUND_DOWN, '123.45'],
  ['1', '3', 0, ROUND_UP, '1'],
  ['-1', '3', 0, ROUND_FLOOR, '-1'],
  ['-1', '3', 0, ROUND_CEILING, '0'],
  ['782.41', '12', 2, ROUND_HALF_UP, '65.20'],
  ['1.5', '0.25', 3, ROUND_DOWN, '6.000'],
  ['1234.5678', '0.01', 0, ROUND_DOWN, '123456'],
];

test('divide(d, scale, mode): Division mit Skala', () => {
  for (const [a, b, scale, mode, expected] of DIVIDE_SCALE) {
    assert.equal(D(a).divide(D(b), scale, mode).toString(), expected, `${a} / ${b} (${scale}, ${mode})`);
  }
  assert.throws(() => D('1').divide(D('0'), 2, ROUND_DOWN), RangeError);
});

test('divide(d): exakte Division, z. B. Tabellenwerte durch 12', () => {
  const cases = [
    ['1140', '12', '95'],
    ['990', '12', '82.5'],
    ['315', '12', '26.25'],
    ['9', '12', '0.75'],
    ['3000', '12', '250'],
    ['2.9', '2', '1.45'],
    ['1.45', '100', '0.0145'],
    ['5.5', '100', '0.055'],
    ['1', '8', '0.125'],
    ['10', '4', '2.5'],
    ['-9', '12', '-0.75'],
    ['9', '-12', '-0.75'],
    ['0', '7', '0'],
    ['1000', '4', '250'],
    ['1.000', '4', '0.250'],
  ];
  for (const [a, b, expected] of cases) assert.equal(D(a).divide(D(b)).toString(), expected, `${a} / ${b}`);
  assert.throws(() => D('1').divide(D('3')), /Non-terminating/);
  assert.throws(() => D('1').divide(D('7')), RangeError);
  assert.throws(() => D('1').divide(D('0')), /zero/);
});

test('compareTo, signum, negate, abs, min, max', () => {
  assert.equal(D('2.0').compareTo(D('2')), 0);
  assert.equal(D('2.01').compareTo(D('2')), 1);
  assert.equal(D('-2.01').compareTo(D('-2')), -1);
  assert.equal(D('0.00').signum(), 0);
  assert.equal(D('-0.01').signum(), -1);
  assert.equal(D('7').negate().toString(), '-7');
  assert.equal(D('-7.5').abs().toString(), '7.5');
  assert.equal(D('3').min(D('2.5')).toString(), '2.5');
  assert.equal(D('3').max(D('2.5')).toString(), '3');
  assert.equal(BigDecimal.ZERO.compareTo(BigDecimal.ONE), -1);
  assert.equal(BigDecimal.TEN.toString(), '10');
});

test('longValue schneidet Richtung 0 ab; toNumber; toCents rundet kaufmännisch', () => {
  assert.equal(D('12.99').longValue(), 12);
  assert.equal(D('-12.99').longValue(), -12);
  assert.equal(D('0.4').longValue(), 0);
  assert.equal(D('12.5').toNumber(), 12.5);
  assert.equal(D('12.345').toCents(), 1235);
  assert.equal(D('12.344').toCents(), 1234);
  assert.equal(D('-0.005').toCents(), -1);
  assert.equal(D('3059.68').toCents(), 305968);
});

test('PAP-typische Rechenkette: Tarifzone 2 (Y/RW-Schritte) exakt', () => {
  // UPTAB26, zweite Zone, X = 50000: Y = (X - 17799) / 10000 auf 6 Stellen abgeschnitten
  const y = D(50000).subtract(D(17799)).divide(D(10000), 6, ROUND_DOWN);
  assert.equal(y.toString(), '3.220100');
  const rw = y.multiply(D(173.1)).add(D(2397)).multiply(y);
  assert.equal(rw.toString(), '9513.4612181310000');
  assert.equal(rw.add(D(1034.87)).setScale(0, ROUND_DOWN).toString(), '10548');
});

test('fromCents: Cent → Euro mit zwei Nachkommastellen', () => {
  assert.equal(BigDecimal.fromCents(305968).toString(), '3059.68');
  assert.equal(BigDecimal.fromCents(-5).toString(), '-0.05');
  assert.equal(BigDecimal.fromCents(0).toString(), '0.00');
  assert.equal(BigDecimal.fromCents(1234).toCents(), 1234);
  assert.throws(() => BigDecimal.fromCents(1.5), RangeError);
});
