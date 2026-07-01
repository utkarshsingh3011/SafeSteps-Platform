"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Lock, Check, UserCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import Button from "@/components/Button";

export default function LoginPage() {
  const { login, loginGuest, resetPassword } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all credentials", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        showToast(`Welcome back! Progress synced successfully.`, "success");
      } else {
        showToast("Invalid credentials. Try utkarsh@example.com / password123", "warning");
      }
    } catch {
      showToast("An error occurred during sign in", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast("Please enter your email address", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await resetPassword(forgotEmail);
      if (success) {
        showToast(`Password reset link dispatched via Supabase Auth!`, "success");
        setShowForgotForm(false);
      } else {
        showToast("Email address not found in system", "warning");
      }
    } catch {
      showToast("Error executing reset request", "warning");
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
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border border-cyan-400/30 flex items-center justify-center bg-cyan-950/20 rounded-[4px] mx-auto text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M8 14h3a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h3" strokeDasharray="3 3" />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="font-outfit text-2xl font-bold tracking-tight text-white">
              Safe<span className="text-cyan-400">Steps</span> Login
            </h2>
            <p className="text-[13px] text-cyan-400 font-medium font-inter max-w-[280px] mx-auto leading-relaxed italic">
              "Build safer digital habits. One lesson at a time."
            </p>
          </div>
        </div>

        {!showForgotForm ? (
          /* Normal Login Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              
              {/* Email */}
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
                <div className="flex justify-between items-center">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotForm(true)}
                    className="font-mono text-[9px] text-cyan-400 hover:text-cyan-300 uppercase underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] pl-10 pr-4 py-2.5 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
                </div>
              </div>

            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-mono text-[10px] text-on-surface-variant cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-cyan-400 rounded-[2px]"
                />
                <span>Remember Session</span>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={loginGuest}
                className="w-full border border-cyan-400/20 hover:border-cyan-400/40 bg-cyan-950/5 hover:bg-cyan-950/15 hover:shadow-[0_0_10px_rgba(34,211,238,0.08)] text-cyan-400 px-4 py-2.5 text-xs font-mono font-bold tracking-wider rounded-[6px] transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Enter as Guest</span>
              </button>
            </div>

            <div className="text-center font-mono text-[11px] border-t border-white/5 pt-4 text-on-surface-variant">
              <span>New student? </span>
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 underline font-bold">
                Create Account
              </Link>
            </div>

            {/* Hint Box */}
            <div className="bg-white/5 border border-white/5 p-3 rounded-[4px] font-mono text-[9px] text-on-surface-variant/80 leading-relaxed">
              <span className="font-bold text-cyan-400 block uppercase mb-1">Testing Credentials:</span>
              Email: <code className="text-white font-bold">utkarsh@example.com</code><br/>
              Password: <code className="text-white font-bold">password123</code>
            </div>

          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant font-inter leading-relaxed">
                Provide your registered account email. We will send a secure password recovery code to verify identity.
              </p>
              
              <div className="space-y-1">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] pl-10 pr-4 py-2.5 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Dispatching..." : "Send Verification Code"}
              </Button>

              <button
                type="button"
                onClick={() => setShowForgotForm(false)}
                className="w-full border border-white/10 hover:border-white/20 bg-white/5 text-white py-2 text-xs font-mono font-bold tracking-wider rounded-[6px] transition-all uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      </motion.div>
    </div>
  );
}
