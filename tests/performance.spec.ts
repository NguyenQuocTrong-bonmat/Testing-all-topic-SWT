import { test, expect } from '@playwright/test';
import { performance } from 'node:perf_hooks';
const p95 = (values:number[]) => [...values].sort((a,b)=>a-b)[Math.ceil(values.length*0.95)-1];
test('browser load and application-ready budget (5 samples)',async ({page},info)=>{
 const samples=[];
 for(let i=0;i<5;i++){
  const start=performance.now(); await page.goto('/'); await page.waitForFunction(()=>(window as any).demoReady === true);
  const readyMs=performance.now()-start;
  await page.waitForFunction(()=>performance.getEntriesByType('navigation')[0] && (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).loadEventEnd>0);
  const navigation=await page.evaluate(()=>{
   const n=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
   return {ttfbMs:n.responseStart-n.requestStart,domContentLoadedMs:n.domContentLoadedEventEnd-n.startTime,loadMs:n.loadEventEnd-n.startTime};
  }); samples.push({...navigation,readyMs});
 }
 const result={samples,p95ReadyMs:p95(samples.map(s=>s.readyMs)),p95LoadMs:p95(samples.map(s=>s.loadMs)),budgetMs:2000};
 await info.attach('browser-metrics.json',{body:JSON.stringify(result,null,2),contentType:'application/json'});
 expect(result.p95ReadyMs).toBeLessThan(result.budgetMs); expect(result.p95LoadMs).toBeLessThan(result.budgetMs);
});
test('API response budget (20 sequential samples)',async ({request},info)=>{
 await request.get('/api/tasks'); // Warm-up, excluded from measurement.
 const samples=[];
 for(let i=0;i<20;i++){
  const start=performance.now(); const response=await request.get('/api/tasks'); await response.body();
  const duration=performance.now()-start; expect(response.status()).toBe(200); samples.push(duration);
 }
 const result={samplesMs:samples,p95Ms:p95(samples),budgetMs:500,concurrency:1};
 await info.attach('api-metrics.json',{body:JSON.stringify(result,null,2),contentType:'application/json'});
 expect(result.p95Ms).toBeLessThan(result.budgetMs);
});
