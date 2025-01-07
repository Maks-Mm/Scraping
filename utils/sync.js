import {
    ArticleList,
    ArticleList2,
    Article,
    Article2,
    AnalyzeArticle,
    AnalyzeArticle2,
    ArticleGeneralisation,
    ArticleGeneralisation2,
  } from "../models/index.js"; 
  import {synchronizeData} from "../lib/db.js"
  
  async function synchronizeDatabases() {
    console.log("Начало синхронизации баз данных...");
  
    await synchronizeData(ArticleList, ArticleList2);
  
    // Синхронизация Article
    await synchronizeData(Article, Article2);
  
    // Синхронизация AnalyzeArticle
    await synchronizeData(AnalyzeArticle, AnalyzeArticle2);
  
    // Синхронизация ArticleGeneralisation
    await synchronizeData(ArticleGeneralisation, ArticleGeneralisation2);
  
    console.log("Синхронизация баз данных завершена.");
    process.exit(0);
  }
  // Запуск синхронизации
  synchronizeDatabases();
  