# Jahreswechsel

Beispiel: Umstellung von 2026 auf 2027. Jahresdaten und PAP liegen je Jahr in eigenen Modulen;
die Jahresauswahl im Formular erscheint automatisch, sobald mehr als ein Jahr registriert ist.

1. **Amtlichen PAP holen.** Neue XML vom BMF laden
   (`https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer<JAHR>.xml.xhtml`) und
   unverändert als `vendor/bmf/Lohnsteuer<JAHR>.xml` ablegen. SHA-256 und XML-Stand in
   `vendor/bmf/README.md` eintragen. Dann `npm run gen:pap -- <JAHR>` – erzeugt
   `src/engine/pap/lst<JAHR>.js`. Der Generator bricht bei unbekannten Konstrukten ab; neue Methoden
   oder Felder im PAP werden automatisch übersetzt.
2. **Prüftabellen erfassen.** Aus dem neuen PAP (Anlage 1, letzte Seiten: „Allgemeine“ und „Besondere
   maschinelle Jahreslohnsteuer“) die Werte als `test/fixtures/pap<JAHR>-prueftabelle.json` ablegen
   (gleiche Struktur wie 2026, Quelle und PDF-SHA-256 im Fixture vermerken) und
   `test/pap<JAHR>-prueftabelle.test.js` aus der 2026er-Datei ableiten. Der Test muss **alle** Werte
   exakt treffen.
3. **BMF-Referenzfälle erzeugen.** Zugangscode des neuen Jahres auf bmf-steuerrechner.de
   („Externe Programmierschnittstelle“) nachsehen, in `scripts/fetch-bmf-reference.mjs` (`YEAR`,
   `ACCESS_CODE`) anpassen und `npm run fetch:bmf` ausführen (höchstens eine Anfrage pro Sekunde, nur für
   Testfixtures). Fixture als `test/fixtures/bmf-<JAHR>.json` committen.
4. **Parameter anlegen.** `src/data/<JAHR>.js` aus `2026.js` ableiten. Quellen:
   - Sozialversicherungsrechengrößen-Verordnung (Beitragsbemessungsgrenzen, Versicherungspflichtgrenze),
   - Bekanntmachung des durchschnittlichen Zusatzbeitragssatzes (BMG),
   - Bekanntmachung des Faktors F (BMAS, Bundesanzeiger),
   - Mindestlohn-Anpassungsverordnung (Geringfügigkeitsgrenze = Mindestlohn × 130 ÷ 3),
   - Beitragssätze (§ 241 SGB V, § 55 SGB XI, § 158 SGB VI, § 341 SGB III) und Kirchensteuersätze.
   Neue Quellen in `src/data/sources.js` eintragen (URL mit `npm run check:sources` prüfen) und die
   Titel in **allen** Wörterbüchern ergänzen (`source.<id>.title`).
5. **Jahr registrieren.** In `src/data/years.js` das Datenmodul und den PAP-Import ergänzen. Die Tests
   (`data.test.js`) gleichen die Daten mit dem PAP ab: Beitragsbemessungsgrenzen, Beitragssätze,
   Tarifkonstanten der Erklärung, Soli-Parameter.
6. **Vorgaben im Code prüfen.** `src/ui/form.js` (Minijob-Grenze) und `src/engine/calculate.js` lesen die
   Daten des Standardjahres; Texte mit Jahreszahl nutzen den Platzhalter `{year}`. Texte, die sich fachlich
   ändern (z. B. Tarifzonen in den Erklärungen), im Wörterbuch anpassen.
7. **Alles ausführen:** `npm test`, `npm run build`, `npm run check`, `npm run test:e2e`,
   `npm run docs:sources`. `docs/DATA-SOURCES.md` und README (Datenstand) aktualisieren.

Rechtsänderungen unterjährig (z. B. neuer Zusatzbeitragssatz): Daten ändern, `dataAsOf` aktualisieren,
Quellen neu prüfen, `npm run docs:sources`.
