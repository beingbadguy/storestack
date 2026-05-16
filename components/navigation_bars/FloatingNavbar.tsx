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
    <div className="w-full absolute top-0 left-0 z-50 pt-4 px-4 sm:px-6">
      <nav className="max-w-5xl mx-auto bg-white/90 backdrop-blur-lg rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20">
        <div className="px-6 h-14 flex justify-between items-center">
          
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tighter text-gray-900">
              {brandName}
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center space-x-8">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-gray-800 hover:text-gray-500">
              <BiSearch className="h-5 w-5" />
            </button>
            <button className="text-gray-800 hover:text-gray-500 flex items-center">
              <BiShoppingBag className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-800 ml-2"
            >
              {isOpen ? <BiX className="h-6 w-6" /> : <BiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown (floating style) */}
      {isOpen && (
        <div className="max-w-5xl mx-auto mt-2 bg-white rounded-3xl shadow-xl overflow-hidden md:hidden">
          <div className="px-6 py-6 space-y-4">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="block text-lg font-semibold text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
