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

// Функции для работы с первой базой данных
export async function saveArticle(data) {
  const newArticle = new Article(data);
  await newArticle.save();
  console.log("Статья сохранена");
}

export async function saveArticleList(siteName, link, articles) {
  const articleList = new ArticleList({
    siteName,
    link,
    articleList: articles,
  });
  await articleList.save();
  console.log("Список статей успешно сохранен!");
}

// Функции для работы со второй базой данных
export async function saveAnalyzeArticle(data) {
  const newArticle = new AnalyzeArticle(data);
  await newArticle.save();
  console.log("Анализ статьи сохранен");
}

export async function saveArticleGeneralisation(data) {
  const newAG = new ArticleGeneralisation(data);
  await newAG.save();
  console.log("Обобщение статьи сохранено");
}

// Примеры получения данных из обеих баз
export async function getLatestArticleList(siteName) {
  const latest = await ArticleList.find({ siteName })
    .sort({ _id: -1 })
    .limit(1);
  return latest[0];
}

export async function getAnalyzeArticles(siteName) {
  const list = await AnalyzeArticle.find({ siteName });
  return list;
}

/**
 * Синхронизация данных между базами данных
 * @param {mongoose.Model} SourceModel - Модель исходной базы данных
 * @param {mongoose.Model} TargetModel - Модель целевой базы данных
 */
export async function synchronizeData(SourceModel, TargetModel) {
  try {
    console.log(`Начало синхронизации для: ${SourceModel.modelName}`);

    // Извлечение данных из исходной базы данных
    const sourceData = await SourceModel.find({});
    console.log(`Найдено ${sourceData.length} записей в источнике`);

    for (const data of sourceData) {
      // Проверяем, существует ли запись в целевой базе
      const exists = await TargetModel.findOne({ _id: data._id });
      if (!exists) {
        // Если записи нет, добавляем её
        const newEntry = new TargetModel(data.toObject());
        await newEntry.save();
        console.log(`Запись с ID ${data._id} синхронизирована.`);
      } else {
        console.log(`Запись с ID ${data._id} уже существует.`);
      }
    }

    console.log(`Синхронизация завершена для: ${SourceModel.modelName}`);
  } catch (error) {
    console.error("Ошибка во время синхронизации:", error);
  }
}
