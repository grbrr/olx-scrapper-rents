const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const settings = require('./settings.js');

const request = async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(settings.url, { waitUntil: 'networkidle2' });

        const content = await page.content();

        const $ = cheerio.load(content);

        const offers = $(settings.offers);
        let resultArr = [];

        offers.each((i, elem) => {
            //skip if promoted
            if ($(elem).find(settings.promotedSelector).length > 0) {
                return;
            }

            const title = $(elem).find(settings.titleSelector).text().trim();
            const addressAndDate = $(elem).find(settings.addressAndDateSelector).text().trim();
            let address = '', date = '';
            if (addressAndDate.includes(' - ')) {
                [address, date] = addressAndDate.split(' - ').map(s => s.trim());
                date = date.replace(/Odświeżono( dnia)?/i, '').trim();
            }
            const size = parseInt($(elem).find(settings.sizeSelector).text().replace(/ /g, ''), 10) || null;
            const cost = parseInt($(elem).find(settings.costSelector).text().replace(/ /g, ''), 10) || null;
            let link = $(elem).find(settings.hyperlinkSelector).attr('href');
            if (link && link.startsWith('/')) {
                const baseUrl = new URL(settings.url).origin;
                link = baseUrl + link;
            }

            resultArr.push({
                title,
                address,
                cost,
                size,
                date,
                link
            });
        });

        resultArr.sort((a, b) => {
            const isTodayA = a.date.startsWith('Dzisiaj o ');
            const isTodayB = b.date.startsWith('Dzisiaj o ');
            if (isTodayA && !isTodayB) return -1;
            if (!isTodayA && isTodayB) return 1;
            // Reverse alphabetic order for the rest
            return b.date.localeCompare(a.date, 'pl');
        });
        console.log(resultArr);

        await browser.close();
    } catch (e) {
        console.error(`Error in otodom: ${e.message}`);
    };
}

console.log(`Script will run every ${settings.interval} seconds.`);
console.log('To stop the script, press Ctrl+C.');

request();
setInterval(() => {
    console.log('Restarting script...');
    request();
}, settings.interval * 1000);