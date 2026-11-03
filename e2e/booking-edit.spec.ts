import { expect, test } from '@playwright/test';

const storageKey = 'maison-sol:preferences:v1';

test('review edits recalculate the stay while contact details last only until leaving booking', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(2026, 10, 3, 12));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/booking');
  await page.getByLabel(/^Arrival/).fill('2026-11-04');
  await page.getByLabel(/^Departure/).fill('2026-11-07');
  await page.getByLabel(/^Guests/).selectOption('2');
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await page.getByRole('radio', { name: /The Olive Room/ }).check();
  await page
    .getByRole('button', { name: 'A few details', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Use sample details', exact: true })
    .click();
  const consent = page.getByRole('checkbox', {
    name: /I understand this is a simulated stay/,
  });
  await consent.check();
  await page
    .getByRole('button', { name: 'Review my stay', exact: true })
    .click();
  const summary = page.getByRole('complementary');
  await expect(summary.getByText('€810', { exact: true })).toBeVisible();

  await page
    .getByRole('definition')
    .filter({ hasText: '4 Nov' })
    .getByRole('button', { name: 'Edit', exact: true })
    .click();
  await expect(page.getByLabel(/^Arrival/)).toHaveValue('2026-11-04');
  await page.getByLabel(/^Departure/).fill('2026-11-08');
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await page.getByRole('radio', { name: /The Garden Studio/ }).check();
  await page
    .getByRole('button', { name: 'A few details', exact: true })
    .click();
  await expect(page.getByLabel(/^Your name/)).toHaveValue('Alex Morgan');
  await expect(page.getByLabel(/^Email address/)).toHaveValue(
    'alex@example.com',
  );
  await expect(consent).toBeChecked();
  await page
    .getByRole('button', { name: 'Review my stay', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Take one last look.', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('definition').filter({ hasText: 'The Garden Studio' }),
  ).toBeVisible();
  await expect(
    page.getByRole('definition').filter({ hasText: '4 Nov — 8 Nov 2026' }),
  ).toBeVisible();
  await expect(
    summary.getByText('€290 × 4 nights', { exact: true }),
  ).toBeVisible();
  for (const amount of ['€1,160', '€116', '€24', '€1,300']) {
    await expect(summary.getByText(amount, { exact: true })).toBeVisible();
  }

  await page
    .getByRole('definition')
    .filter({ hasText: 'Alex Morgan' })
    .getByRole('button', { name: 'Edit', exact: true })
    .click();
  await page.getByLabel(/^Your name/).fill('Taylor Brooks');
  await page
    .getByRole('button', { name: 'Review my stay', exact: true })
    .click();
  await expect(
    page.getByRole('definition').filter({ hasText: 'Taylor Brooks' }),
  ).toContainText('alex@example.com');
  await expect(summary.getByText('€1,300', { exact: true })).toBeVisible();
  const storedBeforeLeaving = await page.evaluate(
    (key) => localStorage.getItem(key),
    storageKey,
  );
  expect(storedBeforeLeaving).not.toContain('Taylor');
  expect(storedBeforeLeaving).not.toContain('Alex');
  expect(storedBeforeLeaving).not.toContain('alex@example.com');
  expect(storedBeforeLeaving).not.toContain('email');

  await page
    .getByRole('link', { name: '← Back to the rooms', exact: true })
    .click();
  await expect(page).toHaveURL(/#\/rooms$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Find your kind of quiet.' }),
  ).toBeVisible();
  await page.goto('./#/booking');
  await expect(page.getByLabel(/^Arrival/)).toHaveValue('2026-11-04');
  await expect(page.getByLabel(/^Departure/)).toHaveValue('2026-11-08');
  await expect(page.getByLabel(/^Guests/)).toHaveValue('2');
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await expect(
    page.getByRole('radio', { name: /The Garden Studio/ }),
  ).toBeChecked();
  await page
    .getByRole('button', { name: 'A few details', exact: true })
    .click();
  await expect(page.getByLabel(/^Your name/)).toHaveValue('');
  await expect(page.getByLabel(/^Email address/)).toHaveValue('');
  await expect(consent).not.toBeChecked();
  const storedAfterReturning = await page.evaluate(
    (key) => localStorage.getItem(key),
    storageKey,
  );
  expect(storedAfterReturning).not.toContain('Taylor');
  expect(storedAfterReturning).not.toContain('alex@example.com');
  expect(storedAfterReturning).not.toContain('email');
});
