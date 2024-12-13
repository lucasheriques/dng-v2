import "server-only";

import ArticleList from "@/lib/article-list.json";

export function getArticles() {
  return ArticleList;
}

export function getLastArticle() {
  return ArticleList[0];
}

export function getMostPopularArticles() {
  const articles = [...ArticleList];
  return articles.sort((a, b) => b.views - a.views);
}
