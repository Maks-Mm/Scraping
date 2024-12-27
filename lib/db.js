import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/scraping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ArticleList = mongoose.model("ArticleList", {
  siteName: String,
  link: String,
  articleList: Array,
});

const Article = mongoose.model("Article", {
  title: String,
  content: String,
  date: String,
  siteName: String,
  link:String,
});

const AnalyzeArticle = mongoose.model("AnalyzeArticle", {
  title: String,
  content: String,
  date: String,
  siteName: String,
  link:String,
});

const ArticleGeneralisation = mongoose.model("ArticleGeneralisation", {
  content: String,
  siteName: String,
});

export async function saveArticle(data) {
  const newArticle = new Article(data);
  await newArticle.save();
  console.log("the Article is saved");
}

export async function saveArticleGeneralisation(data) {
  const newAG = new ArticleGeneralisation(data);
  await newAG.save();
  console.log("the ArticleGeneralisation is saved");
}

export async function saveAnalyzeArticle(data) {
  const newArticle = new AnalyzeArticle(data);
  await newArticle.save();
  console.log("the Article is saved");
}
export async function saveArticleList(siteName, link, articles) {
  const articleList = new ArticleList({
    siteName,
    link,
    articleList: articles,
  });
  await articleList.save();
  console.log("Данные успешно сохранены!");
}

export async function getLatestArticleList(siteName) {
  const latest = await ArticleList.find({ siteName })
    .sort({ _id: -1 })
    .limit(1);
  return latest[0];
}

export async function getArticles(siteName) {
  const query = siteName ? {siteName} : {};
  const list = await Article.find(query);
  return list;
}


export async function getAnalyzeArticles(siteName) {
  const list = await AnalyzeArticle.find({ siteName })
  return list;
}

export async function deleteArticle(_id) {
  try {
    const result = await Article.deleteOne({ _id: _id });
    if (result.deletedCount === 0) {
      throw new Error("Статья не найдена");
    }
    console.log("Статья успешно удалена");
    return result;
  } catch (error) {
    console.error("Ошибка при удалении статьи:", error);
    throw error;
  }
}



/*Api Key
AIzaSyC32GN759QiVJZlEQLa5R2fML53h0q9zEQ
 */