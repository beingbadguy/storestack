"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { API_ENDPOINTS } from "@/config/endpoint";
import { axiosClient } from "@/config/axiosClient";
import { useAuthStore } from "@/store/useStore";

export default function LoginPage() {
  const { user, setUser } = useAuthStore();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (user) {
      router.push(`/`);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      if (response.data.success) {
        toast.success("Login successful");
        setUser(response.data.data);
        router.push(`/`);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] h-[90vh] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">
            Sign in to your{" "}
            <span className="font-semibold uppercase text-black">{}</span>{" "}
            account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-black"
              />

              <span className="ml-2 text-sm font-medium text-gray-600">
                Remember me
              </span>
            </label>

            <button
              type="button"
              className="text-sm font-semibold text-black hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary cursor-pointer py-3.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup`}
            className="font-semibold text-black hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
