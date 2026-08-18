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
  const used = new Set<number>();
  const ordered = categoryOrder
    .map((entry) => available.find((item) => !used.has(item.id) && entry.match.some((term) => item.name.toLowerCase().includes(term))))
    .filter((category): category is NonNullable<typeof category> => Boolean(category))
    .concat(available.filter((category) => !used.has(category.id)));

  const categories = ordered.filter((category) => {
    if (used.has(category.id)) return false;
    used.add(category.id);
    return true;
  }).slice(0, 6);

  const loaded = await Promise.all(categories.map(async (category) => {
    const result = await getProducts({ category: String(category.id), perPage: 6 }).catch(() => ({ items: [] }));
    return { name: category.name, category, products: result.items.slice(0, 6) };
  }));
  return loaded.length ? <CategoryTabs sections={loaded} /> : null;
}
