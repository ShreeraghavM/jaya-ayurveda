import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

const ARTIFACT_DIR = 'C:/Users/JayaRaghavuluMeruva/.gemini/antigravity/brain/f3ca172f-2f08-4a57-8698-f962996479ea';
const DOCS_DIR = path.join(process.cwd(), 'docs', 'screenshots');

const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), 'dist', req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) filePath = path.join(process.cwd(), 'dist', 'index.html');
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4215, async () => {
  console.log('Visual test server listening on http://localhost:4215');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    console.log('1. Loading landing page with Weather & Animated Tour buttons...');
    await page.goto('http://localhost:4215');
    await page.waitForTimeout(800);

    const shot1 = path.join(ARTIFACT_DIR, 'tour_1_landing_shortcuts.png');
    await page.screenshot({ path: shot1, fullPage: false });
    fs.copyFileSync(shot1, path.join(DOCS_DIR, 'tour_1_landing_shortcuts.png'));
    console.log('✓ Shot 1: Landing page with 24-Hr Tour & Weather buttons');

    console.log('2. Opening Animated Journey Tour modal...');
    const tourHeroBtn = await page.locator('button:has-text("24-Hr Animated Tour")').first();
    await tourHeroBtn.click();
    await page.waitForTimeout(800);

    const shot2 = path.join(ARTIFACT_DIR, 'tour_2_animated_scene_1.png');
    await page.screenshot({ path: shot2, fullPage: false });
    fs.copyFileSync(shot2, path.join(DOCS_DIR, 'tour_2_animated_scene_1.png'));
    console.log('✓ Shot 2: Animated Journey Tour Scene 1');

    console.log('3. Navigating to Scene 3 (Morning Weather & Activity) in Tour...');
    const scene3Btn = await page.locator('button:has-text("06:30 AM")').first();
    if (await scene3Btn.isVisible()) {
      await scene3Btn.click();
      await page.waitForTimeout(600);
      const shot3 = path.join(ARTIFACT_DIR, 'tour_3_animated_scene_weather.png');
      await page.screenshot({ path: shot3, fullPage: false });
      fs.copyFileSync(shot3, path.join(DOCS_DIR, 'tour_3_animated_scene_weather.png'));
      console.log('✓ Shot 3: Animated Tour Scene 3 (Weather & Ardha-Shakti)');
    }

    // Close modal
    const closeTourBtn = await page.locator('button:has-text("✕ Close")').first();
    if (await closeTourBtn.isVisible()) {
      await closeTourBtn.click();
      await page.waitForTimeout(600);
    }

    console.log('4. Opening Real-Time Weather & Health Activity Tracker...');
    const weatherHeroBtn = await page.locator('button:has-text("Weather & Activity")').first();
    await weatherHeroBtn.click();
    await page.waitForTimeout(800);

    const shot4 = path.join(ARTIFACT_DIR, 'weather_1_tracker_overview.png');
    await page.screenshot({ path: shot4, fullPage: false });
    fs.copyFileSync(shot4, path.join(DOCS_DIR, 'weather_1_tracker_overview.png'));
    console.log('✓ Shot 4: Weather & Activity Tracker Overview');

    console.log('5. Switching to Weather & Dosha Climate Shield tab...');
    const weatherTabBtn = await page.locator('button:has-text("Weather & Dosha")').first();
    await weatherTabBtn.click();
    await page.waitForTimeout(600);

    const shot5 = path.join(ARTIFACT_DIR, 'weather_2_dosha_climate_shield.png');
    await page.screenshot({ path: shot5, fullPage: false });
    fs.copyFileSync(shot5, path.join(DOCS_DIR, 'weather_2_dosha_climate_shield.png'));
    console.log('✓ Shot 5: Weather & Dosha Climate Shield with Vata/Pitta/Kapha bars');

    console.log('6. Switching to Live Walk / Run Workout Recorder tab...');
    const trackerTabBtn = await page.locator('button:has-text("Live Walk / Run")').first();
    await trackerTabBtn.click();
    await page.waitForTimeout(600);

    const shot6 = path.join(ARTIFACT_DIR, 'weather_3_live_walk_run_recorder.png');
    await page.screenshot({ path: shot6, fullPage: false });
    fs.copyFileSync(shot6, path.join(DOCS_DIR, 'weather_3_live_walk_run_recorder.png'));
    console.log('✓ Shot 6: Live Walk/Run Workout Recorder with Ardha-Shakti Pulse Dial');

    // Close weather modal
    const closeWeatherBtn = await page.locator('button:has-text("✕ Close")').first();
    if (await closeWeatherBtn.isVisible()) {
      await closeWeatherBtn.click();
      await page.waitForTimeout(600);
    }

    console.log('7. Entering demo profile & viewing Dashboard...');
    const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
    await demoBtn.click();
    await page.waitForTimeout(1000);

    const shot7 = path.join(ARTIFACT_DIR, 'weather_4_dashboard_cards.png');
    await page.screenshot({ path: shot7, fullPage: false });
    fs.copyFileSync(shot7, path.join(DOCS_DIR, 'weather_4_dashboard_cards.png'));
    console.log('✓ Shot 7: Dashboard with Weather Tracker card & Animated Tour card');

    console.log('\n🎉 All visual screenshots captured successfully!');
  } catch (err) {
    console.error('Visual test error:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
