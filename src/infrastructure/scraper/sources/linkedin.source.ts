import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  JobModality,
  JobsCreateInput,
} from 'src/infrastructure/database/drizzle/schemas';
import sanitizeHtml from 'sanitize-html';
import { chromium } from 'playwright';
import { ManipulateType } from 'dayjs';
import { STACK } from '../constants/stack.constants';
import { hasTech } from 'src/shared/utils/hasTech';
import path from 'path';
import { ScraperData } from '../types/scraper-data.interface';

@Injectable()
export class LinkedinSource {
  name = 'linkedin';
  async fetchJobs(data: ScraperData): Promise<JobsCreateInput[]> {
    try {
      const url = new URL('https://www.linkedin.com/jobs/search-results');
      url.searchParams.append('keywords', data.keywords);
      url.searchParams.append('origin', 'JOB_COLLECTION_PAGE_SEARCH_BUTTON');
      url.searchParams.append('geoId', '91000011');
      url.searchParams.append('f_TPR', '86400');
      url.searchParams.append('f_WT', '2');
      const dataPath = path.resolve(process.cwd(), 'storageSession.json');
      console.log(`=====> INIT PLAYWRIGHT`);

      const browser = await chromium.launch({
        headless: false,
      });

      const context = await browser.newContext({
        storageState: dataPath,
        viewport: { width: 1280, height: 800 },
      });

      const page = await context.newPage();
      await page.goto(url.toString(), {
        timeout: 0,
      });
      await page.waitForFunction(
        ({ selector, min }) =>
          document.querySelectorAll(selector).length >= min,
        {
          selector: "div[componentKey='SearchResultsMainContent'] > div > div",
          min: 5,
        },
        {
          timeout: 0,
        },
      );
      const cards = page.locator(
        "div[componentKey='SearchResultsMainContent'] > div > div",
      );

      const count = await cards.count();

      const dataJobs: JobsCreateInput[] = [];

      console.log(`=====> GETTING ${count - 3} JOBS`);
      for (let i = 0; i < count - 3; i++) {
        const card = cards.nth(i);
        await card.click();

        await page.waitForFunction(() => {
          const el = document.querySelector(
            "div[componentKey^='JobDetails_AboutTheJob']",
          );

          return el && el.textContent && el.textContent.length > 250;
        });
        const job = await card.evaluate((card) => {
          const regex = /^(.*)\s*\((.*)\)$/;
          const timeRegex = /\d+/;

          const jobLinkedinId =
            new URL(window.location.href).searchParams.get('currentJobId') ||
            '';

          const time = card.querySelectorAll('div > p > span')[3]?.textContent;
          const value = Number(time?.match(timeRegex)?.[0] || 10);
          const unit = (time?.split(' ')[2] || 'minutes') as ManipulateType;
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

        const applyButton = page.locator(
          "div[data-component-type='LazyColumn'] a[aria-label='Apply on company website']",
        );

        let linkUrl = job.linkUrl;

        const externalURL = (await applyButton.count()) > 0;

        if (externalURL) {
          const href = await applyButton
            .first()
            .evaluate((el) => el.getAttribute('href'));
          linkUrl = new URL(href!).searchParams.get('url')!;
        }

        const description = await page
          .locator("div[componentKey^='JobDetails_AboutTheJob']")
          .nth(0)
          .evaluate((el) => {
            const button = el.querySelector('button');
            button?.remove();
            return el.innerHTML;
          });
        const sanitizedDescription = sanitizeHtml(description, {
          allowedTags: sanitizeHtml.defaults.allowedTags,
          allowedAttributes: {},
        });
        if (!job.title || !job.companyName || !job.location || !job.modality)
          continue;

        dataJobs.push({
          title: job.title,
          description: sanitizedDescription,
          companyName: job.companyName,
          location: job.location,
          externalId: job.jobId,
          stack: STACK.filter((s) => hasTech(description, s)),
          imageUrl: job.imageUrl,
          modality: job.modality as JobModality,
          linkUrl,
          source: this.name,
          postedDate: new Date(job.postedDate),
        });
      }
      await context.close();
      await browser.close();
      return dataJobs;
    } catch (err) {
      console.error('=====> ERROR', err.message);
      throw new HttpException(err.message as string, HttpStatus.BAD_REQUEST);
    }
  }
}
