"use client";

import LogoLoopComponent from "@/components/LogoLoop";
const LogoLoop = LogoLoopComponent as React.ComponentType<Record<string, unknown>>;

export default function BrandsLogoLoop({ brands }: { brands: Array<{ name: string; slug: string }> }) {
  const logos = brands.map((brand) => ({
    node: <span className="brand-loop-wordmark">{brand.name}</span>,
    title: brand.name,
    ariaLabel: `Shop ${brand.name}`,
    href: `/shop?brand=${encodeURIComponent(brand.name)}`,
  }));

  return <LogoLoop logos={logos} speed={45} logoHeight={28} gap={64} pauseOnHover fadeOut fadeOutColor="#FFFFFF" ariaLabel="Shop our product brands" />;
}
