import Link from "next/link";
import React from "react";
import { BiUser } from "react-icons/bi";

export default function CenteredFooter({ brandName = "Vogue." }) {
  return (
    <footer className="w-full bg-white pt-20 pb-4 font-sans relative">
      <div className="max-w-3xl mx-auto px-6 text-center">
        
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 mb-6">
          <div className="w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center opacity-80">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          {brandName}
        </Link>

        {/* Tagline */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
          Join our community and get <br className="hidden md:block" /> exclusive e-commerce offers
        </h2>

        {/* Newsletter Form */}
        <form className="max-w-md mx-auto flex items-center bg-white border border-gray-200 p-1.5 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-lime-500 focus-within:border-transparent transition-all mb-16">
          <div className="pl-4 text-gray-400">
            <BiUser className="text-lg" />
          </div>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-gray-700"
            required
          />
          <button type="submit" className="bg-lime-500 hover:bg-lime-600 text-lime-950 font-medium py-2 px-6 rounded-full transition-colors text-sm">
            Subscribe
          </button>
        </form>

        {/* Horizontal Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">All Products</Link>
          <Link href="/best-sellers" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Best Sellers</Link>
          <Link href="/track-order" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Track Order</Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">About Us</Link>
          <Link href="/terms" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Terms</Link>
          <Link href="/privacy" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Privacy</Link>
        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-lime-500"></div>
    </footer>
  );
}
