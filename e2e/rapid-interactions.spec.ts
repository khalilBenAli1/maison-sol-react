import { expect, test } from '@playwright/test';
test('a delayed native close notification cannot dismiss a newly reopened menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/');
  const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
  const dialog = page.getByRole('dialog', {
    name: 'Take your time',
    exact: true,
  });
  await trigger.focus();
  await trigger.press('Enter');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await trigger.focus();
  await trigger.press('Enter');
  await expect(dialog).toBeVisible();
  await dialog.evaluate((node) => node.dispatchEvent(new Event('close')));
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test('rapid filter changes preserve each selection in the URL and after reload', async ({
  page,
}) => {
  await page.goto('./#/rooms');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('main').evaluate((main) => {
    const select = (label: string, value: string) => {
      const element = [...main.querySelectorAll('label')]
        .find((node) => node.textContent?.startsWith(label))
        ?.querySelector('select');
      if (!element) throw Error('Missing filter ' + label);
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    select('Guests', '3');
    select('A little extra', 'Sea view');
    const sort = main.querySelector<HTMLSelectElement>(
      'select[aria-label="Sort rooms"]',
    );
    if (!sort) throw Error('Missing sort');
    sort.value = 'price-desc';
    sort.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page).toHaveURL(/capacity=3/);
  await expect(page).toHaveURL(/amenity=Sea\+view/);
  await expect(page).toHaveURL(/sort=price-desc/);
  await page.reload();
  await expect(page.getByLabel(/^Guests/)).toHaveValue('3');
  await expect(page.getByLabel(/^A little extra/)).toHaveValue('Sea view');
  await expect(page.getByLabel('Sort rooms')).toHaveValue('price-desc');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'The Sol Residence', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: /^Saved rooms,/ }).click();
  await expect(page).toHaveURL(/saved=true/);
  await page.goBack();
  await expect(page.getByLabel(/^Guests/)).toHaveValue('3');
  await expect(page.getByLabel(/^A little extra/)).toHaveValue('Sea view');
  await page.getByLabel(/^Guests/).selectOption('4');
  await expect(page).toHaveURL(/capacity=4/);
  await expect(page).toHaveURL(/amenity=Sea\+view/);
  await expect(page).toHaveURL(/sort=price-desc/);
});
