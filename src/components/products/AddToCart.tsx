"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCart({ productId, disabled, variable }: { productId: number; disabled: boolean; variable: boolean }) {
  const { addItem, error } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  if (variable) return <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Variation selection requires the product variation endpoint and will be enabled after its attributes are confirmed from WooCommerce.</div>;
  return <div className="product-purchase">
    <div className="flex gap-3"><input aria-label="Quantity" type="number" min={1} max={99} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} className="w-20 border border-gray-300 px-3 text-center" /><button disabled={disabled || adding} onClick={async () => { setAdding(true); try { await addItem({ id: productId, quantity }); } finally { setAdding(false); } }} className="flex flex-1 items-center justify-center gap-2 bg-black px-6 py-4 text-xs font-bold uppercase tracking-[.2em] text-white hover:bg-[#a6549e] disabled:bg-gray-300"><ShoppingBag size={18} />{adding ? "Adding…" : "Add to basket"}</button></div>
    {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
  </div>;
}
