import BaseScraper from "./BaseScraper.js";

export default class ArticleScraper extends BaseScraper {
  async scrape() {
    const { titleSelector, contentSelector, dateSelector } = this.selectors;

    console.log(titleSelector, contentSelector, dateSelector, "console1°");

    return await this.page.evaluate(
      ({ titleSelector, contentSelector, dateSelector }) => {
        // Функция для получения текста одного элемента
        const getText = (selector) => {
          return document.querySelector(selector)?.textContent.trim() || null;
        };

        // Функция для получения текста из всех элементов с одинаковым селектором
        const getAllText = (selector) => {
          return Array.from(document.querySelectorAll(selector))
            .map((el) => el.textContent.trim())
            .join("\n"); // Объединяем тексты в один с переносом строк
        };

        return {
          title: getText(titleSelector),
          content: getAllText(contentSelector), // Извлекаем все элементы с классом .ce-bodytext
          date: getText(dateSelector),
        };
      },
      { titleSelector, contentSelector, dateSelector }
    );
  }
}
