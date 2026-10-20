import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/JayaRaghavuluMeruva/.claude/skills/gstack/node_modules/playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  console.log('1. Loading app with demo profile...');
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Click Try demo profile
  const demoBtn = await page.locator('button:has-text("Try demo profile")').first();
  await demoBtn.click();
  await page.waitForTimeout(800);

  // Navigate to Remedies / Knowledge Hub
  console.log('2. Navigating to Remedies tab...');
  const remediesTab = await page.locator('button:has-text("Remedies")').first();
  await remediesTab.click();
  await page.waitForTimeout(800);

  // Click on "120 Chapters Explorer" sub-tab
  console.log('3. Opening 120 Chapters Explorer...');
  const chaptersSubTab = await page.locator('button:has-text("120 Chapters Explorer")').first();
  if (await chaptersSubTab.isVisible()) {
    await chaptersSubTab.click();
    await page.waitForTimeout(800);
  }

  await page.screenshot({ path: 'docs/screenshots/charaka_120_explorer_all.png' });
  console.log('Saved docs/screenshots/charaka_120_explorer_all.png');

  // Click Chikitsa Sthana pill
  console.log('4. Filtering by Chikitsa Sthana...');
  const chikitsaPill = await page.locator('button:has-text("Chikitsa Sthana")').first();
  if (await chikitsaPill.isVisible()) {
    await chikitsaPill.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: 'docs/screenshots/charaka_120_explorer_chikitsa.png' });
  console.log('Saved docs/screenshots/charaka_120_explorer_chikitsa.png');

  // Search for "Prameha"
  console.log('5. Searching for Prameha...');
  const searchInput = await page.locator('input[placeholder*="Search across 120 chapters"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('Prameha');
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: 'docs/screenshots/charaka_120_explorer_search_prameha.png' });
  console.log('Saved docs/screenshots/charaka_120_explorer_search_prameha.png');

  await browser.close();
  console.log('Charaka Explorer screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
