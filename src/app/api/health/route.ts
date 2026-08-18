import { NextResponse } from "next/server";
import { env, privateEnvStatus } from "@/config/env";

export const dynamic = "force-dynamic";

interface Check { ok: boolean; status: number | null; latencyMs: number; message: string }

async function check(url: string): Promise<Check> {
  const started = Date.now();
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    return { ok: response.ok, status: response.status, latencyMs: Date.now() - started, message: response.ok ? "Connected" : "Unavailable" };
  } catch {
    return { ok: false, status: null, latencyMs: Date.now() - started, message: "Connection failed" };
  }
}

export async function GET() {
  const [wordpress, products, categories, blog] = await Promise.all([
    check(`${env.wordpressApiUrl}/`),
    check(`${env.wooStoreApiUrl}/products?per_page=1`),
    check(`${env.wooStoreApiUrl}/products/categories?per_page=1`),
    check(`${env.wordpressApiUrl}/wp/v2/posts?per_page=1`),
  ]);
  const ok = [wordpress, products, categories, blog].every((item) => item.ok);
  return NextResponse.json({
    ok,
    checkedAt: new Date().toISOString(),
    services: { wordpress, woocommerce: products, products, categories, blog },
    authentication: {
      wooCommerceRest: privateEnvStatus().WC_CONSUMER_KEY && privateEnvStatus().WC_CONSUMER_SECRET,
      wordpress: privateEnvStatus().WORDPRESS_USERNAME && privateEnvStatus().WORDPRESS_APP_PASSWORD,
    },
    environment: {
      WORDPRESS_URL: Boolean(env.wordpressUrl),
      WORDPRESS_API_URL: Boolean(env.wordpressApiUrl),
      WOOCOMMERCE_STORE_API_URL: Boolean(env.wooStoreApiUrl),
      WOOCOMMERCE_REST_API_URL: Boolean(env.wooRestApiUrl),
      ...privateEnvStatus(),
    },
  }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
