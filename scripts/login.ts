import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto('https://www.linkedin.com/login/es/?fromSignIn=true');

  // 🔐 LOGIN MANUAL
  console.log('Inicia sesión manualmente...');
  await page.waitForTimeout(20000); // 20s para login manual

  // 💾 Guardar sesión
  await context.storageState({ path: 'storageState.json' });

  await browser.close();
})();
