// GENERIERT aus amtlichem BMF-PAP – nicht bearbeiten (npm run gen:pap).
// Quelle:    https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2026.xml.xhtml
// XML-Stand: 2025-10-23 12:40
// SHA-256:   63d8981646d139eba2f4dd990c13b43c4fb3883b402a5a40cddf253aa7aa96b4
// Generator: scripts/generate-pap.mjs
import { BigDecimal } from '../decimal.js';

export const PAP_INFO = { year: 2026, xmlStand: '2025-10-23 12:40', xmlSha256: '63d8981646d139eba2f4dd990c13b43c4fb3883b402a5a40cddf253aa7aa96b4' };

// Tabelle für die Prozentsätze des Versorgungsfreibetrags
const TAB1 = [0, 0.4, 0.384, 0.368, 0.352, 0.336, 0.32, 0.304, 0.288, 0.272, 0.256, 0.24, 0.224, 0.208, 0.192, 0.176, 0.16, 0.152, 0.144, 0.14, 0.136, 0.132, 0.128, 0.124, 0.12, 0.116, 0.112, 0.108, 0.104, 0.1, 0.096, 0.092, 0.088, 0.084, 0.08, 0.076, 0.072, 0.068, 0.064, 0.06, 0.056, 0.052, 0.048, 0.044, 0.04, 0.036, 0.032, 0.028, 0.024, 0.02, 0.016, 0.012, 0.008, 0.004, 0].map((x) => BigDecimal.valueOf(x));
// Tabelle für die Höchstbeträge des Versorgungsfreibetrags
const TAB2 = [0, 3000, 2880, 2760, 2640, 2520, 2400, 2280, 2160, 2040, 1920, 1800, 1680, 1560, 1440, 1320, 1200, 1140, 1080, 1050, 1020, 990, 960, 930, 900, 870, 840, 810, 780, 750, 720, 690, 660, 630, 600, 570, 540, 510, 480, 450, 420, 390, 360, 330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30, 0].map((x) => BigDecimal.valueOf(x));
// Tabelle für die Zuschläge zum Versorgungsfreibetrag
const TAB3 = [0, 900, 864, 828, 792, 756, 720, 684, 648, 612, 576, 540, 504, 468, 432, 396, 360, 342, 324, 315, 306, 297, 288, 279, 270, 261, 252, 243, 234, 225, 216, 207, 198, 189, 180, 171, 162, 153, 144, 135, 126, 117, 108, 99, 90, 81, 72, 63, 54, 45, 36, 27, 18, 9, 0].map((x) => BigDecimal.valueOf(x));
// Tabelle für die Höchstbeträge des Altersentlastungsbetrags
const TAB4 = [0, 0.4, 0.384, 0.368, 0.352, 0.336, 0.32, 0.304, 0.288, 0.272, 0.256, 0.24, 0.224, 0.208, 0.192, 0.176, 0.16, 0.152, 0.144, 0.14, 0.136, 0.132, 0.128, 0.124, 0.12, 0.116, 0.112, 0.108, 0.104, 0.1, 0.096, 0.092, 0.088, 0.084, 0.08, 0.076, 0.072, 0.068, 0.064, 0.06, 0.056, 0.052, 0.048, 0.044, 0.04, 0.036, 0.032, 0.028, 0.024, 0.02, 0.016, 0.012, 0.008, 0.004, 0].map((x) => BigDecimal.valueOf(x));
// Tabelle fuer die Hächstbeträge des Altersentlastungsbetrags
const TAB5 = [0, 1900, 1824, 1748, 1672, 1596, 1520, 1444, 1368, 1292, 1216, 1140, 1064, 988, 912, 836, 760, 722, 684, 665, 646, 627, 608, 589, 570, 551, 532, 513, 494, 475, 456, 437, 418, 399, 380, 361, 342, 323, 304, 285, 266, 247, 228, 209, 190, 171, 152, 133, 114, 95, 76, 57, 38, 19, 0].map((x) => BigDecimal.valueOf(x));
// Zahlenkonstanten fuer im Plan oft genutzte BigDecimal Werte
const ZAHL1 = BigDecimal.ONE;
const ZAHL2 = BigDecimal.valueOf(2);
const ZAHL5 = BigDecimal.valueOf(5);
const ZAHL7 = BigDecimal.valueOf(7);
const ZAHL12 = BigDecimal.valueOf(12);
const ZAHL100 = BigDecimal.valueOf(100);
const ZAHL360 = BigDecimal.valueOf(360);
const ZAHL500 = BigDecimal.valueOf(500);
const ZAHL700 = BigDecimal.valueOf(700);
const ZAHL1000 = BigDecimal.valueOf(1000);
const ZAHL10000 = BigDecimal.valueOf(10000);

// Typ der Eingabeparameter (für die Umwandlung in setInputs)
const INPUT_TYPES = {
  af: 'int',
  AJAHR: 'int',
  ALTER1: 'int',
  ALV: 'int',
  f: 'double',
  JFREIB: 'BigDecimal',
  JHINZU: 'BigDecimal',
  JRE4: 'BigDecimal',
  JRE4ENT: 'BigDecimal',
  JVBEZ: 'BigDecimal',
  KRV: 'int',
  KVZ: 'BigDecimal',
  LZZ: 'int',
  LZZFREIB: 'BigDecimal',
  LZZHINZU: 'BigDecimal',
  MBV: 'BigDecimal',
  PKPV: 'BigDecimal',
  PKPVAGZ: 'BigDecimal',
  PKV: 'int',
  PVA: 'BigDecimal',
  PVS: 'int',
  PVZ: 'int',
  R: 'int',
  RE4: 'BigDecimal',
  SONSTB: 'BigDecimal',
  SONSTENT: 'BigDecimal',
  STERBE: 'BigDecimal',
  STKL: 'int',
  VBEZ: 'BigDecimal',
  VBEZM: 'BigDecimal',
  VBEZS: 'BigDecimal',
  VBS: 'BigDecimal',
  VJAHR: 'int',
  ZKF: 'BigDecimal',
  ZMVB: 'int',
};

/**
 * Amtlicher Programmablaufplan 2026. Eine Instanz entspricht genau einem Lauf:
 * interne Felder (z. B. EFA) werden zwischen Läufen nicht zurückgesetzt.
 */
export class Lohnsteuer2026 {
  constructor() {
    // Eingabeparameter
    // 1, wenn die Anwendung des Faktorverfahrens gewählt wurden (nur in Steuerklasse IV)
    this.af = 1;
    // Auf die Vollendung des 64. Lebensjahres folgende Kalenderjahr (erforderlich, wenn ALTER1=1)
    this.AJAHR = 0;
    // 1, wenn das 64. Lebensjahr zu Beginn des Kalenderjahres vollendet wurde, in dem der Lohnzahlungszeitraum endet (§ 24 a EStG), sonst = 0
    this.ALTER1 = 0;
    // Merker für die Vorsorgepauschale 0 = der Arbeitnehmer ist in der Arbeitslosenversicherung pflichtversichert; es gilt die allgemeine Beitragsbemessungsgrenze 1 = wenn nicht 0
    this.ALV = 0;
    // eingetragener Faktor mit drei Nachkommastellen
    this.f = 1;
    // Jahresfreibetrag für die Ermittlung der Lohnsteuer für die sonstigen Bezüge sowie für Vermögensbeteiligungen nach § 19a Absatz 1 und 4 EStG nach Maßgabe der elektronischen Lohnsteuerabzugsmerkmale nach § 39e EStG oder der Eintragung auf der Bescheinigung für den Lohnsteuerabzug 2026 in Cent (ggf. 0)
    this.JFREIB = BigDecimal.ZERO;
    // Jahreshinzurechnungsbetrag für die Ermittlung der Lohnsteuer für die sonstigen Bezüge sowie für Vermögensbeteiligungen nach § 19a Absatz 1 und 4 EStG nach Maßgabe der elektronischen Lohnsteuerabzugsmerkmale nach § 39e EStG oder der Eintragung auf der Bescheinigung für den Lohnsteuerabzug 2026 in Cent (ggf. 0)
    this.JHINZU = BigDecimal.ZERO;
    // Voraussichtlicher Jahresarbeitslohn ohne sonstige Bezüge (d.h. auch ohne die zu besteuernden Vorteile bei Vermögensbeteiligungen, § 19a Absatz 4 EStG) in Cent. Anmerkung: Die Eingabe dieses Feldes (ggf. 0) ist erforderlich bei Eingaben zu sonstigen Bezügen (Feld SONSTB). Sind in einem vorangegangenen Abrechnungszeitraum bereits sonstige Bezüge gezahlt worden, so sind sie dem voraussichtlichen Jahresarbeitslohn hinzuzurechnen. Gleiches gilt für zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG).
    this.JRE4 = BigDecimal.ZERO;
    // In JRE4 enthaltene Entschädigungen nach § 24 Nummer 1 EStG und zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG) in Cent
    this.JRE4ENT = BigDecimal.ZERO;
    // In JRE4 enthaltene Versorgungsbezüge in Cent (ggf. 0)
    this.JVBEZ = BigDecimal.ZERO;
    // Merker für die Vorsorgepauschale 0 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung oder einer berufsständischen Versorgungseinrichtung pflichtversichert oder bei Befreiung von der Versicherungspflicht freiwillig versichert; es gilt die allgemeine Beitragsbemessungsgrenze 1 = wenn nicht 0
    this.KRV = 0;
    // Kassenindividueller Zusatzbeitragssatz bei einem gesetzlich krankenversicherten Arbeitnehmer in Prozent (bspw. 2,50 für 2,50 %) mit 2 Dezimalstellen. Es ist der volle Zusatzbeitragssatz anzugeben. Die Aufteilung in Arbeitnehmer- und Arbeitgeber- anteil erfolgt im Programmablauf.
    this.KVZ = BigDecimal.ZERO;
    // Lohnzahlungszeitraum: 1 = Jahr 2 = Monat 3 = Woche 4 = Tag
    this.LZZ = 1;
    // Der als elektronisches Lohnsteuerabzugsmerkmal für den Arbeitgeber nach § 39e EStG festgestellte oder in der Bescheinigung für den Lohnsteuerabzug 2026 eingetragene Freibetrag für den Lohnzahlungszeitraum in Cent
    this.LZZFREIB = BigDecimal.ZERO;
    // Der als elektronisches Lohnsteuerabzugsmerkmal für den Arbeitgeber nach § 39e EStG festgestellte oder in der Bescheinigung für den Lohnsteuerabzug 2026 eingetragene Hinzurechnungsbetrag für den Lohnzahlungszeitraum in Cent
    this.LZZHINZU = BigDecimal.ZERO;
    // Nicht zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) in Cent
    this.MBV = BigDecimal.ZERO;
    // Dem Arbeitgeber mitgeteilte Beiträge des Arbeitnehmers für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Cent; der Wert ist unabhängig vom Lohnzahlungszeitraum immer als Monatsbetrag anzugeben
    this.PKPV = BigDecimal.ZERO;
    // Arbeitgeberzuschuss für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Cent; der Wert ist unabhängig vom Lohnzahlungszeitraum immer als Monatsbetrag anzugeben
    this.PKPVAGZ = BigDecimal.ZERO;
    // Krankenversicherung: 0 = gesetzlich krankenversicherte Arbeitnehmer 1 = ausschließlich privat krankenversicherte Arbeitnehmer
    this.PKV = 0;
    // Zahl der beim Arbeitnehmer zu berücksichtigenden Beitragsabschläge in der sozialen Pflegeversicherung bei mehr als einem Kind 0 = kein Abschlag 1 = Beitragsabschlag für das 2. Kind 2 = Beitragsabschläge für das 2. und 3. Kind 3 = Beitragsabschläge für 2. bis 4. Kinder 4 = Beitragsabschläge für 2. bis 5. oder mehr Kinder
    this.PVA = BigDecimal.ZERO;
    // 1, wenn bei der sozialen Pflegeversicherung die Besonderheiten in Sachsen zu berücksichtigen sind bzw. zu berücksichtigen wären
    this.PVS = 0;
    // 1, wenn er der Arbeitnehmer den Zuschlag zur sozialen Pflegeversicherung zu zahlen hat
    this.PVZ = 0;
    // Religionsgemeinschaft des Arbeitnehmers lt. elektronischer Lohnsteuerabzugsmerkmale oder der Bescheinigung für den Lohnsteuerabzug 2026 (bei keiner Religionszugehörigkeit = 0)
    this.R = 0;
    // Steuerpflichtiger Arbeitslohn für den Lohnzahlungszeitraum vor Berücksichtigung des Versorgungsfreibetrags und des Zuschlags zum Versorgungsfreibetrag, des Altersentlastungsbetrags und des als elektronisches Lohnsteuerabzugsmerkmal festgestellten oder in der Bescheinigung für den Lohnsteuerabzug 2026 für den Lohnzahlungszeitraum eingetragenen Freibetrags bzw. Hinzurechnungsbetrags in Cent
    this.RE4 = BigDecimal.ZERO;
    // Sonstige Bezüge einschließlich zu besteuernde Vorteile bei Vermögensbeteiligungen und Sterbegeld bei Versorgungsbezügen sowie Kapitalauszahlungen/Abfindungen, in Cent (ggf. 0)
    this.SONSTB = BigDecimal.ZERO;
    // In SONSTB enthaltene Entschädigungen nach § 24 Nummer 1 EStG sowie zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG), in Cent
    this.SONSTENT = BigDecimal.ZERO;
    // Sterbegeld bei Versorgungsbezügen sowie Kapitalauszahlungen/Abfindungen (in SONSTB enthalten), in Cent
    this.STERBE = BigDecimal.ZERO;
    // Steuerklasse: 1 = I 2 = II 3 = III 4 = IV 5 = V 6 = VI
    this.STKL = 1;
    // In RE4 enthaltene Versorgungsbezüge in Cent (ggf. 0) ggf. unter Berücksichtigung einer geänderten Bemessungsgrundlage nach § 19 Absatz 2 Satz 10 und 11 EStG
    this.VBEZ = BigDecimal.ZERO;
    // Versorgungsbezug im Januar 2005 bzw. für den ersten vollen Monat, wenn der Versorgungsbezug erstmalig nach Januar 2005 gewährt wurde, in Cent
    this.VBEZM = BigDecimal.ZERO;
    // Voraussichtliche Sonderzahlungen von Versorgungsbezügen im Kalenderjahr des Versorgungsbeginns bei Versorgungsempfängern ohne Sterbegeld, Kapitalauszahlungen/Abfindungen in Cent
    this.VBEZS = BigDecimal.ZERO;
    // In SONSTB enthaltene Versorgungsbezüge einschließlich Sterbegeld in Cent (ggf. 0)
    this.VBS = BigDecimal.ZERO;
    // Jahr, in dem der Versorgungsbezug erstmalig gewährt wurde; werden mehrere Versorgungsbezüge gezahlt, wird aus Vereinfachungsgründen für die Berechnung das Jahr des ältesten erstmaligen Bezugs herangezogen; auf die Möglichkeit der getrennten Abrechnung verschiedenartiger Bezüge (§ 39e Absatz 5a EStG) wird im Übrigen verwiesen
    this.VJAHR = 0;
    // Zahl der Freibeträge für Kinder (eine Dezimalstelle, nur bei Steuerklassen I, II, III und IV)
    this.ZKF = BigDecimal.ZERO;
    // Zahl der Monate, für die Versorgungsbezüge gezahlt werden [nur erforderlich bei Jahresberechnung (LZZ = 1)]
    this.ZMVB = 0;
    // Ausgabeparameter
    // Bemessungsgrundlage für die Kirchenlohnsteuer in Cent
    this.BK = BigDecimal.ZERO;
    // Bemessungsgrundlage der sonstigen Bezüge für die Kirchenlohnsteuer in Cent. Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern BK (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
    this.BKS = BigDecimal.ZERO;
    // Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cent
    this.LSTLZZ = BigDecimal.ZERO;
    // Für den Lohnzahlungszeitraum einzubehaltender Solidaritätszuschlag in Cent
    this.SOLZLZZ = BigDecimal.ZERO;
    // Solidaritätszuschlag für sonstige Bezüge in Cent. Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern SOLZLZZ (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
    this.SOLZS = BigDecimal.ZERO;
    // Lohnsteuer für sonstige Bezüge in Cent Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern LSTLZZ (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
    this.STS = BigDecimal.ZERO;
    // Verbrauchter Freibetrag bei Berechnung des laufenden Arbeitslohns, in Cent
    this.VFRB = BigDecimal.ZERO;
    // Verbrauchter Freibetrag bei Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent
    this.VFRBS1 = BigDecimal.ZERO;
    // Verbrauchter Freibetrag bei Berechnung der sonstigen Bezüge, in Cent
    this.VFRBS2 = BigDecimal.ZERO;
    // Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des laufenden Arbeitslohns, in Cent
    this.WVFRB = BigDecimal.ZERO;
    // Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent
    this.WVFRBO = BigDecimal.ZERO;
    // Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung der sonstigen Bezüge, in Cent
    this.WVFRBM = BigDecimal.ZERO;
    // Interne Felder
    // Altersentlastungsbetrag in Euro, Cent (2 Dezimalstellen)
    this.ALTE = BigDecimal.ZERO;
    // Arbeitnehmer-Pauschbetrag/Werbungskosten-Pauschbetrag in Euro
    this.ANP = BigDecimal.ZERO;
    // Auf den Lohnzahlungszeitraum entfallender Anteil von Jahreswerten auf ganze Cent abgerundet
    this.ANTEIL1 = BigDecimal.ZERO;
    // Beitragssatz des Arbeitnehmers zur Arbeitslosenversicherung (4 Dezimalstellen)
    this.AVSATZAN = BigDecimal.ZERO;
    // Beitragsbemessungsgrenze in der gesetzlichen Krankenversicherung und der sozialen Pflegeversicherung in Euro
    this.BBGKVPV = BigDecimal.ZERO;
    // Allgemeine Beitragsbemessungsgrenze in der allgemeinen Rentenversicherung und Arbeitslosenversicherung in Euro
    this.BBGRVALV = BigDecimal.ZERO;
    // Bemessungsgrundlage für Altersentlastungsbetrag in Euro, Cent (2 Dezimalstellen)
    this.BMG = BigDecimal.ZERO;
    // Differenz zwischen ST1 und ST2 in Euro
    this.DIFF = BigDecimal.ZERO;
    // Entlastungsbetrag für Alleinerziehende in Euro
    this.EFA = BigDecimal.ZERO;
    // Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
    this.FVB = BigDecimal.ZERO;
    // Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen) für die Berechnung der Lohnsteuer beim sonstigen Bezug
    this.FVBSO = BigDecimal.ZERO;
    // Zuschlag zum Versorgungsfreibetrag in Euro
    this.FVBZ = BigDecimal.ZERO;
    // Zuschlag zum Versorgungsfreibetrag in Euro für die Berechnung der Lohnsteuer beim sonstigen Bezug
    this.FVBZSO = BigDecimal.ZERO;
    // Grundfreibetrag in Euro
    this.GFB = BigDecimal.ZERO;
    // Maximaler Altersentlastungsbetrag in Euro
    this.HBALTE = BigDecimal.ZERO;
    // Maßgeblicher maximaler Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
    this.HFVB = BigDecimal.ZERO;
    // Maßgeblicher maximaler Zuschlag zum Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
    this.HFVBZ = BigDecimal.ZERO;
    // Maßgeblicher maximaler Zuschlag zum Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen) für die Berechnung der Lohnsteuer für den sonstigen Bezug
    this.HFVBZSO = BigDecimal.ZERO;
    // Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
    this.HOCH = BigDecimal.ZERO;
    // Nummer der Tabellenwerte für Versorgungsparameter
    this.J = 0;
    // Jahressteuer nach § 51a EStG, aus der Solidaritätszuschlag und Bemessungsgrundlage für die Kirchenlohnsteuer ermittelt werden in Euro
    this.JBMG = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechneter LZZFREIB in Euro, Cent (2 Dezimalstellen)
    this.JLFREIB = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechnete LZZHINZU in Euro, Cent (2 Dezimalstellen)
    this.JLHINZU = BigDecimal.ZERO;
    // Jahreswert, dessen Anteil für einen Lohnzahlungszeitraum in UPANTEIL errechnet werden soll in Cent
    this.JW = BigDecimal.ZERO;
    // Nummer der Tabellenwerte für Parameter bei Altersentlastungsbetrag
    this.K = 0;
    // Summe der Freibeträge für Kinder in Euro
    this.KFB = BigDecimal.ZERO;
    // Beitragssatz des Arbeitnehmers zur Krankenversicherung (5 Dezimalstellen)
    this.KVSATZAN = BigDecimal.ZERO;
    // Kennzahl für die Einkommensteuer-Tabellenart: 1 = Grundtarif 2 = Splittingverfahren
    this.KZTAB = 0;
    // Jahreslohnsteuer in Euro
    this.LSTJAHR = BigDecimal.ZERO;
    // Zwischenfelder der Jahreslohnsteuer in Cent
    this.LSTOSO = BigDecimal.ZERO;
    this.LSTSO = BigDecimal.ZERO;
    // Mindeststeuer für die Steuerklassen V und VI in Euro
    this.MIST = BigDecimal.ZERO;
    // Auf einen Jahreswert hochgerechneter Arbeitgeberzuschuss für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Euro, Cent (2 Dezimalstellen)
    this.PKPVAGZJ = BigDecimal.ZERO;
    // Beitragssatz des Arbeitnehmers zur Pflegeversicherung (6 Dezimalstellen)
    this.PVSATZAN = BigDecimal.ZERO;
    // Beitragssatz des Arbeitnehmers in der allgemeinen gesetzlichen Rentenversicherung (4 Dezimalstellen)
    this.RVSATZAN = BigDecimal.ZERO;
    // Rechenwert in Gleitkommadarstellung
    this.RW = BigDecimal.ZERO;
    // Sonderausgaben-Pauschbetrag in Euro
    this.SAP = BigDecimal.ZERO;
    // Freigrenze für den Solidaritätszuschlag in Euro
    this.SOLZFREI = BigDecimal.ZERO;
    // Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent (2 Dezimalstellen)
    this.SOLZJ = BigDecimal.ZERO;
    // Zwischenwert für den Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent (2 Dezimalstellen)
    this.SOLZMIN = BigDecimal.ZERO;
    // Bemessungsgrundlage des Solidaritätszuschlags zur Prüfung der Freigrenze beim Solidaritätszuschlag für sonstige Bezüge in Euro
    this.SOLZSBMG = BigDecimal.ZERO;
    // Zu versteuerndes Einkommen für die Ermittlung der Bemessungsgrundlage des Solidaritätszuschlags zur Prüfung der Freigrenze beim Solidaritätszuschlag für sonstige Bezüge in Euro, Cent (2 Dezimalstellen)
    this.SOLZSZVE = BigDecimal.ZERO;
    // Tarifliche Einkommensteuer in Euro
    this.ST = BigDecimal.ZERO;
    // Tarifliche Einkommensteuer auf das 1,25-fache ZX in Euro
    this.ST1 = BigDecimal.ZERO;
    // Tarifliche Einkommensteuer auf das 0,75-fache ZX in Euro
    this.ST2 = BigDecimal.ZERO;
    // Bemessungsgrundlage für den Versorgungsfreibetrag in Cent
    this.VBEZB = BigDecimal.ZERO;
    // Bemessungsgrundlage für den Versorgungsfreibetrag in Cent für den sonstigen Bezug
    this.VBEZBSO = BigDecimal.ZERO;
    // Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
    this.VERGL = BigDecimal.ZERO;
    // Auf den Höchstbetrag begrenzte Beiträge zur Arbeitslosenversicherung einschließlich Kranken- und Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
    this.VSPHB = BigDecimal.ZERO;
    // Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung sowie die gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung und private Pflege-Pflichtversicherung in Euro, Cent (2 Dezimalstellen)
    this.VSP = BigDecimal.ZERO;
    // Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung sowie auf den Höchstbetrag begrenzten Teilbeträgen für die Arbeitslosen-, Kranken- und Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
    this.VSPN = BigDecimal.ZERO;
    // Teilbetrag für die Arbeitslosenversicherung bei der Berechnung der Vorsorgepauschale in Euro, Cent (2 Dezimalstellen)
    this.VSPALV = BigDecimal.ZERO;
    // Vorsorgepauschale mit Teilbeträgen für die gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung und private Pflege-Pflichtversicherung in Euro, Cent (2 Dezimalstellen)
    this.VSPKVPV = BigDecimal.ZERO;
    // Teilbetrag für die Rentenversicherung bei der Berechnung der Vorsorgepauschale in Euro, Cent (2 Dezimalstellen)
    this.VSPR = BigDecimal.ZERO;
    // Erster Grenzwert in Steuerklasse V/VI in Euro
    this.W1STKL5 = BigDecimal.ZERO;
    // Zweiter Grenzwert in Steuerklasse V/VI in Euro
    this.W2STKL5 = BigDecimal.ZERO;
    // Dritter Grenzwert in Steuerklasse V/VI in Euro
    this.W3STKL5 = BigDecimal.ZERO;
    // Zu versteuerndes Einkommen gem. § 32a Absatz 1 und 5 EStG in Euro, Cent (2 Dezimalstellen)
    this.X = BigDecimal.ZERO;
    // Gem. § 32a Absatz 1 EStG (6 Dezimalstellen)
    this.Y = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent (2 Dezimalstellen) nach Abzug der Freibeträge nach § 39 b Absatz 2 Satz 3 und 4 EStG
    this.ZRE4 = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent (2 Dezimalstellen)
    this.ZRE4J = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechnetes RE4, ggf. nach Abzug der Entschädigungen i.S.d. § 24 Nummer 1 EStG in Euro, Cent (2 Dezimalstellen)
    this.ZRE4VP = BigDecimal.ZERO;
    // Zwischenfeld zu ZRE4VP für die Begrenzung auf die jeweilige Beitragsbemessungsgrenze in Euro, Cent (2 Dezimalstellen)"
    this.ZRE4VPR = BigDecimal.ZERO;
    // Feste Tabellenfreibeträge (ohne Vorsorgepauschale) in Euro, Cent (2 Dezimalstellen)
    this.ZTABFB = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechnetes VBEZ abzüglich FVB in Euro, Cent (2 Dezimalstellen)
    this.ZVBEZ = BigDecimal.ZERO;
    // Auf einen Jahreslohn hochgerechnetes VBEZ in Euro, Cent (2 Dezimalstellen)
    this.ZVBEZJ = BigDecimal.ZERO;
    // Zu versteuerndes Einkommen in Euro, Cent (2 Dezimalstellen)
    this.ZVE = BigDecimal.ZERO;
    // Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
    this.ZX = BigDecimal.ZERO;
    // Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
    this.ZZX = BigDecimal.ZERO;
  }

  /** Setzt Eingabeparameter; BigDecimal-Felder akzeptieren BigDecimal, Zahl oder String. */
  setInputs(inputs) {
    for (const [name, value] of Object.entries(inputs)) {
      const type = INPUT_TYPES[name];
      if (!type) throw new Error(`Unbekannter Eingabeparameter ${name}`);
      if (type === 'BigDecimal') {
        this[name] = BigDecimal.valueOf(value);
      } else {
        const number = Number(value);
        if (!Number.isFinite(number) || (type === 'int' && !Number.isInteger(number))) {
          throw new RangeError(`Ungültiger Wert für ${name}: ${value}`);
        }
        this[name] = number;
      }
    }
    return this;
  }

  /** Führt den Programmablaufplan aus und liefert die Ausgabeparameter. */
  run() {
    this.MAIN();
    return this.getOutputs();
  }

  getOutputs() {
    return {
      BK: this.BK,
      BKS: this.BKS,
      LSTLZZ: this.LSTLZZ,
      SOLZLZZ: this.SOLZLZZ,
      SOLZS: this.SOLZS,
      STS: this.STS,
      VFRB: this.VFRB,
      VFRBS1: this.VFRBS1,
      VFRBS2: this.VFRBS2,
      WVFRB: this.WVFRB,
      WVFRBO: this.WVFRBO,
      WVFRBM: this.WVFRBM,
    };
  }

  // PROGRAMMABLAUFPLAN 2026 Steueruung, PAP Seite 13
  MAIN() {
    this.MPARA();
    this.MRE4JL();
    this.VBEZBSO = BigDecimal.ZERO;
    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();
    this.MSONST();
  }

  // Zuweisung von Werten für bestimmte Steuer- und Sozialversicherungsparameter PAP Seite 14
  MPARA() {
    this.BBGRVALV = BigDecimal.valueOf(101400);
    this.AVSATZAN = BigDecimal.valueOf(0.013);
    this.RVSATZAN = BigDecimal.valueOf(0.093);
    this.BBGKVPV = BigDecimal.valueOf(69750);
    this.KVSATZAN = (this.KVZ.divide(ZAHL2).divide(ZAHL100)).add(BigDecimal.valueOf(0.07));
    if (this.PVS === 1) {
      this.PVSATZAN = BigDecimal.valueOf(0.023);
    } else {
      this.PVSATZAN = BigDecimal.valueOf(0.018);
    }
    if (this.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN.add(BigDecimal.valueOf(0.006));
    } else {
      this.PVSATZAN = this.PVSATZAN.subtract(this.PVA.multiply(BigDecimal.valueOf(0.0025)));
    }
    this.W1STKL5 = BigDecimal.valueOf(14071);
    this.W2STKL5 = BigDecimal.valueOf(34939);
    this.W3STKL5 = BigDecimal.valueOf(222260);
    this.GFB = BigDecimal.valueOf(12348);
    this.SOLZFREI = BigDecimal.valueOf(20350);
  }

  // Ermittlung des Jahresarbeitslohns nach § 39 b Absatz 2 Satz 2 EStG, PAP Seite 15
  MRE4JL() {
    if (this.LZZ === 1) {
      this.ZRE4J = this.RE4.divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = this.VBEZ.divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLFREIB = this.LZZFREIB.divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLHINZU = this.LZZHINZU.divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
    } else if (this.LZZ === 2) {
      this.ZRE4J = (this.RE4.multiply(ZAHL12)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = (this.VBEZ.multiply(ZAHL12)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLFREIB = (this.LZZFREIB.multiply(ZAHL12)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLHINZU = (this.LZZHINZU.multiply(ZAHL12)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
    } else if (this.LZZ === 3) {
      this.ZRE4J = (this.RE4.multiply(ZAHL360)).divide(ZAHL700, 2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = (this.VBEZ.multiply(ZAHL360)).divide(ZAHL700, 2, BigDecimal.ROUND_DOWN);
      this.JLFREIB = (this.LZZFREIB.multiply(ZAHL360)).divide(ZAHL700, 2, BigDecimal.ROUND_DOWN);
      this.JLHINZU = (this.LZZHINZU.multiply(ZAHL360)).divide(ZAHL700, 2, BigDecimal.ROUND_DOWN);
    } else {
      this.ZRE4J = (this.RE4.multiply(ZAHL360)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = (this.VBEZ.multiply(ZAHL360)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLFREIB = (this.LZZFREIB.multiply(ZAHL360)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
      this.JLHINZU = (this.LZZHINZU.multiply(ZAHL360)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
    }
    if (this.af === 0) {
      this.f = 1;
    }
  }

  // Freibeträge für Versorgungsbezüge, Altersentlastungsbetrag (§ 39b Absatz 2 Satz 3 EStG), PAP Seite 16
  MRE4() {
    if (this.ZVBEZJ.compareTo(BigDecimal.ZERO) === 0) {
      this.FVBZ = BigDecimal.ZERO;
      this.FVB = BigDecimal.ZERO;
      this.FVBZSO = BigDecimal.ZERO;
      this.FVBSO = BigDecimal.ZERO;
    } else {
      if (this.VJAHR < 2006) {
        this.J = 1;
      } else if (this.VJAHR < 2058) {
        this.J = this.VJAHR - 2004;
      } else {
        this.J = 54;
      }
      if (this.LZZ === 1) {
        this.VBEZB = (this.VBEZM.multiply(BigDecimal.valueOf(this.ZMVB))).add(this.VBEZS);
        this.HFVB = TAB2[this.J].divide(ZAHL12).multiply(BigDecimal.valueOf(this.ZMVB)).setScale(0, BigDecimal.ROUND_UP);
        this.FVBZ = TAB3[this.J].divide(ZAHL12).multiply(BigDecimal.valueOf(this.ZMVB)).setScale(0, BigDecimal.ROUND_UP);
      } else {
        this.VBEZB = ((this.VBEZM.multiply(ZAHL12)).add(this.VBEZS)).setScale(2, BigDecimal.ROUND_DOWN);
        this.HFVB = TAB2[this.J];
        this.FVBZ = TAB3[this.J];
      }
      this.FVB = ((this.VBEZB.multiply(TAB1[this.J]))).divide(ZAHL100).setScale(2, BigDecimal.ROUND_UP);
      if (this.FVB.compareTo(this.HFVB) === 1) {
        this.FVB = this.HFVB;
      }
      if (this.FVB.compareTo(this.ZVBEZJ) === 1) {
        this.FVB = this.ZVBEZJ;
      }
      this.FVBSO = (this.FVB.add((this.VBEZBSO.multiply(TAB1[this.J])).divide(ZAHL100))).setScale(2, BigDecimal.ROUND_UP);
      if (this.FVBSO.compareTo(TAB2[this.J]) === 1) {
        this.FVBSO = TAB2[this.J];
      }
      this.HFVBZSO = (((this.VBEZB.add(this.VBEZBSO)).divide(ZAHL100)).subtract(this.FVBSO)).setScale(2, BigDecimal.ROUND_DOWN);
      this.FVBZSO = (this.FVBZ.add((this.VBEZBSO).divide(ZAHL100))).setScale(0, BigDecimal.ROUND_UP);
      if (this.FVBZSO.compareTo(this.HFVBZSO) === 1) {
        this.FVBZSO = this.HFVBZSO.setScale(0, BigDecimal.ROUND_UP);
      }
      if (this.FVBZSO.compareTo(TAB3[this.J]) === 1) {
        this.FVBZSO = TAB3[this.J];
      }
      this.HFVBZ = ((this.VBEZB.divide(ZAHL100)).subtract(this.FVB)).setScale(2, BigDecimal.ROUND_DOWN);
      if (this.FVBZ.compareTo(this.HFVBZ) === 1) {
        this.FVBZ = this.HFVBZ.setScale(0, BigDecimal.ROUND_UP);
      }
    }
    this.MRE4ALTE();
  }

  // Altersentlastungsbetrag (§ 39b Absatz 2 Satz 3 EStG), PAP Seite 17
  MRE4ALTE() {
    if (this.ALTER1 === 0) {
      this.ALTE = BigDecimal.ZERO;
    } else {
      if (this.AJAHR < 2006) {
        this.K = 1;
      } else if (this.AJAHR < 2058) {
        this.K = this.AJAHR - 2004;
      } else {
        this.K = 54;
      }
      this.BMG = this.ZRE4J.subtract(this.ZVBEZJ);
      this.ALTE = (this.BMG.multiply(TAB4[this.K])).setScale(0, BigDecimal.ROUND_UP);
      this.HBALTE = TAB5[this.K];
      if (this.ALTE.compareTo(this.HBALTE) === 1) {
        this.ALTE = this.HBALTE;
      }
    }
  }

  // Ermittlung des Jahresarbeitslohns nach Abzug der Freibeträge nach § 39 b Absatz 2 Satz 3 und 4 EStG, PAP Seite 20
  MRE4ABZ() {
    this.ZRE4 = (this.ZRE4J.subtract(this.FVB).subtract(this.ALTE).subtract(this.JLFREIB).add(this.JLHINZU)).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.ZRE4.compareTo(BigDecimal.ZERO) === -1) {
      this.ZRE4 = BigDecimal.ZERO;
    }
    this.ZRE4VP = this.ZRE4J;
    this.ZVBEZ = this.ZVBEZJ.subtract(this.FVB).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.ZVBEZ.compareTo(BigDecimal.ZERO) === -1) {
      this.ZVBEZ = BigDecimal.ZERO;
    }
  }

  // Berechnung fuer laufende Lohnzahlungszeitraueme Seite 21
  MBERECH() {
    this.MZTABFB();
    this.VFRB = ((this.ANP.add(this.FVB.add(this.FVBZ))).multiply(ZAHL100)).setScale(0, BigDecimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRB = ((this.ZVE.subtract(this.GFB)).multiply(ZAHL100)).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.WVFRB.compareTo(BigDecimal.ZERO) === -1) {
      this.WVFRB = BigDecimal.ZERO;
    }
    this.LSTJAHR = (this.ST.multiply(BigDecimal.valueOf(this.f))).setScale(0, BigDecimal.ROUND_DOWN);
    this.UPLSTLZZ();
    if (this.ZKF.compareTo(BigDecimal.ZERO) === 1) {
      this.ZTABFB = this.ZTABFB.add(this.KFB);
      this.MRE4ABZ();
      this.MLSTJAHR();
      this.JBMG = (this.ST.multiply(BigDecimal.valueOf(this.f))).setScale(0, BigDecimal.ROUND_DOWN);
    } else {
      this.JBMG = this.LSTJAHR;
    }
    this.MSOLZ();
  }

  // Ermittlung der festen Tabellenfreibeträge (ohne Vorsorgepauschale), PAP Seite 22
  MZTABFB() {
    this.ANP = BigDecimal.ZERO;
    if (this.ZVBEZ.compareTo(BigDecimal.ZERO) >= 0 && this.ZVBEZ.compareTo(this.FVBZ) === -1) {
      this.FVBZ = BigDecimal.valueOf(this.ZVBEZ.longValue());
    }
    if (this.STKL < 6) {
      if (this.ZVBEZ.compareTo(BigDecimal.ZERO) === 1) {
        if ((this.ZVBEZ.subtract(this.FVBZ)).compareTo(BigDecimal.valueOf(102)) === -1) {
          this.ANP = (this.ZVBEZ.subtract(this.FVBZ)).setScale(0, BigDecimal.ROUND_UP);
        } else {
          this.ANP = BigDecimal.valueOf(102);
        }
      }
    } else {
      this.FVBZ = BigDecimal.ZERO;
      this.FVBZSO = BigDecimal.ZERO;
    }
    if (this.STKL < 6) {
      if (this.ZRE4.compareTo(this.ZVBEZ) === 1) {
        if (this.ZRE4.subtract(this.ZVBEZ).compareTo(BigDecimal.valueOf(1230)) === -1) {
          this.ANP = this.ANP.add(this.ZRE4).subtract(this.ZVBEZ).setScale(0, BigDecimal.ROUND_UP);
        } else {
          this.ANP = this.ANP.add(BigDecimal.valueOf(1230));
        }
      }
    }
    this.KZTAB = 1;
    if (this.STKL === 1) {
      this.SAP = BigDecimal.valueOf(36);
      this.KFB = (this.ZKF.multiply(BigDecimal.valueOf(9756))).setScale(0, BigDecimal.ROUND_DOWN);
    } else if (this.STKL === 2) {
      this.EFA = BigDecimal.valueOf(4260);
      this.SAP = BigDecimal.valueOf(36);
      this.KFB = (this.ZKF.multiply(BigDecimal.valueOf(9756))).setScale(0, BigDecimal.ROUND_DOWN);
    } else if (this.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = BigDecimal.valueOf(36);
      this.KFB = (this.ZKF.multiply(BigDecimal.valueOf(9756))).setScale(0, BigDecimal.ROUND_DOWN);
    } else if (this.STKL === 4) {
      this.SAP = BigDecimal.valueOf(36);
      this.KFB = (this.ZKF.multiply(BigDecimal.valueOf(4878))).setScale(0, BigDecimal.ROUND_DOWN);
    } else if (this.STKL === 5) {
      this.SAP = BigDecimal.valueOf(36);
      this.KFB = BigDecimal.ZERO;
    } else {
      this.KFB = BigDecimal.ZERO;
    }
    this.ZTABFB = (this.EFA.add(this.ANP).add(this.SAP).add(this.FVBZ)).setScale(2, BigDecimal.ROUND_DOWN);
  }

  // Ermittlung Jahreslohnsteuer, PAP Seite 23
  MLSTJAHR() {
    this.UPEVP();
    this.ZVE = this.ZRE4.subtract(this.ZTABFB).subtract(this.VSP);
    this.UPMLST();
  }

  // PAP Seite 24
  UPLSTLZZ() {
    this.JW = this.LSTJAHR.multiply(ZAHL100);
    this.UPANTEIL();
    this.LSTLZZ = this.ANTEIL1;
  }

  // PAP Seite 25
  UPMLST() {
    if (this.ZVE.compareTo(ZAHL1) === -1) {
      this.ZVE = BigDecimal.ZERO;
      this.X = BigDecimal.ZERO;
    } else {
      this.X = (this.ZVE.divide(BigDecimal.valueOf(this.KZTAB))).setScale(0, BigDecimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
  }

  // Vorsorgepauschale (§ 39b Absatz 2 Satz 5 Nummer 3 EStG) PAP Seite 26
  UPEVP() {
    if (this.KRV === 1) {
      this.VSPR = BigDecimal.ZERO;
    } else {
      if (this.ZRE4VP.compareTo(this.BBGRVALV) === 1) {
        this.ZRE4VPR = this.BBGRVALV;
      } else {
        this.ZRE4VPR = this.ZRE4VP;
      }
      this.VSPR = (this.ZRE4VPR.multiply(this.RVSATZAN)).setScale(2, BigDecimal.ROUND_DOWN);
    }
    this.MVSPKVPV();
    if (this.ALV === 1) {
    } else if (this.STKL === 6) {
    } else {
      this.MVSPHB();
    }
  }

  // Vorsorgepauschale (§ 39b Absatz 2 Satz 5 Nummer 3 Buchstaben b bis d EStG), PAP Seite 27
  MVSPKVPV() {
    if (this.ZRE4VP.compareTo(this.BBGKVPV) === 1) {
      this.ZRE4VPR = this.BBGKVPV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }
    if (this.PKV > 0) {
      if (this.STKL === 6) {
        this.VSPKVPV = BigDecimal.ZERO;
      } else {
        this.PKPVAGZJ = this.PKPVAGZ.multiply(ZAHL12).divide(ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        this.VSPKVPV = this.PKPV.multiply(ZAHL12).divide(ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        this.VSPKVPV = this.VSPKVPV.subtract(this.PKPVAGZJ);
        if (this.VSPKVPV.compareTo(BigDecimal.ZERO) === -1) {
          this.VSPKVPV = BigDecimal.ZERO;
        }
      }
    } else {
      this.VSPKVPV = this.ZRE4VPR.multiply(this.KVSATZAN.add(this.PVSATZAN)).setScale(2, BigDecimal.ROUND_DOWN);
    }
    this.VSP = this.VSPKVPV.add(this.VSPR).setScale(0, BigDecimal.ROUND_UP);
  }

  // Höchstbetragsberechnung zur Arbeitslosenversicherung (§ 39b Absatz 2 Satz 5 Nummer 3 Buchstabe e EStG), PAP Seite 28
  MVSPHB() {
    if (this.ZRE4VP.compareTo(this.BBGRVALV) === 1) {
      this.ZRE4VPR = this.BBGRVALV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }
    this.VSPALV = this.AVSATZAN.multiply(this.ZRE4VPR).setScale(2, BigDecimal.ROUND_DOWN);
    this.VSPHB = this.VSPALV.add(this.VSPKVPV).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.VSPHB.compareTo(BigDecimal.valueOf(1900)) === 1) {
      this.VSPHB = BigDecimal.valueOf(1900);
    }
    this.VSPN = this.VSPR.add(this.VSPHB).setScale(0, BigDecimal.ROUND_UP);
    if (this.VSPN.compareTo(this.VSP) === 1) {
      this.VSP = this.VSPN;
    }
  }

  // Lohnsteuer fuer die Steuerklassen V und VI (§ 39b Absatz 2 Satz 7 EStG), PAP Seite 29
  MST5_6() {
    this.ZZX = this.X;
    if (this.ZZX.compareTo(this.W2STKL5) === 1) {
      this.ZX = this.W2STKL5;
      this.UP5_6();
      if (this.ZZX.compareTo(this.W3STKL5) === 1) {
        this.ST = (this.ST.add((this.W3STKL5.subtract(this.W2STKL5)).multiply(BigDecimal.valueOf(0.42)))).setScale(0, BigDecimal.ROUND_DOWN);
        this.ST = (this.ST.add((this.ZZX.subtract(this.W3STKL5)).multiply(BigDecimal.valueOf(0.45)))).setScale(0, BigDecimal.ROUND_DOWN);
      } else {
        this.ST = (this.ST.add((this.ZZX.subtract(this.W2STKL5)).multiply(BigDecimal.valueOf(0.42)))).setScale(0, BigDecimal.ROUND_DOWN);
      }
    } else {
      this.ZX = this.ZZX;
      this.UP5_6();
      if (this.ZZX.compareTo(this.W1STKL5) === 1) {
        this.VERGL = this.ST;
        this.ZX = this.W1STKL5;
        this.UP5_6();
        this.HOCH = (this.ST.add((this.ZZX.subtract(this.W1STKL5)).multiply(BigDecimal.valueOf(0.42)))).setScale(0, BigDecimal.ROUND_DOWN);
        if (this.HOCH.compareTo(this.VERGL) === -1) {
          this.ST = this.HOCH;
        } else {
          this.ST = this.VERGL;
        }
      }
    }
  }

  // Unterprogramm zur Lohnsteuer fuer die Steuerklassen V und VI (§ 39b Absatz 2 Satz 7 EStG), PAP Seite 30
  UP5_6() {
    this.X = (this.ZX.multiply(BigDecimal.valueOf(1.25))).setScale(0, BigDecimal.ROUND_DOWN);
    this.UPTAB26();
    this.ST1 = this.ST;
    this.X = (this.ZX.multiply(BigDecimal.valueOf(0.75))).setScale(0, BigDecimal.ROUND_DOWN);
    this.UPTAB26();
    this.ST2 = this.ST;
    this.DIFF = (this.ST1.subtract(this.ST2)).multiply(ZAHL2);
    this.MIST = (this.ZX.multiply(BigDecimal.valueOf(0.14))).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.MIST.compareTo(this.DIFF) === 1) {
      this.ST = this.MIST;
    } else {
      this.ST = this.DIFF;
    }
  }

  // Solidaritätszuschlag, PAP Seite 31
  MSOLZ() {
    this.SOLZFREI = (this.SOLZFREI.multiply(BigDecimal.valueOf(this.KZTAB)));
    if (this.JBMG.compareTo(this.SOLZFREI) === 1) {
      this.SOLZJ = (this.JBMG.multiply(BigDecimal.valueOf(5.5))).divide(ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
      this.SOLZMIN = (this.JBMG.subtract(this.SOLZFREI)).multiply(BigDecimal.valueOf(11.9)).divide(ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
      if (this.SOLZMIN.compareTo(this.SOLZJ) === -1) {
        this.SOLZJ = this.SOLZMIN;
      }
      this.JW = this.SOLZJ.multiply(ZAHL100).setScale(0, BigDecimal.ROUND_DOWN);
      this.UPANTEIL();
      this.SOLZLZZ = this.ANTEIL1;
    } else {
      this.SOLZLZZ = BigDecimal.ZERO;
    }
    if (this.R > 0) {
      this.JW = this.JBMG.multiply(ZAHL100);
      this.UPANTEIL();
      this.BK = this.ANTEIL1;
    } else {
      this.BK = BigDecimal.ZERO;
    }
  }

  // Anteil von Jahresbeträgen fuer einen LZZ (§ 39b Absatz 2 Satz 9 EStG), PAP Seite 32
  UPANTEIL() {
    if (this.LZZ === 1) {
      this.ANTEIL1 = this.JW;
    } else if (this.LZZ === 2) {
      this.ANTEIL1 = this.JW.divide(ZAHL12, 0, BigDecimal.ROUND_DOWN);
    } else if (this.LZZ === 3) {
      this.ANTEIL1 = (this.JW.multiply(ZAHL7)).divide(ZAHL360, 0, BigDecimal.ROUND_DOWN);
    } else {
      this.ANTEIL1 = this.JW.divide(ZAHL360, 0, BigDecimal.ROUND_DOWN);
    }
  }

  // Berechnung sonstiger Bezüge nach § 39b Absatz 3 Sätze 1 bis 8 EStG, PAP Seite 33
  MSONST() {
    this.LZZ = 1;
    if (this.ZMVB === 0) {
      this.ZMVB = 12;
    }
    if (this.SONSTB.compareTo(BigDecimal.ZERO) === 0 && this.MBV.compareTo(BigDecimal.ZERO) === 0) {
      this.LSTSO = BigDecimal.ZERO;
      this.STS = BigDecimal.ZERO;
      this.SOLZS = BigDecimal.ZERO;
      this.BKS = BigDecimal.ZERO;
    } else {
      this.MOSONST();
      this.ZRE4J = ((this.JRE4.add(this.SONSTB)).divide(ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
      this.ZVBEZJ = ((this.JVBEZ.add(this.VBS)).divide(ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
      this.VBEZBSO = this.STERBE;
      this.MRE4SONST();
      this.MLSTJAHR();
      this.WVFRBM = (this.ZVE.subtract(this.GFB)).multiply(ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
      if (this.WVFRBM.compareTo(BigDecimal.ZERO) === -1) {
        this.WVFRBM = BigDecimal.ZERO;
      }
      this.LSTSO = this.ST.multiply(ZAHL100);
      this.STS = this.LSTSO.subtract(this.LSTOSO).multiply(BigDecimal.valueOf(this.f)).divide(ZAHL100, 0, BigDecimal.ROUND_DOWN).multiply(ZAHL100);
      this.STSMIN();
    }
  }

  // PAP Seite 34
  STSMIN() {
    if (this.STS.compareTo(BigDecimal.ZERO) === -1) {
      if (this.MBV.compareTo(BigDecimal.ZERO) === 0) {
      } else {
        this.LSTLZZ = this.LSTLZZ.add(this.STS);
        if (this.LSTLZZ.compareTo(BigDecimal.ZERO) === -1) {
          this.LSTLZZ = BigDecimal.ZERO;
        }
        this.SOLZLZZ = this.SOLZLZZ.add(this.STS.multiply(BigDecimal.valueOf(5.5).divide(ZAHL100))).setScale(0, BigDecimal.ROUND_DOWN);
        if (this.SOLZLZZ.compareTo(BigDecimal.ZERO) === -1) {
          this.SOLZLZZ = BigDecimal.ZERO;
        }
        this.BK = this.BK.add(this.STS);
        if (this.BK.compareTo(BigDecimal.ZERO) === -1) {
          this.BK = BigDecimal.ZERO;
        }
      }
      this.STS = BigDecimal.ZERO;
      this.SOLZS = BigDecimal.ZERO;
    } else {
      this.MSOLZSTS();
    }
    if (this.R > 0) {
      this.BKS = this.STS;
    } else {
      this.BKS = BigDecimal.ZERO;
    }
  }

  // Berechnung des SolZ auf sonstige Bezüge, PAP Seite 35
  MSOLZSTS() {
    if (this.ZKF.compareTo(BigDecimal.ZERO) === 1) {
      this.SOLZSZVE = this.ZVE.subtract(this.KFB);
    } else {
      this.SOLZSZVE = this.ZVE;
    }
    if (this.SOLZSZVE.compareTo(BigDecimal.ONE) === -1) {
      this.SOLZSZVE = BigDecimal.ZERO;
      this.X = BigDecimal.ZERO;
    } else {
      this.X = this.SOLZSZVE.divide(BigDecimal.valueOf(this.KZTAB), 0, BigDecimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
    this.SOLZSBMG = this.ST.multiply(BigDecimal.valueOf(this.f)).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.SOLZSBMG.compareTo(this.SOLZFREI) === 1) {
      this.SOLZS = this.STS.multiply(BigDecimal.valueOf(5.5)).divide(ZAHL100, 0, BigDecimal.ROUND_DOWN);
    } else {
      this.SOLZS = BigDecimal.ZERO;
    }
  }

  // Sonderberechnung ohne sonstige Bezüge für Berechnung bei sonstigen Bezügen, PAP Seite 36
  MOSONST() {
    this.ZRE4J = (this.JRE4.divide(ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
    this.ZVBEZJ = (this.JVBEZ.divide(ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
    this.JLFREIB = this.JFREIB.divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
    this.JLHINZU = this.JHINZU.divide(ZAHL100, 2, BigDecimal.ROUND_DOWN);
    this.MRE4();
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.subtract(this.JRE4ENT.divide(ZAHL100));
    this.MZTABFB();
    this.VFRBS1 = ((this.ANP.add(this.FVB.add(this.FVBZ))).multiply(ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRBO = ((this.ZVE.subtract(this.GFB)).multiply(ZAHL100)).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.WVFRBO.compareTo(BigDecimal.ZERO) === -1) {
      this.WVFRBO = BigDecimal.ZERO;
    }
    this.LSTOSO = this.ST.multiply(ZAHL100);
  }

  // Sonderberechnung mit sonstigen Bezüge für Berechnung bei sonstigen Bezügen, PAP Seite 37
  MRE4SONST() {
    this.MRE4();
    this.FVB = this.FVBSO;
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.add(this.MBV.divide(ZAHL100)).subtract(this.JRE4ENT.divide(ZAHL100)).subtract(this.SONSTENT.divide(ZAHL100));
    this.FVBZ = this.FVBZSO;
    this.MZTABFB();
    this.VFRBS2 = ((((this.ANP.add(this.FVB).add(this.FVBZ))).multiply(ZAHL100))).subtract(this.VFRBS1);
  }

  // Tarifliche Einkommensteuer §32a EStG, PAP Seite 38
  UPTAB26() {
    if (this.X.compareTo(this.GFB.add(ZAHL1)) === -1) {
      this.ST = BigDecimal.ZERO;
    } else if (this.X.compareTo(BigDecimal.valueOf(17800)) === -1) {
      this.Y = (this.X.subtract(this.GFB)).divide(ZAHL10000, 6, BigDecimal.ROUND_DOWN);
      this.RW = this.Y.multiply(BigDecimal.valueOf(914.51));
      this.RW = this.RW.add(BigDecimal.valueOf(1400));
      this.ST = (this.RW.multiply(this.Y)).setScale(0, BigDecimal.ROUND_DOWN);
    } else if (this.X.compareTo(BigDecimal.valueOf(69879)) === -1) {
      this.Y = (this.X.subtract(BigDecimal.valueOf(17799))).divide(ZAHL10000, 6, BigDecimal.ROUND_DOWN);
      this.RW = this.Y.multiply(BigDecimal.valueOf(173.1));
      this.RW = this.RW.add(BigDecimal.valueOf(2397));
      this.RW = this.RW.multiply(this.Y);
      this.ST = (this.RW.add(BigDecimal.valueOf(1034.87))).setScale(0, BigDecimal.ROUND_DOWN);
    } else if (this.X.compareTo(BigDecimal.valueOf(277826)) === -1) {
      this.ST = ((this.X.multiply(BigDecimal.valueOf(0.42))).subtract(BigDecimal.valueOf(11135.63))).setScale(0, BigDecimal.ROUND_DOWN);
    } else {
      this.ST = ((this.X.multiply(BigDecimal.valueOf(0.45))).subtract(BigDecimal.valueOf(19470.38))).setScale(0, BigDecimal.ROUND_DOWN);
    }
    this.ST = this.ST.multiply(BigDecimal.valueOf(this.KZTAB));
  }
}
