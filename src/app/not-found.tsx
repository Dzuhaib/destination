import Link from "next/link";

export default function NotFound() { return <div className="min-h-screen bg-gray-50 px-6 pt-44 text-center"><p className="text-xs font-bold uppercase tracking-[.3em] text-[#a6549e]">404</p><h1 className="mt-4 text-5xl font-semibold">Page not found</h1><p className="mt-4 text-gray-600">The page may have moved or is no longer available.</p><Link href="/shop" className="mt-8 inline-block bg-black px-7 py-4 text-xs font-bold uppercase tracking-[.2em] text-white">Browse the shop</Link></div>; }
