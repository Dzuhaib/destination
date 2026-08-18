import { getCategories, getProducts } from "@/lib/woocommerce/products";
import CategoryTabs from "@/components/CategoryTabs";

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
  const loaded = await Promise.all(categoryOrder.map(async (entry, index) => {
    const category = available.find((item) => entry.match.some((term) => item.name.toLowerCase().includes(term))) || available[index];
    if (!category) return null;
    const result = await getProducts({ category: String(category.id), perPage: 6 }).catch(() => ({ items: [] }));
    return { name: entry.name, category, products: result.items.slice(0, 6) };
  }));
  const sections = loaded.filter(Boolean) as Array<NonNullable<(typeof loaded)[number]>>;
  return sections.length ? <CategoryTabs sections={sections} /> : null;
}
