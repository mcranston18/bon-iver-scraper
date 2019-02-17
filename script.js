const puppeteer = require('puppeteer');
const hasTickets = require('./hasTickets');

const log = console.log;

const landingPage = 'http://www.playhousesquare.org/events/detail/bon-iver';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 1st page
  await page.goto(landingPage, { waitUntil: 'networkidle2' });
  const hrefs = await page.$$eval('a', anchors => anchors.map(a => a.href));
  const href = hrefs.find(x => {
    return (
      x.startsWith('https://tickets.playhousesquare.org/online/default.asp?doWork') &&
      x.includes('2A11C63A-4B8E-4C09-9F85-65C68EFA2AAB')
    );
  });
  await page.goto(href, { waitUntil: 'networkidle2' });

  // 2nd page
  await page.waitForSelector('.results-box.standard-search-results a').catch(log);
  await page.click('.results-box.standard-search-results a').catch(log);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // 3rd page
  await page.waitForSelector('#seat-price-zone').catch(log);
  const itemBoxes = await page.$$eval('.item-box-item', items =>
    items.map(item => item.textContent)
  );

  const tickets = hasTickets(itemBoxes);

  if (tickets) {
    // send message
  }
  await browser.close();
})();
