import Link from "next/link";
import { getCategories, getProducts } from "@/lib/woocommerce/products";
import ProductCard from "@/components/products/ProductCard";

const categoryOrder = [
  { name: "Dermal Fillers", match: ["dermal", "filler"] },
  { name: "Skin Boosters", match: ["skin", "booster"] },
  { name: "Consumables", match: ["consumable", "needle", "cannula"] },
  { name: "SPMU", match: ["spmu", "microblading", "permanent"] },
  { name: "Training", match: ["training", "course"] },
  { name: "Starter Kits", match: ["starter", "kit"] },
];

export default async function CategoriesSection() {
  const available = await getCategories().catch(() => []);
  const sections = await Promise.all(categoryOrder.map(async (entry, index) => {
    const category = available.find((item) => entry.match.some((term) => item.name.toLowerCase().includes(term))) || available[index];
    if (!category) return null;
    return { entry, category, products: await getProducts({ category: String(category.id), perPage: 6 }).catch(() => ({ items: [] })) };
  }));
  const visible = sections.filter(Boolean) as Array<NonNullable<(typeof sections)[number]>>;
  if (!visible.length) return null;
  return <section className="category-product-sections">{visible.map(({ entry, category, products }, index) => <div className="category-product-section container-custom" key={entry.name}><div className={`category-feature category-feature-${index + 1}`}><div className="category-placeholder-art"><span>{String(index + 1).padStart(2, "0")}</span></div><div className="category-feature-content"><p>DESTINATION WHOLESALE</p><h2>{entry.name}</h2><Link href={`/product-category/${category.slug}`}>SHOP THE RANGE</Link></div></div><div className="category-products"><div className="category-heading"><h3>{entry.name}</h3><Link href={`/product-category/${category.slug}`}>View all</Link></div><div className="category-products-grid">{products.items.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div></div></div>)}</section>;
}
