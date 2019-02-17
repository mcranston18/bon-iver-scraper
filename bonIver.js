const puppeteer = require('puppeteer');
const twilio = require('./twilio');

const bonIverUrl = 'http://www.playhousesquare.org/events/detail/bon-iver';
const bonIverId = '2A11C63A-4B8E-4C09-9F85-65C68EFA2AAB';

const makeResponse = async ({ browser, page, ticketsAvailable, msg }) => {
  const imageBuffer = await page.screenshot({ fullPage: true });
  const response = { ticketsAvailable, msg, image: imageBuffer.toString('base64') };
  await browser.close();
  return response;
};

const hasGoodTickets = itemBoxes => {
  const items = itemBoxes
    .map(x => {
      const item = x.replace('\n', '');
      const sections = ['Dress Circle A', 'Dress Circle B', 'Loge', 'Boxes'];
      const matchedSection = sections.find(section => item.includes(section));
      const soldOut = item.toLowerCase().includes('sold out');

      if (matchedSection && !soldOut) {
        return {
          section: matchedSection,
          soldOut,
        };
      }

      return null;
    })
    .filter(x => !!x);

  if (items.length) {
    return JSON.stringify(items);
  }

  return false;
};

const crawl = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();

    // 1st page
    await page.goto(bonIverUrl, { waitUntil: 'networkidle2' });
    const hrefs = await page.$$eval('a', anchors => anchors.map(a => a.href));

    const href = hrefs.find(x => {
      return (
        x.toLowerCase().startsWith('https://tickets.playhousesquare.org/online/default.asp') &&
        x.includes(bonIverId)
      );
    });

    await page.goto(href, { waitUntil: 'networkidle2' });

    // 2nd page
    await page.waitForSelector('.results-box.standard-search-results');

    // Check if sold out message is visible
    const msgs = await page.$$eval(
      '.results-box.standard-search-results .unavailable-message',
      divs => divs.map(x => x.textContent)
    );

    if (msgs.some(x => x.toLowerCase().includes('sold out'))) {
      const msg = 'Probably sold out: ' + JSON.stringify(msgs);
      return makeResponse({ browser, page, ticketsAvailable: false, msg });
    }

    // If not explicitly sold out, try to click on hrefs
    await page.click('.results-box.standard-search-results a');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // 3rd page
    await page.waitForSelector('#seat-price-zone');
    const itemBoxes = await page.$$eval('.item-box-item', items =>
      items.map(item => item.textContent)
    );
    const goodTickets = hasGoodTickets(itemBoxes);

    if (goodTickets) {
      await twilio.send('There are good tickets available!');
      return makeResponse({ browser, page, ticketsAvailable: true, msg: goodTickets });
    } else {
      return makeResponse({
        browser,
        page,
        ticketsAvailable: false,
        msg: 'There are tickets, but the seat are not good',
      });
    }
  } catch (e) {
    return makeResponse({ browser, page, ticketsAvailable: 'unknown', message: e });
  }
};

module.exports = crawl;
