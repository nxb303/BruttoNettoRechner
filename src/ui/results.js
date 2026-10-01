/** Ergebnisanzeige: Nettozahlen, Balken, Legende, Hinweise und Tabellen. */
import { $, clear, h, richText } from './dom.js';

const MINUS = '−';
const SIGNS = { tax: 'deduct', social: 'deduct', private: 'deduct', subsidy: 'add' };

/** Betragszelle; Vorzeichen als echtes Minuszeichen plus unsichtbares Wort für Screenreader. */
function amountCell(cents, kind, label, i18n) {
  const attrs = { class: 'num', role: 'cell', 'data-label': label };
  const text = i18n.formatEur(cents);
  if (!kind || cents === 0) return h('td', attrs, text);
  const sign = kind === 'deduct' ? MINUS : '+';
  return h('td', attrs, h('span', { class: 'visually-hidden' }, `${i18n.t(`result.${kind}`)} `), `${sign}${text}`);
}

function row(label, monthly, yearly, i18n, { kind = null, className = '', explainId = null } = {}) {
  const name = explainId
    ? h('a', { href: `#explain-${explainId}`, 'data-explain': explainId }, richText(label))
    : richText(label);
  // Explizite Rollen erhalten die Tabellensemantik auch dann, wenn CSS die Zeilen auf schmalen Bildschirmen umbaut.
  return h(
    'tr',
    { class: className || false, role: 'row' },
    h('th', { scope: 'row', role: 'rowheader' }, name),
    amountCell(monthly, kind, i18n.t('result.table.month'), i18n),
    amountCell(yearly, kind, i18n.t('result.table.year'), i18n),
  );
}

/** Anteile in Prozent mit einer Nachkommastelle; Netto ergänzt auf 100 %. */
function shares(totals) {
  const gross = totals.gross.monthly;
  const part = (cents) => Math.round((cents / gross) * 1000) / 10;
  const taxes = part(totals.taxes.monthly);
  const social = part(totals.social.monthly);
  return { taxes, social, net: Math.round((100 - taxes - social) * 10) / 10 };
}

function renderBar(result, i18n) {
  const { totals } = result;
  const share = shares(totals);
  const parts = [
    ['net', totals.net.monthly, share.net],
    ['taxes', totals.taxes.monthly, share.taxes],
    ['social', totals.social.monthly, share.social],
  ];
  const labels = { net: i18n.t('result.net'), taxes: i18n.t('result.legend.taxes'), social: i18n.t('result.legend.social') };
  for (const [id, , percent] of parts) {
    const seg = $(`bar-${id}`);
    seg.style.width = `${percent}%`;
    seg.hidden = percent === 0;
  }
  $('bar').setAttribute(
    'aria-label',
    i18n.t('result.bar.label', {
      net: { eur: totals.net.monthly },
      netShare: { pct: share.net },
      taxes: { eur: totals.taxes.monthly },
      taxesShare: { pct: share.taxes },
      social: { eur: totals.social.monthly },
      socialShare: { pct: share.social },
    }),
  );
  const legend = $('legend');
  clear(legend);
  legend.append(
    ...parts.map(([id, cents, percent]) =>
      h(
        'li',
        {},
        h('span', { class: `swatch swatch-${id}`, 'aria-hidden': 'true' }),
        h('span', {}, i18n.t('result.legend.entry', { label: labels[id], amount: { eur: cents }, share: { pct: percent } })),
      ),
    ),
  );
}

function renderRows(result, i18n) {
  const { items, totals } = result;
  const rows = [row(i18n.tr('result.gross'), totals.gross.monthly, totals.gross.yearly, i18n)];
  const group = (groups, subtotalKey, subtotal) => {
    const members = items.filter((i) => groups.includes(i.group));
    for (const i of members) {
      rows.push(row(i18n.tr(`item.${i.id}`), i.monthly, i.yearly, i18n, { kind: SIGNS[i.group], explainId: i.id }));
    }
    if (members.length > 1) {
      rows.push(row(i18n.tr(subtotalKey), subtotal.monthly, subtotal.yearly, i18n, { kind: 'deduct', className: 'subtotal' }));
    }
  };
  group(['tax'], 'result.taxes.total', totals.taxes);
  group(['social', 'private', 'subsidy'], 'result.social.total', totals.social);
  rows.push(row(i18n.tr('result.net.total'), totals.net.monthly, totals.net.yearly, i18n, { className: 'total', explainId: 'net' }));
  const body = $('result-rows');
  clear(body);
  body.append(...rows);
}

function renderEmployer(result, i18n) {
  const { employer, totals } = result;
  const rows = [
    row(i18n.tr('result.gross'), totals.gross.monthly, totals.gross.yearly, i18n),
    ...employer.items.map((e) => row(i18n.tr(`item.employer.${e.id}`), e.monthly, e.yearly, i18n, { kind: 'add' })),
    row(i18n.tr('result.employer.totalCost'), employer.total.monthly, employer.total.yearly, i18n, { className: 'total' }),
  ];
  const body = $('employer-rows');
  clear(body);
  body.append(...rows);
}

function renderNotes(result, i18n) {
  const list = $('warnings');
  clear(list);
  list.append(...result.warnings.map((w) => h('li', {}, richText(i18n.tr(w.key, w.values)))));
  list.hidden = result.warnings.length === 0;
}

/** Zeigt das Ergebnis; liefert die Kurzfassung für die Live-Region. */
export function renderResult(result, i18n) {
  $('result-empty').hidden = true;
  $('result-content').hidden = false;
  $('employment').replaceChildren(...richText(i18n.tr(`result.employment.${result.employment}`)));
  $('net-month').textContent = i18n.formatEur(result.totals.net.monthly);
  $('net-year').textContent = i18n.formatEur(result.totals.net.yearly);
  renderBar(result, i18n);
  renderNotes(result, i18n);
  renderRows(result, i18n);
  renderEmployer(result, i18n);
  return i18n.t('js.live.result', { monthly: { eur: result.totals.net.monthly }, yearly: { eur: result.totals.net.yearly } });
}

/** Zurück in den Leerzustand (optional mit Hinweistext). */
export function resetResult(message = null) {
  $('result-content').hidden = true;
  $('explain').hidden = true;
  const empty = $('result-empty');
  empty.dataset.default ??= empty.textContent;
  empty.hidden = false;
  empty.textContent = message ?? empty.dataset.default;
}
