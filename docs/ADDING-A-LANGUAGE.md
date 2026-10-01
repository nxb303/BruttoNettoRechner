# Neue Sprache hinzufügen

Eine Sprache besteht aus **einer Wörterbuchdatei** und **einem Registry-Eintrag** – am Code ändert sich nichts.
Beispiel: Französisch (`fr`).

1. **Wörterbuch kopieren:** `src/i18n/en.js` → `src/i18n/fr.js` (der Dateiname ist der Sprachcode) und alle
   Texte übersetzen. Schlüssel und Platzhalter (`{name}`) bleiben unverändert; ein Platzhalter darf in der
   Übersetzung an anderer Stelle stehen, muss aber vorkommen.
   - Zahlen, Beträge, Prozentwerte und Daten werden über `Intl` formatiert (`{amount}` usw.) – nicht selbst formatieren.
   - Pluralformen (`{ one, other }`): `other` ist Pflicht, weitere Formen nach den `Intl.PluralRules`-Kategorien der Sprache
     (Vietnamesisch kennt nur `other`, siehe `src/i18n/vi.js`).
   - Deutsche Fachbegriffe in Klammern ergänzen und mit `[de:Begriff]` markieren; die Seite zeichnet sie
     dann als `lang="de"` aus (Screenreader sprechen sie deutsch).
   - Seiten-Adressen: `page.legal.slug` und `page.privacy.slug` bestimmen die Pfade der Rechtsseiten
     (`/fr/mentions-legales/`).
   - Rechtstexte (`legal.*`, `privacy.*`, `a11y.*`) sind Vorlagen mit Platzhaltern für Betreiberangaben; der
     Betreiber muss sie rechtlich prüfen lassen.
2. **Registry-Eintrag** in `src/i18n/locales.js`:
   ```js
   { code: 'fr', name: 'Français', intl: 'fr-FR', dir: 'ltr', path: '/fr/' }
   ```
   `dir: 'rtl'` aktiviert die Schreibrichtung rechts-nach-links (das Stylesheet nutzt logische Eigenschaften).
3. **Bauen und testen:** `npm run build && npm test`.
   - `test/i18n.test.js` prüft, dass das neue Wörterbuch dieselben Schlüssel und Platzhalter wie Deutsch hat,
     dass jede Quelle und jedes Bundesland einen Namen hat und dass alle Erklärungstexte mit den Engine-Werten
     formatierbar sind.
   - Der Build schlägt bei fehlenden Schlüsseln oder Parametern fehl.
4. **Prüfen:** Seiten unter `/fr/` im Browser ansehen (Textlängen, Umbrüche), `npm run test:e2e`
   (die E2E-Tests laufen für alle Sprachen aus `test/e2e/helpers.js`; für die neue Sprache dort einen Eintrag mit
   Name, Beispielwerten und Rechtsseiten-Pfaden ergänzen – Tab-Reihenfolge und Sprachwechsel-Test passen sich selbst an).

Fehlende Schlüssel fallen beim Bauen auf Deutsch zurück (die Bundles enthalten nur das eigene Wörterbuch);
die Tests sorgen dafür, dass das nie nötig wird. Statische Seitentexte (`form.*`, `legal.*`, …) stehen nur im
vorgerenderten HTML, nur Schlüssel mit den Präfixen aus `RUNTIME_PREFIXES` gelangen ins JavaScript-Bundle.
