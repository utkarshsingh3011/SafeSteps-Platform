"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Key,
  Search,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  RefreshCw,
  Clock,
  Award,
  Lock,
  Zap,
  Flame,
  Activity,
  FileText,
  LockKeyhole,
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import {
  getCompletedChecks,
  getCompletedLessons,
  calculateSafetyScore,
} from "@/components/ProgressTracker";

const CYBER_TIPS = [
  "Verify the sender's actual email address before clicking any links.",
  "Never share a One-Time Password (OTP) with anyone, especially on WhatsApp.",
  "Avoid scanning random QR codes sent by buyers to receive money.",
  "Use a unique passphrase for every account, stored in a password manager.",
  "Keep your browser updated to patch security vulnerabilities.",
  "Public Wi-Fi networks can be snooped. Use a VPN and disable sharing.",
  "Verify website domains character-by-character to avoid typosquatting.",
  "Review and disable unnecessary app permissions like location and files."
];

const SCAM_ALERTS = [
  {
    title: "Fake UPI Payment Screenshots",
    category: "Payment Safety",
    desc: "Scammers show mock screenshots of successful UPI transactions to trick merchants.",
    lesson: "Always verify account balances via your official banking app; do not rely on images shown by buyers.",
  },
  {
    title: "SMS Parcel Delivery Update Trap",
    category: "Identity Protection",
    desc: "A text message claiming a package is on hold until a tiny custom fee ($1.50) is paid via a link.",
    lesson: "Post offices do not charge address update fees via SMS. Inspect the link domain carefully.",
  },
  {
    title: "QR Code Scan Request for Payments",
    category: "Financial Defense",
    desc: "Scammers send a QR code claiming it will transfer money into your account.",
    lesson: "Scanning QR codes is strictly for sending money. You never need to scan to receive funds.",
  },
  {
    title: "WhatsApp OTP Hijack Request",
    category: "Social Trust",
    desc: "A contact's hacked profile messages you asking for a code sent to your phone by mistake.",
    lesson: "Never share SMS codes/OTPs with anyone. Call the contact directly to verify their message.",
  },
];

const ACHIEVEMENTS_DATA = [
  { id: "first-login", title: "First Login", icon: <Zap className="w-5 h-5" /> },
  { id: "digital-explorer", title: "Digital Explorer", icon: <Award className="w-5 h-5" /> },
  { id: "password-defender", title: "Password Defender", icon: <Key className="w-5 h-5" /> },
  { id: "scam-spotter", title: "Scam Spotter", icon: <Search className="w-5 h-5" /> },
  { id: "safe-browser", title: "Safe Browser", icon: <Shield className="w-5 h-5" /> },
  { id: "privacy-protector", title: "Privacy Protector", icon: <EyeOff className="w-5 h-5" /> },
  { id: "digital-learner", title: "Digital Learner", icon: <Award className="w-5 h-5" /> },
  { id: "safety-champion", title: "Safety Champion", icon: <Award className="w-5 h-5" /> },
];

export default function Home() {
  const { showToast } = useToast();
  const { user, isGuest } = useAuth();
  
  // Progress states
  const [completedChecks, setCompletedChecks] = useState({
    password: false,
    scam: false,
    privacy: false,
    browser: false,
  });
  const [lessonCount, setLessonCount] = useState(0);
  const [safetyScore, setSafetyScore] = useState(20);
  const [animatedScore, setAnimatedScore] = useState(20);
  const [tipIndex, setTipIndex] = useState(0);
  const [expandedScam, setExpandedScam] = useState<number | null>(null);
  const [greeting, setGreeting] = useState("Good morning");
  const [userAchievements, setUserAchievements] = useState<string[]>([]);

  // Sync state on progress change
  useEffect(() => {
    const updateStates = () => {
      const checks = getCompletedChecks();
      setCompletedChecks(checks);

      const lessons = getCompletedLessons();
      const completedLessons = Object.values(lessons).filter(Boolean).length;
      setLessonCount(completedLessons);

      const score = calculateSafetyScore();
      setSafetyScore(score);

      const savedAchievements = JSON.parse(localStorage.getItem("safesteps_achievements") || "[]");
      setUserAchievements(savedAchievements);
    };

    updateStates();
    window.addEventListener("safesteps_progress_changed", updateStates);
    return () => {
      window.removeEventListener("safesteps_progress_changed", updateStates);
    };
  }, []);

  // Dynamic dashboard calculations
  const completedCount = Object.values(completedChecks).filter(Boolean).length;
  const timeSpent = 1 + (completedCount * 3) + (lessonCount * 2);
  const streak = user ? user.streak : 1;

  // Animate dynamic safety score circular counter
  useEffect(() => {
    let start = animatedScore;
    const end = safetyScore;
    if (start === end) return;
    
    const duration = 800; // ms
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));
    
    const timer = setInterval(() => {
      start += increment;
      setAnimatedScore(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 8));

    return () => clearInterval(timer);
  }, [safetyScore]);

  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [animatedTime, setAnimatedTime] = useState(0);

  useEffect(() => {
    let streakStart = 0;
    const streakTimer = setInterval(() => {
      if (streakStart < streak) {
        streakStart += 1;
        setAnimatedStreak(streakStart);
      } else {
        clearInterval(streakTimer);
      }
    }, 120);

    let compStart = 0;
    const compTimer = setInterval(() => {
      if (compStart < completedCount) {
        compStart += 1;
        setAnimatedCompleted(compStart);
      } else {
        clearInterval(compTimer);
      }
    }, 120);

    let timeStart = 0;
    const timeTimer = setInterval(() => {
      if (timeStart < timeSpent) {
        timeStart += Math.max(1, Math.ceil(timeSpent / 8));
        if (timeStart >= timeSpent) {
          timeStart = timeSpent;
        }
        setAnimatedTime(timeStart);
      } else {
        clearInterval(timeTimer);
      }
    }, 60);

    return () => {
      clearInterval(streakTimer);
      clearInterval(compTimer);
      clearInterval(timeTimer);
    };
  }, [streak, completedCount, timeSpent]);

  // Dynamic greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Rotate safety tip
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CYBER_TIPS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % CYBER_TIPS.length);
    showToast("Rotated to next safety tip", "info");
  };

  const handleCopyTip = () => {
    navigator.clipboard.writeText(CYBER_TIPS[tipIndex]);
    showToast("Tip copied to clipboard!", "success");
  };

  // Determine last completed module
  let lastCompleted = "None yet";
  if (completedChecks.browser) lastCompleted = "Browser Checkup";
  else if (completedChecks.privacy) lastCompleted = "Privacy Review";
  else if (completedChecks.scam) lastCompleted = "Spot the Scam";
  else if (completedChecks.password) lastCompleted = "Password Analyzer";

  // Determine path of next module to learn (Continue Learning logic)
  let nextLearningPath = "/safety-checks?tool=password";
  let nextLearningLabel = "Start Password Analyzer";
  if (completedChecks.password && !completedChecks.scam) {
    nextLearningPath = "/safety-checks?tool=scam";
    nextLearningLabel = "Continue with Spot the Scam";
  } else if (completedChecks.password && completedChecks.scam && !completedChecks.privacy) {
    nextLearningPath = "/safety-checks?tool=privacy";
    nextLearningLabel = "Start Privacy Settings Review";
  } else if (completedChecks.password && completedChecks.scam && completedChecks.privacy && !completedChecks.browser) {
    nextLearningPath = "/safety-checks?tool=browser";
    nextLearningLabel = "Finish with Browser Checkup";
  } else if (completedCount === 4) {
    nextLearningPath = "/certificate";
    nextLearningLabel = "Collect Graduate Certificate";
  }

  // Lock status check for safety modules (stepping stones dependency)
  const isScamLocked = !completedChecks.password;
  const isPrivacyLocked = !completedChecks.password || !completedChecks.scam;
  const isBrowserLocked = !completedChecks.password || !completedChecks.scam || !completedChecks.privacy;

  const getBadgeDetails = (id: string) => {
    let unlocked = false;
    let desc = "";
    let whyEarned = "";
    let nextStep = "";
    
    switch (id) {
      case "first-login":
        unlocked = true;
        desc = "Welcome to SafeSteps!";
        whyEarned = "Unlocked on first visit.";
        break;
      case "digital-explorer":
        unlocked = lessonCount >= 1;
        desc = "Study digital safety basics.";
        whyEarned = "Completed first hub lesson.";
        nextStep = "Study 1 lesson in Learning Hub.";
        break;
      case "password-defender":
        unlocked = completedChecks.password;
        desc = "Pass Password Checkup.";
        whyEarned = "Secured your credentials.";
        nextStep = "Finish Password Checkup.";
        break;
      case "scam-spotter":
        unlocked = completedChecks.scam;
        desc = "Complete Scam Game.";
        whyEarned = "Spotted all email tricks.";
        nextStep = "Finish Scam Simulation.";
        break;
      case "safe-browser":
        unlocked = completedChecks.browser;
        desc = "Complete Browser Check.";
        whyEarned = "Secured browser settings.";
        nextStep = "Finish Browser Checkup.";
        break;
      case "privacy-protector":
        unlocked = completedChecks.privacy;
        desc = "Complete Privacy Review.";
        whyEarned = "Reviewed account permissions.";
        nextStep = "Finish Privacy Quiz.";
        break;
      case "digital-learner":
        unlocked = lessonCount >= 5;
        desc = "Study 5 hub lessons.";
        whyEarned = "Completed 5 lessons.";
        nextStep = `Study 5 lessons (${lessonCount}/5 completed).`;
        break;
      case "safety-champion":
        const checksDone = completedChecks.password && completedChecks.scam && completedChecks.privacy && completedChecks.browser;
        unlocked = checksDone && lessonCount >= 10;
        desc = "Master all digital safety.";
        whyEarned = "Completed 10 lessons & 4 checkups.";
        nextStep = "Finish all 10 lessons and 4 checkups.";
        break;
    }
    
    return { unlocked, desc, whyEarned, nextStep };
  };

  // Framer Motion staggered animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
  } as const;

  const progressVariants = {
    hidden: { width: 0 },
    visible: { width: `${(lessonCount / 10) * 100}%`, transition: { duration: 0.8, ease: "easeOut" as const } },
  } as const;

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* Welcome Hero / User Profile Banner */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10"
      >
        <div className="space-y-5 max-w-xl">
          <motion.h1 variants={itemVariants} className="font-outfit text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {user ? `${greeting}, ${user.name} 👋` : `Build confidence in your digital safety.`}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-emerald-400 font-medium text-[16px] tracking-wide">
            Let's take a simple step toward a safer digital life today.
          </motion.p>
          <motion.p variants={itemVariants} className="text-on-surface-variant text-sm md:text-base font-inter leading-relaxed">
            SafeSteps is your friendly, jargon-free guide to staying safe online. Through quick, interactive games and simple checkups, you’ll learn how to protect yourself and your family from common online threats.
          </motion.p>
          
          <motion.div variants={itemVariants} className="pt-2 flex flex-wrap gap-3">
            <Link href={nextLearningPath}>
              <Button variant="friendly" icon={<ArrowRight className="w-4 h-4" />}>
                {nextLearningLabel}
              </Button>
            </Link>
            <Link href="/learning-hub">
              <Button variant="friendly-outline">
                Study Curriculum
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Flat SVG Illustration + Today's Goal Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Friendly SVG Illustration */}
          <div className="relative p-2 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 rounded-2xl shadow-md overflow-hidden group flex items-center justify-center">
            <svg className="w-40 h-40 text-white" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#glow)" />
              
              {/* Stepping Stones Path */}
              <rect x="40" y="140" width="35" height="12" rx="6" fill="#3b82f6" fillOpacity="0.4" />
              <rect x="75" y="115" width="40" height="14" rx="7" fill="#60a5fa" fillOpacity="0.6" />
              <rect x="110" y="90" width="45" height="16" rx="8" fill="#93c5fd" fillOpacity="0.8" />
              
              {/* Path Line */}
              <path d="M57 140 Q95 115 132 90" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />

              {/* Friendly Shield at the Top */}
              <g transform="translate(115, 30)">
                <path d="M20 0 L40 5 V20 C40 32 32 40 20 44 C8 40 0 32 0 20 V5 Z" fill="url(#shieldGrad)" />
                <path d="M12 22 L17 27 L28 16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Foliage / Leaves representing organic safety */}
              <path d="M25 160 C25 130 50 135 55 160 C50 160 30 160 25 160 Z" fill="url(#leafGrad)" fillOpacity="0.75" />
              <path d="M175 140 C165 115 145 125 145 145 C150 145 170 145 175 140 Z" fill="url(#leafGrad)" fillOpacity="0.6" />
              <path d="M165 165 C160 145 145 150 145 165 C150 165 160 165 165 165 Z" fill="url(#leafGrad)" fillOpacity="0.8" />
            </svg>
          </div>

          {/* Your Next Step Widget Card */}
          <div className="border border-white/10 bg-gradient-to-br from-indigo-950/20 to-blue-950/20 p-5 rounded-2xl w-full sm:w-[240px] h-[190px] flex flex-col justify-between space-y-2 hover:border-blue-500/30 transition-all duration-300 shadow-md">
            <div>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span>Your Next Step</span>
              </div>
              <span className="text-white font-outfit text-sm font-bold block mt-2">
                {completedCount === 0 ? "Start Password Checkup" :
                 completedCount === 1 ? "Spot the Scam Game" :
                 completedCount === 2 ? "Privacy Settings Review" :
                 completedCount === 3 ? "Browser Safety Checkup" : "Get Certified!"}
              </span>
              <p className="text-on-surface-variant font-inter text-[11px] leading-relaxed mt-1">
                {completedCount === 0 ? "A quick, friendly check to see how secure your passwords are." :
                 completedCount === 1 ? "Play a game to spot tricky phishing emails in a safe inbox." :
                 completedCount === 2 ? "Learn how to manage what apps share about you." :
                 completedCount === 3 ? "Configure your browser to block trackers and ads." : "Collect your certificate and celebrate your progress!"}
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-on-surface-variant">
              <span>ESTIMATED TIME</span>
              <span className="text-white font-bold">{completedCount === 4 ? "Done! 🎉" : "~5 mins"}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dynamic User Statistics Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {/* Stat 1: Safety Score */}
        <motion.div variants={itemVariants} className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-inter text-on-surface-variant font-semibold tracking-wide uppercase">Safety Score</span>
            </div>
            <div className="font-outfit text-3xl font-extrabold text-white mt-2">{animatedScore}%</div>
          </div>
          <span className="text-[10px] text-emerald-400/90 mt-2 font-inter font-medium">
            {animatedScore === 20 ? "Ready to grow!" : animatedScore >= 80 ? "Highly secure! 🎉" : "Getting stronger!"}
          </span>
        </motion.div>

        {/* Stat 2: Current Streak */}
        <motion.div variants={itemVariants} className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-2xl flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-inter text-on-surface-variant font-semibold tracking-wide uppercase">Days Learning</span>
            </div>
            <div className="font-outfit text-3xl font-extrabold text-white mt-2 flex items-center gap-1.5">
              <span>{animatedStreak} {animatedStreak === 1 ? "Day" : "Days"}</span>
            </div>
          </div>
          <span className="text-[10px] text-amber-400/90 mt-2 font-inter font-medium">Keep up the daily habit!</span>
        </motion.div>

        {/* Stat 3: Modules Completed */}
        <motion.div variants={itemVariants} className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500/20 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-inter text-on-surface-variant font-semibold tracking-wide uppercase">Checkups Done</span>
            </div>
            <div className="font-outfit text-3xl font-extrabold text-white mt-2">{animatedCompleted} / 4</div>
          </div>
          <span className="text-[10px] text-on-surface-variant mt-2 font-inter truncate">
            {lastCompleted === "None yet" ? "Start first activity" : `Last: ${lastCompleted}`}
          </span>
        </motion.div>

        {/* Stat 4: Time Spent Learning */}
        <motion.div variants={itemVariants} className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-inter text-on-surface-variant font-semibold tracking-wide uppercase">Time Invested</span>
            </div>
            <div className="font-outfit text-3xl font-extrabold text-white mt-2">{animatedTime} min</div>
          </div>
          <span className="text-[10px] text-indigo-400/90 mt-2 font-inter font-medium">Invested in your safety</span>
        </motion.div>
      </motion.div>

      {/* Main Grid: Left (8/12) and Right (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 / 12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Certificate Banner (Unlocked when 4/4 checks and 10 lessons are done) */}
          {completedCount === 4 && lessonCount >= 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-amber-400/30 bg-amber-950/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-400/30 rounded-full flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-outfit font-bold text-white text-lg">SafeSteps Certificate Unlocked!</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-inter">
                    Congratulations! You have successfully completed all 4 safety checks and studied all 10 curriculum lessons. Click the button to view and print your graduation certificate.
                  </p>
                </div>
              </div>
              <Link href="/certificate">
                <Button variant="friendly" className="w-full md:w-auto flex-shrink-0 bg-amber-400 text-black border-transparent">
                  Get Certificate
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Learning Progress & Roadmaps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <Panel className="w-full" noHoverAnim={true}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-2">
                
                {/* Circular safety score meter */}
                <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-8">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-emerald-400"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={263.8}
                        initial={{ strokeDashoffset: 263.8 }}
                        animate={{ strokeDashoffset: 263.8 - (263.8 * animatedScore) / 100 }}
                        transition={{ duration: 1 }}
                        style={{ filter: "drop-shadow(0px 0px 4px rgba(16, 185, 129, 0.25))" }}
                      />
                    </svg>
                    
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-outfit text-3.5xl font-bold text-white leading-none">{animatedScore}</span>
                      <span className="font-inter text-[12px] text-on-surface-variant font-medium mt-0.5">%</span>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h3 className="font-outfit font-bold text-[17px] text-white">Your Safety Level</h3>
                    <p className="text-on-surface-variant text-[12px] max-w-[200px] mt-1.5 font-inter leading-relaxed">
                      {safetyScore === 20
                        ? "Welcome! Start your first checkup to see your score grow."
                        : safetyScore >= 80
                        ? "Wonderful habits! Your digital safety level is highly secure."
                        : "Making great progress! Keep taking steps to strengthen your safety."}
                    </p>
                  </div>
                </div>

                {/* Learning Journey Overview */}
                <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4 md:pl-2">
                  <div>
                    <span className="font-inter text-[10px] font-bold text-emerald-400/90 tracking-widest uppercase">
                      My Safety Path
                    </span>
                    <h2 className="font-outfit text-2xl font-bold text-white mt-1 leading-snug">
                      Your Progress
                    </h2>
                    <p className="text-on-surface-variant text-xs font-inter mt-1 leading-relaxed">
                      Every simple checkup or short lesson builds healthy digital habits.
                    </p>
                  </div>

                  {/* Connected timeline trail */}
                  <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin bg-white/[0.01] p-4 border border-white/10 rounded-2xl">
                    {/* Step 1: Password Health */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedChecks.password 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse"
                        }`}>
                          {completedChecks.password ? "✓" : "1"}
                        </div>
                        <div className="w-[1.5px] h-5 bg-white/5 my-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${completedChecks.password ? "text-emerald-400" : "text-white"}`}>
                            Password Strength Checkup
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {completedChecks.password ? "Completed" : "Start Here"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 2: Spot the Scam */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedChecks.scam 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : isScamLocked 
                            ? "bg-white/5 text-white/30 border border-white/10" 
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse"
                        }`}>
                          {completedChecks.scam ? "✓" : "2"}
                        </div>
                        <div className="w-[1.5px] h-5 bg-white/5 my-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            completedChecks.scam ? "text-emerald-400" : isScamLocked ? "text-white/40" : "text-white"
                          }`}>
                            Scam Spotter Game
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {completedChecks.scam ? "Completed" : isScamLocked ? "Locked" : "Next Up"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Privacy Review */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedChecks.privacy 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : isPrivacyLocked 
                            ? "bg-white/5 text-white/30 border border-white/10" 
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse"
                        }`}>
                          {completedChecks.privacy ? "✓" : "3"}
                        </div>
                        <div className="w-[1.5px] h-5 bg-white/5 my-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            completedChecks.privacy ? "text-emerald-400" : isPrivacyLocked ? "text-white/40" : "text-white"
                          }`}>
                            Privacy Settings Checkup
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {completedChecks.privacy ? "Completed" : isPrivacyLocked ? "Locked" : "Next Up"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Browser Safety */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedChecks.browser 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : isBrowserLocked 
                            ? "bg-white/5 text-white/30 border border-white/10" 
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse"
                        }`}>
                          {completedChecks.browser ? "✓" : "4"}
                        </div>
                        <div className="w-[1.5px] h-5 bg-white/5 my-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            completedChecks.browser ? "text-emerald-400" : isBrowserLocked ? "text-white/40" : "text-white"
                          }`}>
                            Web Browser Health Check
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {completedChecks.browser ? "Completed" : isBrowserLocked ? "Locked" : "Next Up"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 5: Email Safety */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          lessonCount >= 3 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : isScamLocked 
                            ? "bg-white/5 text-white/30 border border-white/10" 
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse"
                        }`}>
                          {lessonCount >= 3 ? "✓" : "5"}
                        </div>
                        <div className="w-[1.5px] h-5 bg-white/5 my-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            lessonCount >= 3 ? "text-emerald-400" : isScamLocked ? "text-white/40" : "text-white"
                          }`}>
                            Learn Email Safety Basics
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {lessonCount >= 3 ? "Completed" : isScamLocked ? "Locked" : "Recommended"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 6: Safe Browsing & Mobile Security */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          lessonCount >= 8 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : isBrowserLocked 
                            ? "bg-white/5 text-white/30 border border-white/10" 
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse"
                        }`}>
                          {lessonCount >= 8 ? "✓" : "6"}
                        </div>
                        <div className="w-[1.5px] h-5 bg-white/5 my-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            lessonCount >= 8 ? "text-emerald-400" : isBrowserLocked ? "text-white/40" : "text-white"
                          }`}>
                            Safe Browsing & Mobile Security
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {lessonCount >= 8 ? "Completed" : isBrowserLocked ? "Locked" : "Recommended"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 7: Final Assessment */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedCount === 4 && lessonCount >= 10
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                            : "bg-white/5 text-white/30 border border-white/10"
                        }`}>
                          {completedCount === 4 && lessonCount >= 10 ? "✓" : "7"}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            completedCount === 4 && lessonCount >= 10 ? "text-emerald-400" : "text-white/40"
                          }`}>
                            Final Safety Assessment
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {completedCount === 4 && lessonCount >= 10 ? "Completed" : "Locked"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Link href="/learning-hub">
                      <Button variant="friendly-outline" icon={<ArrowRight className="w-4 h-4" />}>
                        Study Curriculum
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </Panel>
          </motion.div>

          {/* Staggered Audits Section with Lock States */}
          <div className="space-y-6">
            <Panel title="Interactive Safety Checkups" icon={<ClipboardList className="w-4 h-4" />} idTag="Checkups" noHoverAnim={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                
                {/* Card 1: Password Analyzer (Always Unlocked) */}
                <motion.div 
                  whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)" }}
                  className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-6 flex flex-col justify-between rounded-2xl transition-all min-h-[220px] group cursor-pointer"
                >
                  <Link href="/safety-checks?tool=password" className="flex flex-col justify-between h-full w-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 border border-white/10 bg-white/5 flex items-center justify-center text-blue-400 rounded-xl group-hover:bg-blue-950/20 group-hover:border-blue-400/30 transition-colors">
                          <Key className="w-4.5 h-4.5 group-hover:scale-1.1 transition-transform" />
                        </div>
                        <span className={`font-inter text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          completedChecks.password 
                            ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20"
                            : "text-blue-400 bg-blue-950/20 border border-blue-500/20 animate-pulse"
                        }`}>
                          {completedChecks.password ? "COMPLETED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <h4 className="font-outfit font-bold text-white text-base mt-4 group-hover:text-blue-400 transition-colors">
                        Password Strength Checkup
                      </h4>
                      <p className="text-on-surface-variant text-[13px] mt-2 font-inter leading-relaxed">
                        Find out how strong your passwords are. Test different combinations to see how long they would take a computer to guess, and learn how to make them unbreakable.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/5">
                      <p className="text-[11px] text-on-surface-variant/50 font-inter italic leading-snug">
                        Checks if your password can withstand automated computer guessing tools.
                      </p>
                    </div>
                  </Link>
                </motion.div>

                {/* Card 2: Spot the Scam */}
                <motion.div 
                  whileHover={isScamLocked ? {} : { y: -4, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)" }}
                  className={`border p-6 flex flex-col justify-between rounded-2xl transition-all min-h-[220px] group ${
                    isScamLocked 
                      ? "border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
                  }`}
                >
                  <Link 
                    href={isScamLocked ? "#" : "/safety-checks?tool=scam"} 
                    className={`flex flex-col justify-between h-full w-full ${isScamLocked ? "pointer-events-none" : ""}`}
                    onClick={(e) => {
                      if (isScamLocked) {
                        e.preventDefault();
                        showToast("Please complete Password Checkup first!", "warning");
                      }
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 border border-white/10 bg-white/5 flex items-center justify-center text-blue-400 rounded-xl group-hover:bg-blue-950/20 group-hover:border-blue-400/30 transition-colors">
                          {isScamLocked ? <LockKeyhole className="w-4.5 h-4.5 text-white/20" /> : <Search className="w-4.5 h-4.5 group-hover:scale-1.1 transition-transform" />}
                        </div>
                        <span className={`font-inter text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          completedChecks.scam
                            ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20"
                            : isScamLocked 
                            ? "text-white/20 bg-white/5 border border-white/5"
                            : "text-blue-400 bg-blue-950/20 border border-blue-500/20 animate-pulse"
                        }`}>
                          {completedChecks.scam ? "COMPLETED" : isScamLocked ? "🔒 LOCKED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <h4 className="font-outfit font-bold text-white text-base mt-4 group-hover:text-blue-400 transition-colors">
                        Scam Spotter Game
                      </h4>
                      <p className="text-on-surface-variant text-[13px] mt-2 font-inter leading-relaxed">
                        Play a quick game in our mock inbox to spot phishing emails. Learn the warning signs scammers use to try and trick you.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/5">
                      <p className="text-[11px] text-on-surface-variant/50 font-inter italic leading-snug">
                        Practices spotting hidden tricks in sender addresses and email links.
                      </p>
                    </div>
                  </Link>
                </motion.div>

                {/* Card 3: Privacy Review */}
                <motion.div 
                  whileHover={isPrivacyLocked ? {} : { y: -4, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)" }}
                  className={`border p-6 flex flex-col justify-between rounded-2xl transition-all min-h-[220px] group ${
                    isPrivacyLocked 
                      ? "border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
                  }`}
                >
                  <Link 
                    href={isPrivacyLocked ? "#" : "/safety-checks?tool=privacy"} 
                    className={`flex flex-col justify-between h-full w-full ${isPrivacyLocked ? "pointer-events-none" : ""}`}
                    onClick={(e) => {
                      if (isPrivacyLocked) {
                        e.preventDefault();
                        showToast("Please complete Scam Spotter first!", "warning");
                      }
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 border border-white/10 bg-white/5 flex items-center justify-center text-blue-400 rounded-xl group-hover:bg-blue-950/20 group-hover:border-blue-400/30 transition-colors">
                          {isPrivacyLocked ? <LockKeyhole className="w-4.5 h-4.5 text-white/20" /> : <EyeOff className="w-4.5 h-4.5 group-hover:scale-1.1 transition-transform" />}
                        </div>
                        <span className={`font-inter text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          completedChecks.privacy
                            ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20"
                            : isPrivacyLocked
                            ? "text-white/20 bg-white/5 border border-white/5"
                            : "text-blue-400 bg-blue-950/20 border border-blue-500/20 animate-pulse"
                        }`}>
                          {completedChecks.privacy ? "COMPLETED" : isPrivacyLocked ? "🔒 LOCKED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <h4 className="font-outfit font-bold text-white text-base mt-4 group-hover:text-blue-400 transition-colors">
                        Privacy Settings Checkup
                      </h4>
                      <p className="text-on-surface-variant text-[13px] mt-2 font-inter leading-relaxed">
                        A simple guide to check your everyday privacy settings. Review who has access to your location, account sharing, and background files.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/5">
                      <p className="text-[11px] text-on-surface-variant/50 font-inter italic leading-snug">
                        Audits your location, account sharing, and background app permissions.
                      </p>
                    </div>
                  </Link>
                </motion.div>

                {/* Card 4: Browser Safety */}
                <motion.div 
                  whileHover={isBrowserLocked ? {} : { y: -4, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)" }}
                  className={`border p-6 flex flex-col justify-between rounded-2xl transition-all min-h-[220px] group ${
                    isBrowserLocked 
                      ? "border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
                  }`}
                >
                  <Link 
                    href={isBrowserLocked ? "#" : "/safety-checks?tool=browser"} 
                    className={`flex flex-col justify-between h-full w-full ${isBrowserLocked ? "pointer-events-none" : ""}`}
                    onClick={(e) => {
                      if (isBrowserLocked) {
                        e.preventDefault();
                        showToast("Please complete Privacy Checkup first!", "warning");
                      }
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 border border-white/10 bg-white/5 flex items-center justify-center text-blue-400 rounded-xl group-hover:bg-blue-950/20 group-hover:border-blue-400/30 transition-colors">
                          {isBrowserLocked ? <LockKeyhole className="w-4.5 h-4.5 text-white/20" /> : <Shield className="w-4.5 h-4.5 group-hover:scale-1.1 transition-transform" />}
                        </div>
                        <span className={`font-inter text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          completedChecks.browser
                            ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20"
                            : isBrowserLocked
                            ? "text-white/20 bg-white/5 border border-white/5"
                            : "text-blue-400 bg-blue-950/20 border border-blue-500/20 animate-pulse"
                        }`}>
                          {completedChecks.browser ? "COMPLETED" : isBrowserLocked ? "🔒 LOCKED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <h4 className="font-outfit font-bold text-white text-base mt-4 group-hover:text-blue-400 transition-colors">
                        Web Browser Health Check
                      </h4>
                      <p className="text-on-surface-variant text-[13px] mt-2 font-inter leading-relaxed">
                        Make sure your web browser is secure. Learn how to configure your cookies, extensions, and security settings to browse in peace.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/5">
                      <p className="text-[11px] text-on-surface-variant/50 font-inter italic leading-snug">
                        Verifies your browser is configured to block trackers and malicious ads.
                      </p>
                    </div>
                  </Link>
                </motion.div>

              </div>
            </Panel>
          </div>

          {/* Gamified Achievements Showcase */}
          <div className="space-y-6">
            <Panel title="Earned Badges & Achievements" idTag="Achievements" noHoverAnim={true}>
              <div className="space-y-4 pt-1">
                <div className="flex gap-4 overflow-x-auto pb-3 pt-2 scrollbar-thin">
                  {ACHIEVEMENTS_DATA.map((ach) => {
                    const { unlocked, desc, whyEarned, nextStep } = getBadgeDetails(ach.id);
                    return (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        title={unlocked ? `Unlocked: ${whyEarned}` : `Locked: ${nextStep}`}
                        className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center min-w-[160px] flex-1 transition-all duration-300 hover:border-emerald-500/30 cursor-help ${
                          unlocked
                            ? "border-emerald-500/25 bg-emerald-950/5 shadow-sm"
                            : "border-white/5 bg-white/[0.01] opacity-40"
                        }`}
                      >
                        <div className={`p-2.5 rounded-full border mb-2 transition-transform ${
                          unlocked
                            ? "border-emerald-400 text-emerald-400 bg-emerald-950/20"
                            : "border-white/10 text-white/20"
                        }`}>
                          {ach.icon}
                        </div>
                        <span className={`font-outfit font-bold text-[11px] block leading-tight ${unlocked ? "text-white" : "text-white/30"}`}>
                          {ach.title}
                        </span>
                        <p className="text-[10px] text-on-surface-variant/80 block mt-1 leading-normal max-w-[130px] font-inter">
                          {unlocked ? whyEarned : nextStep}
                        </p>
                        {unlocked ? (
                          <span className="text-[8px] text-emerald-400 font-mono mt-1 block font-bold uppercase tracking-wider">
                            ✓ Unlocked
                          </span>
                        ) : (
                          <span className="text-[8px] text-white/20 font-mono mt-1 block font-bold uppercase tracking-wider">
                            🔒 Locked
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Panel>
          </div>

        </div>

        {/* Right Column: Tips, Activity and Scam alerts (4 / 12) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Today's digital safety tip widget */}
          <Panel title="Today's Safety Tip" idTag="Daily Tip" noHoverAnim={true}>
            <div className="space-y-4 pt-1">
              <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 p-5 rounded-2xl min-h-[100px] flex items-center justify-center text-center relative group shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-emerald-400 text-sm">💡 Quick Tip</span>
                    <p className="text-white text-xs md:text-sm font-inter leading-relaxed px-4">
                      "{CYBER_TIPS[tipIndex]}"
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <button 
                  onClick={handleCopyTip}
                  className="absolute top-2 right-2 text-on-surface-variant/40 hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                  title="Copy tip"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" />
                  </svg>
                </button>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={rotateTip}
                  className="inline-flex items-center gap-1.5 text-[10px] font-inter font-bold text-emerald-400/80 hover:text-emerald-300 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Next Tip</span>
                </button>
              </div>
            </div>
          </Panel>

          {/* User recent activity logs */}
          <Panel title="My Timeline" icon={<Activity className="w-4 h-4 text-emerald-400" />} idTag="Activity">
            <div className="space-y-4 pt-1 font-inter text-xs">
              {user && user.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {user.recentActivity.map((act, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-white font-medium">{act.action}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono flex-shrink-0">{act.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-on-surface-variant/60 font-inter text-xs">
                  No steps taken in this session yet. Complete some checkups!
                </div>
              )}
            </div>
          </Panel>

          {/* Trending Online Scams (Expandable accordion) */}
          <Panel title="Stay Alert: Common Tricks" idTag="Scam Alerts" noHoverAnim={true}>
            <div className="space-y-3.5 pt-1">
              {SCAM_ALERTS.map((alert, index) => {
                const isExpanded = expandedScam === index;
                return (
                  <div
                    key={index}
                    className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl overflow-hidden transition-all hover:border-amber-500/20"
                  >
                    <button
                      onClick={() => setExpandedScam(isExpanded ? null : index)}
                      className="w-full text-left p-4 flex flex-col gap-1.5 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white text-xs font-bold font-inter">{alert.title}</span>
                        <span className="text-amber-400/90 font-bold bg-amber-950/20 px-2 py-0.5 border border-amber-500/20 text-[9px] tracking-wide font-inter uppercase rounded-full flex-shrink-0">
                          {alert.category}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-[11px] font-inter leading-relaxed mt-1">
                        {alert.desc}
                      </p>
                    </button>
                    
                    <div className="px-4 pb-3.5 text-[10px] flex justify-end">
                      <button 
                        onClick={() => setExpandedScam(isExpanded ? null : index)}
                        className="text-blue-400 hover:text-blue-300 font-inter font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {isExpanded ? "Show Less" : "Read More >"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-amber-950/5 border-t border-white/5 p-4 text-[11.5px] space-y-1.5"
                        >
                          <span className="font-inter text-[10px] text-amber-400/90 font-bold tracking-wider uppercase block">
                            How to stay safe:
                          </span>
                          <p className="text-on-surface-variant font-inter leading-relaxed">
                            {alert.lesson}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Panel>

        </div>

      </div>

    </div>
  );
}
