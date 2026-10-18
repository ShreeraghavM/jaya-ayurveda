import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();

  console.log('1. Loading landing page on local build...');
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('2. Clicking Health Intake button in header...');
  const intakeHeaderBtn = await page.locator('button:has-text("Health Intake")').first();
  await intakeHeaderBtn.click();
  await page.waitForTimeout(500);

  console.log('3. Clicking Raktapradara button...');
  const raktaBtn = await page.locator('button:has-text("Raktapradara")').first();
  await raktaBtn.click();
  await page.waitForTimeout(600);

  // Scroll down within the modal scroll container
  const scrollContainer = await page.locator('.fixed.inset-0.z-50').first();
  await scrollContainer.evaluate(el => el.scrollTo(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/JayaRaghavuluMeruva/Desktop/jaya_Ayurveda/local_raktapradara_details.png' });
  console.log('Saved local_raktapradara_details.png');

  await browser.close();
  console.log('Scroll screenshot completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
