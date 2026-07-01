"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import Button from "@/components/Button";

export default function SignupPage() {
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill in all registration fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "warning");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await signup(email, name, password);
      if (success) {
        showToast("Registration completed! Account initialized.", "success");
      } else {
        showToast("Email address is already registered", "warning");
      }
    } catch {
      showToast("An error occurred during sign up", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-cyber-panel border border-white/10 p-8 rounded-[6px] shadow-[0_0_20px_rgba(34,211,238,0.02)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-cyan-400" />
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border border-cyan-400/30 flex items-center justify-center bg-cyan-950/20 rounded-[4px] mx-auto text-cyan-400">
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M8 14h3a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h3" strokeDasharray="3 3" />
            </svg>
          </div>
          <div>
            <h2 className="font-outfit text-2xl font-bold tracking-tight text-white">
              Create Safe<span className="text-cyan-400">Steps</span> Profile
            </h2>
            <p className="text-xs text-on-surface-variant font-mono mt-1 uppercase tracking-wider">
              Student Registration Portal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Display Name */}
            <div className="space-y-1">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                Student Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Utkarsh"
                  className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] pl-10 pr-4 py-2.5 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] pl-10 pr-4 py-2.5 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] pl-10 pr-4 py-2.5 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] pl-10 pr-4 py-2.5 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
              </div>
            </div>

          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Initializing Profile..." : "Create Account"}
            </Button>
          </div>

          <div className="text-center font-mono text-[11px] border-t border-white/5 pt-4 text-on-surface-variant">
            <span>Already have a profile? </span>
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline font-bold">
              Sign In
            </Link>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
