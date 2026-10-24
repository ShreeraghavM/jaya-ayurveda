import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), 'dist', req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) {
    filePath = path.join(process.cwd(), 'dist', 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'dist', 'index.html');
  }

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };
  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4202, async () => {
  console.log('Dist server listening on http://localhost:4202');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:4202');
  await page.waitForTimeout(600);
  const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
  await demoBtn.click();
  await page.waitForTimeout(600);

  // Navigate to Anatomy
  const anatomyBanner = await page.locator('h3:has-text("Human Anatomy & Organ Vitality Map")').first();
  await anatomyBanner.click();
  await page.waitForTimeout(1000);

  // 1. Snapshot Hologram Mode
  await page.screenshot({ path: 'docs/screenshots/anatomy_test_5_hologram_mode.png' });
  console.log('Saved anatomy_test_5_hologram_mode.png');

  // 2. Switch to Medical Atlas
  const chartBtn = await page.locator('button:has-text("Medical Atlas")').first();
  await chartBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'docs/screenshots/anatomy_test_6_chart_mode.png' });
  console.log('Saved anatomy_test_6_chart_mode.png');

  await browser.close();
  server.close();
  console.log('Done!');
});
