/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Load .env.local file
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUBSTACK_BASE_URL = "https://newsletter.nagringa.dev/api/v1";

interface Article {
  slug: string;
  postDate: string;
  title: string;
  coverImage: string | null;
  views: number;
}

async function fetchArticles() {
  const cookie = process.env.SUBSTACK_AUTH_COOKIE;
  if (!cookie) {
    throw new Error("SUBSTACK_AUTH_COOKIE is not set");
  }

  console.log("Fetching articles from Substack API...");

  const response = await fetch(
    `${SUBSTACK_BASE_URL}/post_management/published?offset=0&limit=50&order_by=post_date&order_direction=desc`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Successfully fetched ${data.posts.length} articles`);

  return data;
}

async function generateArticleList() {
  // Fetch and save raw articles
  const articlesData = await fetchArticles();
  const rawArticlesPath = join(__dirname, "articles-raw.json");
  writeFileSync(rawArticlesPath, JSON.stringify(articlesData, null, 2));
  console.log("Raw articles saved to articles-raw.json");

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
  console.log("Simplified article list generated successfully!");
}

// Need to use an IIFE since top-level await isn't available in all environments
(async () => {
  try {
    await generateArticleList();
  } catch (error) {
    console.error("Error generating article list:", error);
    process.exit(1);
  }
})();
