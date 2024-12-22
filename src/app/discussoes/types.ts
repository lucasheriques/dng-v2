export interface Post {
  id: number;
  title: string;
  votes: number;
  author: {
    name: string;
    role: string;
    company: string;
    level: string;
    avatar: string;
  };
  createdAt: Date;
  viewCount: number;
  commentCount: number;
}

export interface Filter {
  level?: string[];
  company?: string[];
  tags?: string[];
  search?: string;
}
