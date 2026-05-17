import Link from "next/link";
import React from "react";
import { BiLogoApple, BiLogoWindows, BiLogoAndroid, BiLogoChrome } from "react-icons/bi";

export default function MinimalContactFooter({ brandName = "Vogue." }) {
  return (
    <footer className="w-full bg-footer-bg text-footer-text pt-16 font-sans border-t border-footer-border pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          {/* Left: Brand & Contact */}
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight text-footer-text flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-80">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              {brandName}
            </Link>
            
            <div className="flex gap-12">
              <div>
                <p className="text-xs text-footer-muted mb-1">Email</p>
                <p className="text-sm font-medium text-footer-text">hello@{brandName.toLowerCase().replace('.', '')}.com</p>
              </div>
              <div>
                <p className="text-xs text-footer-muted mb-1">Phone Number</p>
                <p className="text-sm font-medium text-footer-text">+1 (201) 895-3801</p>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="md:text-right">
            <h3 className="text-xl font-bold text-footer-text mb-6 md:w-64 md:ml-auto leading-snug">
              Elevate your shopping experience today
            </h3>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/products" className="bg-primary hover:bg-primary-hover text-primary-text font-medium py-2.5 px-6 rounded-full transition-colors text-sm">
                Shop Now
              </Link>
              <Link href="/about" className="bg-footer-bg border border-footer-border hover:bg-footer-bg/85 text-footer-text font-medium py-2.5 px-6 rounded-full transition-colors text-sm">
                Track Order
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-footer-border mb-6"></div>

        {/* Bottom Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-footer-muted font-medium">
            <div className="w-4 h-4 bg-primary text-primary-text rounded-full flex items-center justify-center text-[10px]">✓</div>
            Available on all platforms
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 border border-footer-border rounded-full px-3 py-1.5 text-xs font-medium text-footer-muted">
              <BiLogoWindows className="text-base" /> Windows
            </div>
            <div className="flex items-center gap-1.5 border border-footer-border rounded-full px-3 py-1.5 text-xs font-medium text-footer-muted">
              <BiLogoApple className="text-base" /> macOS
            </div>
            <div className="flex items-center gap-1.5 border border-footer-border rounded-full px-3 py-1.5 text-xs font-medium text-footer-muted">
              <BiLogoChrome className="text-base" /> Web
            </div>
            <div className="flex items-center gap-1.5 border border-footer-border rounded-full px-3 py-1.5 text-xs font-medium text-footer-muted">
              <BiLogoApple className="text-base" /> iOS
            </div>
            <div className="flex items-center gap-1.5 border border-footer-border rounded-full px-3 py-1.5 text-xs font-medium text-footer-muted">
              <BiLogoAndroid className="text-base" /> Android
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
