import axios from "axios";
import * as cheerio from "cheerio";

const run = async () => {
  try {
    const html = await axios.get("https://www.blg-logistics.com/presse");
    console.log(html);
    const $ = cheerio.load(html);

    const results = [];

    const container = $(".teaser__item");
    console.log(container.length);
    container.each((index, element) => {
      const title = $(element).find(".teaser__title a").text().trim();
      const link = $(element).find(".teaser__title a").attr("href");
      const date = $(element).find(".teaser__date").attr("datetime");

      results.push({ title, link, date });
    });

    console.log(results);
  } catch (error) {
    console.log(error);
  }
};
run();
