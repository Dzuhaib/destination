"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, UserRound, ClipboardList, Menu, X, ChevronDown, Truck, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = ["Dermal Fillers", "Skin Boosters", "Consumables", "SPMU", "Training"];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="notice-bar"><div><Truck size={17} /> ORDER BEFORE 3PM FOR SAME-DAY DISPATCH <span>|</span> <UserRound size={17} /> UK AESTHETICS PROFESSIONALS</div><div className="notice-right"><span>SIGN IN / REGISTER</span><span><Star size={17} /> LOYALTY POINTS</span></div></div>
    <div className="header-main container-custom"><Link href="/" className="brand"><img src="/logo.webp" alt="Destination Wholesale" /></Link><div className="search-box"><span>Search for products, brands or categories...</span><Search size={22} /></div><div className="header-actions"><Link href="/account"><UserRound /><small>My Account</small></Link><Link href="/shop"><ClipboardList /><small>Quick Order</small></Link><Link href="/cart" className="cart-action"><ShoppingCart /><b>{count}</b><small>Cart<br />£0.00</small></Link><button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button></div></div>
    <nav className={`category-nav ${open ? "open" : ""}`}><div className="container-custom"><div className="brand-menu"><Link href="/shop">BRANDS <ChevronDown size={14} /></Link><div className="brand-mega">{["Revolax","Juvederm","Teoxane","Profhilo","Aliaxin","Mastelli","Ami","Stylage"].map((brand) => <Link key={brand} href={`/shop?brand=${encodeURIComponent(brand)}`}>{brand}</Link>)}</div></div>{links.map((label) => <Link key={label} href="/shop">{label}<ChevronDown size={14} /></Link>)}<Link href="/shop" className="sale-link">SALE</Link></div></nav>
  </header>;
}
