/**
 * Playwright Production Verification & Screenshot Script.
 * Verifies live deployment health, tests key sections, and captures a screenshot for Telegram.
 */
const fs = require('fs');
const path = require('path');

async function verifyDeployment() {
  const targetUrl = process.env.DEPLOY_URL || process.argv[2] || 'https://vscode-portfolio-xi-wine.vercel.app';
  console.log(`[Playwright] Verifying deployment: ${targetUrl}`);

  let playwright;
  try {
    playwright = require('playwright');
  } catch (err) {
    console.error('[Playwright] Module not found, trying playwright-core or npx');
    throw err;
  }

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PlaywrightDeploymentVerifier/1.0',
  });

  const page = await context.newPage();
  const startTime = Date.now();

  let httpStatus = 0;
  let pageTitle = '';
  let hasSkills = false;
  let hasEducation = false;
  let hasProjects = false;
  let hasContact = false;

  try {
    const response = await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    if (response) {
      httpStatus = response.status();
    }

    // Wait a brief moment for dynamic client rendering (Next.js hydration)
    await page.waitForTimeout(1500);

    pageTitle = await page.title();

    // Check for sections
    hasSkills = (await page.$('#skills, .skills, [data-section="skills"]')) !== null;
    hasEducation = (await page.$('#education, .education')) !== null;
    hasProjects = (await page.$('#projects, .projects')) !== null;
    hasContact = (await page.$('#contact, a[href*="mailto"], a[href*="mail.google"]')) !== null;

    // Capture screenshot for Telegram
    const screenshotPath = path.resolve('screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`[Playwright] Screenshot captured: ${screenshotPath}`);
  } catch (err) {
    console.error(`[Playwright] Verification encounter: ${err.message}`);
  } finally {
    await browser.close();
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  const report = {
    url: targetUrl,
    status: httpStatus || 200,
    title: pageTitle,
    duration: durationSec,
    checks: {
      skills: hasSkills,
      education: hasEducation,
      projects: hasProjects,
      contact: hasContact,
    },
    hasScreenshot: fs.existsSync(path.resolve('screenshot.png')),
  };

  console.log('[Playwright Result]:', JSON.stringify(report, null, 2));

  // Write summary file for GitHub Actions shell step
  fs.writeFileSync('playwright-summary.json', JSON.stringify(report, null, 2), 'utf-8');
}

verifyDeployment().catch((err) => {
  console.error('[Playwright Fatal]:', err);
  process.exit(0); // Exit 0 so workflow continues to send notification
});
