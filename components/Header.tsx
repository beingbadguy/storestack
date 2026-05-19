"use client";

import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { useUiStore } from "@/store/useUiStore";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { LiaLinkSolid } from "react-icons/lia";
import { PiStorefront } from "react-icons/pi";

const Header = () => {
  const { user, setUser, sellerDomain, setSellerDomain, setWebSettings } =
    useAuthStore();
  const { toggleSidebar } = useUiStore();
  const router = useRouter();
  const path = usePathname();

  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const [liveLink, setLiveLink] = useState<string | null>(null);

  useEffect(() => {
    // console.log("User in header:", user);
  }, [user]);

  const handleLogout = async () => {
    try {
      console.log("User logged out");
      const response = await axiosClient.post(API_ENDPOINTS.LOGOUT);
      console.log(response);
      if (response?.data?.success) {
        console.log(response?.data);
        toast.success(response.data.message || "logout successful!");
        setUser(null);
        setSellerDomain(null);

        router.push("/login");
      }

      setLogoutModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWebSettings = async () => {
    try {
      console.log(user?.userId);

      const response = await axiosClient.get(
        `${API_ENDPOINTS.GET_WEBSETTINGS}?tenantId=${user?.userId}`,
      );

      if (response?.data?.success) {
        const settings = response.data.data;
        console.log("Web Settings in Header:", settings);
        setWebSettings(settings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchWebSettings();
    }
  }, [user]);

  useEffect(() => {
    if (sellerDomain) {
      setLiveLink(`http://${sellerDomain}.amancodes.in`);
    } else {
      setLiveLink(null);
    }
  }, [sellerDomain]);

  const getPageTitle = (pathname: string) => {
    if (!pathname) return "Dashboard";
    const segment = pathname.split("/")[1];
    if (!segment) return "Dashboard";
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <div className="md:text-lg font-semibold">{getPageTitle(path)}</div>
        </div>

        <div className="flex items-center gap-4">
          {liveLink && (
            <div>
              <PiStorefront
                onClick={() => window.open(liveLink, "_blank")}
                className=" text-xl font-medium transition hover:bg-gray-100 cursor-pointer  block md:hidden"
              />
              <button
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 cursor-pointer  hidden md:block"
                onClick={() => window.open(liveLink, "_blank")}
              >
                Visit Website
              </button>
            </div>
          )}
          <div
            className="flex items-center gap-2 cursor-pointer "
            onClick={() => router.push("/settings")}
          >
            <button className="text-sm font-medium hidden md:block hover:text-teal-600 transition-colors cursor-pointer">
              {user && `${user.firstName} ${user.lastName}`}
            </button>
            <BiUser className="text-xl text-gray-700 hover:text-teal-600 transition-colors" />
          </div>

          <button
            onClick={() => setLogoutModal(true)}
            className="rounded-md p-1 transition hover:bg-red-50 "
          >
            <BiLogOut className="cursor-pointer text-2xl hover:text-red-500" />
          </button>
        </div>
      </header>

      {/* MODAL */}
      {logoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Logout
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to logout from your account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
