/**
 * Übersetzung und Zahlenformate. Reine Funktionen ohne DOM-Zugriff, daher
 * auch im Build (Vorrendern) und in Tests verwendbar.
 *
 * Platzhalter im Wörterbuch: `{name}`. Werte der Engine sind typisiert
 * (`{eur: cents}`, `{pct: 7.3}`, `{num: 0.912, digits: 3}`, `{state: 'NW'}`, `{date: '2026-10-01'}`).
 * Pluralformen: Wörterbucheintrag als Objekt `{ one, other, … }` und Parameter `count`.
 *
 * Mini-Markup für fremdsprachige Fachbegriffe: `[de:Lohnsteuer]` markiert Text, der als
 * `lang="de"` ausgezeichnet werden soll. `tr()` liefert den Rohtext mit Markup (für
 * `richText` in dom.js bzw. beim Vorrendern), `t()` den reinen Text.
 */

export const LANG_MARKUP = /\[(\w+):([^\]]+)\]/g;
const stripMarkup = (text) => text.replace(LANG_MARKUP, '$2');

/** @param {{code: string, intl?: string, dictionary: Record<string, string|object>, strict?: boolean}} options */
export function createI18n({ code, intl = code, dictionary, strict = false }) {
  const number = new Intl.NumberFormat(intl, { maximumFractionDigits: 6 });
  const money = new Intl.NumberFormat(intl, { style: 'currency', currency: 'EUR' });
  const percent = new Intl.NumberFormat(intl, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 4 });
  const plural = new Intl.PluralRules(intl);
  const fixed = new Map();

  const fixedFormat = (digits) => {
    if (!fixed.has(digits)) {
      fixed.set(digits, new Intl.NumberFormat(intl, { minimumFractionDigits: digits, maximumFractionDigits: digits }));
    }
    return fixed.get(digits);
  };

  /** Euro-Betrag aus ganzen Cent. */
  const formatEur = (cents) => money.format(cents / 100);
  /** Prozentwert (7,3 für 7,3 %). */
  const formatPct = (value) => percent.format(value / 100);
  const formatNumber = (value, digits) => (digits === undefined ? number : fixedFormat(digits)).format(value);

  const date = new Intl.DateTimeFormat(intl, { dateStyle: 'long', timeZone: 'UTC' });

  /** Wie `t`, aber mit Sprach-Markup im Ergebnis. */
  function tr(key, params = {}) {
    let entry = dictionary[key];
    if (entry === undefined) {
      if (strict) throw new Error(`Fehlender Übersetzungsschlüssel: ${key}`);
      return key;
    }
    if (typeof entry === 'object') entry = entry[plural.select(Number(params.count))] ?? entry.other;
    return entry.replace(/\{(\w+)\}/g, (match, name) => {
      if (!(name in params)) {
        if (strict) throw new Error(`Fehlender Parameter {${name}} für ${key}`);
        return match;
      }
      return formatValue(params[name]);
    });
  }

  const t = (key, params) => stripMarkup(tr(key, params));

  function formatValue(value) {
    if (value === null || typeof value !== 'object') {
      return typeof value === 'number' ? number.format(value) : String(value);
    }
    if ('eur' in value) return formatEur(value.eur);
    if ('pct' in value) return formatPct(value.pct);
    if ('num' in value) return formatNumber(value.num, value.digits);
    if ('date' in value) return date.format(new Date(`${value.date}T00:00:00Z`));
    if ('state' in value) return t(`state.${value.state}`);
    throw new TypeError(`Unbekannter Wertetyp: ${JSON.stringify(value)}`);
  }

  /** Dezimaltrenn- und Gruppenzeichen der Sprache. */
  const parts = new Intl.NumberFormat(intl).formatToParts(1234567.5);
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.';
  const group = parts.find((p) => p.type === 'group')?.value ?? ',';

  /**
   * Liest eine lokalisierte Zahl („3.500,50“ bzw. „3,500.50“; Leerzeichen und € erlaubt).
   * @returns {number} NaN bei ungültiger Eingabe
   */
  function parseDecimal(text) {
    const stripped = String(text).replace(/[\s\u00a0\u202f€'’]|EUR/gi, '');
    const clean = /^[.,]/.test(stripped) ? `0${stripped}` : stripped; // „,5“ → „0,5“
    if (!/^\d[\d.,]*$/.test(clean)) return NaN;
    const lastDecimal = clean.lastIndexOf(decimal);
    const lastGroup = clean.lastIndexOf(group);
    let normalized = '';
    if (lastDecimal >= 0 && lastGroup >= 0) {
      // Beide Zeichen: das zuletzt stehende ist das Dezimalzeichen, das andere trennt Tausender.
      const integer = clean.slice(0, lastDecimal);
      if (lastDecimal < lastGroup || integer.includes(decimal)) return NaN;
      normalized = `${integer.split(group).join('')}.${clean.slice(lastDecimal + 1)}`;
    } else if (lastDecimal >= 0) {
      if (clean.indexOf(decimal) !== lastDecimal) return NaN;
      normalized = clean.replace(decimal, '.');
    } else if (lastGroup >= 0) {
      // „3.500“ ist ein Tausenderpunkt; „3,5“ in der Sprache mit Dezimalpunkt ein Dezimalkomma.
      const groups = clean.split(group);
      if (groups.slice(1).every((g) => g.length === 3)) normalized = groups.join('');
      else if (groups.length === 2) normalized = `${groups[0]}.${groups[1]}`;
    } else {
      normalized = clean;
    }
    return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
  }

  return { code, intl, t, tr, formatEur, formatPct, formatNumber, formatValue, parseDecimal, decimal, group };
}
