import { test, expect } from '@playwright/test';

test.describe('Dashboard UI', () => {
  test('should render overview metrics and active tasks', async ({ page }) => {
    await page.goto('/');
    
    // Check main headings
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Recent Drafts')).toBeVisible();
    await expect(page.getByText('Active Tasks')).toBeVisible();
    
    // Verify some mock data loaded
    await expect(page.getByText('Research competitor hooks')).toBeVisible();
  });

  test('should navigate to Inspiration page via sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Click Inspiration in the sidebar
    await page.getByRole('link', { name: 'Inspiration' }).click();
    
    // Verify navigation
    await expect(page).toHaveURL(/\/inspiration/);
    await expect(page.getByText('Viral Inspiration')).toBeVisible();
  });

  test('should open command menu with keyboard shortcut', async ({ page }) => {
    await page.goto('/');
    
    // Press Cmd+K (or Ctrl+K)
    await page.keyboard.press('ControlOrMeta+k');
    
    // Command menu should appear
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible();
  });
});
