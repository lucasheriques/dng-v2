import "server-only";

import ArticleList from "@/lib/article-list.json";

export function getArticles() {
  return ArticleList;
}

export function getLastArticle() {
  // sort by postDate descending
  return ArticleList.sort(
    (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
  )[0];
}

export function getMostPopularArticles() {
  const articles = [...ArticleList];
  return articles.sort((a, b) => b.views - a.views);
}

export function getRandomArticles(numberOfArticles: number) {
  const articles = [...ArticleList];
  return articles.sort(() => Math.random() - 0.5).slice(0, numberOfArticles);
}
