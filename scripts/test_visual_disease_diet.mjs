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

server.listen(4213, async () => {
  console.log('Server running on http://localhost:4213');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  // 1. Open Landing Page and launch Demo
  await page.goto('http://localhost:4213');
  await page.waitForTimeout(600);

  const demoBtn = page.getByRole('button', { name: /Try demo profile/i }).first();
  await demoBtn.click();
  await page.waitForTimeout(600);

  // 2. Navigate to Diet Plan
  const dietTab = page.locator('button:has-text("Diet")').first();
  await dietTab.click();
  await page.waitForTimeout(600);

  // 3. Switch to Prameha (Diabetes) in the Clinical Synchronizer
  const pramehaBtn = page.locator('button:has-text("Diabetes (Prameha)")').first();
  await pramehaBtn.click();
  await page.waitForTimeout(500);

  // Expand first recipe card to view the clinical directive
  const firstRecipeCard = page.locator('div.space-y-3 button.w-full').first();
  await firstRecipeCard.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'disease_1_diet_plan_prameha_sync.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'disease_1_diet_plan_prameha_sync.png') });
  console.log('✓ Captured disease_1_diet_plan_prameha_sync.png');

  // 4. Switch to Amlapitta (Acid Reflux)
  const amlapittaBtn = page.locator('button:has-text("Acid Reflux (Amlapitta)")').first();
  await amlapittaBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'disease_2_diet_plan_amlapitta_sync.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'disease_2_diet_plan_amlapitta_sync.png') });
  console.log('✓ Captured disease_2_diet_plan_amlapitta_sync.png');

  // 5. Open Cooking Guide Modal from Fast Bar
  const cookingFastBarBtn = page.getByTitle('Charaka Cooking Science, 3-Course Bhojana Krama & Daily 10 Essentials');
  await cookingFastBarBtn.click();
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'disease_3_modal_disease_selector.png') });
  await page.screenshot({ path: path.join(DOCS_DIR, 'disease_3_modal_disease_selector.png') });
  console.log('✓ Captured disease_3_modal_disease_selector.png');

  await browser.close();
  server.close();
  console.log('All 3 visual disease synchronization screenshots captured!');
  process.exit(0);
});
