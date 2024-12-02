import axios from "axios";
import * as cheerio from "cheerio";

const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const resultContent = $("h2.title").text(); // "Hello world"
console.log(resultContent);

const run = async () => {
  try {
    const html = await axios.get("https://www.blg-logistics.com/presse");
    // handle success
    const $ = cheerio.load(html);

    // Array zum Speichern der Ergebnisse
    const results = [];

    // Selektiere die Cards und extrahiere die gewünschten Daten
    $(".teaser__item").each((index, element) => {
      const title = $(element).find(".teaser__title a").text().trim();
      const link = $(element).find(".teaser__title a").attr("href");
      const date = $(element).find(".teaser__date").attr("datetime");

      results.push({ title, link, date });
    });

    // Ergebnisse anzeigen
    console.log(results);
    console.log(response);
  } catch (error) {
  } finally {
  }
};
run();

//keine ergebnisse von daten
