"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/hero.png", alt: "Destination Wholesale professional aesthetics products" },
  { src: "/Hero 2.png", alt: "Destination Wholesale product collection" },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6000); return () => window.clearInterval(timer); }, []);
  return <section className="reference-hero hero-slider" aria-label="Featured collections"><div className="hero-slides">{slides.map((slide, index) => <div key={slide.src} className={`hero-slide ${active === index ? "is-active" : ""}`} aria-hidden={active !== index}><Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" className="hero-slide-image" /></div>)}</div><div className="hero-slider-controls" role="tablist" aria-label="Hero slides">{slides.map((slide, index) => <button key={slide.src} type="button" role="tab" aria-selected={active === index} aria-label={`Show slide ${index + 1}`} onClick={() => setActive(index)} className={active === index ? "active" : ""} />)}</div></section>;
}
