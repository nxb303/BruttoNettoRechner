#!/usr/bin/env node
/**
 * Erzeugt docs/DATA-SOURCES.md aus den Datenmodulen (Parameter ↔ Quelle ↔ Abrufdatum),
 * damit Dokumentation und Daten nicht auseinanderlaufen. Ein Test vergleicht die Datei.
 *
 * Aufruf: node scripts/gen-data-sources.mjs [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createI18n } from '../src/i18n/index.js';
import de from '../src/i18n/de.js';
import { SOURCES } from '../src/data/sources.js';
import { STATES } from '../src/data/states.js';
import { getYear, DEFAULT_YEAR } from '../src/data/years.js';
import { BigDecimal } from '../src/engine/decimal.js';

const TARGET = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'DATA-SOURCES.md');
const i18n = createI18n({ code: 'de', intl: 'de-DE', dictionary: de });

/** Anzeigename und Einheit je Datenwert (Pfad im Datenmodul). */
const FIELDS = {
  'ceilings.pensionUnemploymentMonthly': ['Beitragsbemessungsgrenze Renten- und Arbeitslosenversicherung (bundeseinheitlich, Monat)', 'eur'],
  'ceilings.healthCareMonthly': ['Beitragsbemessungsgrenze Kranken- und Pflegeversicherung (Monat)', 'eur'],
  'ceilings.compulsoryInsuranceLimitYearly': ['Versicherungspflichtgrenze (Jahresarbeitsentgeltgrenze, Jahr)', 'eur'],
  'health.rate': ['Allgemeiner Beitragssatz Krankenversicherung (gesamt)', 'pct'],
  'health.employeeRate': ['Arbeitnehmeranteil Krankenversicherung', 'pct'],
  'health.averageAdditionalRate': ['Durchschnittlicher Zusatzbeitragssatz (Vorgabe im Formular; Arbeitnehmer trägt die Hälfte)', 'pct'],
  'care.rate': ['Beitragssatz Pflegeversicherung (gesamt)', 'pct'],
  'care.employeeRate': ['Arbeitnehmeranteil Pflegeversicherung', 'pct'],
  'care.employeeRateSaxony': ['Arbeitnehmeranteil Pflegeversicherung in Sachsen', 'pct'],
  'care.childlessSurcharge': ['Beitragszuschlag für Kinderlose ab 23 Jahren (nur Arbeitnehmer)', 'pct'],
  'care.reductionPerChild': ['Beitragsabschlag je Kind unter 25 Jahren ab dem 2. Kind, höchstens 4 Abschläge (nur Arbeitnehmer)', 'pct'],
  'pension.rate': ['Beitragssatz Rentenversicherung (gesamt)', 'pct'],
  'unemployment.rate': ['Beitragssatz Arbeitslosenversicherung (gesamt)', 'pct'],
  'minijob.limitMonthly': ['Geringfügigkeitsgrenze (Minijob, Monat)', 'eur'],
  'minijob.employeePensionRate': ['Eigenanteil Rentenversicherung im Minijob (Arbeitnehmer)', 'pct'],
  'minijob.employerPensionRate': ['Pauschalbeitrag Rentenversicherung im Minijob (Arbeitgeber)', 'pct'],
  'minijob.employerHealthRate': ['Pauschalbeitrag Krankenversicherung im Minijob (Arbeitgeber)', 'pct'],
  'minijob.employerFlatTaxRate': ['Pauschalsteuer im Minijob (Annahme: Arbeitgeber trägt sie)', 'pct'],
  'transition.upperLimitMonthly': ['Obergrenze des Übergangsbereichs (Midijob, Monat)', 'eur'],
  'transition.factorF': ['Faktor F für den Übergangsbereich (28 % ÷ 42,3 %)', 'num'],
  'privateInsurance.employerCareRate': ['Höchstzuschuss PKV Pflege: Arbeitgebersatz × BBG', 'pct'],
  'privateInsurance.employerCareRateSaxony': ['Höchstzuschuss PKV Pflege in Sachsen: Arbeitgebersatz × BBG', 'pct'],
  'incomeTax.provisionCap': ['Höchstbetrag AV-/KV-/PV-Teilbeträge der Vorsorgepauschale', 'eur'],
  'solidarity.rate': ['Solidaritätszuschlag, Satz', 'pct'],
  'solidarity.mitigationRate': ['Solidaritätszuschlag, Milderungszone', 'pct'],
};

/** Feste Werte im amtlichen PAP-Code (nicht in den Datenmodulen; ein Test gleicht sie mit dem PAP ab). */
export const PAP_FIXED = [
  ['Grundfreibetrag', '12.348 €', 'estg-32a'],
  ['Tarifzonen § 32a EStG', 'bis 12.348: 0; 12.349–17.799: (914,51·y + 1.400)·y; 17.800–69.878: (173,10·z + 2.397)·z + 1.034,87; 69.879–277.825: 0,42·x − 11.135,63; ab 277.826: 0,45·x − 19.470,38', 'estg-32a'],
  ['Arbeitnehmer-Pauschbetrag', '1.230 €', 'estg-9a'],
  ['Sonderausgaben-Pauschbetrag', '36 €', 'estg-10c'],
  ['Entlastungsbetrag Alleinerziehende (Steuerklasse II)', '4.260 €', 'estg-24b'],
  ['Kinderfreibetrag + BEA je Kind (Zähler 1; Steuerklasse IV: halber Betrag)', '9.756 € (IV: 4.878 €)', 'estg-32'],
  ['Soli-Freigrenze', '20.350 € (Splitting: 40.700 €)', 'solzg-3'],
  ['Grenzwerte Steuerklasse V/VI', '14.071 € / 34.939 € / 222.260 €', 'estg-39b'],
  ['Vorsorgepauschale: Teilbeträge', 'RV 9,3 %; KV 7 % + halber Zusatzbeitrag; PV 1,8 % (Sachsen 2,3 %, Zuschlag/Abschläge); AV 1,3 %; Höchstbetrag AV+KV+PV 1.900 €', 'bmf-vsp-2026'],
];

const format = (leaf, unit) => {
  if (unit === 'eur') return i18n.formatEur(leaf.value);
  if (unit === 'pct') return i18n.formatPct(leaf.value);
  return i18n.formatNumber(leaf.value);
};
const link = (id) => `[${SOURCES[id].label}](${SOURCES[id].url})`;
const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/ | /g, ' ');

function leaves(node, path = []) {
  if (node && typeof node === 'object' && 'value' in node && Array.isArray(node.sources)) return [[path.join('.'), node]];
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    return Object.entries(node).flatMap(([key, value]) => leaves(value, [...path, key]));
  }
  return [];
}

export function generateDataSources() {
  const { data } = getYear(DEFAULT_YEAR);
  const lines = [];
  const out = (line = '') => lines.push(line);
  out(`# Datenquellen und Parameter ${data.year}`);
  out();
  out('> Diese Datei wird mit `npm run docs:sources` aus `src/data/` erzeugt – nicht von Hand ändern.');
  out();
  out(`Rechtsstand: ${i18n.formatValue({ date: data.legalStatus })} · Datenstand und Abrufdatum aller Quellen: ${i18n.formatValue({ date: data.dataAsOf })}.`);
  out();
  out('## Lohnsteuer (amtlicher Programmablaufplan, nicht doppelt gepflegt)');
  out();
  out('Die Lohnsteuer wird ausschließlich vom maschinell aus dem amtlichen XML erzeugten PAP berechnet. Die Werte erscheinen nur in der Erklärung.');
  out();
  out('| Parameter | Wert 2026 | Quelle |');
  out('|---|---|---|');
  for (const [name, value, source] of PAP_FIXED) out(`| ${cell(name)} | ${cell(value)} | ${link(source)}, ${link('bmf-pap-2026-xml')} |`);
  out();
  out('## Sozialversicherung, Minijob, Übergangsbereich und Steuer-Erklärung');
  out();
  out('| Parameter | Wert | Quelle(n) |');
  out('|---|---|---|');
  for (const [path, leaf] of leaves(data)) {
    const field = FIELDS[path];
    if (!field) throw new Error(`Kein Anzeigename für ${path} in scripts/gen-data-sources.mjs`);
    out(`| ${cell(field[0])} | ${cell(format(leaf, field[1]))} | ${leaf.sources.map(link).join(', ')} |`);
  }
  out();
  out(`Die Zuschuss-Obergrenze der privaten Krankenversicherung ergibt sich aus Beitragsbemessungsgrenze × (7,3 % + ½ durchschnittlicher Zusatzbeitrag) = 508,59 € pro Monat (${link('sgb5-257')}), für die Pflege aus BBG × 1,8 % = 104,63 € (Sachsen: 1,3 % = 75,56 €; ${link('sgb11-61')}).`);
  out();
  out('Die Beitragsbemessungsgrenzen sind seit 2025 bundeseinheitlich; es gibt keine Ost/West-Unterscheidung.');
  out();
  out('## Kirchensteuer');
  out();
  out('Kirchensteuer = Maßstabsteuer (PAP-Ausgabe `BK`, § 51a EStG) × Satz, auf volle Cent abgerundet.');
  out();
  out('| Bundesland | Satz | Quellen |');
  out('|---|---|---|');
  for (const state of STATES) {
    out(`| ${de[`state.${state.code}`]} | ${i18n.formatPct(state.churchTaxRate)} | ${state.sources.map(link).join(', ')} |`);
  }
  out();
  out('Landesgesetze sind nur dort verlinkt, wo das Landesrechtsportal beim Erstellen erreichbar war und die Adresse geprüft werden konnte (BB, HB, NW). Für alle Länder belegt die Seite der Freien und Hansestadt Hamburg den Satz von 8 % (BW, BY) bzw. 9 %.');
  out();
  out('## Quellenverzeichnis');
  out();
  out('Alle URLs wurden am Abrufdatum geprüft (`npm run check:sources`).');
  out();
  out('| ID | Titel | Herausgeber | Stand | Abgerufen | URL |');
  out('|---|---|---|---|---|---|');
  for (const source of Object.values(SOURCES)) {
    const date = source.date ? i18n.formatValue({ date: source.date }) : '–';
    out(`| \`${source.id}\` | ${cell(de[`source.${source.id}.title`])} | ${cell(source.publisher)} | ${date} | ${i18n.formatValue({ date: source.accessed })} | <${source.url}> |`);
  }
  out();
  out('## Weitere Datengrundlagen');
  out();
  out('- Amtliche PAP-Prüftabellen (Anlage 1, Seiten 39–40) und BMF-Referenzfälle: siehe `test/fixtures/` und `vendor/bmf/README.md`.');
  out(`- Verwendeter PAP: XML-Stand ${getYear(DEFAULT_YEAR).papInfo.xmlStand}, SHA-256 \`${getYear(DEFAULT_YEAR).papInfo.xmlSha256}\`.`);
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const generated = generateDataSources();
  if (process.argv.includes('--check')) {
    if (readFileSync(TARGET, 'utf8') !== generated) {
      console.error('docs/DATA-SOURCES.md ist veraltet – npm run docs:sources ausführen.');
      process.exit(1);
    }
    console.log('docs/DATA-SOURCES.md ist aktuell.');
  } else {
    writeFileSync(TARGET, generated);
    console.log('docs/DATA-SOURCES.md geschrieben.');
  }
}
