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
});

export async function saveArticle(data){
const newArticle = new Article(data)
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
