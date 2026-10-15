import { test, expect } from '@playwright/test';
test('CRUD contract and session isolation', async ({request,playwright,baseURL}) => {
 const initial = await request.get('/api/tasks'); expect(initial.status()).toBe(200); expect(await initial.json()).toEqual([]);
 const created = await request.post('/api/tasks',{data:{title:'  API task  ',priority:'high'}});
 expect(created.status()).toBe(201); const task = await created.json();
 expect(task).toEqual({id:expect.stringMatching(/^[a-f0-9-]{36}$/),title:'API task',priority:'high',completed:false});
 expect(await (await request.get('/api/tasks')).json()).toEqual([task]);
 const other = await playwright.request.newContext({baseURL});
 try {
  expect(await (await other.get('/api/tasks')).json()).toEqual([]);
  expect((await other.patch('/api/tasks/'+task.id,{data:{completed:true}})).status()).toBe(404);
 } finally { await other.dispose(); }
 const patched = await request.patch('/api/tasks/'+task.id,{data:{completed:true}});
 expect(patched.status()).toBe(200); expect(await patched.json()).toEqual({...task,completed:true});
 const deleted = await request.delete('/api/tasks/'+task.id); expect(deleted.status()).toBe(204); expect(await deleted.body()).toHaveLength(0);
 expect(await (await request.get('/api/tasks')).json()).toEqual([]);
 expect((await request.delete('/api/tasks/'+task.id)).status()).toBe(404);
});
for (const [name,data] of [['empty',{title:''}],['too long',{title:'a'.repeat(81)}],['wrong type',{title:42}],['invalid priority',{title:'ok',priority:'urgent'}],['null',null],['array',[]]] as const) {
 test('reject invalid body: '+name, async ({request}) => {
  const r = await request.post('/api/tasks',{data:JSON.stringify(data),headers:{'Content-Type':'application/json'}});
  expect(r.status()).toBe(400); expect(await r.json()).toHaveProperty('error');
  expect(await (await request.get('/api/tasks')).json()).toEqual([]);
 });
}
test('malformed JSON and unsupported content type',async ({request})=>{
 expect((await request.post('/api/tasks',{data:'{',headers:{'Content-Type':'application/json'}})).status()).toBe(400);
 expect((await request.post('/api/tasks',{data:'hello',headers:{'Content-Type':'text/plain'}})).status()).toBe(415);
});
test('PATCH rejects non-boolean completion',async ({request})=>{
 const task=await (await request.post('/api/tasks',{data:{title:'Validation'}})).json();
 expect((await request.patch('/api/tasks/'+task.id,{data:{completed:'true'}})).status()).toBe(400);
 expect((await request.get('/api/unknown')).status()).toBe(404);
});
