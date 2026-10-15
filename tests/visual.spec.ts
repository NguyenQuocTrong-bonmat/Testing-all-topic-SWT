import { test, expect } from '@playwright/test';
import { openApp, addTask } from './helpers';
test.beforeEach(async ({ page }) => {
 await openApp(page);
 if (process.env.VISUAL_MUTATION === '1') await page.addStyleTag({content:'h1 { color: #e00070 !important; }'});
});
test('desktop empty state', async ({ page }) => {
 await expect(page).toHaveScreenshot('desktop-empty.png', {fullPage:true, animations:'disabled'});
});
test('desktop populated state', async ({ page }) => {
 await addTask(page, 'Review test report', 'high'); await addTask(page, 'Publish demo');
 await expect(page).toHaveScreenshot('desktop-tasks.png', {fullPage:true, animations:'disabled'});
});
test('mobile empty state', async ({ page }) => {
 await page.setViewportSize({width:390,height:844});
 await expect(page).toHaveScreenshot('mobile-empty.png', {fullPage:true, animations:'disabled'});
});
