import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/woocommerce/products";
import ProductCard from "@/components/products/ProductCard";

export default async function CategoriesSection() {
  const categories = await getCategories().catch(() => []);
  const sections = await Promise.all(categories.slice(0, 6).map(async (category) => ({ category, products: await getProducts({ category: String(category.id), perPage: 6 }).catch(() => ({ items: [] })) })));
  if (!sections.length) return null;
  return <section className="category-product-sections">{sections.map(({ category, products }) => <div className="category-product-section container-custom" key={category.id}><div className="category-feature"><div className="category-feature-image">{category.image ? <Image src={category.image.src} alt={category.name} fill sizes="(max-width: 640px) 100vw, 250px" className="object-cover" /> : <Image src="/EjywCJ.png" alt="Destination Wholesale products" fill sizes="(max-width: 640px) 100vw, 250px" className="object-cover" />}</div><div className="category-feature-content"><p>EXPLORE OUR RANGE</p><h2>{category.name}</h2><Link href={`/product-category/${category.slug}`}>SHOP NOW</Link></div></div><div className="category-products"><div className="category-heading"><h3>{category.name}</h3><Link href={`/product-category/${category.slug}`}>View all</Link></div><div className="category-products-grid">{products.items.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div></div></div>)}</section>;
}
