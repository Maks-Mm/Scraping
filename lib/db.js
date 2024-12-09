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

export async function saveArticleList(siteName, link, articles) {
  const articleList = new ArticleList({
    siteName,
    link,
    articleList: articles,
  });
  await articleList.save();
  console.log("Данные успешно сохранены!");
}
