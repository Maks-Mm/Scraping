import mongoose from "mongoose";

// Подключение к первой базе данных
const db1 = mongoose.createConnection("mongodb://127.0.0.1:27017/scraping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Подключение ко второй базе данных
const db2 = mongoose.createConnection(
  "mongodb+srv://maxfilawwwrest:4SlB0GY7Ne5mg7qy@cluster0.6envw.mongodb.net/analyzer?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const ArticleListSchema = {
  siteName: String,
  link: String,
  articleList: Array,
};

// Модели для первой базы данных
export const ArticleList = db1.model("ArticleList", ArticleListSchema);
export const ArticleList2 = db2.model("ArticleList", ArticleListSchema);

const ArticleSchema = {
  title: String,
  content: String,
  date: String,
  siteName: String,
  link: String,
};

export const Article = db1.model("Article", ArticleSchema);
export const Article2 = db2.model("Article", ArticleSchema);

const AnalyzeArticleSchema = {
  title: String,
  content: String,
  date: String,
  siteName: String,
  link: String,
};
// Модели для второй базы данных
export const AnalyzeArticle = db1.model("AnalyzeArticle", AnalyzeArticleSchema);
export const AnalyzeArticle2 = db2.model("AnalyzeArticle", AnalyzeArticleSchema);

const ArticleGeneralisationSchema = {
  content: String,
  siteName: String,
};

export const ArticleGeneralisation = db1.model("ArticleGeneralisation",ArticleGeneralisationSchema);
export const ArticleGeneralisation2 = db2.model("ArticleGeneralisation",ArticleGeneralisationSchema);