const axios = require('axios');
const cheerio = require('cheerio');

const settings = require('./settings.js');

const getProperPath = data => {
    return data.replace(/:nth-child\([0-9]\)/g, '').replace(/:nth-child\([0-9][0-9]\)/g, ''); //some nth-child has one and some other has two numbers
};

const deletePolishSigns = string => {
    const chars = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' };
    return string.toLowerCase().replace(/[ąćęłóśźż]/g, m => chars[m]);
};

const fromNumToString = number => {
    switch (number) {
        case 1:
            return 'one';
        case 2:
            return 'two';
        case 3:
            return 'three';
        case 4:
            return 'four';
        default:
            break;
    };
};

const addPrefixFilter = (url, settingsProperty) => {
    return url + deletePolishSigns(settingsProperty) + '/';
};

const addNumberFilter = (url, settingsProperty) => {
    return url + `?search%5Bfilter_float_price:from%5D=${settingsProperty}`;
};

const addEnumFilter = (url, settingsProperty) => {
    let checkboxIterator = 0;
    settingsProperty.forEach(element => {
        url += `?search%5Bfilter_enum_rooms%5D%5B${checkboxIterator}%5D=${fromNumToString(element)}`;
        checkboxIterator++;
    });
    return url;
};

const buildURL = () => {
    let url = 'https://www.olx.pl/d/nieruchomosci/mieszkania/';
    if (settings.location) url = addPrefixFilter(url, settings.location);
    if (settings.priceFrom) url = addNumberFilter(url, settings.priceFrom);
    if (settings.priceTo) url = addNumberFilter(url, settings.priceTo);
    if (settings.sizeFrom) url = addNumberFilter(url, settings.sizeFrom);
    if (settings.sizeTo) url = addNumberFilter(url, settings.sizeTo);
    if (settings.rooms) url = addEnumFilter(url, settings.rooms)
    return url;
    //https://www.olx.pl/d/nieruchomosci/mieszkania/wroclaw/?search%5Bfilter_enum_rooms%5D%5B0%5D=one&search%5Bfilter_enum_rooms%5D%5B1%5D=two&search%5Bfilter_enum_rooms%5D%5B2%5D=four
};
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
