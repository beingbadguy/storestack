"use client";
import { useAuthStore } from "@/store/useStore";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  BiMenu,
  BiX,
  BiShoppingBag,
  BiHeart,
  BiSearch,
  BiUser,
} from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface MinimalNavbarProps {
  brandName?: string;
  links?: { label: string; href: string }[];
}

export default function MinimalNavbar({
  brandName = "Vogue.",
  links = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
  ],
}: MinimalNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

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
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer text-gray-600 hover:text-black focus:outline-none p-2 -ml-2 rounded-md transition-transform duration-200 active:scale-95"
            >
              {isOpen ? (
                <BiX className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <BiMenu className="h-6 w-6 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="cursor-pointer text-2xl font-bold tracking-tight text-gray-900 transition-transform duration-200 hover:scale-105"
            >
              {brandName}
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center justify-center space-x-8 flex-1 ml-10">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="relative text-sm font-medium text-gray-500 hover:text-black transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons (Search, User, Cart) */}
          <div className="flex items-center space-x-4 md:space-x-5">
            <button className="cursor-pointer text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95">
              <BiSearch className="h-[22px] w-[22px]" />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="cursor-pointer text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <BiHeart className="h-[22px] w-[22px]" />
            </Link>

            <button
              onClick={() =>
                user ? router.push("/profile") : router.push("login")
              }
              className="cursor-pointer text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <BiUser className="h-[22px] w-[22px]" />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              className="cursor-pointer text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95 relative"
            >
              <BiShoppingBag className="h-[22px] w-[22px]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden min-h-screen bg-white border-t border-gray-100 absolute w-full transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0  visible" : "-translate-x-full overflow-hidden"}`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 ">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="cursor-pointer px-3 py-3.5 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-black rounded-lg transition-all duration-200 flex itesm-center justify-between"
              onClick={() => setIsOpen(false)}
            >
              {link.label}{" "}
              <MdOutlineKeyboardArrowRight className="h-5 w-5 text-gray-500 transition-colors duration-200" />
            </Link>
          ))}
          <div className="border-t border-gray-300 pt-4 mt-2">
            <Link
              href="/profile"
              className="cursor-pointer flex items-center px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-black rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <BiUser className="h-5 w-5 mr-3 text-gray-500 transition-colors duration-200" />
              My Account
            </Link>
            <Link
              href="/wishlist"
              className="cursor-pointer flex items-center px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-black rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <BiHeart className="h-5 w-5 mr-3 text-gray-500 transition-colors duration-200" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="cursor-pointer flex items-center px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-black rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <BiShoppingBag className="h-5 w-5 mr-3 text-gray-500 transition-colors duration-200" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
