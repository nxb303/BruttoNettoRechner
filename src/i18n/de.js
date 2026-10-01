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
  'js.state.placeholder': 'Bitte wählen',

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
};
