import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Lohnsteuer2026 } from '../src/engine/pap/lst2026.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/pap2026-prueftabelle.json', import.meta.url), 'utf8'));

/** Eingaben der amtlichen Prüftabellen (PAP 2026, Anlage 1, Fußnoten). */
function inputsFor(table, stkl, jahresbrutto) {
  const base = { LZZ: 1, RE4: jahresbrutto * 100, STKL: stkl };
  if (table === 'allgemein') {
    return { ...base, ALV: 0, KRV: 0, PKV: 0, KVZ: '2.90', PVZ: stkl === 2 ? 0 : 1 };
  }
  const pkpv = stkl === 3 ? 50000 : stkl === 6 ? 0 : 30000;
  return { ...base, ALV: 1, KRV: 1, PKV: 1, PKPV: pkpv };
}

test('Prüftabelle: Struktur und Stichproben aus dem Plan', () => {
  assert.equal(fixture.allgemein.rows.length, 43);
  assert.equal(fixture.besonders.rows.length, 43);
  const at = (table, brutto) => fixture[table].rows.find((r) => r[0] === brutto).slice(1);
  assert.deepEqual(at('allgemein', 50000), [6788, 5580, 2810, 6788, 12010, 12542]);
  assert.deepEqual(at('besonders', 50000).filter((_, i) => [0, 2, 5].includes(i)), [8880, 3824, 16773]);
});

let checked = 0;
for (const table of ['allgemein', 'besonders']) {
  test(`Prüftabelle „${table}“: alle Werte exakt`, () => {
    for (const [brutto, ...expected] of fixture[table].rows) {
      fixture.steuerklassen.forEach((stkl, i) => {
        const out = new Lohnsteuer2026().setInputs(inputsFor(table, stkl, brutto)).run();
        assert.equal(
          out.LSTLZZ.toNumber() / 100,
          expected[i],
          `${table}: Brutto ${brutto}, Steuerklasse ${stkl}`,
        );
        checked++;
      });
    }
  });
}

test('Prüftabelle: Anzahl geprüfter Werte (43 Stufen × 6 Steuerklassen × 2 Tabellen)', () => {
  assert.equal(checked, 516);
});
