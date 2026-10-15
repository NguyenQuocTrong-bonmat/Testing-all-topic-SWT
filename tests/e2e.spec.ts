import { test, expect } from '@playwright/test';
import { openApp, addTask } from './helpers';
test('create, complete, filter, reload and delete a task', async ({ page }) => {
 await openApp(page); await addTask(page, 'Ship the demo', 'high');
 const row = page.getByTestId('task'); await expect(row.getByText('High', {exact:true})).toBeVisible();
 await row.getByRole('checkbox').check(); await expect(row).toHaveClass(/done/);
 await page.getByLabel('Show tasks').selectOption('active'); await expect(row).toHaveCount(0);
 await page.getByLabel('Show tasks').selectOption('completed'); await expect(row).toHaveCount(1);
 await page.reload(); await expect(row.getByRole('checkbox')).toBeChecked();
 await row.getByRole('button', {name:'Delete Ship the demo',exact:true}).click();
 await expect(row).toHaveCount(0); await expect(page.getByText('No tasks here yet.')).toBeVisible();
});
test('keyboard can submit a task', async ({ page }) => {
 await openApp(page); await page.getByLabel('Task title', {exact:true}).fill('Keyboard workflow');
 await page.getByLabel('Task title', {exact:true}).press('Enter');
 await expect(page.getByTestId('task')).toHaveText(/Keyboard workflow/);
});
test('server error is visible and retry succeeds', async ({ page }) => {
 await openApp(page);
 await page.route('**/api/tasks', async route => {
  if (route.request().method() === 'POST') await route.fulfill({status:503,json:{error:'Temporarily unavailable'}});
  else await route.continue();
 });
 await page.getByLabel('Task title',{exact:true}).fill('Retry me'); await page.getByRole('button',{name:'Add task',exact:true}).click();
 await expect(page.getByRole('alert')).toHaveText('Temporarily unavailable'); await expect(page.getByTestId('task')).toHaveCount(0);
 await page.unroute('**/api/tasks'); await page.getByRole('button',{name:'Add task',exact:true}).click();
 await expect(page.getByTestId('task')).toHaveCount(1); await expect(page.getByRole('alert')).toBeHidden();
});
