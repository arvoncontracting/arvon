import { expect, test } from '@playwright/test';
import { open, scrollThrough, startMotion } from './helpers';

test.describe('intro', () => {
  test('plays once, about two seconds, then does not replay', async ({ page }) => {
    await page.goto('./', { waitUntil: 'commit' });
    await expect(page.locator('.intro')).toBeVisible();
    const started = Date.now();
    await expect(page.getByText('أهلًا وسهلًا بكم', { exact: true })).toBeVisible();
    await expect(page.locator('.intro')).toBeHidden({ timeout: 4000 });
    expect(Date.now() - started).toBeLessThan(3000);
    await expect(page.locator('h1')).toBeVisible();
    await page.reload();
    await page.waitForTimeout(300);
    await expect(page.locator('.intro')).toBeHidden();
  });

  test('skip button ends it at once', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'تخطي المقدمة' }).click();
    await expect(page.locator('.intro')).toBeHidden();
    await expect(page.locator('h1')).toHaveCSS('opacity', '1', { timeout: 1000 });
  });

  test('runs and ends without any JavaScript bundle', async ({ page }) => {
    await page.route('**/assets/*.js', (route) => route.abort());
    await page.goto('./', { waitUntil: 'commit' });
    await expect(page.locator('.intro')).toBeHidden({ timeout: 4000 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('hero is painted underneath from the start', async ({ page }) => {
    await page.goto('./', { waitUntil: 'commit' });
    await page.waitForSelector('.hero img', { state: 'attached' });
    await expect(page.locator('.hero img')).toHaveCSS('opacity', '1');
  });

  test('deep links bypass it', async ({ page }) => {
    await page.goto('./#contact');
    await expect(page.locator('.intro')).toBeHidden();
    await expect(page.locator('#contact h2')).toBeInViewport({ timeout: 4000 });
  });
});

test('every in-page link has a target and arrives there', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')!))]);
  expect(hrefs.length).toBeGreaterThan(15);
  for (const href of hrefs) {
    await expect(page.locator(href), href).toHaveCount(1);
  }
  for (const href of ['#services', '#asphalt', '#experience', '#quality', '#partners', '#contact']) {
    await page.locator(`.site-header__nav a[href="${href}"], .site-header__cta[href="${href}"]`).first().click();
    await expect(page.locator(`${href} h2`).first()).toBeInViewport({ timeout: 6000 });
  }
});

test('contact links are exact', async ({ page }) => {
  await open(page);
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a')].map((a) => a.getAttribute('href') ?? ''));
  for (const expected of [
    'tel:+962780519993',
    'https://wa.me/962786019800',
    'mailto:arvoncontracting@gmail.com',
    'https://www.facebook.com/share/19ysBqVHBR/',
    'https://www.instagram.com/arvon.jo/',
  ]) {
    expect(hrefs, expected).toContain(expected);
  }
  expect(hrefs.join(' ')).not.toMatch(/linkedin/i);
  const body = await page.locator('body').innerText();
  expect(body).toContain('0780519993');
  expect(body).toContain('0786019800');
});

test('meeting request opens the exact prefilled email', async ({ page }) => {
  await open(page);
  const href = await page.getByRole('link', { name: 'حجز عرض تعريفي للشركة' }).getAttribute('href');
  const url = new URL(href!);
  expect(url.protocol).toBe('mailto:');
  expect(url.pathname).toBe('arvoncontracting@gmail.com');
  expect(url.searchParams.get('subject')).toBe('طلب اجتماع تعريفي مع ARVON CONTRACTING');
  const body = url.searchParams.get('body')!;
  for (const line of ['السادة شركة أرفون المحترمين،', 'اسم الشركة:', 'اسم مسؤول التواصل:', 'رقم الهاتف:', 'الموعد المقترح:', 'مع الشكر.']) {
    expect(body).toContain(line);
  }
});

test('quote dialog prepares a WhatsApp message and claims nothing', async ({ page, context }) => {
  await open(page);
  const trigger = page.locator('#partners').getByRole('link', { name: 'طلب عرض سعر' });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'طلب عرض سعر' });
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'متابعة عبر واتساب' }).click();
  await expect(dialog).toBeVisible(); // required fields block sending

  await dialog.getByLabel('الاسم').fill('سامي');
  await dialog.getByLabel('رقم الهاتف').fill('0790000000');
  await dialog.getByLabel('الخدمة المطلوبة').selectOption({ label: 'صبة الميلان' });
  await context.route(/wa\.me|api\.whatsapp\.com/, (route) => route.fulfill({ status: 200, body: 'ok' }));
  const popup = context.waitForEvent('page');
  await dialog.getByRole('button', { name: 'متابعة عبر واتساب' }).click();
  const message = new URL((await popup).url()).searchParams.get('text');
  expect(message).toContain('سامي');
  expect(message).toContain('صبة الميلان');
  await expect(dialog).toBeHidden();
  await expect(page.locator('body')).not.toContainText(/تم الإرسال|شكرًا لتواصلك/);
});

test('service quote link preselects its service, Escape closes, focus returns', async ({ page }) => {
  await open(page);
  const link = page.locator('#service-power-trowel').getByRole('link', { name: 'اطلب عرض سعر لهذه الخدمة' });
  await link.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('الخدمة المطلوبة')).toHaveValue('power-trowel');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(link).toBeFocused();
});

test('mobile menu traps focus, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 });
  await open(page);
  const toggle = page.getByRole('button', { name: 'فتح القائمة' });
  await toggle.click();
  const menu = page.locator('dialog.mobile-menu');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole('link', { name: 'خبراتنا' }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#experience h2')).toBeInViewport({ timeout: 6000 });
});

for (const delay of [0, 120, 200, 280, 400]) {
  test(`anchor jump survives motion starting ${delay}ms after the first tap`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await open(page);
    await page.getByRole('button', { name: 'فتح القائمة' }).click();
    const menu = page.locator('dialog.mobile-menu');
    await page.waitForTimeout(delay);
    await menu.getByRole('link', { name: 'خبراتنا' }).click();
    await expect(page.locator('#experience h2')).toBeInViewport({ timeout: 6000 });
  });
}

test('skip link and keyboard focus are visible', async ({ page }) => {
  await open(page);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'الانتقال إلى المحتوى' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).toBe('solid');
});

test('all ten photographs load in their correct sections', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 });
  await open(page);
  await scrollThrough(page);
  const map: Record<string, string> = {
    '.hero': 'amman-skyline',
    '#service-hot-asphalt': 'hot-asphalt',
    '#service-membranes': 'bitumen-membranes',
    '#asphalt .road__photo': 'asphalt-paving',
    '#service-foundation': 'foundation',
    '#service-thermal': 'thermal-insulation',
    '#service-underfloor': 'underfloor',
    '#concrete .service-row:nth-of-type(1)': 'slope-screed',
    '#concrete .service-row:nth-of-type(2)': 'power-trowel',
    '#polyurethane': 'polyurethane',
  };
  for (const [selector, id] of Object.entries(map)) {
    const img = page.locator(`${selector} img`).first();
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), selector).toBe(true);
    const current = await img.evaluate((el: HTMLImageElement) => el.currentSrc);
    expect(current, selector).toContain(id);
    expect((await img.getAttribute('alt'))!.length, selector).toBeGreaterThan(15);
  }
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
});

test('desktop stage shows every waterproofing photograph in turn', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await startMotion(page);
  const panels = page.locator('.systems__list .service');
  for (let i = 0; i < 5; i += 1) {
    await panels.nth(i).evaluate((el) => {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45, behavior: 'instant' });
    });
    await expect.poll(() => page.locator('.stage__plate.is-active').count()).toBe(i + 1);
    await expect.poll(() => page.locator('.stage__plate.is-active img').last().evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test('reverse scroll restores every section with nothing stranded', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await startMotion(page);
  await scrollThrough(page);
  await scrollThrough(page, undefined, 'up');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await expect(page.locator('h1')).toBeInViewport();
  await scrollThrough(page);
  await page.waitForTimeout(1000);
  const faded = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('#contact [data-reveal], #partners [data-reveal]')].filter((el) => {
      const box = el.getBoundingClientRect();
      return box.bottom < 0 && Number(getComputedStyle(el).opacity) < 1;
    }).length,
  );
  expect(faded).toBe(0);
});

test('page runs with no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => errors.push(`failed ${request.url()}`));
  await page.goto('./');
  await page.waitForTimeout(2400);
  await scrollThrough(page);
  expect(errors).toEqual([]);
});
