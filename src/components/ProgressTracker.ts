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

const CHECKS_KEY = "safesteps_completed_checks";
const LESSONS_KEY = "safesteps_completed_lessons";
const SUPPORT_KEY = "safesteps_support_completed";

export function getCompletedChecks(): CompletedChecks {
  if (typeof window === "undefined") {
    return { password: false, scam: false, privacy: false, browser: false };
  }
  try {
    const data = localStorage.getItem(CHECKS_KEY);
    return data ? JSON.parse(data) : { password: false, scam: false, privacy: false, browser: false };
  } catch {
    return { password: false, scam: false, privacy: false, browser: false };
  }
}

export function markCheckCompleted(checkId: keyof CompletedChecks, completed: boolean = true) {
  if (typeof window === "undefined") return;
  const current = getCompletedChecks();
  current[checkId] = completed;
  localStorage.setItem(CHECKS_KEY, JSON.stringify(current));
  // Dispatch custom event to notify other components on the page
  window.dispatchEvent(new Event("safesteps_progress_changed"));
}

export function getCompletedLessons(): CompletedLessons {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const data = localStorage.getItem(LESSONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function markLessonCompleted(lessonId: string, completed: boolean = true) {
  if (typeof window === "undefined") return;
  const current = getCompletedLessons();
  current[lessonId] = completed;
  localStorage.setItem(LESSONS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("safesteps_progress_changed"));
}

export function getSupportCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SUPPORT_KEY) === "true";
}

export function setSupportCompleted(completed: boolean = true) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUPPORT_KEY, completed ? "true" : "false");
  window.dispatchEvent(new Event("safesteps_progress_changed"));
}

export function calculateSafetyScore(): number {
  const checks = getCompletedChecks();
  const lessons = getCompletedLessons();
  const support = getSupportCompleted();

  let score = 0;

  // 4 checks: 15% each = 60% max
  if (checks.password) score += 15;
  if (checks.scam) score += 15;
  if (checks.privacy) score += 15;
  if (checks.browser) score += 15;

  // 10 lessons: 3.5% each = 35% max (HUB-001 to HUB-010)
  const lessonIds = [
    "HUB-001", "HUB-002", "HUB-003", "HUB-004", "HUB-005",
    "HUB-006", "HUB-007", "HUB-008", "HUB-009", "HUB-010"
  ];
  let completedLessonsCount = 0;
  lessonIds.forEach((id) => {
    if (lessons[id]) completedLessonsCount++;
  });
  score += completedLessonsCount * 3.5;

  // Support interaction: 5%
  if (support) score += 5;

  // Default baseline of 20% so it's not starting at 0%
  return Math.min(100, Math.max(20, Math.round(score)));
}

export function resetAllProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKS_KEY);
  localStorage.removeItem(LESSONS_KEY);
  localStorage.removeItem(SUPPORT_KEY);
  window.dispatchEvent(new Event("safesteps_progress_changed"));
}
