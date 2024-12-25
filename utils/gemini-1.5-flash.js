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

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateContent(article) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    saveAnalyzeArticle(newAnalyzeArticle);
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

const analyzeArticles = await getAnalyzeArticles(siteName);
console.log(siteName);
const articles = await getArticles(siteName);
console.log("artikles",articles.length);

const articlesForAnalyze = articles.filter((article) => {
  return !analyzeArticles.some(
    (analyzeArticle) => analyzeArticle.link === article.link
  );
});

console.log("articlesForAnalyze:", articlesForAnalyze.length);

if(articlesForAnalyze.length > 0){

  const chunks  = [
    articlesForAnalyze[0],
    articlesForAnalyze[1],
    articlesForAnalyze[2],
  ];
  console.log(chunks);
  chunks.forEach((article) => {
    if (!article) {
      console.error("Статья не найдена!");
    } else {
      generateContent(article);
    }
  });
}else{
  console.log("all articles are analyzed");
}


