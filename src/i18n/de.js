/**
 * Deutsches Wörterbuch (Primärsprache, Fallback für fehlende Schlüssel).
 * Flache, hierarchisch benannte Schlüssel; Platzhalter `{name}`; `[de:Begriff]` markiert
 * Fachbegriffe, die in anderen Sprachen als `lang="de"` ausgezeichnet werden.
 * Beträge, Prozentwerte und Zahlen werden von der Engine typisiert übergeben und formatiert.
 */
export default {
  // ------------------------------------------------------------ Posten
  'item.incomeTax': 'Lohnsteuer',
  'item.solidarity': 'Solidaritätszuschlag',
  'item.churchTax': 'Kirchensteuer',
  'item.health': 'Krankenversicherung',
  'item.healthAdditional': 'Zusatzbeitrag Krankenversicherung',
  'item.care': 'Pflegeversicherung',
  'item.careSurcharge': 'Zuschlag Pflegeversicherung für Kinderlose',
  'item.pension': 'Rentenversicherung',
  'item.unemployment': 'Arbeitslosenversicherung',
  'item.pkv': 'Private Krankenversicherung (Basisabsicherung)',
  'item.ppv': 'Private Pflege-Pflichtversicherung',
  'item.employerSubsidy': 'Arbeitgeberzuschuss (steuerfrei)',
  'item.net': 'Nettogehalt',
  'item.employer.health': 'Arbeitgeberanteil Krankenversicherung',
  'item.employer.healthAdditional': 'Arbeitgeberanteil Zusatzbeitrag',
  'item.employer.care': 'Arbeitgeberanteil Pflegeversicherung',
  'item.employer.pension': 'Arbeitgeberanteil Rentenversicherung',
  'item.employer.unemployment': 'Arbeitgeberanteil Arbeitslosenversicherung',
  'item.employer.subsidy': 'Zuschuss zur privaten Kranken- und Pflegeversicherung',
  'item.employer.minijobPension': 'Pauschalbeitrag Rentenversicherung (Minijob)',
  'item.employer.minijobHealth': 'Pauschalbeitrag Krankenversicherung (Minijob)',
  'item.employer.minijobTax': 'Pauschalsteuer (Minijob)',

  // ------------------------------------------------------------ Ergebnis
  'result.employment.minijob': 'Minijob (geringfügige Beschäftigung)',
  'result.employment.midijob': 'Übergangsbereich (Midijob)',
  'result.employment.regular': 'Reguläre Beschäftigung',
  'result.deduct': 'abzüglich',
  'result.add': 'zuzüglich',
  'result.explain.net': 'Nettogehalt',
  'result.sources.external': '(öffnet externe Website in neuem Tab)',
  'result.sources.meta': '{publisher}, Stand {date}, abgerufen am {accessed}',
  'result.sources.metaNoDate': '{publisher}, abgerufen am {accessed}',
  'result.bar.label':
    'Aufteilung des Bruttogehalts: Netto {net} ({netShare}), Steuern {taxes} ({taxesShare}), Sozialabgaben {social} ({socialShare})',

  // --------------------------------------------------------- Hinweise
  'warn.factorOnlyClass4': 'Der Faktor wird nur in Steuerklasse IV berücksichtigt und wurde hier ignoriert.',
  'warn.class2NeedsChild':
    'Steuerklasse II gilt für Alleinerziehende mit mindestens einem Kind im Haushalt. Der Entlastungsbetrag für Alleinerziehende wurde berücksichtigt – bitte prüfen Sie, ob Steuerklasse II für Sie zutrifft.',
  'warn.childAllowancesClass56': 'In den Steuerklassen V und VI werden Kinderfreibeträge nicht berücksichtigt.',
  'warn.midijob':
    'Ihr Gehalt liegt im Übergangsbereich ({limit} bis {upper}): Die Sozialversicherungsbeiträge werden aus einem reduzierten Entgelt berechnet, die Lohnsteuer aus dem vollen Bruttogehalt.',
  'warn.minijobFlatTax':
    'Minijob: Für Sie fällt keine Lohnsteuer an. Angenommen wird, dass der Arbeitgeber das Entgelt pauschal mit {rate} versteuert. Sie zahlen nur den Eigenanteil zur Rentenversicherung (Befreiung auf Antrag möglich).',
  'warn.minijobNoHealth':
    'Beim Minijob fallen für Sie keine Beiträge zur Kranken- und Pflegeversicherung an; die Angaben zur privaten Krankenversicherung wurden ignoriert.',
  'warn.pkvBelowJaeg':
    'Eine private Krankenversicherung ist für Arbeitnehmer in der Regel nur möglich, wenn das Jahresgehalt die Versicherungspflichtgrenze von {limit} übersteigt (für Beamte und Selbstständige gelten andere Regeln).',

  // -------------------------------------------------------- Fehlermeldungen
  'err.gross.required': 'Bitte geben Sie Ihr Bruttogehalt ein.',
  'err.gross.invalid': 'Das Bruttogehalt ist keine gültige Zahl. Beispiel: 4.000 oder 4.000,50.',
  'err.gross.range': 'Das Bruttogehalt muss größer als 0 sein und darf höchstens {max} betragen.',
  'err.gross.decimals': 'Bitte geben Sie höchstens zwei Nachkommastellen an.',
  'err.factor.invalid': 'Der Faktor ist keine gültige Zahl. Beispiel: 0,912.',
  'err.factor.range': 'Der Faktor muss zwischen 0,001 und 0,999 liegen (höchstens drei Nachkommastellen).',
  'err.additionalRate.required': 'Bitte geben Sie den Zusatzbeitragssatz Ihrer Krankenkasse ein.',
  'err.additionalRate.invalid': 'Der Zusatzbeitragssatz ist keine gültige Zahl. Beispiel: 2,9.',
  'err.additionalRate.range': 'Der Zusatzbeitragssatz muss zwischen 0 und 10 Prozent liegen (höchstens zwei Nachkommastellen).',
  'err.premium.required': 'Bitte geben Sie den Monatsbeitrag ein (gegebenenfalls 0).',
  'err.premium.invalid': 'Der Beitrag ist keine gültige Zahl. Beispiel: 450,50.',
  'err.premium.range': 'Der Monatsbeitrag muss zwischen 0 und {max} liegen (höchstens zwei Nachkommastellen).',
  'err.allowance.invalid': 'Der Freibetrag ist keine gültige Zahl. Beispiel: 125,50.',
  'err.allowance.range': 'Der Freibetrag muss zwischen 0 und {max} liegen (höchstens zwei Nachkommastellen).',
  'err.children.required': 'Bitte geben Sie die Anzahl der Kinder unter 25 Jahren ein.',
  'err.children.invalid': 'Bitte geben Sie eine ganze Zahl ein.',
  'err.children.range': 'Die Anzahl der Kinder muss zwischen 0 und 10 liegen.',
  'err.generic': 'Bitte prüfen Sie diese Angabe.',

  // ---------------------------------------------------------- Dynamischer Text im Browser
  'js.live.result': 'Netto: {monthly} pro Monat, {yearly} pro Jahr.',
  'js.live.invalid': 'Bitte korrigieren Sie die markierten Angaben.',
  'js.invalidResult': 'Bitte korrigieren Sie die markierten Angaben, um das Ergebnis zu sehen.',
  'js.errors.field': '{label}: {message}',

  // ---------------------------------------------------------- Rechenweg
  'explain.sv.step.base':
    'Beitragspflichtiges Entgelt: {base} (Bruttogehalt; die Beitragsbemessungsgrenze von {ceiling} pro Monat wird nicht überschritten).',
  'explain.sv.step.baseCapped':
    'Beitragspflichtiges Entgelt: Das Bruttogehalt von {gross} übersteigt die Beitragsbemessungsgrenze von {ceiling} pro Monat, berücksichtigt werden {base}.',
  'explain.sv.step.amount': '{base} × {rate} = {amount}',
  'explain.health.step.rate':
    'Der allgemeine Beitragssatz beträgt {total}. Die Hälfte, also {rate}, trägt der Arbeitnehmer.',
  'explain.healthAdditional.step.rate':
    'Der Zusatzbeitragssatz Ihrer Krankenkasse beträgt {total}. Die Hälfte, also {rate}, trägt der Arbeitnehmer.',
  'explain.care.step.rate':
    'Der Beitragssatz zur Pflegeversicherung beträgt {total}. Die Hälfte, also {rate}, trägt der Arbeitnehmer.',
  'explain.care.step.rateSaxony':
    'Der Beitragssatz zur Pflegeversicherung beträgt {total}. In Sachsen trägt der Arbeitnehmer {rate} und der Arbeitgeber {employerRate}, weil der Buß- und Bettag dort Feiertag geblieben ist.',
  'explain.care.step.reduction': {
    one: 'Beitragsabschlag für Kinder unter 25 Jahren: {perChild} für {count} berücksichtigtes Kind (ab dem zweiten Kind, höchstens vier Abschläge), zusammen {reduction}. Der Arbeitnehmeranteil sinkt entsprechend.',
    other:
      'Beitragsabschlag für Kinder unter 25 Jahren: {perChild} je Kind für {count} berücksichtigte Kinder (ab dem zweiten Kind, höchstens vier Abschläge), zusammen {reduction}. Der Arbeitnehmeranteil sinkt entsprechend.',
  },
  'explain.care.step.reductionMidijob': {
    one: 'Abzüglich Beitragsabschlag für {count} berücksichtigtes Kind: {base} × {reduction} = {amount}. Arbeitnehmeranteil danach: {result}.',
    other:
      'Abzüglich Beitragsabschlag für {count} berücksichtigte Kinder: {base} × {reduction} = {amount}. Arbeitnehmeranteil danach: {result}.',
  },
  'explain.careSurcharge.step.rate':
    'Kinderlose zahlen ab dem 23. Geburtstag einen Beitragszuschlag von {rate}. Ihn trägt der Arbeitnehmer allein.',
  'explain.pension.step.rate':
    'Der Beitragssatz zur Rentenversicherung beträgt {total}. Die Hälfte, also {rate}, trägt der Arbeitnehmer.',
  'explain.unemployment.step.rate':
    'Der Beitragssatz zur Arbeitslosenversicherung beträgt {total}. Die Hälfte, also {rate}, trägt der Arbeitnehmer.',
  'explain.midijob.step.be':
    'Übergangsbereich: Die beitragspflichtige Einnahme für Gesamtbeitrag und Beitragszuschlag ist BE = F × G + (OG ÷ (OG − G) − G ÷ (OG − G) × F) × (AE − G). Mit AE = {gross}, G = {g}, OG = {og} und F = {f} ergibt das {be}.',
  'explain.midijob.step.beAn':
    'Übergangsbereich: Die beitragspflichtige Einnahme für den Arbeitnehmeranteil ist BE_AN = OG ÷ (OG − G) × (AE − G). Mit AE = {gross}, G = {g} und OG = {og} ergibt das {beAn}.',
  'explain.minijob.step.pensionRate':
    'Rentenversicherungsbeitrag {total} abzüglich Pauschalbeitrag des Arbeitgebers {employer} = Eigenanteil des Arbeitnehmers von {rate} des Entgelts.',
  'explain.minijob.step.pensionExempt':
    'Sie sind von der Rentenversicherungspflicht befreit. Für Sie fällt kein Eigenanteil an; der Arbeitgeber zahlt seinen Pauschalbeitrag trotzdem.',
  'explain.incomeTax.step.minijob':
    'Beim Minijob zahlt der Arbeitnehmer keine Lohnsteuer: Angenommen wird eine Pauschalbesteuerung durch den Arbeitgeber mit {rate}.',

  'explain.incomeTax.step.annual':
    'Jahresarbeitslohn: Monatsbrutto {monthly} × 12 = {annual} (Annahme: Das Gehalt ist in allen zwölf Monaten gleich).',
  'explain.incomeTax.step.allowance': 'Abzüglich Freibetrag laut Lohnsteuerabzugsmerkmalen (ELStAM): {monthly} × 12 = {annual}.',
  'explain.incomeTax.step.anp': 'Abzüglich Arbeitnehmer-Pauschbetrag: {amount}.',
  'explain.incomeTax.step.sap': 'Abzüglich Sonderausgaben-Pauschbetrag: {amount}.',
  'explain.incomeTax.step.efa': 'Abzüglich Entlastungsbetrag für Alleinerziehende (Steuerklasse II): {amount}.',
  'explain.incomeTax.step.vspPension':
    'Vorsorgepauschale, Teilbetrag Rentenversicherung: {base} (Jahreslohn, höchstens bis zur Beitragsbemessungsgrenze von {ceiling}) × {rate} = {amount}.',
  'explain.incomeTax.step.vspHealth':
    'Vorsorgepauschale, Teilbetrag Kranken- und Pflegeversicherung: {base} (Jahreslohn, höchstens bis zur Beitragsbemessungsgrenze von {ceiling}) × (Krankenversicherung {kvRate} + Pflegeversicherung {pvRate}) = {amount}.',
  'explain.incomeTax.step.vspPrivate':
    'Vorsorgepauschale, Teilbetrag private Kranken- und Pflege-Pflichtversicherung: (Monatsbeiträge {premium} − Arbeitgeberzuschuss {subsidy}) × 12 = {amount}.',
  'explain.incomeTax.step.vspUnemployment':
    'Vorsorgepauschale, Teilbetrag Arbeitslosenversicherung: {base} × {rate} = {amount}.',
  'explain.incomeTax.step.vspCap':
    'Die Teilbeträge für Arbeitslosen-, Kranken- und Pflegeversicherung ({sum}) werden auf den Höchstbetrag von {cap} begrenzt: {result}.',
  'explain.incomeTax.step.vspTotal':
    'Die Vorsorgepauschale ist der höhere von zwei Beträgen, jeweils auf volle Euro aufgerundet: Rentenversicherung + Kranken- und Pflegeversicherung = {a}, oder Rentenversicherung + begrenzter Betrag = {b}. Ergebnis: {result}.',
  'explain.incomeTax.step.vspTotalSimple': 'Vorsorgepauschale insgesamt (auf volle Euro aufgerundet): {result}.',
  'explain.incomeTax.step.taxableIncome':
    'Zu versteuerndes Einkommen = {annual} − {deductions} (Pauschbeträge) − {vsp} (Vorsorgepauschale) = {zve}.',
  'explain.incomeTax.step.tariffBase':
    'Für den Einkommensteuertarif wird das zu versteuernde Einkommen {zve} auf volle Euro abgerundet: X = {x}.',
  'explain.incomeTax.step.tariffBaseSplitting':
    'Steuerklasse III (Splittingverfahren): Das zu versteuernde Einkommen {zve} wird halbiert und auf volle Euro abgerundet: X = {x}. Die Steuer wird anschließend verdoppelt.',
  'explain.incomeTax.step.tariffZone0':
    'X = {x} liegt nicht über dem Grundfreibetrag von {gfb}: Die Einkommensteuer beträgt {result}.',
  'explain.incomeTax.step.tariffZone1':
    'Tarifzone 1 (§ 32a Abs. 1 Nr. 2 EStG): y = (X − {gfb}) ÷ 10.000 = {y}. Steuer = ({a} × y + {b}) × y = {result} (auf volle Euro abgerundet).',
  'explain.incomeTax.step.tariffZone2':
    'Tarifzone 2 (§ 32a Abs. 1 Nr. 3 EStG): z = (X − {offset}) ÷ 10.000 = {z}. Steuer = ({a} × z + {b}) × z + {c} = {result} (auf volle Euro abgerundet).',
  'explain.incomeTax.step.tariffZone3':
    'Tarifzone 3 (§ 32a Abs. 1 Nr. 4 EStG): Steuer = {rate} × X − {constant} = {result} (auf volle Euro abgerundet).',
  'explain.incomeTax.step.tariffZone4':
    'Tarifzone 4 (§ 32a Abs. 1 Nr. 5 EStG): Steuer = {rate} × X − {constant} = {result} (auf volle Euro abgerundet).',
  'explain.incomeTax.step.splittingDouble':
    'Splittingverfahren: Steuer für X = {single}, verdoppelt = {result}.',
  'explain.incomeTax.step.tariffV56Zone1':
    'Steuerklassen V und VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} bis {w1}: Die Steuer ist das Doppelte der Differenz aus der Einkommensteuer auf das 1,25-Fache und auf das 0,75-Fache von X, mindestens aber 14 % von X: {result}.',
  'explain.incomeTax.step.tariffV56Zone2':
    'Steuerklassen V und VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} zwischen {w1} und {w2}: Es gilt der niedrigere von zwei Werten – die Steuer nach dem Differenzverfahren oder die Steuer für {w1} zuzüglich 42 % des darüber liegenden Betrags: {result}.',
  'explain.incomeTax.step.tariffV56Zone3':
    'Steuerklassen V und VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} zwischen {w2} und {w3}: Steuer für {w2} nach dem Differenzverfahren zuzüglich 42 % des darüber liegenden Betrags: {result}.',
  'explain.incomeTax.step.tariffV56Zone4':
    'Steuerklassen V und VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} über {w3}: Steuer für {w2} nach dem Differenzverfahren, zuzüglich 42 % des Betrags bis {w3} und 45 % des darüber liegenden Betrags: {result}.',
  'explain.incomeTax.step.factor':
    'Faktorverfahren (Steuerklasse IV): {tax} × Faktor {factor} = {result} (auf volle Euro abgerundet).',
  'explain.incomeTax.step.annualTax': 'Jahreslohnsteuer: {result}.',
  'explain.incomeTax.step.monthlyTax': 'Monatslohnsteuer = {annual} ÷ 12, abgerundet auf volle Cent: {result}.',
  'explain.incomeTax.step.childrenNote':
    'Kinderfreibeträge ({count}) mindern die Lohnsteuer nicht; sie wirken sich nur auf Solidaritätszuschlag und Kirchensteuer aus.',

  'explain.solidarity.step.base': 'Bemessungsgrundlage ist die Jahreslohnsteuer: {base}.',
  'explain.solidarity.step.baseChildren':
    'Bemessungsgrundlage ist die Jahreslohnsteuer nach Abzug der Kinderfreibeträge ({allowances} vom Einkommen): {base} (ohne Kinderfreibeträge: {tax}).',
  'explain.solidarity.step.belowLimit':
    '{base} liegen nicht über der Freigrenze von {limit}: Es fällt kein Solidaritätszuschlag an.',
  'explain.solidarity.step.aboveLimit':
    'Die Freigrenze von {limit} wird überschritten. Voller Zuschlag: {base} × {rate} = {full}. Milderungszone: ({base} − {limit}) × {mitigationRate} = {mitigation}. Der niedrigere Wert gilt: {result}.',
  'explain.solidarity.step.monthly': 'Monatsanteil: {annual} ÷ 12, abgerundet auf volle Cent: {result}.',

  'explain.churchTax.step.base':
    'Maßstabsteuer (Jahreslohnsteuer, bei Kinderfreibeträgen nach deren Abzug): {annual}. Monatsanteil ({annual} ÷ 12, abgerundet): {result}.',
  'explain.churchTax.step.amount': '{base} × {rate} ({state}) = {amount}, auf volle Cent abgerundet.',

  'explain.pkv.step.premium':
    'Monatsbeitrag zur privaten Basis-Krankenversicherung laut Ihrer Angabe: {premium}. Er wird vollständig vom Nettogehalt abgezogen.',
  'explain.ppv.step.premium':
    'Monatsbeitrag zur privaten Pflege-Pflichtversicherung laut Ihrer Angabe: {premium}. Er wird vollständig vom Nettogehalt abgezogen.',
  'explain.employerSubsidy.step.health':
    'Krankenversicherung: Hälfte des Beitrags {premium} = {half}, höchstens {cap} (Beitragsbemessungsgrenze {ceiling} × {rate}, das entspricht dem Arbeitgeberanteil in der gesetzlichen Krankenversicherung mit halbem durchschnittlichem Zusatzbeitrag). Zuschuss: {result}.',
  'explain.employerSubsidy.step.care':
    'Pflegeversicherung: Hälfte des Beitrags {premium} = {half}, höchstens {cap} (Beitragsbemessungsgrenze {ceiling} × {rate}, der Arbeitgeberanteil in der sozialen Pflegeversicherung). Zuschuss: {result}.',
  'explain.employerSubsidy.step.total':
    'Der steuerfreie Arbeitgeberzuschuss beträgt zusammen {result}. Er wird dem Nettogehalt hinzugerechnet.',

  'explain.net.step.sum': 'Netto = Brutto {gross} − Steuern {taxes} − Sozialabgaben {social} = {net}.',
  'explain.net.step.sumPrivate':
    'Netto = Brutto {gross} − Steuern {taxes} − Sozialabgaben {social} (einschließlich privater Beiträge abzüglich Arbeitgeberzuschuss) = {net}.',

  // ------------------------------------------------------------ Bundesländer
  'state.BW': 'Baden-Württemberg',
  'state.BY': 'Bayern',
  'state.BE': 'Berlin',
  'state.BB': 'Brandenburg',
  'state.HB': 'Bremen',
  'state.HH': 'Hamburg',
  'state.HE': 'Hessen',
  'state.MV': 'Mecklenburg-Vorpommern',
  'state.NI': 'Niedersachsen',
  'state.NW': 'Nordrhein-Westfalen',
  'state.RP': 'Rheinland-Pfalz',
  'state.SL': 'Saarland',
  'state.SN': 'Sachsen',
  'state.ST': 'Sachsen-Anhalt',
  'state.SH': 'Schleswig-Holstein',
  'state.TH': 'Thüringen',

  // ------------------------------------------------------------ Quellen
  'source.bmf-pap-2026.title':
    'BMF: Programmablaufpläne für den Lohnsteuerabzug 2026 (BMF-Schreiben vom 12.11.2025)',
  'source.bmf-pap-2026-xml.title': 'BMF / ITZBund: Programmablaufplan 2026 als XML-Pseudocode (Lohn- und Einkommensteuerrechner)',
  'source.bmf-vsp-2026.title':
    'BMF-Schreiben vom 14.08.2025: Vorsorgepauschale im Lohnsteuerabzugsverfahren ab 2026',
  'source.estg-32a.title': '§ 32a EStG – Einkommensteuertarif',
  'source.estg-39b.title': '§ 39b EStG – Einbehaltung der Lohnsteuer',
  'source.estg-9a.title': '§ 9a EStG – Pauschbeträge für Werbungskosten',
  'source.estg-10c.title': '§ 10c EStG – Sonderausgaben-Pauschbetrag',
  'source.estg-24b.title': '§ 24b EStG – Entlastungsbetrag für Alleinerziehende',
  'source.estg-32.title': '§ 32 EStG – Kinder, Freibeträge für Kinder',
  'source.estg-40a.title': '§ 40a EStG – Pauschalierung der Lohnsteuer in Sonderfällen (Minijobs)',
  'source.estg-51a.title': '§ 51a EStG – Festsetzung und Erhebung von Zuschlagsteuern (Kirchensteuer)',
  'source.solzg-3.title': '§ 3 Solidaritätszuschlaggesetz 1995 – Bemessungsgrundlage, Freigrenze',
  'source.solzg-4.title': '§ 4 Solidaritätszuschlaggesetz 1995 – Zuschlagsatz, Milderungszone',
  'source.kist-saetze.title': 'Freie und Hansestadt Hamburg: Berechnung der Kirchensteuer (Satz 8 % bzw. 9 %)',
  'source.kistg-bb.title': 'Brandenburgisches Kirchensteuergesetz (BbgKiStG)',
  'source.kistg-hb.title': 'Bremisches Kirchensteuergesetz (KiStG) in der Fassung vom 23. August 2001',
  'source.kistg-nw.title': 'Kirchensteuergesetz Nordrhein-Westfalen (KiStG), Neufassung vom 29.11.2019',
  'source.svbezgrv-2026.title': 'Sozialversicherungsrechengrößen-Verordnung 2026 (BGBl. 2025 I Nr. 278)',
  'source.sgb5-241.title': '§ 241 SGB V – Allgemeiner Beitragssatz',
  'source.sgb5-242.title': '§ 242 SGB V – Zusatzbeitrag',
  'source.sgb5-242a.title': '§ 242a SGB V – Durchschnittlicher Zusatzbeitragssatz',
  'source.sgb5-249.title': '§ 249 SGB V – Tragung der Beiträge bei versicherungspflichtiger Beschäftigung',
  'source.sgb5-249b.title': '§ 249b SGB V – Beitrag des Arbeitgebers bei geringfügiger Beschäftigung',
  'source.sgb5-257.title': '§ 257 SGB V – Beitragszuschüsse für Beschäftigte (private Krankenversicherung)',
  'source.bmg-zusatzbeitrag-2026.title':
    'Bundesministerium für Gesundheit: Beitragssätze der gesetzlichen Krankenversicherung, durchschnittlicher Zusatzbeitragssatz 2026',
  'source.sgb11-55.title': '§ 55 SGB XI – Beitragssatz, Beitragsabschlag und -zuschlag',
  'source.sgb11-58.title': '§ 58 SGB XI – Tragung der Beiträge bei versicherungspflichtig Beschäftigten',
  'source.sgb11-61.title': '§ 61 SGB XI – Beitragszuschüsse für Beschäftigte (private Pflegeversicherung)',
  'source.sgb6-158.title': '§ 158 SGB VI – Beitragssätze',
  'source.sgb6-168.title': '§ 168 SGB VI – Beitragstragung bei Beschäftigten',
  'source.sgb6-172.title': '§ 172 SGB VI – Beitrag des Arbeitgebers bei geringfügiger Beschäftigung',
  'source.sgb3-341.title': '§ 341 SGB III – Beitragssatz zur Arbeitslosenversicherung',
  'source.sgb4-8.title': '§ 8 SGB IV – Geringfügige Beschäftigung und geringfügige selbständige Tätigkeit',
  'source.sgb4-20.title': '§ 20 SGB IV – Beitragspflichtige Einnahmen, Übergangsbereich',
  'source.bmas-faktor-f-2026.title':
    'Bundesministerium für Arbeit und Soziales: Bekanntmachung des Faktors F für den Übergangsbereich 2026 (BAnz AT 18.12.2025 B5)',
  'source.milov5.title': 'Fünfte Mindestlohnanpassungsverordnung (MiLoV 5)',
  'source.rs-uebergangsbereich.title':
    'Gemeinsames Rundschreiben von GKV-Spitzenverband, Deutscher Rentenversicherung Bund und Bundesagentur für Arbeit: Beschäftigungsverhältnisse im Übergangsbereich ab 01.01.2023',
  'source.bvv-2.title': '§ 2 Beitragsverfahrensverordnung (BVV) – Berechnung der Beiträge',

  // ============================================================ Statische Seitentexte (nur Vorrendern)
  'meta.title': 'Brutto-Netto-Rechner {year} – Gehalt, Steuern und Sozialabgaben',
  'meta.description':
    'Kostenloser Brutto-Netto-Rechner für Deutschland ({year}) nach dem amtlichen Programmablaufplan des BMF. Läuft komplett im Browser – ohne Cookies, mit nachvollziehbarem Rechenweg und Quellen.',
  'site.name': 'Brutto-Netto-Rechner',
  'site.title': 'Brutto-Netto-Rechner {year}',
  'site.lead':
    'Berechnen Sie Ihr Nettogehalt nach dem amtlichen Programmablaufplan des Bundesfinanzministeriums – direkt im Browser, ohne Cookies, mit nachvollziehbarem Rechenweg und Quellen.',
  'noscript': 'Für die Berechnung wird JavaScript benötigt. Alle Berechnungen laufen lokal in Ihrem Browser; es werden keine Daten übertragen.',
  'nav.skip': 'Zum Rechner springen',
  'nav.skipContent': 'Zum Inhalt springen',
  'nav.language': 'Sprache',
  'nav.back': 'Zurück zum Rechner',
  'nav.home': 'Rechner',
  'page.legal.slug': 'impressum',
  'page.notFound.title': 'Seite nicht gefunden',
  'page.notFound.text': 'Die angeforderte Seite gibt es nicht (mehr).',
  'page.privacy.slug': 'datenschutz',

  'form.title': 'Ihre Angaben',
  'form.errors.title': 'Bitte korrigieren Sie folgende Angaben',
  'form.salary.legend': 'Gehalt',
  'form.gross.label': 'Bruttogehalt',
  'form.gross.placeholder': 'z. B. 4.000',
  'form.gross.hint': 'Betrag in Euro, auch mit Cent (z. B. 4.000,50).',
  'form.period.legend': 'Zeitraum',
  'form.period.month': 'pro Monat',
  'form.period.year': 'pro Jahr',
  'form.year.label': 'Abrechnungsjahr',
  'form.minijob.exempt': 'Von der Rentenversicherungspflicht befreit',
  'form.minijob.hint': 'Beim Minijob (bis {minijobLimit} pro Monat) können Sie sich auf Antrag von der Rentenversicherungspflicht befreien lassen.',
  'form.tax.legend': 'Steuern',
  'form.taxClass.label': 'Steuerklasse',
  'form.taxClass.1': 'I – alleinstehend',
  'form.taxClass.2': 'II – alleinerziehend',
  'form.taxClass.3': 'III – verheiratet, höheres Einkommen',
  'form.taxClass.4': 'IV – verheiratet, ähnliches Einkommen',
  'form.taxClass.5': 'V – verheiratet, geringeres Einkommen',
  'form.taxClass.6': 'VI – weiteres Arbeitsverhältnis',
  'form.state.label': 'Bundesland (Wohnort und Arbeitsort)',
  'form.churchTax.legend': 'Kirchensteuerpflichtig?',
  'form.yes': 'Ja',
  'form.no': 'Nein',
  'form.childAllowances.label': 'Kinderfreibeträge',
  'form.childAllowances.hint':
    'Laut Lohnsteuerabzugsmerkmalen (ELStAM). Sie wirken sich nur auf Solidaritätszuschlag und Kirchensteuer aus.',
  'form.childAllowances.note': 'In den Steuerklassen V und VI werden Kinderfreibeträge nicht berücksichtigt.',
  'form.health.legend': 'Krankenversicherung',
  'form.health.type': 'Art der Krankenversicherung',
  'form.health.statutory': 'Gesetzlich',
  'form.health.private': 'Privat',
  'form.additionalRate.label': 'Zusatzbeitragssatz Ihrer Krankenkasse',
  'form.additionalRate.hint':
    'Durchschnitt {year}: {average}. Den Satz Ihrer Kasse finden Sie auf deren Website oder Ihrer Gehaltsabrechnung.',
  'form.kvPremium.label': 'Monatsbeitrag Basis-Krankenversicherung',
  'form.kvPremium.hint': 'Nur der Beitrag für die Basisabsicherung, ohne Zusatz- und Komfortleistungen.',
  'form.pvPremium.label': 'Monatsbeitrag Pflege-Pflichtversicherung',
  'form.employerSubsidy.label': 'Arbeitgeberzuschuss berücksichtigen',
  'form.care.legend': 'Pflegeversicherung',
  'form.hasChildren.legend': 'Kinder vorhanden (Elterneigenschaft)?',
  'form.childrenUnder25.label': 'Anzahl Kinder unter 25 Jahren',
  'form.childrenUnder25.hint': 'Ab dem zweiten Kind sinkt der Pflegeversicherungsbeitrag (bis zu vier Abschläge).',
  'form.age23.legend': '23 Jahre oder älter?',
  'form.more.title': 'Weitere Angaben',
  'form.pension.label': 'Rentenversicherungspflichtig',
  'form.unemployment.label': 'Arbeitslosenversicherungspflichtig',
  'form.allowance.label': 'Monatlicher Lohnsteuer-Freibetrag (ELStAM)',
  'form.allowance.hint': 'Nur ausfüllen, wenn für Sie ein Freibetrag eingetragen ist.',
  'form.factor.label': 'Faktor (Steuerklasse IV mit Faktor)',
  'form.factor.hint': 'Zwischen 0,001 und 0,999 mit höchstens drei Nachkommastellen. Leer lassen, wenn Sie kein Faktorverfahren nutzen.',
  'form.submit': 'Netto berechnen',
  'form.reset': 'Zurücksetzen',

  'result.title': 'Ergebnis',
  'result.empty': 'Geben Sie Ihr Bruttogehalt ein und wählen Sie „Netto berechnen“. Das Ergebnis erscheint hier.',
  'result.net': 'Netto',
  'result.perMonth': 'pro Monat',
  'result.perYear': 'pro Jahr',
  'result.gross': 'Bruttogehalt',
  'result.net.total': 'Nettogehalt',
  'result.taxes.total': 'Steuern gesamt',
  'result.social.total': 'Sozialabgaben gesamt',
  'result.legend.taxes': 'Steuern',
  'result.legend.social': 'Sozialabgaben',
  'result.legend.entry': '{label}: {amount} ({share})',
  'result.table.caption': 'Brutto-Netto-Aufstellung',
  'result.table.item': 'Posten',
  'result.table.month': 'Pro Monat',
  'result.table.year': 'Pro Jahr',
  'result.employer.title': 'Arbeitgeberkosten',
  'result.employer.caption': 'Arbeitgeberkosten pro Monat und Jahr',
  'result.employer.totalCost': 'Gesamtkosten für den Arbeitgeber',
  'result.employer.note': 'Ohne Umlagen (U1, U2, U3), Unfallversicherung und sonstige Nebenkosten.',
  'result.print': 'Drucken',
  'result.sources.cite': { one: 'Quelle:', other: 'Quellen:' },

  'section.explain.title': 'Rechenweg und Quellen',
  'section.explain.intro':
    'So kommt jeder Posten zustande – mit Ihren Zahlen und den amtlichen Quellen. Beträge sind auf Cent gerundet. Ein Klick auf einen Posten klappt seinen Rechenweg auf.',
  'section.sources.title': 'Quellenverzeichnis',
  'section.sources.intro': 'Alle in den Rechenwegen verwendeten Quellen. Externe Links öffnen in einem neuen Tab.',
  'section.limits.title': 'Grenzen dieses Rechners',
  'section.limits.intro': 'Der Rechner bildet das laufende Monatsgehalt eines Arbeitnehmers nach dem Rechtsstand {year} ab. Nicht berücksichtigt sind:',
  'section.limits.item1': 'Versorgungsbezüge und Betriebsrenten, Altersentlastungsbetrag',
  'section.limits.item2': 'Einmalzahlungen und sonstige Bezüge (zum Beispiel Weihnachtsgeld), geldwerte Vorteile (zum Beispiel Dienstwagen)',
  'section.limits.item3': 'Entgeltumwandlung und betriebliche Altersversorgung, knappschaftliche Rentenversicherung, Aktivrente, Kurzarbeit',
  'section.limits.item4': 'Mindestkirchensteuer und Kappung der Kirchensteuer, Hinzurechnungsbetrag, Mehrfachbeschäftigung',
  'section.limits.item5': 'Umlagen des Arbeitgebers (U1, U2, U3) in den Arbeitgeberkosten',
  'section.limits.assumptions':
    'Annahme: Das Gehalt ist in allen zwölf Monaten gleich; Jahreswerte sind zwölf Monatswerte. Das Ergebnis ersetzt weder eine Lohnabrechnung noch eine Steuerberatung.',

  'footer.status': 'Rechtsstand {year} · Datenstand {dataAsOf}',
  'footer.local': 'Die Berechnung erfolgt ausschließlich lokal in Ihrem Browser. Keine Cookies, keine Datenübertragung.',
  'footer.disclaimer':
    'Keine Steuer- oder Rechtsberatung, alle Angaben ohne Gewähr. Grundlage sind der amtliche Programmablaufplan des Bundesfinanzministeriums für den Lohnsteuerabzug {year} und die gesetzlichen Sozialversicherungswerte {year}.',
  'footer.nav': 'Rechtliches',
  'footer.legal': 'Impressum',
  'footer.privacyLink': 'Datenschutz',
  'footer.a11y': 'Barrierefreiheit',

  'legal.meta.title': 'Impressum – Brutto-Netto-Rechner',
  'legal.meta.description': 'Impressum des Brutto-Netto-Rechners.',
  'legal.title': 'Impressum',
  'legal.placeholderNotice':
    'Hinweis für den Betreiber: Die in eckigen Klammern markierten Angaben sind Platzhalter und müssen vor der Veröffentlichung durch die echten Betreiberangaben ersetzt werden (§ 5 DDG).',
  'legal.provider.title': 'Angaben gemäß § 5 DDG',
  'legal.provider.name': '[Name der Person oder Firma des Betreibers]',
  'legal.provider.address': '[Straße und Hausnummer, Postleitzahl und Ort]',
  'legal.contact.title': 'Kontakt',
  'legal.contact.email': 'E-Mail: [E-Mail-Adresse]',
  'legal.contact.phone': 'Telefon: [Telefonnummer, optional]',
  'legal.responsible.title': 'Verantwortlich für den Inhalt',
  'legal.responsible.text': '[Name und Anschrift der verantwortlichen Person, falls abweichend]',
  'legal.liability.title': 'Haftungsausschluss',
  'legal.liability.content':
    'Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Berechnungen und Texte wird jedoch keine Gewähr übernommen. Die Ergebnisse sind unverbindliche Orientierungswerte.',
  'legal.liability.links':
    'Diese Website verweist auf externe Quellen (zum Beispiel Gesetze und Veröffentlichungen von Behörden). Für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich.',
  'legal.calc.title': 'Keine Beratung',
  'legal.calc.text':
    'Der Brutto-Netto-Rechner ersetzt weder eine Lohn- und Gehaltsabrechnung noch eine Steuer-, Rechts- oder Sozialversicherungsberatung. Maßgeblich ist immer die Abrechnung des Arbeitgebers.',

  'privacy.meta.title': 'Datenschutzerklärung und Barrierefreiheit – Brutto-Netto-Rechner',
  'privacy.meta.description': 'Datenschutzerklärung und Erklärung zur Barrierefreiheit des Brutto-Netto-Rechners.',
  'privacy.title': 'Datenschutzerklärung',
  'privacy.placeholderNotice':
    'Hinweis für den Betreiber: Die in eckigen Klammern markierten Angaben sind Platzhalter und müssen vor der Veröffentlichung ausgefüllt werden. Prüfen Sie den Text insbesondere, wenn Sie einen Hosting-Anbieter nutzen, der zusätzliche Daten verarbeitet.',
  'privacy.controller.title': 'Verantwortlicher',
  'privacy.controller.text': '[Name und Anschrift des Betreibers, E-Mail-Adresse – siehe Impressum]',
  'privacy.overview.title': 'Kurzfassung',
  'privacy.overview.text': 'Dieser Rechner ist so gebaut, dass Ihre Eingaben Ihr Gerät nicht verlassen:',
  'privacy.overview.item1': 'Alle Berechnungen laufen ausschließlich in Ihrem Browser. Ihre Angaben werden nicht an einen Server übertragen.',
  'privacy.overview.item2': 'Es werden keine Cookies gesetzt und keine Daten im Browser gespeichert (kein localStorage, sessionStorage oder IndexedDB).',
  'privacy.overview.item3': 'Es gibt keine Analyse- oder Tracking-Dienste, keine eingebetteten Inhalte Dritter, keine externen Schriftarten und keine Content-Delivery-Netzwerke.',
  'privacy.overview.item4': 'Deshalb ist kein Cookie-Banner erforderlich.',
  'privacy.hosting.title': 'Hosting und Server-Logfiles',
  'privacy.hosting.text':
    'Beim Aufruf der Seite verarbeitet der Hosting-Anbieter technisch notwendige Verbindungsdaten (zum Beispiel IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp) in Server-Logfiles, um die Seite auszuliefern und sicher zu betreiben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Hosting-Anbieter: [Name und Anschrift des Hosting-Anbieters].',
  'privacy.url.title': 'Eingaben in der Adresszeile',
  'privacy.url.text':
    'Nach der Berechnung werden Ihre Angaben als Parameter in der Adresszeile (URL) abgelegt, damit Sie das Ergebnis als Lesezeichen speichern oder weitergeben können. Die URL verbleibt in Ihrem Browser; sie wird nur dann an Dritte weitergegeben, wenn Sie sie selbst teilen.',
  'privacy.links.title': 'Externe Links',
  'privacy.links.text':
    'Die Quellenangaben verlinken auf Websites von Behörden und Ministerien. Beim Anklicken wird die Zielseite in einem neuen Tab geöffnet; dabei wird keine Referrer-Adresse übermittelt. Für die Datenverarbeitung auf diesen Seiten sind deren Betreiber verantwortlich.',
  'privacy.rights.title': 'Ihre Rechte',
  'privacy.rights.text':
    'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.',

  'a11y.title': 'Erklärung zur Barrierefreiheit',
  'a11y.status':
    'Ziel dieser Website ist die Konformität mit den Web Content Accessibility Guidelines (WCAG) 2.2, Stufe AA. Stand: 1. Oktober 2026. Die Seiten werden automatisiert mit axe-core (ohne Befunde) und manuell per Tastatur geprüft.',
  'a11y.measures':
    'Umgesetzt sind unter anderem: semantisches HTML mit Überschriften und Bereichen, Tastaturbedienung ohne Fokusfalle, sichtbarer Fokus, ausreichende Kontraste im hellen und dunklen Modus, Fehlermeldungen mit Bezug zum Feld, Anpassung an große Schrift und schmale Bildschirme (Reflow bis 320 Pixel) sowie ein Druckstil.',
  'a11y.limits':
    'Bekannte Grenzen: Die verlinkten Quellen (zum Beispiel PDF-Dokumente von Behörden) liegen nicht in unserer Verantwortung und sind möglicherweise nicht barrierefrei. Eine Prüfung mit allen gängigen Screenreadern fand nicht statt.',
  'a11y.feedback': 'Barrieren melden Sie bitte an die im Impressum genannte Kontaktadresse. Wir bemühen uns, Hinweise zeitnah umzusetzen.',
};
