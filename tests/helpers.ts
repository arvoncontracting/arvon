import type { Page } from '@playwright/test';

export const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440, 1920];

/** Marks the intro as seen so a test starts on the settled page. */
export async function skipIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('arvon-intro-seen', '1'));
}

export async function open(page: Page) {
  await skipIntro(page);
  await page.goto('./', { waitUntil: 'load' });
  await page.waitForTimeout(300);
}

/** Forces the lazily loaded scroll choreography to start. */
export async function startMotion(page: Page) {
  await page.evaluate(() => window.scrollBy({ top: 1, behavior: 'instant' }));
  await page.waitForFunction(() => document.documentElement.hasAttribute('data-motion'));
  await page.waitForTimeout(200);
}

export const heightFor = (width: number) => (width < 768 ? 780 : width < 1200 ? 900 : 1000);

export const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** Walks the page, in steps, so scroll-driven states are exercised. */
export async function scrollThrough(page: Page, onStep?: (y: number) => Promise<void>, direction: 'down' | 'up' = 'down') {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => Math.round(window.innerHeight * 0.8));
  const stops: number[] = [];
  for (let y = 0; y < total; y += step) stops.push(y);
  if (direction === 'up') stops.reverse();
  for (const y of stops) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(90);
    await onStep?.(y);
  }
}
