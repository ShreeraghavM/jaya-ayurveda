import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

const ARTIFACT_DIR = 'C:/Users/JayaRaghavuluMeruva/.gemini/antigravity/brain/f3ca172f-2f08-4a57-8698-f962996479ea';
const DOCS_DIR = path.join(process.cwd(), 'docs', 'screenshots');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), 'dist', req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4212, async () => {
  console.log('Server running on http://localhost:4212');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  // 1. Open Landing Page and launch Demo
  await page.goto('http://localhost:4212');
  await page.waitForTimeout(600);

  // Click Try demo profile
  const demoBtn = page.getByRole('button', { name: /Try demo profile/i }).first();
  await demoBtn.click();
  await page.waitForTimeout(600);

  // 2. Capture Dashboard with Cooking Science Banner & Quick Pathway
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'culinary_6_dashboard_cooking_banner.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'culinary_6_dashboard_cooking_banner.png') });
  console.log('✓ Captured culinary_6_dashboard_cooking_banner.png');

  // 3. Navigate to Diet Plan
  const dietTab = page.locator('button:has-text("Diet")').first();
  await dietTab.click();
  await page.waitForTimeout(600);

  // In Diet Plan, expand first recipe
  const firstRecipeCard = page.locator('div.space-y-3 button.w-full').first();
  await firstRecipeCard.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'culinary_1_diet_plan_bhojana_krama.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'culinary_1_diet_plan_bhojana_krama.png') });
  console.log('✓ Captured culinary_1_diet_plan_bhojana_krama.png');

  // 4. Open Ayurvedic Cooking Guide modal via Fast Bar button
  const cookingFastBarBtn = page.getByTitle('Charaka Cooking Science, 3-Course Bhojana Krama & Daily 10 Essentials');
  await cookingFastBarBtn.click();
  await page.waitForTimeout(600);

  // Capture Tab 1: 3-Course Plate
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'culinary_2_modal_3course_plate.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'culinary_2_modal_3course_plate.png') });
  console.log('✓ Captured culinary_2_modal_3course_plate.png');

  // Click Tab 2: Macros & Nutrients
  const macrosTab = page.getByRole('button', { name: /Macros & Nutrients/i });
  await macrosTab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'culinary_3_modal_macronutrients.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'culinary_3_modal_macronutrients.png') });
  console.log('✓ Captured culinary_3_modal_macronutrients.png');

  // Click Tab 3: Cooking Method
  const cookingMethodTab = page.getByRole('button', { name: /Cooking Method/i });
  await cookingMethodTab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'culinary_4_modal_cooking_samskara.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'culinary_4_modal_cooking_samskara.png') });
  console.log('✓ Captured culinary_4_modal_cooking_samskara.png');

  // Click Tab 4: Daily 10 Essentials
  const daily10Tab = page.getByRole('button', { name: '🌿 Daily 10 Essentials' });
  await daily10Tab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'culinary_5_modal_daily10_essentials.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'culinary_5_modal_daily10_essentials.png') });
  console.log('✓ Captured culinary_5_modal_daily10_essentials.png');

  await browser.close();
  server.close();
  console.log('All 6 visual culinary screenshots successfully captured!');
  process.exit(0);
});
