export default  class BlgArticleListScraper extends BaseScraper {
  async scrape() {
    const { itemSelector, titleSelector, linkSelector, dateSelector } = this.selectors;
    return await this.page.evaluate(({ itemSelector, titleSelector, linkSelector, dateSelector }) => {
      const items = [];
      const container = document.querySelectorAll(itemSelector);

      container.forEach((element) => {
        const title = element.querySelector(titleSelector)?.textContent.trim();
        const link = element.querySelector(linkSelector)?.href;
        const date = element.querySelector(dateSelector)?.getAttribute("datetime");
        if (title && link) {
          items.push({ title, link, date });
        }
      });

      return items;
    }, { itemSelector, titleSelector, linkSelector, dateSelector });
  }
}
