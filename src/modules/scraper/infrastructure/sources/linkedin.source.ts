import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { chromium } from 'playwright';
import { ManipulateType } from 'dayjs';
import { STACK } from '../constants/stack.constants';
import path from 'path';
import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';
import { Modality } from 'src/modules/jobs/domain/enums/modality.enum';
import type { IScraperSource } from '../../domain/ports/scraper-source.port';
import { ScraperJobsInput } from '../../application/dto/scraper-jobs.input';
import { hasTech } from '../../application/utils/has-tech';

@Injectable()
export class LinkedinSource implements IScraperSource {
  key = 'linkedin';
  async fetch(data: ScraperJobsInput): Promise<JobCreateInput[]> {
    try {
      const dataPath = path.resolve(process.cwd(), 'storageSession.json');
      console.log(`=====> Initializing scrapping linkedin`);

      const browser = await chromium.launch({
        headless: true,
      });

      const context = await browser.newContext({
        storageState: dataPath,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/237.84.2.178 Safari/537.36',
        viewport: { width: 1280, height: 800 },
      });
      const dataJobs: JobCreateInput[] = [];
      const page = await context.newPage();
      const pageCount = 25;
      const totalPages = 10;

      for (let i = 0; i < totalPages; i++) {
        console.log('=====> Page ', i + 1);
        const url = new URL('https://www.linkedin.com/jobs/search-results');
        url.searchParams.append('keywords', data.keywords);
        url.searchParams.append('origin', 'JOB_COLLECTION_PAGE_SEARCH_BUTTON');
        url.searchParams.append('geoId', '91000011');
        url.searchParams.append('f_TPR', '86400');
        url.searchParams.append('f_WT', '2');
        url.searchParams.append('start', (pageCount * i).toString());

        await page.goto(url.toString(), {
          timeout: 30000,
        });
        try {
          await page.waitForFunction(
            ({ selector, min }) =>
              document.querySelectorAll(selector).length >= min,
            {
              selector:
                "div[componentKey='SearchResultsMainContent'] > div > div > div > div",
              min: 5,
            },
            {
              timeout: 30000,
            },
          );
        } catch {
          break;
        }
        const cards = page.locator(
          "div[componentKey='SearchResultsMainContent'] > div > div > div > div",
        );

        const totalCards = await cards.count();

        console.log(`=====> ${totalCards - 1} cards found`);
        for (let i = 0; i < totalCards - 1; i++) {
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

            const time =
              card.querySelectorAll('div > p > span')[3]?.textContent;
            const value = Number(time?.match(timeRegex)?.[0] || 10);
            const unit = (time?.split(' ')[2] || 'minutes') as ManipulateType;
            const date = new Date();
            if (unit === 'minutes') {
              date.setMinutes(date.getMinutes() - value);
            } else {
              date.setHours(date.getHours() - value);
            }

            const imageUrl = card.querySelector('img')?.getAttribute('src');
            const title =
              card.querySelectorAll('div > p > span')[1]?.textContent;
            const companyName =
              card.querySelectorAll('div > p')[1]?.textContent;
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
            imageUrl: job.imageUrl ? job.imageUrl : null,
            modality: job.modality as Modality,
            linkUrl,
            source: this.key,
            postedDate: new Date(job.postedDate),
          });
        }
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
