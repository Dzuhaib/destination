"use client";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import type { Product, ProductCategory } from "@/types/woocommerce";

type Section = { name: string; category: ProductCategory; products: Product[] };
export default function CategoryTabs({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(0);
  const current = sections[active];
  return <section className="category-tabs-section"><div className="container-custom"><div className="category-tabs-heading"><p>SHOP BY CATEGORY</p><h2>Find your professional essentials</h2></div><div className="category-tabs" role="tablist" aria-label="Product categories">{sections.map((section, index) => <button key={section.name} role="tab" aria-selected={active === index} className={active === index ? "active" : ""} onClick={() => setActive(index)}>{section.name}</button>)}</div><div className="category-tab-panel" role="tabpanel"><div className="category-tab-intro"><div><p>DESTINATION WHOLESALE</p><h3>{current.name}</h3></div><Link href={`/product-category/${current.category.slug}`}>View all products</Link></div><div className="category-tab-products">{current.products.map((product) => <ProductCard key={product.id} product={product} />)}</div></div></div></section>;
}
