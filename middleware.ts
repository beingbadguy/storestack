import { NextRequest, NextResponse } from "next/server";
import { applyCorsHeaders, corsHeaders } from "@/lib/cors";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    return applyCorsHeaders(NextResponse.next(), origin);
  }

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  let subdomain: string | null = null;

  if (host.includes("localhost")) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== "localhost") {
      subdomain = parts[0];
    }
  } else if (host.endsWith(".amancodes.in")) {
    const potentialSubdomain = host.replace(".amancodes.in", "");
    if (potentialSubdomain && potentialSubdomain !== "www") {
      subdomain = potentialSubdomain;
    }
  }

  if (subdomain) {
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
