export interface WordPressPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: string;
  excerpt: string;
  content: string;
  link: string;
  featuredImage: { url: string; alt: string } | null;
  authorName: string;
  categories: Array<{ id: number; name: string; slug: string }>;
}

export interface PaginatedPosts {
  items: WordPressPost[];
  total: number;
  totalPages: number;
  page: number;
}
