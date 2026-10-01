import { test, expect } from '@playwright/test';
import { LOCALES, VIEWPORTS, REFERENCE_QUERY, fillReference, collectProblems } from './helpers.js';

for (const locale of LOCALES) {
  for (const viewport of VIEWPORTS) {
    test.describe(`${locale.code} ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test('Referenzfall: Netto stimmt, URL wird gesetzt, Neuladen stellt das Ergebnis wieder her', async ({ page }) => {
        const problems = await collectProblems(page);
        await page.goto(locale.path);
        await expect(page.locator('#result-empty')).toBeVisible();
        await expect(page.locator('#result-content')).toBeHidden();
        await fillReference(page, locale);
        await page.getByRole('button', { name: locale.submit }).click();

        await expect(page.locator('#net-month')).toHaveText(locale.net);
        await expect(page.locator('#net-year')).toHaveText(locale.netYear);
        await expect(page.locator('#result-table')).toContainText(locale.incomeTax);
        await expect(page.locator('#live')).toContainText(locale.net);
        await expect(page.locator('#result-title')).toBeFocused();
        expect(new URL(page.url()).search).toBe(REFERENCE_QUERY);

        await page.reload();
        await expect(page.locator('#net-month')).toHaveText(locale.net);
        expect(await page.locator('#gross').inputValue()).toBe('5000');
        await expect(page.locator('input[name="kist"][value="1"]')).toBeChecked();
        expect(problems).toEqual([]);
      });

      test('Rechenweg: jeder Posten hat Schritte und Quellenlinks, Quellenverzeichnis vorhanden', async ({ page }) => {
        await page.goto(`${locale.path}${REFERENCE_QUERY}`);
        await expect(page.locator('#net-month')).toHaveText(locale.net);
        await expect(page.locator('#explain')).toBeVisible();
        const items = page.locator('.explain-item');
        expect(await items.count()).toBe(10); // 9 Posten + Netto
        for (let i = 0; i < 10; i++) {
          const item = items.nth(i);
          await item.locator('summary').click();
          expect(await item.locator('ol.steps > li').count()).toBeGreaterThanOrEqual(1);
          // Jeder Posten nennt Quellen; nur die reine Summenbildung „Netto“ (letzter Eintrag) braucht keine.
          if (i < 9) expect(await item.locator('a[href^="https://"]').count()).toBeGreaterThanOrEqual(1);
        }
        const sources = page.locator('#sources-list a[target="_blank"]');
        expect(await sources.count()).toBeGreaterThan(10);
        for (const link of await sources.all()) {
          await expect(link).toHaveAttribute('rel', /noopener/);
          await expect(link).toHaveAttribute('href', /^https:\/\//);
        }
      });

      test('Klick auf einen Posten in der Tabelle öffnet seinen Rechenweg', async ({ page }) => {
        await page.goto(`${locale.path}${REFERENCE_QUERY}`);
        await expect(page.locator('#net-month')).toHaveText(locale.net);
        await page.locator('#result-rows a[data-explain="pension"]').click();
        await expect(page.locator('#explain-pension')).toHaveAttribute('open', '');
      });

      test('Validierungsfehler: Zusammenfassung wird fokussiert, Fehler sind am Feld verknüpft', async ({ page }) => {
        await page.goto(locale.path);
        await page.getByRole('button', { name: locale.submit }).click();
        const summary = page.locator('#error-summary');
        await expect(summary).toBeVisible();
        await expect(summary).toBeFocused();
        await expect(summary).toHaveAttribute('role', 'alert');
        await expect(summary).toContainText(locale.errorTitle);
        await expect(summary).toContainText(locale.grossRequired);
        const gross = page.locator('#gross');
        await expect(gross).toHaveAttribute('aria-invalid', 'true');
        await expect(gross).toHaveAttribute('aria-describedby', /gross-error/);
        await expect(page.locator('#gross-error')).toHaveText(locale.grossRequired);
        await expect(page.locator('#result-content')).toBeHidden();

        await summary.getByRole('link').first().click();
        await expect(gross).toBeFocused();

        // Korrektur: Fehler verschwinden bei der automatischen Neuberechnung
        await gross.fill(locale.gross);
        await expect(page.locator('#net-month')).toBeVisible();
        await expect(summary).toBeHidden();
        await expect(gross).not.toHaveAttribute('aria-invalid', 'true');
      });

      test('Ungültige Werte werden pro Feld gemeldet', async ({ page }) => {
        await page.goto(locale.path);
        await page.locator('#gross').fill('abc');
        await page.locator('#additionalRate').fill('42');
        await page.getByRole('button', { name: locale.submit }).click();
        await expect(page.locator('#error-summary-list li')).toHaveCount(2);
        await expect(page.locator('#additionalRate')).toHaveAttribute('aria-invalid', 'true');
        await expect(page.locator('#gross-error')).toBeVisible();
        await expect(page.locator('#additionalRate-error')).toBeVisible();
      });

      test('Nach dem ersten Rechnen wird bei jeder Änderung automatisch neu gerechnet', async ({ page }) => {
        await page.goto(locale.path);
        await fillReference(page, locale);
        await page.getByRole('button', { name: locale.submit }).click();
        await expect(page.locator('#net-month')).toHaveText(locale.net);
        await page.locator('#taxClass').selectOption('3');
        await expect(page.locator('#net-month')).not.toHaveText(locale.net);
        const classThree = await page.locator('#net-month').textContent();
        await page.locator('input[name="p"][value="y"]').check();
        await expect(page.locator('#net-month')).not.toHaveText(classThree);
      });

      test('Abhängige Felder: Faktor, Kinderfreibeträge, PKV, Kinder, Minijob', async ({ page }) => {
        await page.goto(locale.path);
        await expect(page.locator('#factor-field')).toBeHidden();
        await page.locator('#taxClass').selectOption('4');
        await expect(page.locator('#factor-field')).toBeHidden(); // Faktor liegt in „Weitere Angaben“ (eingeklappt)
        await page.locator('details.more > summary').click();
        await expect(page.locator('#factor-field')).toBeVisible();
        await page.locator('#taxClass').selectOption('5');
        await expect(page.locator('#factor-field')).toBeHidden();
        await expect(page.locator('#childAllowances')).toBeDisabled();
        await expect(page.locator('#kfb-note')).toBeVisible();
        await page.locator('#taxClass').selectOption('1');
        await expect(page.locator('#childAllowances')).toBeEnabled();

        await expect(page.locator('#children-field')).toBeHidden();
        await expect(page.locator('#age-field')).toBeVisible();
        await page.locator('input[name="k"][value="1"]').check();
        await expect(page.locator('#children-field')).toBeVisible();
        await expect(page.locator('#age-field')).toBeHidden();

        await expect(page.locator('#health-private')).toBeHidden();
        await page.locator('input[name="kv"][value="p"]').check();
        await expect(page.locator('#health-private')).toBeVisible();
        await expect(page.locator('#health-statutory')).toBeHidden();
        await expect(page.locator('#care-group')).toBeHidden();

        await expect(page.locator('#minijob-field')).toBeHidden();
        await page.locator('#gross').fill('500');
        await expect(page.locator('#minijob-field')).toBeVisible();
        await page.locator('#gross').fill('900');
        await expect(page.locator('#minijob-field')).toBeHidden();
      });

      test('Minijob, Übergangsbereich und PKV liefern plausible Ergebnisse', async ({ page }) => {
        await page.goto(locale.path);
        await page.locator('#gross').fill('500');
        await page.getByRole('button', { name: locale.submit }).click();
        await expect(page.locator('#employment')).toContainText(locale.minijobLabel);
        await expect(page.locator('#warnings li').first()).toBeVisible();
        await page.locator('#minijobRvExempt').check();
        await expect(page.locator('#net-month')).toHaveText(locale.minijobNet);

        await page.locator('#gross').fill('1000');
        await expect(page.locator('#employment')).not.toContainText(locale.minijobLabel);
        await expect(page.locator('#warnings li')).toHaveCount(1); // Hinweis zum Übergangsbereich

        await page.locator('#gross').fill('9000');
        await page.locator('input[name="kv"][value="p"]').check();
        await page.locator('#kvPremium').fill('600');
        await page.locator('#pvPremium').fill('120');
        await expect(page.locator('#result-rows')).toContainText(locale.subsidyLabel);
        await expect(page.locator('#net-month')).toBeVisible();
      });

      test('Kein Cookie, kein Web-Storage, keine fremden Requests, keine Konsolenfehler', async ({ page, context }) => {
        const problems = await collectProblems(page);
        const origins = new Set();
        page.on('request', (request) => origins.add(new URL(request.url()).origin));
        await page.goto(locale.path);
        await fillReference(page, locale);
        await page.getByRole('button', { name: locale.submit }).click();
        await expect(page.locator('#net-month')).toHaveText(locale.net);
        await page.locator('.explain-item summary').first().click();
        await page.goto(locale.legalPath);
        await page.goto(locale.privacyPath);

        expect(await context.cookies()).toEqual([]);
        await page.goto(locale.path);
        const storage = await page.evaluate(async () => ({
          local: localStorage.length,
          session: sessionStorage.length,
          databases: (await indexedDB.databases?.())?.length ?? 0,
          cookie: document.cookie,
        }));
        expect(storage).toEqual({ local: 0, session: 0, databases: 0, cookie: '' });
        expect([...origins]).toEqual(['http://localhost:4180']);
        expect(problems).toEqual([]);
      });

      test('Reflow: kein horizontales Scrollen bei 320 px (leer, mit Ergebnis, geöffnetem Rechenweg)', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 700 });
        const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        await page.goto(locale.path);
        expect(await overflow()).toBeLessThanOrEqual(0);
        await page.goto(`${locale.path}${REFERENCE_QUERY}`);
        await expect(page.locator('#net-month')).toHaveText(locale.net);
        expect(await overflow()).toBeLessThanOrEqual(0);
        for (const summary of await page.locator('.explain-item > summary, #employer > summary').all()) await summary.click();
        expect(await overflow()).toBeLessThanOrEqual(0);
      });

      test('Sprachwechsel behält die Eingaben', async ({ page }) => {
        for (const other of LOCALES.filter((l) => l.code !== locale.code)) {
          await page.goto(`${locale.path}${REFERENCE_QUERY}`);
          await expect(page.locator('#net-month')).toHaveText(locale.net);
          await expect(page.locator('.lang-nav a')).toHaveCount(LOCALES.length);
          const switcher = page.locator(`.lang-nav a[hreflang="${other.code}"]`);
          await expect(switcher).toHaveAttribute('href', new RegExp(`${REFERENCE_QUERY.replace(/[?&=.]/g, '\\$&')}$`));
          await switcher.click();
          await expect(page).toHaveURL(new RegExp(`${other.path}\\?b=5000`));
          await expect(page.locator('#net-month')).toHaveText(other.net);
          await expect(page.locator('html')).toHaveAttribute('lang', other.code);
        }
      });
    });
  }

  test.describe(`${locale.code} Tastatur`, () => {
    test('Nur-Tastatur-Durchlauf: Tab-Reihenfolge, Enter rechnet, Rechenweg per Tastatur', async ({ page }) => {
      await page.goto(locale.path);
      const describe = () =>
        page.evaluate(() => {
          const el = document.activeElement;
          return el.id || (el.name ? `name:${el.name}` : '') || el.textContent.trim().slice(0, 30) || el.tagName;
        });
      const order = [];
      await page.keyboard.press('Tab');
      const languageNames = LOCALES.map((l) => l.name);
      const head = 1 + languageNames.length; // Skip-Link und je ein Link pro Sprache
      for (let i = 0; i < head + 13; i++) {
        order.push(await describe());
        await page.keyboard.press('Tab');
      }
      expect(order.slice(0, head)).toEqual([locale.skip, ...languageNames]);
      expect(order.slice(head)).toEqual([
        'gross', 'name:p', 'taxClass', 'state', 'name:kist', 'childAllowances', 'name:kv',
        'additionalRate', 'name:k', 'name:a23', expect.any(String), locale.submit, 'reset',
      ]);

      await page.locator('#gross').focus();
      await page.keyboard.type(locale.gross);
      await page.keyboard.press('Enter');
      await expect(page.locator('#net-month')).toBeVisible();
      await expect(page.locator('#result-title')).toBeFocused();

      const summary = page.locator('#explain-incomeTax > summary');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#explain-incomeTax')).toHaveAttribute('open', '');
      await page.keyboard.press('Space');
      await expect(page.locator('#explain-incomeTax')).not.toHaveAttribute('open', '');

      // Radiogruppe per Pfeiltasten
      await page.locator('input[name="p"]:checked').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('input[name="p"][value="y"]')).toBeChecked();
    });

    test('Sichtbarer Fokus: Fokusrahmen mindestens 3 px', async ({ page }) => {
      await page.goto(locale.path);
      await page.locator('#gross').focus();
      await page.keyboard.press('Tab'); // Fokus auf Radiogruppe
      const outline = await page.evaluate(() => {
        const input = document.querySelector('input[name="p"]:checked + span');
        return parseFloat(getComputedStyle(input).outlineWidth);
      });
      expect(outline).toBeGreaterThanOrEqual(3);
      await page.locator('#gross').focus();
      expect(await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement).outlineWidth))).toBeGreaterThanOrEqual(3);
    });

    test('Druck: alle Rechenwege werden aufgeklappt und danach wiederhergestellt', async ({ page }) => {
      await page.goto(`${locale.path}${REFERENCE_QUERY}`);
      await expect(page.locator('#net-month')).toHaveText(locale.net);
      await page.locator('#explain-pension > summary').click();
      await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
      expect(await page.locator('details:not([open])').count()).toBe(0);
      await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
      await expect(page.locator('#explain-pension')).toHaveAttribute('open', '');
      await expect(page.locator('#explain-incomeTax')).not.toHaveAttribute('open', '');
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('.form-card')).toBeHidden();
      await expect(page.locator('#result')).toBeVisible();
    });
  });

  test.describe(`${locale.code} Seiten`, () => {
    test('Rechtsseiten und Barrierefreiheitserklärung erreichbar und mit Platzhalterhinweis', async ({ page }) => {
      await page.goto(locale.path);
      await page.locator('.site-footer a', { hasText: locale.legalLinkName }).click();
      await expect(page).toHaveURL(locale.legalPath);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toContainText('[');
      await page.goto(locale.privacyPath);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#a11y')).toBeVisible();
      await page.goto(locale.path);
      await page.locator('.site-footer a[href$="#a11y"]').click();
      await expect(page).toHaveURL(new RegExp(`${locale.privacyPath}#a11y$`));
    });

    test('Seitenmetadaten: lang, canonical, hreflang, CSP und Referrer-Policy', async ({ page }) => {
      await page.goto(locale.path);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', locale.path);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(LOCALES.length + 1); // alle Sprachen plus x-default
      const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
      expect(csp).toMatch(/default-src 'none'/);
      expect(csp).toMatch(/script-src 'self'/);
      expect(csp).toMatch(/style-src 'sha256-[A-Za-z0-9+/=]+'/);
      await expect(page.locator('meta[name="referrer"]')).toHaveAttribute('content', 'no-referrer');
      expect(await page.locator('h1').count()).toBe(1);
    });
  });
}

test('Unbekannte Pfade liefern die 404-Seite', async ({ page }) => {
  const response = await page.goto('/gibt-es-nicht/');
  expect(response.status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
});

test('Ungültige URL-Parameter werden ignoriert', async ({ page }) => {
  await page.goto('/?b=4000&stkl=9&bl=XX&zb=abc&kfb=7&ku=99');
  await expect(page.locator('#taxClass')).toHaveValue('1');
  await expect(page.locator('#state')).toHaveValue('NW');
  await expect(page.locator('#additionalRate')).toHaveValue('2,9');
  await expect(page.locator('#net-month')).toBeVisible();
});

test('Zurücksetzen stellt Vorgaben her und leert die URL', async ({ page }) => {
  await page.goto(`/${REFERENCE_QUERY}`);
  await expect(page.locator('#net-month')).toBeVisible();
  await page.getByRole('button', { name: 'Zurücksetzen' }).click();
  await expect(page.locator('#gross')).toHaveValue('');
  await expect(page.locator('#result-content')).toBeHidden();
  await expect(page.locator('#result-empty')).toBeVisible();
  expect(new URL(page.url()).search).toBe('');
});
