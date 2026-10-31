import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const [name, width] of [['desktop', 1440], ['mobile', 390]] as const) {
  test(`axe finds no violations on ${name}`, async ({ browser }) => {
    test.skip(browser.browserType().name() !== 'chromium', 'axe sweep runs once');
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto('./', { waitUntil: 'load' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 4).map((n) => n.target.join(' ')).join(', ')}`);
    expect(summary).toEqual([]);
    await context.close();
  });
}
