import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

export async function POST(request: NextRequest) {
  if (!env.revalidationSecret || request.headers.get("x-revalidation-secret") !== env.revalidationSecret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { resource?: string; slug?: string };
  if (body.resource === "post") {
    revalidateTag("wordpress", "max");
    revalidateTag("posts", "max");
    revalidatePath("/blog");
    if (body.slug) revalidatePath(`/blog/${body.slug}`);
  } else {
    revalidateTag("products", "max");
    revalidateTag("categories", "max");
    revalidatePath("/shop");
    revalidatePath("/");
    if (body.slug) revalidatePath(`/product/${body.slug}`);
  }
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
