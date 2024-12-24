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
1. Нужно создать метод, который будет удалять статью (мы создаём функцию в файле db.js).  
2. Нужно написать алгоритм, который будет находить "дубли".  
3. Удалить найденные дубликаты.  
*/
