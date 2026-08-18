import BrandsLogoLoop from "@/components/BrandsLogoLoop";
import { getBrands } from "@/lib/woocommerce/products";

const fallbackBrands = ["Revolax", "Juvederm", "Teoxane", "Profhilo", "Aliaxin", "Mastelli", "AMI", "Stylage"];

export default async function BrandsSection() {
  const available = await getBrands().catch(() => []);
  const brands = available.length ? available.slice(0, 20) : fallbackBrands.map((name) => ({ name, slug: name.toLowerCase() }));
  return <section className="brands-loop-section" aria-labelledby="brands-heading"><div className="container-custom"><div className="brands-loop-heading"><p>TRUSTED PROFESSIONAL BRANDS</p><h2 id="brands-heading">Shop by brand</h2></div><BrandsLogoLoop brands={brands} /></div></section>;
}
