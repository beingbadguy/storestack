"use client";

import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLogOut, BiUser } from "react-icons/bi";

const Header = () => {
  const { user, setUser, sellerDomain } = useAuthStore();
  const router = useRouter();

  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const [liveLink, setLiveLink] = useState<string | null>(null);

  useEffect(() => {
    console.log("User in header:", user);
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
        router.push("/login");
      }

      setLogoutModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(sellerDomain){
      setLiveLink(`http://${sellerDomain}.amancodes.in`);
    } else {
      setLiveLink(null);
    }
  },[sellerDomain])


  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="text-lg font-semibold">Dashboard</div>

        <div className="flex items-center gap-4">
          {liveLink && (
            <button 
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              onClick={() => window.open(liveLink, '_blank')}
            >
              View Live Website
            </button>
          )}
          <button className="text-sm font-medium">
            {user && `${user.firstName} ${user.lastName}`}
          </button>

          <BiUser className="text-xl" />

          <button
            onClick={() => setLogoutModal(true)}
            className="rounded-md p-1 transition hover:bg-red-50"
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
