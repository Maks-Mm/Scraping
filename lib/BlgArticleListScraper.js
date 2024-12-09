class BlgArticleListScraper extends BaseScraper {
    async scrape() {
      return await this.page.evaluate(() => {
        const items = [];
        const container = document.querySelectorAll(".teaser__item");
  
        container.forEach((element) => {
          const title = element.querySelector(".teaser__title a")?.textContent.trim();
          const link = element.querySelector(".teaser__title a")?.href;
          const date = element.querySelector(".teaser__date")?.getAttribute("datetime");
          if (title && link) {
            items.push({ title, link, date });
          }
        });
  
        return items;
      });
    }
  }
  