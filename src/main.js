/**
 * Einstieg im Browser: verbindet Formular, Engine und Ergebnisanzeige.
 * Zustand liegt nur im Formular und in der URL (kein Cookie, kein Web-Storage).
 */
import { locale, dictionary } from 'virtual:locale';
import { createI18n } from './i18n/index.js';
import { calculate } from './engine/calculate.js';
import { $ } from './ui/dom.js';
import {
  applyDependencies, clearErrors, fromQuery, parseForm, readForm, showErrors, toQuery, wireErrorSummary, writeForm,
} from './ui/form.js';
import { renderResult, resetResult } from './ui/results.js';
import { openExplanation, renderExplanation, wirePrint } from './ui/explain.js';

const i18n = createI18n({ code: locale.code, intl: locale.intl, dictionary });
const form = $('calc-form');
const AUTO_DELAY_MS = 250;

/** Nach dem ersten Rechnen (oder Fehler) wird bei jeder Änderung automatisch neu gerechnet. */
let active = false;
let timer = 0;
let lastAnnouncement = '';

function syncUrl(query) {
  const search = query ? `?${query}` : '';
  history.replaceState(null, '', `${location.pathname}${search}${location.hash}`);
  for (const link of document.querySelectorAll('.lang-nav a')) link.search = search;
}

/**
 * Liest das Formular, rechnet und zeigt das Ergebnis.
 * @param {{focus: boolean}} options `focus`: bei ausdrücklichem Absenden Fokus auf Fehlerübersicht bzw. Ergebnis
 */
function run({ focus }) {
  const raw = readForm(form);
  const rel = applyDependencies(form, raw, i18n);
  const { input, errors } = parseForm(raw, i18n, rel);
  active = true;
  if (errors.length) {
    showErrors(form, errors, i18n, { summary: focus });
    resetResult(i18n.t('js.invalidResult'));
    $('live').textContent = focus ? '' : i18n.t('js.live.invalid');
    syncUrl('');
    return;
  }
  clearErrors(form);
  const result = calculate(input);
  const announcement = renderResult(result, i18n);
  renderExplanation(result, i18n);
  syncUrl(toQuery(raw, input, rel));
  if (announcement !== lastAnnouncement || focus) $('live').textContent = announcement;
  lastAnnouncement = announcement;
  if (focus) $('result-title').focus();
}

function onChange() {
  const raw = readForm(form);
  applyDependencies(form, raw, i18n);
  if (!active) return;
  clearTimeout(timer);
  timer = setTimeout(() => run({ focus: false }), AUTO_DELAY_MS);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimeout(timer);
  run({ focus: true });
});
form.addEventListener('input', onChange);
form.addEventListener('change', onChange);
form.addEventListener('reset', () => {
  // Das Zurücksetzen der Felder läuft nativ; danach den restlichen Zustand angleichen.
  setTimeout(() => {
    clearTimeout(timer);
    active = false;
    lastAnnouncement = '';
    clearErrors(form);
    applyDependencies(form, readForm(form), i18n);
    resetResult();
    $('live').textContent = '';
    syncUrl('');
  });
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-explain]');
  if (link && openExplanation(link.dataset.explain)) event.preventDefault();
});

wireErrorSummary();
wirePrint();

// Start: Formular aus der URL vorbelegen und automatisch rechnen
const initial = fromQuery(location.search);
if (Object.keys(initial).length) writeForm(form, initial, i18n);
applyDependencies(form, readForm(form), i18n);
if (initial.b !== undefined) run({ focus: false });
