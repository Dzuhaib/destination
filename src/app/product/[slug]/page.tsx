import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/products/AddToCart";
import ProductCard from "@/components/products/ProductCard";
import { env } from "@/config/env";
import { getProductBySlug, getProducts } from "@/lib/woocommerce/products";

interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug).catch(() => null);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.summary || `Buy ${product.name} from Destination Wholesale.`, alternates: { canonical: `/product/${product.slug}` }, openGraph: { title: product.name, description: product.summary, images: product.images[0]?.src ? [product.images[0].src] : [] } };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug).catch(() => null);
  if (!product) notFound();
  const related = await getProducts({ category: product.categories[0] ? String(product.categories[0].id) : undefined, perPage: 5 }).catch(() => ({ items: [], total: 0, totalPages: 0, page: 1 }));
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, sku: product.sku || undefined, image: product.images.map((image) => image.src), description: product.summary, offers: { "@type": "Offer", url: `${env.siteUrl}/product/${product.slug}`, priceCurrency: product.prices.price.currencyCode, price: product.prices.price.value, availability: product.stockStatus === "in-stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <div className="product-page min-h-screen bg-white pb-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <div className="container-custom"><nav className="py-6 text-sm text-gray-500"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span className="text-black">{product.name}</span></nav>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div><div className="relative aspect-square border border-gray-200 bg-gray-50">{product.images[0] ? <Image src={product.images[0].src} alt={product.images[0].alt || product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-6" /> : <div className="grid h-full place-items-center text-gray-400">Image unavailable</div>}</div></div>
        <section className="py-2"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#a6549e]">{product.categories.map((category) => category.name).join(" · ")}</p><h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>{product.sku && <p className="mt-4 text-sm text-gray-500">SKU: {product.sku}</p>}<div className="mt-7 flex items-baseline gap-3"><span className="text-3xl font-bold">{product.prices.price.formatted}</span>{product.onSale && <span className="text-lg text-gray-400 line-through">{product.prices.regularPrice.formatted}</span>}</div><p className={`mt-3 text-sm font-semibold ${product.stockStatus === "in-stock" ? "text-green-700" : "text-red-700"}`}>{product.stockStatus === "in-stock" ? "In stock" : "Out of stock"}</p>{product.summary && <p className="mt-7 leading-7 text-gray-600">{product.summary}</p>}
          <div className="mt-8"><AddToCart productId={product.id} disabled={!product.purchasable || product.stockStatus === "out-of-stock"} variable={product.type === "variable"} /></div>
          <aside className="mt-8 border-l-4 border-[#a6549e] bg-[#faf5fa] p-5"><h2 className="font-semibold">Professional purchasing</h2><p className="mt-2 text-sm leading-6 text-gray-700">Some medical and professional products require evidence of suitable qualifications and insurance. Eligibility is confirmed through the existing WordPress verification workflow before dispatch.</p></aside>
          {product.attributes.length > 0 && <div className="mt-8 border-t border-gray-200 pt-6"><h2 className="text-lg font-semibold">Product information</h2><dl className="mt-4 space-y-3">{product.attributes.map((attribute) => <div key={attribute.id || attribute.name} className="grid grid-cols-3 gap-4 text-sm"><dt className="font-semibold">{attribute.name}</dt><dd className="col-span-2 text-gray-600">{attribute.terms.map((term) => term.name).join(", ")}</dd></div>)}</dl></div>}
        </section>
      </div>
      {product.description && <section className="prose prose-neutral mt-16 max-w-none border-t border-gray-200 pt-10"><h2>Product description</h2><div dangerouslySetInnerHTML={{ __html: product.description }} /></section>}
      {related.items.filter((item) => item.id !== product.id).length > 0 && <section className="mt-20"><h2 className="text-3xl font-semibold">Related products</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.items.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </div>
  </div>;
}
