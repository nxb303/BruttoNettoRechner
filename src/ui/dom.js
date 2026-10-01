/**
 * Kleine DOM-Helfer. Es gibt bewusst kein `innerHTML`: Alle Texte (auch aus
 * Wörterbuch und Eingaben) gelangen ausschließlich als Textknoten ins Dokument.
 */
import { LANG_MARKUP } from '../i18n/index.js';

/** @param {string} id */
export const $ = (id) => document.getElementById(id);

/**
 * Erzeugt ein Element. `attrs`: `false`/`null`/`undefined` lässt das Attribut weg, `true` setzt ein leeres.
 * Kinder: Strings (Textknoten), Nodes oder verschachtelte Arrays.
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) continue;
    el.setAttribute(name, value === true ? '' : value);
  }
  el.append(...children.flat(Infinity).filter((c) => c !== false && c !== null && c !== undefined));
  return el;
}

/** Entfernt alle Kindknoten. */
export const clear = (el) => el.replaceChildren();

/**
 * Wandelt Wörterbuchtext mit Sprach-Markup (`[de:Lohnsteuer]`) in Knoten um:
 * markierte Teile werden `<span lang="de">`.
 * @param {string} raw
 */
export function richText(raw) {
  const nodes = [];
  let last = 0;
  for (const m of raw.matchAll(LANG_MARKUP)) {
    if (m.index > last) nodes.push(raw.slice(last, m.index));
    nodes.push(h('span', { lang: m[1] }, m[2]));
    last = m.index + m[0].length;
  }
  if (last < raw.length) nodes.push(raw.slice(last));
  return nodes;
}
