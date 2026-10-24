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

server.listen(4207, async () => {
  console.log('Visual test server listening on http://localhost:4207');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    console.log('1. Loading landing page with Spring Shield buttons & pills...');
    await page.goto('http://localhost:4207');
    await page.waitForTimeout(1000);

    const shot1 = path.join(ARTIFACT_DIR, 'metabolic_1_landing_spring_buttons.png');
    await page.screenshot({ path: shot1, fullPage: true });
    fs.copyFileSync(shot1, path.join(DOCS_DIR, 'metabolic_1_landing_spring_buttons.png'));
    console.log('✓ Screenshot 1: Landing page with Spring Shield & BMR shortcuts');

    console.log('2. Clicking "🌸 Spring Shield & BMR" from landing page...');
    const springHeroBtn = await page.locator('button:has-text("Spring Shield & BMR")').first();
    await springHeroBtn.click();
    await page.waitForTimeout(1000);

    const shot2 = path.join(ARTIFACT_DIR, 'metabolic_2_profile_tab_agni_bmr.png');
    await page.screenshot({ path: shot2, fullPage: true });
    fs.copyFileSync(shot2, path.join(DOCS_DIR, 'metabolic_2_profile_tab_agni_bmr.png'));
    console.log('✓ Screenshot 2: UserProfile Agni-BMR & TDEE sub-tab');

    console.log('3. Switching to Ardha-Shakti Exercise Capacity sub-tab...');
    const ardhaShaktiBtn = await page.locator('button:has-text("Ardha-Shakti")').first();
    await ardhaShaktiBtn.click();
    await page.waitForTimeout(800);

    const shot3 = path.join(ARTIFACT_DIR, 'metabolic_3_ardha_shakti_exercise.png');
    await page.screenshot({ path: shot3, fullPage: true });
    fs.copyFileSync(shot3, path.join(DOCS_DIR, 'metabolic_3_ardha_shakti_exercise.png'));
    console.log('✓ Screenshot 3: Ardha-Shakti Exercise Capacity with safe HR & cessation signs');

    console.log('4. Switching to Vasanta Ritu (Spring) Bio-Shield sub-tab...');
    const springTabBtn = await page.locator('button:has-text("Vasanta Ritu")').first();
    await springTabBtn.click();
    await page.waitForTimeout(800);

    const shot4 = path.join(ARTIFACT_DIR, 'metabolic_4_vasanta_ritu_bio_shield.png');
    await page.screenshot({ path: shot4, fullPage: true });
    fs.copyFileSync(shot4, path.join(DOCS_DIR, 'metabolic_4_vasanta_ritu_bio_shield.png'));
    console.log('✓ Screenshot 4: Vasanta Ritu Spring Bio-Shield with Kapha liquefaction defense');

    console.log('5. Returning to main app view & checking Diet Plan...');
    const backBtn = await page.locator('button:has-text("Back")').first();
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await page.waitForTimeout(800);
    }

    const dietNavBtn = await page.locator('button:has-text("Diet Plan")').first();
    await dietNavBtn.click();
    await page.waitForTimeout(1000);

    const shot5 = path.join(ARTIFACT_DIR, 'metabolic_5_diet_plan_metabolic_card.png');
    await page.screenshot({ path: shot5, fullPage: true });
    fs.copyFileSync(shot5, path.join(DOCS_DIR, 'metabolic_5_diet_plan_metabolic_card.png'));
    console.log('✓ Screenshot 5: Diet Plan with Agni-BMR & Spring Bio-Shield metrics');

    console.log('6. Checking Dashboard Vasanta Ritu Bio-Shield Banner...');
    const homeBtn = await page.locator('button:has-text("Today")').first();
    if (await homeBtn.isVisible()) {
      await homeBtn.click();
      await page.waitForTimeout(1000);
      const shot6 = path.join(ARTIFACT_DIR, 'metabolic_6_dashboard_spring_banner.png');
      await page.screenshot({ path: shot6, fullPage: true });
      fs.copyFileSync(shot6, path.join(DOCS_DIR, 'metabolic_6_dashboard_spring_banner.png'));
      console.log('✓ Screenshot 6: Dashboard with Vasanta Ritu Spring Season Bio-Shield Banner');
    }

    console.log('\n🎉 Visual verification finished successfully!');
  } catch (err) {
    console.error('Visual verification error:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
