"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BiMenu, BiX, BiShoppingBag, BiSearch, BiUser } from "react-icons/bi";

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

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-black focus:outline-none p-2 -ml-2 rounded-md transition-transform duration-200 active:scale-95"
            >
              {isOpen ? <BiX className="h-6 w-6 transition-transform duration-300 rotate-90" /> : <BiMenu className="h-6 w-6 transition-transform duration-300" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 transition-transform duration-200 hover:scale-105">
              {brandName}
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1 ml-10">
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
            <button className="text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95">
              <BiSearch className="h-[22px] w-[22px]" />
            </button>
            <button className="hidden sm:block text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95">
              <BiUser className="h-[22px] w-[22px]" />
            </button>
            <button className="text-gray-600 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95 relative">
              <BiShoppingBag className="h-[22px] w-[22px]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-100 absolute w-full transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="block px-3 py-3.5 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-black rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-4 mt-2">
            <Link
              href="/account"
              className="flex items-center px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-black rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <BiUser className="h-5 w-5 mr-3 text-gray-500 transition-colors duration-200" />
              My Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
