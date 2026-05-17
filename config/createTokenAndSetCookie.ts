import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function createTokenAndSetCookie(
  userId: string,
  response: NextResponse,
) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("2h")
    .sign(secretKey);

  response.cookies.set("storestack", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 2,
  });
  return token;
}
