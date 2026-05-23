import type { NextResponse } from "next/server";

/** Tenant storefront origins allowed to call /api from another host (e.g. localhost dashboard). */
const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/[\w-]+\.localhost(:\d+)?$/,
  /^https?:\/\/[\w-]+\.amancodes\.in$/,
  /^https?:\/\/www\.amancodes\.in$/,
  /^https?:\/\/amancodes\.in$/,
];

export function isAllowedTenantOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

export function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (!isAllowedTenantOrigin(origin)) return headers;

  headers.set("Access-Control-Allow-Origin", origin!);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export function applyCorsHeaders(
  response: NextResponse,
  origin: string | null,
): NextResponse {
  corsHeaders(origin).forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}
