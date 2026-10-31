import { expect, test } from '@playwright/test';
import { heightFor, horizontalOverflow, open, scrollThrough, WIDTHS } from './helpers';

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px, top to bottom and back`, async ({ page }) => {
    await page.setViewportSize({ width, height: heightFor(width) });
    await open(page);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await scrollThrough(page, async () => {
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
    await scrollThrough(page, async () => {
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    }, 'up');
  });
}

test('mobile touch targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 780 });
  await open(page);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('a, button')]
      .filter((el) => el.getBoundingClientRect().width > 0 && !el.closest('.skip-link, dialog'))
      .map((el) => ({ text: el.textContent?.trim().slice(0, 30), h: Math.round(el.getBoundingClientRect().height) }))
      .filter((item) => item.h < 44),
  );
  expect(small).toEqual([]);
});

test('layout stays right-to-left', async ({ page }) => {
  await open(page);
  expect(await page.evaluate(() => [document.documentElement.dir, document.documentElement.lang])).toEqual(['rtl', 'ar']);
  const heroLeft = await page.locator('h1').evaluate((el) => getComputedStyle(el).direction);
  expect(heroLeft).toBe('rtl');
});

test('floating WhatsApp stays clear of sections with their own link', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await open(page);
  const fab = page.locator('.floating-whatsapp');
  await expect(fab).toBeHidden();
  await page.locator('#waterproofing h2').scrollIntoViewIfNeeded();
  await expect(fab).toBeVisible();
  await page.locator('#contact h2').scrollIntoViewIfNeeded();
  await expect(fab).toBeHidden();
});

test('reduced motion shows everything without animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('./', { waitUntil: 'load' });
  await expect(page.locator('.intro')).toHaveCount(0);
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  await expect(page.locator('.stage')).toBeHidden();
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('main h2, main h3, main p, main li')]
      .filter((el) => el.offsetParent !== null && getComputedStyle(el).opacity === '0')
      .map((el) => el.textContent?.slice(0, 30)),
  );
  expect(hidden).toEqual([]);
  await context.close();
});
