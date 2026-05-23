"use client";
import { useAuthStore } from "@/store/useStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BiMenu,
  BiX,
  BiShoppingBag,
  BiHeart,
  BiSearch,
  BiUser,
  BiGlobe,
} from "react-icons/bi";
import {
  DEFAULT_BRAND_NAME,
  DEFAULT_NAV_LINKS,
  type NavbarProps,
} from "@/config/navbar";

export default function DoubleNavbar({
  brandName = DEFAULT_BRAND_NAME,
  links = DEFAULT_NAV_LINKS,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className="w-full bg-white relative z-50">
      {/* Top Utility Bar */}
      <div className="w-full bg-gray-50 border-b border-gray-200 block">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-widest">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <BiGlobe className="mr-1 text-base" /> EN / USD
            </span>
            <Link href="/help" className="cursor-pointer hover:text-black">
              Help Center
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/store-locator" className="cursor-pointer hover:text-black">
              Find a Store
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="cursor-pointer hover:text-black flex items-center"
              >
                <BiUser className="mr-1 text-base" /> {user?.firstName}{" "}
                {user?.lastName}
              </Link>
            ) : (
              <Link
                href="/login"
                className="cursor-pointer hover:text-black flex items-center"
              >
                <BiUser className="mr-1 text-base" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer lg:hidden text-gray-800 p-2 -ml-2 mr-2 transition-transform duration-200 active:scale-95"
              >
                {isOpen ? (
                  <BiX className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <BiMenu className="h-6 w-6 transition-transform duration-300" />
                )}
              </button>
              <Link
                href="/"
                className="cursor-pointer text-2xl font-bold tracking-tight text-gray-900 transition-transform duration-200 hover:scale-105"
              >
                {brandName}
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="relative text-sm font-bold text-gray-800 hover:text-black transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-teal-500/20">
                <BiSearch className="text-gray-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none outline-none text-sm ml-2 w-32 placeholder-gray-500"
                />
              </div>
              <button className="cursor-pointer md:hidden text-gray-800 transition-all duration-200 hover:scale-110 active:scale-95">
                <BiSearch className="h-5 w-5" />
              </button>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="cursor-pointer text-gray-800 relative transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <BiHeart className="h-5 w-5" />
              </Link>
              <Link
                href="/profile"
                aria-label="Profile"
                className="cursor-pointer text-gray-800 relative transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <BiUser className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="cursor-pointer text-gray-800 relative transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <BiShoppingBag className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? " translate-x-0" : " translate-x-[-100%] overflow-hidden"}`}
      >
        <div className="px-4 py-2 space-y-1">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="cursor-pointer block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-100 last:border-0 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 py-4">
            <Link
              href="/profile"
              className="cursor-pointer flex flex-col items-center justify-center rounded-md bg-gray-50 p-3 text-xs font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BiUser className="mb-1 h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/wishlist"
              className="cursor-pointer flex flex-col items-center justify-center rounded-md bg-gray-50 p-3 text-xs font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BiHeart className="mb-1 h-5 w-5" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="cursor-pointer flex flex-col items-center justify-center rounded-md bg-gray-50 p-3 text-xs font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BiShoppingBag className="mb-1 h-5 w-5" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
