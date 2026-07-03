"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  Flame,
  Award,
  Clock,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  FileText,
  Volume2,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import { CURRICULUM } from "@/data/curriculum";
import {
  getCompletedLessons,
  getCompletedQuizzes,
  getCompletedActivities,
  getUnlockedAchievements,
  getCommunityReports,
  calculateSafetyScore
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

export default function Home() {
  const { showToast } = useToast();
  const { user, isGuest } = useAuth();

  // Progress states
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [lessonCount, setLessonCount] = useState(0);
  const [safetyScore, setSafetyScore] = useState(20);
  const [animatedScore, setAnimatedScore] = useState(20);
  const [tipIndex, setTipIndex] = useState(0);
  const [unlockedBadgesCount, setUnlockedBadgesCount] = useState(0);

  // Weekly challenge state
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [showChallengeBadge, setShowChallengeBadge] = useState(false);

  // Sync state on progress change
  const updateStates = () => {
    const quizzes = getCompletedQuizzes();
    setCompletedQuizzes(quizzes);

    const activities = getCompletedActivities();
    setCompletedActivities(activities);

    const completedCount = Object.keys(quizzes).filter(k => quizzes[k]).length;
    setLessonCount(completedCount);

    const score = calculateSafetyScore();
    setSafetyScore(score);

    const badges = getUnlockedAchievements();
    setUnlockedBadgesCount(badges.length);
  };

  useEffect(() => {
    setTimeout(() => {
      updateStates();
    }, 0);
    window.addEventListener("safesteps_progress_changed", updateStates);
    return () => {
      window.removeEventListener("safesteps_progress_changed", updateStates);
    };
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safetyScore]);

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

  // Determine next learning path (featured lesson logic)
  const getFeaturedLesson = () => {
    // Return first lesson that is not fully completed
    for (const unit of CURRICULUM) {
      for (const lesson of unit.lessons) {
        if (!completedQuizzes[lesson.id] || !completedActivities[lesson.id]) {
          return { unit, lesson };
        }
      }
    }
    // Default to last lesson if all completed
    const lastUnit = CURRICULUM[CURRICULUM.length - 1];
    return { unit: lastUnit, lesson: lastUnit.lessons[lastUnit.lessons.length - 1] };
  };

  const { unit: featuredUnit, lesson: featuredLesson } = getFeaturedLesson();

  // Weekly challenge submission
  const handleWeeklyChallengeSubmit = () => {
    if (challengeAnswer === "B") {
      setChallengeChecked(true);
      setShowChallengeBadge(true);
      showToast("Correct! Weekly Challenge complete. +10 XP!", "success");

      // Unlock badge in local storage
      const badges = JSON.parse(localStorage.getItem("safesteps_achievements") || "[]");
      if (!badges.includes("weekly-challenger")) {
        badges.push("weekly-challenger");
        localStorage.setItem("safesteps_achievements", JSON.stringify(badges));
        window.dispatchEvent(new Event("safesteps_progress_changed"));
      }
    } else {
      setChallengeChecked(true);
      showToast("Incorrect. Re-read the safety rule and try again!", "warning");
    }
  };

  const handleWeeklyChallengeReset = () => {
    setChallengeAnswer(null);
    setChallengeChecked(false);
  };

  // Get community reports
  const communityReports = getCommunityReports().slice(0, 3); // latest 3 reports

  // Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">

      {/* 1. Hero & Welcome */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col lg:flex-row justify-between items-start gap-8 border-b border-white/5 pb-8"
      >
        <div className="space-y-4 max-w-xl">
          <motion.h1 variants={itemVariants} className="font-outfit text-3.5xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build Confidence in Your Digital Safety.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-on-surface-variant text-sm md:text-base leading-relaxed font-inter">
            SafeSteps helps beginners learn digital safety in a structured way. No complex engineering jargon—just practical scenarios, interactive side-by-side lessons, and real stories.
          </motion.p>
          <motion.div variants={itemVariants} className="pt-2 flex flex-wrap gap-3">
            <Link href="/learn">
              <Button variant="friendly" icon={<ArrowRight className="w-4 h-4" />}>
                Start Learning Curriculum
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="friendly-outline">
                Browse Scams Database
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Rotating Daily Tip Panel */}
        <motion.div
          variants={itemVariants}
          className="border border-cyan-400/25 bg-cyan-950/5 p-5 rounded-2xl w-full lg:w-[380px] space-y-4 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Today&apos;s Safety Tip</span>
            </div>
            <button
              onClick={rotateTip}
              className="text-on-surface-variant/50 hover:text-cyan-400 transition-colors p-1 rounded-lg"
              title="Next Tip"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-white text-xs md:text-sm font-inter leading-relaxed min-h-[48px]"
            >
              &quot;{CYBER_TIPS[tipIndex]}&quot;
            </motion.p>
          </AnimatePresence>

          <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-mono pt-2 border-t border-white/5">
            <span>ROTATES AUTOMATICALLY</span>
            <button onClick={handleCopyTip} className="underline hover:text-white cursor-pointer">
              Copy Tip
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column (8/12): Awareness, Featured Lesson, Challenges, Reports */}
        <div className="lg:col-span-8 space-y-8">

          {/* 2. Latest Awareness */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Latest Scam Alerts & Advisories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Newest Scam Reported */}
              <div className="p-5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col justify-between space-y-3 hover:border-cyan-400/25 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-cyan-400 font-bold bg-cyan-950/20 px-2 py-0.5 rounded-full border border-cyan-400/20 uppercase">
                    NEWEST REPORTED SCAM
                  </span>
                  <h3 className="font-outfit font-bold text-white text-sm mt-2">Fake Courier Redelivery Link</h3>
                  <p className="text-on-surface-variant text-[12px] font-inter leading-relaxed">
                    Scammers send SMS messages claiming a package cannot be delivered until a $1.50 customs fee is cleared. Clicking the link steals credit card details.
                  </p>
                </div>
                <Link href="/community" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                  <span>View reports library</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Card 2: Trending Scam */}
              <div className="p-5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col justify-between space-y-3 hover:border-cyan-400/25 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-amber-400 font-bold bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">
                    TRENDING DANGER
                  </span>
                  <h3 className="font-outfit font-bold text-white text-sm mt-2">WhatsApp OTP Hijack Request</h3>
                  <p className="text-on-surface-variant text-[12px] font-inter leading-relaxed">
                    Contacts with hacked profiles message you asking for a code sent to your phone by mistake. Reading this code transfers your WhatsApp account.
                  </p>
                </div>
                <Link href="/learn" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                  <span>Study Device Safety</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Card 3: Community Alert */}
              <div className="p-5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col justify-between space-y-3 hover:border-cyan-400/25 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-purple-400 font-bold bg-purple-950/20 px-2 py-0.5 rounded-full border border-purple-500/20 uppercase">
                    COMMUNITY WARNING
                  </span>
                  <h3 className="font-outfit font-bold text-white text-sm mt-2">Fake UPI QR Payments on OLX</h3>
                  <p className="text-on-surface-variant text-[12px] font-inter leading-relaxed">
                    Buyers send sellers QR codes claiming &apos;Scan this to receive payment.&apos; Scanning QR codes is only for sending money, not receiving.
                  </p>
                </div>
                <Link href="/learn" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                  <span>Study Payments lesson</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Card 4: Government Advisory */}
              <div className="p-5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col justify-between space-y-3 hover:border-cyan-400/25 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                    GOVERNMENT ADVISORY
                  </span>
                  <h3 className="font-outfit font-bold text-white text-sm mt-2">National Cybercrime Helpline (1930)</h3>
                  <p className="text-on-surface-variant text-[12px] font-inter leading-relaxed">
                    Report financial fraud within 1 hour (&apos;Golden Hour&apos;) to double the chances of recovering debited account funds. Call 1930 immediately.
                  </p>
                </div>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                  <span>Visit portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Featured Lesson */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Resume Your Progress
            </h2>

            <div className="border border-white/10 bg-gradient-to-br from-indigo-950/15 to-blue-950/15 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-400/30 transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-cyan-400 font-bold bg-cyan-950/25 px-2 py-0.5 rounded-full border border-cyan-400/20 uppercase">
                    {featuredUnit.id.toUpperCase()} • LESSON {featuredLesson.id.split("-").pop()}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">• {featuredLesson.readTime}</span>
                </div>
                <h3 className="font-outfit font-extrabold text-white text-lg">{featuredLesson.title}</h3>
                <p className="text-on-surface-variant text-xs font-inter max-w-xl leading-relaxed">
                  {featuredLesson.summary}
                </p>
              </div>

              <Link href={`/learn?unit=${featuredUnit.id}&lesson=${featuredLesson.id}`} className="w-full md:w-auto flex-shrink-0">
                <Button variant="friendly" icon={<ArrowRight className="w-4 h-4" />}>
                  Continue Lesson
                </Button>
              </Link>
            </div>
          </div>

          {/* 4. Weekly Challenge */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Weekly Safety Challenge
            </h2>

            <Panel title="Can You Spot the Safety Action?" idTag="WEEKLY CHALLENGE" noHoverAnim={true} topBorderColor="emerald">
              <div className="space-y-5">
                <div className="space-y-1 font-inter text-xs text-white">
                  <p className="font-semibold">Scenario:</p>
                  <p className="text-on-surface-variant leading-relaxed">
                    You receive a phone call from an automated voice claiming to be &apos;Bank fraud protection.&apos; The bot states your debit card is blocked due to a suspicious login, and you must press &apos;1&apos; to verify your OTP code. A text message with a code immediately arrives. What should you do?
                  </p>
                </div>

                <div className="flex flex-col gap-2 font-inter text-xs">
                  <button
                    onClick={() => !challengeChecked && setChallengeAnswer("A")}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all cursor-pointer ${challengeAnswer === "A"
                        ? challengeChecked
                          ? "border-red-500 bg-red-950/10 text-red-400 font-bold"
                          : "border-cyan-400 bg-cyan-950/10 text-cyan-400"
                        : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-on-surface-variant hover:text-white"
                      }`}
                    disabled={challengeChecked}
                  >
                    Option A: Read back the OTP code to verify you are the card holder.
                  </button>

                  <button
                    onClick={() => !challengeChecked && setChallengeAnswer("B")}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all cursor-pointer ${challengeAnswer === "B"
                        ? challengeChecked
                          ? "border-emerald-500 bg-emerald-950/10 text-emerald-400 font-bold"
                          : "border-cyan-400 bg-cyan-950/10 text-cyan-400"
                        : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-on-surface-variant hover:text-white"
                      }`}
                    disabled={challengeChecked}
                  >
                    Option B: Hang up. Bank automation and staff will never call to ask for OTPs or verify codes.
                  </button>
                </div>

                {challengeChecked && (
                  <div className={`p-4 rounded-xl border font-inter text-xs leading-relaxed ${challengeAnswer === "B" ? "border-emerald-500/20 bg-emerald-950/5 text-emerald-400/90" : "border-red-500/20 bg-red-950/5 text-red-400/90"
                    }`}>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider block mb-1">
                      {challengeAnswer === "B" ? "Correct! 🎉" : "Incorrect. ⚠️"}
                    </span>
                    {challengeAnswer === "B"
                      ? "Excellent decision. Banks will NEVER ask you for a One-Time Password (OTP) or verification code. Tapping codes on calls approvals triggers transactions out of your account."
                      : "DANGER! Reading verification codes sent to your device allows hackers to complete transactions or hijack credentials. Try again!"
                    }
                  </div>
                )}

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant font-mono font-bold uppercase text-emerald-400">
                    REWARD: WEEKLY CHALLENGE BADGE
                  </span>

                  {!challengeChecked ? (
                    <Button variant="action" onClick={handleWeeklyChallengeSubmit} disabled={!challengeAnswer}>
                      Submit Challenge
                    </Button>
                  ) : (
                    <button onClick={handleWeeklyChallengeReset} className="text-xs text-cyan-400 font-mono underline hover:text-cyan-300">
                      Reset Challenge
                    </button>
                  )}
                </div>
              </div>
            </Panel>
          </div>

          {/* 5. Recent Community Reports */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pl-1">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Recent Reports From Your Neighbors
              </h2>
              <Link href="/community" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono underline">
                View all reports
              </Link>
            </div>

            <div className="space-y-3.5">
              {communityReports.map((report) => (
                <div key={report.id} className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{report.title}</span>
                      <span className="font-mono text-[8px] bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20 text-red-400 font-bold uppercase">
                        {report.category}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex gap-3 text-[10px] text-on-surface-variant/60 font-mono pt-1">
                      <span>Date: {report.date}</span>
                      <span>•</span>
                      <span>Votes: {report.votes} helpful</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/25 px-2 py-0.5 border border-emerald-500/20 rounded uppercase">
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4/12): Compact Progress Stats */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
            My Progression
          </h2>

          <Panel title="Safety Level Stats" idTag="PROGRESS" noHoverAnim={true} topBorderColor="cyan">
            <div className="space-y-6 py-2">

              {/* Circular Meter */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="stroke-white/5" strokeWidth="6.5" fill="transparent" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-cyan-400"
                      strokeWidth="6.5"
                      fill="transparent"
                      strokeDasharray={263.8}
                      initial={{ strokeDashoffset: 263.8 }}
                      animate={{ strokeDashoffset: 263.8 - (263.8 * animatedScore) / 100 }}
                      transition={{ duration: 0.8 }}
                      style={{ filter: "drop-shadow(0px 0px 4px rgba(34, 211, 238, 0.25))" }}
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-outfit text-2.5xl font-extrabold text-white leading-none">{animatedScore}%</span>
                    <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">Secure</span>
                  </div>
                </div>
              </div>

              {/* Grid of stats */}
              <div className="grid grid-cols-2 gap-3.5 font-mono text-[11px] text-on-surface-variant border-t border-white/5 pt-4">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-white/40 block text-[9px]">LATEST UNIT:</span>
                  <span className="text-white font-bold block mt-0.5 truncate uppercase">
                    {featuredUnit.title.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-white/40 block text-[9px]">QUIZZES DONE:</span>
                  <span className="text-white font-bold block mt-0.5">
                    {lessonCount} passed
                  </span>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-white/40 block text-[9px]">BADGES EARNED:</span>
                  <span className="text-white font-bold block mt-0.5">
                    {unlockedBadgesCount} unlocked
                  </span>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-white/40 block text-[9px]">WEEKLY STREAK:</span>
                  <span className="text-amber-400 font-bold block mt-0.5 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{user ? user.streak : 1} Day</span>
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/profile">
                  <Button variant="friendly-outline" className="w-full text-xs font-bold">
                    View Achievements Profile
                  </Button>
                </Link>
              </div>

            </div>
          </Panel>
        </div>

      </div>

    </div>
  );
}
