import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BigDecimal } from '../src/engine/decimal.js';
import { Lohnsteuer2026 } from '../src/engine/pap/lst2026.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/bmf-2026.json', import.meta.url), 'utf8'));

test('BMF-Fixture: Umfang und Herkunft dokumentiert', () => {
  assert.ok(fixture.cases.length >= 250, `nur ${fixture.cases.length} Fälle`);
  assert.match(fixture.retrieved, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(fixture.notice, /Überprüfung eigener Programmabläufe/);
});

test('BMF-Referenzfall aus dem Plan: 5.000 €, StKl I, KiSt, 1 Kinderfreibetrag', () => {
  const out = new Lohnsteuer2026()
    .setInputs({ LZZ: 2, RE4: 500000, STKL: 1, R: 1, KVZ: 2.9, PVZ: 1, ZKF: 1 })
    .run();
  assert.equal(out.LSTLZZ.toString(), '78241');
  assert.equal(out.SOLZLZZ.toString(), '0');
  assert.equal(out.BK.toString(), '52008');
});

test('alle BMF-Referenzfälle: sämtliche Ausgabeparameter exakt', () => {
  for (const { in: input, out: expected } of fixture.cases) {
    const actual = new Lohnsteuer2026().setInputs(input).run();
    for (const [name, value] of Object.entries(expected)) {
      assert.ok(name in actual, `Ausgabe ${name} fehlt im PAP`);
      assert.equal(
        actual[name].compareTo(BigDecimal.valueOf(value)),
        0,
        `${name}: erwartet ${value}, erhalten ${actual[name]} bei ${JSON.stringify(input)}`,
      );
    }
  }
});

test('BMF-Referenzfälle decken Soli-Milderungszone, Kinderfreibeträge, PKV, Faktor und sonstige Bezüge ab', () => {
  const touches = (predicate) => fixture.cases.filter(({ in: i, out }) => predicate(i, out)).length;
  assert.ok(touches((i, o) => Number(o.SOLZLZZ) > 0) > 10, 'Soli');
  assert.ok(touches((i) => i.ZKF > 0) > 40, 'Kinderfreibeträge');
  assert.ok(touches((i) => i.PKV === 1) > 10, 'PKV');
  assert.ok(touches((i) => i.af === 1 && i.f < 1) > 5, 'Faktor');
  assert.ok(touches((i) => i.SONSTB > 0) > 5, 'sonstige Bezüge');
  assert.ok(touches((i) => i.VBEZ > 0 || i.ALTER1 === 1) > 5, 'Versorgungsbezüge/Altersentlastung');
});
