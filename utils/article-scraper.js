import ArticleScraper from "../lib/ArticleScraper.js"

(async () => {
  const url =
    "https://www.blg-logistics.com/presse/suedhafen-schwer-im-geschaeft-umschlag-und-montage-von-kraftwerksmodulen-auf-neuer-blg-flaeche-in-bremerhaven"; // URL статьи
  const selectors = {
    titleSelector: "header h1",
    contentSelector: ".ce-bodytext",
    dateSelector: "header p",
    authorSelector: "",
  };

  const scraper = new ArticleScraper(url, selectors);
  const articleData = await scraper.execute();

  if (articleData) {
    console.log("Данные статьи:", articleData);
  } else {
    console.log("Не удалось извлечь данные статьи.");
  }
})();
