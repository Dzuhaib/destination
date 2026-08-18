import "server-only";

import type { PaginatedPosts, WordPressPost } from "@/types/wordpress";
import { wordpressApi } from "./client";

interface RawPost {
  id: number; slug: string; date: string; modified: string; link: string;
  title: { rendered: string }; excerpt: { rendered: string }; content: { rendered: string };
  _embedded?: {
    author?: Array<{ name: string }>;
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>;
  };
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const normalize = (post: RawPost): WordPressPost => {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post._embedded?.["wp:term"]?.flat() || [];
  return {
    id: post.id, slug: post.slug, date: post.date, modified: post.modified, link: post.link,
    title: stripHtml(post.title.rendered), excerpt: stripHtml(post.excerpt.rendered), content: post.content.rendered,
    featuredImage: media ? { url: media.source_url, alt: media.alt_text || stripHtml(post.title.rendered) } : null,
    authorName: post._embedded?.author?.[0]?.name || "Destination Wholesale",
    categories: terms.filter((term) => term.taxonomy === "category").map(({ id, name, slug }) => ({ id, name, slug })),
  };
};

export async function getBlogPosts(page = 1, perPage = 12): Promise<PaginatedPosts> {
  const result = await wordpressApi<RawPost[]>("wp/v2/posts", { page, per_page: perPage, _embed: 1 });
  return { items: result.data.map(normalize), total: Number(result.headers.get("x-wp-total") || result.data.length), totalPages: Number(result.headers.get("x-wp-totalpages") || 1), page };
}

export async function getBlogPostBySlug(slug: string) {
  const { data } = await wordpressApi<RawPost[]>("wp/v2/posts", { slug, per_page: 1, _embed: 1 });
  return data[0] ? normalize(data[0]) : null;
}
