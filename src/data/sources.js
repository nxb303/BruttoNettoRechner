/**
 * Quellenkatalog. Titel stehen sprachabhängig im Wörterbuch (`source.<id>.title`),
 * damit eine neue Sprache keine Änderung an dieser Datei braucht.
 * Alle URLs wurden am Abrufdatum geprüft (HTTP 200).
 *
 * `label` ist eine sprachneutrale Kurzbezeichnung (Paragraf, Aktenzeichen).
 */
const ACCESSED = '2026-10-01';

const BMF = 'Bundesministerium der Finanzen';
const LAW = 'gesetze-im-internet.de (BMJV)';
const gesetz = (path) => `https://www.gesetze-im-internet.de/${path}`;

const entries = [
  // Lohnsteuer
  {
    id: 'bmf-pap-2026',
    label: 'PAP 2026',
    publisher: BMF,
    url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html',
    date: '2025-11-12',
  },
  {
    id: 'bmf-pap-2026-xml',
    label: 'PAP 2026 (XML)',
    publisher: 'BMF / ITZBund',
    url: 'https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml',
    date: '2025-10-23',
  },
  {
    id: 'bmf-vsp-2026',
    label: 'BMF 14.08.2025',
    publisher: BMF,
    url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Lohnsteuer/2025-08-14-vorsorgepau-lohnsteuerabzugsverfahren.pdf?__blob=publicationFile&v=2',
    date: '2025-08-14',
  },
  { id: 'estg-32a', label: '§ 32a EStG', publisher: LAW, url: gesetz('estg/__32a.html') },
  { id: 'estg-39b', label: '§ 39b EStG', publisher: LAW, url: gesetz('estg/__39b.html') },
  { id: 'estg-9a', label: '§ 9a EStG', publisher: LAW, url: gesetz('estg/__9a.html') },
  { id: 'estg-10c', label: '§ 10c EStG', publisher: LAW, url: gesetz('estg/__10c.html') },
  { id: 'estg-24b', label: '§ 24b EStG', publisher: LAW, url: gesetz('estg/__24b.html') },
  { id: 'estg-32', label: '§ 32 EStG', publisher: LAW, url: gesetz('estg/__32.html') },
  { id: 'estg-40a', label: '§ 40a EStG', publisher: LAW, url: gesetz('estg/__40a.html') },
  { id: 'estg-51a', label: '§ 51a EStG', publisher: LAW, url: gesetz('estg/__51a.html') },
  { id: 'solzg-3', label: '§ 3 SolZG 1995', publisher: LAW, url: gesetz('solzg_1995/__3.html') },
  { id: 'solzg-4', label: '§ 4 SolZG 1995', publisher: LAW, url: gesetz('solzg_1995/__4.html') },

  // Kirchensteuer
  {
    id: 'kist-saetze',
    label: 'KiSt-Sätze',
    publisher: 'Freie und Hansestadt Hamburg',
    url: 'https://www.hamburg.de/service/info/11364180/',
  },
  {
    id: 'kistg-bb',
    label: 'BbgKiStG',
    publisher: 'Land Brandenburg (BRAVORS)',
    url: 'https://bravors.brandenburg.de/gesetze/bbgkistg',
  },
  {
    id: 'kistg-hb',
    label: 'KiStG HB',
    publisher: 'Freie Hansestadt Bremen (Transparenzportal)',
    url: 'https://www.transparenz.bremen.de/metainformationen/gesetz-ueber-die-erhebung-von-steuern-durch-kirchen-andere-religionsgemeinschaften-und-weltanschauungsgemeinschaften-in-der-freien-hansestadt-bremen-kirchensteuergesetz-kistg-in-der-fassung-vom-23-august-2001-149240?template=20_gp_ifg_meta_detail_d',
    date: '2001-08-23',
  },
  {
    id: 'kistg-nw',
    label: 'KiStG NRW',
    publisher: 'Land Nordrhein-Westfalen (recht.nrw.de)',
    url: 'https://recht.nrw.de/lrgv/gesetz/29112019-gesetz-ueber-die-erhebung-von-kirchensteuern-im-land-nordrhein-westfalen/',
    date: '2019-11-29',
  },

  // Sozialversicherung
  {
    id: 'svbezgrv-2026',
    label: 'SVBezGrV 2026',
    publisher: LAW,
    url: gesetz('svbezgrv_2026/BJNR1160A0025.html'),
    date: '2025-11-24',
  },
  { id: 'sgb5-241', label: '§ 241 SGB V', publisher: LAW, url: gesetz('sgb_5/__241.html') },
  { id: 'sgb5-242', label: '§ 242 SGB V', publisher: LAW, url: gesetz('sgb_5/__242.html') },
  { id: 'sgb5-242a', label: '§ 242a SGB V', publisher: LAW, url: gesetz('sgb_5/__242a.html') },
  { id: 'sgb5-249', label: '§ 249 SGB V', publisher: LAW, url: gesetz('sgb_5/__249.html') },
  { id: 'sgb5-249b', label: '§ 249b SGB V', publisher: LAW, url: gesetz('sgb_5/__249b.html') },
  { id: 'sgb5-257', label: '§ 257 SGB V', publisher: LAW, url: gesetz('sgb_5/__257.html') },
  {
    id: 'bmg-zusatzbeitrag-2026',
    label: 'BMG 2026',
    publisher: 'Bundesministerium für Gesundheit',
    url: 'https://www.bundesgesundheitsministerium.de/beitraege',
    date: '2025-11-10',
  },
  { id: 'sgb11-55', label: '§ 55 SGB XI', publisher: LAW, url: gesetz('sgb_11/__55.html') },
  { id: 'sgb11-58', label: '§ 58 SGB XI', publisher: LAW, url: gesetz('sgb_11/__58.html') },
  { id: 'sgb11-61', label: '§ 61 SGB XI', publisher: LAW, url: gesetz('sgb_11/__61.html') },
  { id: 'sgb6-158', label: '§ 158 SGB VI', publisher: LAW, url: gesetz('sgb_6/__158.html') },
  { id: 'sgb6-168', label: '§ 168 SGB VI', publisher: LAW, url: gesetz('sgb_6/__168.html') },
  { id: 'sgb6-172', label: '§ 172 SGB VI', publisher: LAW, url: gesetz('sgb_6/__172.html') },
  { id: 'sgb3-341', label: '§ 341 SGB III', publisher: LAW, url: gesetz('sgb_3/__341.html') },
  { id: 'sgb4-8', label: '§ 8 SGB IV', publisher: LAW, url: gesetz('sgb_4/__8.html') },
  { id: 'sgb4-20', label: '§ 20 SGB IV', publisher: LAW, url: gesetz('sgb_4/__20.html') },
  {
    id: 'bmas-faktor-f-2026',
    label: 'BAnz AT 18.12.2025 B5',
    publisher: 'Bundesministerium für Arbeit und Soziales',
    url: 'https://www.bundesanzeiger.de/pub/publication/tEVvKJtcxc4VdUgfyAg/content/tEVvKJtcxc4VdUgfyAg/BAnz%20AT%2018.12.2025%20B5.pdf?inline=',
    date: '2025-12-18',
  },
  {
    id: 'milov5',
    label: 'MiLoV 5',
    publisher: LAW,
    url: gesetz('milov5/BJNR10C0A0025.html'),
    date: '2025-11-05',
  },
  {
    id: 'rs-uebergangsbereich',
    label: 'Rundschreiben Übergangsbereich',
    publisher: 'GKV-Spitzenverband, DRV Bund, Bundesagentur für Arbeit',
    url: 'https://www.minijob-zentrale.de/SharedDocs/Downloads/DE/Rundschreiben/Rundschreiben_Uebergangsbereich.pdf?__blob=publicationFile&v=5',
    date: '2022-12-20',
  },
  { id: 'bvv-2', label: '§ 2 BVV', publisher: LAW, url: gesetz('beitrvv/__2.html') },
];

/** @type {Readonly<Record<string, {id: string, label: string, publisher: string, url: string, date: string|null, accessed: string}>>} */
export const SOURCES = Object.freeze(
  Object.fromEntries(entries.map((e) => [e.id, Object.freeze({ date: null, accessed: ACCESSED, ...e })])),
);
