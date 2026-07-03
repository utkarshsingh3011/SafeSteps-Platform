"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  Clock,
  Shield,
  MessageSquare,
  Zap,
  Key,
  Search,
  EyeOff,
  User
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import { CURRICULUM } from "@/data/curriculum";
import {
  getCompletedQuizzes,
  getCompletedActivities,
  getCompletedCases,
  getUnlockedAchievements,
  resetAllProgress
} from "@/components/ProgressTracker";

const BADGES_INFO = [
  { id: "first-login", title: "First Login", desc: "Welcome to SafeSteps!", req: "Log into the portal for the first time.", icon: <Zap className="w-5 h-5" /> },
  { id: "first-lesson", title: "First Lesson", desc: "First step on the ladder.", req: "Pass your first lesson quiz.", icon: <BookOpen className="w-5 h-5" /> },
  { id: "password-defender", title: "Password Defender", desc: "Lock it down.", req: "Complete password strength and password manager exercises.", icon: <Key className="w-5 h-5" /> },
  { id: "phishing-detective", title: "Phishing Detective", desc: "Spot the clues.", req: "Complete the side-by-side Email Compare activity.", icon: <Search className="w-5 h-5" /> },
  { id: "privacy-explorer", title: "Privacy Explorer", desc: "Sensor check.", req: "Audit permissions for both Unit 4 privacy lessons.", icon: <EyeOff className="w-5 h-5" /> },
  { id: "quiz-master", title: "Quiz Master", desc: "Knowledge verified.", req: "Pass 5 lesson quizzes successfully.", icon: <Award className="w-5 h-5" /> },
  { id: "case-study-solver", title: "Case Solver", desc: "Story analyst.", req: "Complete at least 1 real-world Unit Case Study.", icon: <Shield className="w-5 h-5" /> },
  { id: "community-reporter", title: "Scam Alert Officer", desc: "Spreading safety.", req: "Submit a suspicious alert on the Community page.", icon: <AlertIcon className="w-5 h-5" /> },
  { id: "helpful-contributor", title: "Helpful Neighbor", desc: "Cooperative defense.", req: "Upvote or comment on a neighbor's scam report.", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "learner-30", title: "Master Learner", desc: "All blocks cleared.", req: "Complete all 14 lessons and 6 case studies.", icon: <Award className="w-5 h-5" /> }
];

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function ProfilePage() {
  const { showToast } = useToast();
  const { user, isGuest, logout } = useAuth();

  // Progress stats
  const [quizzes, setQuizzes] = useState<Record<string, boolean>>({});
  const [activities, setActivities] = useState<Record<string, boolean>>({});
  const [cases, setCases] = useState<Record<string, boolean>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  const reloadData = () => {
    setQuizzes(getCompletedQuizzes());
    setActivities(getCompletedActivities());
    setCases(getCompletedCases());
    setUnlockedBadges(getUnlockedAchievements());
  };

  useEffect(() => {
    setTimeout(() => {
      reloadData();
    }, 0);
    window.addEventListener("safesteps_progress_changed", reloadData);
    return () => {
      window.removeEventListener("safesteps_progress_changed", reloadData);
    };
  }, []);

  const totalQuizzesPassed = Object.keys(quizzes).filter((k) => quizzes[k]).length;
  const totalActivitiesDone = Object.keys(activities).filter((k) => activities[k]).length;
  const totalCasesSolved = Object.keys(cases).filter((k) => cases[k]).length;
  
  // Calculate completed units (all quizzes + activities + case study completed in that unit)
  const totalUnitsCompleted = CURRICULUM.filter((unit) => {
    const lessonsDone = unit.lessons.every((l) => quizzes[l.id] && activities[l.id]);
    const caseDone = cases[unit.id];
    return lessonsDone && caseDone;
  }).length;

  // Calculate dynamic hours spent learning
  const timeSpentMinutes = 2 + (totalQuizzesPassed * 3) + (totalActivitiesDone * 4) + (totalCasesSolved * 6);
  
  // Community stats (read from local storage reports counts)
  const getCommunityContributionStats = () => {
    if (typeof window === "undefined") return { reports: 0, actions: 0 };
    try {
      const reports = JSON.parse(localStorage.getItem("safesteps_community_reports") || "[]");
      const votes = Object.keys(JSON.parse(localStorage.getItem("safesteps_community_votes") || "{}")).length;
      
      // Filter reports submitted by guest vs user (or just use total added items in reports key that don't match default IDs)
      const defaultIds = ["rep-1", "rep-2", "rep-3", "rep-4"];
      const userSubmitted = reports.filter((r: { id: string }) => !defaultIds.includes(r.id)).length;
      
      return {
        reports: userSubmitted,
        actions: votes + userSubmitted
      };
    } catch {
      return { reports: 0, actions: 0 };
    }
  };

  const communityStats = getCommunityContributionStats();

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all your learning achievements and streak? This cannot be undone.")) {
      resetAllProgress();
      showToast("All learning progress has been reset successfully.", "info");
    }
  };

  const displayName = user ? user.name : isGuest ? "Guest Learner" : "Learner";
  const userStreak = user ? user.streak : 1;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="border-b border-white/5 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-950/20 border border-cyan-400/25 flex items-center justify-center text-cyan-400 rounded-2xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-outfit text-3xl font-extrabold text-white leading-tight">
              {displayName}
            </h1>
            <p className="text-on-surface-variant text-xs mt-0.5 font-mono">
              ROLE: SAFE STEPS LEAGUE STUDENT // STREAK: {userStreak} {userStreak === 1 ? "DAY" : "DAYS"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="friendly-outline" className="text-xs py-2" onClick={handleResetProgress}>
            Reset Progress
          </Button>
          <Button variant="technical" className="text-[11px] py-1.5" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Learning stats (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
            Learning Milestones
          </h2>

          <Panel title="Academic Summary" idTag="STATS" noHoverAnim={true}>
            <div className="space-y-4 py-2 font-inter text-xs">
              
              {/* Stat row: Units finished */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-on-surface-variant">Units Fully Mastered:</span>
                <span className="text-white font-bold font-mono bg-white/5 px-2.5 py-1 rounded">
                  {totalUnitsCompleted} / 6 Units
                </span>
              </div>

              {/* Stat row: Lessons completed */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-on-surface-variant">Lessons Finished:</span>
                <span className="text-white font-bold font-mono bg-white/5 px-2.5 py-1 rounded">
                  {totalQuizzesPassed} / 14 Lessons
                </span>
              </div>

              {/* Stat row: Activities completed */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-on-surface-variant">Interactive Activities Cleared:</span>
                <span className="text-white font-bold font-mono bg-white/5 px-2.5 py-1 rounded">
                  {totalActivitiesDone} / 14 Done
                </span>
              </div>

              {/* Stat row: Case studies solved */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-on-surface-variant">Real Case Studies Solved:</span>
                <span className="text-white font-bold font-mono bg-white/5 px-2.5 py-1 rounded">
                  {totalCasesSolved} / 6 Cases
                </span>
              </div>

              {/* Stat row: Community reports submitted */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-on-surface-variant">Community Scam Reports:</span>
                <span className="text-white font-bold font-mono bg-white/5 px-2.5 py-1 rounded">
                  {communityStats.reports} submitted
                </span>
              </div>

              {/* Stat row: Contributions */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-on-surface-variant">Helpful Neighbor Actions:</span>
                <span className="text-white font-bold font-mono bg-white/5 px-2.5 py-1 rounded">
                  {communityStats.actions} interactions
                </span>
              </div>

              {/* Stat row: Time Spent */}
              <div className="flex justify-between items-center pb-1">
                <span className="text-on-surface-variant">Total Time Invested:</span>
                <span className="text-cyan-400 font-bold font-mono bg-cyan-950/20 border border-cyan-400/20 px-2.5 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeSpentMinutes} Minutes</span>
                </span>
              </div>

            </div>
          </Panel>
        </div>

        {/* Right Column: Achievements & Badges (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
            Unlocked Achievements & Badges
          </h2>

          <Panel title="Earned Badges" idTag="BADGES GRID" noHoverAnim={true}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              {BADGES_INFO.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                
                return (
                  <div
                    key={badge.id}
                    title={isUnlocked ? `Unlocked: ${badge.desc}` : `Locked: ${badge.req}`}
                    className={`p-4 border rounded-2xl flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? "border-emerald-500/25 bg-emerald-950/5 shadow-sm"
                        : "border-white/5 bg-white/[0.005] opacity-40"
                    }`}
                  >
                    <div className={`p-2 rounded-xl border flex-shrink-0 ${
                      isUnlocked
                        ? "border-emerald-400 text-emerald-400 bg-emerald-950/20"
                        : "border-white/10 text-white/20"
                    }`}>
                      {badge.icon}
                    </div>

                    <div className="space-y-1 font-inter text-xs leading-normal">
                      <span className={`font-outfit font-bold block ${isUnlocked ? "text-white" : "text-white/30"}`}>
                        {badge.title}
                      </span>
                      <p className="text-[10px] text-on-surface-variant/80 leading-relaxed">
                        {isUnlocked ? badge.desc : `Criteria: ${badge.req}`}
                      </p>
                      <span className={`text-[8px] font-mono font-bold block uppercase tracking-wider ${
                        isUnlocked ? "text-emerald-400" : "text-white/20"
                      }`}>
                        {isUnlocked ? "✓ Unlocked" : "🔒 Locked"}
                      </span>
                    </div>
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
