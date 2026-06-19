import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { chromium } from 'playwright';
import { TECH_ALIASES } from '../constants/stack.constants';
import path from 'path';
import type { IScraperSource } from '../../domain/ports/scraper-source.port';
import type { ScrapeRequest } from '../../domain/ports/scraper-producer.port';
import { hasTech } from '../../application/utils/has-tech';
import { SourceJobResult } from '../../domain/interfaces/source-job-result.interface';
import { getCountry } from '../../application/utils/get-country';
import { Modality } from 'src/modules/jobs/domain/enums/modality.enum';

@Injectable()
export class LinkedinSource implements IScraperSource {
  key = 'linkedin';
  async fetch(data: ScrapeRequest): Promise<SourceJobResult[]> {
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
      const dataJobs: SourceJobResult[] = [];
      const page = await context.newPage();
      const pageCount = 25;
      const totalPages = 10;

      for (let i = 0; i < totalPages; i++) {
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
        console.log('=====> Page ', i + 1);
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
          "div[componentKey='SearchResultsMainContent'] > div > div > div > div > div > div",
        );
        const modalities: Modality[] = ['remote', 'hybrid', 'onsite'];

        const totalCards = Math.min(25, (await cards.count()) - 1);

        console.log(`=====> ${totalCards} cards found`);
        for (let i = 0; i < totalCards; i++) {
          const card = cards.nth(i);
          await card.click();

          try {
            await page.waitForFunction(() => {
              const el = document.querySelector(
                "div[componentKey^='JobDetails_AboutTheJob']",
              );

              return el && el.textContent && el.textContent.length > 250;
            });
          } catch {
            continue;
          }
          const timeCard = await page
            .locator("div[data-component-type='LazyColumn']")
            .nth(2)
            .locator('p > span:nth-child(4)')
            .nth(0)
            .textContent();

          const unitDate =
            timeCard?.toLowerCase().split(' ').at(-2) || 'minutes';
          const valueDate = timeCard?.toLowerCase().split(' ').at(-3) || '1';
          const date = new Date();
          if (unitDate === 'minutes') {
            date.setMinutes(date.getMinutes() - parseInt(valueDate));
          } else {
            date.setHours(date.getHours() - parseInt(valueDate));
          }
          const postedDate = date.toISOString();
          const externalId = new URL(page.url()).searchParams.get(
            'currentJobId',
          )!;
          let linkUrl = `https://www.linkedin.com/jobs/view/${externalId}`;

          const title = await card
            .locator('div > p > span')
            .nth(1)
            .textContent();

          const companyName = await card
            .locator('div > p')
            .nth(1)
            .textContent();

          const jobModality = (
            await page
              .locator("div[data-component-type='LazyColumn']")
              .nth(2)
              .locator('div:nth-child(2) > div > a > span')
              .nth(0)
              .textContent()
          )
            ?.toLowerCase()
            .replaceAll('-', '');

          const modality =
            modalities.find((m) => jobModality?.includes(m)) ?? 'remote';

          let imageUrl: string | null = null;

          const hasImages = (await card.locator('img').count()) > 0;

          if (hasImages) {
            const widthImage = await card
              .locator('img')
              .nth(0)
              .evaluate((el) => el.clientWidth);
            if (widthImage === 48) {
              imageUrl = await card.locator('img').nth(0).getAttribute('src');
            }
          }

          const applyButton = page.locator(
            "div[data-component-type='LazyColumn'] a[aria-label='Apply on company website']",
          );

          const location = await page
            .locator("div[data-component-type='LazyColumn']")
            .nth(2)
            .locator('p > span:has(~ span)')
            .nth(0)
            .textContent();

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
          const stack = Object.keys(TECH_ALIASES).filter((s) =>
            hasTech(description, s),
          );
          if (
            !title ||
            !companyName ||
            !location ||
            !linkUrl ||
            stack.length === 0
          )
            continue;
          const job: SourceJobResult = {
            title,
            description: sanitizedDescription,
            companyName,
            location: getCountry(location ?? 'Latin America'),
            externalId,
            stack,
            imageUrl,
            modality,
            linkUrl,
            source: this.key,
            postedDate: new Date(postedDate),
          };

          dataJobs.push(job);
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
