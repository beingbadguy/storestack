"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BiMenu, BiX, BiShoppingBag, BiSearch, BiUser } from "react-icons/bi";

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

  return (
    <nav className="w-full bg-[#121212] text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-wider uppercase text-white">
              {brandName}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-[13px] font-medium text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-5">
            <button className="hidden sm:block text-gray-300 hover:text-white">
              <BiSearch className="h-5 w-5" />
            </button>
            <button className="hidden sm:block text-gray-300 hover:text-white">
              <BiUser className="h-5 w-5" />
            </button>
            <button className="text-gray-300 hover:text-white relative">
              <BiShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300 ml-2">
              {isOpen ? <BiX className="h-7 w-7" /> : <BiMenu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1a1a1a] absolute w-full border-b border-gray-800">
          <div className="px-4 py-4 space-y-1">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="block px-3 py-3 text-sm font-medium text-gray-300 hover:text-white uppercase tracking-widest hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
