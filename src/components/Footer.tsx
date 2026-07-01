"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t border-white/5 bg-cyber-bg py-12 mt-auto font-mono text-[12px] text-on-surface-variant"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">

        {/* Column 1: Info & Slogan */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-emerald-500/30 flex items-center justify-center bg-emerald-950/20 rounded-[4px]">
              <svg className="w-3.5 h-3.5 text-emerald-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="font-outfit text-base font-bold text-white tracking-tight hover:text-emerald-400 transition-colors duration-300">
              Safe<span className="text-emerald-400">Steps</span>
            </span>
          </div>

          <div className="space-y-2 font-inter text-xs">
            <p className="text-white font-outfit font-semibold text-xs tracking-wide uppercase">
              Learn. Practice. Understand.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              An interactive educational project developed during our internship to help students build practical digital safety awareness through hands-on activities.
            </p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-emerald-400 hover:pl-1 transition-all duration-200 block">
                &gt; Home
              </Link>
            </li>
            <li>
              <Link href="/learning-hub" className="hover:text-emerald-400 hover:pl-1 transition-all duration-200 block">
                &gt; Learning Hub
              </Link>
            </li>
            <li>
              <Link href="/safety-checks" className="hover:text-emerald-400 hover:pl-1 transition-all duration-200 block">
                &gt; Safety Checks
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-emerald-400 hover:pl-1 transition-all duration-200 block">
                &gt; Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Educational Note */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Educational Note
          </h4>
          <p className="font-inter text-xs text-on-surface-variant leading-relaxed">
            This project is intended for cybersecurity education and awareness. No real attacks or real operations are performed.
          </p>
        </div>

        {/* Column 4: Built Using */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Built Using
          </h4>
          <ul className="space-y-1 text-on-surface-variant font-mono text-[11px]">
            <li>• Next.js</li>
            <li>• React</li>
            <li>• TypeScript</li>
            <li>• Tailwind CSS</li>
            <li>• Framer Motion</li>
          </ul>
        </div>

        {/* Column 5: Connect */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">
            Connect
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/utkarshsingh3011/SafeSteps-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 hover:pl-1 transition-all duration-200 block"
              >
                &gt; GitHub Repo
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/utkarshsingh3011"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 hover:pl-1 transition-all duration-200 block"
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
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span>Developed as an Internship Project</span>
        </div>
        <div className="font-inter">
          Focused on <span className="text-white/60 font-semibold">Digital Safety Education</span>
        </div>
      </div>
    </motion.footer>
  );
}
