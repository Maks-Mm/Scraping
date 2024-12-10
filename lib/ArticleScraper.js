import BaseScraper from "./BaseScraper.js";

export default class ArticleScraper extends BaseScraper {
    async scrape() {
      const { titleSelector, contentSelector, dateSelector, authorSelector } = this.selectors;
  
      return await this.page.evaluate(
        ({ titleSelector, contentSelector, dateSelector, authorSelector }) => {
          const getText = (selector) => document.querySelector(selector)?.textContent.trim() || null;
  
          return {
            title: getText(titleSelector),
            content: getText(contentSelector),
           // date: getText(dateSelector),
            author: getText(authorSelector),
          };
        },
        { titleSelector, contentSelector, dateSelector, authorSelector }
      );
    }
  }
 // module.exports = ArticleScraper;

  /*error
  
  npm run get-article

> scraping@1.0.0 get-article
> node utils/article-scraper.js

Ошибка при парсинге: DOMException: SyntaxError: Failed to execute 'querySelector' on 'Document': The provided selector is empty.
    at getText (evaluate at ArticleScraper.scrape (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/lib/ArticleScraper.js:7:30), <anonymous>:1:49)
    at evaluate (evaluate at ArticleScraper.scrape (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/lib/ArticleScraper.js:7:30), <anonymous>:7:20)
    at #evaluate (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/node_modules/puppeteer-core/lib/esm/puppeteer/cdp/ExecutionContext.js:388:19)
    at async ExecutionContext.evaluate (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/node_modules/puppeteer-core/lib/esm/puppeteer/cdp/ExecutionContext.js:275:16)
    at async IsolatedWorld.evaluate (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/node_modules/puppeteer-core/lib/esm/puppeteer/cdp/IsolatedWorld.js:97:16)
    at async CdpFrame.evaluate (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/node_modules/puppeteer-core/lib/esm/puppeteer/api/Frame.js:345:20)
    at async CdpPage.evaluate (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/node_modules/puppeteer-core/lib/esm/puppeteer/api/Page.js:808:20)
    at async ArticleScraper.scrape (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/lib/ArticleScraper.js:7:14)
    at async ArticleScraper.execute (file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/lib/BaseScraper.js:31:20)
    at async file:///C:/Users/Maksym/Desktop/einFolder3/Scraping/utils/article-scraper.js:14:23
Не удалось извлечь данные статьи.
PS C:\Users\Maksym\Desktop\einFolder3\Scraping>
  */