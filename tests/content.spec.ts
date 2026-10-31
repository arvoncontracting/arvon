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
    'نُتقن العزل.',
  ]) {
    expect(body, fact).toContain(fact);
  }
});

test('all nine services are present, numbered in the required order', async ({ page }) => {
  await open(page);
  expect(await page.locator('.showcase__title').allInnerTexts()).toEqual([
    'العزل بالزفتة الساخنة', 'العزل برولات البيتومين', 'عزل الأساسات', 'العزل الحراري', 'عزل Underfloor',
    'صبة الميلان', 'صبة المروحية', 'الخلطات الأسفلتية وتعبيد الطرق', 'عزل البولي يوريثان',
  ]);
  await expect(page.locator('#service-underfloor h3')).toHaveText('عزل Underfloor');
  await expect(page.locator('#service-polyurethane h3')).toHaveText('عزل البولي يوريثان');
  await expect(page.locator('#service-underfloor h3 [lang="en"]')).toHaveText('Underfloor');
});

test('experience stays in the required order', async ({ page }) => {
  await open(page);
  expect(await page.locator('.experience__name').allInnerTexts()).toEqual([
    'مجمع الملك الحسين للأعمال', 'شركة إسكانات زمزم', 'حلويات نفيسة', 'وغيرها من المشاريع',
  ]);
});

test('asphalt timeline wording is exact and qualified', async ({ page }) => {
  await open(page);
  expect(await page.locator('.timeline__stage h4').allInnerTexts()).toEqual([
    'تقييم الموقع وتجهيز السطح', 'تنفيذ طبقة Base Course', 'رش مادة MC', 'فرد الخلطة الأسفلتية', 'الدمك والتشطيب النهائي',
  ]);
  const text = await page.locator('.asphalt__process').innerText();
  expect(text).toContain('عند الحاجة');
  expect(text).toContain('عندما يتطلب نظام الرصف ذلك');
  expect(text).toContain('MC (Prime Coat)');
  expect(text).toContain('توضيحية');
  await expect(page.locator('.timeline [lang="en"]', { hasText: 'Base Course' }).first()).toBeAttached();
  await expect(page.locator('.timeline__stage h4 [lang="en"]', { hasText: /^MC$/ })).toBeAttached();
  const uses = await page.locator('.asphalt__uses li').allInnerTexts();
  expect(uses).toEqual(['الطرق الداخلية', 'الطرق', 'الساحات', 'مواقف السيارات']);
});

test('membrane details are qualified, foundation and trowel stay accurate', async ({ page }) => {
  await open(page);
  const membranes = await page.locator('#service-membranes').innerText();
  for (const term of ['APP', 'SBS', '3 مم', '4 مم', '5 مم', '1 م × 10 م', 'حيثما ينطبق', 'من منتج إلى آخر']) expect(membranes, term).toContain(term);
  expect(await page.locator('#service-foundation').innerText()).toContain('لا يصلح كل نظام');
  expect(await page.locator('#service-power-trowel').innerText()).toContain('تلي صب الخرسانة');
  expect(await page.locator('#service-slope-screed').innerText()).toContain('يسبق العزل');
});

test('hot asphalt carries no grade, origin or supplier anywhere', async ({ page, request, baseURL }) => {
  await open(page);
  await expect(page.locator('#service-hot-asphalt h3')).toHaveText('العزل بالزفتة الساخنة');
  const html = await (await request.get(baseURL!)).text();
  const sources = [html, readFileSync('src/content/ar.ts', 'utf8'), readFileSync('index.html', 'utf8')];
  for (const source of sources) {
    for (const pattern of [/80\/100/, /60\/70/, /مصفاة/, /Refinery/i, /عراقي/, /Iraq/i, /بيتومين أردني/, /غرز/, /penetration/i, /softening/i, /تليين/]) {
      expect(source, String(pattern)).not.toMatch(pattern);
    }
  }
  await expect(page.locator('.service__note')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('تنويه فني');
});

test('first content section uses the new message', async ({ page }) => {
  await open(page);
  await expect(page.locator('#identity h2')).toHaveText('نُتقن العزل.ونُنجز أعمال الطرق.');
  await expect(page.locator('body')).not.toContainText('طبقات لها وظيفة');
});

test('source contains no unverified claims or placeholders', async ({ page }) => {
  await open(page);
  const text = (await page.locator('body').innerText()) + readFileSync('index.html', 'utf8');
  const forbidden = [
    /lorem/i, /todo/i, /ipsum/i, /ISO\s?\d*/, /\bCE\b/, /أيزو/, /الأكبر/, /الأول في/, /رقم 1/,
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
  expect(html).not.toContain('<link rel="stylesheet"');
});

test('site works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#contact h2')).toBeVisible();
  await context.close();
});

test('header shows the English logo at a legal size, fully inside the bar', async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 700 });
    await open(page);
    const logo = await page.evaluate(() => {
      const svg = document.querySelector<SVGSVGElement>('.site-header__logo svg')!;
      const box = svg.getBoundingClientRect();
      const bar = document.querySelector('.site-header')!.getBoundingClientRect();
      const refs = [...svg.querySelectorAll('use')].map((use) => use.getAttribute('href'));
      return { width: box.width, top: box.top - bar.top, bottom: bar.bottom - box.bottom, ratio: box.width / box.height, source: svg.viewBox.baseVal.width / svg.viewBox.baseVal.height, refs, left: box.left, right: box.right };
    });
    expect(logo.width).toBeGreaterThanOrEqual(140);
    expect(logo.top).toBeGreaterThan(0);
    expect(logo.bottom).toBeGreaterThan(0);
    expect(logo.left).toBeGreaterThanOrEqual(0);
    expect(logo.right).toBeLessThanOrEqual(width);
    expect(Math.abs(logo.ratio - logo.source)).toBeLessThan(0.05);
    expect(logo.refs).toContain('#lg-word');
  }
  await expect(page.locator('#lg-word')).toBeAttached();
});

test('stylesheet defines the exact brand palette', async ({ page }) => {
  await open(page);
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ['--orange', '--charcoal', '--stone', '--sand', '--white'].map((name) => style.getPropertyValue(name).trim().toLowerCase());
  });
  expect(tokens.map((color) => color.replace('#fff', '#ffffff').replace('#ffffffff', '#ffffff'))).toEqual(['#e65a1f', '#1f2326', '#6b6f72', '#d9c6a2', '#ffffff']);
});
