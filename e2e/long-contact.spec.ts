import { expect, test } from '@playwright/test';
test('long valid contact details remain readable in narrow review and confirmation', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(2026, 10, 3, 12));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/booking');
  await page.getByLabel(/^Arrival/).fill('2026-11-04');
  await page.getByLabel(/^Departure/).fill('2026-11-07');
  await page.getByRole('button', { name: 'Find my room', exact: true }).click();
  await page.getByRole('radio', { name: /The Olive Room/ }).check();
  await page
    .getByRole('button', { name: 'A few details', exact: true })
    .click();
  const name = 'Alexandria'.repeat(10);
  await page.getByLabel(/^Your name/).fill(name);
  await page
    .getByLabel(/^Email address/)
    .fill('a'.repeat(64) + '@' + 'sub.'.repeat(10) + 'example.com');
  await page
    .getByRole('checkbox', { name: /I understand this is a simulated stay/ })
    .check();
  await page
    .getByRole('button', { name: 'Review my stay', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Take one last look.', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page
    .getByRole('button', { name: 'Complete demo stay', exact: true })
    .click();
  await expect(
    page.getByText(
      `Thank you, ${name}. You’ve completed your Maison Sol experience.`,
    ),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
