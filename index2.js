import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.blg-logistics.com/presse");

  const title = await page.title();
  console.log(`Заголовок страницы: ${title}`);

  const h1Text = await page.$eval("h1", (el) => el.textContent);
  console.log(`Содержимое <h1>: ${h1Text}`);

  const results = await page.evaluate(() => {
    const items = [];
    const container = document.querySelectorAll(".teaser__item");

    console.log(container.length,"Wasia");
    
/*   container.forEach((element) => {
      const title = element.querySelector(".teaser__title a").textContent.trim();
      const link = element.querySelector(".teaser__title a").href;
      const date = element.querySelector(".teaser__date").getAttribute("datetime");

      items.push({ title, link, date });
    }); */

    return items;
  });

  console.log(results);

 // await browser.close();
})();
