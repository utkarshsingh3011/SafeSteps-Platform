"use client";

export interface CompletedChecks {
  password: boolean;
  scam: boolean;
  privacy: boolean;
  browser: boolean;
}

export interface CompletedLessons {
  [lessonId: string]: boolean;
}

export interface CompletedActivities {
  [lessonId: string]: boolean;
}

export interface CompletedQuizzes {
  [lessonId: string]: boolean;
}

export interface CompletedCases {
  [unitId: string]: boolean;
}

export interface CommunityReport {
  id: string;
  category: string;
  title: string;
  description: string;
  location?: string;
  date: string;
  status: "Verified" | "Pending" | "Unverified";
  votes: number;
  commentsCount: number;
  comments: string[];
}

const CHECKS_KEY = "safesteps_completed_checks";
const LESSONS_KEY = "safesteps_completed_lessons";
const ACTIVITIES_KEY = "safesteps_completed_activities";
const QUIZZES_KEY = "safesteps_completed_quizzes";
const CASES_KEY = "safesteps_completed_cases";
const SUPPORT_KEY = "safesteps_support_completed";
const ACHIEVEMENTS_KEY = "safesteps_achievements";
const REPORTS_KEY = "safesteps_community_reports";
const VOTES_KEY = "safesteps_community_votes";

// Helper helper to get items safely from localStorage
function getJSONItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setJSONItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("safesteps_progress_changed"));
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
}

// ----------------------------------------------------
// Lesson Progress
// ----------------------------------------------------
export function getCompletedLessons(): CompletedLessons {
  return getJSONItem<CompletedLessons>(LESSONS_KEY, {});
}

export function markLessonCompleted(lessonId: string, completed: boolean = true) {
  const current = getCompletedLessons();
  current[lessonId] = completed;
  setJSONItem(LESSONS_KEY, current);
}

// ----------------------------------------------------
// Activity Progress
// ----------------------------------------------------
export function getCompletedActivities(): CompletedActivities {
  return getJSONItem<CompletedActivities>(ACTIVITIES_KEY, {});
}

export function markActivityCompleted(lessonId: string, completed: boolean = true) {
  const current = getCompletedActivities();
  current[lessonId] = completed;
  setJSONItem(ACTIVITIES_KEY, current);
  checkAndUnlockBadges();
}

// ----------------------------------------------------
// Quiz Progress
// ----------------------------------------------------
export function getCompletedQuizzes(): CompletedQuizzes {
  return getJSONItem<CompletedQuizzes>(QUIZZES_KEY, {});
}

export function markQuizCompleted(lessonId: string, completed: boolean = true) {
  const current = getCompletedQuizzes();
  current[lessonId] = completed;
  setJSONItem(QUIZZES_KEY, current);
  checkAndUnlockBadges();
}

// ----------------------------------------------------
// Case Study Progress
// ----------------------------------------------------
export function getCompletedCases(): CompletedCases {
  return getJSONItem<CompletedCases>(CASES_KEY, {});
}

export function markCaseCompleted(unitId: string, completed: boolean = true) {
  const current = getCompletedCases();
  current[unitId] = completed;
  setJSONItem(CASES_KEY, current);
  checkAndUnlockBadges();
}

// ----------------------------------------------------
// Support Completed
// ----------------------------------------------------
export function getSupportCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SUPPORT_KEY) === "true";
}

export function setSupportCompleted(completed: boolean = true) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUPPORT_KEY, completed ? "true" : "false");
  window.dispatchEvent(new Event("safesteps_progress_changed"));
}

// ----------------------------------------------------
// Achievements / Badges
// ----------------------------------------------------
export function getUnlockedAchievements(): string[] {
  return getJSONItem<string[]>(ACHIEVEMENTS_KEY, []);
}

export function unlockAchievement(achievementId: string) {
  const current = getUnlockedAchievements();
  if (!current.includes(achievementId)) {
    current.push(achievementId);
    setJSONItem(ACHIEVEMENTS_KEY, current);
    // Dispatch custom event for notifications
    window.dispatchEvent(new CustomEvent("safesteps_achievement_unlocked", { detail: { id: achievementId } }));
  }
}

// ----------------------------------------------------
// Community Reports & Library
// ----------------------------------------------------
const DEFAULT_REPORTS: CommunityReport[] = [
  {
    id: "rep-1",
    category: "UPI Fraud",
    title: "Fake Electricity Bill UPI SMS Request",
    description: "Got an SMS claiming electricity will be disconnected tonight. Asked to call a number and scan a QR code to clear a tiny balance. Almost scanned it!",
    location: "New Delhi",
    date: "2026-07-01",
    status: "Verified",
    votes: 14,
    commentsCount: 2,
    comments: ["I got this exact message too!", "This is a classic trap. Glad you didn't scan it."]
  },
  {
    id: "rep-2",
    category: "Courier Scam",
    title: "Post Office customs update request",
    description: "Received a text claiming a package cannot be delivered until a $1.50 address update fee is paid. URL domain was post-office-delivery-customs.net.",
    location: "Mumbai",
    date: "2026-07-02",
    status: "Verified",
    votes: 8,
    commentsCount: 1,
    comments: ["Always check the domain name!"]
  },
  {
    id: "rep-3",
    category: "WhatsApp Scam",
    title: "Aunt's profile asking for OTP code",
    description: "A hacked profile of my aunt messaged me on WhatsApp asking for a verification code sent to my mobile. Called her directly and she confirmed her account was hijacked.",
    location: "Bangalore",
    date: "2026-07-03",
    status: "Verified",
    votes: 20,
    commentsCount: 3,
    comments: ["Good catch!", "Never share WhatsApp registration codes.", "Always call to verify."]
  },
  {
    id: "rep-4",
    category: "Fake Internship",
    title: "Unsolicited Google Internship Offer",
    description: "Received an email selected for a Google internship without any application or interview. Portal link redirected to a fake login site.",
    location: "Pune",
    date: "2026-06-30",
    status: "Verified",
    votes: 11,
    commentsCount: 1,
    comments: ["Report the URL to Google Safe Browsing."]
  }
];

export function getCommunityReports(): CommunityReport[] {
  if (typeof window === "undefined") return DEFAULT_REPORTS;
  const reports = localStorage.getItem(REPORTS_KEY);
  if (!reports) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  }
  return JSON.parse(reports);
}

export function addCommunityReport(report: Omit<CommunityReport, "id" | "votes" | "commentsCount" | "comments" | "status">) {
  const reports = getCommunityReports();
  const newReport: CommunityReport = {
    ...report,
    id: `rep-${Date.now()}`,
    status: "Pending",
    votes: 0,
    commentsCount: 0,
    comments: []
  };
  reports.unshift(newReport);
  setJSONItem(REPORTS_KEY, reports);
  unlockAchievement("community-reporter");
}

export function voteCommunityReport(reportId: string): number {
  const reports = getCommunityReports();
  const votes = getJSONItem<{ [id: string]: boolean }>(VOTES_KEY, {});
  
  const reportIndex = reports.findIndex((r) => r.id === reportId);
  if (reportIndex === -1) return 0;

  if (votes[reportId]) {
    reports[reportIndex].votes -= 1;
    delete votes[reportId];
  } else {
    reports[reportIndex].votes += 1;
    votes[reportId] = true;
    unlockAchievement("helpful-contributor");
  }

  setJSONItem(REPORTS_KEY, reports);
  setJSONItem(VOTES_KEY, votes);
  return reports[reportIndex].votes;
}

export function getReportVotesMap(): { [id: string]: boolean } {
  return getJSONItem<{ [id: string]: boolean }>(VOTES_KEY, {});
}

export function addReportComment(reportId: string, comment: string) {
  const reports = getCommunityReports();
  const reportIndex = reports.findIndex((r) => r.id === reportId);
  if (reportIndex === -1) return;

  reports[reportIndex].comments.push(comment);
  reports[reportIndex].commentsCount = reports[reportIndex].comments.length;
  setJSONItem(REPORTS_KEY, reports);
  unlockAchievement("helpful-contributor");
}

// ----------------------------------------------------
// Legacy Safety Checks Compatibility Mapping
// ----------------------------------------------------
export function getCompletedChecks(): CompletedChecks {
  const quizzes = getCompletedQuizzes();

  // Map checks to curriculum lesson completions:
  // - password check: True if Lesson 1-1 quiz is completed
  // - scam check: True if Lesson 2-1 (Phishing) quiz is completed
  // - privacy check: True if Lesson 4-1 (Permissions) quiz is completed
  // - browser check: True if Lesson 4-2 (Browser settings) quiz is completed
  return {
    password: !!quizzes["lesson-1-1"],
    scam: !!quizzes["lesson-2-1"],
    privacy: !!quizzes["lesson-4-1"],
    browser: !!quizzes["lesson-4-2"],
  };
}

export function markCheckCompleted(checkId: keyof CompletedChecks, completed: boolean = true) {
  // Legacy function - we can map checkId back to lesson quizzes
  const lessonMapping: Record<keyof CompletedChecks, string> = {
    password: "lesson-1-1",
    scam: "lesson-2-1",
    privacy: "lesson-4-1",
    browser: "lesson-4-2"
  };
  
  markQuizCompleted(lessonMapping[checkId], completed);
  markActivityCompleted(lessonMapping[checkId], completed);
}

// Calculate the total score
export function calculateSafetyScore(): number {
  const quizzes = getCompletedQuizzes();
  const activities = getCompletedActivities();
  const cases = getCompletedCases();

  let score = 0;

  // Let's award:
  // - 5% per lesson explanation read (max 5 * 10 = 50%)
  // - 5% per lesson activity finished (max 5 * 10 = 50%)
  // Wait, let's keep it balanced:
  // Total 12 lessons (2 in each of 6 units)
  // Let's award:
  // - 4% for each lesson quiz passed (12 lessons * 4% = 48%)
  // - 4% for each lesson activity completed (12 lessons * 4% = 48%)
  // - 4% for support page glossary audit (4%)
  
  const lessonIds = [
    "lesson-1-1", "lesson-1-2", "lesson-1-3",
    "lesson-2-1", "lesson-2-2", "lesson-2-3",
    "lesson-3-1", "lesson-3-2",
    "lesson-4-1", "lesson-4-2",
    "lesson-5-1", "lesson-5-2",
    "lesson-6-1", "lesson-6-2"
  ];

  let points = 0;
  lessonIds.forEach((id) => {
    if (quizzes[id]) points += 3.5;
    if (activities[id]) points += 3.5;
  });

  const unitIds = ["unit-1", "unit-2", "unit-3", "unit-4", "unit-5", "unit-6"];
  unitIds.forEach((id) => {
    if (cases[id]) points += 4;
  });

  if (getSupportCompleted()) points += 5;

  score = Math.min(100, Math.max(20, Math.round(points)));
  return score;
}

// ----------------------------------------------------
// Automatic Badge Triggering Logic
// ----------------------------------------------------
export function checkAndUnlockBadges() {
  if (typeof window === "undefined") return;

  const quizzes = getCompletedQuizzes();
  const activities = getCompletedActivities();
  const cases = getCompletedCases();

  // First Lesson Badge
  const quizCount = Object.keys(quizzes).filter(k => quizzes[k]).length;
  if (quizCount >= 1) {
    unlockAchievement("first-lesson");
  }

  // Password Defender Badge (Lesson 1-1, 1-3 completed)
  if (activities["lesson-1-1"] && activities["lesson-1-3"]) {
    unlockAchievement("password-defender");
  }

  // Phishing Detective Badge (Lesson 2-1 activity completed)
  if (activities["lesson-2-1"]) {
    unlockAchievement("phishing-detective");
  }

  // Privacy Explorer Badge (Unit 4 lessons completed)
  if (quizzes["lesson-4-1"] && quizzes["lesson-4-2"]) {
    unlockAchievement("privacy-explorer");
  }

  // Quiz Master Badge (Passed 5 quizzes)
  if (quizCount >= 5) {
    unlockAchievement("quiz-master");
  }

  // Case Study Solver Badge (Completed at least one case study)
  const caseCount = Object.keys(cases).filter(k => cases[k]).length;
  if (caseCount >= 1) {
    unlockAchievement("case-study-solver");
  }

  // 30-Day Learner Badge (All lessons, quizzes, activities, and case studies completed)
  const totalLessons = 14;
  const activityCount = Object.keys(activities).filter(k => activities[k]).length;
  if (quizCount >= totalLessons && activityCount >= totalLessons && caseCount >= 6) {
    unlockAchievement("learner-30");
  }
}

export function resetAllProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKS_KEY);
  localStorage.removeItem(LESSONS_KEY);
  localStorage.removeItem(ACTIVITIES_KEY);
  localStorage.removeItem(QUIZZES_KEY);
  localStorage.removeItem(CASES_KEY);
  localStorage.removeItem(SUPPORT_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
  localStorage.removeItem(REPORTS_KEY);
  localStorage.removeItem(VOTES_KEY);
  
  window.dispatchEvent(new Event("safesteps_progress_changed"));
}
