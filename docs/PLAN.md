# Implementierungsplan: Brutto-Netto-Rechner (Deutschland, Gehalt)

Stand des Plans: 01.10.2026 · Rechtsstand der Daten: Kalenderjahr 2026

Dieser Plan ist die verbindliche Vorgabe für die Umsetzung. Er enthält die fachlich
verifizierten Daten (mit amtlichen Quellen), die Architektur, die Schnittstellen,
die Teststrategie und die Abnahmekriterien. Abweichungen nur, wenn ein Punkt
nachweislich falsch ist – dann im Commit begründen.

---

## 1. Ziele und harte Anforderungen

| # | Anforderung | Konkretisierung / Messgröße |
|---|---|---|
| Z1 | Läuft komplett im Browser | Keine Server-Logik, keine API-Aufrufe zur Laufzeit. Statisches Hosting (z. B. GitHub Pages). |
| Z2 | Keine Cookies, kein Tracking | Weder Cookies noch `localStorage`/`sessionStorage`/IndexedDB. Keine externen Requests (keine CDNs, Webfonts, Analytics). Zustand nur im URL-Query (teilbar, bookmarkbar). Dadurch kein Cookie-Banner nötig (TDDDG § 25). |
| Z3 | Sehr schnelles Laden, geringe Größe | Budget Startseite: **≤ 40 KB gzip gesamt** (HTML + CSS + JS), ≤ 3 Requests für First View (HTML, 1 JS-Modul, Favicon). CSS inline im `<head>`, JS als `type="module"` (implizit deferred). Keine Laufzeit-Abhängigkeiten. Build-Skript bricht ab, wenn das Budget überschritten wird. |
| Z4 | Ansprechendes, einfaches Design | Eine Seite, klare Karte für Eingabe + Karte für Ergebnis; Systemschrift; Hell-/Dunkelmodus via `prefers-color-scheme`; dezente Akzentfarbe. |
| Z5 | Responsive | Mobile first; ab 60rem Breite zweispaltig (Formular links, Ergebnis rechts). Kein horizontales Scrollen ab 320 CSS-px (WCAG 1.4.10 Reflow). |
| Z6 | Standards & WCAG | **WCAG 2.2 Stufe AA** (relevant auch für BFSG), valides HTML5 (html-validate), semantisches Markup, CSP per `<meta>`, sichere Link-Attribute. |
| Z7 | i18n | Primärsprache Deutsch, Englisch mitgeliefert. Neue Sprache = 1 Wörterbuchdatei + 1 Registry-Eintrag, kein Code-Umbau. RTL vorbereitet (`dir`). |
| Z8 | Offizielle Datengrundlage | Lohnsteuer exakt nach **amtlichem BMF-Programmablaufplan (PAP) 2026**, maschinell aus dem amtlichen XML-Pseudocode erzeugt. SV-Werte aus Verordnungen/Gesetzen/Bekanntmachungen (Abschnitt 4). |
| Z9 | Nachvollziehbare Erklärung | Nach der Berechnung: jeder Posten mit Rechenweg (konkrete Zahlen) und Quellenangaben (Links auf Gesetze/BMF/BGBl.). |
| Z10 | Erweiterbar für weitere Jahre | Jahresdaten und PAP je Jahr als eigene Module; Jahresauswahl im UI vorbereitet. |

---

## 2. Fachlicher Umfang

### 2.1 Version 1 (umzusetzen)

Eingaben:

- Bruttogehalt (Betrag) mit Zeitraum **pro Monat / pro Jahr**
- Abrechnungsjahr (vorerst nur 2026; Auswahlfeld vorbereitet, bei nur einem Jahr als Text anzeigen)
- Steuerklasse I–VI
- Faktor (nur Steuerklasse IV, 3 Nachkommastellen, 0,001–0,999)
- Bundesland (16) → Kirchensteuersatz, Pflegeversicherungs-Besonderheit Sachsen
- Kirchensteuerpflicht ja/nein
- Kinderfreibeträge (0; 0,5; 1; … ; 6) – nur Steuerklassen I–IV, sonst deaktiviert
- Krankenversicherung: **gesetzlich** (Zusatzbeitragssatz der Kasse in %, Default 2,9 = Durchschnitt 2026) oder **privat** (Monatsbeitrag Basis-KV, Monatsbeitrag Pflege-Pflichtversicherung, Checkbox „Arbeitgeberzuschuss“ Default an)
- Pflegeversicherung (nur bei GKV): „Kinder vorhanden (Elterneigenschaft)“ ja/nein; wenn ja: „Anzahl Kinder unter 25 Jahren“ (0–10); „23 Jahre oder älter“ ja/nein (Default ja)
- Weitere Angaben (eingeklappt, `<details>`): Rentenversicherungspflicht (Default ja), Arbeitslosenversicherungspflicht (Default ja), monatlicher Lohnsteuer-Freibetrag (ELStAM), Faktor

Beschäftigungsarten (automatisch anhand des **monatlichen** Bruttos):

| Bereich | Monatsbrutto 2026 | Behandlung |
|---|---|---|
| Minijob | ≤ 603,00 € | Keine Lohnsteuer für AN (Annahme: Pauschalsteuer 2 % trägt AG, § 40a Abs. 2 EStG – als Hinweis ausweisen). RV-Eigenanteil AN 3,6 % des Entgelts, sofern nicht befreit (Option „RV-Befreiung“ erscheint nur hier). Keine KV/PV/AV-Beiträge des AN. |
| Übergangsbereich (Midijob) | 603,01 – 2.000,00 € | SV nach § 20 Abs. 2a SGB IV (Abschnitt 5.4). Lohnsteuer normal nach PAP auf **vollen** Arbeitslohn (Übergangsbereich ist steuerlich unbeachtlich, BMF-Schreiben Vorsorgepauschale v. 14.08.2025). |
| Regulär | > 2.000,00 € | SV regulär mit Beitragsbemessungsgrenzen. |

### 2.2 Ausdrücklich nicht in Version 1 (im UI und README als Grenzen nennen)

Versorgungsbezüge/Betriebsrenten, Altersentlastungsbetrag, Einmalzahlungen/sonstige Bezüge
(Weihnachtsgeld), geldwerte Vorteile (Dienstwagen), Entgeltumwandlung/bAV, knappschaftliche
RV, Aktivrente, Kurzarbeit, Mindestkirchensteuer/Kirchensteuer-Kappung, Umlagen U1/U2,
Hinzurechnungsbetrag, Mehrfachbeschäftigung. Die Architektur soll Einmalzahlungen (PAP-Eingang
`SONSTB`) später ermöglichen.

---

## 3. Architektur

### 3.1 Technologie

- **Vanilla JavaScript (ES2022, ES-Module)**, kein Framework, **null Laufzeit-Abhängigkeiten**.
- Dev-Abhängigkeiten (nur diese, Versionen pinnen):
  - `esbuild` (Bundling, Minify)
  - `@playwright/test` + `@axe-core/playwright` (E2E + Barrierefreiheit)
  - `html-validate` (HTML-Standardkonformität)
- Unit-Tests mit dem eingebauten **`node:test`** + `node:assert/strict` (keine Testbibliothek).
- Node ≥ 22. `package.json` mit `"type": "module"`.
- Umgebungshinweis: Chromium ist unter `/opt/pw-browsers` vorinstalliert (`PLAYWRIGHT_BROWSERS_PATH`); **nicht** `playwright install` ausführen. Bei Versionskonflikt `executablePath` setzen. In GitHub Actions dagegen `npx playwright install --with-deps chromium`.

### 3.2 Verzeichnisstruktur

```
/
├─ package.json
├─ README.md
├─ .editorconfig  .gitignore  .github/workflows/ci.yml
├─ docs/
│  ├─ PLAN.md                    (dieses Dokument)
│  ├─ DATA-SOURCES.md            (alle Parameter ↔ Quelle, Abrufdatum)
│  ├─ UPDATING-TAX-YEAR.md       (Jahreswechsel-Anleitung)
│  ├─ ADDING-A-LANGUAGE.md
│  └─ ACCESSIBILITY.md           (Konformitätsziel, Prüfprotokoll, bekannte Grenzen)
├─ vendor/bmf/
│  ├─ Lohnsteuer2026.xml         (amtlicher XML-Pseudocode, unverändert)
│  └─ README.md                  (Quelle, Abrufdatum, SHA-256)
├─ scripts/
│  ├─ generate-pap.mjs           (XML → JS-Transpiler)
│  ├─ fetch-bmf-reference.mjs    (Testfälle über BMF-Prüfschnittstelle erzeugen)
│  ├─ build.mjs                  (Pre-Rendering je Sprache, Bundling, CSP, Hashes)
│  └─ check-budget.mjs           (gzip-Größenbudget)
├─ src/
│  ├─ template/
│  │  ├─ index.html              (Template mit {{t:key}}-Platzhaltern)
│  │  ├─ legal-notice.html       (Impressum)
│  │  └─ privacy.html            (Datenschutzerklärung)
│  ├─ styles/main.css
│  ├─ main.js                    (Einstieg: liest Formular/URL, ruft Engine, rendert)
│  ├─ ui/
│  │  ├─ form.js                 (Lesen, Validierung, abhängige Felder, URL-Sync)
│  │  ├─ results.js              (Summen, Tabelle, Balken)
│  │  ├─ explain.js              (Rechenweg + Quellen rendern)
│  │  └─ dom.js                  (kleine Helfer, kein innerHTML mit Nutzerdaten)
│  ├─ i18n/
│  │  ├─ locales.js              (Registry)
│  │  ├─ index.js                (t(), Plural, Format-/Parse-Helfer)
│  │  ├─ de.js
│  │  └─ en.js
│  ├─ engine/
│  │  ├─ decimal.js              (BigInt-basierte BigDecimal-Teilmenge, Java-Semantik)
│  │  ├─ pap/lst2026.js          (GENERIERT – nicht von Hand ändern)
│  │  ├─ lohnsteuer.js           (Adapter Eingaben → PAP, Zwischenwerte für Erklärung)
│  │  ├─ sozialversicherung.js   (regulär, Midijob, Minijob, PKV-Zuschuss)
│  │  ├─ kirchensteuer.js
│  │  └─ calculate.js            (Orchestrierung, Ergebnisobjekt inkl. Erklärungsmodell)
│  └─ data/
│     ├─ years.js                (Registry: 2026 → Parameter + PAP-Modul)
│     ├─ 2026.js                 (alle Parameter mit Quellen-IDs)
│     ├─ states.js               (Bundesländer)
│     └─ sources.js              (Quellenkatalog)
├─ test/
│  ├─ decimal.test.js
│  ├─ pap2026-prueftabelle.test.js
│  ├─ pap2026-bmf.test.js
│  ├─ fixtures/pap2026-prueftabelle.json
│  ├─ fixtures/bmf-2026.json
│  ├─ sozialversicherung.test.js
│  ├─ calculate.test.js
│  ├─ i18n.test.js
│  └─ e2e/ (Playwright: app.spec.js, a11y.spec.js)
└─ dist/ (Build-Ausgabe, gitignored)
```

### 3.3 Datenfluss

```
Formular / URL-Query ──► form.js (validiert, normalisiert) ──► CalcInput
CalcInput ──► calculate.js
                ├─ sozialversicherung.js (Jahresparameter)
                ├─ lohnsteuer.js ──► pap/lst2026.js (amtlicher PAP)
                └─ kirchensteuer.js
          ◄── CalcResult (Beträge in Cent + Erklärungsschritte + Quellen-IDs + Hinweise)
CalcResult ──► results.js / explain.js (übersetzt via i18n, formatiert via Intl)
```

Die Engine ist **sprachneutral**: Sie liefert nur Schlüssel, Zahlen und Quellen-IDs.
Alle Texte entstehen im UI über `t()`.

---

## 4. Datengrundlage 2026 (verifiziert, mit Quellen)

Alle Werte sind gegen die amtlichen Dokumente geprüft. In `src/data/2026.js` hinterlegen,
jeder Wert mit `source`-ID aus `src/data/sources.js`. `docs/DATA-SOURCES.md` listet alle Werte,
Quellen und Abrufdatum.

### 4.1 Lohnsteuer (im PAP enthalten – nicht doppelt pflegen, nur zur Erklärung anzeigen)

| Parameter | Wert 2026 | Quelle |
|---|---|---|
| Grundfreibetrag | 12.348 € | § 32a EStG; PAP 2026 |
| Tarifzonen § 32a | bis 12.348: 0; 12.349–17.799: (914,51·y + 1.400)·y; 17.800–69.878: (173,10·z + 2.397)·z + 1.034,87; 69.879–277.825: 0,42·x − 11.135,63; ab 277.826: 0,45·x − 19.470,38 | § 32a EStG; PAP 2026 (UPTAB26) |
| Arbeitnehmer-Pauschbetrag | 1.230 € | § 9a S. 1 Nr. 1 EStG |
| Sonderausgaben-Pauschbetrag | 36 € | § 10c EStG |
| Entlastungsbetrag Alleinerziehende (StKl II) | 4.260 € | § 24b EStG |
| Kinderfreibetrag + BEA je Kind (Zähler 1) | 9.756 € (StKl IV: 4.878 €) | § 32 Abs. 6 EStG; PAP 2026 |
| Soli-Freigrenze | 20.350 € (Splitting: 40.700 €) | § 3 SolZG 1995; PAP 2026 |
| Soli-Satz / Milderungszone | 5,5 % / max. 11,9 % des Überschusses über Freigrenze | § 4 SolZG 1995 |
| Grenzwerte StKl V/VI | 14.071 / 34.939 / 222.260 € | § 39b Abs. 2 S. 7 EStG; PAP 2026 |
| Vorsorgepauschale | RV 9,3 %, KV 7 % + KVZ/2, PV 1,8 % (+0,6 % / −0,25 % je Kind; Sachsen 2,3 %), AV 1,3 %; Höchstbetrag AV+KV+PV 1.900 € | § 39b Abs. 2 S. 5 Nr. 3 EStG; BMF-Schreiben 14.08.2025; PAP 2026 |

### 4.2 Sozialversicherung

| Parameter | Wert 2026 | Quelle |
|---|---|---|
| BBG RV/AV (bundeseinheitlich) | 8.450 €/Monat, 101.400 €/Jahr | SVBezGrV 2026 (BGBl. 2025 I Nr. 278) |
| BBG KV/PV | 5.812,50 €/Monat, 69.750 €/Jahr | SVBezGrV 2026 |
| Versicherungspflichtgrenze (JAEG) | 77.400 €/Jahr (6.450 €/Monat) | SVBezGrV 2026 |
| KV allgemeiner Beitragssatz | 14,6 % (AN 7,3 %) | § 241 SGB V, § 249 SGB V |
| KV durchschnittlicher Zusatzbeitrag | 2,9 % (Default; AN trägt die Hälfte) | § 242a SGB V; Bekanntmachung BMG (BAnz 10.11.2025) |
| PV Beitragssatz | 3,6 % (AN 1,8 %, AG 1,8 %) | § 55 Abs. 1 SGB XI |
| PV Sachsen | AN 2,3 %, AG 1,3 % | § 58 Abs. 3 SGB XI |
| PV Zuschlag Kinderlose (ab 23 J.) | +0,6 % nur AN | § 55 Abs. 3 SGB XI |
| PV Abschlag Kinder < 25 | −0,25 % je Kind vom 2. bis 5. Kind, nur AN | § 55 Abs. 3 SGB XI |
| RV Beitragssatz | 18,6 % (AN 9,3 %) | § 158 SGB VI; PAP 2026 Abschn. 1 |
| AV Beitragssatz | 2,6 % (AN 1,3 %) | § 341 SGB III; PAP 2026 Abschn. 1 |
| Geringfügigkeitsgrenze | 603 €/Monat (Mindestlohn 13,90 € × 130 / 3) | § 8 Abs. 1a SGB IV; MiLoV5 |
| Übergangsbereich | 603,01 – 2.000,00 € | § 20 Abs. 2 SGB IV |
| Faktor F | 0,6619 (= 28 % / 42,3 %) | Bekanntmachung BMAS, BAnz AT 18.12.2025 B5 |
| Minijob RV-Eigenanteil AN | 3,6 % (18,6 % − 15 % AG-Pauschale) | § 168 Abs. 1 Nr. 1b SGB VI; § 172 Abs. 3 SGB VI |
| PKV AG-Zuschuss max. KV | 508,59 €/Monat (5.812,50 × (7,3 % + 1,45 %)) | § 257 Abs. 2 SGB V |
| PKV AG-Zuschuss max. PV | 104,63 €/Monat (Sachsen 75,56 €) | § 61 Abs. 2 SGB XI |

Hinweis: Die BBG Ost/West sind seit 2025 vereinheitlicht – keine Ost/West-Unterscheidung bauen.

### 4.3 Kirchensteuer

- 8 % in Baden-Württemberg und Bayern, 9 % in allen anderen Ländern (Kirchensteuergesetze der Länder; Bemessungsgrundlage § 51a EStG = PAP-Ausgang `BK`).
- Kirchensteuer = `BK` × Satz, auf volle Cent **abgerundet**.
- Quellen: § 51a EStG + je Land die amtliche Fundstelle (Bayern: gesetze-bayern.de, BW: landesrecht-bw.de; für die 9 %-Länder ebenfalls amtliche Landesrechtsportale). **Jede URL muss beim Implementieren geprüft (HTTP 200) und in `sources.js` eingetragen werden.**

### 4.4 Quellenkatalog (Startbestand für `src/data/sources.js`)

Jeder Eintrag: `{ id, title: { de, en }, publisher, url, date, accessed: '2026-10-01' }`.

| ID | Titel | URL |
|---|---|---|
| `bmf-pap-2026` | BMF: Programmablaufpläne zur Lohnsteuer 2026 (BMF-Schreiben v. 12.11.2025) | https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html |
| `bmf-pap-2026-xml` | BMF/ITZBund: PAP 2026 als XML-Pseudocode | https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml |
| `bmf-vsp-2026` | BMF-Schreiben Vorsorgepauschale im Lohnsteuerabzug ab 2026 (14.08.2025) | https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Lohnsteuer/2025-08-14-vorsorgepau-lohnsteuerabzugsverfahren.pdf?__blob=publicationFile&v=2 |
| `estg-32a` | § 32a EStG – Einkommensteuertarif | https://www.gesetze-im-internet.de/estg/__32a.html |
| `estg-39b` | § 39b EStG – Lohnsteuerabzug | https://www.gesetze-im-internet.de/estg/__39b.html |
| `estg-9a` | § 9a EStG – Pauschbeträge für Werbungskosten | https://www.gesetze-im-internet.de/estg/__9a.html |
| `estg-10c` | § 10c EStG – Sonderausgaben-Pauschbetrag | https://www.gesetze-im-internet.de/estg/__10c.html |
| `estg-24b` | § 24b EStG – Entlastungsbetrag für Alleinerziehende | https://www.gesetze-im-internet.de/estg/__24b.html |
| `estg-32` | § 32 EStG – Kinder, Freibeträge | https://www.gesetze-im-internet.de/estg/__32.html |
| `estg-40a` | § 40a EStG – Pauschalierung bei Minijobs | https://www.gesetze-im-internet.de/estg/__40a.html |
| `estg-51a` | § 51a EStG – Zuschlagsteuern | https://www.gesetze-im-internet.de/estg/__51a.html |
| `solzg-3` / `solzg-4` | §§ 3, 4 SolZG 1995 | https://www.gesetze-im-internet.de/solzg_1995/__3.html, …/__4.html |
| `svbezgrv-2026` | Sozialversicherungsrechengrößen-Verordnung 2026 (BGBl. 2025 I Nr. 278) | https://www.gesetze-im-internet.de/svbezgrv_2026/BJNR1160A0025.html |
| `sgb5-241` / `sgb5-242` / `sgb5-242a` / `sgb5-249` / `sgb5-257` | SGB V | https://www.gesetze-im-internet.de/sgb_5/__241.html (analog) |
| `bmg-zusatzbeitrag-2026` | BMG: durchschnittlicher Zusatzbeitragssatz 2026 | https://www.bundesgesundheitsministerium.de/beitraege |
| `sgb11-55` / `sgb11-58` / `sgb11-61` | SGB XI | https://www.gesetze-im-internet.de/sgb_11/__55.html (analog) |
| `sgb6-158` / `sgb6-168` | SGB VI | https://www.gesetze-im-internet.de/sgb_6/__158.html (analog) |
| `sgb3-341` | § 341 SGB III | https://www.gesetze-im-internet.de/sgb_3/__341.html |
| `sgb4-8` / `sgb4-20` | §§ 8, 20 SGB IV | https://www.gesetze-im-internet.de/sgb_4/__8.html, …/__20.html |
| `bmas-faktor-f-2026` | BMAS: Bekanntmachung Faktor F 2026 (BAnz AT 18.12.2025 B5) | https://www.bundesanzeiger.de/pub/publication/tEVvKJtcxc4VdUgfyAg/content/tEVvKJtcxc4VdUgfyAg/BAnz%20AT%2018.12.2025%20B5.pdf?inline= |
| `milov5` | Fünfte Mindestlohnanpassungsverordnung | https://www.gesetze-im-internet.de/milov5/BJNR10C0A0025.html |
| `rs-uebergangsbereich` | GKV-SV/DRV/BA: Gemeinsames Rundschreiben Übergangsbereich | https://www.minijob-zentrale.de/SharedDocs/Downloads/DE/Rundschreiben/Rundschreiben_Uebergangsbereich.pdf?__blob=publicationFile&v=5 |
| `bvv-2` | § 2 Beitragsverfahrensverordnung | https://www.gesetze-im-internet.de/bvv/__2.html |

Alle URLs beim Implementieren einmal per `curl -sIL` prüfen; nicht erreichbare URLs ersetzen
(amtliche Alternative) und im Commit nennen.

---

## 5. Rechenkern (Engine)

### 5.1 `decimal.js` – BigDecimal-Teilmenge mit Java-Semantik

Der PAP ist in Java-`BigDecimal`-Pseudocode geschrieben. Gleitkomma (`Number`) ist für die
Steuer **verboten**. Implementiere eine kleine Klasse auf `BigInt`-Basis (Wert = `unscaled × 10^-scale`):

- Statisch: `ZERO`, `ONE`, `TEN`, `valueOf(numberOrString)` (Zahl über `String(n)` parsen, Exponentenschreibweise `1e-7` unterstützen), Rundungskonstanten mit Java-Werten: `ROUND_UP = 0`, `ROUND_DOWN = 1`, `ROUND_CEILING = 2`, `ROUND_FLOOR = 3`, `ROUND_HALF_UP = 4`.
- Instanz: `add`, `subtract`, `multiply` (exakt), `divide(d)` (exakt; wirft bei nicht abbrechender Division wie Java), `divide(d, scale, mode)`, `setScale(scale, mode)`, `compareTo` (−1/0/1), `signum`, `negate`, `longValue` (Richtung 0 abschneiden), `toNumber`, `toString`, `toCents()` (Hilfsfunktion für Ausgaben in Cent).
- Rundungssemantik exakt wie Java: `ROUND_UP` = weg von 0, `ROUND_DOWN` = Richtung 0 (auch für negative Werte!), `ROUND_HALF_UP` = kaufmännisch.
- Die interne Skala darf von Java abweichen, solange der **Wert** exakt ist (der PAP vergleicht/rundet nur wertbasiert).
- Tests: Tabelle von Java-Referenzfällen (positive/negative Zahlen, alle Modi, Division mit Skala, exakte Division `/12` von Tabellenwerten wie 1140, 990, 315, 9).

### 5.2 `scripts/generate-pap.mjs` – amtlichen PAP automatisch übersetzen

Grund: Der BMF empfiehlt ausdrücklich die Übersetzung des XML-Pseudocodes statt Handportierung
(Rundungsfehler). Ein Generator macht künftige Jahre trivial (neue XML → neu generieren → Prüftabelle testen).

Ablauf:

1. XML aus `vendor/bmf/Lohnsteuer<JAHR>.xml` lesen. Die Datei 2026 vorher herunterladen von
   `https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml`
   und SHA-256 prüfen: `63d8981646d139eba2f4dd990c13b43c4fb3883b402a5a40cddf253aa7aa96b4`
   (Stand der XML: „2025-10-23 12:40“). Datei unverändert committen (UTF-8 mit BOM – beim Parsen BOM entfernen).
2. Minimaler, abhängigkeitsfreier XML-Parser im Skript (die Struktur ist einfach: `PAP`, `VARIABLES/INPUTS|OUTPUTS|INTERNALS`, `CONSTANTS`, `METHODS/MAIN|METHOD`, `EVAL exec`, `EXECUTE method`, `IF expr` mit `THEN`/`ELSE`). Kommentare ignorieren, Entities (`&lt; &gt; &amp;`) dekodieren.
3. Ausgabe `src/engine/pap/lst2026.js`: `export class Lohnsteuer2026 { … }` mit
   - Feld je INPUT/OUTPUT/INTERNAL inkl. Default (`BigDecimal.ZERO` → `BigDecimal.ZERO`, `int` → `0`, `double` → Zahl). **Achtung:** In der amtlichen XML steht beim INPUT `VJAHR` der Tippfehler `defaul="0"`, und `R` hat keinen Default → fehlende Defaults: `int` = 0, `BigDecimal` = `ZERO`.
   - Konstanten als statische/Instanz-Arrays (`{a, b}` → `[a, b]`).
   - Je METHOD eine Methode; `EXECUTE` → `this.NAME()`; `IF` → `if/else`; `EVAL` → Zuweisung.
   - Ausdrucksübersetzung per Tokenizer: jeder Bezeichner, der eine bekannte Variable/Konstante ist und **nicht** nach einem `.` steht, erhält `this.`-Präfix. `BigDecimal.xxx` bleibt (Import aus `decimal.js` als `BigDecimal`). Java-`int`-Arithmetik (`VJAHR - 2004`) bleibt JS-Zahl.
   - `setInputs(obj)`, `run()` (führt `MAIN` aus), `getOutputs()`; Eingaben vom Typ BigDecimal akzeptieren `BigDecimal`, Zahl oder String.
   - Kopfkommentar: „GENERIERT aus amtlichem BMF-PAP – nicht bearbeiten“, Quelle, SHA-256 der XML, Generator-Version.
4. npm-Skript `gen:pap`. Ein Test stellt sicher, dass die committete Datei dem Generator-Output entspricht (Drift-Schutz).

### 5.3 `lohnsteuer.js` – Adapter

- Monatliche Abrechnung als Standard: `LZZ = 2`, `RE4 = Monatsbrutto in Cent`. Jahreswerte = 12 × Monatswerte (Annahme gleichbleibendes Gehalt; in der Erklärung nennen). Bei Eingabe „pro Jahr“: Monatsbrutto = Jahresbrutto / 12, kaufmännisch auf Cent.
- Mapping: `STKL`, `ZKF` (Kinderfreibeträge, nur I–IV, sonst 0), `R` (1 wenn kirchensteuerpflichtig, sonst 0), `KVZ` (Zusatzbeitrag in %, bei GKV), `PKV` (0/1), `PKPV`/`PKPVAGZ` (Monatswerte in Cent; PKPV = Basis-KV + PPV-Beitrag, PKPVAGZ = berechneter steuerfreier AG-Zuschuss, 0 wenn Checkbox aus), `PVS` (1 bei Sachsen), `PVZ` (1 wenn kinderlos und ≥ 23 J.), `PVA` (Abschläge = `min(max(kinderUnter25 − 1, 0), 4)`, nur wenn PVZ = 0), `KRV` (1 wenn nicht RV-pflichtig), `ALV` (1 wenn nicht AV-pflichtig), `af`/`f` (Faktor nur StKl IV), `LZZFREIB` (Freibetrag monatlich in Cent).
- **Zwischenwerte für die Erklärung:** Da der PAP bei `ZKF > 0` die Steuer ein zweites Mal (mit Kinderfreibeträgen, nur für Soli/KiSt) berechnet und dabei interne Felder überschreibt, zwei Läufe machen:
  1. Lauf mit `ZKF = 0` → Zwischenwerte für die Lohnsteuer-Erklärung: `ZRE4J, JLFREIB, ANP, SAP, EFA, VSPR, VSPKVPV, VSPALV, VSPHB, VSP, ZTABFB, ZVE, KZTAB, X, ST, LSTJAHR`, Tarifzone.
  2. Lauf mit echten Eingaben → Ausgaben `LSTLZZ, SOLZLZZ, BK` und `JBMG, SOLZJ, SOLZFREI` für die Soli-/KiSt-Erklärung.
  - Assertion (auch im Test): `LSTLZZ` beider Läufe ist identisch.
- Minijob (≤ 603 €): PAP nicht aufrufen, Lohnsteuer/Soli/KiSt = 0 mit Hinweis Pauschalsteuer (AG).

### 5.4 `sozialversicherung.js`

Allgemeine Regeln:

- Alle Beträge mit `decimal.js`, Ergebnis je Posten **kaufmännisch auf Cent** (`ROUND_HALF_UP`).
- Jeder Zweig getrennt berechnet und gerundet; KV-Grundbeitrag und KV-Zusatzbeitrag getrennt (so auch im amtlichen Rundschreiben-Beispiel); PV-Grundanteil und Kinderlosenzuschlag getrennt.
- Zusätzlich AG-Anteile berechnen (für optionale Anzeige „Arbeitgeberkosten“).

Regulär (> 2.000 €):

- `basisKV = min(brutto, 5.812,50)`, `basisRV = min(brutto, 8.450)`
- KV-AN = basisKV × 7,3 %; Zusatz-AN = basisKV × KVZ/2
- PV-AN = basisKV × (1,8 % bzw. Sachsen 2,3 % − 0,25 % × Abschläge); Zuschlag = basisKV × 0,6 % (kinderlos, ≥ 23)
- RV-AN = basisRV × 9,3 % (wenn RV-pflichtig); AV-AN = basisRV × 1,3 % (wenn AV-pflichtig)

Übergangsbereich (603,01–2.000 €), § 20 Abs. 2a SGB IV, Gemeinsames Rundschreiben Tz. 4.3.3.1:

- `BE  = F·G + ( OG/(OG−G) − G/(OG−G)·F ) · (AE − G)` → auf Cent runden (Grundlage Gesamtbeitrag; Kinderlosenzuschlag)
- `BE_AN = OG/(OG−G) · (AE − G)` → auf Cent runden (Grundlage AN-Anteil)
- mit G = 603, OG = 2.000, F = 0,6619, AE = Monatsbrutto
- AN-Anteile (KV, Zusatz, PV inkl. Abschlägen, RV, AV) = `BE_AN × AN-Satz`; Kinderlosenzuschlag = `BE × 0,6 %`
- Gesamtbeitrag je Zweig = `round(BE × halber Satz) × 2`; AG-Anteil = Gesamtbeitrag − AN-Anteil (Zuschlag nicht abziehen)
- Bei PKV im Übergangsbereich: nur RV/AV nach obiger Logik.

Minijob (≤ 603 €): RV-AN = Brutto × 3,6 % (wenn nicht befreit), sonst alles 0.

PKV:

- Keine KV/PV-Beiträge vom Lohn; stattdessen Posten „Beitrag PKV“ und „Beitrag PPV“ (negativ) und „Arbeitgeberzuschuss“ (positiv, steuerfrei).
- AG-Zuschuss KV = min(KV-Beitrag/2, 5.812,50 × (7,3 % + 1,45 %)); PV = min(PV-Beitrag/2, 5.812,50 × 1,8 % bzw. 1,3 % Sachsen).
- Hinweis, wenn Jahresbrutto ≤ JAEG 77.400 € (PKV i. d. R. nur oberhalb möglich).

### 5.5 `calculate.js` – Ergebnisobjekt

```js
/** @typedef {{
 *  year: 2026, gross: number, period: 'month'|'year',
 *  taxClass: 1|2|3|4|5|6, factor?: number, childAllowances: number,
 *  state: 'BW'|'BY'|'BE'|'BB'|'HB'|'HH'|'HE'|'MV'|'NI'|'NW'|'RP'|'SL'|'SN'|'ST'|'SH'|'TH',
 *  churchTax: boolean,
 *  health: { type: 'statutory', additionalRate: number }
 *        | { type: 'private', kvPremium: number, pvPremium: number, employerSubsidy: boolean },
 *  care: { hasChildren: boolean, childrenUnder25: number, age23OrOlder: boolean },
 *  pensionInsured: boolean, unemploymentInsured: boolean, minijobRvExempt: boolean,
 *  monthlyTaxAllowance: number
 * }} CalcInput */
```

`CalcResult`:

- `employment: 'minijob'|'midijob'|'regular'`
- `items[]`: `{ id, group: 'tax'|'social'|'private'|'subsidy', monthly: cents, yearly: cents, explanation: { steps: [{ key, values }], sources: [id…] } }` – IDs: `incomeTax, solidarity, churchTax, health, healthAdditional, care, careSurcharge, pension, unemployment, pkv, ppv, employerSubsidy`
- `totals`: `gross, taxes, social, net` (monatlich/jährlich, Cent)
- `employer`: AG-Anteile + Summe Arbeitgeberkosten
- `warnings[]`: i18n-Schlüssel, z. B. `warn.factorOnlyClass4`, `warn.pkvBelowJaeg`, `warn.class2NeedsChild`, `warn.minijobFlatTax`
- `meta`: Rechtsstand, PAP-Version, Datenstand

Netto = Brutto − Lohnsteuer − Soli − KiSt − SV-AN-Anteile (− PKV/PPV-Beiträge + AG-Zuschuss).

### 5.6 Erklärungsmodell (Rechenweg)

Für jeden Posten geordnete Schritte mit echten Zahlen. Mindestumfang:

- **Lohnsteuer:** Hochrechnung Jahresarbeitslohn → − Freibetrag → − Arbeitnehmer-Pauschbetrag → − Sonderausgaben-Pauschbetrag → − Entlastungsbetrag Alleinerziehende (II) → − Vorsorgepauschale (Teilbeträge RV, KV/PV, AV und Höchstbetrag 1.900 € erklären) → zu versteuerndes Einkommen → Tarif (Grund-/Splittingtarif, Tarifzone + Formel) bzw. § 39b Abs. 2 S. 7 (V/VI) → Faktor (IV) → Jahreslohnsteuer → Monatsanteil (/12, abgerundet). Hinweis: Kinderfreibeträge mindern die Lohnsteuer nicht (nur Soli/KiSt).
- **Soli:** Bemessungsgrundlage (Jahreslohnsteuer mit Kinderfreibeträgen) vs. Freigrenze; 5,5 % oder Milderungszone 11,9 %; Monatsanteil.
- **Kirchensteuer:** Bemessungsgrundlage (Maßstabsteuer `BK`) × 8/9 % je Bundesland.
- **KV/PV/RV/AV:** Bemessungsgrundlage (ggf. BBG-Kappung oder Midijob-Formeln mit Zahlen) × AN-Satz.
- **Netto:** Summenbildung.

Jeder Schritt verweist auf Quellen-IDs; das UI zeigt sie als Links (`<cite>`), dazu ein
Quellenverzeichnis aller verwendeten Quellen am Ende.

---

## 6. Benutzeroberfläche

### 6.1 Layout

- **Header:** Titel „Brutto-Netto-Rechner 2026“, Kurzbeschreibung, Sprachumschalter (Links mit `hreflang`/`lang`, behalten den Query-String).
- **Main:** Formular-Karte und Ergebnis-Karte; mobil untereinander, ab 60rem nebeneinander (`grid-template-columns: minmax(20rem, 28rem) minmax(0, 1fr)`), max. Breite 72rem.
- **Ergebnis-Karte:** große Netto-Zahl (Monat und Jahr), gestapelter Balken Netto/Steuern/Sozialabgaben (`role="img"` + `aria-label` mit Prozentangaben; Farbe nie alleiniger Informationsträger – Legende mit Text und Beträgen), Tabelle (Posten | Monat | Jahr, `<caption>`, `<th scope>`), Hinweise (Midijob, Minijob, Warnungen), Abschnitt „Rechenweg und Quellen“ mit `<details>` je Posten, eingeklappt „Arbeitgeberkosten“, Button „Drucken“ (Druck-Stylesheet).
- **Footer:** Rechtsstand/Datenstand, „Berechnung erfolgt ausschließlich lokal in Ihrem Browser. Keine Cookies, keine Datenübertragung.“, Haftungsausschluss („keine Steuerberatung, alle Angaben ohne Gewähr“), Links Impressum/Datenschutz.
- Vor dem ersten Rechnen: Ergebnis-Karte mit kurzem Platzhaltertext; Beispielwert im Formular vorbelegt? **Nein** – Feld leer, Platzhalter „z. B. 4.000“.

### 6.2 Formularverhalten

- Natives `<form>`, Submit-Button „Netto berechnen“. Nach dem ersten Rechnen bei jeder Änderung automatisch neu rechnen (debounced 250 ms).
- Betragsfelder: `type="text"`, `inputmode="decimal"`, `autocomplete="off"`; Parser akzeptiert lokalisierte Formate (de: `3.500,50`, en: `3,500.50`), Leerzeichen, `€`.
- Abhängige Felder: Faktor nur bei IV; Kinderfreibeträge bei V/VI deaktiviert (mit Erklärung); GKV-/PKV-Felder umschalten; Kinder-unter-25-Feld nur bei „Kinder vorhanden“; Minijob-RV-Befreiung nur bei ≤ 603 €. Ausblenden per `hidden`-Attribut, nicht nur per CSS.
- Gruppen mit `<fieldset>`/`<legend>`; Radio-Gruppen für Zeitraum, KV-Art, Kirchensteuer.
- Validierung: Fehlertext unter dem Feld (`aria-describedby`, `aria-invalid="true"`), Fehlerzusammenfassung oben im Formular mit Links zu den Feldern, Fokus auf die Zusammenfassung bei Submit (WCAG 3.3.1, 3.3.3). Keine reine Farb-Signalisierung.
- URL-Zustand: Nach Berechnung `history.replaceState` mit kompakten Query-Parametern (z. B. `?b=4000&p=m&stkl=1&bl=NW&kist=1&kfb=0&kv=g&zb=2.9&k=0&a23=1`). Beim Laden Formular aus Query vorbelegen und automatisch rechnen. Ungültige Parameter ignorieren. **Kein Web-Storage.**
- Live-Region: `role="status"` (polite) kündigt nur eine Kurzfassung an („Netto: 2.850,12 € pro Monat“), nicht die ganze Tabelle.

### 6.3 Design-System (`main.css`)

- Systemschrift: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; Zahlen mit `font-variant-numeric: tabular-nums`.
- CSS Custom Properties für Farben/Abstände/Radien; zwei Themes über `@media (prefers-color-scheme: dark)`. Kontraste: Text ≥ 4,5:1, große Schrift/Grafikelemente/Fokusrahmen ≥ 3:1 (axe prüft).
- Akzentfarbe ruhiges Petrol/Blau; Steuern/Sozialabgaben/Netto im Balken unterscheidbar auch in Graustufen (Muster oder Helligkeitsabstand) und mit Textlegende.
- Fokus: `:focus-visible` mit 3px-Outline + Offset, nie entfernen. `forced-colors`-Modus berücksichtigen.
- Zielgrößen ≥ 44×44 px für Bedienelemente (übertrifft WCAG 2.5.8).
- `prefers-reduced-motion`: keine Animationen (generell sparsam animieren).
- Fluid Type mit `clamp()`, Basisschrift 1rem, Zeilenhöhe 1.5; Text bis 200 % vergrößerbar ohne Verlust; Reflow bei 320 px.
- Druck-Stylesheet: Formular-Zusammenfassung + Ergebnis + Rechenweg (alle `<details>` aufgeklappt via JS `beforeprint`), Links mit URL ausgeben.

### 6.4 Barrierefreiheit – Checkliste (zusätzlich zu axe)

Skip-Link „Zum Rechner springen“; genau ein `<h1>`, logische Überschriftenhierarchie;
Landmarks (`header`, `main`, `footer`, `nav` für Sprachwahl); `<html lang>` korrekt je Seite,
Fremdsprachliche Fachbegriffe im EN-Text mit `lang="de"` auszeichnen; alle Bedienelemente per
Tastatur erreichbar in sinnvoller Reihenfolge; keine Tastaturfallen; sichtbarer Fokus;
`<details>`/`<summary>` nativ; Tabellen mit Caption und Header-Zellen; Beträge für Screenreader
eindeutig (Minuszeichen als echtes „−“ plus visuell versteckter Text „abzüglich“ wo nötig);
externe Links als solche erkennbar (Text oder `aria-describedby` „öffnet externe Website“);
`<noscript>`-Hinweis. Barrierefreiheitserklärung in `docs/ACCESSIBILITY.md` und als Abschnitt im Footer/Datenschutzseite verlinken.

---

## 7. Internationalisierung

- `src/i18n/locales.js`: `[{ code: 'de', name: 'Deutsch', dir: 'ltr', path: '/', default: true }, { code: 'en', name: 'English', dir: 'ltr', path: '/en/' }]`.
- Wörterbücher als ES-Module mit flachen, hierarchisch benannten Schlüsseln (`form.gross.label`, `explain.incomeTax.step.vsp`, `source.estg-32a.title` …). Platzhalter `{name}`; Pluralisierung über `Intl.PluralRules`.
- `t(key, params)`; fehlende Schlüssel: im Test Fehler, zur Laufzeit Fallback auf Deutsch.
- Zahlen/Währung/Prozent ausschließlich über `Intl.NumberFormat(locale, …)`; Währung immer EUR.
- **Pre-Rendering je Sprache** (Build): statische Texte stehen bereits im HTML (schnell, SEO, kein Flackern). JS-Bundle je Sprache enthält nur das eigene Wörterbuch (esbuild-Alias/`define`).
- `<link rel="alternate" hreflang="de|en|x-default">` auf allen Seiten, `<link rel="canonical">`.
- Englisch: deutsche Fachbegriffe in Klammern ergänzen, z. B. „Wage tax (Lohnsteuer)“, „Solidarity surcharge (Solidaritätszuschlag)“, „Tax class (Steuerklasse)“.
- Test `i18n.test.js`: alle Locales haben exakt dieselben Schlüssel und dieselben Platzhalter je Schlüssel; Registry und Dateien konsistent.
- `docs/ADDING-A-LANGUAGE.md`: Schritte (Wörterbuch kopieren, übersetzen, Registry-Eintrag, Build, Tests). Rechtstexte (Impressum/Datenschutz) je Sprache als Template.

---

## 8. Build, Sicherheit, Standards

`scripts/build.mjs`:

1. esbuild: `src/main.js` je Locale bündeln, minifizieren, ES2020-Ziel, Content-Hash im Dateinamen (`assets/app.de.[hash].js`).
2. CSS minifizieren (esbuild) und **inline** in `<style>` einsetzen.
3. HTML-Template je Locale rendern (`{{t:key}}`, Pfade, `lang`, `dir`, `hreflang`), Ausgabe `dist/index.html`, `dist/en/index.html`, `dist/impressum/index.html`, `dist/datenschutz/index.html`, `dist/en/legal-notice/index.html`, `dist/en/privacy/index.html`, `dist/404.html`, `robots.txt`, `sitemap.xml`, `favicon.svg`.
4. **CSP per `<meta http-equiv="Content-Security-Policy">`**: `default-src 'none'; script-src 'self'; style-src 'sha256-<hash des Inline-CSS>'; img-src 'self'; base-uri 'none'; form-action 'none'; manifest-src 'none'` (Hash im Build berechnen). Keine Inline-Event-Handler, keine Inline-Skripte. Zusätzlich `<meta name="referrer" content="no-referrer">`.
5. `docs/DEPLOYMENT.md` (oder README-Abschnitt): empfohlene HTTP-Header für Hoster, die Header erlauben (CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy` restriktiv, `Cross-Origin-Opener-Policy: same-origin`), Cache: HTML `no-cache`, Assets mit Hash `immutable`.
6. `check-budget.mjs`: gzip-Größe aller für `/` und `/en/` ausgelieferten Dateien summieren; Budget 40 KB → sonst Exit-Code 1. Ausgabe einer Größentabelle.
7. `html-validate` über alle `dist/**/*.html`.

Weitere Standards: `<meta name="viewport" content="width=device-width, initial-scale=1">` (Zoom nicht sperren), `<meta name="description">`, `theme-color` für hell/dunkel, `color-scheme`-Meta, Favicon als SVG, keine Abhängigkeit von JS für das Lesen der Rechtstexte.

npm-Skripte: `gen:pap`, `test` (node:test für `test/*.test.js`), `build`, `check` (validate + budget), `test:e2e`, `serve` (kleiner statischer Server mit `node:http` für `dist/`, nur Dev), `fetch:bmf` (Referenzfälle neu erzeugen).

CI (`.github/workflows/ci.yml`): Node 22, `npm ci`, `npm test`, `npm run build`, `npm run check`, Playwright-E2E; Deployment auf GitHub Pages nur bei Push auf `main` (separater Job, `actions/deploy-pages`). Hinweis an den Nutzer: Pages muss im Repo aktiviert werden.

---

## 9. Teststrategie (Abnahmerelevant)

1. **`decimal.test.js`** – Java-Semantik aller verwendeten Operationen (siehe 5.1).
2. **`pap2026-prueftabelle.test.js`** – die **amtlichen Prüftabellen** aus PAP 2026, Anlage 1, S. 39–40, als Fixture `test/fixtures/pap2026-prueftabelle.json` abtippen (Quelle im Fixture vermerken):
   - „Allgemeine“ Tabelle: `LZZ = 1`, `RE4 = Jahresbrutto × 100`, `ALV = KRV = PKV = 0`, `KVZ = 2.90`, `PVZ = 0` in StKl II, sonst `PVZ = 1`. Erwartet: `LSTLZZ / 100` = Tabellenwert.
   - „Besondere“ Tabelle: `ALV = KRV = PKV = 1`, `PKPV = 50000` (StKl III), `0` (StKl VI), sonst `30000`. Erwartet wie oben.
   - 44 Bruttostufen (5.000 – 110.000 € in 2.500er-Schritten) × 6 Steuerklassen × 2 Tabellen = **528 Prüfungen, alle exakt**.
   - Stichproben zur Kontrolle beim Abtippen: allgemein 50.000 € → I 6.788, II 5.580, III 2.810, IV 6.788, V 12.010, VI 12.542; besonders 50.000 € → I 8.880, III 3.824, VI 16.773.
3. **`pap2026-bmf.test.js`** – Abgleich mit der **BMF-Prüfschnittstelle** (Nutzung laut BMF ausdrücklich nur für Programmtests erlaubt):
   - `scripts/fetch-bmf-reference.mjs` ruft `https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml?code=LSt2026ext&LZZ=2&RE4=…&STKL=…&…` auf (Parameter wie PAP-Eingänge; Antwort-XML mit `<ausgabe name="LSTLZZ" value="…"/>`; prüfen, dass alle Eingaben `status="ok"` haben). Höchstens 1 Anfrage/Sekunde.
   - Raster ≈ 250 Fälle: Monatsbrutto {650, 1.000, 1.600, 2.000, 2.500, 3.500, 4.500, 5.800, 7.000, 8.500, 12.000, 25.000 €} × StKl 1–6, plus Variationen von `ZKF` (0,5/1/2,5), `R` (0/1), `KVZ` (1,5/2,9/4,4), `PVS`, `PVZ`, `PVA` (1–4), `KRV`, `ALV`, `PKV` mit `PKPV`/`PKPVAGZ`, Faktor (`af=1`, `f=0.912`), `LZZFREIB`.
   - Ergebnis als `test/fixtures/bmf-2026.json` committen (mit Abrufdatum und Hinweis auf Nutzungsbedingungen). Test vergleicht `LSTLZZ`, `SOLZLZZ`, `BK` exakt – offline, ohne Netz.
   - Bekannter Referenzfall (bereits abgefragt): `LZZ=2, RE4=500000, STKL=1, R=1, KVZ=2.9, PVZ=1, ZKF=1` → `LSTLZZ=78241`, `SOLZLZZ=0`, `BK=52008`.
4. **`sozialversicherung.test.js`**
   - **Amtliches Beispiel 8 des Gemeinsamen Rundschreibens** (Übergangsbereich) mit dessen Parametern reproduzieren (Engine ist parametrisiert!): G = 520, OG = 2.000, F = 0,6922, AE = 950 €, KV 14,6 %, ZB 1,5 %, PV 3,05 % + 0,35 % Zuschlag, RV 18,6 %, AV 2,6 % → BE 836,45; BE_AN 581,08; AN: KV 42,42, Zusatz 4,36, PV 8,86, Zuschlag 2,93, RV 54,04, AV 7,55; AG: KV 87,88, PV 16,66, RV 101,54, AV 14,19.
   - Midijob 2026 (kinderlos, ≥ 23, ZB 2,9 %, nicht Sachsen):
     - 1.000 € → BE 854,06; BE_AN 568,36; KV 41,49; Zusatz 8,24; PV 10,23; Zuschlag 5,12; RV 52,86; AV 7,39 (Summe 125,33)
     - 1.500 € → BE 1.427,03; BE_AN 1.284,18; KV 93,75; Zusatz 18,62; PV 23,12; Zuschlag 8,56; RV 119,43; AV 16,69 (Summe 280,17)
     - 2.000 € → BE = BE_AN = 2.000,00 (Stetigkeit zur regulären Berechnung: Summe 435,00)
   - Regulär: BBG-Kappung (z. B. 7.000 €: KV-Basis 5.812,50; RV-Basis 7.000; 10.000 €: RV-Basis 8.450), Sachsen, Abschläge (2–6 Kinder → max. 4 Abschläge), RV/AV-frei, Minijob (500 € → RV 18,00; befreit → 0).
   - PKV-Zuschuss: Deckel 508,59 € / 104,63 € / Sachsen 75,56 €, Hälfte-Regel.
5. **`calculate.test.js`** – End-to-End der Engine. Referenzfall: 5.000 €/Monat, StKl I, NW, kirchensteuerpflichtig, 0 Kinderfreibeträge, GKV ZB 2,9 %, kinderlos ≥ 23:
   Lohnsteuer 782,41 · Soli 0,00 · KiSt 9 % 70,41 · KV 365,00 · Zusatz 72,50 · PV 1,8 % 90,00 + Zuschlag 30,00 · RV 465,00 · AV 65,00 → **Netto 3.059,68 €**. (Lohnsteuer per BMF-Schnittstelle bestätigt; KiSt = 78241 Cent BK × 9 % abgerundet.) Zusätzlich: Konsistenz (Netto = Brutto − Summe Abzüge), Jahreswerte = 12 × Monat, Monats-/Jahreseingabe gleichwertig, Erklärung enthält für jeden Posten ≥ 1 Schritt und ≥ 1 gültige Quellen-ID.
6. **`i18n.test.js`** – Schlüssel-/Platzhalter-Parität, Formatierung de/en, Parser für lokalisierte Zahlen.
7. **E2E (Playwright, Chromium)** – je Locale (de, en) und Viewport (375×800, 1280×900):
   - Formular ausfüllen → Ergebnis sichtbar, Netto korrekt (Referenzfall), URL-Query gesetzt, Neuladen stellt Ergebnis wieder her.
   - Nur-Tastatur-Durchlauf (Tab-Reihenfolge, Enter rechnet, `<details>` per Tastatur).
   - Validierungsfehler werden angesagt (Fehlerzusammenfassung fokussiert).
   - **axe-core: 0 Verstöße** (Tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`) im Leer- und Ergebniszustand, hell und dunkel (`colorScheme`).
   - Reflow: Viewport 320 px → kein horizontales Scrollen (`scrollWidth <= clientWidth`).
   - Keine Cookies (`context.cookies()` leer), kein Web-Storage-Zugriff (Storage leer), keine Requests an fremde Origins (Request-Listener).
8. **Build-Checks:** html-validate fehlerfrei, Budget ≤ 40 KB gzip, Generator-Drift-Test.

---

## 10. Umsetzungsphasen (je Phase ein oder mehrere Commits, Tests grün)

| Phase | Inhalt | Abnahme |
|---|---|---|
| P0 | Projektgerüst: `package.json`, Skripte, `.gitignore` (`node_modules`, `dist`, `test-results`), `.editorconfig`, README-Gerüst | `npm test` läuft (leer) |
| P1 | `decimal.js` + Tests; XML nach `vendor/bmf/` (SHA prüfen); `generate-pap.mjs`; generierte `lst2026.js`; Prüftabellen-Fixture + Test; BMF-Referenzskript + Fixture + Test | 528/528 Prüftabellenwerte exakt; alle BMF-Fälle exakt |
| P2 | `data/2026.js`, `states.js`, `sources.js`; `sozialversicherung.js`, `kirchensteuer.js`, `lohnsteuer.js`, `calculate.js` inkl. Erklärungsmodell + Tests | alle Tests aus 9.4/9.5 grün; alle Quellen-URLs geprüft |
| P3 | i18n-Infrastruktur, `de.js`, `en.js` (vollständig, inkl. Erklärungs- und Quellentexte) + Tests | Parität grün |
| P4 | HTML-Templates, CSS, UI-Module, Rechtsseiten (Impressum/Datenschutz mit klar markierten Platzhaltern für Betreiberangaben) | manuell im Browser geprüft (de/en, mobil/desktop, hell/dunkel) |
| P5 | Build-Pipeline, CSP, Budget, html-validate, Dev-Server | `npm run build && npm run check` grün, Größentabelle im Commit-Text |
| P6 | Playwright-E2E + axe | alle E2E grün |
| P7 | Doku (`README`, `DATA-SOURCES`, `UPDATING-TAX-YEAR`, `ADDING-A-LANGUAGE`, `ACCESSIBILITY`, Deployment/Headers), CI-Workflow | Doku vollständig, CI-Datei valide |

### Definition of Done (gesamt)

- Alle Tests (Unit, Prüftabelle, BMF-Fixtures, E2E inkl. axe) grün; Build-Checks grün.
- Größenbudget eingehalten; keine Laufzeitabhängigkeiten; keine externen Requests; keine Cookies/kein Storage.
- Jeder Ergebnisposten hat Rechenweg + Quelle; alle Quellen-URLs erreichbar.
- Deutsch und Englisch vollständig; neue Sprache gemäß Doku ohne Codeänderung ergänzbar.
- README beschreibt Nutzung, Umfang/Grenzen, Datenstand, Entwicklung, Tests, Deployment.

---

## 11. Jahreswechsel (Kurzfassung für `docs/UPDATING-TAX-YEAR.md`)

1. Neue PAP-XML vom BMF laden (`vendor/bmf/Lohnsteuer<JAHR>.xml`), SHA-256 notieren, `npm run gen:pap`.
2. Prüftabellen aus dem neuen PAP-PDF (Anlage 1) als Fixture erfassen; BMF-Referenzfälle mit neuem Zugangscode erzeugen (Code steht auf bmf-steuerrechner.de → Externe Programmierschnittstelle).
3. `src/data/<JAHR>.js` aus SVBezGrV, Bekanntmachungen (Zusatzbeitrag, Faktor F), Mindestlohn/Geringfügigkeitsgrenze anlegen; Quellen ergänzen.
4. Jahr in `years.js` registrieren; UI zeigt Jahresauswahl automatisch, sobald > 1 Jahr.
5. Alle Tests + Doku aktualisieren.

## 12. Offene Punkte für den Betreiber (nicht vom Code lösbar)

- Impressum (§ 5 DDG) und Datenschutzerklärung mit echten Betreiberangaben füllen.
- Hosting/Domain wählen; GitHub Pages im Repository aktivieren, falls genutzt.
- Lizenz des Projekts festlegen.
