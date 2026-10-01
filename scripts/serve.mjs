#!/usr/bin/env node
/**
 * Kleiner statischer Server für dist/ (nur für die Entwicklung und die E2E-Tests).
 * Liefert Verzeichnisindizes, 404.html und setzt die empfohlenen Sicherheits-Header
 * (siehe docs/DEPLOYMENT.md). Port: PORT (Standard 4173).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
};

function locate(pathname) {
  const target = normalize(join(DIST, decodeURIComponent(pathname)));
  if (!target.startsWith(DIST)) return null;
  if (existsSync(target) && statSync(target).isDirectory()) {
    const index = join(target, 'index.html');
    return existsSync(index) ? index : null;
  }
  return existsSync(target) ? target : null;
}

createServer((request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  let file = locate(pathname);
  let status = 200;
  if (!file) {
    file = join(DIST, '404.html');
    status = 404;
  }
  const hashed = /\.[A-Z0-9]{8}\.js$/.test(file);
  response.writeHead(status, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    'cache-control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
    ...SECURITY_HEADERS,
  });
  response.end(request.method === 'HEAD' ? undefined : readFileSync(file));
}).listen(PORT, () => console.log(`http://localhost:${PORT}/ (dist/)`));
