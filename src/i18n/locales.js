/**
 * Registry der Sprachen. Eine neue Sprache braucht genau einen Eintrag hier und
 * eine Wörterbuchdatei `<code>.js` (siehe docs/ADDING-A-LANGUAGE.md).
 *
 * - `code`: BCP-47-Sprachcode (Wert des `lang`-Attributs, Name der Wörterbuchdatei)
 * - `intl`: Locale für Zahlenformate (Standard: `code`)
 * - `dir`: Schreibrichtung (`ltr` | `rtl`)
 * - `path`: Pfad der Startseite im Deployment (mit Slash am Ende)
 * - `default`: Sprache von `/` und Fallback für fehlende Schlüssel
 */
export const LOCALES = Object.freeze([
  { code: 'de', name: 'Deutsch', intl: 'de-DE', dir: 'ltr', path: '/', default: true },
  { code: 'en', name: 'English', intl: 'en-GB', dir: 'ltr', path: '/en/' },
  { code: 'vi', name: 'Tiếng Việt', intl: 'vi-VN', dir: 'ltr', path: '/vi/' },
]);

export const DEFAULT_LOCALE = LOCALES.find((l) => l.default);

/**
 * Schlüssel-Präfixe, die zur Laufzeit im Browser gebraucht werden. Alles andere
 * (statische Seitentexte) wird nur beim Vorrendern verwendet und nicht ins
 * JavaScript-Bundle aufgenommen.
 */
export const RUNTIME_PREFIXES = Object.freeze(['js.', 'result.', 'item.', 'explain.', 'source.', 'warn.', 'err.', 'state.']);

/** @param {string} key */
export const isRuntimeKey = (key) => RUNTIME_PREFIXES.some((prefix) => key.startsWith(prefix));
