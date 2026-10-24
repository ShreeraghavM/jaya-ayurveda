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

server.listen(4201, async () => {
  console.log('Dist server listening on http://localhost:4201');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  console.log('1. Loading landing page & entering Demo...');
  await page.goto('http://localhost:4201');
  await page.waitForTimeout(800);
  const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
  await demoBtn.click();
  await page.waitForTimeout(800);

  console.log('2. Opening Human Anatomy banner from Dashboard...');
  const anatomyBanner = await page.locator('h3:has-text("Human Anatomy & Organ Vitality Map")').first();
  await anatomyBanner.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/screenshots/anatomy_test_1_full_twin.png' });
  console.log('Screenshot 1: Anatomy Full Twin saved.');

  console.log('3. Selecting Nervous System & Posterior spine view...');
  const nervousBtn = await page.locator('button:has-text("Nervous")').first();
  await nervousBtn.click();
  const backViewBtn = await page.locator('button:has-text("Posterior (Spine/Back)")').first();
  await backViewBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'docs/screenshots/anatomy_test_2_nervous_dorsal.png' });
  console.log('Screenshot 2: Nervous & Dorsal saved.');

  console.log('4. Navigating to Clinical Lab Reports (Doctor Mode)...');
  const labReportsTab = await page.locator('button:has-text("Clinical Lab Reports")').first();
  await labReportsTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'docs/screenshots/anatomy_test_3_lab_reports.png' });
  console.log('Screenshot 3: Lab Reports saved.');

  console.log('5. Navigating to Bedtime Review tab...');
  const bedtimeTab = await page.locator('button:has-text("Bedtime Review")').first();
  await bedtimeTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'docs/screenshots/anatomy_test_4_bedtime_review.png' });
  console.log('Screenshot 4: Bedtime Review saved.');

  await browser.close();
  server.close();
  console.log('🎉 Anatomy Visual Verification passed completely!');
});
