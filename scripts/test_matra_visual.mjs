import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

const ARTIFACT_DIR = 'C:/Users/JayaRaghavuluMeruva/.gemini/antigravity/brain/f3ca172f-2f08-4a57-8698-f962996479ea';

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

server.listen(4205, async () => {
  console.log('Dist server listening on http://localhost:4205');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    console.log('1. Loading landing page & entering Demo...');
    await page.goto('http://localhost:4205');
    await page.waitForTimeout(800);
    const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
    await demoBtn.click();
    await page.waitForTimeout(800);

    console.log('2. Navigating to Diet Plan tab...');
    // Find Diet tab in bottom nav or top nav
    const dietNavBtn = await page.locator('button:has-text("Diet")').first();
    await dietNavBtn.click();
    await page.waitForTimeout(1000);

    const shot1 = path.join(ARTIFACT_DIR, 'charaka_diet_matra_banner.png');
    await page.screenshot({ path: shot1, fullPage: true });
    console.log('Screenshot 1: Diet Plan with 1/3 Division Banner saved.');

    console.log('3. Expanding Charaka Matra Calculator in Diet Plan...');
    const configBtn = await page.locator('button:has-text("Configure Soil & Matra")').first();
    await configBtn.click();
    await page.waitForTimeout(1000);

    const shot2 = path.join(ARTIFACT_DIR, 'charaka_calculator_expanded_diet.png');
    await page.screenshot({ path: shot2, fullPage: true });
    console.log('Screenshot 2: Charaka Calculator expanded in Diet Plan saved.');

    console.log('4. Navigating to User Profile -> Charaka Ahara Matra tab...');
    const profileNavBtn = await page.locator('button[aria-label="Profile"]').first();
    await profileNavBtn.click();
    await page.waitForTimeout(1000);

    const matraTabBtn = await page.locator('button:has-text("Charaka Ahara Matra")').first();
    await matraTabBtn.click();
    await page.waitForTimeout(1000);

    const shot3 = path.join(ARTIFACT_DIR, 'charaka_matra_profile_tab.png');
    await page.screenshot({ path: shot3, fullPage: true });
    console.log('Screenshot 3: User Profile Charaka Ahara Matra Tab saved.');

    console.log('All visual tests completed successfully!');
  } catch (err) {
    console.error('Error in visual test:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
