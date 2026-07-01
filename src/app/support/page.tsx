"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Mail,
  Send,
  Info,
  ArrowRight,
  Book,
  Link2,
  CheckSquare,
  Square,
  Terminal,
  Key,
  Globe,
  Smartphone,
  EyeOff,
  BookOpen,
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { setSupportCompleted, getSupportCompleted } from "@/components/ProgressTracker";

interface FAQItem {
  q: string;
  a: string;
  category: "passwords" | "browsing" | "phones" | "email" | "privacy";
}

interface GlossaryItem {
  term: string;
  definition: string;
  example: string;
  tip: string;
}

interface ResourceItem {
  name: string;
  desc: string;
  url: string;
  type: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  beginnerBadge: boolean;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "I clicked a suspicious link. What should I do?",
    a: "Do not type any passwords or card details on the page. Close the browser immediately. If you entered a password, change it on the official website right away. Run a scan with your antivirus software to check for downloaded threats.",
    category: "browsing",
  },
  {
    q: "My password was leaked. What now?",
    a: "Go to the website that leaked your password and change it to a strong passphrase. If you reused that password on other accounts, change them there too. Turn on two-factor authentication (2FA) for extra protection.",
    category: "passwords",
  },
  {
    q: "How can I create a strong password?",
    a: "Combine 4 or 5 random dictionary words (e.g. 'correct-horse-battery-staple'). It is extremely hard for computer guessing scripts to crack, but very easy for you to remember.",
    category: "passwords",
  },
  {
    q: "What is two-factor authentication?",
    a: "Two-Factor Authentication (2FA) is an extra security lock (like a code sent to your phone or authenticator app) required after typing your password. It stops attackers even if they steal your password.",
    category: "phones",
  },
  {
    q: "How do I know if an email is fake?",
    a: "Check the sender's actual email domain address (e.g., support@paypaI.com using a capital 'I' instead of 'l'). Be suspicious of high-pressure warnings demanding immediate action, and check links before clicking.",
    category: "email",
  },
];

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Phishing",
    definition: "Fake emails or texts designed to trick you into typing your password or credit card details.",
    example: "A text claiming your package is delayed, asking you to pay a fee via a link.",
    tip: "Never click links in urgent messages. Go directly to the official website.",
  },
  {
    term: "2FA (Two-Factor Authentication)",
    definition: "An extra security step (like a phone code) required after typing your password.",
    example: "Entering your password on Google, followed by entering a 6-digit code from your phone's authenticator app.",
    tip: "Use authenticator apps (like Google Authenticator) instead of SMS codes for better security.",
  },
  {
    term: "Guessing Attack (Brute-Force)",
    definition: "When a computer script tries millions of password combinations a second to guess yours.",
    example: "A hacker computer guessing common password words on an account.",
    tip: "Choose long passphrases (15+ letters). Length makes guessing mathematically impossible.",
  },
  {
    term: "Malicious Software (Malware)",
    definition: "Software built to damage or access your computer without your permission.",
    example: "Downloading a sketchy game installer that locks your computer files.",
    tip: "Keep backups of your important documents in the cloud or on an external drive.",
  },
  {
    term: "HTTPS Connection",
    definition: "A secure connection that encrypts your web traffic so others cannot spy on it.",
    example: "Browsing a store where the URL starts with https:// and has a lock icon.",
    tip: "Always look for the lock icon before entering personal info.",
  },
  {
    term: "Tracking Cookies",
    definition: "Tiny files websites save in your browser to track what you look at and show you ads.",
    example: "Looking at a backpack on an online store, then seeing backpack ads on other sites.",
    tip: "Block third-party cookies in your browser settings to stop ad profiling.",
  },
];

const RESOURCE_ITEMS: ResourceItem[] = [
  {
    name: "Google Security Checkup",
    desc: "A quick tool by Google to review connected devices, secure logins, and app permissions.",
    url: "https://myaccount.google.com/security-checkup",
    type: "Account Audit",
    difficulty: "Beginner",
    readTime: "2 min check",
    beginnerBadge: true,
  },
  {
    name: "Have I Been Pwned?",
    desc: "Check if your email address or phone number has been compromised in past company data breaches.",
    url: "https://haveibeenpwned.com",
    type: "Data Leak Check",
    difficulty: "Beginner",
    readTime: "2 min check",
    beginnerBadge: true,
  },
  {
    name: "Cyber Swachhta Kendra",
    desc: "An initiative by the Indian Government to scan devices and clean computer virus infections.",
    url: "https://www.csk.gov.in",
    type: "Government Safety",
    difficulty: "Beginner",
    readTime: "5 min read",
    beginnerBadge: true,
  },
  {
    name: "CERT-In Safety Advisories",
    desc: "Official alerts on active digital threats and safety steps by the Indian Computer Emergency Response Team.",
    url: "https://www.cert-in.org.in",
    type: "Threat Alerts",
    difficulty: "Intermediate",
    readTime: "5 min read",
    beginnerBadge: false,
  },
  {
    name: "Google Password Manager",
    desc: "A secure built-in tool to generate, remember, and safely fill passwords on your accounts.",
    url: "https://passwords.google.com",
    type: "Password Tool",
    difficulty: "Beginner",
    readTime: "2 min setup",
    beginnerBadge: true,
  },
];

const SUPPORT_CHECKLIST = [
  { id: "mfa", text: "Enabled 2FA on my primary email account." },
  { id: "updates", text: "Updated browser and operating system to the latest version." },
  { id: "manager", text: "Installed a trusted password manager." },
  { id: "lock", text: "Enabled a secure lock screen PIN or password on my phone." },
  { id: "backup", text: "Completed a secure backup of my important documents." },
  { id: "privacy", text: "Reviewed and restricted social media privacy settings." },
];

export default function SupportPage() {
  const { showToast } = useToast();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  // Safety Checklist state
  const [checklistSelections, setChecklistSelections] = useState<string[]>([]);
  const [checklistFinished, setChecklistFinished] = useState(false);

  // Form states
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formType, setFormType] = useState<"contact" | "feedback" | "issue">("contact");

  // Sync checklist state on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("safesteps_support_checklist");
      if (saved) {
        const parsed = JSON.parse(saved);
        setChecklistSelections(parsed);
        if (parsed.length === SUPPORT_CHECKLIST.length) {
          setChecklistFinished(true);
        }
      }
    }
  }, []);

  const handleToggleChecklist = (id: string) => {
    let updated = [];
    if (checklistSelections.includes(id)) {
      updated = checklistSelections.filter((item) => item !== id);
    } else {
      updated = [...checklistSelections, id];
    }
    
    setChecklistSelections(updated);
    localStorage.setItem("safesteps_support_checklist", JSON.stringify(updated));

    if (updated.length === SUPPORT_CHECKLIST.length) {
      setChecklistFinished(true);
      setSupportCompleted(true);
      showToast("Security Checklist Completed! Safety score boosted.", "success");
    } else {
      setChecklistFinished(false);
      setSupportCompleted(false);
      showToast("Safety checklist updated.", "info");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name || !formValues.email || !formValues.subject || !formValues.description) {
      showToast("Please fill in all support fields", "warning");
      return;
    }

    setIsSubmitting(true);
    setSubmitLogs([]);
    
    const logs = [
      "Submitting your question to student moderators...",
      "Analyzing details for routing...",
      "Sending request...",
      "Question received! We will reply to your student email shortly."
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setSubmitLogs((prev) => [...prev, log]);
        if (idx === logs.length - 1) {
          setIsSubmitting(false);
          setFormSubmitted(true);
          showToast("Support inquiry sent successfully!", "success");
        }
      }, (idx + 1) * 600);
    });
  };

  const resetForm = () => {
    setFormValues({ name: "", email: "", subject: "", description: "" });
    setFormType("contact");
    setFormSubmitted(false);
    setSubmitLogs([]);
  };

  // Helper to render FAQ category icon
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case "passwords":
        return <Key className="w-4 h-4 text-cyan-400" />;
      case "browsing":
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case "phones":
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case "email":
        return <Mail className="w-4 h-4 text-cyan-400" />;
      case "privacy":
        return <EyeOff className="w-4 h-4 text-cyan-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Need Help Understanding Digital Safety?
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base font-inter leading-relaxed max-w-2xl">
          Let's make digital safety easier to understand. Browse answers to common questions, explore key definitions, or ask a question directly to clarify your doubts.
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: FAQ & Glossary (7 / 12) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* FAQs */}
          <Panel title="Frequently Asked Questions" icon={<HelpCircle className="w-4 h-4 text-cyan-400" />} idTag="FAQs" topBorderColor="cyan">
            <div className="space-y-3 pt-1">
              {FAQ_ITEMS.map((item, idx) => {
                const isExpanded = expandedFAQ === idx;
                return (
                  <div
                    key={idx}
                    className="border border-white/5 bg-cyber-bg/40 rounded-[6px] overflow-hidden transition-all hover:border-cyan-400/20"
                  >
                    <button
                      onClick={() => setExpandedFAQ(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-outfit font-semibold text-sm text-white focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {renderCategoryIcon(item.category)}
                        <span>{item.q}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-on-surface-variant transition-transform ${
                          isExpanded ? "transform rotate-180 text-cyan-400" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="border-t border-white/5 bg-black/20"
                        >
                          <p className="p-4 text-xs text-on-surface-variant font-inter leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Glossary */}
          <Panel title="Cybersecurity Glossary" icon={<Book className="w-4 h-4 text-cyan-400" />} idTag="Glossary">
            <div className="grid grid-cols-1 gap-4 pt-1">
              {GLOSSARY_ITEMS.map((item, idx) => (
                <div 
                  key={idx} 
                  className="border border-white/5 bg-cyber-bg/30 p-4 rounded-[6px] space-y-3 hover:border-cyan-400/25 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:shadow-[0_0_15px_rgba(34,211,238,0.04)]"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 block uppercase tracking-wider">
                      {item.term}
                    </span>
                    <span className="text-[9px] text-on-surface-variant font-mono uppercase bg-white/5 px-2 py-0.5 rounded-[2px]">Definition Card</span>
                  </div>
                  
                  <div className="space-y-2.5 font-inter text-xs text-on-surface-variant">
                    <p className="leading-relaxed text-white">
                      <span className="font-mono text-[9px] text-cyan-400/70 font-semibold block uppercase">Concept Definition:</span>
                      {item.definition}
                    </p>
                    <p className="leading-relaxed bg-black/30 p-2.5 rounded-[4px] border border-white/5 text-[11px]">
                      <span className="font-mono text-[9px] text-amber-400 font-semibold block uppercase mb-0.5">Real-World Example:</span>
                      {item.example}
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      <span className="font-mono text-[9px] text-emerald-400 font-semibold block uppercase">Security Action Tip:</span>
                      {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

        </div>

        {/* Right Column: Contact Form, Checklist, & Resources (5 / 12) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Interactive Checklist */}
          <Panel title="Digital Safety Checklist" idTag="Self Audit" topBorderColor="cyan">
            <div className="space-y-4 pt-1">
              <span className="font-mono text-[9px] text-on-surface-variant block uppercase tracking-wider">
                Check off tasks to boost safety profile by 5%:
              </span>

              <div className="space-y-2.5 font-mono text-[11px]">
                {SUPPORT_CHECKLIST.map((item) => {
                  const isChecked = checklistSelections.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-3 border rounded-[4px] transition-all cursor-pointer flex items-center gap-3 ${
                        isChecked
                          ? "border-emerald-500/30 bg-emerald-950/5 text-emerald-400"
                          : "border-white/5 bg-white/5 text-on-surface-variant hover:text-white"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-white/20 flex-shrink-0" />
                      )}
                      <span className="font-inter text-xs leading-relaxed">{item.text}</span>
                    </motion.button>
                  );
                })}
              </div>

              {checklistFinished && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/5 border border-emerald-500/25 p-3 rounded-[4px] flex items-center gap-2 mt-4"
                >
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                    CHECKLIST AUDIT SECURED (+5%)
                  </span>
                </motion.div>
              )}
            </div>
          </Panel>

          {/* Recommended Resources */}
          <Panel title="Recommended Tools & Resources" idTag="Resources">
            <div className="space-y-3 pt-1">
              {RESOURCE_ITEMS.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/5 bg-cyber-bg/40 p-3.5 rounded-[6px] flex justify-between items-start gap-4 hover:border-cyan-400/20 group transition-all"
                >
                  <div className="space-y-2.5 font-inter">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-outfit font-semibold text-white text-xs group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </span>
                      {item.beginnerBadge && (
                        <span className="font-mono text-[8px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-1 py-0.2 rounded-[2px] font-bold">
                          Beginner
                        </span>
                      )}
                      <span className="font-mono text-[8px] text-on-surface-variant bg-white/5 px-1 py-0.5 border border-white/10 rounded-[2px]">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 font-mono text-[9px] text-on-surface-variant/80">
                      <span>Difficulty: <strong className="text-cyan-400">{item.difficulty}</strong></span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                  <Link2 className="w-3.5 h-3.5 text-white/25 group-hover:text-cyan-400 flex-shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </Panel>

          {/* Ask a Question Form */}
          <Panel title="Ask a Question" icon={<Mail className="w-4 h-4 text-cyan-400" />} idTag="Ask a Question">
            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
                
                {/* Inquiry Type Selector */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Question Type
                  </label>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setFormType("contact")}
                      className={`py-1.5 border rounded-[4px] font-semibold text-center cursor-pointer transition-all ${
                        formType === "contact"
                          ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                          : "border-white/5 text-on-surface-variant hover:text-white"
                      }`}
                      disabled={isSubmitting}
                    >
                      Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("feedback")}
                      className={`py-1.5 border rounded-[4px] font-semibold text-center cursor-pointer transition-all ${
                        formType === "feedback"
                          ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                          : "border-white/5 text-on-surface-variant hover:text-white"
                      }`}
                      disabled={isSubmitting}
                    >
                      Feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("issue")}
                      className={`py-1.5 border rounded-[4px] font-semibold text-center cursor-pointer transition-all ${
                        formType === "issue"
                          ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                          : "border-white/5 text-on-surface-variant hover:text-white"
                      }`}
                      disabled={isSubmitting}
                    >
                      Report Bug
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] px-3 py-2 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formValues.email}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    placeholder="Enter your student email"
                    className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] px-3 py-2 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.subject}
                    onChange={(e) => setFormValues({ ...formValues, subject: e.target.value })}
                    placeholder={
                      formType === "contact"
                        ? "e.g. Doubts about passphrase selection"
                        : formType === "feedback"
                        ? "e.g. Suggestion for wifi lesson"
                        : "e.g. Typo in Mobile Security"
                    }
                    className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] px-3 py-2 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    {formType === "contact"
                      ? "Describe your Question or Doubt"
                      : formType === "feedback"
                      ? "Feedback Details"
                      : "Describe the Issue"}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    placeholder={
                      formType === "contact"
                        ? "Type your question here in detail. What digital safety topic can we help clarify?"
                        : formType === "feedback"
                        ? "What did you learn, and how can we make this project better?"
                        : "Describe the platform bug or content error..."
                    }
                    className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.15)] px-3 py-2 rounded-[6px] text-white text-xs placeholder-white/25 outline-none transition-all resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit / Loading Logs */}
                <div className="pt-1.5 space-y-3">
                  <AnimatePresence>
                     {isSubmitting && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/50 border border-cyan-400/20 p-3 rounded-[6px] font-mono text-[9px] text-cyan-300 space-y-1 max-h-[120px] overflow-y-auto"
                      >
                        <div className="flex items-center gap-1.5 font-bold animate-pulse text-cyan-400 mb-1">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>TRANSMISSION ACTIVE:</span>
                        </div>
                        {submitLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    variant="action"
                    className="w-full py-2.5 font-bold group"
                    disabled={isSubmitting}
                    icon={<Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                  >
                    {isSubmitting ? "Sending..." : "Send Question →"}
                  </Button>
                </div>

              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 rounded-full mx-auto animate-bounce">
                  <CheckCircle className="w-5 h-5" />
                </div>
                
                <div>
                  <h4 className="font-outfit font-bold text-white text-base">
                    Thanks for your submission!
                  </h4>
                  <p className="text-[12px] text-cyan-400 font-mono mt-1 uppercase tracking-wider font-bold">
                    Your question has been received.
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-inter leading-relaxed max-w-xs mx-auto mt-2">
                    Our student moderators will review your question and respond to your student email inbox soon.
                  </p>
                </div>

                <div className="pt-4 max-w-xs mx-auto">
                  <Button variant="technical" className="w-full py-1.5" onClick={resetForm}>
                    Send Another Question
                  </Button>
                </div>
              </div>
            )}
          </Panel>

        </div>

      </div>

      {/* Bottom CTA redirection section */}
      <div className="border-t border-white/5 pt-8 text-center space-y-3">
        <p className="text-on-surface-variant font-inter text-sm">
          Didn't find what you were looking for?
        </p>
        <Link href="/learning-hub" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-wider group transition-all">
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
