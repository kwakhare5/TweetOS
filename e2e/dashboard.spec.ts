import { test, expect } from '@playwright/test';

test.describe('Dashboard UI', () => {
  test('should render creator workbench and sticky notes', async ({ page }) => {
    await page.goto('/');
    
    // Check main headings using getByRole to avoid mobile header duplicates
    await expect(page.getByRole('heading', { name: 'Creator Workbench', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent X Posts', level: 2 })).toBeVisible();
    await expect(page.getByText('Sticky Notes', { exact: true })).toBeVisible();
  });

  test('should navigate to Inspiration page via sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Click Inspiration in the sidebar
    await page.getByRole('link', { name: 'Inspiration' }).click();
    
    // Verify navigation
    await expect(page).toHaveURL(/\/inspiration/);
    await expect(page.getByRole('heading', { name: 'Viral Inspiration', level: 1 })).toBeVisible();
  });

  test('should open command menu with keyboard shortcut', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR STACK:', err.stack));
    
    await page.goto('/');
    
    // Ensure hydration is done by waiting for a core interactive element
    await page.locator('textarea#raw-tweet').waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    
    // Press Ctrl+K
    await page.keyboard.press('Control+k');
    
    // Command menu should appear
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible();
  });

  test('should support mobile layout viewports, bottom nav, and search trigger', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR STACK:', err.stack));
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile title is visible in header
    await expect(page.locator('header').getByText('Creator Workbench')).toBeVisible();

    // Verify bottom nav items are visible
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inspiration' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();

    // Click Mobile Search button via its accessible role name
    await page.getByRole('button', { name: 'Search' }).click();

    // Command menu should appear
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible();
  });
});
