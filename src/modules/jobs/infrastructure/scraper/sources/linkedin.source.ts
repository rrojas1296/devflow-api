import { Injectable } from '@nestjs/common';
import {
  JobModality,
  JobsCreateInput,
} from 'src/infrastructure/database/drizzle/schemas';
import { ScraperDto } from 'src/modules/jobs/presentation/dtos/scraper.dto';
import { chromium } from 'playwright';
import { ManipulateType } from 'dayjs';
import path from 'path';
import fs from 'fs';
import { STACK } from '../constants/stack.constants';

@Injectable()
export class LinkedinSource {
  name = 'linkedin';
  constructor() {}

  async fetchJobs(data: ScraperDto): Promise<JobsCreateInput[]> {
    try {
      const url = new URL('https://www.linkedin.com/jobs/search-results');
      const storagePath = path.resolve(process.cwd(), 'storageSession.json');
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
      await page.waitForTimeout(1000);
      const cards = page.locator(
        "div[componentKey='SearchResultsMainContent'] > div > div",
      );

      const count = await cards.count();

      const dataJobs: JobsCreateInput[] = [];

      const prevJobId = await page.evaluate(() =>
        new URL(location.href).searchParams.get('currentJobId'),
      );
      console.log({ prevJobId });

      for (let i = 0; i < count; i++) {
        console.log(`========= ${i} / ${count} ==========`);
        const card = cards.nth(i);
        // avoid the last 3 elements
        if (i >= count - 3) continue;
        await card.click();

        await page.waitForFunction(() => {
          const el = document.querySelector(
            "div[componentKey^='JobDetails_AboutTheJob']",
          );

          return el && el.textContent && el.textContent.length > 300;
        });
        const job = await card.evaluate((card) => {
          const regex = /^(.*)\s*\((.*)\)$/;
          const timeRegex = /\d+/;

          const jobLinkedinId =
            new URL(window.location.href).searchParams.get('currentJobId') ||
            '';

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
          const location =
            card
              .querySelectorAll('div > p')[2]
              ?.textContent.match(regex)?.[1]
              .trim() || 'Latin America';

          const buttons = document
            .querySelector("div[componentKey^='JobDetails_AboutTheJob']")
            ?.querySelectorAll('button');
          buttons?.[0]?.remove();

          const modality = card
            .querySelectorAll('div > p')[2]
            ?.textContent.match(regex)?.[2]
            .trim()
            .replace('-', '')
            .toLowerCase();

          return {
            imageUrl: imageUrl,
            title,
            companyName,
            location,
            modality,
            postedDate: date.toISOString(),
            description: '',
            jobId: jobLinkedinId,
            linkUrl: `https://www.linkedin.com/jobs/view/${jobLinkedinId}`,
          };
        });
        const description = await page
          .locator("div[componentKey^='JobDetails_AboutTheJob']")
          .nth(0)
          .innerHTML();
        dataJobs.push({
          title: job.title,
          description: description,
          companyName: job.companyName,
          location: job.location,
          jobId: job.jobId,
          stack: STACK.filter((s) =>
            description?.toLowerCase().includes(s.toLowerCase()),
          ),
          imageUrl: job.imageUrl,
          modality: job.modality as JobModality,
          linkUrl: job.linkUrl,
          postedDate: new Date(job.postedDate),
        });
      }
      console.log(`========> ${dataJobs.length} JOBS FOUND`);
      await browser.close();
      return dataJobs;
    } catch (err) {
      console.log('ERROR ====>', err);
      return [];
    }
  }
}
