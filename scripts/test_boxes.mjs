import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), 'dist', req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4212, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:4212');
  const beginNav = await page.locator('button:has-text("Begin")').first().boundingBox();
  const beginHero = await page.locator('button:has-text("Begin your journey")').first().boundingBox();
  console.log('Mobile nav Begin bounding box:', beginNav);
  console.log('Mobile hero Begin journey bounding box:', beginHero);
  
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktop.goto('http://localhost:4212');
  const dNav = await desktop.locator('button:has-text("Begin")').first().boundingBox();
  const dHero = await desktop.locator('button:has-text("Begin your journey")').first().boundingBox();
  console.log('Desktop nav Begin bounding box:', dNav);
  console.log('Desktop hero Begin journey bounding box:', dHero);

  await browser.close();
  server.close();
  process.exit(0);
});
