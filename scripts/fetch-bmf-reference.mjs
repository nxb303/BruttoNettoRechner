#!/usr/bin/env node
/**
 * Erzeugt Testfälle über die amtliche BMF-Prüfschnittstelle (Lohn- und
 * Einkommensteuerrechner, „Externe Programmierschnittstelle“) und schreibt sie
 * nach test/fixtures/bmf-2026.json.
 *
 * Die Schnittstelle darf laut BMF ausschließlich zur Überprüfung eigener
 * Programme verwendet werden, nicht für den Echtbetrieb. Deshalb läuft dieses
 * Skript nur manuell (npm run fetch:bmf), nie zur Laufzeit der Anwendung, und
 * wartet zwischen den Anfragen mehr als eine Sekunde.
 *
 * Hinter einem HTTP-Proxy: NODE_USE_ENV_PROXY=1 setzen.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const YEAR = 2026;
const ENDPOINT = `https://www.bmf-steuerrechner.de/interface/${YEAR}Version1.xhtml`;
const ACCESS_CODE = `LSt${YEAR}ext`; // öffentlich dokumentierter Zugangscode (bmf-steuerrechner.de)
const MIN_INTERVAL_MS = 1100;
const TARGET = join(dirname(fileURLToPath(import.meta.url)), '..', 'test/fixtures', `bmf-${YEAR}.json`);

// ------------------------------------------------------------ Fallraster

const MONTHLY_GROSS = [650, 1000, 1600, 2000, 2500, 3500, 4500, 5800, 7000, 8500, 12000, 25000];
const CLASSES = [1, 2, 3, 4, 5, 6];
const cents = (euro) => Math.round(euro * 100);
const monthly = (euro, extra = {}) => ({ LZZ: 2, RE4: cents(euro), KVZ: 2.9, PVZ: 1, ...extra });

export function buildCases() {
  const cases = [];
  const add = (input) => cases.push(input);

  // 1. Grundraster: 12 Bruttostufen × 6 Steuerklassen
  for (const gross of MONTHLY_GROSS) for (const STKL of CLASSES) add(monthly(gross, { STKL }));

  // 2. Kirchensteuer und Kinderfreibeträge (zweiter PAP-Durchlauf, Soli/KiSt)
  for (const gross of [1600, 3500, 7000, 12000]) {
    for (const STKL of [1, 2, 3, 4]) {
      for (const ZKF of [0, 0.5, 1, 2.5]) add(monthly(gross, { STKL, R: 1, ZKF }));
    }
  }
  add(monthly(5000, { STKL: 1, R: 1, ZKF: 1 })); // Referenzfall aus dem Plan
  for (const gross of [9000, 10000, 12000, 15000]) add(monthly(gross, { STKL: 3, R: 1, ZKF: 2 }));
  for (const gross of [5800, 7000, 8500]) add(monthly(gross, { STKL: 1, R: 1, ZKF: 0 })); // Soli-Milderungszone

  // 3. Zusatzbeitrag
  for (const KVZ of [1.5, 4.4]) {
    for (const gross of [3500, 7000]) for (const STKL of [1, 3, 5]) add(monthly(gross, { STKL, KVZ }));
  }

  // 4. Pflegeversicherung: Sachsen, Kinderlosenzuschlag, Abschläge
  for (const gross of [3500, 7000]) for (const STKL of [1, 4]) add(monthly(gross, { STKL, PVS: 1 }));
  for (const PVA of [0, 1, 2, 3, 4]) {
    add(monthly(3500, { STKL: 1, PVZ: 0, PVA }));
    add(monthly(7000, { STKL: 3, PVZ: 0, PVA, PVS: 1 }));
  }

  // 5. Keine Renten-/Arbeitslosenversicherungspflicht
  for (const gross of [3500, 7000]) {
    for (const STKL of [1, 3, 6]) {
      add(monthly(gross, { STKL, KRV: 1 }));
      add(monthly(gross, { STKL, ALV: 1 }));
    }
    add(monthly(gross, { STKL: 1, KRV: 1, ALV: 1 }));
  }

  // 6. Private Kranken-/Pflegeversicherung mit und ohne Arbeitgeberzuschuss
  for (const gross of [3500, 7000, 12000]) {
    for (const STKL of [1, 3, 5, 6]) {
      add(monthly(gross, { STKL, PKV: 1, PKPV: 55000, PKPVAGZ: 27500 }));
      add(monthly(gross, { STKL, PKV: 1, PKPV: 55000, PKPVAGZ: 0 }));
    }
  }
  add(monthly(7000, { STKL: 1, PKV: 1, PKPV: 90000, PKPVAGZ: 60000, KRV: 1, ALV: 1 })); // Zuschuss > Beitrag

  // 7. Faktorverfahren (Steuerklasse IV)
  for (const f of [0.912, 0.75, 0.6]) {
    for (const gross of [3500, 7000, 12000]) add(monthly(gross, { STKL: 4, af: 1, f }));
  }
  add(monthly(7000, { STKL: 4, af: 1, f: 0.912, R: 1, ZKF: 1 }));
  add(monthly(7000, { STKL: 4, af: 0, f: 0.912 })); // af = 0 setzt f auf 1

  // 8. Freibeträge laut ELStAM
  for (const LZZFREIB of [20000, 100000]) for (const gross of [2500, 5800]) add(monthly(gross, { STKL: 1, LZZFREIB }));
  add(monthly(5800, { STKL: 3, LZZFREIB: 50000, R: 1, ZKF: 1 }));
  add(monthly(3500, { STKL: 1, LZZHINZU: 30000 }));
  add(monthly(500, { STKL: 1, LZZFREIB: 90000 })); // Freibetrag größer als Lohn

  // 9. Andere Lohnzahlungszeiträume
  add({ LZZ: 1, RE4: cents(48000), STKL: 1, KVZ: 2.9, PVZ: 1, R: 1 });
  add({ LZZ: 1, RE4: cents(96000), STKL: 3, KVZ: 2.9, PVZ: 1, ZKF: 1 });
  add({ LZZ: 3, RE4: cents(900), STKL: 1, KVZ: 2.9, PVZ: 1 });
  add({ LZZ: 3, RE4: cents(1400), STKL: 4, KVZ: 2.9, PVZ: 1, R: 1, ZKF: 1 });
  add({ LZZ: 4, RE4: cents(150), STKL: 1, KVZ: 2.9, PVZ: 1 });
  add({ LZZ: 4, RE4: cents(260), STKL: 5, KVZ: 2.9, PVZ: 1 });

  // 10. Grenzfälle
  add(monthly(0, { STKL: 1 }));
  add(monthly(100, { STKL: 6 }));
  add(monthly(50000, { STKL: 1, R: 1 }));
  add(monthly(50000, { STKL: 5, R: 1 }));
  add(monthly(25000, { STKL: 3, R: 1, ZKF: 3 }));

  // 11. Sonstige Bezüge (Einmalzahlungen) – prüft den gesamten generierten PAP
  const sonst = (extra) => monthly(4000, { JRE4: cents(48000), ...extra });
  for (const STKL of [1, 3, 4, 5, 6]) add(sonst({ STKL, SONSTB: cents(5000) }));
  add(sonst({ STKL: 1, SONSTB: cents(5000), R: 1, ZKF: 1 }));
  add(sonst({ STKL: 3, SONSTB: cents(20000), R: 1 }));
  add(sonst({ STKL: 1, SONSTB: cents(3000), JFREIB: cents(2400) }));
  add(sonst({ STKL: 1, SONSTB: cents(8000), SONSTENT: cents(3000) }));
  add(sonst({ STKL: 1, SONSTB: cents(3000), MBV: cents(1000) }));
  add(sonst({ STKL: 1, SONSTB: 0, MBV: cents(1500), R: 1 }));
  add(sonst({ STKL: 1, SONSTB: cents(1000), MBV: cents(-500), R: 1 }));
  add(sonst({ STKL: 4, SONSTB: cents(6000), af: 1, f: 0.912 }));

  // 12. Versorgungsbezüge und Altersentlastungsbetrag
  const pension = (extra) => monthly(2500, { VBEZ: cents(1500), VBEZM: cents(1500), VJAHR: 2020, ...extra });
  add(pension({ STKL: 1 }));
  add(pension({ STKL: 3 }));
  add(pension({ STKL: 1, VJAHR: 2005 }));
  add(pension({ STKL: 1, VJAHR: 2060 }));
  add(pension({ STKL: 1, VBEZS: cents(3000) }));
  add({ LZZ: 1, RE4: cents(30000), VBEZ: cents(18000), VBEZM: cents(1500), VBEZS: 0, VJAHR: 2022, ZMVB: 12, STKL: 1, KVZ: 2.9 });
  add({ ...pension({ STKL: 1 }), JRE4: cents(30000), JVBEZ: cents(18000), SONSTB: cents(2000), VBS: cents(500), STERBE: cents(1000) });
  for (const AJAHR of [2005, 2020, 2060]) add(monthly(2800, { STKL: 1, ALTER1: 1, AJAHR }));
  add(monthly(2800, { STKL: 1, ALTER1: 1, AJAHR: 2020, VBEZ: cents(800), VBEZM: cents(800), VJAHR: 2018 }));

  const seen = new Set();
  return cases.filter((c) => !seen.has(JSON.stringify(c)) && seen.add(JSON.stringify(c)));
}

// -------------------------------------------------------- Schnittstelle

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

export async function query(input) {
  const url = `${ENDPOINT}?${new URLSearchParams({ code: ACCESS_CODE, ...Object.fromEntries(Object.entries(input).map(([k, v]) => [k, String(v)])) })}`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const xml = await response.text();
      const inputs = [...xml.matchAll(/<eingabe\s[^>]*>/g)].map((m) => attributes(m[0]));
      const bad = inputs.filter((i) => i.status !== 'ok');
      if (bad.length) throw new Error(`Eingaben nicht akzeptiert: ${JSON.stringify(bad)}`);
      if (inputs.length !== Object.keys(input).length) {
        throw new Error(`Erwartet ${Object.keys(input).length} Eingaben, bestätigt ${inputs.length}`);
      }
      const out = {};
      for (const m of xml.matchAll(/<ausgabe\s[^>]*>/g)) {
        const a = attributes(m[0]);
        out[a.name] = a.value;
      }
      if (!('LSTLZZ' in out)) throw new Error('Antwort ohne LSTLZZ');
      return out;
    } catch (error) {
      lastError = error;
      await sleep(MIN_INTERVAL_MS * 2 * attempt);
    }
  }
  throw new Error(`Anfrage fehlgeschlagen (${url}): ${lastError.message}`);
}

async function main() {
  const inputs = buildCases();
  console.log(`${inputs.length} Fälle, geschätzte Dauer ${Math.ceil((inputs.length * MIN_INTERVAL_MS) / 60000)} min`);
  const cases = [];
  for (const [index, input] of inputs.entries()) {
    const started = Date.now();
    cases.push({ in: input, out: await query(input) });
    if ((index + 1) % 25 === 0) console.log(`${index + 1}/${inputs.length}`);
    await sleep(Math.max(0, MIN_INTERVAL_MS - (Date.now() - started)));
  }
  const header = {
    description: `Referenzfälle der amtlichen BMF-Prüfschnittstelle für den Programmablaufplan ${YEAR}`,
    source: `${ENDPOINT}?code=${ACCESS_CODE}&…`,
    retrieved: new Date().toISOString().slice(0, 10),
    notice:
      'Die Schnittstelle des BMF darf laut Betreiber nur zur Überprüfung eigener Programmabläufe genutzt werden. ' +
      'Diese Datei enthält ausschließlich einmalig abgerufene Testfälle; zur Laufzeit erfolgt keine Anfrage.',
    inputUnits: 'Beträge in Cent (RE4, LZZFREIB, PKPV, …), KVZ in Prozent, ZKF in Kinderfreibeträgen',
  };
  const lines = cases.map((c) => `    ${JSON.stringify(c)}`).join(',\n');
  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, `${JSON.stringify(header, null, 2).slice(0, -2)},\n  "cases": [\n${lines}\n  ]\n}\n`);
  console.log(`${TARGET} geschrieben (${cases.length} Fälle).`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
