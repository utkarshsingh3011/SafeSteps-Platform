"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { setSupportCompleted } from "@/components/ProgressTracker";

const FAQS = [
  {
    q: "What is the national cyber fraud helpline number in India?",
    a: "The official national cybercrime helpline number is 1930. If you have lost money to a digital banking, credit card, or UPI scam, dial 1930 immediately (within the first 'golden hour') to request freezing of the fraudulent account transfer."
  },
  {
    q: "Why does SafeSteps advocate for longer passphrases rather than complex codes?",
    a: "Computers guess passwords by brute-forcing combinations. A short code like 'G@2$x' is easily cracked in seconds due to low character count. A phrase like 'apple-river-guitar-castle' is 25+ characters long, creating a massive search space that takes millions of years to solve, yet it is easy for you to remember."
  },
  {
    q: "Do I ever need to enter my UPI PIN to receive money?",
    a: "Absolutely NOT. Entering your UPI PIN is strictly for approving outgoing transfers from your account. If anyone asks you to scan a QR code or enter a PIN to receive a refund or credit, it is always a scam."
  },
  {
    q: "How can I spot lookalike email domains?",
    a: "Double-check the sender's actual address details character-by-character. Look for typos or character swaps, such as support@paypaI.com (using a capital 'I' instead of 'l') or billing@netflix-support-update.com instead of Netflix's official website."
  }
];

const GLOSSARY = [
  { term: "Stealing Login Details (Phishing)", desc: "Fake emails, texts, or calls pretending to represent verified businesses to trick you into sharing passwords or card digits." },
  { term: "Spoofing (Lookalike Domain)", desc: "Tricking victims by purchasing a web address with a spelling that is very close to a famous website (e.g. micros0ft.com)." },
  { term: "Second-Step Lock (MFA/2FA)", desc: "An extra layer of defense that requires entering a code from your phone or app after typing your password to verify your login." },
  { term: "Passphrase", desc: "A secure type of password made by joining 4 or more random, simple words together, creating a long string that is easy to remember." },
  { term: "Sideloading", desc: "Installing phone applications from unverified web links or forums instead of the official Google Play or Apple App Store, bypassing safety scans." }
];

export default function SupportPage() {
  const { showToast } = useToast();
  
  // FAQs accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Form states
  const [activeForm, setActiveForm] = useState<"feedback" | "problem" | "lesson">("feedback");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !email) {
      showToast("Please fill out the required fields.", "warning");
      return;
    }

    setSubmitted(true);
    setSupportCompleted(true); // Award support exploration point
    showToast("Feedback submitted successfully! +5 Safety Points earned.", "success");

    // Reset Form
    setEmail("");
    setMessage("");
    setTitle("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  useEffect(() => {
    // Automatically trigger completion point when viewing support portal
    setSupportCompleted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-white">Resources & Helplines</h1>
        <p className="text-on-surface-variant text-sm mt-1 font-inter">
          Find emergency helpline numbers, official government resources, study our glossary, or request a new lesson.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8/12): FAQs, Glossary, Helplines */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* FAQs Accordion */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      className="w-full text-left p-4 flex justify-between items-center cursor-pointer focus:outline-none"
                    >
                      <span className="text-white text-xs font-bold font-inter pr-4">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-black/25 border-t border-white/5 p-4 text-[12px] text-on-surface-variant font-inter leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Glossary */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Plain-Language Safety Glossary
            </h2>

            <Panel title="Jargon-Free Explanations" idTag="GLOSSARY" noHoverAnim={true}>
              <div className="space-y-4 py-2 font-inter text-xs">
                {GLOSSARY.map((item, idx) => (
                  <div key={idx} className="space-y-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold text-white block">{item.term}</span>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Trusted External Resources */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Government & Learning Resources
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col justify-between space-y-3 hover:border-cyan-400/25 transition-all"
              >
                <div className="space-y-1 text-xs">
                  <h3 className="font-outfit font-bold text-white text-sm">National Cybercrime Portal</h3>
                  <p className="text-on-surface-variant text-[11.5px] leading-relaxed">
                    Official Indian portal to file formal complaints about financial fraud, identity theft, or profile hijackings.
                  </p>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                  <span>Visit website</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>

              <a
                href="https://www.sancharsaathi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col justify-between space-y-3 hover:border-cyan-400/25 transition-all"
              >
                <div className="space-y-1 text-xs">
                  <h3 className="font-outfit font-bold text-white text-sm">Sanchar Saathi Portal</h3>
                  <p className="text-on-surface-variant text-[11.5px] leading-relaxed">
                    Audit phone connections registered under your ID name, block lost/stolen mobile phones, or verify device IMEI statuses.
                  </p>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                  <span>Visit website</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column (4/12): Emergency Helplines & Contact Form */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Emergency Helplines */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Emergency Contact Desk
            </h2>

            <div className="border border-red-500/20 bg-red-950/5 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <PhoneCall className="w-4 h-4" />
                <span>IMMEDIATE HELPLINES</span>
              </div>
              
              <div className="space-y-3.5 font-inter text-xs text-white">
                <div className="border-b border-white/5 pb-2.5">
                  <span className="text-white/40 block text-[9px] font-mono">FINANCIAL CYBER FRAUD (INDIA):</span>
                  <span className="text-sm font-bold block mt-0.5">1930</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Dial immediately to request bank account freezes.</p>
                </div>
                <div className="pb-1">
                  <span className="text-white/40 block text-[9px] font-mono">GENERAL POLICE HELPLINE:</span>
                  <span className="text-sm font-bold block mt-0.5">112</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Universal help number across Indian states.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Submit Request / Feedback
            </h2>

            <Panel title="Educational Request Desk" idTag="CONTACT" noHoverAnim={true} topBorderColor="cyan">
              <div className="space-y-4 py-1 text-xs font-inter">
                
                {/* Form Type Tab */}
                <div className="flex gap-2 border-b border-white/5 pb-2.5 text-[10px] font-mono">
                  <button 
                    onClick={() => { setActiveForm("feedback"); setSubmitted(false); }}
                    className={`flex-1 py-1 rounded transition-colors cursor-pointer ${activeForm === "feedback" ? "bg-cyan-950/20 border border-cyan-400/20 text-cyan-400 font-bold" : "text-white/40"}`}
                  >
                    FEEDBACK
                  </button>
                  <button 
                    onClick={() => { setActiveForm("lesson"); setSubmitted(false); }}
                    className={`flex-1 py-1 rounded transition-colors cursor-pointer ${activeForm === "lesson" ? "bg-cyan-950/20 border border-cyan-400/20 text-cyan-400 font-bold" : "text-white/40"}`}
                  >
                    LESSON
                  </button>
                  <button 
                    onClick={() => { setActiveForm("problem"); setSubmitted(false); }}
                    className={`flex-1 py-1 rounded transition-colors cursor-pointer ${activeForm === "problem" ? "bg-cyan-950/20 border border-cyan-400/20 text-cyan-400 font-bold" : "text-white/40"}`}
                  >
                    PROBLEM
                  </button>
                </div>

                {submitted ? (
                  <div className="text-center py-6 text-emerald-400 font-bold space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto animate-bounce" />
                    <p className="text-[11px] font-mono uppercase tracking-wide">Request Submitted successfully!</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-white font-bold block text-[10px]">Email Address:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full bg-cyber-bg border border-white/10 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                        required
                      />
                    </div>

                    {activeForm === "lesson" && (
                      <div className="space-y-1">
                        <label className="text-white font-bold block text-[10px]">Requested Lesson Title:</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Simulating malware in downloads"
                          className="w-full bg-cyber-bg border border-white/10 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-white font-bold block text-[10px]">
                        {activeForm === "feedback" ? "Feedback Notes:" : activeForm === "lesson" ? "Details to cover:" : "Describe the bug:"}
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your request..."
                        className="w-full bg-cyber-bg border border-white/10 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
                        required
                      />
                    </div>

                    <Button variant="action" type="submit" className="w-full mt-2" icon={<Send className="w-3.5 h-3.5" />}>
                      Send Request
                    </Button>
                  </form>
                )}

              </div>
            </Panel>
          </div>

        </div>

      </div>
    </div>
  );
}
