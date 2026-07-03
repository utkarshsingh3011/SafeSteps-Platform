"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t border-white/5 bg-cyber-bg py-16 mt-auto text-on-surface-variant font-inter"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

        {/* Column 1: Slogan & Statement */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-cyan-400/30 flex items-center justify-center bg-cyan-950/20 rounded-[4px]">
              <svg className="w-3.5 h-3.5 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="font-outfit text-base font-bold text-white tracking-tight hover:text-cyan-400 transition-colors duration-300">
              Safe<span className="text-cyan-400">Steps</span>
            </span>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-sm">
            An educational project created to promote digital safety through practical learning, interactive activities, and community awareness.
          </p>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="md:col-span-2 md:col-start-6 space-y-3.5">
          <h4 className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition-colors duration-200 block">
                Home
              </Link>
            </li>
            <li>
              <Link href="/learn" className="hover:text-cyan-400 transition-colors duration-200 block">
                Learn
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-cyan-400 transition-colors duration-200 block">
                Community
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-cyan-400 transition-colors duration-200 block">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-cyan-400 transition-colors duration-200 block">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Learning Units */}
        <div className="md:col-span-3 space-y-3.5">
          <h4 className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            Learning Units
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/learn?unit=unit-1" className="hover:text-cyan-400 transition-colors duration-200 block">
                Unit 1: Password Security
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-2" className="hover:text-cyan-400 transition-colors duration-200 block">
                Unit 2: Email Scams
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-3" className="hover:text-cyan-400 transition-colors duration-200 block">
                Unit 3: Online Payments
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-4" className="hover:text-cyan-400 transition-colors duration-200 block">
                Unit 4: App Privacy
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-5" className="hover:text-cyan-400 transition-colors duration-200 block">
                Unit 5: Social Scams
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-6" className="hover:text-cyan-400 transition-colors duration-200 block">
                Unit 6: Device Safety
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Project Info */}
        <div className="md:col-span-2 space-y-3.5">
          <h4 className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            Project Info
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://github.com/utkarshsingh3011/SafeSteps-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors duration-200 block"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/utkarshsingh3011"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors duration-200 block"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Internship Project Label */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 mt-12 pt-6 border-t border-white/5 flex justify-center text-[10px] text-white/30 tracking-wider">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span>STUDENT INTERNSHIP PROJECT</span>
        </div>
      </div>
    </motion.footer>
  );
}
