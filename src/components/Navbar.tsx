'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/products/iphone-17-pro', label: 'iPhone 17 Pro' },
    { href: '/products/samsung-s26-ultra', label: 'Samsung S26 Ultra' },
    { href: '/products/google-pixel-11-pro', label: 'Pixel 11 Pro' },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)]' 
          : 'bg-[#fcfbfd] border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="https://1fi.in/1fi.svg" alt="1Fi" className="h-8 w-auto group-hover:scale-105 transition-transform" />
        </Link>

        {/* Center navigation links — desktop */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium transition-colors text-[#86868b]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors tracking-wide hover:text-[#1d1d1f]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Trust badge, CTA, Mobile menu button */}
        <div className="flex items-center gap-4">
          <Link
            href="/products/iphone-17-pro"
            className="hidden sm:flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[12px] font-medium px-4 py-2 rounded-full transition-all shadow-sm shadow-[#8B5CF6]/20"
          >
            <span>Explore Plans</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-[#1d1d1f] hover:bg-[#f5f5f7]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white animate-fade-in absolute w-full left-0">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/products/iphone-17-pro"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-4 py-3 rounded-xl transition-all"
              >
                <span>Explore EMI Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
