import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateDataSources, PAP_FIXED } from '../scripts/gen-data-sources.mjs';
import { Lohnsteuer2026 } from '../src/engine/pap/lst2026.js';

test('docs/DATA-SOURCES.md entspricht den Datenmodulen (npm run docs:sources)', () => {
  const committed = readFileSync(new URL('../docs/DATA-SOURCES.md', import.meta.url), 'utf8');
  assert.equal(committed, generateDataSources());
});

test('Feste PAP-Werte der Dokumentation stimmen mit dem amtlichen PAP überein', () => {
  const run = (inputs) => {
    const pap = new Lohnsteuer2026().setInputs({ LZZ: 1, RE4: 6_000_000, KVZ: 2.9, PVZ: 1, ...inputs });
    pap.run();
    return pap;
  };
  const classOne = run({ STKL: 1, ZKF: 1 });
  assert.equal(classOne.GFB.toString(), '12348');
  assert.equal(classOne.ANP.toString(), '1230');
  assert.equal(classOne.SAP.toString(), '36');
  assert.equal(classOne.KFB.toString(), '9756');
  assert.equal(classOne.SOLZFREI.toString(), '20350');
  assert.equal(run({ STKL: 2 }).EFA.toString(), '4260');
  assert.equal(run({ STKL: 4, ZKF: 1 }).KFB.toString(), '4878');
  const split = run({ STKL: 3 });
  assert.equal(split.SOLZFREI.toString(), '40700');
  const five = run({ STKL: 5 });
  assert.deepEqual([five.W1STKL5, five.W2STKL5, five.W3STKL5].map(String), ['14071', '34939', '222260']);
  assert.ok(PAP_FIXED.length >= 9);
});
