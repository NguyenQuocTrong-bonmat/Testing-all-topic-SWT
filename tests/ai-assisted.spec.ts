// AI-proposed cases derived from docs/requirements.md; deterministic execution, no model call.
import { test, expect } from '@playwright/test';
import { openApp, addTask } from './helpers';
for (const [name, value] of [['empty',''],['whitespace','   '],['over limit','a'.repeat(81)]]) {
 test('AI boundary: reject ' + name, async ({page}) => {
  await openApp(page); await page.getByLabel('Task title',{exact:true}).fill(value);
  await page.getByRole('button',{name:'Add task',exact:true}).click();
  await expect(page.getByRole('alert')).toHaveText('Title must be 1–80 characters');
  await expect(page.getByTestId('task')).toHaveCount(0);
 });
}
for (const length of [1,80]) test('AI boundary: accept ' + length + ' characters', async ({page}) => {
 await openApp(page); await addTask(page, 'a'.repeat(length)); await expect(page.getByRole('alert')).toBeHidden();
});
test('AI internationalization: trim whitespace and preserve Vietnamese', async ({page}) => {
 await openApp(page); await addTask(page, '  Kiểm thử tiếng Việt  ');
 await expect(page.getByTestId('task').locator('label')).toHaveText('Kiểm thử tiếng Việt');
});
test('AI injection case: render HTML as literal text', async ({page}) => {
 await openApp(page); const payload = '<img src=x onerror="window.injected=true">'; await addTask(page,payload);
 await expect(page.getByTestId('task').locator('label')).toHaveText(payload);
 await expect(page.getByTestId('task').locator('img')).toHaveCount(0);
 expect(await page.evaluate(() => (window as any).injected)).toBeUndefined();
});
