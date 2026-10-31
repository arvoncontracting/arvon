import { expect, test } from '@playwright/test';
import { heightFor, horizontalOverflow, open, scrollThrough, startMotion, WIDTHS } from './helpers';

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px, top to bottom and back`, async ({ page }) => {
    await page.setViewportSize({ width, height: heightFor(width) });
    await open(page);
    await startMotion(page);
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

test('floating WhatsApp stays clear while reading on phones', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await open(page);
  const fab = page.locator('.floating-whatsapp');
  await expect(fab).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: 'instant' }));
  await page.waitForTimeout(150);
  await expect(fab).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 2900, behavior: 'instant' }));
  await expect(fab).toBeVisible();
  await page.locator('#contact h2').scrollIntoViewIfNeeded();
  await expect(fab).toBeHidden();
});

test('floating WhatsApp is available on desktop outside hero and contact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const fab = page.locator('.floating-whatsapp');
  await expect(fab).toBeHidden();
  await page.locator('#waterproofing h2').scrollIntoViewIfNeeded();
  await expect(fab).toBeVisible();
});

test('reduced motion shows everything without animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('./', { waitUntil: 'load' });
  await expect(page.locator('.intro')).toBeHidden();
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

test('nothing is pinned, so scrolling is never trapped', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await startMotion(page);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`timeline shows five readable stages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: heightFor(width) });
    await open(page);
    const stages = page.locator('.timeline__stage');
    await expect(stages).toHaveCount(5);
    for (let i = 0; i < 5; i += 1) {
      const stage = stages.nth(i);
      await stage.scrollIntoViewIfNeeded();
      await expect(stage).toBeVisible();
      const box = (await stage.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await expect(stage.locator('.timeline__node')).toHaveText(`0${i + 1}`);
    }
  });
}

for (const width of [390, 1440]) {
  test(`active stage follows scroll both ways at ${width}px, none skipped`, async ({ page }) => {
    await page.setViewportSize({ width, height: heightFor(width) });
    await open(page);
    await startMotion(page);
    const stages = page.locator('.timeline__stage');
    const activeIndex = () => stages.evaluateAll((all) => all.findIndex((el) => el.classList.contains('is-active')));

    const placeAtLine = async (index: number) => {
      await stages.nth(index).evaluate((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.62 + 12;
        window.scrollTo({ top, behavior: 'instant' });
      });
    };

    for (let i = 0; i < 5; i += 1) {
      await placeAtLine(i);
      await expect.poll(activeIndex).toBe(i);
      expect(await page.locator('.timeline__stage[aria-current="step"]').count()).toBe(1);
    }
    await expect(stages.nth(0)).toHaveClass(/is-done/);

    for (let i = 4; i >= 0; i -= 1) {
      await placeAtLine(i);
      await expect.poll(activeIndex).toBe(i);
    }
  });
}

test('reduced motion shows the whole timeline with a full line', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 780 } });
  const page = await context.newPage();
  await page.goto('./', { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await expect(page.locator('.timeline')).not.toHaveClass(/is-live/);
  await expect(page.locator('.timeline__stage')).toHaveCount(5);
  const opacities = await page.locator('.timeline__stage').evaluateAll((all) => all.map((el) => getComputedStyle(el).opacity));
  expect(opacities).toEqual(['1', '1', '1', '1', '1']);
  await context.close();
});

test('phones never download the wide hero or desktop stage images', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => { if (request.resourceType() === 'image') requested.push(request.url()); });
  await page.setViewportSize({ width: 390, height: 780 });
  await open(page);
  expect(requested.some((url) => url.includes('amman-skyline-portrait'))).toBe(true);
  expect(requested.some((url) => /amman-skyline-(800|1200|1564)/.test(url))).toBe(false);
});
