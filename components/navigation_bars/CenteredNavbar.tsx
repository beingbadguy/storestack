"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BiMenu,
  BiX,
  BiShoppingBag,
  BiSearch,
  BiHeart,
  BiUser,
} from "react-icons/bi";
import {
  DEFAULT_BRAND_NAME,
  DEFAULT_NAV_LINKS,
  type NavbarProps,
} from "@/config/navbar";

export default function CenteredNavbar({
  brandName = DEFAULT_BRAND_NAME,
  links = DEFAULT_NAV_LINKS,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="w-full bg-white border-b border-gray-200">
      {/* Top Banner (Optional, very common in ecommerce) */}
      <div
        className={`bg-primary text-white text-xs font-medium text-center py-2 tracking-wide`}
      >
        New Arrivals Just Dropped
      </div>

      <div className="mx-4 ">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu & Search (Left side) */}
          <div className="flex items-center flex-1 xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer p-2 -ml-2 text-gray-800 transition-transform duration-200 active:scale-95"
            >
              {isOpen ? (
                <BiX className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <BiMenu className="h-6 w-6 transition-transform duration-300" />
              )}
            </button>
            <button className="cursor-pointer p-2 ml-2 text-gray-800 transition-all duration-200 hover:scale-110 active:scale-95">
              <BiSearch className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop Links (Left side) */}
          <div className="hidden xl:flex items-center space-x-6 flex-1">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="relative text-sm font-medium text-gray-600 hover:text-black uppercase tracking-wider transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo (Center) */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link
              href="/"
              className="cursor-pointer text-3xl font-serif italic tracking-tight text-gray-900 transition-transform duration-200 hover:scale-105"
            >
              {brandName}
            </Link>
          </div>

          {/* Icons (Right side) */}
          <div className="flex items-center justify-end space-x-4 md:space-x-6 flex-1">
            <button className="cursor-pointer hidden xl:block text-gray-800 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95">
              <BiSearch className="h-5 w-5" />
            </button>
            <Link
              href="/profile"
              aria-label="Profile"
              className="cursor-pointer text-gray-800 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <BiUser className="h-5 w-5" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="cursor-pointer text-gray-800 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <BiHeart className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="cursor-pointer text-gray-800 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95 relative"
            >
              <BiShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                2
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden  min-h-screen bg-white border-t border-gray-100 absolute w-full z-50 transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0 " : "-translate-x-full overflow-hidden"}`}
      >
        <div className="px-4 py-6 space-y-4 ">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="cursor-pointer block text-lg font-medium text-gray-900 uppercase tracking-wide transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 mt-6 border-t border-gray-300 grid grid-cols-3 gap-3">
            <Link
              href="/profile"
              className="cursor-pointer flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BiUser className="h-6 w-6 mb-2 transition-colors duration-200" />
              Account
            </Link>
            <Link
              href="/wishlist"
              className="cursor-pointer flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BiHeart className="h-6 w-6 mb-2 transition-colors duration-200" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="cursor-pointer flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BiShoppingBag className="h-6 w-6 mb-2 transition-colors duration-200" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
