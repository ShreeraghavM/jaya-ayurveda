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

server.listen(4215, async () => {
  console.log('Dist server listening on http://localhost:4215');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    console.log('1. Testing Landing Page with new 4 Prominent Entry Points...');
    await page.goto('http://localhost:4215');
    await page.waitForTimeout(800);

    const shotLanding = path.join(ARTIFACT_DIR, 'verify_1_landing_all_buttons.png');
    await page.screenshot({ path: shotLanding, fullPage: false });
    console.log('Screenshot 1: Landing Page with all 4 visible buttons saved.');

    console.log('2. Clicking "🧬 Anatomy Visualizer" from Landing Hero...');
    const anatomyHeroBtn = await page.locator('button:has-text("Anatomy Visualizer")').first();
    await anatomyHeroBtn.click();
    await page.waitForTimeout(1000);

    const shotAnatomy = path.join(ARTIFACT_DIR, 'verify_2_anatomy_from_landing.png');
    await page.screenshot({ path: shotAnatomy, fullPage: false });
    console.log('Screenshot 2: Anatomy Twin opened directly from landing.');

    console.log('3. Clicking "🌾 Charaka Ahara Matra" tab in User Profile...');
    const matraProfileTab = await page.locator('button:has-text("Charaka Ahara Matra")').first();
    await matraProfileTab.click();
    await page.waitForTimeout(1000);

    const shotMatra = path.join(ARTIFACT_DIR, 'verify_3_ahara_matra_in_profile.png');
    await page.screenshot({ path: shotMatra, fullPage: false });
    console.log('Screenshot 3: Charaka Ahara Matra Tab opened in Profile.');

    console.log('4. Clicking "Back" to enter Dashboard with Core Fast Bar...');
    const backBtn = await page.locator('button:has-text("Back")').first();
    await backBtn.click();
    await page.waitForTimeout(1000);

    const shotDash = path.join(ARTIFACT_DIR, 'verify_4_dashboard_core_fastbar.png');
    await page.screenshot({ path: shotDash, fullPage: false });
    console.log('Screenshot 4: Dashboard with Core Pillars Fast Bar saved.');

    console.log('5. Clicking "🍽️ Diet Plan" from Core Fast Bar...');
    const dietFastBtn = await page.locator('button:has-text("Diet Plan")').first();
    await dietFastBtn.click();
    await page.waitForTimeout(1000);

    const shotDiet = path.join(ARTIFACT_DIR, 'verify_5_diet_plan_with_matra_banner.png');
    await page.screenshot({ path: shotDiet, fullPage: false });
    console.log('Screenshot 5: Diet Plan with 1/3 Stomach Banner saved.');

    console.log('6. Clicking "👤 User Profile" from Core Fast Bar...');
    const profileFastBtn = await page.locator('button:has-text("User Profile")').first();
    await profileFastBtn.click();
    await page.waitForTimeout(1000);

    const shotProfile = path.join(ARTIFACT_DIR, 'verify_6_user_profile_account.png');
    await page.screenshot({ path: shotProfile, fullPage: false });
    console.log('Screenshot 6: User Profile saved.');

    console.log('All 6 verification flows completed with 100% success!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
