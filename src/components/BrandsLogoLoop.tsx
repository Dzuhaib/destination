"use client";

import LogoLoopComponent from "@/components/LogoLoop";
const LogoLoop = LogoLoopComponent as React.ComponentType<Record<string, unknown>>;

export default function BrandsLogoLoop({ brands }: { brands: Array<{ name: string; slug: string }> }) {
  const assets: Record<string, string> = { revolax: "/brands/revolax.png", juvederm: "/brands/juvederm.png", teoxane: "/brands/teoxane.png", profhilo: "/brands/profhilo.png", aliaxin: "/brands/aliaxin.png", mastelli: "/brands/mastelli.png", ami: "/brands/ami.png", stylage: "/brands/stylage.png" };
  const logos = brands.map((brand) => ({
    node: <span className="brand-loop-logo">{assets[brand.slug.toLowerCase()] ? <img src={assets[brand.slug.toLowerCase()]} alt="" /> : null}<span>{brand.name}</span></span>,
    title: brand.name,
    ariaLabel: `Shop ${brand.name}`,
    href: `/shop?brand=${encodeURIComponent(brand.name)}`,
  }));

  return <LogoLoop logos={logos} speed={45} logoHeight={28} gap={64} pauseOnHover fadeOut fadeOutColor="#FFFFFF" ariaLabel="Shop our product brands" />;
}
