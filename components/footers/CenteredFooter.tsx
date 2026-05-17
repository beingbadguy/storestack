import Link from "next/link";
import React from "react";
import { BiUser } from "react-icons/bi";

export default function CenteredFooter({ brandName = "Vogue." }) {
  return (
    <footer className="w-full bg-footer-bg text-footer-text pt-20 pb-4 font-sans relative border-t border-footer-border">
      <div className="max-w-3xl mx-auto px-6 text-center">
        
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-footer-text mb-6">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-80">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          {brandName}
        </Link>

        {/* Tagline */}
        <h2 className="text-3xl md:text-4xl font-bold text-footer-text mb-8 leading-tight">
          Join our community and get <br className="hidden md:block" /> exclusive e-commerce offers
        </h2>

        {/* Newsletter Form */}
        <form className="max-w-md mx-auto flex items-center bg-footer-bg border border-footer-border p-1.5 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all mb-16">
          <div className="pl-4 text-footer-muted">
            <BiUser className="text-lg" />
          </div>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-footer-text placeholder-footer-muted"
            required
          />
          <button type="submit" className="bg-primary hover:bg-primary-hover text-primary-text font-medium py-2 px-6 rounded-full transition-colors text-sm">
            Subscribe
          </button>
        </form>

        {/* Horizontal Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          <Link href="/products" className="text-sm font-medium text-footer-muted hover:text-footer-text transition-colors">All Products</Link>
          <Link href="/best-sellers" className="text-sm font-medium text-footer-muted hover:text-footer-text transition-colors">Best Sellers</Link>
          <Link href="/track-order" className="text-sm font-medium text-footer-muted hover:text-footer-text transition-colors">Track Order</Link>
          <Link href="/about" className="text-sm font-medium text-footer-muted hover:text-footer-text transition-colors">About Us</Link>
          <Link href="/terms" className="text-sm font-medium text-footer-muted hover:text-footer-text transition-colors">Terms</Link>
          <Link href="/privacy" className="text-sm font-medium text-footer-muted hover:text-footer-text transition-colors">Privacy</Link>
        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-primary"></div>
    </footer>
  );
}
