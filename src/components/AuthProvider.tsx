"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CompletedChecks, CompletedLessons } from "./ProgressTracker";

export interface UserActivity {
  time: string;
  action: string;
}

export interface UserProfile {
  email: string;
  name: string;
  password?: string;
  streak: number;
  lastActive: string;
  achievements: string[];
  recentActivity: UserActivity[];
  checks: CompletedChecks;
  lessons: CompletedLessons;
  support: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
  loginGuest: () => void;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  addActivity: (action: string) => void;
  unlockAchievement: (achievementId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: { [email: string]: UserProfile } = {
  "utkarsh@example.com": {
    email: "utkarsh@example.com",
    name: "Utkarsh",
    password: "password123",
    streak: 3,
    lastActive: new Date().toISOString().split("T")[0],
    achievements: ["first-login"],
    recentActivity: [
      { time: "Just now", action: "Initialized safety center profile" }
    ],
    checks: { password: false, scam: false, privacy: false, browser: false },
    lessons: {},
    support: false
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB and active session
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure database exists in localStorage
    if (!localStorage.getItem("safesteps_users")) {
      localStorage.setItem("safesteps_users", JSON.stringify(DEFAULT_USERS));
    }

    const session = localStorage.getItem("safesteps_session");
    setTimeout(() => {
      if (session) {
        if (session === "guest") {
          setIsGuest(true);
          loadGuestProgress();
        } else {
          const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
          const found = users[session];
          if (found) {
            setUser(found);
            loadUserProgress(found);
            updateStreak(session, found);
          } else {
            localStorage.removeItem("safesteps_session");
          }
        }
      }
      setIsLoading(false);
    }, 0);
  }, []);

  // Update streak if last active day was yesterday or today
  function updateStreak(email: string, profile: UserProfile) {
    const today = new Date().toISOString().split("T")[0];
    if (profile.lastActive === today) return;

    const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
    const lastActiveDate = new Date(profile.lastActive);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = profile.streak;
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1; // reset streak
    }

    const updated = {
      ...profile,
      streak: newStreak,
      lastActive: today
    };

    users[email] = updated;
    localStorage.setItem("safesteps_users", JSON.stringify(users));
    setUser(updated);
  }

  // Sync back local progress modifications to current active profile
  useEffect(() => {
    if (isLoading) return;

    const syncProgress = () => {
      const checksData = localStorage.getItem("safesteps_completed_checks");
      const lessonsData = localStorage.getItem("safesteps_completed_lessons");
      const activitiesData = localStorage.getItem("safesteps_completed_activities");
      const quizzesData = localStorage.getItem("safesteps_completed_quizzes");
      const casesData = localStorage.getItem("safesteps_completed_cases");
      const supportData = localStorage.getItem("safesteps_support_completed") === "true";
      const achievementsData = JSON.parse(localStorage.getItem("safesteps_achievements") || "[]");

      const checks = checksData ? JSON.parse(checksData) : { password: false, scam: false, privacy: false, browser: false };
      const lessons = lessonsData ? JSON.parse(lessonsData) : {};
      const activities = activitiesData ? JSON.parse(activitiesData) : {};
      const quizzes = quizzesData ? JSON.parse(quizzesData) : {};
      const cases = casesData ? JSON.parse(casesData) : {};

      const constAchievements = [...achievementsData];
      let achievementsChanged = false;

      const unlock = (id: string) => {
        if (!constAchievements.includes(id)) {
          constAchievements.push(id);
          achievementsChanged = true;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("safesteps_achievement_unlocked", { detail: { id } }));
          }, 50);
        }
      };

      // v2.0 Badge Rules
      const quizCount = Object.keys(quizzes).filter(k => quizzes[k]).length;
      if (quizCount >= 1) unlock("first-lesson");
      if (activities["lesson-1-1"] && activities["lesson-1-3"]) unlock("password-defender");
      if (activities["lesson-2-1"]) unlock("phishing-detective");
      if (quizzes["lesson-4-1"] && quizzes["lesson-4-2"]) unlock("privacy-explorer");
      if (quizCount >= 5) unlock("quiz-master");
      
      const caseCount = Object.keys(cases).filter(k => cases[k]).length;
      if (caseCount >= 1) unlock("case-study-solver");
      
      const totalLessons = 14;
      const actCount = Object.keys(activities).filter(k => activities[k]).length;
      if (quizCount >= totalLessons && actCount >= totalLessons && caseCount >= 6) {
        unlock("learner-30");
      }

      if (isGuest) {
        // Save guest progress
        const guestProgress = { checks, lessons, support: supportData, achievements: constAchievements };
        localStorage.setItem("safesteps_guest_progress", JSON.stringify(guestProgress));
        if (achievementsChanged) {
          localStorage.setItem("safesteps_achievements", JSON.stringify(constAchievements));
        }
      } else if (user) {
        // Save logged in user progress
        const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
        const profile = users[user.email];
        if (profile) {
          // Log activities dynamically
          let activityLogged = false;
          
          if (checks.password && !profile.checks.password) {
            profile.recentActivity = [{ time: "Just now", action: "Passed Password Security quiz" }, ...profile.recentActivity.slice(0, 7)];
            activityLogged = true;
          }
          if (checks.scam && !profile.checks.scam) {
            profile.recentActivity = [{ time: "Just now", action: "Spotted Phishing Clues activity" }, ...profile.recentActivity.slice(0, 7)];
            activityLogged = true;
          }
          if (checks.privacy && !profile.checks.privacy) {
            profile.recentActivity = [{ time: "Just now", action: "Audited Device App Permissions" }, ...profile.recentActivity.slice(0, 7)];
            activityLogged = true;
          }
          if (checks.browser && !profile.checks.browser) {
            profile.recentActivity = [{ time: "Just now", action: "Completed Browser Privacy Audit" }, ...profile.recentActivity.slice(0, 7)];
            activityLogged = true;
          }

          profile.checks = checks;
          profile.lessons = lessons;
          profile.support = supportData;
          profile.achievements = constAchievements;
          
          users[user.email] = profile;
          localStorage.setItem("safesteps_users", JSON.stringify(users));
          setUser(profile);
          
          if (achievementsChanged || activityLogged) {
            localStorage.setItem("safesteps_achievements", JSON.stringify(constAchievements));
          }
        }
      }
    };

    window.addEventListener("safesteps_progress_changed", syncProgress);
    return () => {
      window.removeEventListener("safesteps_progress_changed", syncProgress);
    };
  }, [user, isGuest, isLoading]);

  function loadUserProgress(profile: UserProfile) {
    localStorage.setItem("safesteps_completed_checks", JSON.stringify(profile.checks));
    localStorage.setItem("safesteps_completed_lessons", JSON.stringify(profile.lessons));
    localStorage.setItem("safesteps_support_completed", profile.support ? "true" : "false");
    localStorage.setItem("safesteps_achievements", JSON.stringify(profile.achievements));
    window.dispatchEvent(new Event("safesteps_progress_changed"));
  }

  function loadGuestProgress() {
    const saved = localStorage.getItem("safesteps_guest_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      localStorage.setItem("safesteps_completed_checks", JSON.stringify(parsed.checks));
      localStorage.setItem("safesteps_completed_lessons", JSON.stringify(parsed.lessons));
      localStorage.setItem("safesteps_support_completed", parsed.support ? "true" : "false");
      localStorage.setItem("safesteps_achievements", JSON.stringify(parsed.achievements || []));
    } else {
      localStorage.setItem("safesteps_completed_checks", JSON.stringify({ password: false, scam: false, privacy: false, browser: false }));
      localStorage.setItem("safesteps_completed_lessons", JSON.stringify({}));
      localStorage.setItem("safesteps_support_completed", "false");
      localStorage.setItem("safesteps_achievements", JSON.stringify([]));
    }
    window.dispatchEvent(new Event("safesteps_progress_changed"));
  }

  const login = async (email: string, password?: string, rememberMe: boolean = true): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
    const found = users[email];
    if (found && found.password === password) {
      if (rememberMe) {
        localStorage.setItem("safesteps_session", email);
      }
      setUser(found);
      setIsGuest(false);
      loadUserProgress(found);
      
      // Auto-unlock first login badge
      setTimeout(() => unlockAchievement("first-login"), 100);
      
      router.push("/");
      return true;
    }
    return false;
  };

  const signup = async (email: string, name: string, password?: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
    if (users[email]) return false; // Already exists

    const newUserProfile: UserProfile = {
      email,
      name,
      password,
      streak: 1,
      lastActive: new Date().toISOString().split("T")[0],
      achievements: ["first-login"],
      recentActivity: [{ time: "Just now", action: "Signed up to SafeSteps" }],
      checks: { password: false, scam: false, privacy: false, browser: false },
      lessons: {},
      support: false
    };

    users[email] = newUserProfile;
    localStorage.setItem("safesteps_users", JSON.stringify(users));
    localStorage.setItem("safesteps_session", email);
    
    setUser(newUserProfile);
    setIsGuest(false);
    loadUserProgress(newUserProfile);
    
    router.push("/");
    return true;
  };

  const loginGuest = () => {
    localStorage.setItem("safesteps_session", "guest");
    setUser(null);
    setIsGuest(true);
    loadGuestProgress();
    setTimeout(() => unlockAchievement("first-login"), 100);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("safesteps_session");
    setUser(null);
    setIsGuest(false);
    
    // Clear active keys
    localStorage.removeItem("safesteps_completed_checks");
    localStorage.removeItem("safesteps_completed_lessons");
    localStorage.removeItem("safesteps_support_completed");
    localStorage.removeItem("safesteps_achievements");
    
    window.dispatchEvent(new Event("safesteps_progress_changed"));
    router.push("/login");
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
    if (users[email]) {
      // Simulate password reset notification
      return true;
    }
    return false;
  };

  const addActivity = (action: string) => {
    const timeText = "Just now";
    if (isGuest) {
      // In Guest mode, we don't save activity stack heavily but we can log
    } else if (user) {
      const users = JSON.parse(localStorage.getItem("safesteps_users") || "{}");
      const found = users[user.email];
      if (found) {
        const newAct = [{ time: timeText, action }, ...found.recentActivity.slice(0, 8)];
        found.recentActivity = newAct;
        users[user.email] = found;
        localStorage.setItem("safesteps_users", JSON.stringify(users));
        setUser({ ...found });
      }
    }
  };

  const unlockAchievement = (achievementId: string) => {
    const saved = JSON.parse(localStorage.getItem("safesteps_achievements") || "[]");
    if (saved.includes(achievementId)) return;

    const updated = [...saved, achievementId];
    localStorage.setItem("safesteps_achievements", JSON.stringify(updated));
    
    // Dispatch safety changes
    window.dispatchEvent(new Event("safesteps_progress_changed"));
    
    // Dispatch custom event for visual toast/alert popup
    window.dispatchEvent(new CustomEvent("safesteps_achievement_unlocked", { detail: { id: achievementId } }));
  };

  // Route protection
  useEffect(() => {
    if (isLoading) return;
    const session = localStorage.getItem("safesteps_session");
    if (!session && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [pathname, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoading,
        login,
        signup,
        loginGuest,
        logout,
        resetPassword,
        addActivity,
        unlockAchievement
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
