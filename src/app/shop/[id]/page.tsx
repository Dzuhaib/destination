import { notFound, redirect } from "next/navigation";
import { getProductById } from "@/lib/woocommerce/products";

export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const product = await getProductById(id).catch(() => null);
  if (!product) notFound();
  redirect(`/product/${product.slug}`);
}
