import ArticleScraper from "../lib/ArticleScraper.js";
import { getLatestArticleList, saveArticle } from "../lib/db.js";

const pause = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const url =
  "https://www.blg-logistics.com/presse/suedhafen-schwer-im-geschaeft-umschlag-und-montage-von-kraftwerksmodulen-auf-neuer-blg-flaeche-in-bremerhaven"; // URL статьи
const articleScrap = async (url) => {
  const selectors = {
    titleSelector: "header h1",
    contentSelector: ".ce-bodytext",
    dateSelector: "header p",
  };

  const scraper = new ArticleScraper(url, selectors);
  const articleData = await scraper.execute();

  if (articleData) {
    await saveArticle(articleData);
    console.log("Данные статьи:", articleData);
  } else {
    console.log("Не удалось извлечь данные статьи.");
  }
};
const obj = await getLatestArticleList("BLG Logistik");
//console.log(obj);
obj.articleList.map(async (article, index) => {
  await pause(index * 1137);
  console.log(article.link);
  await articleScrap(article.link);
});
//await articleScrap(url);
