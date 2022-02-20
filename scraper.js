const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());

const scraper = async () => {
    console.log('SCRAPER: Process started...');

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(process.env.PRONOTE_LINK, {
        waitUntil: 'networkidle2'
    });

    await page.waitForSelector('#id_22');

    console.log('SCRAPER: On Pronote sign in page');

    await page.type('#id_22', process.env.PRONOTE_USERNAME);
    await page.type('#id_23', process.env.PRONOTE_PASSWORD);

    await page.click('#id_11');

    await page.waitForTimeout(3000);

    await page.click('[id="#GInterface\.Instances\[0\]\.Instances\[1\]_Wrapper > li:nth-child(3)"]');

    console.log('Done');

    // await browser.close();
};

module.exports = scraper;