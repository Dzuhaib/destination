"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/woocommerce";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const image = product.images[0];
  const variable = product.type === "variable";
  return <article className="group flex h-full flex-col border border-gray-200 bg-white">
    <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
      {image ? <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-gray-400">Image unavailable</div>}
      <div className="absolute left-3 top-3 flex gap-2">
        {product.onSale && <span className="bg-[#a6549e] px-2.5 py-1 text-[10px] font-bold uppercase text-white">Sale</span>}
        {product.featured && <span className="bg-black px-2.5 py-1 text-[10px] font-bold uppercase text-white">Featured</span>}
      </div>
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-gray-500">{product.categories[0]?.name || "Professional supplies"}</p>
      <Link href={`/product/${product.slug}`} className="product-card-title mt-2 text-lg font-semibold leading-snug hover:text-[#a6549e]">{product.name}</Link>
      <Link href={`/product/${product.slug}`} className="product-read-more">Read more</Link>
      {product.sku && <p className="mt-2 text-xs text-gray-500">SKU: {product.sku}</p>}
      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <div><p className="text-lg font-bold">{product.prices.price.formatted}</p><p className="text-xs text-gray-500">{product.stockStatus === "in-stock" ? "In stock" : "Out of stock"}</p></div>
        {variable ? <Link href={`/product/${product.slug}`} className="border border-black px-3 py-2 text-xs font-bold uppercase">Choose options</Link> : <button type="button" title="Add to basket" disabled={adding || !product.purchasable || product.stockStatus === "out-of-stock"} onClick={async () => { setAdding(true); try { await addItem({ id: product.id, name: product.name, price: product.prices.price.value, image: image?.src }); } finally { setAdding(false); } }} className="add-to-cart-3d grid h-10 w-10 place-items-center text-white disabled:cursor-not-allowed disabled:bg-gray-300"><ShoppingBag size={17} /><span className="sr-only">Add {product.name} to basket</span></button>}
      </div>
    </div>
  </article>;
}
