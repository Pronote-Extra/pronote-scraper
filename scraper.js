const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());

let data = [];

const scraper = async () => {
    let data = [];
    console.log('SCRAPER: Process started...');

    const browser = await puppeteer.launch({
        headless: true,
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

    await page.waitForXPath('/html/body/div[4]/div[1]/div[1]/div/div[3]/div[1]/div[3]/ul/li[3]/div[1]');

    const navbar_buttons = await page.$x('/html/body/div[4]/div[1]/div[1]/div/div[3]/div[1]/div[3]/ul/li[3]/div[1]')

    await navbar_buttons[0].click();

    await page.waitForTimeout(500);

    await navbar_buttons[0].click();

    console.log('SCRAPER: On the "notes" page');

    // await page.screenshot({ path: 'notes-screenshot.png' });
    
    const moyenne_g_eleve_selector = await page.waitForXPath('/html/body/div[4]/div[1]/div[2]/table/tbody/tr/td[1]/div/div/div[2]/div[1]/div[2]/div/div/div[1]/span/span'); 
    const moyenne_g_eleve = await moyenne_g_eleve_selector.evaluate(el => el.textContent);

    const moyenne_g_classe_selector = await page.waitForXPath('/html/body/div[4]/div[1]/div[2]/table/tbody/tr/td[1]/div/div/div[2]/div[1]/div[2]/div/div/div[2]/span/span');
    const moyenne_g_classe = await moyenne_g_classe_selector.evaluate(el => el.textContent);
    
    const personne_selector = await page.waitForXPath('/html/body/div[4]/div[1]/div[1]/div/div[1]/div/div[2]/div[2]/div[2]/div[1]');
    const personne = await personne_selector.evaluate(el => el.textContent);

    const id = personne.replace('Espace Élèves - ','');

    console.log(moyenne_g_classe);
    console.log(moyenne_g_eleve);
    console.log(id);

    data.push(id);
    data.push(moyenne_g_eleve.split(' ').join(''));
    data.push(moyenne_g_classe.split(' ').join(''));

    await browser.close();

    console.log('SCRAPER: Process finished');
    console.log(data);

    return data
};

module.exports = scraper;