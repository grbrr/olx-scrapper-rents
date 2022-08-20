const axios = require('axios');
const cheerio = require('cheerio');

const settings = require('./settings.json');

const getProperPath = data => {
    return data.replace(/:nth-child\([0-9]\)/g, '').replace(/:nth-child\([0-9][0-9]\)/g, ''); //some nth-child has one and some other has two numbers
};

const request = async () => {
    const url = settings.urlBase;
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
        await console.log(resultArr);
        return resultArr;
    } catch (e) {
        console.error(`Error in otodom: ${e.message}`);
    };
};

console.log('starting script...');
request();
