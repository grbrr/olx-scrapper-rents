const axios = require('axios');
const cheerio = require('cheerio');

const settings = require('./settings.json');

const getProperPath = data => {
    return data.replace(/:nth-child\([0-9]\)/g, '').replace(/:nth-child\([0-9][0-9]\)/g, ''); //some nth-child has one and some other has two numbers
};

const deletePolishSigns = string => {
    const chars = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' };
    return string.toLowerCase().replace(/[ąćęłóśźż]/g, m => chars[m]);
};


const buildURL = () => {
    if (settings.priceFrom < 1) settings.priceFrom = 1;
    if (settings.priceTo < settings.priceFrom) settings.priceTo = settings.priceFrom * 2;
    if (settings.location !== '') settings.location = deletePolishSigns(settings.location) + '/';
    return `https://www.olx.pl/d/nieruchomosci/mieszkania/${settings.location}?search%5Bfilter_float_price:from%5D=${settings.priceFrom}&search%5Bfilter_float_price:to%5D=${settings.priceTo}&search%5Bfilter_float_m:from%5D=${settings.sizeFrom}&search%5Bfilter_float_m:to%5D=${settings.sizeTo}`
    //https://www.olx.pl/d/nieruchomosci/mieszkania/wroclaw/?search%5Bfilter_float_price:from%5D=1000&search%5Bfilter_float_price:to%5D=2500&search%5Bfilter_float_m:from%5D=25&search%5Bfilter_float_m:to%5D=40
}
console.log(buildURL())
const request = async () => {
    const url = buildURL();
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let titleArr = $(getProperPath(settings.titleSelector)).contents().map(function () {
            if (this.type === 'text') return $(this).text();
        }).get();
        //console.log(titleArr);

        let addressAndDateArr = $(getProperPath(settings.addressAndDateSelector)).contents().map(function () {
            if (this.type === 'text') return $(this).text();
        }).get();

        let addressArr = [], dateArr = [];

        for (let i = 0, j = 0, k = 0; i < addressAndDateArr.length; i++) {
            if (i % 3 === 0) {
                addressArr[j] = addressAndDateArr[i];
                j++;
            } else if (i % 3 === 2) {
                dateArr[k] = addressAndDateArr[i];
                k++;
            };
        };
        //console.log(addressArr);
        //console.log(dateArr);

        let sizeArr = $(getProperPath(settings.sizeSelector)).contents().map(function () {
            if (this.type === 'text') return $(this).text();
        }).get();

        for (let i = 0; i < sizeArr.length; i++) {
            sizeArr[i] = parseInt(sizeArr[i].replace(/ /g, ''));
        };
        //console.log(sizeArr);

        let costArr = $(getProperPath(settings.costSelector)).contents().map(function () {
            if (this.type === 'text') return $(this).text();
        }).get();

        for (let i = 0; i < costArr.length; i++) {
            costArr[i] = parseInt(costArr[i].replace(/ /g, ''));
        };
        //console.log(costArr);

        console.log(titleArr.length, addressArr.length, dateArr.length, sizeArr.length, costArr.length);

        let resultArr = [];
        for (let i = 0; i < titleArr.length; i++) {
            resultArr[i] = {
                number: i + 1,
                title: titleArr[i],
                address: addressArr[i],
                cost: costArr[i],
                size: sizeArr[i],
                date: dateArr[i]
            };
        };
        //console.log(resultArr);
        return resultArr;
    } catch (e) {
        console.error(`Error in otodom: ${e.message}`);
    };
};

console.log('starting script...');
request();
