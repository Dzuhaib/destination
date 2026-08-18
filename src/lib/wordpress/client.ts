import "server-only";

import { env } from "@/config/env";
import { ApiError } from "@/lib/api-error";

export async function wordpressApi<T>(path: string, query: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${env.wordpressApiUrl}/${path.replace(/^\//, "")}`);
  Object.entries(query).forEach(([key, value]) => value !== undefined && url.searchParams.set(key, String(value)));
  const response = await fetch(url, { next: { revalidate: 600, tags: ["wordpress", path.split("/")[1] || path] } });
  if (!response.ok) throw new ApiError(`WordPress request failed (${response.status})`, response.status, "wordpress_error");
  return { data: (await response.json()) as T, headers: response.headers };
}
