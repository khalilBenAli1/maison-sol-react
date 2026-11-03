import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const storageKey = 'maison-sol:preferences:v1';

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 3, 12));
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function openRoute(page: Page, route: string) {
  await page.goto(`./#${route}`);
  await expect(
    page.getByRole('main').getByRole('heading', { level: 1 }),
  ).toBeVisible();
}

async function chooseDates(page: Page, arrival: string, departure: string) {
  await page.getByLabel(/^Arrival/).fill(arrival);
  await page.getByLabel(/^Departure/).fill(departure);
  await page.getByLabel(/^Guests/).selectOption('2');
}

test('room filters live in the URL; saved rooms survive reload and reset', async ({
  page,
}) => {
  await openRoute(page, '/rooms');
  await page.getByLabel(/^Guests/).selectOption('3');
  await page.getByLabel(/^A little extra/).selectOption('Sea view');
  await page.getByLabel('Sort rooms').selectOption('price-desc');
  await expect(
    page.getByRole('status').filter({ hasText: '1 stay' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'The Sol Residence' }),
  ).toBeVisible();
  await expect(page).toHaveURL(/capacity=3/);
  await expect(page).toHaveURL(/amenity=Sea\+view/);
  await expect(page).toHaveURL(/sort=price-desc/);
  await page.reload();
  await expect(page.getByLabel(/^Guests/)).toHaveValue('3');
  await expect(page.getByLabel(/^A little extra/)).toHaveValue('Sea view');
  await expect(page.getByLabel('Sort rooms')).toHaveValue('price-desc');

  await page
    .getByRole('button', { name: 'Save The Sol Residence', exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Unsave The Sol Residence' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Saved \(1\)/ }).click();
  await expect(page).toHaveURL(/saved=true/);
  await expect(page.getByRole('article')).toHaveCount(1);

  await page
    .getByRole('button', { name: 'Reset filters', exact: true })
    .click();
  await expect(page).toHaveURL(/#\/rooms$/);
  await expect(page.getByLabel(/^Guests/)).toHaveValue('1');
  await expect(page.getByLabel(/^A little extra/)).toHaveValue('');
  await expect(page.getByLabel('Sort rooms')).toHaveValue('recommended');
  await expect(
    page.getByRole('button', { name: /Saved \(1\)/ }),
  ).toHaveAttribute('aria-pressed', 'false');
  await page.getByLabel(/^Guests/).selectOption('4');
  await expect(page).toHaveURL(/#\/rooms\?capacity=4$/);
  const budget = page.getByRole('slider', { name: 'Maximum nightly price' });
  await budget.focus();
  await budget.press('Home');
  await expect(budget).toHaveValue('20000');
  await expect(page).toHaveURL(/maxPrice=20000/);
  await expect(
    page.getByText('Up to €200 / night', { exact: true }),
  ).toBeVisible();
  for (let index = 1; index <= 5; index += 1) {
    await budget.press('ArrowRight');
    await expect(budget).toHaveValue(String(20000 + index * 1000));
    await expect(page).toHaveURL(
      new RegExp(`maxPrice=${20000 + index * 1000}`),
    );
    await expect(
      page.getByText(`Up to €${200 + index * 10} / night`, { exact: true }),
    ).toBeVisible();
  }
  await expect(page).toHaveURL(/maxPrice=25000/);
  await expect(
    page.getByRole('heading', {
      name: 'A different view might be just right.',
    }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Explore all rooms', exact: true })
    .click();
  await expect(page.getByRole('article')).toHaveCount(4);

  await page
    .getByRole('button', { name: 'Reset my stay & saved rooms' })
    .click();
  const reset = page.getByRole('dialog', { name: 'A fresh start?' });
  await reset
    .getByRole('button', { name: 'Reset my choices', exact: true })
    .click();
  await expect(reset).not.toBeVisible();
  await expect(page.getByRole('button', { name: /Saved \(0\)/ })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Save The Sol Residence', exact: true }),
  ).toBeVisible();
});

test('a direct room link opens a keyboard-operable gallery and restores focus', async ({
  page,
}) => {
  await openRoute(page, '/rooms/olive-room');
  await page.reload();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'The Olive Room',
      exact: true,
    }),
  ).toBeVisible();
  const trigger = page.getByRole('button', {
    name: 'Open The Olive Room gallery',
  });
  await trigger.focus();
  await trigger.press('Enter');
  const gallery = page.getByRole('dialog', { name: 'A closer look' });
  await expect(gallery).toBeVisible();
  await expect(
    gallery.getByText('1 / 2 · The Olive Room', { exact: true }),
  ).toBeVisible();
  await gallery.getByRole('button', { name: 'Next photograph' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    gallery.getByRole('img', {
      name: 'The house & pool · shared outdoor spaces',
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(
    gallery.getByText('1 / 2 · The Olive Room', { exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(gallery).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('editing an existing departure from the homepage preserves the arrival', async ({
  page,
}) => {
  await openRoute(page, '/');
  await page
    .getByRole('button', { name: 'Arrival Select date', exact: true })
    .click();
  const calendar = page.getByRole('dialog', {
    name: 'Make time for yourself',
    exact: true,
  });
  await calendar.getByRole('button', { name: /\b4 November 2026$/ }).click();
  await calendar.getByRole('button', { name: /\b7 November 2026$/ }).click();
  await expect(calendar).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Arrival 4 Nov', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Departure 7 Nov', exact: true })
    .click();
  await expect(
    calendar.getByText('Now choose your departure. Up to 30 nights.', {
      exact: true,
    }),
  ).toBeVisible();
  await calendar.getByRole('button', { name: /\b8 November 2026$/ }).click();
  await expect(calendar).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Arrival 4 Nov', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Departure 8 Nov', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Arrival 4 Nov', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Departure 8 Nov', exact: true }),
  ).toBeVisible();
});

test('a recoverable stay validates dates and contact, then completes with exact sample totals', async ({
  page,
}) => {
  await openRoute(page, '/booking');
  await chooseDates(page, '2026-11-02', '2026-11-04');
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await expect(
    page.getByText('Arrival must be today or later.', { exact: true }),
  ).toBeVisible();
  await chooseDates(page, '2026-11-04', '2026-11-04');
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await expect(
    page.getByText('Departure must be after arrival.', { exact: true }),
  ).toBeVisible();

  await chooseDates(page, '2026-11-04', '2026-11-07');
  await page.reload();
  await expect(page.getByLabel(/^Arrival/)).toHaveValue('2026-11-04');
  await expect(page.getByLabel(/^Departure/)).toHaveValue('2026-11-07');
  await page.getByRole('button', { name: 'Find my room', exact: true }).focus();
  await page.keyboard.press('Enter');
  const olive = page.getByRole('radio', { name: /The Olive Room/ });
  await olive.focus();
  await page.keyboard.press('Space');
  await expect(olive).toBeChecked();
  await page
    .getByRole('button', { name: 'A few details', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'A few little details.', exact: true }),
  ).toBeFocused();

  await page
    .getByRole('button', { name: 'Review my stay', exact: true })
    .click();
  await expect(
    page.getByText('Please enter a valid email address.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel(/^Your name/)).toBeFocused();
  await page
    .getByRole('button', { name: 'Use sample details', exact: true })
    .click();
  await expect(page.getByLabel(/^Your name/)).toHaveValue('Alex Morgan');
  await expect(page.getByLabel(/^Email address/)).toHaveValue(
    'alex@example.com',
  );
  const consent = page.getByRole('checkbox', {
    name: /I understand this is a simulated stay/,
  });
  await consent.focus();
  await page.keyboard.press('Space');
  await page
    .getByRole('button', { name: 'Review my stay', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Take one last look.', exact: true }),
  ).toBeFocused();
  const summary = page.getByRole('complementary');
  for (const amount of ['€720', '€72', '€18', '€810']) {
    await expect(summary.getByText(amount, { exact: true })).toBeVisible();
  }
  const stored = await page.evaluate(
    (key) => localStorage.getItem(key),
    storageKey,
  );
  expect(stored).not.toContain('Alex');
  expect(stored).not.toContain('alex@example.com');
  expect(stored).not.toContain('email');
  await page
    .getByRole('button', { name: 'Complete demo stay', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: /That slower stay/ }),
  ).toBeFocused();
  await expect(page.getByText(/3 nights · 2 guests · €810/)).toBeVisible();
  await expect(
    page.getByText(
      /No room was reserved, no payment was taken, and no email was sent/,
    ),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Reset my stay & saved rooms', exact: true })
    .click();
  await page
    .getByRole('dialog', { name: 'A fresh start?', exact: true })
    .getByRole('button', { name: 'Reset my choices', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: /That slower stay/ }),
  ).toBeVisible();
  await expect(page.getByText(/3 nights · 2 guests · €810/)).toBeVisible();
  await page
    .getByRole('button', { name: 'Imagine another stay', exact: true })
    .click();
  await expect(page.getByLabel(/^Arrival/)).toHaveValue('');
  await expect(page.getByLabel(/^Departure/)).toHaveValue('');
});

test('the calendar respects occupied nights, past dates and month-boundary navigation', async ({
  page,
}) => {
  await openRoute(page, '/rooms/olive-room');
  await page
    .getByRole('link', { name: 'Choose your dates', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /\b2 November 2026$/ }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: /10 November 2026.*occupied night/ }),
  ).toBeDisabled();
  await page.getByRole('button', { name: /30 November 2026/ }).click();
  await page.getByRole('button', { name: 'Next month', exact: true }).click();
  await page.getByRole('button', { name: /\b3 December 2026$/ }).click();
  await expect(page.getByLabel(/^Arrival/)).toHaveValue('2026-11-30');
  await expect(page.getByLabel(/^Departure/)).toHaveValue('2026-12-03');
  await page
    .getByRole('button', { name: 'Previous month', exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'When shall we welcome you?',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText('November 2026', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await expect(
    page.getByRole('radio', { name: /The Olive Room/ }),
  ).toBeVisible();
});

test('the mobile menu supports Escape, focus restoration and real navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openRoute(page, '/');
  const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
  await trigger.focus();
  await trigger.press('Enter');
  const menu = page.getByRole('dialog', {
    name: 'Take your time',
    exact: true,
  });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await menu
    .getByRole('navigation', { name: 'Mobile', exact: true })
    .getByRole('link', { name: 'The rooms', exact: true })
    .click();
  await expect(page).toHaveURL(/#\/rooms$/);
  await expect(
    page.getByRole('heading', { level: 1, name: /Find your kind of quiet/ }),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('main routes have no automated WCAG A/AA findings', async ({ page }) => {
  for (const route of ['/', '/rooms', '/rooms/olive-room', '/booking']) {
    await test.step(route, async () => {
      await openRoute(page, route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test('key layouts reflow at 390, 768 and 1440 pixels without horizontal overflow', async ({
  page,
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/rooms', '/booking']) {
      await test.step(`${route} at ${width}px`, async () => {
        await openRoute(page, route);
        const dimensions = await page.evaluate(() => ({
          content: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth,
        }));
        expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
      });
    }
  }
});
