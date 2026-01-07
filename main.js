require('dotenv').config();
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const settings = require('./settings.js');
const { sendEmail } = require('./sendEmail.js');

let seenLinks = new Set();

let browser;
let page;

/**
 * Scrapes rental offers from a specified URL using Puppeteer and Cheerio, filters for today's ads,
 * checks for new adverts not seen before, and sends an email notification if new adverts are found.
 * Updates the set of seen links to avoid duplicate notifications.
 *
 * @async
 * @function request
 * @throws {Error} Logs any errors encountered during the scraping or processing.
 */
const request = async () => {
    try {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.goto(settings.url, { waitUntil: 'networkidle2' });

        const content = await page.content();

        const $ = cheerio.load(content);

        const offers = $(settings.offers);
        let resultArr = [];

        offers.each((i, elem) => {
            //mark if promoted
            const isPromoted = $(elem).find(settings.promotedSelector).length > 0;

            const title = $(elem).find(settings.titleSelector).text().trim() || null;
            if (!title) console.log('No title found for an offer, check selector in settings.js.');
            
            const addressAndDate = $(elem).find(settings.addressAndDateSelector).text().trim() || null;
            if (!addressAndDate) console.log('No address and date found for an offer, check selector in settings.js.');

            let address = '', date = '';
            // address and date are combined, split them and clean up
            if (addressAndDate.includes(' - ')) {
                [address, date] = addressAndDate.split(' - ').map(s => s.trim());
                date = date.replace(/Odświeżono( dnia)?/i, '').trim();

                // Check if date is "Dzisiaj o xx:xx", if not, do not include it as we only want today's ads
                const match = date.match(/Dzisiaj o (\d{2}):(\d{2})/i);
                if (match) {
                    date = `${match[1]}:${match[2]}`;
                } else {
                    return;
                }
            }
            const testSize = $(elem).find(settings.sizeSelector).text().trim();
            const size = parseInt($(elem).find(settings.sizeSelector).text().replace(/ /g, ''), 10) || null;
            if (!size) console.log('No size found for an offer, check selector in settings.js.');

            const cost = parseInt($(elem).find(settings.costSelector).text().replace(/ /g, ''), 10) || null;
            if (!cost) console.log('No cost found for an offer, check selector in settings.js.');

            let link = $(elem).find(settings.hyperlinkSelector).attr('href');
            if (!link) console.log('No hyperlink found for an offer, check selector in settings.js.');

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
                link,
                isPromoted
            });
        });

        // filter out ads that have already been seen
        const newAdverts = resultArr.filter(ad => ad.link && !seenLinks.has(ad.link));

        if (newAdverts.length > 0) {
            //console.log('New adverts:', newAdverts);
            await sendEmail(newAdverts); // send email with new ads
        } else {
            console.log('No new adverts found.');
        }

        // update seen links
        resultArr.forEach(ad => {
            if (ad.link) seenLinks.add(ad.link);
        });

        await browser.close();
    } catch (e) {
        console.error(`Error in OLX scraper: ${e}`);
    }
}

/**
 * Schedules the next execution of the request function after a random interval.
 * Logs the time until the next run and recursively schedules itself after each execution.
 *
 * @async
 * @function scheduleNextRequest
 * @returns {Promise<void>} A promise that resolves when the scheduling is complete.
 */
async function scheduleNextRequest() {
    const interval = settings.getRandomInterval();
    console.log(`Next run in ${(interval / 1000).toFixed(1)} seconds.`);
    setTimeout(async () => {
        console.log('Restarting script...');
        await request();
        scheduleNextRequest();
    }, interval);
}

console.log('Script will run at random intervals as determined by settings.getRandomInterval().');
console.log('To stop the script, press Ctrl+C.');

request();
scheduleNextRequest();
