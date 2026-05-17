import Link from "next/link";
import React from "react";
import { BiLogoApple, BiLogoWindows } from "react-icons/bi";

export default function MultiColumnFooter({ brandName = "Vogue." }) {
  return (
    <footer className="w-full bg-footer-bg text-footer-text pt-16 font-sans border-t border-footer-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-footer-text flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-80">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              {brandName}
            </Link>
            <p className="text-footer-text text-xl font-medium leading-snug mb-8 pr-4">
              Your premium destination for fashion and lifestyle.
            </p>
            <p className="text-footer-muted text-sm">{brandName}, {new Date().getFullYear()}.</p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 lg:col-span-6 grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-footer-text mb-4">Shop</h3>
              <ul className="space-y-3">
                {["All Products", "Best Sellers", "New Arrivals", "Sale"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-footer-muted hover:text-primary transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-footer-text mb-4">Support</h3>
              <ul className="space-y-3">
                {["Track Order", "Returns & Exchanges", "Shipping Info", "Contact Us"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-footer-muted hover:text-primary transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-footer-text mb-4">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Careers", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-footer-muted hover:text-primary transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* App Download */}
          <div className="md:col-span-12 lg:col-span-2">
            <h3 className="text-sm font-semibold text-footer-text mb-4">Get the app</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-footer-bg border border-footer-border rounded-full py-2 px-4 hover:bg-footer-bg/80 text-footer-text transition-colors cursor-pointer">
                <BiLogoApple className="text-xl" />
                <span className="text-sm font-medium">iOS App</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-footer-bg border border-footer-border rounded-full py-2 px-4 hover:bg-footer-bg/80 text-footer-text transition-colors cursor-pointer">
                <BiLogoWindows className="text-xl" />
                <span className="text-sm font-medium">Android</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary py-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-text font-medium">
            © {new Date().getFullYear()} {brandName} Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-primary-text hover:text-primary-text/90 font-medium transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-primary-text hover:text-primary-text/90 font-medium transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-primary-text hover:text-primary-text/90 font-medium transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
