import { env, privateEnvStatus } from "@/config/env";

export const dynamic = "force-dynamic";

async function inspect(url: string) {
  const started = Date.now();
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    return { ok: response.ok, status: response.status, count: Number(response.headers.get("x-wp-total") || 0), latency: Date.now() - started };
  } catch { return { ok: false, status: null, count: 0, latency: Date.now() - started }; }
}

export default async function IntegrationTestPage() {
  const [wordpress, products, categories, blog] = await Promise.all([
    inspect(`${env.wordpressApiUrl}/`), inspect(`${env.wooStoreApiUrl}/products?per_page=1`),
    inspect(`${env.wooStoreApiUrl}/products/categories?per_page=1`), inspect(`${env.wordpressApiUrl}/wp/v2/posts?per_page=1`),
  ]);
  const rows = [
    ["WordPress connection", wordpress], ["WooCommerce / Product API", products],
    ["Category API", categories], ["Blog API", blog],
  ] as const;
  return <div className="mx-auto min-h-screen max-w-5xl px-6 pb-20 pt-36">
    <p className="text-xs font-bold uppercase tracking-[.3em] text-[#a6549e]">Development diagnostic</p>
    <h1 className="mt-3 text-4xl font-semibold">WordPress integration</h1>
    <p className="mt-4 text-gray-500">This page reports connectivity and configuration presence only. Secret values are never rendered.</p>
    <div className="mt-10 overflow-hidden rounded border border-gray-200 bg-white">
      {rows.map(([label, value]) => <div key={label} className="grid gap-3 border-b border-gray-100 p-5 sm:grid-cols-[1fr_auto_auto_auto]">
        <strong>{label}</strong><span>{value.ok ? "Connected" : "Unavailable"}</span><span>{value.status || "—"}</span><span>{value.count ? `${value.count} records` : `${value.latency}ms`}</span>
      </div>)}
    </div>
    <div className="mt-8 rounded border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-semibold">Authentication status</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div><dt>WooCommerce REST credentials</dt><dd>{privateEnvStatus().WC_CONSUMER_KEY && privateEnvStatus().WC_CONSUMER_SECRET ? "Configured" : "Not configured"}</dd></div>
        <div><dt>WordPress application password</dt><dd>{privateEnvStatus().WORDPRESS_USERNAME && privateEnvStatus().WORDPRESS_APP_PASSWORD ? "Configured" : "Not configured"}</dd></div>
        <div><dt>Recent orders</dt><dd>{privateEnvStatus().WC_CONSUMER_KEY ? "Authorized (not displayed publicly)" : "Requires REST credentials"}</dd></div>
        <div><dt>Webhook revalidation</dt><dd>{privateEnvStatus().REVALIDATION_SECRET ? "Configured" : "Not configured"}</dd></div>
      </dl>
    </div>
  </div>;
}
