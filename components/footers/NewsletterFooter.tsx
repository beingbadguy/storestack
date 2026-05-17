import Link from "next/link";
import React from "react";
import { BiUser } from "react-icons/bi";

export default function NewsletterFooter({ 
  brandName = "Vogue.",
  description = "We growing up your lifestyle with premium products. Delivering the best fashion directly to your door."
}) {
  return (
    <footer className="w-full bg-footer-bg text-footer-text pt-20 font-sans border-t border-footer-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section: Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <h2 className="text-3xl font-bold text-footer-text leading-tight md:w-1/2">
            Join our newsletter to <br className="hidden md:block" /> keep up to date with us!
          </h2>
          
          <form className="w-full md:w-auto md:min-w-[400px] flex items-center bg-footer-bg border border-footer-border p-1.5 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
            <div className="pl-4 text-footer-muted">
              <BiUser className="text-lg" />
            </div>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-footer-text placeholder-footer-muted"
              required
            />
            <button type="submit" className="bg-primary hover:bg-primary-hover text-primary-text font-medium py-2.5 px-6 rounded-full transition-colors text-sm">
              Subscribe
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-footer-border mb-16"></div>

        {/* Middle Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-footer-text flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-80">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              {brandName}
            </Link>
            <p className="text-footer-muted text-sm leading-relaxed pr-8">
              {description}
            </p>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-footer-text mb-5">Shop</h3>
              <ul className="space-y-4">
                {["All Products", "Best Sellers", "New Arrivals", "Sale"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-footer-muted hover:text-primary transition-colors font-medium">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-footer-text mb-5">Support</h3>
              <ul className="space-y-4">
                {["Track Order", "Returns & Exchanges", "Shipping Info", "Contact Us"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-footer-muted hover:text-primary transition-colors font-medium">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-footer-text mb-5">Company</h3>
              <ul className="space-y-4">
                {["About Us", "Careers", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-footer-muted hover:text-primary transition-colors font-medium">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-footer-border"></div>

        {/* Bottom Section */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-footer-muted">
            © {new Date().getFullYear()} {brandName} Inc.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-footer-muted hover:text-primary font-medium transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-footer-muted hover:text-primary font-medium transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-footer-muted hover:text-primary font-medium transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
