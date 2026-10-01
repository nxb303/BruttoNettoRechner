# Barrierefreiheit

**Konformitätsziel:** WCAG 2.2, Stufe AA (relevant auch für das Barrierefreiheitsstärkungsgesetz, BFSG);
zusätzlich erfüllt: erhöhter Kontrast nach Stufe AAA (1.4.6, ≥ 7 : 1).
Stand dieser Dokumentation: 01.10.2026. Die Erklärung für Besucher steht in der Datenschutzseite
(Abschnitt „Erklärung zur Barrierefreiheit“, `/datenschutz/#a11y` bzw. `/en/privacy/#a11y`) und ist im Footer verlinkt.

## Umgesetzte Maßnahmen

- Semantisches HTML5: genau eine `h1`, logische Überschriftenhierarchie, Landmarks (`header`, `main`, `footer`,
  `nav` für Sprachwahl und Rechtliches), Skip-Link, `lang` und `dir` je Seite, Fachbegriffe in englischen Texten mit `lang="de"`.
- Formular: `fieldset`/`legend` für Gruppen, sichtbare Labels, Hinweise per `aria-describedby`, Fehlertext je Feld
  (`aria-invalid`), Fehlerzusammenfassung (`role="alert"`) mit Links zu den Feldern und Fokus auf die
  Zusammenfassung (3.3.1, 3.3.3), abhängige Felder per `hidden`/`disabled`, `inputmode="decimal"` ohne Tippfehler-Sperren.
- Ergebnis: Live-Region `role="status"` mit Kurzfassung, Balkendiagramm als `role="img"` mit Textalternative und
  Textlegende (Farbe nie allein: Muster plus Beträge), Tabelle mit `caption` und Kopfzellen, Vorzeichen als „−“ plus
  unsichtbares Wort „abzüglich“/„zuzüglich“, externe Links mit unsichtbarem Hinweis „öffnet externe Website in neuem Tab“.
- Bedienung: alles per Tastatur erreichbar, keine Tastaturfallen, sichtbarer Fokus (3 px, mit Abstand), `details`/`summary` nativ,
  Zielgrößen ≥ 44 × 44 px (übertrifft 2.5.8).
- Darstellung: Textkontraste ≥ 7 : 1 (AAA, 1.4.6) in Hell- und Dunkelmodus, ≥ 3 : 1 für Bedienelemente und Grafik, Hell-/Dunkelmodus per
  `prefers-color-scheme`, `forced-colors`, `prefers-reduced-motion`, Reflow bis 320 px (Ergebnistabellen stapeln sich
  auf schmalen Bildschirmen), Textvergrößerung bis 200 %, Zoom nicht gesperrt, Druckstil mit aufgeklappten Rechenwegen.

## Prüfprotokoll

| Prüfung | Werkzeug | Ergebnis |
|---|---|---|
| Automatisiert (wcag2a, wcag2aa, wcag2aaa, wcag21a, wcag21aa, wcag22aa; inkl. `color-contrast-enhanced`) | axe-core in `test/e2e/a11y.spec.js` | 0 Verstöße: de/en × 375/1280 px × hell/dunkel × Leer-, Ergebnis-, Fehler-, PKV-/Faktor-Zustand und Rechtsseiten |
| Tastatur | `test/e2e/app.spec.js` | Tab-Reihenfolge, Enter berechnet, `details` per Enter/Leertaste, Radiogruppen per Pfeiltasten |
| Fokus | E2E | Fokusrahmen ≥ 3 px |
| Reflow (1.4.10) | E2E bei 320 px | kein horizontales Scrollen (leer, Ergebnis, alle Rechenwege offen) |
| HTML-Validität | html-validate (`npm run check`) | alle Seiten fehlerfrei |

Automatisierte Werkzeuge finden nur einen Teil der Probleme. Vor einer Veröffentlichung sollten zusätzlich
manuell geprüft werden: Screenreader (NVDA/Firefox, VoiceOver/Safari), Zoom 200 %/400 %, Windows-Kontrastmodus.

## Bekannte Grenzen

- Verlinkte Quellen (Gesetzestexte, PDF-Dokumente von Behörden) liegen außerhalb unserer Verantwortung.
- Der Rechenweg ist textlastig; Beträge in Fließtext sind für Screenreader als Ausdruck lesbar, aber lang.
- Es fand keine Prüfung mit allen gängigen Screenreader-Browser-Kombinationen statt.

## Rückmeldungen

Barrieren bitte an die im Impressum genannte Kontaktadresse melden (Platzhalter vor Veröffentlichung füllen).
