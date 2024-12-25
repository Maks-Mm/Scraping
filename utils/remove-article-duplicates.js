import { getArticles, deleteArticle } from "../lib/db.js";

const articles = await getArticles();
console.log(articles.length);

let seenLinks = [];

articles.forEach(async (article) => {
  if (seenLinks.includes(article.link)) {
    await deleteArticle(article._id);
  } else {
    seenLinks.push(article.link);
  }
});

/*
 
*/
