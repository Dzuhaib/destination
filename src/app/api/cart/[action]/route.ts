import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const allowed = new Set(["add-item", "update-item", "remove-item", "apply-coupon", "remove-coupon", "select-shipping-rate"]);

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  if (!allowed.has(action)) return NextResponse.json({ message: "Unsupported cart action" }, { status: 404 });
  const token = request.cookies.get("dw_cart_token")?.value;
  const response = await fetch(`${env.wooStoreApiUrl}/cart/${action}`, {
    method: "POST", cache: "no-store", body: await request.text(),
    headers: { "Content-Type": "application/json", ...(token ? { "Cart-Token": token } : {}) },
  });
  const result = new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("content-type") || "application/json", "Cache-Control": "no-store" } });
  const nextToken = response.headers.get("Cart-Token");
  if (nextToken) result.cookies.set("dw_cart_token", nextToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return result;
}
