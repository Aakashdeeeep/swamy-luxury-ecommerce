const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/collections');

    console.log("taking screenshot");
    await page.screenshot({ path: 'test_collections.png' });

    await page.goto('http://localhost:3000/');
    console.log("taking screenshot 2");
    await page.screenshot({ path: 'test_home.png', fullPage: true });

    await browser.close();
})();
