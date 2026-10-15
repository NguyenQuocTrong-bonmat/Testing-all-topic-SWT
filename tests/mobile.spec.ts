import { test, expect } from '@playwright/test';
import { openApp, addTask } from './helpers';
test('touch workflow creates and completes a task', async ({page}) => {
 await openApp(page); await page.getByLabel('Task title',{exact:true}).fill('Mobile task');
 await page.getByRole('button',{name:'Add task',exact:true}).tap();
 const row = page.getByTestId('task'); await expect(row).toHaveCount(1);
 await row.locator('label').tap(); await expect(row.getByRole('checkbox')).toBeChecked();
 await expect(row).toHaveClass(/done/);
});
test('long content fits viewport and primary touch target is at least 44px', async ({page}) => {
 await openApp(page); await addTask(page, 'W'.repeat(80));
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 const box = await page.getByRole('button',{name:'Add task',exact:true}).boundingBox();
 expect(box).not.toBeNull(); expect(box!.height).toBeGreaterThanOrEqual(44); expect(box!.width).toBeGreaterThanOrEqual(44);
});
