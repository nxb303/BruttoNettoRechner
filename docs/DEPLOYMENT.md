# Deployment

Die Seite ist rein statisch (`dist/`). Es gibt keine serverseitige Logik und keine API.

## Bauen

```sh
npm ci
npm run build                                  # Basispfad "/", ohne canonical-Ursprung
BASE_PATH=/brutto-netto/ SITE_URL=https://example.org npm run build
```

- `BASE_PATH`: Pfad, unter dem die Seite liegt (Standard `/`; bei GitHub-Pages-Projektseiten `/<repo>/`). Alle Links,
  Assets, canonical und hreflang berücksichtigen ihn.
- `SITE_URL`: Ursprung für absolute `canonical`/`hreflang`-Adressen und die `sitemap.xml`. Ohne Angabe werden pfadrelative
  Adressen verwendet und keine Sitemap erzeugt.

Ausgabe: `index.html` (de), `en/index.html`, `impressum/`, `datenschutz/`, `en/legal-notice/`, `en/privacy/`, `404.html`,
`robots.txt`, `favicon.svg`, `assets/app.<sprache>.<hash>.js`. Das CSS steht inline in jeder Seite.

## GitHub Pages

1. Im Repository: Settings → Pages → Source: „GitHub Actions“.
2. Push auf `main` startet `.github/workflows/ci.yml`: Tests, Build, Prüfungen, E2E, danach Deployment
   (`actions/deploy-pages`). Basispfad und Ursprung setzt der Workflow aus den Pages-Einstellungen.
3. Eigene Domain: im Repository unter Pages eintragen; dann `BASE_PATH` = `/` und `SITE_URL` anpassen.

## Content-Security-Policy

Der Build setzt eine CSP per `<meta http-equiv>`:

```
default-src 'none'; script-src 'self'; style-src 'sha256-<Hash des Inline-CSS>'; img-src 'self';
base-uri 'none'; form-action 'none'; manifest-src 'none'
```

Es gibt keine Inline-Skripte oder -Event-Handler. Stile werden nur über CSSOM (`element.style`) gesetzt, was die CSP erlaubt.
`frame-ancestors` lässt sich nicht per `<meta>` setzen – dafür den Header verwenden.

## Empfohlene HTTP-Header (wo der Hoster Header erlaubt)

```
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'sha256-…'; img-src 'self'; base-uri 'none'; form-action 'none'; manifest-src 'none'; frame-ancestors 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
```

(Der Hash steht in der `<meta>`-CSP jeder Seite.) `scripts/serve.mjs` setzt die Header ohne CSP/HSTS für die lokale Entwicklung.

## Caching

| Datei | Cache-Control |
|---|---|
| `*.html`, `robots.txt`, `sitemap.xml`, `favicon.svg` | `no-cache` (immer revalidieren) |
| `assets/*.js` (Hash im Namen) | `public, max-age=31536000, immutable` |

GitHub Pages setzt eigene Header und erlaubt keine Anpassung; die `<meta>`-CSP greift trotzdem.

## Datenschutz

Keine Cookies, kein Web-Storage, keine externen Requests (keine CDNs, Webfonts oder Analytics): Deshalb ist kein Cookie-Banner
nötig (§ 25 TDDDG). Der Hosting-Anbieter verarbeitet Server-Logfiles; das gehört in die Datenschutzerklärung
(Platzhalter in `src/i18n/*.js`, Schlüssel `privacy.hosting.text`).
