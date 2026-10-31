import { expect, test } from '@playwright/test';
import { open, scrollThrough } from './helpers';

test.describe('intro', () => {
  test('plays once, about three seconds, then does not replay', async ({ page }) => {
    await page.goto('./', { waitUntil: 'commit' });
    const started = Date.now();
    await expect(page.locator('.intro')).toBeVisible();
    await expect(page.getByText('أهلًا وسهلًا بكم', { exact: true })).toBeVisible();
    await expect(page.locator('.intro')).toHaveCount(0, { timeout: 6000 });
    expect(Date.now() - started).toBeLessThan(4500);
    await expect(page.locator('h1')).toBeVisible();
    await page.reload();
    await page.waitForTimeout(400);
    await expect(page.locator('.intro')).toHaveCount(0);
  });

  test('skip button ends it at once', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'تخطي المقدمة' }).click();
    await expect(page.locator('.intro')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCSS('opacity', '1', { timeout: 1500 });
  });

  test('deep links bypass it', async ({ page }) => {
    await page.goto('./#contact');
    await expect(page.locator('.intro')).toHaveCount(0);
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
  const link = page.locator('#service-power-trowel').getByRole('link', { name: 'طلب عرض سعر لهذه الخدمة' });
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

test('skip link and keyboard focus are visible', async ({ page }) => {
  await open(page);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'تخطَّ إلى المحتوى' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).toBe('solid');
});

test('all seven photographs load in their correct sections', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 });
  await open(page);
  await scrollThrough(page);
  const map: Record<string, string> = {
    '.hero': 'amman-skyline',
    '#service-hot-asphalt': 'hot-asphalt',
    '#service-membranes': 'bitumen-membranes',
    '#asphalt .road__photo': 'asphalt-paving',
    '[id="concrete"] .concrete__row:nth-of-type(1)': 'slope-screed',
    '[id="concrete"] .concrete__row:nth-of-type(2)': 'power-trowel',
    '#service-polyurethane': 'polyurethane',
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

test('reverse scroll restores every section with nothing stranded', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
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
  await page.waitForTimeout(3600);
  await scrollThrough(page);
  expect(errors).toEqual([]);
});
