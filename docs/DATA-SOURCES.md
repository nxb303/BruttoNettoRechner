# Datenquellen und Parameter 2026

> Diese Datei wird mit `npm run docs:sources` aus `src/data/` erzeugt – nicht von Hand ändern.

Rechtsstand: 1. Januar 2026 · Datenstand und Abrufdatum aller Quellen: 1. Oktober 2026.

## Lohnsteuer (amtlicher Programmablaufplan, nicht doppelt gepflegt)

Die Lohnsteuer wird ausschließlich vom maschinell aus dem amtlichen XML erzeugten PAP berechnet. Die Werte erscheinen nur in der Erklärung.

| Parameter | Wert 2026 | Quelle |
|---|---|---|
| Grundfreibetrag | 12.348 € | [§ 32a EStG](https://www.gesetze-im-internet.de/estg/__32a.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Tarifzonen § 32a EStG | bis 12.348: 0; 12.349–17.799: (914,51·y + 1.400)·y; 17.800–69.878: (173,10·z + 2.397)·z + 1.034,87; 69.879–277.825: 0,42·x − 11.135,63; ab 277.826: 0,45·x − 19.470,38 | [§ 32a EStG](https://www.gesetze-im-internet.de/estg/__32a.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Arbeitnehmer-Pauschbetrag | 1.230 € | [§ 9a EStG](https://www.gesetze-im-internet.de/estg/__9a.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Sonderausgaben-Pauschbetrag | 36 € | [§ 10c EStG](https://www.gesetze-im-internet.de/estg/__10c.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Entlastungsbetrag Alleinerziehende (Steuerklasse II) | 4.260 € | [§ 24b EStG](https://www.gesetze-im-internet.de/estg/__24b.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Kinderfreibetrag + BEA je Kind (Zähler 1; Steuerklasse IV: halber Betrag) | 9.756 € (IV: 4.878 €) | [§ 32 EStG](https://www.gesetze-im-internet.de/estg/__32.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Soli-Freigrenze | 20.350 € (Splitting: 40.700 €) | [§ 3 SolZG 1995](https://www.gesetze-im-internet.de/solzg_1995/__3.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Grenzwerte Steuerklasse V/VI | 14.071 € / 34.939 € / 222.260 € | [§ 39b EStG](https://www.gesetze-im-internet.de/estg/__39b.html), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |
| Vorsorgepauschale: Teilbeträge | RV 9,3 %; KV 7 % + halber Zusatzbeitrag; PV 1,8 % (Sachsen 2,3 %, Zuschlag/Abschläge); AV 1,3 %; Höchstbetrag AV+KV+PV 1.900 € | [BMF 14.08.2025](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Lohnsteuer/2025-08-14-vorsorgepau-lohnsteuerabzugsverfahren.pdf?__blob=publicationFile&v=2), [PAP 2026 (XML)](https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml) |

## Sozialversicherung, Minijob, Übergangsbereich und Steuer-Erklärung

| Parameter | Wert | Quelle(n) |
|---|---|---|
| Beitragsbemessungsgrenze Renten- und Arbeitslosenversicherung (bundeseinheitlich, Monat) | 8.450,00 € | [SVBezGrV 2026](https://www.gesetze-im-internet.de/svbezgrv_2026/BJNR1160A0025.html) |
| Beitragsbemessungsgrenze Kranken- und Pflegeversicherung (Monat) | 5.812,50 € | [SVBezGrV 2026](https://www.gesetze-im-internet.de/svbezgrv_2026/BJNR1160A0025.html) |
| Versicherungspflichtgrenze (Jahresarbeitsentgeltgrenze, Jahr) | 77.400,00 € | [SVBezGrV 2026](https://www.gesetze-im-internet.de/svbezgrv_2026/BJNR1160A0025.html) |
| Allgemeiner Beitragssatz Krankenversicherung (gesamt) | 14,6 % | [§ 241 SGB V](https://www.gesetze-im-internet.de/sgb_5/__241.html) |
| Arbeitnehmeranteil Krankenversicherung | 7,3 % | [§ 249 SGB V](https://www.gesetze-im-internet.de/sgb_5/__249.html) |
| Durchschnittlicher Zusatzbeitragssatz (Vorgabe im Formular; Arbeitnehmer trägt die Hälfte) | 2,9 % | [§ 242a SGB V](https://www.gesetze-im-internet.de/sgb_5/__242a.html), [BMG 2026](https://www.bundesgesundheitsministerium.de/beitraege) |
| Beitragssatz Pflegeversicherung (gesamt) | 3,6 % | [§ 55 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__55.html) |
| Arbeitnehmeranteil Pflegeversicherung | 1,8 % | [§ 55 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__55.html) |
| Arbeitnehmeranteil Pflegeversicherung in Sachsen | 2,3 % | [§ 58 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__58.html) |
| Beitragszuschlag für Kinderlose ab 23 Jahren (nur Arbeitnehmer) | 0,6 % | [§ 55 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__55.html) |
| Beitragsabschlag je Kind unter 25 Jahren ab dem 2. Kind, höchstens 4 Abschläge (nur Arbeitnehmer) | 0,25 % | [§ 55 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__55.html) |
| Beitragssatz Rentenversicherung (gesamt) | 18,6 % | [§ 158 SGB VI](https://www.gesetze-im-internet.de/sgb_6/__158.html) |
| Beitragssatz Arbeitslosenversicherung (gesamt) | 2,6 % | [§ 341 SGB III](https://www.gesetze-im-internet.de/sgb_3/__341.html) |
| Geringfügigkeitsgrenze (Minijob, Monat) | 603,00 € | [§ 8 SGB IV](https://www.gesetze-im-internet.de/sgb_4/__8.html), [MiLoV 5](https://www.gesetze-im-internet.de/milov5/BJNR10C0A0025.html) |
| Eigenanteil Rentenversicherung im Minijob (Arbeitnehmer) | 3,6 % | [§ 168 SGB VI](https://www.gesetze-im-internet.de/sgb_6/__168.html), [§ 172 SGB VI](https://www.gesetze-im-internet.de/sgb_6/__172.html) |
| Pauschalbeitrag Rentenversicherung im Minijob (Arbeitgeber) | 15 % | [§ 172 SGB VI](https://www.gesetze-im-internet.de/sgb_6/__172.html) |
| Pauschalbeitrag Krankenversicherung im Minijob (Arbeitgeber) | 13 % | [§ 249b SGB V](https://www.gesetze-im-internet.de/sgb_5/__249b.html) |
| Pauschalsteuer im Minijob (Annahme: Arbeitgeber trägt sie) | 2 % | [§ 40a EStG](https://www.gesetze-im-internet.de/estg/__40a.html) |
| Obergrenze des Übergangsbereichs (Midijob, Monat) | 2.000,00 € | [§ 20 SGB IV](https://www.gesetze-im-internet.de/sgb_4/__20.html) |
| Faktor F für den Übergangsbereich (28 % ÷ 42,3 %) | 0,6619 | [BAnz AT 18.12.2025 B5](https://www.bundesanzeiger.de/pub/publication/tEVvKJtcxc4VdUgfyAg/content/tEVvKJtcxc4VdUgfyAg/BAnz%20AT%2018.12.2025%20B5.pdf?inline=) |
| Höchstzuschuss PKV Pflege: Arbeitgebersatz × BBG | 1,8 % | [§ 61 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__61.html) |
| Höchstzuschuss PKV Pflege in Sachsen: Arbeitgebersatz × BBG | 1,3 % | [§ 61 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__61.html) |
| Höchstbetrag AV-/KV-/PV-Teilbeträge der Vorsorgepauschale | 1.900,00 € | [§ 39b EStG](https://www.gesetze-im-internet.de/estg/__39b.html), [BMF 14.08.2025](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Lohnsteuer/2025-08-14-vorsorgepau-lohnsteuerabzugsverfahren.pdf?__blob=publicationFile&v=2) |
| Solidaritätszuschlag, Satz | 5,5 % | [§ 4 SolZG 1995](https://www.gesetze-im-internet.de/solzg_1995/__4.html) |
| Solidaritätszuschlag, Milderungszone | 11,9 % | [§ 4 SolZG 1995](https://www.gesetze-im-internet.de/solzg_1995/__4.html) |

Die Zuschuss-Obergrenze der privaten Krankenversicherung ergibt sich aus Beitragsbemessungsgrenze × (7,3 % + ½ durchschnittlicher Zusatzbeitrag) = 508,59 € pro Monat ([§ 257 SGB V](https://www.gesetze-im-internet.de/sgb_5/__257.html)), für die Pflege aus BBG × 1,8 % = 104,63 € (Sachsen: 1,3 % = 75,56 €; [§ 61 SGB XI](https://www.gesetze-im-internet.de/sgb_11/__61.html)).

Die Beitragsbemessungsgrenzen sind seit 2025 bundeseinheitlich; es gibt keine Ost/West-Unterscheidung.

## Kirchensteuer

Kirchensteuer = Maßstabsteuer (PAP-Ausgabe `BK`, § 51a EStG) × Satz, auf volle Cent abgerundet.

| Bundesland | Satz | Quellen |
|---|---|---|
| Baden-Württemberg | 8 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Bayern | 8 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Berlin | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Brandenburg | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/), [BbgKiStG](https://bravors.brandenburg.de/gesetze/bbgkistg) |
| Bremen | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/), [KiStG HB](https://www.transparenz.bremen.de/metainformationen/gesetz-ueber-die-erhebung-von-steuern-durch-kirchen-andere-religionsgemeinschaften-und-weltanschauungsgemeinschaften-in-der-freien-hansestadt-bremen-kirchensteuergesetz-kistg-in-der-fassung-vom-23-august-2001-149240?template=20_gp_ifg_meta_detail_d) |
| Hamburg | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Hessen | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Mecklenburg-Vorpommern | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Niedersachsen | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Nordrhein-Westfalen | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/), [KiStG NRW](https://recht.nrw.de/lrgv/gesetz/29112019-gesetz-ueber-die-erhebung-von-kirchensteuern-im-land-nordrhein-westfalen/) |
| Rheinland-Pfalz | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Saarland | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Sachsen | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Sachsen-Anhalt | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Schleswig-Holstein | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |
| Thüringen | 9 % | [§ 51a EStG](https://www.gesetze-im-internet.de/estg/__51a.html), [KiSt-Sätze](https://www.hamburg.de/service/info/11364180/) |

Landesgesetze sind nur dort verlinkt, wo das Landesrechtsportal beim Erstellen erreichbar war und die Adresse geprüft werden konnte (BB, HB, NW). Für alle Länder belegt die Seite der Freien und Hansestadt Hamburg den Satz von 8 % (BW, BY) bzw. 9 %.

## Quellenverzeichnis

Alle URLs wurden am Abrufdatum geprüft (`npm run check:sources`).

| ID | Titel | Herausgeber | Stand | Abgerufen | URL |
|---|---|---|---|---|---|
| `bmf-pap-2026` | BMF: Programmablaufpläne für den Lohnsteuerabzug 2026 (BMF-Schreiben vom 12.11.2025) | Bundesministerium der Finanzen | 12. November 2025 | 1. Oktober 2026 | <https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html> |
| `bmf-pap-2026-xml` | BMF / ITZBund: Programmablaufplan 2026 als XML-Pseudocode (Lohn- und Einkommensteuerrechner) | BMF / ITZBund | 23. Oktober 2025 | 1. Oktober 2026 | <https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml> |
| `bmf-vsp-2026` | BMF-Schreiben vom 14.08.2025: Vorsorgepauschale im Lohnsteuerabzugsverfahren ab 2026 | Bundesministerium der Finanzen | 14. August 2025 | 1. Oktober 2026 | <https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Lohnsteuer/2025-08-14-vorsorgepau-lohnsteuerabzugsverfahren.pdf?__blob=publicationFile&v=2> |
| `estg-32a` | § 32a EStG – Einkommensteuertarif | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__32a.html> |
| `estg-39b` | § 39b EStG – Einbehaltung der Lohnsteuer | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__39b.html> |
| `estg-9a` | § 9a EStG – Pauschbeträge für Werbungskosten | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__9a.html> |
| `estg-10c` | § 10c EStG – Sonderausgaben-Pauschbetrag | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__10c.html> |
| `estg-24b` | § 24b EStG – Entlastungsbetrag für Alleinerziehende | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__24b.html> |
| `estg-32` | § 32 EStG – Kinder, Freibeträge für Kinder | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__32.html> |
| `estg-40a` | § 40a EStG – Pauschalierung der Lohnsteuer in Sonderfällen (Minijobs) | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__40a.html> |
| `estg-51a` | § 51a EStG – Festsetzung und Erhebung von Zuschlagsteuern (Kirchensteuer) | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/estg/__51a.html> |
| `solzg-3` | § 3 Solidaritätszuschlaggesetz 1995 – Bemessungsgrundlage, Freigrenze | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/solzg_1995/__3.html> |
| `solzg-4` | § 4 Solidaritätszuschlaggesetz 1995 – Zuschlagsatz, Milderungszone | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/solzg_1995/__4.html> |
| `kist-saetze` | Freie und Hansestadt Hamburg: Berechnung der Kirchensteuer (Satz 8 % bzw. 9 %) | Freie und Hansestadt Hamburg | – | 1. Oktober 2026 | <https://www.hamburg.de/service/info/11364180/> |
| `kistg-bb` | Brandenburgisches Kirchensteuergesetz (BbgKiStG) | Land Brandenburg (BRAVORS) | – | 1. Oktober 2026 | <https://bravors.brandenburg.de/gesetze/bbgkistg> |
| `kistg-hb` | Bremisches Kirchensteuergesetz (KiStG) in der Fassung vom 23. August 2001 | Freie Hansestadt Bremen (Transparenzportal) | 23. August 2001 | 1. Oktober 2026 | <https://www.transparenz.bremen.de/metainformationen/gesetz-ueber-die-erhebung-von-steuern-durch-kirchen-andere-religionsgemeinschaften-und-weltanschauungsgemeinschaften-in-der-freien-hansestadt-bremen-kirchensteuergesetz-kistg-in-der-fassung-vom-23-august-2001-149240?template=20_gp_ifg_meta_detail_d> |
| `kistg-nw` | Kirchensteuergesetz Nordrhein-Westfalen (KiStG), Neufassung vom 29.11.2019 | Land Nordrhein-Westfalen (recht.nrw.de) | 29. November 2019 | 1. Oktober 2026 | <https://recht.nrw.de/lrgv/gesetz/29112019-gesetz-ueber-die-erhebung-von-kirchensteuern-im-land-nordrhein-westfalen/> |
| `svbezgrv-2026` | Sozialversicherungsrechengrößen-Verordnung 2026 (BGBl. 2025 I Nr. 278) | gesetze-im-internet.de (BMJV) | 24. November 2025 | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/svbezgrv_2026/BJNR1160A0025.html> |
| `sgb5-241` | § 241 SGB V – Allgemeiner Beitragssatz | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_5/__241.html> |
| `sgb5-242` | § 242 SGB V – Zusatzbeitrag | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_5/__242.html> |
| `sgb5-242a` | § 242a SGB V – Durchschnittlicher Zusatzbeitragssatz | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_5/__242a.html> |
| `sgb5-249` | § 249 SGB V – Tragung der Beiträge bei versicherungspflichtiger Beschäftigung | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_5/__249.html> |
| `sgb5-249b` | § 249b SGB V – Beitrag des Arbeitgebers bei geringfügiger Beschäftigung | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_5/__249b.html> |
| `sgb5-257` | § 257 SGB V – Beitragszuschüsse für Beschäftigte (private Krankenversicherung) | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_5/__257.html> |
| `bmg-zusatzbeitrag-2026` | Bundesministerium für Gesundheit: Beitragssätze der gesetzlichen Krankenversicherung, durchschnittlicher Zusatzbeitragssatz 2026 | Bundesministerium für Gesundheit | 10. November 2025 | 1. Oktober 2026 | <https://www.bundesgesundheitsministerium.de/beitraege> |
| `sgb11-55` | § 55 SGB XI – Beitragssatz, Beitragsabschlag und -zuschlag | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_11/__55.html> |
| `sgb11-58` | § 58 SGB XI – Tragung der Beiträge bei versicherungspflichtig Beschäftigten | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_11/__58.html> |
| `sgb11-61` | § 61 SGB XI – Beitragszuschüsse für Beschäftigte (private Pflegeversicherung) | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_11/__61.html> |
| `sgb6-158` | § 158 SGB VI – Beitragssätze | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_6/__158.html> |
| `sgb6-168` | § 168 SGB VI – Beitragstragung bei Beschäftigten | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_6/__168.html> |
| `sgb6-172` | § 172 SGB VI – Beitrag des Arbeitgebers bei geringfügiger Beschäftigung | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_6/__172.html> |
| `sgb3-341` | § 341 SGB III – Beitragssatz zur Arbeitslosenversicherung | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_3/__341.html> |
| `sgb4-8` | § 8 SGB IV – Geringfügige Beschäftigung und geringfügige selbständige Tätigkeit | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_4/__8.html> |
| `sgb4-20` | § 20 SGB IV – Beitragspflichtige Einnahmen, Übergangsbereich | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/sgb_4/__20.html> |
| `bmas-faktor-f-2026` | Bundesministerium für Arbeit und Soziales: Bekanntmachung des Faktors F für den Übergangsbereich 2026 (BAnz AT 18.12.2025 B5) | Bundesministerium für Arbeit und Soziales | 18. Dezember 2025 | 1. Oktober 2026 | <https://www.bundesanzeiger.de/pub/publication/tEVvKJtcxc4VdUgfyAg/content/tEVvKJtcxc4VdUgfyAg/BAnz%20AT%2018.12.2025%20B5.pdf?inline=> |
| `milov5` | Fünfte Mindestlohnanpassungsverordnung (MiLoV 5) | gesetze-im-internet.de (BMJV) | 5. November 2025 | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/milov5/BJNR10C0A0025.html> |
| `rs-uebergangsbereich` | Gemeinsames Rundschreiben von GKV-Spitzenverband, Deutscher Rentenversicherung Bund und Bundesagentur für Arbeit: Beschäftigungsverhältnisse im Übergangsbereich ab 01.01.2023 | GKV-Spitzenverband, DRV Bund, Bundesagentur für Arbeit | 20. Dezember 2022 | 1. Oktober 2026 | <https://www.minijob-zentrale.de/SharedDocs/Downloads/DE/Rundschreiben/Rundschreiben_Uebergangsbereich.pdf?__blob=publicationFile&v=5> |
| `bvv-2` | § 2 Beitragsverfahrensverordnung (BVV) – Berechnung der Beiträge | gesetze-im-internet.de (BMJV) | – | 1. Oktober 2026 | <https://www.gesetze-im-internet.de/beitrvv/__2.html> |

## Weitere Datengrundlagen

- Amtliche PAP-Prüftabellen (Anlage 1, Seiten 39–40) und BMF-Referenzfälle: siehe `test/fixtures/` und `vendor/bmf/README.md`.
- Verwendeter PAP: XML-Stand 2025-10-23 12:40, SHA-256 `63d8981646d139eba2f4dd990c13b43c4fb3883b402a5a40cddf253aa7aa96b4`.
