"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BiMenu, BiX, BiShoppingBag, BiSearch, BiUser, BiGlobe } from "react-icons/bi";

export default function DoubleNavbar({
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
    <header className="w-full bg-white relative z-50">
      {/* Top Utility Bar */}
      <div className="w-full bg-gray-50 border-b border-gray-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-widest">
          <div className="flex items-center space-x-4">
             <span className="flex items-center"><BiGlobe className="mr-1 text-base"/> EN / USD</span>
             <Link href="/help" className="hover:text-black">Help Center</Link>
          </div>
          <div className="flex items-center space-x-4">
             <Link href="/store-locator" className="hover:text-black">Find a Store</Link>
             <Link href="/account" className="hover:text-black flex items-center"><BiUser className="mr-1 text-base" /> Sign In</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800 p-2 -ml-2 mr-2">
                {isOpen ? <BiX className="h-6 w-6" /> : <BiMenu className="h-6 w-6" />}
              </button>
              <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                {brandName}
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm font-bold text-gray-800 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <BiSearch className="text-gray-500 h-4 w-4" />
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm ml-2 w-32 placeholder-gray-500" />
              </div>
              <button className="md:hidden text-gray-800">
                <BiSearch className="h-5 w-5" />
              </button>
              <button className="text-gray-800 relative">
                <BiShoppingBag className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-200 shadow-xl">
          <div className="px-4 py-2 space-y-1">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-100 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
