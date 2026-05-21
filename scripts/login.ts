import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto('https://www.linkedin.com/login');

  console.log('=====> LOGIN');

  await page.waitForURL('https://www.linkedin.com/feed/', { timeout: 0 });

  console.log('=====> DATA SAVED');

  await context.storageState({ path: 'storageSession.json' });
})();
