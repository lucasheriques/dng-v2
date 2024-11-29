/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Article {
  slug: string;
  postDate: string;
  title: string;
  coverImage: string | null;
  views: number;
}

function generateArticleList() {
  // Read the articles.json file
  const articlesPath = join(__dirname, "articles-raw.json");
  const articlesData = JSON.parse(readFileSync(articlesPath, "utf8"));

  // Map only the required fields
  const simplifiedArticles: Article[] = articlesData.posts.map((post: any) => ({
    slug: post.slug,
    postDate: post.post_date,
    title: post.title,
    coverImage: post.cover_image,
    views: post.stats.views,
  }));

  // Write the simplified list to article-list.json
  const outputPath = join(__dirname, "article-list.json");
  writeFileSync(outputPath, JSON.stringify(simplifiedArticles, null, 2));

  console.log("Article list generated successfully!");
}

generateArticleList();
