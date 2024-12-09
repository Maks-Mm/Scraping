class BaseScraper {
  constructor(url) {
    this.url = url;
  }

  async initBrowser() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async scrape() {
    throw new Error("Метод scrape() должен быть реализован в подклассе");
  }

  async execute() {
    try {
      await this.initBrowser();
      await this.navigate();
      const data = await this.scrape();
      return data;
    } catch (error) {
      console.error("Ошибка при парсинге:", error);
    } finally {
      await this.closeBrowser();
    }
  }
}
