/**
 * Formular: Lesen, Validieren, abhängige Felder, Fehleranzeige und URL-Zustand.
 *
 * Der Zustand lebt ausschließlich im Formular und in der URL (kein Web-Storage).
 * Rohwerte sind Strings; Zahlen in URL-Parametern verwenden immer den Dezimalpunkt.
 */
import { DEFAULT_YEAR, getYear } from '../data/years.js';
import { STATE_CODES } from '../data/states.js';
import { LIMITS, validateInput } from '../engine/validate.js';
import { eur } from '../engine/units.js';
import { $, clear, h } from './dom.js';

const TEXT = ['b', 'f', 'zb', 'kvb', 'pvb', 'ku', 'frb'];
const SELECT = ['stkl', 'bl', 'kfb'];
const RADIO = ['p', 'kist', 'kv', 'k', 'a23'];
const CHECK = ['agz', 'rv', 'av', 'rvb'];

/** Eingabefeld-ID je Fehlerfeld der Engine. */
const FIELD_IDS = {
  gross: 'gross',
  factor: 'factor',
  additionalRate: 'additionalRate',
  kvPremium: 'kvPremium',
  pvPremium: 'pvPremium',
  childrenUnder25: 'childrenUnder25',
  monthlyTaxAllowance: 'allowance',
};

const DECIMAL_PARAM = /^\d{1,9}(\.\d{1,3})?$/;
/** Gültige Werte der URL-Parameter; alles andere wird ignoriert. */
const PARAM_RULES = {
  b: DECIMAL_PARAM, f: DECIMAL_PARAM, zb: DECIMAL_PARAM, kvb: DECIMAL_PARAM, pvb: DECIMAL_PARAM, frb: DECIMAL_PARAM,
  ku: /^\d{1,2}$/,
  p: /^[my]$/,
  stkl: /^[1-6]$/,
  kfb: /^([0-5](\.5)?|6)$/,
  kv: /^[gp]$/,
  bl: new RegExp(`^(${STATE_CODES.join('|')})$`),
  kist: /^[01]$/, k: /^[01]$/, a23: /^[01]$/, agz: /^[01]$/, rv: /^[01]$/, av: /^[01]$/, rvb: /^[01]$/,
};
const NUMERIC_PARAMS = new Set(['b', 'f', 'zb', 'kvb', 'pvb', 'frb']);

// ------------------------------------------------------------ Lesen/Schreiben

/** @param {HTMLFormElement} form */
export function readForm(form) {
  const raw = {};
  for (const name of [...TEXT, ...SELECT, ...RADIO]) raw[name] = form.elements[name].value.trim();
  for (const name of CHECK) raw[name] = form.elements[name].checked ? '1' : '0';
  return raw;
}

/** Schreibt Rohwerte (teilweise) ins Formular; Zahlen aus der URL werden lokalisiert angezeigt. */
export function writeForm(form, raw, i18n) {
  for (const [name, value] of Object.entries(raw)) {
    const field = form.elements[name];
    if (CHECK.includes(name)) field.checked = value === '1';
    else field.value = NUMERIC_PARAMS.has(name) ? value.replace('.', i18n.decimal) : value;
  }
}

/** Gültige URL-Parameter → Rohwerte. */
export function fromQuery(search) {
  const raw = {};
  for (const [name, value] of new URLSearchParams(search)) {
    if (name in PARAM_RULES && PARAM_RULES[name].test(value)) raw[name] = value;
  }
  return raw;
}

// ------------------------------------------------------- Abhängige Felder

const minijobLimit = () => getYear(DEFAULT_YEAR).data.minijob.limitMonthly.value;

/** Welche Felder zum aktuellen Zustand gehören. */
export function relevance(raw, i18n) {
  const gross = i18n.parseDecimal(raw.b);
  const monthlyCents = Number.isNaN(gross) ? NaN : Math.round((raw.p === 'y' ? gross / 12 : gross) * 100);
  const statutory = raw.kv === 'g';
  return {
    factor: raw.stkl === '4',
    childAllowances: !['5', '6'].includes(raw.stkl),
    statutory,
    care: statutory,
    childrenCount: statutory && raw.k === '1',
    age: statutory && raw.k === '0',
    minijob: monthlyCents > 0 && monthlyCents <= minijobLimit(),
  };
}

/** Blendet abhängige Felder per `hidden` bzw. `disabled` ein und aus. */
export function applyDependencies(form, raw, i18n) {
  const rel = relevance(raw, i18n);
  $('factor-field').hidden = !rel.factor;
  form.elements.kfb.disabled = !rel.childAllowances;
  $('kfb-note').hidden = rel.childAllowances;
  $('health-statutory').hidden = !rel.statutory;
  $('health-private').hidden = rel.statutory;
  $('care-group').hidden = !rel.care;
  $('children-field').hidden = !rel.childrenCount;
  $('age-field').hidden = !rel.age;
  $('minijob-field').hidden = !rel.minijob;
  return rel;
}

// ------------------------------------------------------------- Validierung

const number = (i18n, text) => (text === '' ? NaN : i18n.parseDecimal(text));

/**
 * Wandelt Rohwerte in ein CalcInput um.
 * @returns {{input: object|null, errors: {field: string, code: string}[], query: URLSearchParams}}
 */
export function parseForm(raw, i18n, rel) {
  const errors = [];
  const fail = (field, code) => errors.push({ field: FIELD_IDS[field] ?? field, code });
  const value = (field, name, requiredCode, invalidCode) => {
    const parsed = number(i18n, raw[name]);
    if (Number.isNaN(parsed)) fail(field, raw[name] === '' ? requiredCode : invalidCode);
    return parsed;
  };

  const gross = value('gross', 'b', 'gross.required', 'gross.invalid');
  const input = {
    year: DEFAULT_YEAR,
    gross,
    period: raw.p === 'y' ? 'year' : 'month',
    taxClass: Number(raw.stkl),
    state: raw.bl,
    churchTax: raw.kist === '1',
    childAllowances: rel.childAllowances ? Number(raw.kfb) : 0,
    pensionInsured: raw.rv === '1',
    unemploymentInsured: raw.av === '1',
    minijobRvExempt: rel.minijob && raw.rvb === '1',
    monthlyTaxAllowance: 0,
    care: { hasChildren: false, childrenUnder25: 0, age23OrOlder: true },
  };
  if (raw.frb !== '') input.monthlyTaxAllowance = value('monthlyTaxAllowance', 'frb', '', 'allowance.invalid');
  if (rel.factor && raw.f !== '') input.factor = value('factor', 'f', '', 'factor.invalid');

  if (rel.statutory) {
    input.health = { type: 'statutory', additionalRate: value('additionalRate', 'zb', 'additionalRate.required', 'additionalRate.invalid') };
    input.care = {
      hasChildren: raw.k === '1',
      childrenUnder25: 0,
      age23OrOlder: raw.a23 !== '0',
    };
    if (rel.childrenCount) {
      const children = value('childrenUnder25', 'ku', 'children.required', 'children.invalid');
      input.care.childrenUnder25 = children;
    }
  } else {
    input.health = {
      type: 'private',
      kvPremium: value('kvPremium', 'kvb', 'premium.required', 'premium.invalid'),
      pvPremium: value('pvPremium', 'pvb', 'premium.required', 'premium.invalid'),
      employerSubsidy: raw.agz === '1',
    };
  }

  if (!errors.length) {
    for (const error of validateInput(input)) {
      if (!errors.some((e) => e.field === (FIELD_IDS[error.field] ?? error.field))) fail(error.field, error.code);
    }
  }
  return { input: errors.length ? null : input, errors };
}

/** Kompakte, sprachunabhängige URL-Parameter für ein gültiges CalcInput. */
export function toQuery(raw, input, rel) {
  const q = new URLSearchParams();
  const set = (name, value) => q.set(name, String(value));
  set('b', input.gross);
  set('p', raw.p);
  set('stkl', raw.stkl);
  set('bl', raw.bl);
  set('kist', raw.kist);
  set('kfb', rel.childAllowances ? raw.kfb : 0);
  set('kv', raw.kv);
  if (rel.statutory) {
    set('zb', input.health.additionalRate);
    set('k', raw.k);
    if (rel.childrenCount) set('ku', input.care.childrenUnder25);
    else set('a23', raw.a23);
  } else {
    set('kvb', input.health.kvPremium);
    set('pvb', input.health.pvPremium);
    set('agz', raw.agz);
  }
  if (raw.rv === '0') set('rv', 0);
  if (raw.av === '0') set('av', 0);
  if (input.monthlyTaxAllowance > 0) set('frb', input.monthlyTaxAllowance);
  if (input.factor !== undefined) set('f', input.factor);
  if (input.minijobRvExempt) set('rvb', 1);
  return q;
}

// -------------------------------------------------------------- Fehleranzeige

const errorMessage = (i18n, code) => {
  const max = { 'gross.range': LIMITS.maxGross, 'allowance.range': LIMITS.maxGross, 'premium.range': LIMITS.maxPremium }[code];
  const key = `err.${code}`;
  const message = i18n.t(key, max ? { max: eur(max * 100) } : {});
  return message === key ? i18n.t('err.generic') : message;
};

export function clearErrors(form) {
  for (const el of form.querySelectorAll('[aria-invalid]')) el.removeAttribute('aria-invalid');
  for (const el of form.querySelectorAll('.error')) {
    el.hidden = true;
    el.textContent = '';
  }
  $('error-summary').hidden = true;
  clear($('error-summary-list'));
}

/** Zeigt Fehler am Feld und – bei `summary` – in der Fehlerzusammenfassung (WCAG 3.3.1, 3.3.3). */
export function showErrors(form, errors, i18n, { summary }) {
  clearErrors(form);
  const items = [];
  for (const { field, code } of errors) {
    const input = $(field);
    const message = errorMessage(i18n, code);
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      const slot = $(`${field}-error`);
      if (slot) {
        slot.textContent = message;
        slot.hidden = false;
      }
    }
    const label = input ? document.querySelector(`label[for="${field}"]`)?.textContent.trim() : '';
    items.push(
      h('li', {}, h('a', { href: `#${field}`, 'data-field': field }, i18n.t('js.errors.field', { label, message }))),
    );
  }
  if (summary && items.length) {
    $('error-summary-list').append(...items);
    $('error-summary').hidden = false;
    $('error-summary').focus();
  }
}

/** Fehlerlinks springen zum Feld. */
export function wireErrorSummary() {
  $('error-summary-list').addEventListener('click', (event) => {
    const link = event.target.closest('a[data-field]');
    if (!link) return;
    event.preventDefault();
    $(link.dataset.field)?.focus();
  });
}
