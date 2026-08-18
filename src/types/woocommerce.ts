export interface Money {
  currencyCode: string;
  currencySymbol: string;
  minorUnit: number;
  value: number;
  formatted: string;
}

export interface ProductImage {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: ProductImage | null;
}

export interface ProductAttributeTerm {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  taxonomy: string | null;
  hasVariations: boolean;
  terms: ProductAttributeTerm[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  sku: string;
  type: string;
  summary: string;
  description: string;
  prices: { price: Money; regularPrice: Money; salePrice: Money | null };
  priceHtml: string;
  onSale: boolean;
  purchasable: boolean;
  stockStatus: "in-stock" | "out-of-stock" | "on-backorder";
  images: ProductImage[];
  categories: ProductCategory[];
  tags: Array<{ id: number; name: string; slug: string }>;
  attributes: ProductAttribute[];
  variationIds: number[];
  averageRating: number;
  reviewCount: number;
  featured: boolean;
}

export interface ProductQuery {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  orderBy?: "date" | "id" | "include" | "title" | "slug" | "price" | "popularity" | "rating";
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "instock" | "outofstock" | "onbackorder";
  featured?: boolean;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  totalPages: number;
  page: number;
}
