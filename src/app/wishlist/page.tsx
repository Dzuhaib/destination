"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-white pt-48 pb-20 lg:pt-64 lg:pb-32">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-body text-[11px] tracking-[0.5em] uppercase text-[#a6549e] font-bold block mb-6 animate-soft-fade">
              Your Selection
            </span>
            <h1 className="text-4xl lg:text-6xl text-[#171717] mb-8 font-display font-medium tracking-tight animate-soft-fade delay-200">
              Saved <span className="italic font-light text-gray-300">Items.</span>
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 border-y border-gray-100">
              <p className="font-body text-[15px] text-gray-500 mb-8">Your wishlist is currently empty.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-4 bg-[#171717] text-white px-8 py-4 font-body text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-[#a6549e] transition-colors"
              >
                Explore Shop <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-6">
                <button
                  onClick={clearWishlist}
                  className="font-body text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-red-500 transition-colors font-bold flex items-center gap-2"
                >
                  <Trash2 size={14} /> Clear Wishlist
                </button>
              </div>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-gray-100 hover:shadow-lg transition-shadow">
                    <Link href={`/shop/${item.id}`} className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover grayscale hover:grayscale-0 transition-all" />
                    </Link>
                    <div className="flex-grow text-center sm:text-left">
                      <Link href={`/shop/${item.id}`}>
                        <h3 className="font-display text-xl text-[#171717] mb-2 hover:text-[#a6549e] transition-colors">{item.name}</h3>
                      </Link>
                      <div className="font-body text-[14px] font-bold text-[#171717]">£{item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                      <button
                        onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                        className="flex-1 sm:flex-none bg-[#171717] text-white px-6 py-3 font-body text-[10px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 hover:bg-[#a6549e] transition-colors"
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-gray-300 hover:text-red-500 transition-colors border border-gray-100"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
