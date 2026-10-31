import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { open } from './helpers';

test('company facts are exact', async ({ page }) => {
  await open(page);
  const body = await page.locator('body').innerText();
  for (const fact of [
    'المهندس عبد العزيز الجوهري',
    'صهيب القيسي',
    'أرفون للمقاولات الإنشائية',
    'جميع محافظات المملكة الأردنية الهاشمية',
    'حلول متخصصة في العزل المائي والحراري والأعمال الأسفلتية',
    'نسعى إلى توسيع نطاق خدماتنا',
    'كفالة خطية من أرفون',
    'ARVON WRITTEN WARRANTY',
    'استكشف خدماتنا',
    'تواصل عبر واتساب',
  ]) {
    expect(body, fact).toContain(fact);
  }
});

test('all nine services are present with their exact titles', async ({ page }) => {
  await open(page);
  const titles = await page.locator('[id^="service-"] h3, #asphalt h2').allInnerTexts();
  for (const title of [
    'العزل بالزفتة الساخنة', 'العزل برولات البيتومين', 'الخلطات الأسفلتية وتعبيد الطرق', 'عزل أساسات المباني',
    'العزل الحراري', 'عزل ما تحت الأرضيات', 'عزل البولي يوريثان', 'صبة الميلان', 'صبة المروحية',
  ]) {
    expect(titles, title).toContain(title);
  }
});

test('experience stays in the required order', async ({ page }) => {
  await open(page);
  expect(await page.locator('.experience__name').allInnerTexts()).toEqual([
    'مجمع الملك الحسين للأعمال', 'شركة إسكانات زمزم', 'حلويات نفيسة', 'وغيرها من المشاريع',
  ]);
});

test('technical wording matches the brief', async ({ page }) => {
  await open(page);
  const hot = await page.locator('#service-hot-asphalt').innerText();
  expect(hot).toContain('80/100');
  expect(hot).toContain('60/70');
  expect(hot).toContain('لا يُنشئ ميلان');
  const membranes = await page.locator('#service-membranes').innerText();
  for (const term of ['APP', 'SBS', '3 مم', '4 مم', '5 مم', 'ولا ينطبق تلقائيًا']) expect(membranes, term).toContain(term);
  expect(await page.locator('#service-foundation').innerText()).toContain('ليس كل نظام مناسب للأسطح');
  expect(await page.locator('#service-power-trowel').innerText()).toContain('لا عملية صب');
  expect(await page.locator('#service-asphalt-paving').innerText()).toContain('البيتومين مع الركام');
});

test('source contains no unverified claims or placeholders', async ({ page }) => {
  await open(page);
  const text = (await page.locator('body').innerText()) + readFileSync('index.html', 'utf8');
  const forbidden = [
    /lorem/i, /todo/i, /placeholder/i, /ipsum/i, /ISO\s?\d*/, /\bCE\b/, /أيزو/, /الأكبر/, /الأول في/, /رقم 1/,
    /testimonial/i, /شهادة عميل/, /سنوات خبرة/, /\+\d+ مشروع/, /سنة كفالة/, /\d+\s*سنوات/, /مسجل/, /opening ?hours/i, /aggregateRating/,
  ];
  for (const pattern of forbidden) expect(text, String(pattern)).not.toMatch(pattern);
});

test('warranty illustration is labelled and carries no specifics', async ({ page }) => {
  await open(page);
  const certificate = await page.locator('.certificate').innerText();
  expect(certificate).toContain('تصوّر توضيحي');
  expect(certificate).toContain('وليس وثيقة صادرة');
  expect(certificate).not.toMatch(/\d/);
});

test('metadata is complete', async ({ page }) => {
  await open(page);
  await expect(page).toHaveTitle(/أرفون/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://arvoncontracting.github.io/arvon/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.jpg$/);
  const levels = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4')].filter((h) => !h.closest('dialog')).map((h) => Number(h.tagName[1])));
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(structured['@type']).toBe('Organization');
  expect(structured).not.toHaveProperty('address');
});

test('prerendered HTML carries the content before scripts run', async ({ request, baseURL }) => {
  const html = await (await request.get(baseURL!)).text();
  expect(html).toContain('حلول متخصصة في العزل المائي');
  expect(html).toContain('مجمع الملك الحسين للأعمال');
});

test('site works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#contact h2')).toBeVisible();
  await context.close();
});

test('logo keeps its minimum width and true proportions', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await open(page);
  const logos = await page.evaluate(() =>
    [...document.querySelectorAll<SVGSVGElement>('.site-header__logo svg, .hero__logo, .certificate__logo, .site-footer__logo')].map((svg) => {
      const style = getComputedStyle(svg);
      const [boxWidth, boxHeight] = [parseFloat(style.width), parseFloat(style.height)];
      const { width, height } = svg.viewBox.baseVal;
      return { width: boxWidth, ratio: boxWidth / boxHeight, source: width / height };
    }),
  );
  expect(logos.length).toBeGreaterThanOrEqual(4);
  for (const logo of logos) {
    expect(logo.width).toBeGreaterThanOrEqual(140);
    expect(Math.abs(logo.ratio - logo.source)).toBeLessThan(0.03);
  }
});

test('stylesheet defines the exact brand palette', async ({ page }) => {
  await open(page);
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ['--orange', '--charcoal', '--stone', '--sand', '--white'].map((name) => style.getPropertyValue(name).trim().toLowerCase());
  });
  expect(tokens.map((color) => color.replace('#fff', '#ffffff').replace('#ffffffff', '#ffffff'))).toEqual(['#e65a1f', '#1f2326', '#6b6f72', '#d9c6a2', '#ffffff']);
});
