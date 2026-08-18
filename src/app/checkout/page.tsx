"use client";

import Link from "next/link";
import { AlertTriangle, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, total, loading } = useCart();
  return <div className="min-h-screen bg-gray-50 pb-20 pt-36"><div className="mx-auto max-w-3xl px-6"><p className="text-xs font-bold uppercase tracking-[.3em] text-[#a6549e]">Secure checkout</p><h1 className="mt-3 text-4xl font-semibold">Checkout integration</h1>
    {loading ? <p className="mt-8">Loading basket…</p> : !items.length ? <div className="mt-8 border border-gray-200 bg-white p-8"><p>Your basket is empty.</p><Link href="/shop" className="mt-5 inline-block bg-black px-6 py-3 text-white">Return to shop</Link></div> : <div className="mt-8 border border-amber-300 bg-amber-50 p-7"><div className="flex gap-4"><AlertTriangle className="shrink-0 text-amber-700" /><div><h2 className="text-lg font-semibold text-amber-950">Payment setup requires the WordPress gateway audit</h2><p className="mt-2 leading-6 text-amber-900">Your live WooCommerce basket contains {items.length} line item(s), currently totaling £{total.toFixed(2)}. Order submission is intentionally disabled until the installed payment gateways, shipping methods, taxes, Store API compatibility, and professional verification hooks have been confirmed on staging.</p><p className="mt-3 leading-6 text-amber-900">This prevents the frontend from creating unpaid, invalid, or misleading production orders.</p></div></div></div>}
    <div className="mt-6 flex items-center gap-2 text-sm text-gray-500"><Lock size={15} /> Prices and final totals remain authoritative in WooCommerce.</div>
  </div></div>;
}
