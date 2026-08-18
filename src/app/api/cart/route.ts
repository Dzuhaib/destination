import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const CART_TOKEN_COOKIE = "dw_cart_token";

async function proxy(request: NextRequest, method: "GET" | "POST") {
  const body = method === "POST" ? await request.text() : undefined;
  const token = request.cookies.get(CART_TOKEN_COOKIE)?.value;
  const response = await fetch(`${env.wooStoreApiUrl}/cart`, {
    method,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(token ? { "Cart-Token": token } : {}) },
    body,
  });
  const result = new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "application/json", "Cache-Control": "no-store" },
  });
  const nextToken = response.headers.get("Cart-Token");
  if (nextToken) result.cookies.set(CART_TOKEN_COOKIE, nextToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return result;
}

export const GET = (request: NextRequest) => proxy(request, "GET");
export const POST = (request: NextRequest) => proxy(request, "POST");
