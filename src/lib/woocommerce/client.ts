import "server-only";

import { env } from "@/config/env";
import { ApiError } from "@/lib/api-error";

interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>;
  cacheTags?: string[];
  revalidate?: number | false;
}

export interface ApiResult<T> {
  data: T;
  headers: Headers;
}

const buildUrl = (base: string, path: string, query?: RequestOptions["query"]) => {
  const url = new URL(`${base}/${path.replace(/^\//, "")}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url;
};

async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  if (!response.ok) {
    let message = `WooCommerce request failed (${response.status})`;
    let code = "woocommerce_error";
    try {
      const body = (await response.json()) as { message?: string; code?: string };
      message = body.message || message;
      code = body.code || code;
    } catch {}
    throw new ApiError(message, response.status, code);
  }
  return { data: (await response.json()) as T, headers: response.headers };
}

export async function storeApi<T>(path: string, options: RequestOptions = {}) {
  const { query, cacheTags, revalidate = 300, ...init } = options;
  const response = await fetch(buildUrl(env.wooStoreApiUrl, path, query), {
    ...init,
    headers: { Accept: "application/json", ...init.headers },
    next: init.cache === "no-store" ? undefined : { revalidate, tags: cacheTags },
  });
  return parseResponse<T>(response);
}

export async function wooRestApi<T>(path: string, options: RequestOptions = {}) {
  if (!env.wcConsumerKey || !env.wcConsumerSecret) {
    throw new ApiError("WooCommerce REST credentials are not configured", 503, "missing_credentials");
  }
  const { query, cacheTags, revalidate = false, ...init } = options;
  void cacheTags;
  void revalidate;
  const auth = Buffer.from(`${env.wcConsumerKey}:${env.wcConsumerSecret}`).toString("base64");
  const response = await fetch(buildUrl(env.wooRestApiUrl, path, query), {
    ...init,
    headers: { Accept: "application/json", Authorization: `Basic ${auth}`, ...init.headers },
    cache: "no-store",
  });
  return parseResponse<T>(response);
}
