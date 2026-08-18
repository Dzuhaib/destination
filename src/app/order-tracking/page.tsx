"use client";

import { FormEvent, useState } from "react";
import { PackageSearch } from "lucide-react";

export default function OrderTrackingPage() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return <main className="min-h-screen bg-[#F9F7FB] px-4 pb-20 pt-12 sm:px-6 sm:pt-16"><div className="mx-auto max-w-2xl border border-[#E8E4EB] bg-white p-6 sm:p-12"><PackageSearch className="text-[#6B1FAD]" size={34} /><p className="mt-5 text-xs font-bold uppercase tracking-[.25em] text-[#B174E7]">Order support</p><h1 className="mt-2 text-4xl font-semibold text-[#2D2633]">Track your order</h1><p className="mt-4 leading-7 text-[#6B6570]">Enter the order number and billing email used at checkout to view the latest delivery status.</p>{submitted ? <div className="mt-8 border border-[#CEA8F0] bg-[#F9F7FB] p-5 text-sm text-[#2D2633]">We’re checking those details. Tracking updates will appear here once the WooCommerce order tracking connection is enabled.</div> : <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-[#2D2633]">Order number<input required placeholder="#12345" className="mt-2 h-12 w-full border border-[#E8E4EB] px-4" /></label><label className="text-sm font-medium text-[#2D2633]">Billing email<input required type="email" className="mt-2 h-12 w-full border border-[#E8E4EB] px-4" /></label><button className="h-12 bg-[#1CABB0] px-6 font-semibold text-white hover:bg-[#178E93] sm:col-span-2">Check tracking</button></form>}</div></main>;
}
