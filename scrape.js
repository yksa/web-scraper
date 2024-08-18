import puppeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const allBooks = [];
  let currentPage = 1;
  const maxPages = 10;

  while (currentPage <= maxPages) {
    const url = `http://books.toscrape.com/catalogue/page-${currentPage}.html`;
    await page.goto(url, { waitUntil: "networkidle2" });

    const books = await page.evaluate(() => {
      const elements = document.querySelectorAll(".product_pod");
      const results = [];

      elements.forEach((element) => {
        const title = element.querySelector("h3 > a").getAttribute("title");
        const price = element.querySelector(".price_color").textContent;
        results.push({ title, price });
      });

      return results;
    });

    allBooks.push(...books);
    currentPage++;
  }

  fs.writeFileSync("books.json", JSON.stringify(allBooks, null, 2));

  console.log('Data saved to "books.json"');

  await browser.close();
};

const scrapeBinanceP2P = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = "https://p2p.binance.com/trade/all-payments/USDT?fiat=EUR";
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for the specific element to be visible
  await page.waitForSelector(".bn-flex.flex-col", { visible: true });

  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll(".bn-flex.flex-col");
    const results = [];

    elements.forEach((element) => {
      const priceElement = element.querySelector(".headline5");
      if (priceElement) {
        const price = priceElement.textContent.trim();
        results.push(price);
      }
    });

    return results;
  });

  console.log(data); // This should log an array of prices
  console.log("first price: ", data[0]);
  await browser.close();
};

// scrapeBinanceP2P();

scrape();
