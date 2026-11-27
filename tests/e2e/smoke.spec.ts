import { expect, test } from '@playwright/test';

test.describe('application smoke', () => {
  test('renders the foundation home page', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Show Up For Life', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Skip to main content' }),
    ).toBeAttached();
    await expect(page.getByRole('main')).toContainText(
      'Accounts and event planning are not open yet',
    );
  });

  test('skip link moves keyboard focus to the main content', async ({
    page,
  }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Skip to main content' }),
    ).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('health endpoint responds', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.ok()).toBe(true);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });
});
