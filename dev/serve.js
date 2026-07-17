// ローカルプレビュー用サーバー（開発専用・本番では使いません）
// 使い方: リポジトリのルートで  node dev/serve.js
// ブラウザで http://localhost:8080/ を開く。
// 同じWi-Fiのスマホからは http://<このPCのIPアドレス>:8080/
process.on('uncaughtException', (e) => console.error('uncaught:', e.message));
const http = require('http');
const fs = require('fs');
const path = require('path');
// このスクリプトの1つ上（＝リポジトリのルート）を配信する
const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 8080;
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.json':'application/json', '.webp':'image/webp', '.gif':'image/gif' };
http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(req.url.split('?')[0]); }
  catch (e) { res.writeHead(400); return res.end('bad request'); }
  if (p === '/' || p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log('preview: http://localhost:' + PORT + '/  (LAN: http://<このPCのIP>:' + PORT + '/)'));
