import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LOCALES, VIEWPORTS, REFERENCE_QUERY } from './helpers.js';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const SCHEMES = ['light', 'dark'];

async function expectNoViolations(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
  expect(summary).toEqual([]);
}

for (const locale of LOCALES) {
  for (const viewport of VIEWPORTS) {
    for (const scheme of SCHEMES) {
      test.describe(`axe ${locale.code} ${viewport.name} ${scheme}`, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: scheme });

        test('Leerzustand', async ({ page }) => {
          await page.goto(locale.path);
          await expectNoViolations(page);
        });

        test('Ergebniszustand mit aufgeklapptem Rechenweg und Arbeitgeberkosten', async ({ page }) => {
          await page.goto(`${locale.path}${REFERENCE_QUERY}`);
          await expect(page.locator('#net-month')).toBeVisible();
          for (const summary of await page.locator('.explain-item > summary, #employer > summary, details.more > summary').all()) {
            await summary.click();
          }
          await expectNoViolations(page);
        });

        test('Fehlerzustand mit Fehlerzusammenfassung', async ({ page }) => {
          await page.goto(locale.path);
          await page.getByRole('button', { name: locale.submit }).click();
          await expect(page.locator('#error-summary')).toBeVisible();
          await expectNoViolations(page);
        });

        test('PKV, Steuerklasse IV mit Faktor, Minijob-Hinweis und Kinder', async ({ page }) => {
          await page.goto(`${locale.path}?b=9000&p=m&stkl=4&f=0.912&bl=SN&kist=1&kfb=1&kv=p&kvb=600&pvb=120&agz=1`);
          await expect(page.locator('#net-month')).toBeVisible();
          await page.locator('details.more > summary').click();
          await expectNoViolations(page);
          await page.goto(`${locale.path}?b=500&p=m&stkl=1&bl=NW&kist=0&kfb=0&kv=g&zb=2.9&k=1&ku=3`);
          await expect(page.locator('#net-month')).toBeVisible();
          await expectNoViolations(page);
        });

        test('Rechtsseiten', async ({ page }) => {
          for (const path of [locale.legalPath, locale.privacyPath]) {
            await page.goto(path);
            await expectNoViolations(page);
          }
        });
      });
    }
  }
}
