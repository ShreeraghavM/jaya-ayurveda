import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

const ARTIFACT_DIR = 'C:/Users/JayaRaghavuluMeruva/.gemini/antigravity/brain/f3ca172f-2f08-4a57-8698-f962996479ea';

const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), 'dist', req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4211, async () => {
  const browser = await chromium.launch();
  
  // Mobile check (390 x 844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4211');
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'landing_mobile_view.png'), fullPage: false });
  
  // Desktop check (1280 x 800)
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktopPage.goto('http://localhost:4211');
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'landing_desktop_1280.png'), fullPage: false });

  await browser.close();
  server.close();
  console.log('Mobile & desktop screenshots captured');
  process.exit(0);
});
