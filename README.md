# olxRentScrapper

Repo for scrapping real estates ads. It scrapes ads from OLX, filters them by price and size, and sends email notifications for new ads.

## Installation and launch

Runs in node.js. Clone files to your machine and create `.env` file in root directory with your credentials.

```env
OLX_EMAIL=sender_email@gmail.com
OLX_EMAIL_PASS=password
MAIL_RECEIVER=receiver_email@gmail.com
```

In `settings.js` you can set your filters - just copy **URL** from your browser and paste it to `url` variable (remember to have sorting by **Newest**). You can also change interval of checking for new ads.

Update selectors if needed (they may change over time). You can find selectors by inspecting the page in your browser.

Run commands in shell:

```shell
npm i
npm start
```

If you want to run it on aarch 64 also run:

```shell
apt install chromium
```

And in .env file add:

```env
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

## Features

- Scraps ads from OLX (from **today** only)
- Sends email notifications for new ads
- Filters by price and size
- Supports multiple ads per page
- Handles date and time formatting
- Promoted ads are marked
- Uses environment variables for sensitive data
