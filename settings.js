//If you don't want certain filter just comment it.
//With array types you can choose more than one option.
const settings = {
    category: 'wynajem',    //wynajem, sprzedaz, zamiana - rent, sell, exchange
    location: 'Wrocław',
    priceFrom: 1000,        //in PLN
    priceTo: 2500,
    sizeFrom: 25,           //square meters
    sizeTo: 40,
    rooms: [1, 2, 3, 4],    //delete what you want
    titleSelector: '#root > div.css-50cyfj > div.css-176aais > form > div:nth-child(5) > div > div.css-14fnihb > div:nth-child(2) > a > div > div > div.css-9nzgu8 > div.css-u2ayx9 > h6',
    addressAndDateSelector: '#root > div.css-50cyfj > div.css-176aais > form > div:nth-child(5) > div > div.css-14fnihb > div:nth-child(13) > a > div > div > div.css-9nzgu8 > div:nth-child(2) > p.css-p6wsjo-Text.eu5v0x0',
    sizeSelector: '#root > div.css-50cyfj > div.css-176aais > form > div:nth-child(5) > div > div.css-14fnihb > div:nth-child(13) > a > div > div > div.css-9nzgu8 > div:nth-child(2) > p.css-1bhbxl1-Text.eu5v0x0',
    costSelector: '#root > div.css-50cyfj > div.css-176aais > form > div:nth-child(5) > div > div.css-14fnihb > div:nth-child(12) > a > div > div > div.css-9nzgu8 > div.css-u2ayx9 > p'
};
module.exports = settings;
