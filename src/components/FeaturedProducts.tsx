import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/woocommerce/products";

export default async function FeaturedProducts() {
  const products = await getProducts({ perPage: 8, featured: true }).catch(() => ({ items: [], total: 0, totalPages: 0, page: 1 }));
  if (!products.items.length) return null;
  return <section className="bg-[#f7f7f5] py-20"><div className="container-custom"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-[#a6549e]">Live from WooCommerce</p><h2 className="mt-3 text-4xl font-semibold">Featured products</h2></div><Link href="/shop" className="text-sm font-bold underline">View all</Link></div><div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.items.map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>;
}
