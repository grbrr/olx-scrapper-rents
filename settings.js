const settings = {
    url: 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/wroclaw/?search%5Border%5D=created_at:desc&search%5Bfilter_float_price:to%5D=2500&search%5Bfilter_float_m:to%5D=50',
    interval: 60, // in seconds,
    offers: '.css-1g5933j', // <- container selector
    titleSelector: '.css-1g61gc2',
    addressAndDateSelector: 'div.css-odp1qd > p',
    sizeSelector: 'div.css-odp1qd > div > span',
    costSelector: 'div.css-u2ayx9 > p',
    hyperlinkSelector: 'div.css-u2ayx9 > a',
    promotedSelector: 'div.css-u2ayx9 > p'
};
module.exports = settings;
