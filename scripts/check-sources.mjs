#!/usr/bin/env node
/**
 * Prüft, ob alle URLs des Quellenkatalogs erreichbar sind (HTTP 2xx nach Weiterleitungen).
 * Erst HEAD (wie `curl -sIL`), bei Ablehnung ein GET – einzelne Server beantworten HEAD nicht.
 * Netzwerkzugriff nötig; nur manuell ausführen: npm run check:sources
 * Hinter einem Proxy: NODE_USE_ENV_PROXY=1 setzen.
 */
import { SOURCES } from '../src/data/sources.js';

const USER_AGENT = 'Mozilla/5.0 (compatible; brutto-netto-rechner source check)';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Einzelne Server antworten gelegentlich mit 5xx; deshalb bis zu drei Versuche. */
async function status(url) {
  for (const [attempt, method] of ['HEAD', 'GET', 'GET'].entries()) {
    if (attempt > 0) await sleep(2000);
    try {
      const response = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': USER_AGENT, accept: '*/*' }, signal: AbortSignal.timeout(45_000) });
      if (response.ok) return `${response.status} (${method})`;
    } catch {
      // nächster Versuch
    }
  }
  return null;
}

let failed = 0;
for (const source of Object.values(SOURCES)) {
  const result = await status(source.url);
  if (!result) failed++;
  console.log(`${result ?? 'FEHLER'}\t${source.id}\t${source.url}`);
}
if (failed) {
  console.error(`${failed} Quelle(n) nicht erreichbar`);
  process.exit(1);
}
console.log(`Alle ${Object.keys(SOURCES).length} Quellen erreichbar.`);
