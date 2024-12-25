import ArticleScraper from "../lib/ArticleScraper.js";
import { getLatestArticleList, saveArticle, getArticles } from "../lib/db.js";

const siteName = "BLG Logistik";
const pause = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const articleScrap = async (url) => {
  const selectors = {
    titleSelector: "header h1",
    contentSelector: ".ce-bodytext",
    dateSelector: "header p",
  };

  const scraper = new ArticleScraper(url, selectors);
  const articleData = await scraper.execute();

  if (articleData) {
    articleData.siteName = siteName;
    articleData.link = url;
    await saveArticle(articleData);
    console.log("Данные статьи:", articleData);
  } else {
    console.log("Не удалось извлечь данные статьи.");
  }
};
const obj = await getLatestArticleList(siteName);
//console.log(obj);
const allArticles = obj.articleList;
const existetArticles = await getArticles(siteName);
//the filter work no correct
const articlesForScraping = allArticles.filter((article) => {
  return !existetArticles.some(
    (existingArticle) => existingArticle.link === article.link
  );
});
console.log("articlesForScraping:", articlesForScraping.length);

if (existetArticles.length > 0) {
  const chunks = existetArticles.slice(0, 3);
  console.log(chunks, "new order work");

  await Promise.all(
    chunks.map(async (article, index) => {
      await pause(index * 1137 + 2000);
      console.log(article.link);
      await articleScrap(article.link);
    })
  );
} else {
  console.log("all articles are scraped !");
}
process.exit(0);
/*
  test
*/

/*
const url =
  "https://www.blg-logistics.com/presse/suedhafen-schwer-im-geschaeft-umschlag-und-montage-von-kraftwerksmodulen-auf-neuer-blg-flaeche-in-bremerhaven"; // URL статьи
//await articleScrap(url);*/
