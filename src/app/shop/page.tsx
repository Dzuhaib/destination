import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getCategories, getProducts, getBrands } from "@/lib/woocommerce/products";
import type { PaginatedProducts, ProductCategory } from "@/types/woocommerce";

export const metadata: Metadata = { title: "Shop professional supplies", description: "Shop professional aesthetics, beauty, SPMU and clinical consumables from Destination Wholesale." };

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>> }
const value = (input: string | string[] | undefined) => Array.isArray(input) ? input[0] : input;

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(value(params.page) || 1));
  const category = value(params.category);
  const search = value(params.search);
  const brand = value(params.brand);
  const minPrice = Number(value(params.minPrice) || 0) || undefined;
  const maxPrice = Number(value(params.maxPrice) || 0) || undefined;
  const sort = value(params.sort) || "date-desc";
  const [orderBy, order] = sort.split("-") as ["date" | "price" | "popularity" | "rating", "asc" | "desc"];
  let products: PaginatedProducts;
  let categories: ProductCategory[];
  let error = "";
  let brands: Array<{ name: string; slug: string }> = [];
  try { [products, categories, brands] = await Promise.all([getProducts({ page, perPage: 24, category, search: brand ? `${brand} ${search || ""}` : search, orderBy, order, minPrice, maxPrice }), getCategories(), getBrands()]); }
  catch { products = { items: [], total: 0, totalPages: 0, page }; categories = []; error = "We could not load the live WooCommerce catalogue. Please try again shortly."; }

  const queryFor = (nextPage: number) => {
    const next = new URLSearchParams();
    if (category) next.set("category", category); if (search) next.set("search", search); if (brand) next.set("brand", brand); if (minPrice) next.set("minPrice", String(minPrice)); if (maxPrice) next.set("maxPrice", String(maxPrice)); if (sort) next.set("sort", sort); next.set("page", String(nextPage));
    return `/shop?${next.toString()}`;
  };

  return <div className="shop-page min-h-screen bg-white pb-20 pt-32">
    <header className="shop-hero"><div className="container-custom py-8"><nav className="text-sm text-gray-600"><Link href="/">Home</Link>　&gt;　Shop</nav><h1 className="mt-1 text-5xl font-semibold">Shop</h1><p className="mt-2 max-w-2xl text-gray-700">Explore our wide range of aesthetics supplies and skincare products.</p></div></header>
    <div className="container-custom py-10">
      <form className="shop-toolbar grid gap-3 border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_180px_180px_auto]" action="/shop">
        <input name="search" defaultValue={search} placeholder="Search products or SKU" aria-label="Search products" className="border border-gray-300 px-4 py-3" />
        <select name="brand" defaultValue={brand || ""} aria-label="Brand" className="border border-gray-300 px-4 py-3"><option value="">All brands</option>{brands.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}</select><input name="minPrice" defaultValue={minPrice || ""} type="number" min="0" placeholder="Min £" /><input name="maxPrice" defaultValue={maxPrice || ""} type="number" min="0" placeholder="Max £" /><select name="sort" defaultValue={sort} aria-label="Sort products" className="border border-gray-300 px-4 py-3"><option value="date-desc">Newest</option><option value="popularity-desc">Popular</option><option value="rating-desc">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
        {category && <input type="hidden" name="category" value={category} />}<button className="bg-black px-6 py-3 text-xs font-bold uppercase tracking-[.2em] text-white">Apply</button>
      </form>
      <div className="shop-layout"><aside className="shop-sidebar"><h3>CATEGORIES</h3>{categories.map((item) => <Link key={item.id} href={`/shop?category=${item.id}`}>{item.name}<span>({item.count})</span></Link>)}<h3 className="sidebar-subtitle">FILTER BY PRICE</h3><div className="price-line" /><p>Price: £0 — £499</p><h3 className="sidebar-subtitle">BRANDS</h3></aside><div className="shop-results">
      <div className="mt-8 flex items-center justify-between"><p className="text-sm text-gray-600">{products.total} products</p>{search && <p className="text-sm">Results for “{search}”</p>}</div>
      {error && <div role="alert" className="mt-8 border border-red-200 bg-red-50 p-5 text-red-800">{error}</div>}
      {!error && products.items.length === 0 && <div className="mt-8 border border-gray-200 bg-white p-12 text-center"><h2 className="text-2xl font-semibold">No products found</h2><p className="mt-2 text-gray-600">Try a broader search or another category.</p></div>}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      {products.totalPages > 1 && <nav aria-label="Product pagination" className="mt-12 flex justify-center gap-3">{page > 1 && <Link className="border border-gray-300 bg-white px-5 py-3" href={queryFor(page - 1)}>Previous</Link>}<span className="px-5 py-3">Page {page} of {products.totalPages}</span>{page < products.totalPages && <Link className="border border-gray-300 bg-white px-5 py-3" href={queryFor(page + 1)}>Next</Link>}</nav>}</div></div>
    </div>
  </div>;
}
