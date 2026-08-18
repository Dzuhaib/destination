import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/wordpress/posts";

export const metadata: Metadata = { title: "Blog", description: "News, product guidance and professional updates from Destination Wholesale." };
export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => ({ items: [], total: 0, totalPages: 0, page: 1 }));
  return <div className="min-h-screen bg-gray-50 pb-20 pt-32"><header className="border-y border-gray-200 bg-white"><div className="container-custom py-12"><p className="text-xs font-bold uppercase tracking-[.3em] text-[#a6549e]">From WordPress</p><h1 className="mt-3 text-5xl font-semibold">Latest articles</h1></div></header><div className="container-custom py-10">{!posts.items.length ? <div className="border border-gray-200 bg-white p-10">No published articles are currently available.</div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.items.map((post) => <article key={post.id} className="border border-gray-200 bg-white">{post.featuredImage && <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10]"><Image src={post.featuredImage.url} alt={post.featuredImage.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></Link>}<div className="p-6"><time className="text-xs text-gray-500">{new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(post.date))}</time><h2 className="mt-3 text-2xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-3 text-sm leading-6 text-gray-600">{post.excerpt}</p></div></article>)}</div>}</div></div>;
}
