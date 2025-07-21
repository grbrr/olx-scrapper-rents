const cheerio = require('cheerio');

const settings = require('./settings.js');

const getProperPath = data => {
    return data.replace(/:nth-child\([0-9]\)/g, '').replace(/:nth-child\([0-9][0-9]\)/g, ''); //some nth-child has one and some other has two numbers
};

const puppeteer = require('puppeteer');

const request = async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(settings.url, { waitUntil: 'networkidle2' });

        const content = await page.content();

        const $ = cheerio.load(content);

        let titleArr = $(getProperPath(settings.titleSelector)).contents().map(function () {
            if (this.type === 'text') return $(this).text();
        }).get();
        //console.log(titleArr);

        let addressAndDateArr = $(getProperPath(settings.addressAndDateSelector)).contents().map(function () {
            if (this.type === 'text') return $(this).text().trim();
        }).get();

        let addressArr = [], dateArr = [];
        addressAndDateArr.forEach(item => {
            const [address, date] = item.split(' - ').map(part => part.trim());
            addressArr.push(address);
            dateArr.push(date.replace(/Odświeżono( dnia)?/i, '').trim()); // removes unnecessary text
        });
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

        //console.log(titleArr.length, addressArr.length, dateArr.length, sizeArr.length, costArr.length);
        let resultArr = [];
        for (let i = 0; i < titleArr.length; i++) {
            // Pobierz link do ogłoszenia
            let link = null;
            const linkElem = $(getProperPath(settings.hyperlinkSelector)).eq(i);
            if (linkElem.length) {
                link = linkElem.attr('href');
                if (link && link.startsWith('/')) {
                    link = 'https://www.olx.pl' + link;
                }
            }
            resultArr[i] = {
                //number: i + 1,
                title: titleArr[i],
                address: addressArr[i],
                cost: costArr[i],
                size: sizeArr[i],
                date: dateArr[i],
                link: link
            };
        };
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

console.log('starting script...');
request();
setInterval(() => {
    console.log('restarting script...');
    request();
}, settings.interval * 1000);
console.log(`Script will run every ${settings.interval} seconds.`);
console.log('To stop the script, press Ctrl+C.');