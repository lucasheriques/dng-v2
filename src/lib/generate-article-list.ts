/* eslint-disable @typescript-eslint/no-explicit-any */
import { Article } from "@/lib/types";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

interface ArticleFromPosts {
  id: number;
  canonical_url: string;
  description: string;
  postTags?: [
    {
      id: string;
      publication_id: number;
      name: string;
      slug: string;
      hidden: boolean;
    },
  ];
}

interface ArticleFromManagement {
  id: number;
  slug: string;
  post_date: string;
  title: string;
  cover_image: string;
  stats: {
    views: number;
  };
}

// Load .env.local file
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUBSTACK_BASE_URL = "https://newsletter.nagringa.dev/api/v1";

// First define a combined type
type CombinedArticle = ArticleFromManagement & ArticleFromPosts;

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

  const response2 = await fetch(`${SUBSTACK_BASE_URL}/posts?limit=50`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  });

  if (!response.ok || !response2.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as { posts: ArticleFromManagement[] };
  const data2 = (await response2.json()) as ArticleFromPosts[];
  console.log(`Successfully fetched ${data.posts.length} articles`);

  // Create a map with combined data
  const combinedPostsMap = new Map<number, CombinedArticle>();

  // First add management data
  data.posts.forEach((post) => {
    combinedPostsMap.set(post.id, {
      ...post,
      id: post.id,
      postTags: undefined,
      canonical_url: "", // Default value
      description: "", // Default value
    });
  });

  // Then merge in the posts data
  data2.forEach((post) => {
    const existingPost = combinedPostsMap.get(post.id);
    if (existingPost) {
      combinedPostsMap.set(post.id, {
        ...existingPost,
        postTags: post.postTags,
        canonical_url: post.canonical_url,
        description: post.description,
      });
    }
  });

  return Array.from(combinedPostsMap.values());
}

async function generateArticleList() {
  // Fetch and save raw articles
  const articlesData = await fetchArticles();
  console.log("Fetched articles successfully");

  // Map only the required fields
  const simplifiedArticles: Article[] = articlesData.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    postDate: post.post_date,
    title: post.title,
    coverImage: post.cover_image,
    views: post.stats.views,
    description: post.description,
    canonical_url: post.canonical_url,
    postTags: post.postTags,
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
