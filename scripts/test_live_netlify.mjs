import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

async function testLive() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to live site https://shree-ayurveda.netlify.app/ ...');
  await page.goto('https://shree-ayurveda.netlify.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/screenshots/live_netlify_test_1_landing.png' });
  console.log('Screenshot 1: Landing saved.');

  // Check buttons on landing
  const landingButtons = await page.$$eval('button, a', els => els.map(e => e.innerText.trim()).filter(Boolean));
  console.log('Landing buttons/links:', landingButtons);

  // Click Try demo profile
  const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
  if (await demoBtn.isVisible()) {
    await demoBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'docs/screenshots/live_netlify_test_2_dashboard.png' });
    console.log('Screenshot 2: Dashboard saved.');
  }

  // Check if Remedies tab is visible and click it
  const remediesTab = await page.locator('button:has-text("Remedies")').first();
  if (await remediesTab.isVisible()) {
    await remediesTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'docs/screenshots/live_netlify_test_3_remedies.png' });
    console.log('Screenshot 3: Remedies saved.');
  }

  // Check all buttons/tabs on Remedies screen
  const remediesButtons = await page.$$eval('button', els => els.map(e => e.innerText.trim()).filter(Boolean));
  console.log('Remedies screen buttons:', remediesButtons);

  await browser.close();
}

testLive().catch(console.error);
