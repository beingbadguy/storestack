"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";

export default function DomainSignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosClient.post(API_ENDPOINTS.SIGNUP, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        console.log(response.data);
        toast.success("Account created successfully");
        router.push("/");
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
            Create Account
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">
            Sign up for your{" "}
            <span className="font-semibold uppercase text-black">{}</span>{" "}
            workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex items-center gap-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                First Name
              </label>

              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

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

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />

            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="font-semibold text-black">
                Terms & Conditions
              </span>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary py-3.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push(`/login`)}
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
