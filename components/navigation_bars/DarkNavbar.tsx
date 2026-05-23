"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BiMenu,
  BiX,
  BiShoppingBag,
  BiHeart,
  BiSearch,
  BiUser,
} from "react-icons/bi";

export default function DarkNavbar({
  brandName = "Vogue.",
  links = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
  ],
}) {
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
    <nav className="w-full bg-[#121212] text-white border-b border-gray-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="cursor-pointer text-2xl font-bold tracking-wider uppercase text-white transition-transform duration-200 hover:scale-105"
            >
              {brandName}
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="relative text-[13px] font-medium text-gray-400 hover:text-white uppercase tracking-widest transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-5">
            <button className="cursor-pointer hidden sm:block text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
              <BiSearch className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="cursor-pointer text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <BiHeart className="h-5 w-5" />
            </Link>
            <Link
              href="/profile"
              aria-label="Profile"
              className="cursor-pointer text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <BiUser className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="cursor-pointer text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 relative"
            >
              <BiShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                1
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden text-gray-300 ml-2 transition-transform duration-200 active:scale-95"
            >
              {isOpen ? (
                <BiX className="h-7 w-7 transition-transform duration-300 rotate-90" />
              ) : (
                <BiMenu className="h-7 w-7 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden bg-[#1a1a1a] absolute w-full border-b border-gray-800 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[400px] translate-y-0" : "max-h-0 translate-y-[-100%] overflow-hidden"}`}
      >
        <div className="px-4 py-4 space-y-1">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="cursor-pointer block px-3 py-3 text-sm font-medium text-gray-300 hover:text-white uppercase tracking-widest hover:bg-white/5 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-800 pt-4">
            <Link
              href="/profile"
              className="cursor-pointer flex flex-col items-center justify-center rounded-md bg-white/5 p-3 text-xs font-medium text-gray-200 transition-all duration-200 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <BiUser className="mb-1 h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/wishlist"
              className="cursor-pointer flex flex-col items-center justify-center rounded-md bg-white/5 p-3 text-xs font-medium text-gray-200 transition-all duration-200 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <BiHeart className="mb-1 h-5 w-5" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="cursor-pointer flex flex-col items-center justify-center rounded-md bg-white/5 p-3 text-xs font-medium text-gray-200 transition-all duration-200 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <BiShoppingBag className="mb-1 h-5 w-5" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
