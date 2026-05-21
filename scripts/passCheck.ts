import path from 'path';
import { chromium } from 'playwright';

(async () => {
  const url = new URL('https://www.linkedin.com/jobs/search-results');
  const storagePath = path.resolve(process.cwd(), 'storageSession.json');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: storagePath,
    viewport: {
      width: 1280,
      height: 800,
    },
  });
  const page = await context.newPage();
  await page.goto(url.toString(), {
    waitUntil: 'networkidle',
  });
})();
