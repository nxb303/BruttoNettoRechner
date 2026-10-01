/**
 * English dictionary. German technical terms are given in brackets and marked with
 * `[de:term]` so that they are exposed to screen readers as German (`lang="de"`).
 */
export default {
  // ------------------------------------------------------------ Items
  'item.incomeTax': 'Wage tax ([de:Lohnsteuer])',
  'item.solidarity': 'Solidarity surcharge ([de:Solidaritätszuschlag])',
  'item.churchTax': 'Church tax ([de:Kirchensteuer])',
  'item.health': 'Health insurance ([de:Krankenversicherung])',
  'item.healthAdditional': 'Health insurance additional contribution ([de:Zusatzbeitrag])',
  'item.care': 'Long-term care insurance ([de:Pflegeversicherung])',
  'item.careSurcharge': 'Care insurance surcharge for childless people ([de:Beitragszuschlag für Kinderlose])',
  'item.pension': 'Pension insurance ([de:Rentenversicherung])',
  'item.unemployment': 'Unemployment insurance ([de:Arbeitslosenversicherung])',
  'item.pkv': 'Private health insurance, basic cover ([de:Private Krankenversicherung])',
  'item.ppv': 'Private compulsory care insurance ([de:Private Pflege-Pflichtversicherung])',
  'item.employerSubsidy': 'Employer subsidy, tax-free ([de:Arbeitgeberzuschuss])',
  'item.net': 'Net salary ([de:Nettogehalt])',
  'item.employer.health': 'Employer share of health insurance',
  'item.employer.healthAdditional': 'Employer share of additional contribution',
  'item.employer.care': 'Employer share of care insurance',
  'item.employer.pension': 'Employer share of pension insurance',
  'item.employer.unemployment': 'Employer share of unemployment insurance',
  'item.employer.subsidy': 'Subsidy for private health and care insurance',
  'item.employer.minijobPension': 'Flat-rate pension contribution (mini-job)',
  'item.employer.minijobHealth': 'Flat-rate health contribution (mini-job)',
  'item.employer.minijobTax': 'Flat-rate tax (mini-job)',

  // ------------------------------------------------------------ Result
  'result.employment.minijob': 'Mini-job ([de:geringfügige Beschäftigung])',
  'result.employment.midijob': 'Transition range, midi-job ([de:Übergangsbereich])',
  'result.employment.regular': 'Regular employment',
  'result.deduct': 'minus',
  'result.add': 'plus',
  'result.explain.net': 'Net salary ([de:Nettogehalt])',
  'result.sources.external': '(opens external website in a new tab)',
  'result.sources.meta': '{publisher}, as of {date}, retrieved on {accessed}',
  'result.sources.metaNoDate': '{publisher}, retrieved on {accessed}',
  'result.bar.label':
    'Breakdown of gross salary: net {net} ({netShare}), taxes {taxes} ({taxesShare}), social security {social} ({socialShare})',

  // --------------------------------------------------------- Notes
  'warn.factorOnlyClass4': 'The factor only applies to tax class IV and was ignored here.',
  'warn.class2NeedsChild':
    'Tax class II is for single parents with at least one child in the household. The relief amount for single parents was applied – please check whether tax class II applies to you.',
  'warn.childAllowancesClass56': 'Child allowances are not taken into account in tax classes V and VI.',
  'warn.midijob':
    'Your salary is in the transition range ({limit} to {upper}): social security contributions are calculated from a reduced amount, wage tax from the full gross salary.',
  'warn.minijobFlatTax':
    'Mini-job: you pay no wage tax. We assume that the employer pays a flat-rate tax of {rate}. You only pay your own share of pension insurance (an exemption can be requested).',
  'warn.minijobNoHealth':
    'In a mini-job you pay no health or care insurance contributions; the details on private health insurance were ignored.',
  'warn.pkvBelowJaeg':
    'Private health insurance is generally only available to employees whose annual salary exceeds the compulsory insurance threshold of {limit} (civil servants and the self-employed follow different rules).',

  // -------------------------------------------------------- Error messages
  'err.gross.required': 'Please enter your gross salary.',
  'err.gross.invalid': 'The gross salary is not a valid number. Example: 4,000 or 4,000.50.',
  'err.gross.range': 'The gross salary must be greater than 0 and no more than {max}.',
  'err.gross.decimals': 'Please enter at most two decimal places.',
  'err.factor.invalid': 'The factor is not a valid number. Example: 0.912.',
  'err.factor.range': 'The factor must be between 0.001 and 0.999 (at most three decimal places).',
  'err.additionalRate.required': 'Please enter the additional contribution rate of your health insurer.',
  'err.additionalRate.invalid': 'The additional contribution rate is not a valid number. Example: 2.9.',
  'err.additionalRate.range': 'The additional contribution rate must be between 0 and 10 percent (at most two decimal places).',
  'err.premium.required': 'Please enter the monthly premium (0 if there is none).',
  'err.premium.invalid': 'The premium is not a valid number. Example: 450.50.',
  'err.premium.range': 'The monthly premium must be between 0 and {max} (at most two decimal places).',
  'err.allowance.invalid': 'The allowance is not a valid number. Example: 125.50.',
  'err.allowance.range': 'The allowance must be between 0 and {max} (at most two decimal places).',
  'err.children.required': 'Please enter the number of children under 25.',
  'err.children.invalid': 'Please enter a whole number.',
  'err.children.range': 'The number of children must be between 0 and 10.',
  'err.generic': 'Please check this entry.',

  // ---------------------------------------------------------- Dynamic text in the browser
  'js.live.result': 'Net: {monthly} per month, {yearly} per year.',
  'js.live.invalid': 'Please correct the highlighted entries.',
  'js.invalidResult': 'Please correct the highlighted entries to see the result.',
  'js.errors.field': '{label}: {message}',
  'js.state.placeholder': 'Please choose',

  // ---------------------------------------------------------- Calculation steps
  'explain.sv.step.base':
    'Contribution base: {base} (gross salary; the monthly contribution ceiling of {ceiling} is not exceeded).',
  'explain.sv.step.baseCapped':
    'Contribution base: the gross salary of {gross} exceeds the monthly contribution ceiling of {ceiling}, so {base} is used.',
  'explain.sv.step.amount': '{base} × {rate} = {amount}',
  'explain.health.step.rate':
    'The general contribution rate is {total}. The employee pays half of it, that is {rate}.',
  'explain.healthAdditional.step.rate':
    'The additional contribution rate of your health insurer is {total}. The employee pays half of it, that is {rate}.',
  'explain.care.step.rate':
    'The contribution rate for care insurance is {total}. The employee pays half of it, that is {rate}.',
  'explain.care.step.rateSaxony':
    'The contribution rate for care insurance is {total}. In Saxony the employee pays {rate} and the employer {employerRate}, because Repentance and Prayer Day remained a public holiday there.',
  'explain.care.step.reduction': {
    one: 'Contribution reduction for children under 25: {perChild} for {count} child taken into account (from the second child, at most four reductions), {reduction} in total. The employee share is lowered accordingly.',
    other:
      'Contribution reduction for children under 25: {perChild} per child for {count} children taken into account (from the second child, at most four reductions), {reduction} in total. The employee share is lowered accordingly.',
  },
  'explain.care.step.reductionMidijob': {
    one: 'Minus contribution reduction for {count} child taken into account: {base} × {reduction} = {amount}. Employee share afterwards: {result}.',
    other:
      'Minus contribution reduction for {count} children taken into account: {base} × {reduction} = {amount}. Employee share afterwards: {result}.',
  },
  'explain.careSurcharge.step.rate':
    'Childless people pay a contribution surcharge of {rate} from their 23rd birthday. The employee bears it alone.',
  'explain.pension.step.rate':
    'The contribution rate for pension insurance is {total}. The employee pays half of it, that is {rate}.',
  'explain.unemployment.step.rate':
    'The contribution rate for unemployment insurance is {total}. The employee pays half of it, that is {rate}.',
  'explain.midijob.step.be':
    'Transition range: the contribution base for the total contribution and the surcharge is BE = F × G + (OG ÷ (OG − G) − G ÷ (OG − G) × F) × (AE − G). With AE = {gross}, G = {g}, OG = {og} and F = {f} this gives {be}.',
  'explain.midijob.step.beAn':
    'Transition range: the contribution base for the employee share is BE_AN = OG ÷ (OG − G) × (AE − G). With AE = {gross}, G = {g} and OG = {og} this gives {beAn}.',
  'explain.minijob.step.pensionRate':
    'Pension insurance rate {total} minus the employer flat rate {employer} = employee share of {rate} of the pay.',
  'explain.minijob.step.pensionExempt':
    'You are exempt from compulsory pension insurance. You pay no own share; the employer still pays the flat-rate contribution.',
  'explain.incomeTax.step.minijob':
    'In a mini-job the employee pays no wage tax: a flat-rate tax of {rate} paid by the employer is assumed.',

  'explain.incomeTax.step.annual':
    'Annual salary: monthly gross {monthly} × 12 = {annual} (assumption: the salary is the same in all twelve months).',
  'explain.incomeTax.step.allowance': 'Minus allowance from the tax deduction data (ELStAM): {monthly} × 12 = {annual}.',
  'explain.incomeTax.step.anp': 'Minus employee lump sum for income-related expenses ([de:Arbeitnehmer-Pauschbetrag]): {amount}.',
  'explain.incomeTax.step.sap': 'Minus lump sum for special expenses ([de:Sonderausgaben-Pauschbetrag]): {amount}.',
  'explain.incomeTax.step.efa': 'Minus relief amount for single parents (tax class II): {amount}.',
  'explain.incomeTax.step.vspPension':
    'Provision lump sum ([de:Vorsorgepauschale]), pension insurance part: {base} (annual salary, up to the contribution ceiling of {ceiling}) × {rate} = {amount}.',
  'explain.incomeTax.step.vspHealth':
    'Provision lump sum, health and care insurance part: {base} (annual salary, up to the contribution ceiling of {ceiling}) × (health insurance {kvRate} + care insurance {pvRate}) = {amount}.',
  'explain.incomeTax.step.vspPrivate':
    'Provision lump sum, private health and compulsory care insurance part: (monthly premiums {premium} − employer subsidy {subsidy}) × 12 = {amount}.',
  'explain.incomeTax.step.vspUnemployment':
    'Provision lump sum, unemployment insurance part: {base} × {rate} = {amount}.',
  'explain.incomeTax.step.vspCap':
    'The parts for unemployment, health and care insurance ({sum}) are capped at the maximum of {cap}: {result}.',
  'explain.incomeTax.step.vspTotal':
    'The provision lump sum is the higher of two amounts, each rounded up to whole euros: pension + health and care insurance = {a}, or pension + capped amount = {b}. Result: {result}.',
  'explain.incomeTax.step.vspTotalSimple': 'Provision lump sum in total (rounded up to whole euros): {result}.',
  'explain.incomeTax.step.taxableIncome':
    'Taxable income = {annual} − {deductions} (lump sums) − {vsp} (provision lump sum) = {zve}.',
  'explain.incomeTax.step.tariffBase':
    'For the income tax scale the taxable income {zve} is rounded down to whole euros: X = {x}.',
  'explain.incomeTax.step.tariffBaseSplitting':
    'Tax class III (income splitting): the taxable income {zve} is halved and rounded down to whole euros: X = {x}. The tax is doubled afterwards.',
  'explain.incomeTax.step.tariffZone0':
    'X = {x} does not exceed the basic allowance of {gfb}: the income tax is {result}.',
  'explain.incomeTax.step.tariffZone1':
    'Tax zone 1 (section 32a(1) no. 2 EStG): y = (X − {gfb}) ÷ 10,000 = {y}. Tax = ({a} × y + {b}) × y = {result} (rounded down to whole euros).',
  'explain.incomeTax.step.tariffZone2':
    'Tax zone 2 (section 32a(1) no. 3 EStG): z = (X − {offset}) ÷ 10,000 = {z}. Tax = ({a} × z + {b}) × z + {c} = {result} (rounded down to whole euros).',
  'explain.incomeTax.step.tariffZone3':
    'Tax zone 3 (section 32a(1) no. 4 EStG): tax = {rate} × X − {constant} = {result} (rounded down to whole euros).',
  'explain.incomeTax.step.tariffZone4':
    'Tax zone 4 (section 32a(1) no. 5 EStG): tax = {rate} × X − {constant} = {result} (rounded down to whole euros).',
  'explain.incomeTax.step.splittingDouble':
    'Income splitting: tax for X = {single}, doubled = {result}.',
  'explain.incomeTax.step.tariffV56Zone1':
    'Tax classes V and VI (section 39b(2) sentence 7 EStG), X = {x} up to {w1}: the tax is twice the difference between the income tax on 1.25 times and on 0.75 times X, but at least 14% of X: {result}.',
  'explain.incomeTax.step.tariffV56Zone2':
    'Tax classes V and VI (section 39b(2) sentence 7 EStG), X = {x} between {w1} and {w2}: the lower of two values applies – the tax from the difference method, or the tax for {w1} plus 42% of the amount above it: {result}.',
  'explain.incomeTax.step.tariffV56Zone3':
    'Tax classes V and VI (section 39b(2) sentence 7 EStG), X = {x} between {w2} and {w3}: tax for {w2} from the difference method plus 42% of the amount above it: {result}.',
  'explain.incomeTax.step.tariffV56Zone4':
    'Tax classes V and VI (section 39b(2) sentence 7 EStG), X = {x} above {w3}: tax for {w2} from the difference method, plus 42% of the amount up to {w3} and 45% of the amount above it: {result}.',
  'explain.incomeTax.step.factor':
    'Factor method (tax class IV): {tax} × factor {factor} = {result} (rounded down to whole euros).',
  'explain.incomeTax.step.annualTax': 'Annual wage tax: {result}.',
  'explain.incomeTax.step.monthlyTax': 'Monthly wage tax = {annual} ÷ 12, rounded down to whole cents: {result}.',
  'explain.incomeTax.step.childrenNote':
    'Child allowances ({count}) do not reduce the wage tax; they only affect the solidarity surcharge and church tax.',

  'explain.solidarity.step.base': 'The basis is the annual wage tax: {base}.',
  'explain.solidarity.step.baseChildren':
    'The basis is the annual wage tax after deducting the child allowances ({allowances} from the income): {base} (without child allowances: {tax}).',
  'explain.solidarity.step.belowLimit':
    '{base} does not exceed the exemption limit of {limit}: no solidarity surcharge is due.',
  'explain.solidarity.step.aboveLimit':
    'The exemption limit of {limit} is exceeded. Full surcharge: {base} × {rate} = {full}. Phase-in zone: ({base} − {limit}) × {mitigationRate} = {mitigation}. The lower value applies: {result}.',
  'explain.solidarity.step.monthly': 'Monthly share: {annual} ÷ 12, rounded down to whole cents: {result}.',

  'explain.churchTax.step.base':
    'Reference tax (annual wage tax, after child allowances if any): {annual}. Monthly share ({annual} ÷ 12, rounded down): {result}.',
  'explain.churchTax.step.amount': '{base} × {rate} ({state}) = {amount}, rounded down to whole cents.',

  'explain.pkv.step.premium':
    'Monthly premium for private basic health insurance as you entered it: {premium}. It is deducted in full from the net salary.',
  'explain.ppv.step.premium':
    'Monthly premium for private compulsory care insurance as you entered it: {premium}. It is deducted in full from the net salary.',
  'explain.employerSubsidy.step.health':
    'Health insurance: half of the premium {premium} = {half}, at most {cap} (contribution ceiling {ceiling} × {rate}, which equals the employer share in statutory health insurance with half the average additional contribution). Subsidy: {result}.',
  'explain.employerSubsidy.step.care':
    'Care insurance: half of the premium {premium} = {half}, at most {cap} (contribution ceiling {ceiling} × {rate}, the employer share in statutory care insurance). Subsidy: {result}.',
  'explain.employerSubsidy.step.total':
    'The tax-free employer subsidy amounts to {result} in total. It is added to the net salary.',

  'explain.net.step.sum': 'Net = gross {gross} − taxes {taxes} − social security {social} = {net}.',
  'explain.net.step.sumPrivate':
    'Net = gross {gross} − taxes {taxes} − social security {social} (including private premiums minus employer subsidy) = {net}.',

  // ------------------------------------------------------------ States
  'state.BW': 'Baden-Württemberg',
  'state.BY': 'Bavaria ([de:Bayern])',
  'state.BE': 'Berlin',
  'state.BB': 'Brandenburg',
  'state.HB': 'Bremen',
  'state.HH': 'Hamburg',
  'state.HE': 'Hesse ([de:Hessen])',
  'state.MV': 'Mecklenburg-Vorpommern',
  'state.NI': 'Lower Saxony ([de:Niedersachsen])',
  'state.NW': 'North Rhine-Westphalia ([de:Nordrhein-Westfalen])',
  'state.RP': 'Rhineland-Palatinate ([de:Rheinland-Pfalz])',
  'state.SL': 'Saarland',
  'state.SN': 'Saxony ([de:Sachsen])',
  'state.ST': 'Saxony-Anhalt ([de:Sachsen-Anhalt])',
  'state.SH': 'Schleswig-Holstein',
  'state.TH': 'Thuringia ([de:Thüringen])',

  // ------------------------------------------------------------ Sources
  'source.bmf-pap-2026.title':
    'Federal Ministry of Finance: programme flow charts for wage tax withholding 2026 (BMF letter of 12 Nov 2025)',
  'source.bmf-pap-2026-xml.title':
    'Federal Ministry of Finance / ITZBund: programme flow chart 2026 as XML pseudocode (wage and income tax calculator)',
  'source.bmf-vsp-2026.title':
    'BMF letter of 14 Aug 2025: provision lump sum in the wage tax withholding procedure from 2026',
  'source.estg-32a.title': 'Section 32a EStG – income tax scale',
  'source.estg-39b.title': 'Section 39b EStG – withholding of wage tax',
  'source.estg-9a.title': 'Section 9a EStG – lump sums for income-related expenses',
  'source.estg-10c.title': 'Section 10c EStG – lump sum for special expenses',
  'source.estg-24b.title': 'Section 24b EStG – relief amount for single parents',
  'source.estg-32.title': 'Section 32 EStG – children, child allowances',
  'source.estg-40a.title': 'Section 40a EStG – flat-rate wage tax in special cases (mini-jobs)',
  'source.estg-51a.title': 'Section 51a EStG – assessment and collection of surcharge taxes (church tax)',
  'source.solzg-3.title': 'Section 3 Solidarity Surcharge Act 1995 – assessment basis, exemption limit',
  'source.solzg-4.title': 'Section 4 Solidarity Surcharge Act 1995 – surcharge rate, phase-in zone',
  'source.kist-saetze.title': 'Free and Hanseatic City of Hamburg: calculation of church tax (rate 8% or 9%)',
  'source.kistg-bb.title': 'Brandenburg Church Tax Act (BbgKiStG)',
  'source.kistg-hb.title': 'Bremen Church Tax Act (KiStG), version of 23 August 2001',
  'source.kistg-nw.title': 'North Rhine-Westphalia Church Tax Act (KiStG), consolidated version of 29 Nov 2019',
  'source.svbezgrv-2026.title': 'Social Security Reference Values Ordinance 2026 (BGBl. 2025 I No. 278)',
  'source.sgb5-241.title': 'Section 241 SGB V – general contribution rate',
  'source.sgb5-242.title': 'Section 242 SGB V – additional contribution',
  'source.sgb5-242a.title': 'Section 242a SGB V – average additional contribution rate',
  'source.sgb5-249.title': 'Section 249 SGB V – bearing of contributions in compulsory employment',
  'source.sgb5-249b.title': 'Section 249b SGB V – employer contribution for marginal employment',
  'source.sgb5-257.title': 'Section 257 SGB V – contribution subsidies for employees (private health insurance)',
  'source.bmg-zusatzbeitrag-2026.title':
    'Federal Ministry of Health: statutory health insurance contribution rates, average additional contribution rate 2026',
  'source.sgb11-55.title': 'Section 55 SGB XI – contribution rate, reduction and surcharge',
  'source.sgb11-58.title': 'Section 58 SGB XI – bearing of contributions for employees in compulsory insurance',
  'source.sgb11-61.title': 'Section 61 SGB XI – contribution subsidies for employees (private care insurance)',
  'source.sgb6-158.title': 'Section 158 SGB VI – contribution rates',
  'source.sgb6-168.title': 'Section 168 SGB VI – bearing of contributions for employees',
  'source.sgb6-172.title': 'Section 172 SGB VI – employer contribution for marginal employment',
  'source.sgb3-341.title': 'Section 341 SGB III – unemployment insurance contribution rate',
  'source.sgb4-8.title': 'Section 8 SGB IV – marginal employment and marginal self-employment',
  'source.sgb4-20.title': 'Section 20 SGB IV – earnings subject to contributions, transition range',
  'source.bmas-faktor-f-2026.title':
    'Federal Ministry of Labour and Social Affairs: notice of the factor F for the transition range 2026 (BAnz AT 18.12.2025 B5)',
  'source.milov5.title': 'Fifth Minimum Wage Adjustment Ordinance (MiLoV 5)',
  'source.rs-uebergangsbereich.title':
    'Joint circular of the GKV-Spitzenverband, Deutsche Rentenversicherung Bund and Bundesagentur für Arbeit: employment in the transition range from 1 Jan 2023',
  'source.bvv-2.title': 'Section 2 Contribution Procedure Ordinance (BVV) – calculation of contributions',
};
