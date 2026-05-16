import { Injectable } from '@nestjs/common';
import { Browser, chromium, Page } from 'playwright';

@Injectable()
export class PlaywrightService {
  browser: Browser;
  page: Page;
  async init(url: string) {
    this.browser = await chromium.launch({
      headless: false,
    });
    const context = await this.browser.newContext({
      storageState: 'storageState.json',
    });
    this.page = await context.newPage();

    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}
