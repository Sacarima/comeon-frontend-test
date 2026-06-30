import { expect, test } from '@playwright/test';

test('shows a generic error for invalid login', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel(/email address/i).fill('rebecka');
  await page.getByLabel(/^password$/i).fill('wrong');
  await page.getByRole('button', { name: /^log in$/i }).click();

  await expect(page.getByRole('alert')).toContainText(/invalid email or password/i);
  await expect(page).toHaveURL(/\/login/);
});

test('logs in, opens a game, goes back to lobby, and logs out', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel(/email address/i).fill('rebecka');
  await page.getByLabel(/^password$/i).fill('secret');
  await page.getByRole('button', { name: /^log in$/i }).click();

  await expect(page).toHaveURL(/\/lobby/);
  await expect(page.getByRole('heading', { name: /festing fox/i })).toBeVisible();

  await page.getByRole('link', { name: /play festing fox/i }).click();

  await expect(page).toHaveURL(/\/games\/feastingfox/);
  await expect(page.getByRole('heading', { name: /festing fox/i })).toBeVisible();

  await page.getByRole('link', { name: /back to games/i }).click();

  await expect(page).toHaveURL(/\/lobby/);
  await expect(page.getByRole('heading', { name: /festing fox/i })).toBeVisible();

  await page.getByRole('button', { name: /log out/i }).click();

  await expect(page).toHaveURL(/\/login/);
});