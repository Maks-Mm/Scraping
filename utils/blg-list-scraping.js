import { saveArticleList } from "./db";
import BlgArticleListScraper from "./BlgArticleListScraper";

(async () => {
  const url = "https://www.blg-logistics.com/presse";
  const selectors = {
    itemSelector: ".teaser__item",
    titleSelector: ".teaser__title a",
    linkSelector: ".teaser__title a",
    dateSelector: ".teaser__date",
  };

  const scraper = new BlgArticleListScraper(url, selectors);
  const articles = await scraper.execute();

  if (articles) {
    await saveArticleList("BLG Logistik", url, articles);
  }
})();
