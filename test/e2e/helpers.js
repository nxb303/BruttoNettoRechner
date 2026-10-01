/** Gemeinsame Daten für die E2E-Tests. */
export const LOCALES = [
  {
    code: 'de',
    name: 'Deutsch',
    path: '/',
    gross: '5000',
    submit: 'Netto berechnen',
    reset: 'Zurücksetzen',
    net: '3.059,68 €',
    netYear: '36.716,16 €',
    incomeTax: '782,41 €',
    errorTitle: 'Bitte korrigieren Sie folgende Angaben',
    grossRequired: 'Bitte geben Sie Ihr Bruttogehalt ein.',
    skip: 'Zum Rechner springen',
    minijobLabel: 'Minijob',
    minijobNet: '500,00 €',
    subsidyLabel: 'Arbeitgeberzuschuss',
    legalLinkName: 'Impressum',
    legalPath: '/impressum/',
    privacyPath: '/datenschutz/',
  },
  {
    code: 'en',
    name: 'English',
    path: '/en/',
    gross: '5,000',
    submit: 'Calculate net salary',
    reset: 'Reset',
    net: '€3,059.68',
    netYear: '€36,716.16',
    incomeTax: '€782.41',
    errorTitle: 'Please correct the following entries',
    grossRequired: 'Please enter your gross salary.',
    skip: 'Skip to the calculator',
    minijobLabel: 'Mini-job',
    minijobNet: '€500.00',
    subsidyLabel: 'Employer subsidy',
    legalLinkName: 'Legal notice',
    legalPath: '/en/legal-notice/',
    privacyPath: '/en/privacy/',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    path: '/vi/',
    gross: '5.000',
    submit: 'Tính lương thực nhận',
    reset: 'Đặt lại',
    net: '3.059,68 €',
    netYear: '36.716,16 €',
    incomeTax: '782,41 €',
    errorTitle: 'Vui lòng sửa các mục sau',
    grossRequired: 'Vui lòng nhập lương gộp của bạn.',
    skip: 'Chuyển đến máy tính',
    minijobLabel: 'Minijob',
    minijobNet: '500,00 €',
    subsidyLabel: 'Khoản hỗ trợ của người sử dụng lao động',
    legalLinkName: 'Impressum',
    legalPath: '/vi/thong-tin-phap-ly/',
    privacyPath: '/vi/bao-mat/',
  },
];

export const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 800 },
  { name: 'desktop', width: 1280, height: 900 },
];

/** Query des Referenzfalls: 5.000 €, Steuerklasse I, NRW, kirchensteuerpflichtig, GKV, kinderlos. */
export const REFERENCE_QUERY = '?b=5000&p=m&stkl=1&bl=NW&kist=1&kfb=0&kv=g&zb=2.9&k=0&a23=1';

/** Füllt den Referenzfall über die Oberfläche aus (ohne abzusenden). */
export async function fillReference(page, locale) {
  await page.locator('#gross').fill(locale.gross);
  await page.locator('input[name="kist"][value="1"]').check();
}

/** Registriert Fehlersammler für Konsole, Seitenfehler und CSP-Verstöße. */
export async function collectProblems(page) {
  const problems = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) problems.push(`${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`CSP violation: ${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  return problems;
}
