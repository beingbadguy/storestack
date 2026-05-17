"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BiMenu, BiX, BiShoppingBag, BiSearch } from "react-icons/bi";

export default function FloatingNavbar({
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
    <div className="w-full absolute top-0 left-0 z-50 pt-4 px-4 sm:px-6 transition-all duration-300">
      <nav className="max-w-5xl mx-auto bg-white/90 backdrop-blur-lg rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
        <div className="px-6 h-14 flex justify-between items-center">
          
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tighter text-gray-900 transition-transform duration-200 hover:scale-105">
              {brandName}
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center space-x-8">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="relative text-sm font-semibold text-gray-600 hover:text-black transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-gray-800 hover:text-black transition-all duration-200 hover:scale-110 active:scale-95">
              <BiSearch className="h-5 w-5" />
            </button>
            <button className="text-gray-800 hover:text-black flex items-center transition-all duration-200 hover:scale-110 active:scale-95">
              <BiShoppingBag className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-800 ml-2 transition-transform duration-200 active:scale-95"
            >
              {isOpen ? <BiX className="h-6 w-6 transition-transform duration-300 rotate-90" /> : <BiMenu className="h-6 w-6 transition-transform duration-300" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown (floating style) */}
      <div className={`max-w-5xl mx-auto mt-2 bg-white rounded-3xl shadow-xl overflow-hidden md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
        <div className="px-6 py-6 space-y-4">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="block text-lg font-semibold text-gray-900 transition-all duration-200 hover:text-teal-600"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
