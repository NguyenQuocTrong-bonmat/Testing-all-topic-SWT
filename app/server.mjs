import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('./index.html', import.meta.url));
const sessions = new Map();
const server = http.createServer(async (req, res) => {
  const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(html); }
  if (req.method === 'GET' && url.pathname === '/health') return send(200, { ok: true });
  if (!url.pathname.startsWith('/api/')) return send(404, { error: 'Not found' });
  const cookie = /(?:^|; )demo_session=([a-f0-9-]+)/.exec(req.headers.cookie || '');
  let id = cookie?.[1];
  if (!id || !sessions.has(id)) { id = randomUUID(); sessions.set(id, []); res.setHeader('Set-Cookie', `demo_session=${id}; HttpOnly; SameSite=Lax; Path=/`); }
  const tasks = sessions.get(id);
  let body = {};
  if (['POST', 'PATCH'].includes(req.method)) {
    if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(415, { error: 'JSON required' });
    try { let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 10000) return send(413, { error: 'Body too large' }); } body = JSON.parse(raw); }
    catch { return send(400, { error: 'Invalid JSON' }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return send(400, { error: 'Object required' });
  }
  if (url.pathname === '/api/tasks') {
    if (req.method === 'GET') return send(200, tasks);
    if (req.method === 'POST') {
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const priority = body.priority ?? 'normal';
      if (!title || title.length > 80) return send(400, { error: 'Title must be 1–80 characters' });
      if (!['normal', 'high'].includes(priority)) return send(400, { error: 'Invalid priority' });
      const task = { id: randomUUID(), title, priority, completed: false }; tasks.push(task); return send(201, task);
    }
    return send(405, { error: 'Method not allowed' });
  }
  const match = /^\/api\/tasks\/([a-f0-9-]+)$/.exec(url.pathname);
  if (match) {
    const index = tasks.findIndex(t => t.id === match[1]);
    if (index < 0) return send(404, { error: 'Task not found' });
    if (req.method === 'PATCH') {
      if (typeof body.completed !== 'boolean') return send(400, { error: 'completed must be boolean' });
      tasks[index].completed = body.completed; return send(200, tasks[index]);
    }
    if (req.method === 'DELETE') { tasks.splice(index, 1); res.writeHead(204); return res.end(); }
    return send(405, { error: 'Method not allowed' });
  }
  return send(404, { error: 'Not found' });
});
server.listen(4173, '127.0.0.1', () => console.log('Task Lab: http://127.0.0.1:4173'));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
