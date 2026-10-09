import { test, expect } from '@playwright/test';

test('renders real catalog statistics, usable 3D scene, and responsive layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Build on');
  await expect(page.locator('.stats-strip')).toContainText('1,691');
  await expect(page.locator('.scene-canvas canvas')).toBeVisible();
  await expect(page.locator('.case-card')).toHaveCount(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('search, combined filters, empty states, sorting and pagination', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search the archive' });
  await search.fill('Quibi');
  await expect(page.locator('.case-card')).toHaveCount(1);
  await expect(page.locator('.case-title h3')).toHaveText('Quibi');
  await page.getByLabel('Filter by industry').selectOption('Real Estate Tech');
  await expect(page.getByText('No matching stories. Yet.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.case-card')).toHaveCount(12);
  await page.getByLabel('Filter by failure reason').selectOption('Hardware value proposition');
  await expect(page.locator('.case-title h3')).toHaveText('Juicero');
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByLabel('Sort cases').selectOption('Name: A–Z');
  const names = await page.locator('.case-title h3').allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  await page.getByRole('button', { name: 'More stories to learn from' }).click();
  await expect(page.locator('.case-card')).toHaveCount(24);
});

test('bookmarks survive reload and saved collection works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Save WeWork', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Unsave WeWork', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /^Saved/ }).click();
  await expect(page.locator('.case-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Unsave WeWork', exact: true }).click();
  await expect(page.getByText('Your next lesson is waiting.')).toBeVisible();
});

test('case links, direct routes, source links, history and missing records', async ({ page }) => {
  await page.goto('/');
  await page.locator('.case-content').first().click();
  await expect(page).toHaveURL(/\/startups\/wework$/);
  await expect(page.locator('h1')).toHaveText('WeWork.');
  await expect(page.locator('.report-top')).toContainText('RESTRUCTURED');
  await expect(page.locator('.report-story')).toContainText('June 11, 2024');
  await expect(page.locator('.source-link')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('WeWork.');
  await page.getByRole('button', { name: 'Back to the archive', exact: true }).click();
  await expect(page.locator('.case-card')).toHaveCount(12);
  await page.goto('/en/startups/theranos');
  await expect(page.locator('.report-facts')).toContainText('More than $700M');
  await page.goto('/startups/missing-case');
  await expect(page.locator('h1')).toContainText('This chapter');
  await page.getByRole('button', { name: 'Return to the archive' }).click();
  await expect(page).toHaveURL('/');
});

test('research drafts persist without changing the public archive', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('button', { name: 'Submit a case', exact: true }).filter({ visible: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Company name').fill('Research test');
  await dialog.getByLabel('Public source URL').fill('https://example.com/research');
  await dialog.getByLabel('What happened?').fill('A private research note, not a historical record.');
  await dialog.getByRole('button', { name: 'Save a research draft' }).click();
  await expect(dialog.getByText('Research draft saved in this browser.')).toBeVisible();
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await page.reload();
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('button', { name: 'Submit a case', exact: true }).filter({ visible: true }).click();
  await expect(page.getByRole('heading', { name: 'Research test', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove draft' }).click();
  await expect(page.getByRole('heading', { name: 'Research test', exact: true })).toHaveCount(0);
});

test('analysis identifies generic fallback and displays service errors', async ({ page }) => {
  await page.route('**/api/analyze', route => route.fulfill({ json: { simulated: true, analysis: 'General research prompts.', mistakes: ['Is demand proven?'], lessons: ['Test a paid pilot.'], pathway: 'Interview customers.' } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Find your blind spots' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Company or idea').fill('Test idea');
  await dialog.getByLabel('Industry', { exact: true }).fill('Hardware');
  await dialog.getByLabel('Your scenario').fill('A hardware subscription concept.');
  await dialog.getByRole('button', { name: 'Explore possible risks' }).click();
  await expect(dialog.getByText('GENERAL PROMPTS / NO AI PROVIDER CONNECTED')).toBeVisible();
  await expect(dialog.getByText('General research prompts.', { exact: true })).toBeVisible();
  await page.route('**/api/analyze', route => route.fulfill({ status: 503, json: { error: 'Unavailable' } }));
  await dialog.getByRole('button', { name: 'Explore possible risks' }).click();
  await expect(dialog.getByRole('alert')).toContainText('unavailable');
});

test('theme, list view, blueprints and keyboard dialog dismissal', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.locator('.case-grid')).toHaveClass(/list-layout/);
  if (testInfo.project.name === 'mobile') { await page.getByRole('button', { name: 'Toggle navigation' }).click(); await page.getByRole('button', { name: 'Technical blueprints' }).click(); }
  else await page.getByRole('button', { name: 'Blueprints', exact: true }).click();
  await page.getByRole('button', { name: 'Startup Data Contract', exact: true }).click();
  await expect(page.locator('pre')).toContainText('interface Startup');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('reduced motion and unavailable WebGL still leave the archive usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
  await page.goto('/');
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search the archive' }).fill('Juicero');
  await expect(page.locator('.case-title h3')).toHaveText('Juicero');
});
