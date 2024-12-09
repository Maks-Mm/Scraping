import { saveArticleList } from "./db";
import BlgArticleListScraper from "./BlgArticleListScraper";

(async () => {
  const url = "https://www.blg-logistics.com/presse";
  const scraper = new BlgArticleListScraper(url);
  const articles = await scraper.execute();

  if (articles) {
    await saveArticleList("BLG Logistik", url, articles);
  }
})();
