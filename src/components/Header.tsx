"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isGuest, logout } = useAuth();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Learn", href: "/learn" },
    { label: "Community", href: "/community" },
    { label: "Profile", href: "/profile" },
    { label: "Support", href: "/support" },
  ];

  // Don't show header on login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const userDisplayName = user ? user.name : isGuest ? "Welcome!" : "";

  return (
    <header className="border-b border-white/10 bg-cyber-panel/95 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
        
        {/* SafeSteps Flat Logo (Shield + Pathway Concept) */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-9 h-9 border border-cyan-400/30 flex items-center justify-center bg-cyan-950/20 rounded-[4px] transition-all duration-300 group-hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            <svg className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:rotate-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Outer Shield */}
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              {/* Internal Stepping Path */}
              <path d="M8 14h3a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h3" strokeDasharray="3 3" />
            </svg>
          </div>
          <span className="font-outfit text-xl tracking-tight text-white font-bold transition-all duration-300 group-hover:text-cyan-300">
            Safe<span className="text-cyan-400 font-semibold">Steps</span>
          </span>
        </Link>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-16 flex items-center px-1 text-sm font-inter transition-all relative ${
                  isActive
                    ? "text-cyan-400 font-semibold"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-4 font-mono">
          
          {/* User profile identifier */}
          {userDisplayName && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-white/5 bg-white/5 rounded-[6px]">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-white font-inter">{userDisplayName}</span>
            </div>
          )}

          {/* Start Check Action */}
          <Link
            href="/learn"
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black px-5 py-2 text-xs font-bold rounded-full transition-all uppercase hover:shadow-md"
          >
            Start Learning
          </Link>

          {/* Logout button */}
          {userDisplayName && (
            <button
              onClick={logout}
              className="text-on-surface-variant hover:text-red-400 p-2 bg-white/5 border border-white/10 hover:border-red-500/25 rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 rounded-[6px] text-white transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 bg-cyber-panel overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {userDisplayName && (
                <div className="flex items-center gap-2 py-1 px-2 border border-white/5 bg-white/5 rounded-[4px] self-start">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-white font-inter">{userDisplayName}</span>
                </div>
              )}

              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-2 text-sm font-inter transition-all block ${
                      isActive
                        ? "text-cyan-400 font-semibold border-l-2 border-cyan-400 pl-2"
                        : "text-on-surface-variant hover:text-white pl-2 border-l-2 border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Mobile CTA */}
              <Link
                href="/learn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black py-2.5 text-xs font-bold rounded-full transition-all uppercase mt-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {userDisplayName && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 border border-red-500/20 bg-red-950/5 hover:bg-red-950/15 text-red-400 py-2 text-xs font-mono font-bold rounded-[6px] transition-all uppercase mt-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
