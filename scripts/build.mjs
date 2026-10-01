#!/usr/bin/env node
/**
 * Baut die statische Website nach dist/:
 *  1. JavaScript je Sprache bündeln (esbuild, minifiziert, Content-Hash im Dateinamen),
 *     jedes Bundle enthält nur das eigene Wörterbuch (Laufzeit-Schlüssel, Fallback auf Deutsch);
 *  2. CSS minifizieren und inline in jede Seite einsetzen;
 *  3. Seiten je Sprache vorrendern (Startseite, Impressum, Datenschutz) samt 404, robots.txt,
 *     sitemap.xml und Favicon;
 *  4. Content-Security-Policy per <meta> mit dem Hash des Inline-CSS.
 *
 * Umgebungsvariablen: BASE_PATH (Standard "/", z. B. "/repo/" bei GitHub-Pages-Projektseiten),
 * SITE_URL (Ursprung für canonical/hreflang/sitemap, z. B. "https://example.org").
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as bundle, transform } from 'esbuild';
import { LOCALES, DEFAULT_LOCALE, isRuntimeKey } from '../src/i18n/locales.js';
import { createI18n, LANG_MARKUP } from '../src/i18n/index.js';
import { DEFAULT_YEAR, SUPPORTED_YEARS, getYear } from '../src/data/years.js';
import { STATES } from '../src/data/states.js';
import { eur, pct } from '../src/engine/units.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const normalizeBase = (base) => `/${base.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
const BASE = normalizeBase(process.env.BASE_PATH ?? '/');
/** Nur der Ursprung (Schema + Host): Der Pfad kommt aus BASE_PATH. */
const SITE_URL = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : '';

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
/** Wörterbuchtext mit Sprach-Markup `[de:Text]` → HTML mit <span lang="de">. */
function toHtml(raw) {
  let out = '';
  let last = 0;
  for (const m of raw.matchAll(LANG_MARKUP)) {
    out += escapeHtml(raw.slice(last, m.index)) + `<span lang="${m[1]}">${escapeHtml(m[2])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(raw.slice(last));
}

const sha256 = (data, encoding = 'hex') => createHash('sha256').update(data).digest(encoding);
const write = (relative, content) => {
  const file = join(DIST, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

async function loadDictionary(code) {
  return (await import(pathToFileURL(join(SRC, 'i18n', `${code}.js`)))).default;
}

// ------------------------------------------------------------------ JavaScript

/** Esbuild-Plugin: `virtual:locale` liefert Sprache und Laufzeit-Wörterbuch (mit Fallback auf Deutsch). */
function localePlugin(locale, dictionary) {
  const runtime = Object.fromEntries(Object.entries(dictionary).filter(([key]) => isRuntimeKey(key)));
  const contents = `export const locale = ${JSON.stringify({ code: locale.code, intl: locale.intl ?? locale.code, dir: locale.dir })};\nexport const dictionary = ${JSON.stringify(runtime)};`;
  return {
    name: 'locale',
    setup(build) {
      build.onResolve({ filter: /^virtual:locale$/ }, () => ({ path: 'locale', namespace: 'virtual-locale' }));
      build.onLoad({ filter: /.*/, namespace: 'virtual-locale' }, () => ({ contents, loader: 'js' }));
    },
  };
}

async function buildScript(locale, dictionary) {
  const result = await bundle({
    entryPoints: [{ in: join(SRC, 'main.js'), out: `app.${locale.code}` }],
    entryNames: '[name].[hash]',
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'es2020',
    legalComments: 'none',
    write: false,
    outdir: join(DIST, 'assets'),
    plugins: [localePlugin(locale, dictionary)],
    logLevel: 'warning',
  });
  const [file] = result.outputFiles;
  const name = file.path.split('/').pop();
  write(`assets/${name}`, file.contents);
  return `assets/${name}`;
}

// ------------------------------------------------------------------ Seiten

const href = (locale, slug = '') => `${BASE}${locale.path.slice(1)}${slug ? `${slug}/` : ''}`;
const absolute = (path) => (SITE_URL ? `${SITE_URL}${path}` : path);

function makeContext(locale, dictionaries) {
  const dictionary = { ...dictionaries[DEFAULT_LOCALE.code], ...dictionaries[locale.code] };
  const i18n = createI18n({ code: locale.code, intl: locale.intl, dictionary, strict: true });
  const { data } = getYear(DEFAULT_YEAR);
  const globals = {
    year: String(DEFAULT_YEAR),
    dataAsOf: { date: data.dataAsOf },
    minijobLimit: eur(data.minijob.limitMonthly.value),
    average: pct(data.health.averageAdditionalRate.value),
  };
  return { locale, i18n, dictionary, globals, data };
}

const slugs = (ctx) => ({ legal: ctx.i18n.t('page.legal.slug'), privacy: ctx.i18n.t('page.privacy.slug') });

/** Optionen für die Auswahlfelder. */
function options(ctx) {
  const { i18n, locale, data } = ctx;
  const collator = new Intl.Collator(locale.intl ?? locale.code, { sensitivity: 'base' });
  const states = STATES.map((s) => ({ code: s.code, name: i18n.t(`state.${s.code}`) })).sort((a, b) =>
    collator.compare(a.name, b.name),
  );
  const option = (value, label, selected) =>
    `<option value="${escapeHtml(value)}"${selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
  const allowances = Array.from({ length: 13 }, (_, i) => i / 2);
  return {
    stateOptions: states.map((s) => option(s.code, s.name, s.code === 'NW')).join('\n'),
    taxClassOptions: [1, 2, 3, 4, 5, 6].map((n) => option(n, i18n.t(`form.taxClass.${n}`), n === 1)).join('\n'),
    childAllowanceOptions: allowances.map((v) => option(v, i18n.formatNumber(v), v === 0)).join('\n'),
    additionalRateDefault: escapeHtml(i18n.formatNumber(data.health.averageAdditionalRate.value)),
    yearField:
      SUPPORTED_YEARS.length > 1
        ? `<div class="field"><label for="year">${toHtml(i18n.tr('form.year.label'))}</label><select id="year" name="y">${SUPPORTED_YEARS.map((y) => option(y, y, y === DEFAULT_YEAR)).join('')}</select></div>`
        : `<p class="hint"><strong>${toHtml(i18n.tr('form.year.label'))}:</strong> ${DEFAULT_YEAR}</p>`,
  };
}

function headHtml(ctx, { cssHash, css, pagePath, alternates }) {
  const csp = [
    "default-src 'none'",
    "script-src 'self'",
    `style-src 'sha256-${cssHash}'`,
    "img-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "manifest-src 'none'",
  ].join('; ');
  const links = alternates.map((a) => `<link rel="alternate" hreflang="${a.code}" href="${escapeHtml(absolute(a.href))}">`);
  const fallback = alternates.find((a) => a.code === DEFAULT_LOCALE.code);
  if (fallback) links.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(absolute(fallback.href))}">`);
  return [
    `<meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}">`,
    '<meta name="referrer" content="no-referrer">',
    '<meta name="color-scheme" content="light dark">',
    '<meta name="theme-color" content="#075563" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#0e181d" media="(prefers-color-scheme: dark)">',
    `<link rel="icon" href="${BASE}favicon.svg" type="image/svg+xml">`,
    `<link rel="canonical" href="${escapeHtml(absolute(pagePath))}">`,
    ...links,
    `<style>${css}</style>`,
  ].join('\n');
}

function render(template, ctx, extra) {
  const { i18n, globals } = ctx;
  const vars = { lang: ctx.locale.code, dir: ctx.locale.dir, ...extra };
  const html = template
    .replace(/\{\{t:([\w.-]+)\}\}/g, (_, key) => toHtml(i18n.tr(key, globals)))
    .replace(/\{\{plain:([\w.-]+)\}\}/g, (_, key) => escapeHtml(i18n.t(key, globals)))
    .replace(/\{\{(\w+)\}\}/g, (match, name) => {
      if (!(name in vars)) throw new Error(`Unbekannter Platzhalter ${match}`);
      return vars[name];
    });
  const left = html.match(/\{\{[^}]*\}\}/);
  if (left) throw new Error(`Nicht ersetzter Platzhalter ${left[0]}`);
  return html;
}

const notFoundPage = (ctx, head) => `<!DOCTYPE html>
<html lang="${ctx.locale.code}" dir="${ctx.locale.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(ctx.i18n.t('page.notFound.title'))}</title>
${head}
</head>
<body>
<main id="main" class="wrap prose">
<h1>${escapeHtml(ctx.i18n.t('page.notFound.title'))}</h1>
<p>${escapeHtml(ctx.i18n.t('page.notFound.text'))}</p>
<p><a href="${href(ctx.locale)}">${escapeHtml(ctx.i18n.t('nav.back'))}</a></p>
</main>
</body>
</html>
`;

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#075563"/><path d="M14 44h36M18 44V30m10 14V20m10 24V26m10 18V14" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/></svg>
`;

export async function build() {
  rmSync(DIST, { recursive: true, force: true });
  const dictionaries = Object.fromEntries(await Promise.all(LOCALES.map(async (l) => [l.code, await loadDictionary(l.code)])));

  const cssSource = readFileSync(join(SRC, 'styles/main.css'), 'utf8');
  const { code: css } = await transform(cssSource, { loader: 'css', minify: true });
  const cssMinified = css.trim();
  const cssHash = sha256(cssMinified, 'base64');

  const templates = Object.fromEntries(
    ['index', 'legal-notice', 'privacy'].map((name) => [name, readFileSync(join(SRC, 'template', `${name}.html`), 'utf8')]),
  );
  const contexts = LOCALES.map((l) => makeContext(l, dictionaries));
  const pages = [];

  for (const ctx of contexts) {
    const { locale } = ctx;
    const slug = slugs(ctx);
    const script = await buildScript(locale, ctx.dictionary);
    const common = options(ctx);
    const pageDefs = [
      { name: 'index', template: templates.index, slug: '' },
      { name: 'legal', template: templates['legal-notice'], slug: slug.legal },
      { name: 'privacy', template: templates.privacy, slug: slug.privacy },
    ];
    for (const def of pageDefs) {
      const pagePath = href(locale, def.slug);
      const alternates = contexts.map((c) => ({ code: c.locale.code, href: href(c.locale, def.slug && slugs(c)[def.name]) }));
      const languageNav = contexts
        .map((c) => {
          const target = href(c.locale, def.slug && slugs(c)[def.name]);
          const current = c.locale.code === locale.code;
          return `<a href="${target}" lang="${c.locale.code}" hreflang="${c.locale.code}"${current ? ' aria-current="page"' : ''}>${escapeHtml(c.locale.name)}</a>`;
        })
        .join('\n      ');
      const html = render(def.template, ctx, {
        ...common,
        head: headHtml(ctx, { cssHash, css: cssMinified, pagePath, alternates }),
        languageNav,
        script: def.name === 'index' ? `<script type="module" src="${BASE}${script}"></script>` : '',
        homeHref: href(locale),
        legalHref: href(locale, slug.legal),
        privacyHref: href(locale, slug.privacy),
      });
      const file = `${locale.path.slice(1)}${def.slug ? `${def.slug}/` : ''}index.html`;
      write(file, html);
      pages.push({ locale: locale.code, path: pagePath, file, script: def.name === 'index' ? script : null });
    }
  }

  const defaultCtx = contexts.find((c) => c.locale.default);
  const head404 = [
    `<meta http-equiv="Content-Security-Policy" content="${escapeHtml(`default-src 'none'; style-src 'sha256-${cssHash}'; base-uri 'none'`)}">`,
    '<meta name="color-scheme" content="light dark">',
    `<style>${cssMinified}</style>`,
  ].join('\n');
  write('404.html', notFoundPage(defaultCtx, head404));
  write('favicon.svg', FAVICON);
  write('robots.txt', `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}${BASE}sitemap.xml\n` : ''}`);
  if (SITE_URL) {
    const urls = pages.map((p) => `  <url><loc>${escapeHtml(absolute(p.path))}</loc></url>`).join('\n');
    write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  }
  return pages;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const pages = await build();
  console.log(`dist/ gebaut: ${pages.length} Seiten, Basis ${BASE}${SITE_URL ? `, ${SITE_URL}` : ''}`);
}
