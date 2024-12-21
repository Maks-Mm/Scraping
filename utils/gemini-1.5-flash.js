import { GoogleGenerativeAI } from "@google/generative-ai";
import { getArticles } from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();
// Константы
const API_KEY = process.env.API_KEY;
const siteName = "BLG Logistik";

// Создание экземпляра GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(API_KEY);

// Функция для анализа статьи и генерации контента
async function generateContent() {
  try {
    // Получение статей из базы данных
    const articles = await getArticles(siteName);
    const article = articles[0];

    if (!article) {
      console.error("Статья не найдена!");
      return;
    }

    // Инициализация модели
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Отправка запроса к API
    const response = await model.generateContent([
      `answer in russian language. You must analyze the article: ${article}`,
    ]);

    // Обработка ответа API
    console.log("Ответ:", response.response.text());
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

// Запуск основной логики
generateContent();
