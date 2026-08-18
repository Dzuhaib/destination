"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const toggleItem = (newItem: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === newItem.id);
      if (exists) {
        return prev.filter((i) => i.id !== newItem.id);
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const isInWishlist = (id: string) => items.some((i) => i.id === id);

  const clearWishlist = () => setItems([]);

  const count = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, toggleItem, removeItem, isInWishlist, clearWishlist, count }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
