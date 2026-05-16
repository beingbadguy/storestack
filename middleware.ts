import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
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
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};