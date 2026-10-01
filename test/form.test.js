import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createI18n } from '../src/i18n/index.js';
import de from '../src/i18n/de.js';
import { fromQuery, parseForm, relevance, toQuery } from '../src/ui/form.js';

const i18n = createI18n({ code: 'de', intl: 'de-DE', dictionary: de });
const RAW = Object.freeze({
  b: '5000', p: 'm', stkl: '1', f: '', bl: 'NW', kist: '1', kfb: '0', kv: 'g', zb: '2,9', kvb: '', pvb: '',
  agz: '1', k: '0', ku: '1', a23: '1', rv: '1', av: '1', frb: '', rvb: '0',
});
const parse = (overrides = {}) => {
  const raw = { ...RAW, ...overrides };
  const rel = relevance(raw, i18n);
  return { raw, rel, ...parseForm(raw, i18n, rel) };
};

test('Referenzfall wird in ein CalcInput übersetzt', () => {
  const { input, errors } = parse();
  assert.deepEqual(errors, []);
  assert.equal(input.gross, 5000);
  assert.equal(input.taxClass, 1);
  assert.equal(input.churchTax, true);
  assert.deepEqual(input.health, { type: 'statutory', additionalRate: 2.9 });
  assert.deepEqual(input.care, { hasChildren: false, childrenUnder25: 0, age23OrOlder: true });
});

test('Lokalisierte Zahlen werden gelesen, Fehler je Feld gemeldet', () => {
  assert.equal(parse({ b: '3.500,50' }).input.gross, 3500.5);
  const empty = parse({ b: '' });
  assert.deepEqual(empty.errors, [{ field: 'gross', code: 'gross.required' }]);
  const invalid = parse({ b: 'abc', zb: '42' });
  assert.deepEqual(invalid.errors, [
    { field: 'gross', code: 'gross.invalid' },
    { field: 'additionalRate', code: 'additionalRate.range' },
  ]);
  assert.deepEqual(parse({ b: '10,005' }).errors, [{ field: 'gross', code: 'gross.decimals' }]);
});

test('Abhängige Felder: nur relevante Felder werden gelesen und geprüft', () => {
  // Faktor zählt nur in Steuerklasse IV, Kinderfreibeträge nur in I–IV, Beiträge nur bei PKV
  assert.equal(parse({ f: 'abc' }).errors.length, 0);
  assert.equal(parse({ stkl: '4', f: '0,912' }).input.factor, 0.912);
  assert.deepEqual(parse({ stkl: '4', f: '1,5' }).errors, [{ field: 'factor', code: 'factor.range' }]);
  assert.equal(parse({ stkl: '5', kfb: '2' }).input.childAllowances, 0);
  assert.equal(parse({ kvb: 'x' }).errors.length, 0);
  const pkv = parse({ kv: 'p', kvb: '', pvb: '120' });
  assert.deepEqual(pkv.errors, [{ field: 'kvPremium', code: 'premium.required' }]);
  assert.equal(parse({ kv: 'p', kvb: '600', pvb: '120' }).input.health.type, 'private');
  assert.equal(parse({ k: '1', ku: '4' }).input.care.childrenUnder25, 4);
  assert.deepEqual(parse({ k: '1', ku: '' }).errors, [{ field: 'childrenUnder25', code: 'children.required' }]);
  assert.equal(parse({ b: '500', rvb: '1' }).input.minijobRvExempt, true);
  assert.equal(parse({ b: '5000', rvb: '1' }).input.minijobRvExempt, false);
});

test('Minijob-Grenze wirkt auch bei Jahreseingabe', () => {
  assert.equal(relevance({ ...RAW, b: '7236', p: 'y' }, i18n).minijob, true);
  assert.equal(relevance({ ...RAW, b: '7237', p: 'y' }, i18n).minijob, false);
  assert.equal(relevance({ ...RAW, b: '' }, i18n).minijob, false);
});

test('URL-Parameter: Referenzfall, Rundlauf und Ablehnung ungültiger Werte', () => {
  const { raw, rel, input } = parse({ kist: '1' });
  assert.equal(toQuery(raw, input, rel).toString(), 'b=5000&p=m&stkl=1&bl=NW&kist=1&kfb=0&kv=g&zb=2.9&k=0&a23=1');

  const roundTrip = fromQuery('?b=3500.5&p=y&stkl=4&f=0.912&bl=SN&kist=0&kfb=1.5&kv=p&kvb=600&pvb=120.5&agz=0&frb=12.5');
  assert.deepEqual(roundTrip, {
    b: '3500.5', p: 'y', stkl: '4', f: '0.912', bl: 'SN', kist: '0', kfb: '1.5', kv: 'p', kvb: '600', pvb: '120.5', agz: '0', frb: '12.5',
  });
  assert.deepEqual(fromQuery('?b=abc&stkl=9&bl=XX&kfb=7&kfb=6.5&zb=1,5&p=x&ku=100&evil=<script>'), {});
  assert.deepEqual(fromQuery('?kfb=6&ku=10'), { kfb: '6', ku: '10' });

  const pkv = parse({ kv: 'p', kvb: '600,50', pvb: '120', agz: '0', rv: '0', frb: '10', stkl: '4', f: '0,9' });
  const query = toQuery(pkv.raw, pkv.input, pkv.rel);
  assert.equal(query.get('kvb'), '600.5');
  assert.equal(query.get('agz'), '0');
  assert.equal(query.get('rv'), '0');
  assert.equal(query.get('f'), '0.9');
  assert.equal(query.has('zb'), false);
  assert.equal(query.has('k'), false);
});
