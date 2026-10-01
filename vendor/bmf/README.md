# Amtlicher BMF-Programmablaufplan (PAP) als XML-Pseudocode

| Datei | Quelle | Abruf | SHA-256 |
|---|---|---|---|
| `Lohnsteuer2026.xml` | https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml | 01.10.2026 | `63d8981646d139eba2f4dd990c13b43c4fb3883b402a5a40cddf253aa7aa96b4` |

Stand der Datei laut Kommentar im XML: „2025-10-23 12:40“ (ITZBund Berlin). Zugehöriges
BMF-Schreiben vom 12.11.2025:
https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html

Die Datei ist **unverändert** abgelegt (UTF-8 mit BOM, Original-Zeilenenden; über
`.gitattributes` vor Zeilenende-Konvertierung geschützt). Sie ist die einzige Eingabe für
`scripts/generate-pap.mjs`, das daraus `src/engine/pap/lst2026.js` erzeugt. Nicht von Hand ändern.
