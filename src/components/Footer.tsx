"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t border-white/5 bg-cyber-bg py-12 mt-auto font-mono text-[12px] text-on-surface-variant"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">

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

          <div className="space-y-2 font-inter text-xs">
            <p className="text-on-surface-variant leading-relaxed">
              SafeSteps is an educational project created to promote digital safety through practical learning, interactive activities, and community awareness.
            </p>
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Home
              </Link>
            </li>
            <li>
              <Link href="/learn" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Learn
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Community
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Profile
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Learning Units */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Learning Units
          </h4>
          <ul className="space-y-1.5 text-on-surface-variant font-mono text-[11px]">
            <li>
              <Link href="/learn?unit=unit-1" className="hover:text-cyan-400 transition-colors">
                • Unit 1: Basics
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-2" className="hover:text-cyan-400 transition-colors">
                • Unit 2: Email
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-3" className="hover:text-cyan-400 transition-colors">
                • Unit 3: Payments
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-4" className="hover:text-cyan-400 transition-colors">
                • Unit 4: Privacy
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-5" className="hover:text-cyan-400 transition-colors">
                • Unit 5: Social
              </Link>
            </li>
            <li>
              <Link href="/learn?unit=unit-6" className="hover:text-cyan-400 transition-colors">
                • Unit 6: Device
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Resources */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/support" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Glossary
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Helplines
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block">
                &gt; Feedbacks
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Project Info */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Project Info
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/utkarshsingh3011/SafeSteps-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block"
              >
                &gt; GitHub Repo
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/utkarshsingh3011"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 hover:pl-1 transition-all duration-200 block"
              >
                &gt; LinkedIn
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Internship Project Label */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
        <div className="flex items-center gap-1.5 font-inter">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          <span>B.Tech ECE Student Internship Project</span>
        </div>
        <div className="font-inter">
          Developed by <span className="text-white/60 font-semibold">Utkarsh Singh</span>
        </div>
      </div>
    </motion.footer>
  );
}
