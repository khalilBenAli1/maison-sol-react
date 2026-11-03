import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.DEMO_URL || 'http://127.0.0.1:4178/maison-sol-react/';
const browser = await chromium.launch();
const report = [];
try {
  for (const [name, route, width, height, fullPage] of [
    ['home-desktop', '', 1440, 1000, false],
    ['home-mobile', '', 390, 844, false],
    ['home-full', '', 1440, 1000, true],
    ['rooms-desktop', '#/rooms', 1440, 1000, true],
    ['rooms-mobile', '#/rooms', 390, 844, false],
    ['room-desktop', '#/rooms/terrace-suite', 1440, 1000, false],
    ['booking-desktop', '#/booking', 1440, 1000, false],
    ['booking-mobile', '#/booking', 390, 844, false],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.clock.setFixedTime(new Date(2026, 10, 3, 12));
    await page.goto(base + route);
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map(async (image) => {
          image.loading = 'eager';
          await image.decode();
        }),
      );
    });
    await mkdir('docs/screenshots', { recursive: true });
    await page.screenshot({
      path: `docs/screenshots/${name}.jpg`,
      type: 'jpeg',
      quality: 85,
      fullPage,
      animations: 'disabled',
    });
    report.push({
      name,
      width,
      height,
      fullPage,
      errors,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      imageFailures: await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => image.complete && !image.naturalWidth)
            .map((image) => image.src),
        ),
    });
    await context.close();
  }
  await writeFile(
    'docs/screenshots/capture-report.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
