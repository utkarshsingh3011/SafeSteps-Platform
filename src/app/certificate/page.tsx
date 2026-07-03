"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, ArrowLeft, Printer, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import {
  getCompletedQuizzes,
  getCompletedCases
} from "@/components/ProgressTracker";
import Button from "@/components/Button";

export default function CertificatePage() {
  const { user, isGuest } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const quizzes = getCompletedQuizzes();
    const cases = getCompletedCases();
    const quizCount = Object.values(quizzes).filter(Boolean).length;
    const caseCount = Object.values(cases).filter(Boolean).length;
    
    // Unlocks when all 14 quizzes and 6 case studies are cleared
    const checkVal = quizCount >= 14 && caseCount >= 6;
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    setTimeout(() => {
      setIsCompleted(checkVal);
      setDateString(formattedDate);
    }, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const name = user ? user.name : isGuest ? "Guest Learner" : "Learner";

  if (!isCompleted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/30 flex items-center justify-center text-red-400 rounded-full animate-pulse">
          <Shield className="w-8 h-8" />
        </div>
        
        <div className="space-y-2 max-w-md">
          <h2 className="font-outfit text-2xl font-bold text-white">Certificate Locked</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed font-inter">
            To unlock your official SafeSteps Certificate of Completion, you must successfully complete all 14 curriculum lessons (quizzes and activities) and solve all 6 unit Case Studies on the Learn page.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto print:my-0 print:mx-auto">
      
      {/* Back & Print controls (hidden in print) */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 print:hidden">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO DASHBOARD</span>
        </Link>

        <Button
          variant="action"
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
        >
          Print Report / Save PDF
        </Button>
      </div>

      {/* CSS print override rules */}
      <style jsx global>{`
        @media print {
          header, footer, nav, button, .print\\:hidden {
            display: none !important;
          }
          body, main {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .certificate-container {
            border: 10px double #0891b2 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            margin-top: 1cm !important;
            page-break-after: always;
          }
          .report-card-container {
            border: 10px double #0f172a !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            margin-top: 1cm !important;
            page-break-before: always;
          }
          .certificate-text {
            color: #1e293b !important;
          }
          .certificate-title {
            color: #0f172a !important;
          }
        }
      `}</style>

      {/* PART 1: Certificate Frame Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="certificate-container bg-cyber-panel border-[12px] border-double border-cyan-400/40 p-12 sm:p-16 rounded-[4px] shadow-[0_0_40px_rgba(34,211,238,0.05)] relative overflow-hidden"
      >
        {/* Corners details */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/30" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/30" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/30" />

        {/* Certificate details */}
        <div className="text-center space-y-8 certificate-text">
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 border border-cyan-400 flex items-center justify-center bg-cyan-950/10 rounded-[4px] text-cyan-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M8 14h3a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h3" strokeDasharray="3 3" />
              </svg>
            </div>
            <span className="font-outfit text-2xl tracking-tight text-white font-extrabold print:text-slate-900">
              Safe<span className="text-cyan-400 font-bold">Steps</span>
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">
              Certificate of Completion
            </span>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-white tracking-tight certificate-title print:text-slate-900">
              Digital Safety Graduate
            </h1>
          </div>

          <div className="w-24 h-0.5 bg-cyan-400/30 mx-auto" />

          <div className="space-y-4">
            <p className="font-mono text-xs uppercase text-on-surface-variant tracking-wider">
              This certificate is proudly presented to
            </p>
            <h2 className="font-outfit text-3xl font-bold text-cyan-300 underline decoration-cyan-400/20 underline-offset-8 print:text-cyan-600">
              {name}
            </h2>
          </div>

          <div className="max-w-xl mx-auto text-xs text-on-surface-variant font-inter leading-relaxed print:text-slate-700">
            For successfully studying, auditing, and mastering device security and online safety policies across all 6 core SafeSteps units: Digital Safety Basics, Email Security, Safe Payments, Privacy Posture, Social Media Safety, and Device Security.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5 max-w-lg mx-auto print:border-slate-200">
            
            {/* Completion Details */}
            <div className="text-left font-mono text-[10px] space-y-1">
              <div className="text-on-surface-variant uppercase">COMPLETION DATE:</div>
              <div className="text-white font-bold print:text-slate-900">{dateString}</div>
              <div className="text-on-surface-variant uppercase mt-2">CURRICULUM SYLLABUS:</div>
              <div className="text-white font-bold print:text-slate-900">6 Units / 14 Lessons</div>
            </div>

            {/* Signature stamp */}
            <div className="text-right flex flex-col items-end justify-center font-mono">
              <span className="font-mono text-xs text-cyan-400 italic block border-b border-white/10 pb-1 w-32 text-center font-bold print:text-cyan-600 print:border-slate-300">
                SafeSteps Board
              </span>
              <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block mt-1 w-32 text-center">
                Authorized Seal
              </span>
            </div>

          </div>

          {/* Seal Graphic */}
          <div className="pt-4 flex justify-center">
            <div className="w-14 h-14 border border-cyan-400/20 bg-cyan-950/15 rounded-full flex items-center justify-center text-cyan-400 relative">
              <Award className="w-7 h-7" />
              <div className="absolute inset-1 border border-dashed border-cyan-400/20 rounded-full animate-spin-slow" />
            </div>
          </div>

        </div>
      </motion.div>

      {/* PART 2: Digital Safety Report Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="report-card-container bg-cyber-panel border-[12px] border-double border-white/10 p-12 sm:p-16 rounded-[4px] shadow-[0_0_40px_rgba(255,255,255,0.02)] relative overflow-hidden"
      >
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/10" />

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">
              SafeSteps Educational Audit
            </span>
            <h2 className="font-outfit text-3xl font-extrabold text-white tracking-tight print:text-slate-900">
              Digital Safety Report
            </h2>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase">
              Student ID: {name.replace(/\s+/g, "_").toLowerCase()}_audit_2026
            </p>
          </div>

          <div className="w-24 h-0.5 bg-white/10 mx-auto" />

          {/* Core Metrics Tables */}
          <div className="space-y-6">
            <div className="border border-white/5 bg-black/20 rounded-[6px] overflow-hidden">
              <table className="w-full text-left font-mono text-[11px] text-on-surface-variant border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-white">
                    <th className="p-3">Safety Unit</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3">Postural Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="p-3 font-bold text-white">
                      Unit 1: Digital Safety Basics
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ PASS</td>
                    <td className="p-3 text-center text-white">100%</td>
                    <td className="p-3 text-xs font-inter">Secure passphrase length and MFA locks verified.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 font-bold text-white">
                      Unit 2: Email Security
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ PASS</td>
                    <td className="p-3 text-center text-white">100%</td>
                    <td className="p-3 text-xs font-inter">Phishing clues spotted and attachments scanned.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 font-bold text-white">
                      Unit 3: Safe Payments
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ PASS</td>
                    <td className="p-3 text-center text-white">100%</td>
                    <td className="p-3 text-xs font-inter">UPI scams avoided and screenshots audited.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 font-bold text-white">
                      Unit 4: Privacy Posture
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ PASS</td>
                    <td className="p-3 text-center text-white">100%</td>
                    <td className="p-3 text-xs font-inter">Browser cookie settings and telemetry checks cleared.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 font-bold text-white">
                      Unit 5: Social Media Safety
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ PASS</td>
                    <td className="p-3 text-center text-white">100%</td>
                    <td className="p-3 text-xs font-inter">Profile visibility locked and mining traps avoided.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">
                      Unit 6: Device Security
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓ PASS</td>
                    <td className="p-3 text-center text-white">100%</td>
                    <td className="p-3 text-xs font-inter">System updates verified and sideloading audited.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Overall Rating Panel */}
            <div className="border border-cyan-400/20 bg-cyan-950/5 p-5 rounded-[6px] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="text-center sm:text-left">
                <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">
                  Overall Defense Rating
                </span>
                <span className="font-outfit text-4xl font-extrabold text-white block mt-1">
                  A+ Secure
                </span>
              </div>
              <div className="sm:col-span-2 text-xs font-inter text-on-surface-variant leading-relaxed">
                The student demonstrates a comprehensive practical understanding of digital safety best practices. Personal configurations meet or exceed baseline security models.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/5 max-w-lg mx-auto print:border-slate-200">
            <div className="text-left font-mono text-[10px] space-y-1">
              <div className="text-on-surface-variant uppercase">AUDITED BY:</div>
              <div className="text-white font-bold print:text-slate-900">SafeSteps Analyzer Suite</div>
              <div className="text-on-surface-variant uppercase mt-2">VERIFICATION ID:</div>
              <div className="text-white font-bold print:text-slate-900">SFSTP-200-GRADUATE</div>
            </div>
            
            <div className="text-right flex flex-col items-end justify-center font-mono">
              <span className="text-[10px] text-on-surface-variant uppercase">Date Checked:</span>
              <span className="text-white font-bold print:text-slate-900">{dateString}</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded-[2px] font-bold block mt-1">
                ✓ CERTIFIED SECURE
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Encouragement note */}
      <p className="text-center text-xs text-on-surface-variant font-inter print:hidden pb-12">
        Need to correct your name? Update your profile display name in the account portal.
      </p>

    </div>
  );
}
