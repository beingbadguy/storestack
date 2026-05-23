"use client";

import { API_ENDPOINTS } from "@/config/endpoint";
import { axiosClient } from "@/config/axiosClient";
import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BiCog,
  BiEnvelope,
  BiLogOut,
  BiPackage,
  BiPhone,
  BiUser,
} from "react-icons/bi";
import Loader from "./Loader";

type ProfileTab = "account" | "orders" | "settings";

const tabs: { id: ProfileTab; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "orders", label: "Orders" },
  { id: "settings", label: "General Settings" },
];

export default function ProfileSettings() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>("account");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fullName = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    return name || "Store Customer";
  }, [user?.firstName, user?.lastName]);

  const initials = useMemo(() => {
    const source =
      fullName === "Store Customer" ? (user?.email ?? "SC") : fullName;
    return source
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [fullName, user?.email]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await axiosClient.post(API_ENDPOINTS.LOGOUT);

      if (response?.data?.success) {
        logout();
        toast.success("Logged out successfully");
        router.push("/login");
      }
      setIsLoggingOut(false);
    } catch {
      toast.error("Unable to logout. Please try again.");
      setIsLoggingOut(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#303030]">
      <Loader isLoading={isLoggingOut} />
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-col gap-4 border-b border-[#e4e4e4] pb-0 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal text-[#3b3b3b]">
              Settings
            </h1>
            <div className="mt-5 flex flex-wrap gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-[#303030] text-[#303030]"
                      : "border-b-2 border-transparent text-[#8a8a8a] hover:text-[#303030]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mb-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-[#dadada] bg-white px-4 py-2 text-sm font-semibold text-[#303030] shadow-sm transition hover:border-[#bdbdbd] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BiLogOut className="h-5 w-5" />
            {isLoggingOut ? "Logging out" : "Logout"}
          </button>
        </div>

        {activeTab === "account" && (
          <div className="max-w-3xl">
            <section className="border-b border-[#e4e4e4] py-9">
              <h2 className="text-base font-semibold text-[#3f3f3f]">Avatar</h2>
              <p className="mt-1 text-sm text-[#858585]">
                Choose how your profile is displayed.
              </p>
              <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white shadow-sm">
                {initials}
              </div>
              <p className="mt-4 text-xs text-[#9a9a9a]">
                We recommend a size of at least 256x256 px.
              </p>
            </section>

            <section className="border-b border-[#e4e4e4] py-9">
              <h2 className="text-base font-semibold text-[#3f3f3f]">
                User Name
              </h2>
              <p className="mt-1 text-sm text-[#858585]">
                Visible to you on your store account.
              </p>
              <div className="mt-5 w-full max-w-md rounded-md bg-[#ededed] px-4 py-3 text-sm font-medium text-[#4a4a4a]">
                {fullName}
              </div>
            </section>

            <section className="py-9">
              <h2 className="text-base font-semibold text-[#3f3f3f]">
                Account Email
              </h2>
              <p className="mt-1 text-sm text-[#858585]">
                Manage the email you use to sign in and receive updates.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="w-full max-w-md rounded-md bg-[#ededed] px-4 py-3 text-sm font-medium text-[#4a4a4a]">
                  {user?.email ?? "Sign in to view your email"}
                </div>
                <button
                  type="button"
                  className="cursor-pointer rounded-md border border-[#dadada] bg-white px-4 py-3 text-sm font-semibold text-[#303030] shadow-sm transition hover:bg-[#f2f2f2]"
                >
                  Update
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="max-w-3xl py-9">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#3f3f3f] shadow-sm">
              <BiPackage className="h-7 w-7" />
            </div>
            <h2 className="text-base font-semibold text-[#3f3f3f]">Orders</h2>
            <p className="mt-1 text-sm text-[#858585]">
              Your recent orders and order status will appear here.
            </p>
            <div className="mt-6 rounded-md border border-[#e4e4e4] bg-white px-5 py-4 text-sm text-[#777777]">
              No orders found.
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-3xl py-9">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#3f3f3f] shadow-sm">
              <BiCog className="h-7 w-7" />
            </div>
            <h2 className="text-base font-semibold text-[#3f3f3f]">
              General Settings
            </h2>
            <p className="mt-1 text-sm text-[#858585]">
              Review the main details attached to your account.
            </p>
            <div className="mt-6 grid gap-4">
              <div className="flex items-center gap-3 rounded-md bg-[#ededed] px-4 py-3 text-sm font-medium text-[#4a4a4a]">
                <BiUser className="h-5 w-5 text-[#777777]" />
                {fullName}
              </div>
              <div className="flex items-center gap-3 rounded-md bg-[#ededed] px-4 py-3 text-sm font-medium text-[#4a4a4a]">
                <BiEnvelope className="h-5 w-5 text-[#777777]" />
                {user?.email ?? "No email available"}
              </div>
              <div className="flex items-center gap-3 rounded-md bg-[#ededed] px-4 py-3 text-sm font-medium text-[#4a4a4a]">
                <BiPhone className="h-5 w-5 text-[#777777]" />
                {user?.mobile ?? "No phone number added"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
