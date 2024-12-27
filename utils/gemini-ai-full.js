import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getArticles,
  getAnalyzeArticles,
  saveAnalyzeArticle,
  saveArticleGeneralisation,
} from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.API_KEY;
const siteName = "BLG Logistik";

// Инициализация API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Функция для генерации контента
async function generateContent(allAnalyzedArticles) {
  try {
    const json = JSON.stringify(allAnalyzedArticles);
    const response = await model.generateContent([
      `answer in russian language. you have to analyse the data, make a concentration of the data: ${json}`,
    ]);
    console.log("Ответ:", response.response.text());

    const articleGeneralisation = {
      content: response.response.text(),
      siteName,
    };
   await saveArticleGeneralisation(articleGeneralisation)
  } catch (error) {
    console.error("Ошибка при анализе статьи:", error);
  }
}

// Основная логика
(async () => {
  try {
    const analyzeArticles = await getAnalyzeArticles(siteName);
    console.log(
      `${siteName} - Всего проанализированных статей: ${analyzeArticles.length}`
    );

    if (analyzeArticles.length > 0) {
      await generateContent(analyzeArticles);

      console.log("Анализ завершен для всех статей.");
    } else {
      console.log("Все статьи уже проанализированы.");
    }
  } catch (error) {
    console.error("Ошибка в процессе обработки:", error);
  }

  process.exit(0);
})();
