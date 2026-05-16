import { Injectable } from '@nestjs/common';
import { JobsCreateInput } from 'src/infrastructure/database/drizzle/schemas';
import { ScraperDto } from 'src/modules/jobs/presentation/dtos/scraper.dto';
import { chromium } from 'playwright';
import { ManipulateType } from 'dayjs';
import path from 'path';
import fs from 'fs';

@Injectable()
export class LinkedinSource {
  name = 'linkedin';
  constructor() {}

  async fetchJobs(data: ScraperDto): Promise<JobsCreateInput[]> {
    try {
      const url = new URL('https://www.linkedin.com/jobs/search-results');
      const storagePath = path.resolve(process.cwd(), 'storageState.json');
      url.searchParams.append('keywords', data.keywords);
      url.searchParams.append('origin', 'JOB_COLLECTION_PAGE_SEARCH_BUTTON');
      url.searchParams.append('geoId', '91000011');
      url.searchParams.append('f_TPR', '86400');

      console.log({
        url: url.toString(),
        path: storagePath,
        exist: fs.existsSync(storagePath),
      });

      const browser = await chromium.launch({
        headless: true,
      });
      const context = await browser.newContext({
        storageState: storagePath,
        locale: 'en-US',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      const page = await context.newPage();
      await page.goto(url.toString(), {
        waitUntil: 'domcontentloaded',
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const cards = page.locator(
        "div[componentKey='SearchResultsMainContent'] > div > div",
      );

      const count = await cards.count();

      const jobs: any[] = [];

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        // avoid the last 3 elements
        if (i >= count - 3) continue;
        await card.click();
        const job = await card.evaluate((card) => {
          const regex = /^(.*)\s*\((.*)\)$/;
          const timeRegex = /\d+/;

          const time = card.querySelectorAll('div > p > span')[3]?.textContent;
          const value = Number(time.match(timeRegex)?.[0]);
          const unit = time.split(' ')[2] as ManipulateType;
          const date = new Date();
          if (unit === 'minutes') {
            date.setMinutes(date.getMinutes() - value);
          } else {
            date.setHours(date.getHours() - value);
          }

          const imageUrl = card.querySelector('img')?.getAttribute('src');
          const title = card.querySelectorAll('div > p > span')[1]?.textContent;
          const companyName = card.querySelectorAll('div > p')[1]?.textContent;
          const location = card
            .querySelectorAll('div > p')[2]
            ?.textContent.match(regex)?.[1]
            .trim();

          const modality = card
            .querySelectorAll('div > p')[2]
            ?.textContent.match(regex)?.[2]
            .trim()
            .replace('-', '')
            .toLowerCase();
          return {
            imageUrl,
            title,
            companyName,
            location,
            modality,
            time: date.toISOString(),
          };
        });
        jobs.push(job);
      }
      console.log({ count, info: jobs.filter(Boolean).length });
      fs.writeFileSync(
        'jobs.json',
        JSON.stringify(jobs.filter(Boolean), null, 2),
        'utf-8',
      );

      await page.screenshot({
        path: 'debug.png',
      });
      // fs.writeFileSync('jobs.json', JSON.stringify(jobCards, null, 2), 'utf-8');
      await browser.close();
      return [];
    } catch (err) {
      console.log('ERROR ====>', err);
      return [];
    }
  }
}
