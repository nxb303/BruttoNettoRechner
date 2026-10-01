/** Rechenweg je Posten mit Quellenangaben und Quellenverzeichnis. */
import { SOURCES } from '../data/sources.js';
import { $, clear, h, richText } from './dom.js';

function sourceLink(id, i18n) {
  const source = SOURCES[id];
  return h(
    'a',
    { href: source.url, target: '_blank', rel: 'noopener noreferrer' },
    source.label,
    h('span', { class: 'visually-hidden' }, ` ${i18n.t('result.sources.external')}`),
  );
}

const citeFor = (ids, i18n) =>
  ids.length
    ? h('cite', {}, `${i18n.t('result.sources.cite', { count: ids.length })} `, ids.map((id) => sourceLink(id, i18n)))
    : null;

function explainItem(id, title, monthlyCents, explanation, i18n) {
  const shown = new Set(explanation.steps.flatMap((s) => s.sources ?? []));
  const rest = explanation.sources.filter((s) => !shown.has(s));
  return h(
    'details',
    { class: 'explain-item', id: `explain-${id}` },
    h(
      'summary',
      {},
      h('span', {}, richText(title)),
      h('span', { class: 'amount' }, `${i18n.formatEur(monthlyCents)} ${i18n.t('result.perMonth')}`),
    ),
    h(
      'ol',
      { class: 'steps' },
      explanation.steps.map((step) =>
        h('li', {}, richText(i18n.tr(step.key, step.values)), citeFor(step.sources ?? [], i18n)),
      ),
      rest.length ? h('li', { class: 'steps-sources' }, citeFor(rest, i18n)) : null,
    ),
  );
}

/** Quellen-IDs in der Reihenfolge ihres ersten Auftretens. */
function usedSources(result) {
  const ids = new Set();
  const collect = (explanation) => {
    for (const step of explanation.steps) for (const id of step.sources ?? []) ids.add(id);
    for (const id of explanation.sources) ids.add(id);
  };
  for (const item of result.items) collect(item.explanation);
  collect(result.netExplanation);
  return [...ids];
}

export function renderExplanation(result, i18n) {
  const container = $('explain-items');
  clear(container);
  container.append(
    ...result.items.map((item) =>
      explainItem(item.id, i18n.tr(`item.${item.id}`), item.monthly, item.explanation, i18n),
    ),
    explainItem('net', i18n.tr('item.net'), result.totals.net.monthly, result.netExplanation, i18n),
  );

  const list = $('sources-list');
  clear(list);
  list.append(
    ...usedSources(result).map((id) => {
      const source = SOURCES[id];
      const params = { publisher: source.publisher, date: { date: source.date }, accessed: { date: source.accessed } };
      const meta = i18n.t(source.date ? 'result.sources.meta' : 'result.sources.metaNoDate', params);
      return h('li', {}, sourceLink(id, i18n), ` – ${i18n.t(`source.${id}.title`)}`, h('span', { class: 'meta' }, meta));
    }),
  );
  $('explain').hidden = false;
}

/** Öffnet den Rechenweg eines Postens und setzt den Fokus auf dessen Überschrift. */
export function openExplanation(id) {
  const details = $(`explain-${id}`);
  if (!details) return false;
  details.open = true;
  details.scrollIntoView({ block: 'start' });
  details.querySelector('summary').focus();
  return true;
}

/** Vor dem Drucken alle Rechenwege aufklappen, danach den alten Zustand wiederherstellen. */
export function wirePrint() {
  let before = [];
  window.addEventListener('beforeprint', () => {
    const all = [...document.querySelectorAll('details')];
    before = all.map((d) => [d, d.open]);
    for (const d of all) d.open = true;
  });
  window.addEventListener('afterprint', () => {
    for (const [d, open] of before) d.open = open;
    before = [];
  });
  $('print').addEventListener('click', () => window.print());
}
