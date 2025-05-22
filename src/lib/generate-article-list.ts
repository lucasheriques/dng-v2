/* eslint-disable @typescript-eslint/no-explicit-any */
import { Article } from "@/lib/types";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const NUMBER_OF_ARTICLES = 100;

// ----- Configuration -----
const CONFIG = {
  SUBSTACK_BASE_URL: "https://newsletter.nagringa.dev/api/v1",
  BATCH_SIZE: 50,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  OUTPUT_FILE: "article-list.json",
};

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

// Combined type
type CombinedArticle = ArticleFromManagement & ArticleFromPosts;

// Load .env.local file
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sleep for the specified number of milliseconds
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Logger utility with hierarchical formatting
 */
class Logger {
  private indentLevel = 0;
  private timers: Record<string, number> = {};

  /**
   * Increase the indentation level
   */
  indent(): void {
    this.indentLevel++;
  }

  /**
   * Decrease the indentation level
   */
  outdent(): void {
    if (this.indentLevel > 0) {
      this.indentLevel--;
    }
  }

  /**
   * Get the current indentation string
   */
  private getIndent(): string {
    return "  ".repeat(this.indentLevel);
  }

  /**
   * Log a header section
   */
  header(message: string): void {
    console.log(
      "\n" +
        this.getIndent() +
        "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log(this.getIndent() + "┃ " + message);
    console.log(
      this.getIndent() + "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
  }

  /**
   * Log an info message
   */
  info(message: string): void {
    console.log(this.getIndent() + "ℹ️ " + message);
  }

  /**
   * Log a success message
   */
  success(message: string): void {
    console.log(this.getIndent() + "✅ " + message);
  }

  /**
   * Log a warning message
   */
  warn(message: string): void {
    console.log(this.getIndent() + "⚠️ " + message);
  }

  /**
   * Log an error message
   */
  error(message: string): void {
    console.error(this.getIndent() + "❌ " + message);
  }

  /**
   * Log a start operation message
   */
  start(message: string): void {
    console.log("\n" + this.getIndent() + "🔹 " + message);
  }

  /**
   * Log a process message
   */
  process(message: string): void {
    console.log(this.getIndent() + "⏳ " + message);
  }

  /**
   * Log a fetching message
   */
  fetch(message: string): void {
    console.log(this.getIndent() + "📥 " + message);
  }

  /**
   * Log a result message
   */
  result(message: string): void {
    console.log(this.getIndent() + "📊 " + message);
  }

  /**
   * Log a separator line
   */
  separator(): void {
    console.log(
      this.getIndent() + "─────────────────────────────────────────────────────"
    );
  }

  /**
   * Start a timer
   */
  startTimer(label: string): void {
    this.timers[label] = Date.now();
  }

  /**
   * End a timer and log the elapsed time
   */
  endTimer(label: string): string {
    if (!this.timers[label]) {
      return "unknown";
    }

    const elapsed = Date.now() - this.timers[label];
    const time = this.formatTime(elapsed);
    delete this.timers[label];
    return time;
  }

  /**
   * End a timer and log the elapsed time
   */
  endTimerAndLog(label: string, message: string): void {
    const time = this.endTimer(label);
    this.success(`${message} (${time})`);
  }

  /**
   * Format milliseconds into a human-readable string
   */
  private formatTime(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  }
}

// Create a global logger
const log = new Logger();

/**
 * Unofficial Substack API Client
 * Handles all interactions with the Substack API
 */
class SubstackApiClient {
  private baseUrl: string;
  private batchSize: number;
  private maxRetries: number;
  private retryDelayMs: number;
  private authCookie: string;

  constructor(options: {
    baseUrl: string;
    batchSize?: number;
    maxRetries?: number;
    retryDelayMs?: number;
    authCookie: string;
  }) {
    this.baseUrl = options.baseUrl;
    this.batchSize = options.batchSize || 50;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelayMs = options.retryDelayMs || 1000;
    this.authCookie = options.authCookie;

    if (!this.authCookie) {
      throw new Error("⛔ Authentication cookie is required for Substack API");
    }
  }

  /**
   * Calculate how many batches are needed based on the total number of articles
   */
  private calculateBatchCount(): number {
    return Math.ceil(NUMBER_OF_ARTICLES / this.batchSize);
  }

  /**
   * Make an API request with retry logic
   */
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const fullOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Cookie: this.authCookie,
        ...(options?.headers || {}),
      },
    };

    let retries = this.maxRetries;

    while (true) {
      try {
        const response = await fetch(url, fullOptions);

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}, url: ${url}`
          );
        }

        return (await response.json()) as T;
      } catch (error) {
        if (retries <= 0) {
          throw error;
        }

        log.warn(
          `Error fetching data, retrying... (${this.maxRetries - retries + 1}/${this.maxRetries})`
        );
        await sleep(this.retryDelayMs);
        retries--;
      }
    }
  }

  /**
   * Fetch data with pagination
   */
  private async fetchWithOffset<T>(
    endpoint: string,
    offset: number,
    queryParams: Record<string, string> = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Add pagination parameters
    url.searchParams.append("offset", offset.toString());
    url.searchParams.append("limit", this.batchSize.toString());

    log.fetch(
      `Fetching from ${endpoint} with offset=${offset}, limit=${this.batchSize}...`
    );

    log.startTimer(`fetch-${endpoint}-${offset}`);
    const data = await this.request<T>(url.toString());

    const count = this.getResultCount(data);
    log.endTimerAndLog(
      `fetch-${endpoint}-${offset}`,
      `Fetched ${count} items from ${endpoint} (offset=${offset})`
    );

    return data;
  }

  /**
   * Get the count of items in a response
   */
  private getResultCount(data: any): number {
    if (Array.isArray(data)) {
      return data.length;
    } else if (
      data &&
      typeof data === "object" &&
      data.posts &&
      Array.isArray(data.posts)
    ) {
      return data.posts.length;
    }
    return 0;
  }

  /**
   * Fetch all batches of data from an endpoint
   */
  private async fetchAllBatches<T, R>(
    endpoint: string,
    queryParams: Record<string, string> = {},
    extractData: (response: T) => R[]
  ): Promise<R[]> {
    const batchCount = this.calculateBatchCount();
    log.info(
      `Will fetch ${batchCount} batch(es) to cover ${NUMBER_OF_ARTICLES} articles`
    );

    const results: R[] = [];

    for (let i = 0; i < batchCount; i++) {
      const offset = i * this.batchSize;
      const batch = await this.fetchWithOffset<T>(
        endpoint,
        offset,
        queryParams
      );
      const data = extractData(batch);

      results.push(...data);

      // If we got fewer items than the batch size, we've reached the end
      if (data.length < this.batchSize) {
        log.info(
          `Received ${data.length} items (less than batch size), no more data available`
        );
        break;
      }
    }

    return results;
  }

  /**
   * Fetch published posts from the management endpoint
   */
  async fetchPublishedPosts(): Promise<ArticleFromManagement[]> {
    log.start("Fetching published posts");
    log.indent();

    const endpoint = "/post_management/published";
    const queryParams = {
      order_by: "post_date",
      order_direction: "desc",
    };

    log.startTimer("fetch-published");

    const allPosts = await this.fetchAllBatches<
      { posts: ArticleFromManagement[] },
      ArticleFromManagement
    >(endpoint, queryParams, (response) => response.posts);

    log.result(`Total published posts fetched: ${allPosts.length}`);
    log.endTimerAndLog("fetch-published", "Published posts fetching completed");

    log.outdent();
    return allPosts;
  }

  /**
   * Fetch post details from the posts endpoint
   */
  async fetchPostDetails(): Promise<ArticleFromPosts[]> {
    log.start("Fetching post details");
    log.indent();

    const endpoint = "/posts";

    log.startTimer("fetch-details");

    const allDetails = await this.fetchAllBatches<
      ArticleFromPosts[],
      ArticleFromPosts
    >(endpoint, {}, (response) => response);

    log.result(`Total post details fetched: ${allDetails.length}`);
    log.endTimerAndLog("fetch-details", "Post details fetching completed");

    log.outdent();
    return allDetails;
  }

  /**
   * Validate an article to ensure it has required fields
   */
  private validateArticle(article: any): boolean {
    return Boolean(
      article &&
        typeof article.id === "number" &&
        article.slug &&
        article.post_date &&
        article.title
    );
  }

  /**
   * Fetch and merge all article data
   */
  async fetchAllArticles(): Promise<CombinedArticle[]> {
    log.header("FETCHING ARTICLE DATA");

    try {
      log.startTimer("fetch-all");

      // Fetch posts data
      const publishedPosts = await this.fetchPublishedPosts();
      const postDetails = await this.fetchPostDetails();

      log.start("Merging data from both endpoints");
      log.indent();

      // Create a map with combined data
      const combinedPostsMap = new Map<number, CombinedArticle>();
      let invalidPostsCount = 0;

      // First add management data
      publishedPosts.forEach((post) => {
        if (this.validateArticle(post)) {
          combinedPostsMap.set(post.id, {
            ...post,
            id: post.id,
            postTags: undefined,
            canonical_url: "", // Default value
            description: "", // Default value
          });
        } else {
          invalidPostsCount++;
        }
      });

      // Then merge in the posts data
      let matchedPosts = 0;
      postDetails.forEach((post) => {
        const existingPost = combinedPostsMap.get(post.id);
        if (existingPost) {
          matchedPosts++;
          combinedPostsMap.set(post.id, {
            ...existingPost,
            postTags: post.postTags,
            canonical_url: post.canonical_url,
            description: post.description,
          });
        }
      });

      log.success(`Matched additional data for ${matchedPosts} posts`);
      if (invalidPostsCount > 0) {
        log.warn(`Skipped ${invalidPostsCount} invalid posts`);
      }
      log.result(`Final combined article count: ${combinedPostsMap.size}`);
      log.endTimerAndLog(
        "fetch-all",
        "Article data fetching and merging completed"
      );

      log.outdent();
      return Array.from(combinedPostsMap.values());
    } catch (error) {
      log.error(`Error fetching articles: ${error}`);
      throw new Error(
        `Failed to fetch articles: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

/**
 * Process articles to simplify and sort them
 */
function processArticles(articlesData: CombinedArticle[]): Article[] {
  log.start("Processing and sorting articles");
  log.indent();

  log.startTimer("process");

  // Map only the required fields
  const simplifiedArticles: Article[] = articlesData
    .filter(
      (article) =>
        article &&
        typeof article.id === "number" &&
        article.slug &&
        article.post_date &&
        article.title
    )
    .map((post) => ({
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

  // Sort articles by views
  simplifiedArticles.sort((a, b) => b.views - a.views);

  log.result(`Sorted ${simplifiedArticles.length} articles by view count`);
  log.endTimerAndLog("process", "Processing completed");

  log.outdent();
  return simplifiedArticles;
}

/**
 * Save articles to JSON file
 */
function saveArticlesToFile(articles: Article[], filePath: string): void {
  log.startTimer("save");
  writeFileSync(filePath, JSON.stringify(articles, null, 2));
  log.endTimerAndLog(
    "save",
    `Saved ${articles.length} articles to ${filePath}`
  );
}

/**
 * Main function to generate the article list
 */
async function generateArticleList() {
  log.header("ARTICLE LIST GENERATION");

  try {
    const authCookie = process.env.SUBSTACK_AUTH_COOKIE;
    if (!authCookie) {
      throw new Error("SUBSTACK_AUTH_COOKIE environment variable is not set");
    }

    // Create Substack API client
    const substackClient = new SubstackApiClient({
      baseUrl: CONFIG.SUBSTACK_BASE_URL,
      batchSize: CONFIG.BATCH_SIZE,
      maxRetries: CONFIG.MAX_RETRIES,
      retryDelayMs: CONFIG.RETRY_DELAY_MS,
      authCookie,
    });

    // Fetch all articles
    const articlesData = await substackClient.fetchAllArticles();

    // Process the articles
    const simplifiedArticles = processArticles(articlesData);

    // Write the simplified list to JSON file
    const outputPath = join(__dirname, CONFIG.OUTPUT_FILE);
    saveArticlesToFile(simplifiedArticles, outputPath);

    log.success("Article list generation completed successfully!");

    return simplifiedArticles;
  } catch (error) {
    log.error(`Error in generateArticleList: ${error}`);
    throw error;
  }
}

// Need to use an IIFE since top-level await isn't available in all environments
(async () => {
  try {
    log.header("STARTING ARTICLE LIST GENERATOR");

    log.startTimer("total");
    await generateArticleList();
    log.endTimerAndLog("total", "Process completed successfully");
  } catch (error) {
    log.error(`Error generating article list: ${error}`);
    process.exit(1);
  }
})();
