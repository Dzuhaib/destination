import "server-only";

import { ApiError } from "@/lib/api-error";
import type {
  Money,
  PaginatedProducts,
  Product,
  ProductCategory,
  ProductImage,
  ProductQuery,
} from "@/types/woocommerce";
import { storeApi } from "./client";

interface StoreMoney {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  price: string;
  regular_price: string;
  sale_price: string;
}

interface StoreImage { id: number; src: string; thumbnail: string; alt: string }
interface StoreCategory { id: number; name: string; slug: string; count?: number; image?: StoreImage | null }
interface StoreProduct {
  id: number; name: string; slug: string; permalink: string; sku: string; type: string;
  short_description: string; description: string; prices: StoreMoney; price_html: string;
  on_sale: boolean; is_purchasable: boolean; is_in_stock: boolean; low_stock_remaining: number | null;
  images: StoreImage[]; categories: StoreCategory[]; tags: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{ id: number; name: string; taxonomy: string | null; has_variations: boolean; terms: Array<{ id: number; name: string; slug: string }> }>;
  variations: Array<{ id: number }> | number[]; average_rating: string; review_count: number; is_featured: boolean;
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const money = (raw: string, prices: StoreMoney): Money => {
  const minorUnit = prices.currency_minor_unit;
  const value = Number(raw || 0) / 10 ** minorUnit;
  return {
    currencyCode: prices.currency_code,
    currencySymbol: prices.currency_symbol,
    minorUnit,
    value,
    formatted: new Intl.NumberFormat("en-GB", { style: "currency", currency: prices.currency_code }).format(value),
  };
};

const normalizeImage = (image: StoreImage): ProductImage => ({ ...image, alt: image.alt || "Product image" });

export const normalizeProduct = (raw: StoreProduct): Product => ({
  id: raw.id,
  name: raw.name,
  slug: raw.slug,
  permalink: raw.permalink,
  sku: raw.sku,
  type: raw.type,
  summary: stripHtml(raw.short_description),
  description: raw.description,
  prices: {
    price: money(raw.prices.price, raw.prices),
    regularPrice: money(raw.prices.regular_price, raw.prices),
    salePrice: raw.prices.sale_price ? money(raw.prices.sale_price, raw.prices) : null,
  },
  priceHtml: raw.price_html,
  onSale: raw.on_sale,
  purchasable: raw.is_purchasable,
  stockStatus: raw.is_in_stock ? "in-stock" : "out-of-stock",
  images: raw.images.map(normalizeImage),
  categories: raw.categories.map((category) => ({ ...category, count: category.count || 0, image: category.image ? normalizeImage(category.image) : null })),
  tags: raw.tags,
  attributes: raw.attributes.map((attribute) => ({
    id: attribute.id, name: attribute.name, taxonomy: attribute.taxonomy,
    hasVariations: attribute.has_variations, terms: attribute.terms,
  })),
  variationIds: raw.variations.map((variation) => typeof variation === "number" ? variation : variation.id),
  averageRating: Number(raw.average_rating || 0),
  reviewCount: raw.review_count,
  featured: raw.is_featured,
});

export async function getProducts(query: ProductQuery = {}): Promise<PaginatedProducts> {
  const page = query.page || 1;
  const result = await storeApi<StoreProduct[]>("products", {
    query: {
      page, per_page: query.perPage || 24, search: query.search, category: query.category,
      orderby: query.orderBy, order: query.order, min_price: query.minPrice,
      max_price: query.maxPrice, stock_status: query.stockStatus, featured: query.featured,
    },
    cacheTags: ["products"],
  });
  return {
    items: result.data.map(normalizeProduct),
    total: Number(result.headers.get("x-wp-total") || result.data.length),
    totalPages: Number(result.headers.get("x-wp-totalpages") || 1),
    page,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await storeApi<StoreProduct[]>("products", {
    query: { slug, per_page: 1 }, cacheTags: ["products", `product:${slug}`],
  });
  return data[0] ? normalizeProduct(data[0]) : null;
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await storeApi<StoreProduct>(`products/${id}`, { cacheTags: ["products", `product:${id}`] });
  if (!data) throw new ApiError("Product not found", 404);
  return normalizeProduct(data);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const { data } = await storeApi<StoreCategory[]>("products/categories", {
    query: { per_page: 100, hide_empty: true }, cacheTags: ["categories"], revalidate: 900,
  });
  return data.map((category) => ({
    id: category.id, name: category.name, slug: category.slug, count: category.count || 0,
    image: category.image ? normalizeImage(category.image) : null,
  }));
}

export async function getBrands(): Promise<Array<{ name: string; slug: string }>> {
  const products = await getProducts({ perPage: 100 });
  const brands = new Map<string, { name: string; slug: string }>();
  products.items.forEach((product) => product.tags.forEach((tag) => brands.set(tag.slug, { name: tag.name, slug: tag.slug })));
  return [...brands.values()].sort((a, b) => a.name.localeCompare(b.name));
}
