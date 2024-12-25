import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getArticles,
  getAnalyzeArticles,
  saveAnalyzeArticle,
} from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.API_KEY;
const siteName = "BLG Logistik";

// Инициализация API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Функция для генерации контента
async function generateContent(article) {
  try {
    const response = await model.generateContent([
      `answer in russian language. You must analyze the article: ${article}`,
    ]);
    console.log("Ответ:", response.response.text());

    const newAnalyzeArticle = {
      title: article.title,
      content: response.response.text(),
      date: article.date,
      siteName: article.siteName,
      link: article.link,
    };

    // Сохранение анализа статьи в базе данных
    await saveAnalyzeArticle(newAnalyzeArticle);
  } catch (error) {
    console.error("Ошибка при анализе статьи:", error);
  }
}

// Основная логика
(async () => {
  try {
    // Получение уже проанализированных статей
    const analyzeArticles = await getAnalyzeArticles(siteName);
    console.log(`${siteName} - Всего проанализированных статей: ${analyzeArticles.length}`);

    // Получение всех статей
    const articles = await getArticles(siteName);
    console.log(`${siteName} - Всего статей: ${articles.length}`);

    // Отбор статей, которые еще не проанализированы
    const articlesForAnalyze = articles.filter((article) => {
      return !analyzeArticles.some(
        (analyzeArticle) => analyzeArticle.link === article.link
      );
    });

    console.log(`Статей для анализа: ${articlesForAnalyze.length}`);

    if (articlesForAnalyze.length > 0) {
      const chunks = articlesForAnalyze.slice(0, 3);
      console.log("Обрабатываем статьи:", chunks);

      await Promise.all(
        chunks.map(async (article) => {
          if (!article) {
            console.error("Статья не найдена!");
          } else {
            await generateContent(article);
          }
        })
      );

      console.log("Анализ завершен для всех статей.");
    } else {
      console.log("Все статьи уже проанализированы.");
    }
  } catch (error) {
    console.error("Ошибка в процессе обработки:", error);
  }

  process.exit(0);
})();
