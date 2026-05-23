import axios from "axios";

/**
 * In the browser, use same-origin so tenant subdomains (e.g. aman.localhost:3000)
 * hit /api on the same host. Avoids CORS and keeps auth cookies on the tenant host.
 * Server-side calls can still use NEXT_PUBLIC_API_BASE_URL when set.
 */
const baseURL =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});
