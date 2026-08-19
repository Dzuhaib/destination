"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface RawCartItem { key: string; id: number; quantity: number; name: string; images?: Array<{ src: string; alt: string }>; prices: { price: string; currency_minor_unit: number; currency_code: string } }
interface RawCart { items: RawCartItem[]; items_count: number; totals: { total_items: string; total_price: string; currency_minor_unit: number; currency_code: string } }
export interface CartItem { key: string; id: number; name: string; qty: number; price: number; image: string }

interface CartContextValue {
  items: CartItem[]; count: number; total: number; loading: boolean; error: string | null;
  addItem: (item: { id: number | string; quantity?: number; name?: string; price?: number; image?: string }) => Promise<void>;
  updateQty: (key: string, qty: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const amount = (value: string, unit: number) => Number(value || 0) / 10 ** unit;

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<RawCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fallbacks = useRef(new Map<number, { name?: string; price?: number; image?: string }>());

  const request = useCallback(async (path = "", body?: object) => {
    setError(null);
    const response = await fetch(`/api/cart${path}`, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    const data = (await response.json()) as RawCart & { message?: string };
    if (!response.ok) throw new Error(data.message || "Cart could not be updated");
    setCart(data);
  }, []);

  const refresh = useCallback(async () => { try { await request(); } catch (err) { setError(err instanceof Error ? err.message : "Cart unavailable"); } finally { setLoading(false); } }, [request]);
  useEffect(() => { void refresh(); }, [refresh]);

  const mutate = useCallback(async (path: string, body: object) => { setLoading(true); try { await request(path, body); } catch (err) { setError(err instanceof Error ? err.message : "Cart could not be updated"); throw err; } finally { setLoading(false); } }, [request]);
  const items = useMemo(() => (cart?.items || []).map((item) => { const fallback = fallbacks.current.get(item.id); const apiPrice = amount(item.prices.price, item.prices.currency_minor_unit); return { key: item.key, id: item.id, name: item.name || fallback?.name || "Product", qty: item.quantity, price: apiPrice || fallback?.price || 0, image: item.images?.[0]?.src || fallback?.image || "" }; }), [cart]);
  const apiTotal = cart ? amount(cart.totals.total_price, cart.totals.currency_minor_unit) : 0;
  const itemTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const value: CartContextValue = {
    items, count: cart?.items_count || 0,
    total: apiTotal || itemTotal,
    loading, error, refresh,
    addItem: async ({ id, quantity = 1, name, price, image }) => { fallbacks.current.set(Number(id), { name, price, image }); await mutate("/add-item", { id: Number(id), quantity }); },
    updateQty: async (key, quantity) => quantity < 1 ? mutate("/remove-item", { key }) : mutate("/update-item", { key, quantity }),
    removeItem: async (key) => mutate("/remove-item", { key }),
    clearCart: async () => { for (const item of items) await mutate("/remove-item", { key: item.key }); },
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
