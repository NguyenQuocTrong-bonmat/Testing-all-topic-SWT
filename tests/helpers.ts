import { expect, type Page } from '@playwright/test';
export async function openApp(page: Page) {
 await page.goto('/'); await page.waitForFunction(() => (window as any).demoReady === true);
}
export async function addTask(page: Page, title: string, priority = 'normal') {
 await page.getByLabel('Task title', { exact: true }).fill(title);
 await page.getByLabel('Priority', { exact: true }).selectOption(priority);
 await page.getByRole('button', { name: 'Add task', exact: true }).click();
 await expect(page.getByTestId('task').filter({ has: page.locator('label', { hasText: title.trim() }) })).toHaveCount(1);
}
