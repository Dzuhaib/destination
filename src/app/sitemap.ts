import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { getCategories, getProducts } from "@/lib/woocommerce/products";
import { getBlogPosts } from "@/lib/wordpress/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    getProducts({ perPage: 100 }).catch(() => ({ items: [], total: 0, totalPages: 0, page: 1 })),
    getCategories().catch(() => []), getBlogPosts(1, 100).catch(() => ({ items: [], total: 0, totalPages: 0, page: 1 })),
  ]);
  const staticRoutes = ["", "/shop", "/about", "/help-contact", "/blog", "/privacy-policy", "/terms-and-conditions", "/cookie-policy"];
  return [
    ...staticRoutes.map((path) => ({ url: `${env.siteUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "daily" as const : "weekly" as const })),
    ...products.items.map((product) => ({ url: `${env.siteUrl}/product/${product.slug}`, changeFrequency: "daily" as const })),
    ...categories.map((category) => ({ url: `${env.siteUrl}/product-category/${category.slug}`, changeFrequency: "weekly" as const })),
    ...posts.items.map((post) => ({ url: `${env.siteUrl}/blog/${post.slug}`, lastModified: new Date(post.modified), changeFrequency: "monthly" as const })),
  ];
}
