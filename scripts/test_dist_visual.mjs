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
    '.svg': 'image/svg+xml'
  };
  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4199, async () => {
  console.log('Dist server listening on http://localhost:4199');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Loading landing page...');
  await page.goto('http://localhost:4199');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/screenshots/dist_test_1_landing.png' });
  console.log('Screenshot 1: Landing saved.');

  console.log('2. Clicking "📜 120 Chapters" in header navbar...');
  const chapBtn = await page.locator('header button:has-text("120 Chapters")').first();
  await chapBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/screenshots/dist_test_2_explorer_modal.png' });
  console.log('Screenshot 2: Explorer Modal saved.');

  console.log('3. Closing modal...');
  const closeBtn = await page.locator('button:has-text("Close")').first();
  await closeBtn.click();
  await page.waitForTimeout(500);

  console.log('4. Entering Demo profile to see Dashboard...');
  const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
  await demoBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/screenshots/dist_test_3_dashboard.png' });
  console.log('Screenshot 3: Dashboard saved.');

  console.log('5. Clicking 120 Chapters banner on Dashboard...');
  const dashChapBanner = await page.locator('h3:has-text("Charaka Samhita 120 Chapters Explorer")').first();
  await dashChapBanner.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/screenshots/dist_test_4_explorer_from_dash.png' });
  console.log('Screenshot 4: Explorer from Dashboard saved.');

  await browser.close();
  server.close();
  console.log('🎉 Verification completed successfully!');
});
