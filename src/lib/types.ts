export interface Article {
  id: number;
  slug: string;
  postDate: string;
  title: string;
  coverImage: string | null;
  views: number;
  description: string;
  canonical_url: string;
  postTags?: {
    id: string;
    publication_id: number;
    name: string;
    slug: string;
    hidden: boolean;
  }[];
}

export type ArticleList = Article[];
