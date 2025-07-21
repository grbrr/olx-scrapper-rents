/**
 * @namespace settings
 * @description Configuration object for OLX rental scraper.
 * @property {string} url - The OLX search URL for rental listings in Wroclaw, filtered by price and size.
 * @property {number} interval - The base interval (in seconds) between scraping attempts.
 * @property {string} offers - CSS selector for the advertisement container.
 * @property {string} titleSelector - CSS selector for the offer title.
 * @property {string} addressAndDateSelector - CSS selector for the address and date information.
 * @property {string} sizeSelector - CSS selector for the size information.
 * @property {string} costSelector - CSS selector for the cost information.
 * @property {string} hyperlinkSelector - CSS selector for the offer hyperlink.
 * @property {string} promotedSelector - CSS selector for promoted offers.
 * @function getRandomInterval
 * @description Returns a randomized interval (in milliseconds) based on the base interval, with a random epsilon of ±10%.
 * @returns {number} Randomized interval in milliseconds.
 */
const settings = {
    url: 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/wroclaw/?search%5Border%5D=created_at:desc&search%5Bfilter_float_price:to%5D=2500&search%5Bfilter_float_m:to%5D=50',
    interval: 300, // interval in seconds (getRandomInterval returns milliseconds)
    offers: '.css-1g5933j', // advertisement container selector
    titleSelector: '.css-1g61gc2',
    addressAndDateSelector: 'div.css-odp1qd > p',
    sizeSelector: 'div.css-odp1qd > div > span',
    costSelector: 'div.css-u2ayx9 > p',
    hyperlinkSelector: 'div.css-u2ayx9 > a',
    promotedSelector: 'div.css-13aawz3 > div > div > div',
    getRandomInterval: function () {
        const delta = Math.round(this.interval * 0.1);
        const epsilon = Math.floor(Math.random() * (2 * delta + 1)) - delta;
        const randomizedInterval = Math.max(this.interval + epsilon, 1);
        return randomizedInterval * 1000;
    }
};
module.exports = settings;
