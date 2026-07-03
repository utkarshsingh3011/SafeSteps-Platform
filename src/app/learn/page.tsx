"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  RotateCcw,
  AlertTriangle,
  LockKeyhole,
  ChevronRight
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import Confetti from "@/components/Confetti";
import {
  CURRICULUM,
  Unit,
  Lesson,
  CaseStudy
} from "@/data/curriculum";
import {
  getCompletedActivities,
  getCompletedQuizzes,
  getCompletedCases,
  markActivityCompleted,
  markQuizCompleted,
  markCaseCompleted
} from "@/components/ProgressTracker";

export default function LearnPage() {
  const { showToast } = useToast();
  const [selectedUnitId, setSelectedUnitId] = useState<string>("unit-1");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"learn" | "practice" | "quiz">("learn");
  const [showCaseStudy, setShowCaseStudy] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Progress states
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [completedCases, setCompletedCases] = useState<Record<string, boolean>>({});

  // Reload progress helper
  const reloadProgress = () => {
    setCompletedActivities(getCompletedActivities());
    setCompletedQuizzes(getCompletedQuizzes());
    setCompletedCases(getCompletedCases());
  };

  useEffect(() => {
    setTimeout(() => {
      reloadProgress();
    }, 0);
    window.addEventListener("safesteps_progress_changed", reloadProgress);
    return () => {
      window.removeEventListener("safesteps_progress_changed", reloadProgress);
    };
  }, []);

  const activeUnit = CURRICULUM.find((u) => u.id === selectedUnitId) || CURRICULUM[0];
  const activeLesson = activeUnit.lessons.find((l) => l.id === selectedLessonId) || null;

  // Calculate unit completion percentage
  const getUnitProgress = (unit: Unit) => {
    const totalLessons = unit.lessons.length;
    let completed = 0;
    unit.lessons.forEach((l) => {
      if (completedQuizzes[l.id] && completedActivities[l.id]) {
        completed++;
      }
    });
    
    // Case study adds weight too
    const caseDone = completedCases[unit.id];
    const totalItems = totalLessons + 1;
    const completedItems = completed + (caseDone ? 1 : 0);

    return Math.round((completedItems / totalItems) * 100);
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowCaseStudy(false);
    setActiveTab("learn");
  };

  const handleCaseStudySelect = () => {
    setShowCaseStudy(true);
    setSelectedLessonId(null);
  };

  // Check if case study is locked for active unit
  const isCaseStudyLocked = () => {
    return activeUnit.lessons.some((l) => !completedQuizzes[l.id] || !completedActivities[l.id]);
  };

  // Confetti trigger
  const triggerCelebration = (message: string) => {
    setShowConfetti(true);
    showToast(message, "success");
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {showConfetti && <Confetti active={showConfetti} />}

      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-white">Your Learning Path</h1>
        <p className="text-on-surface-variant text-sm mt-1 font-inter">
          Progress through structured, easy-to-understand units to become a master of digital safety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Unit list (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
            Curriculum Units
          </h2>
          
          <div className="space-y-4">
            {CURRICULUM.map((unit) => {
              const isActive = unit.id === selectedUnitId;
              const progress = getUnitProgress(unit);
              
              return (
                <div
                  key={unit.id}
                  onClick={() => {
                    setSelectedUnitId(unit.id);
                    setSelectedLessonId(null);
                    setShowCaseStudy(false);
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "border-cyan-400/50 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 shadow-md shadow-cyan-950/10"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[9px] text-cyan-400 font-bold bg-cyan-950/20 border border-cyan-400/20 px-2 py-0.5 rounded-full uppercase">
                        {unit.id.toUpperCase()}
                      </span>
                      <h3 className="font-outfit font-bold text-white text-base mt-2 group-hover:text-cyan-400 transition-colors">
                        {unit.title}
                      </h3>
                      <div className="flex gap-3 text-[11px] text-on-surface-variant mt-1.5 font-inter">
                        <span>Difficulty: {unit.difficulty}</span>
                        <span>•</span>
                        <span>Est: {unit.estimatedTime}</span>
                      </div>
                    </div>
                    {progress === 100 && (
                      <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                      <span>COMPLETION:</span>
                      <span className="text-white font-bold">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lessons and active content pane (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* If no lesson or case study is active: show the unit outline details */}
          {!activeLesson && !showCaseStudy && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Panel title={activeUnit.title} idTag={activeUnit.id.toUpperCase()} noHoverAnim={true} topBorderColor="cyan">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-outfit font-bold text-white text-lg">Unit Syllabus</h3>
                    <p className="text-xs text-on-surface-variant mt-1 font-inter">
                      Read each lesson, pass the quick interactive activities, and pass the quizzes to unlock the real-world case study.
                    </p>
                  </div>

                  {/* Syllabus lists */}
                  <div className="space-y-3">
                    {activeUnit.lessons.map((lesson, idx) => {
                      const isActivityDone = completedActivities[lesson.id];
                      const isQuizDone = completedQuizzes[lesson.id];

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleLessonSelect(lesson.id)}
                          className="p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 border border-white/10 bg-white/5 flex items-center justify-center text-cyan-400 rounded-xl group-hover:border-cyan-400/50 transition-colors">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-cyan-400/70 tracking-wide font-bold uppercase block">
                                Lesson {idx + 1}
                              </span>
                              <h4 className="font-outfit font-bold text-white text-sm mt-0.5 group-hover:text-cyan-400 transition-colors">
                                {lesson.title}
                              </h4>
                              <p className="text-on-surface-variant text-[11px] font-inter mt-0.5 max-w-md line-clamp-1">
                                {lesson.summary}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end font-mono text-[9px] text-on-surface-variant">
                              <span className={isActivityDone ? "text-emerald-400" : "text-white/40"}>
                                Activity: {isActivityDone ? "✓ DONE" : "○ PENDING"}
                              </span>
                              <span className={isQuizDone ? "text-emerald-400" : "text-white/40"}>
                                Quiz: {isQuizDone ? "✓ DONE" : "○ PENDING"}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors" />
                          </div>
                        </div>
                      );
                    })}

                    {/* Case Study Card */}
                    {(() => {
                      const isLocked = isCaseStudyLocked();
                      const isDone = completedCases[activeUnit.id];

                      return (
                        <div
                          onClick={() => !isLocked && handleCaseStudySelect()}
                          className={`p-4 border rounded-2xl flex items-center justify-between transition-all ${
                            isLocked
                              ? "border-white/5 bg-white/[0.005] opacity-40 cursor-not-allowed"
                              : "border-amber-500/20 bg-amber-950/5 hover:bg-amber-950/10 hover:border-amber-500/40 cursor-pointer group"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 border flex items-center justify-center rounded-xl transition-colors ${
                              isLocked 
                                ? "border-white/5 bg-white/5 text-white/20" 
                                : "border-amber-400/20 bg-amber-950/20 text-amber-400 group-hover:border-amber-400/50"
                            }`}>
                              {isLocked ? <LockKeyhole className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-amber-400 tracking-wide font-bold uppercase block">
                                Unit Case Study
                              </span>
                              <h4 className="font-outfit font-bold text-white text-sm mt-0.5 group-hover:text-amber-400 transition-colors">
                                {activeUnit.caseStudy.title}
                              </h4>
                              <p className="text-on-surface-variant text-[11px] font-inter mt-0.5 max-w-md line-clamp-1">
                                {isLocked ? "Solve all unit lessons to unlock this real-world story." : activeUnit.caseStudy.background}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end font-mono text-[9px] text-on-surface-variant">
                              <span className={isDone ? "text-emerald-400" : isLocked ? "text-white/20" : "text-amber-400"}>
                                {isDone ? "✓ SOLVED" : isLocked ? "🔒 LOCKED" : "▶ START"}
                              </span>
                            </div>
                            {!isLocked && <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-amber-400 transition-colors" />}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Panel>
            </motion.div>
          )}

          {/* Active Lesson Frame */}
          {activeLesson && !showCaseStudy && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedLessonId(null)}
                  className="font-mono text-xs text-on-surface-variant hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  ← BACK TO UNIT SYLLABUS
                </button>
                <div className="flex gap-2">
                  <span className="text-[10px] text-on-surface-variant font-mono">{activeLesson.difficulty}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">•</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">{activeLesson.readTime}</span>
                </div>
              </div>

              {/* Lesson Tabs */}
              <div className="flex border-b border-white/5">
                {(["learn", "practice", "quiz"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const labelMap = { learn: "1. Learn Details", practice: "2. Hands-on Practice", quiz: "3. Quick Quiz" };
                  
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-on-surface-variant hover:text-white"
                      }`}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Tab contents */}
              <div className="min-h-[400px]">
                {activeTab === "learn" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <Panel title={activeLesson.title} idTag={activeLesson.id.toUpperCase()} noHoverAnim={true}>
                      <div className="space-y-6">
                        <div className="font-inter text-sm md:text-[15px] leading-relaxed text-white space-y-4">
                          <p>{activeLesson.explanation}</p>
                        </div>

                        {/* ASCII Illustration */}
                        <div className="space-y-1.5">
                          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider font-bold block">
                            Visual Diagram
                          </span>
                          <pre className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-[10px] text-cyan-400 overflow-x-auto whitespace-pre leading-relaxed">
                            {activeLesson.illustration}
                          </pre>
                        </div>

                        {/* Takeaways list */}
                        <div className="space-y-3 pt-2">
                          <h4 className="font-outfit font-bold text-white text-sm">Key Lessons to Remember</h4>
                          <ul className="space-y-2 text-xs text-on-surface-variant font-inter">
                            {activeLesson.takeaways.map((takeaway, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                          <Button variant="friendly" onClick={() => setActiveTab("practice")} icon={<ArrowRight className="w-4 h-4" />}>
                            Go to Practice Activity
                          </Button>
                        </div>
                      </div>
                    </Panel>
                  </motion.div>
                )}

                {activeTab === "practice" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <Panel title={activeLesson.activity.title} idTag="HANDS-ON PRACTICE" noHoverAnim={true}>
                      <div className="space-y-6">
                        <p className="text-xs text-on-surface-variant font-inter leading-relaxed">
                          {activeLesson.activity.instructions}
                        </p>

                        <div className="bg-black/20 border border-white/5 p-6 rounded-2xl">
                          {/* Dynamically Render the Interactive Activity */}
                          <InteractiveActivityRenderer
                            lessonId={activeLesson.id}
                            activity={activeLesson.activity}
                            onComplete={() => {
                              markActivityCompleted(activeLesson.id);
                              triggerCelebration("Practice completed! Unlocked lesson quiz.");
                              setActiveTab("quiz");
                            }}
                            isCompleted={completedActivities[activeLesson.id]}
                          />
                        </div>
                      </div>
                    </Panel>
                  </motion.div>
                )}

                {activeTab === "quiz" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <Panel title="Interactive Lesson Quiz" idTag="MINI QUIZ" noHoverAnim={true}>
                      <QuizRenderer
                        lesson={activeLesson}
                        isCompleted={completedQuizzes[activeLesson.id]}
                        onPassed={() => {
                          markQuizCompleted(activeLesson.id);
                          triggerCelebration("Passed! Lesson secured successfully. 🎉");
                          setSelectedLessonId(null);
                        }}
                      />
                    </Panel>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Active Case Study Frame */}
          {showCaseStudy && !activeLesson && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowCaseStudy(false)}
                  className="font-mono text-xs text-on-surface-variant hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  ← BACK TO UNIT SYLLABUS
                </button>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/20 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  UNIT FINAL CASE STUDY
                </span>
              </div>

              <Panel title={activeUnit.caseStudy.title} idTag="REAL WORLD CASE" noHoverAnim={true} topBorderColor="emerald">
                <CaseStudyRenderer
                  unitId={activeUnit.id}
                  caseStudy={activeUnit.caseStudy}
                  isCompleted={completedCases[activeUnit.id]}
                  onComplete={() => {
                    markCaseCompleted(activeUnit.id);
                    triggerCelebration(`Unit "${activeUnit.title}" Mastered! Badge unlocked! 🎓`);
                    setShowCaseStudy(false);
                  }}
                />
              </Panel>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// Quiz Rendering Component
// ----------------------------------------------------
interface QuizRendererProps {
  lesson: Lesson;
  isCompleted: boolean;
  onPassed: () => void;
}

function QuizRenderer({ lesson, isCompleted, onPassed }: QuizRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [gradePassed, setGradePassed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSubmitted(isCompleted);
      setGradePassed(isCompleted);
      if (isCompleted) {
        // Auto select correct answers to display
        const autos: Record<number, number> = {};
        lesson.quiz.forEach((q, idx) => {
          autos[idx] = q.correctAnswer;
        });
        setSelectedAnswers(autos);
      } else {
        setSelectedAnswers({});
      }
    }, 0);
  }, [lesson, isCompleted]);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleSubmit = () => {
    // Check all answered
    if (Object.keys(selectedAnswers).length < lesson.quiz.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const allCorrect = lesson.quiz.every((q, idx) => selectedAnswers[idx] === q.correctAnswer);
    setSubmitted(true);
    setGradePassed(allCorrect);

    if (allCorrect) {
      onPassed();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setGradePassed(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {lesson.quiz.map((q, qIdx) => (
          <div key={qIdx} className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-inter">
              Q{qIdx + 1}: {q.q}
            </h4>
            
            <div className="flex flex-col gap-2 font-inter text-xs">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[qIdx] === optIdx;
                const isCorrect = optIdx === q.correctAnswer;
                
                let btnClass = "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-on-surface-variant hover:text-white";
                
                if (isSelected) {
                  if (submitted) {
                    btnClass = isCorrect
                      ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold"
                      : "border-red-500 bg-red-950/20 text-red-400 font-bold";
                  } else {
                    btnClass = "border-cyan-400 bg-cyan-950/20 text-cyan-400 font-bold";
                  }
                } else if (submitted && isCorrect) {
                  btnClass = "border-emerald-500/50 bg-emerald-950/10 text-emerald-400";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(qIdx, optIdx)}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all cursor-pointer ${btnClass}`}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            
            {submitted && isSelectedIncorrect(selectedAnswers[qIdx], q.correctAnswer) && q.explanation && (
              <p className="text-[11px] text-red-400/90 font-inter bg-red-950/5 border border-red-950/30 p-2.5 rounded-lg leading-relaxed">
                💡 Hint: {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        {submitted ? (
          gradePassed ? (
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 animate-bounce" />
              <span>Passed // All Answers Correct</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Failed // Some answers were incorrect</span>
              </div>
              <button onClick={handleReset} className="text-xs text-cyan-400 font-mono underline hover:text-cyan-300">
                Try Again
              </button>
            </div>
          )
        ) : (
          <Button
            variant="action"
            onClick={handleSubmit}
            className="ml-auto"
            disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
          >
            Submit Answers
          </Button>
        )}
      </div>
    </div>
  );
}

function isSelectedIncorrect(selected: number | undefined, correct: number): boolean {
  return selected !== undefined && selected !== correct;
}

// ----------------------------------------------------
// Case Study Rendering Component
// ----------------------------------------------------
interface CaseStudyRendererProps {
  unitId: string;
  caseStudy: CaseStudy;
  isCompleted: boolean;
  onComplete: () => void;
}

function CaseStudyRenderer({ unitId, caseStudy, isCompleted, onComplete }: CaseStudyRendererProps) {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSubmitted(isCompleted);
      setIsCorrect(isCompleted);
      if (isCompleted) {
        setSelectedOpt(caseStudy.correctAnswer);
      } else {
        setSelectedOpt(null);
      }
    }, 0);
  }, [caseStudy, isCompleted]);

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    const correct = selectedOpt === caseStudy.correctAnswer;
    setSubmitted(true);
    setIsCorrect(correct);
    if (correct) {
      onComplete();
    }
  };

  const handleReset = () => {
    setSelectedOpt(null);
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Background & Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/5 pb-6">
        <div className="space-y-2.5 font-inter text-xs leading-relaxed text-white">
          <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-wider block">Background Context</span>
          <p className="bg-white/[0.01] border border-white/5 p-4 rounded-xl italic">&quot;{caseStudy.background}&quot;</p>
          <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider block mt-4">The Story</span>
          <p className="text-on-surface-variant">{caseStudy.story}</p>
        </div>

        {/* Timeline checklist */}
        <div className="space-y-4 font-inter text-xs">
          <span className="font-mono text-[9px] text-red-400 font-bold uppercase tracking-wider block">Chronological Timeline</span>
          <div className="space-y-3 bg-black/20 border border-white/5 p-4 rounded-xl">
            {caseStudy.timeline.map((step, idx) => (
              <div key={idx} className="flex gap-2.5">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">{idx + 1}.</span>
                <span className="text-on-surface-variant text-[11px] leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3 font-inter text-xs border-b border-white/5 pb-6">
        <span className="font-mono text-[9px] text-red-400 font-bold uppercase tracking-wider block">Key Mistakes Made</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {caseStudy.mistakes.map((mistake, idx) => (
            <div key={idx} className="p-3 bg-red-950/5 border border-red-500/10 rounded-xl flex items-start gap-2 text-on-surface-variant">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span>{mistake}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive question */}
      <div className="space-y-4 pt-2">
        <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Interactive Review Question</span>
        <h4 className="text-sm font-semibold text-white font-inter">{caseStudy.question}</h4>
        
        <div className="flex flex-col gap-2 font-inter text-xs">
          {caseStudy.options.map((opt, optIdx) => {
            const isSelected = selectedOpt === optIdx;
            const isCorrectAnswer = optIdx === caseStudy.correctAnswer;
            
            let btnClass = "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-on-surface-variant hover:text-white";
            
            if (isSelected) {
              if (submitted) {
                btnClass = isCorrectAnswer
                  ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold"
                  : "border-red-500 bg-red-950/20 text-red-400 font-bold";
              } else {
                btnClass = "border-cyan-400 bg-cyan-950/20 text-cyan-400 font-bold";
              }
            } else if (submitted && isCorrectAnswer) {
              btnClass = "border-emerald-500/50 bg-emerald-950/10 text-emerald-400";
            }

            return (
              <button
                key={optIdx}
                onClick={() => !submitted && setSelectedOpt(optIdx)}
                className={`w-full text-left p-3.5 border rounded-xl transition-all cursor-pointer ${btnClass}`}
                disabled={submitted}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border font-inter text-xs leading-relaxed ${
              isCorrect
                ? "border-emerald-500/25 bg-emerald-950/5 text-emerald-400/90"
                : "border-red-500/25 bg-red-950/5 text-red-400/90"
            }`}
          >
            <p className="font-bold uppercase font-mono tracking-wide text-[10px] mb-1">
              {isCorrect ? "Correct Explanation:" : "Incorrect Response:"}
            </p>
            <p>{caseStudy.explanation}</p>
          </motion.div>
        )}
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
        {submitted ? (
          isCorrect ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>CASE STUDY COMPLETED successfully</span>
              </div>
              <div className="bg-emerald-950/5 border border-emerald-500/10 p-4 rounded-xl mt-2 font-inter text-xs">
                <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider block mb-2">Lessons Learned</span>
                <ul className="space-y-1.5 text-on-surface-variant">
                  {caseStudy.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Incorrect Answer</span>
              </div>
              <button onClick={handleReset} className="text-xs text-cyan-400 font-mono underline hover:text-cyan-300">
                Try Again
              </button>
            </div>
          )
        ) : (
          <Button
            variant="action"
            onClick={handleSubmit}
            className="ml-auto"
            disabled={selectedOpt === null}
          >
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Interactive Activities Inner Renderer
// ----------------------------------------------------
interface ActivityProps {
  lessonId: string;
  activity: unknown;
  onComplete: () => void;
  isCompleted: boolean;
}

function InteractiveActivityRenderer({ lessonId, onComplete, isCompleted }: ActivityProps) {
  
  // Render specific layout based on lesson ID
  switch (lessonId) {
    case "lesson-1-1": // Password strength activity
      return <PasswordStrengthActivity onComplete={onComplete} isCompleted={isCompleted} />;
    
    case "lesson-1-3": // Password generator activity
      return <PasswordGeneratorActivity onComplete={onComplete} isCompleted={isCompleted} />;
    
    case "lesson-2-1": // Compare Emails activity
      return <CompareEmailsActivity onComplete={onComplete} isCompleted={isCompleted} />;
    
    case "lesson-3-2": // Spot Fake Screenshots activity
      return <SpotFakeScreenshotsActivity onComplete={onComplete} isCompleted={isCompleted} />;
    
    case "lesson-4-1": // Browser permissions review
      return <PermissionsAuditActivity onComplete={onComplete} isCompleted={isCompleted} />;

    default:
      // Generic checkbox checklist for other lessons
      return <GenericChecklistActivity onComplete={onComplete} isCompleted={isCompleted} />;
  }
}

// --- PASSWORD STRENGTH INTERACTIVE ACTIVITY ---
function PasswordStrengthActivity({ onComplete, isCompleted }: { onComplete: () => void; isCompleted: boolean }) {
  const [pass, setPass] = useState("");
  const [entropy, setEntropy] = useState(0);
  const [crackTime, setCrackTime] = useState("0 seconds");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isPassed, setIsPassed] = useState(false);

  const calculatePasswordStrength = (val: string) => {
    setPass(val);
    if (!val) {
      setEntropy(0);
      setCrackTime("0 seconds");
      setFeedback([]);
      setIsPassed(false);
      return;
    }

    let points = 0;
    const tips: string[] = [];

    // Length check
    if (val.length >= 16) {
      points += 4;
    } else if (val.length >= 12) {
      points += 2;
      tips.push("Make it longer (16+ characters) for supreme safety.");
    } else {
      tips.push("Crucial: Passwords under 12 characters are guessed quickly.");
    }

    // Complexity checks (only to test if user added variation, but emphasize length)
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasDigit = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    
    const charSets = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
    points += charSets;

    // Passphrase check (e.g. hyphens or spaces indicating word lists)
    const isPassphrase = val.includes("-") || val.includes(" ");
    if (isPassphrase && val.length >= 15) {
      points += 3;
    }

    // Common passwords filter
    const lowerVal = val.toLowerCase();
    const isCommon = ["password", "123456", "admin", "welcome", "iloveyou"].some(c => lowerVal.includes(c));
    if (isCommon) {
      points = Math.max(0, points - 5);
      tips.push("Warning: Uses a highly common word. Automated tools guess this in milliseconds.");
    }

    setEntropy(points);
    setFeedback(tips);

    // Calculate simulated guess times
    let timeStr = "Instantly";
    if (points === 0) timeStr = "Instantly";
    else if (points <= 2) timeStr = "2.5 Seconds";
    else if (points <= 4) timeStr = "12 Minutes";
    else if (points <= 6) timeStr = "4 Days";
    else if (points <= 7) timeStr = "45 Years";
    else timeStr = "Trillions of Years";
    
    setCrackTime(timeStr);

    const passed = points >= 7;
    setIsPassed(passed);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="font-mono text-[10px] text-cyan-400 block font-bold uppercase">Enter Password to Test:</label>
        <input
          type="text"
          value={pass}
          onChange={(e) => calculatePasswordStrength(e.target.value)}
          placeholder="e.g. apple-river-staple-sunset"
          className="w-full bg-cyber-bg border border-white/10 px-4 py-3 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
          disabled={isCompleted}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-3 border border-white/5 bg-white/[0.01] rounded-xl">
          <span className="text-on-surface-variant block uppercase text-[10px]">Estimated Guess Time:</span>
          <span className={`text-sm font-bold block mt-1 ${isPassed ? "text-emerald-400" : "text-amber-400"}`}>
            {crackTime}
          </span>
        </div>
        <div className="p-3 border border-white/5 bg-white/[0.01] rounded-xl">
          <span className="text-on-surface-variant block uppercase text-[10px]">Security Category:</span>
          <span className={`text-sm font-bold block mt-1 ${isPassed ? "text-emerald-400" : "text-amber-400"}`}>
            {isPassed ? "Highly Secure" : "Vulnerable"}
          </span>
        </div>
      </div>

      {feedback.length > 0 && (
        <div className="space-y-1.5 font-inter text-xs text-amber-400 leading-relaxed">
          {feedback.map((tip, idx) => (
            <p key={idx}>⚠️ {tip}</p>
          ))}
        </div>
      )}

      {isPassed && !isCompleted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 flex justify-end">
          <Button variant="action" onClick={onComplete}>
            Complete Activity
          </Button>
        </motion.div>
      )}

      {isCompleted && (
        <p className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider text-center">
          ✓ Activity Verified Secure
        </p>
      )}
    </div>
  );
}

// --- PASSWORD GENERATOR INTERACTIVE ACTIVITY ---
function PasswordGeneratorActivity({ onComplete, isCompleted }: { onComplete: () => void; isCompleted: boolean }) {
  const { showToast } = useToast();
  const [pwd, setPwd] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    // Generate secure passphrase from random word list
    const words = [
      "sunset", "galaxy", "window", "river", "forest", "shadow", "winter", "summer", "autumn", 
      "spring", "whisper", "guitar", "castle", "bridge", "desert", "planet", "valley", "ocean",
      "pancake", "turtle", "journey", "blanket", "harvest", "compass", "diamond", "feather"
    ];
    
    // Pick 4 random words
    const chosen: string[] = [];
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * words.length);
      chosen.push(words[idx]);
    }
    
    const generated = chosen.join("-") + "-" + Math.floor(100 + Math.random() * 900);
    setPwd(generated);
  };

  useEffect(() => {
    setTimeout(() => {
      generate();
    }, 0);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    showToast("Password copied to clipboard!", "success");
    setTimeout(() => {
      setCopied(false);
      onComplete();
    }, 1200);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="p-4 bg-cyber-bg border border-white/10 rounded-xl font-mono text-base text-cyan-300 select-all tracking-wider break-all flex justify-between items-center gap-3">
        <span>{pwd}</span>
        <button onClick={generate} className="text-xs text-on-surface-variant hover:text-white" disabled={isCompleted}>
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-[11px] font-inter text-on-surface-variant leading-relaxed">
        Password managers generate random keys like the passphrase above. It&apos;s 28 characters long and virtually impossible for computers to hack, but easy to type.
      </div>

      {!isCompleted ? (
        <Button variant="action" className="w-full" onClick={handleCopy}>
          {copied ? "Copied! ✓" : "Copy to Vault & Proceed"}
        </Button>
      ) : (
        <p className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider mt-2">
          ✓ Password Saved to Mock Vault
        </p>
      )}
    </div>
  );
}

// --- COMPARE EMAILS INTERACTIVE ACTIVITY ---
function CompareEmailsActivity({ onComplete, isCompleted: _isCompleted }: { onComplete: () => void; isCompleted: boolean }) {
  const [spottedIndicators, setSpottedIndicators] = useState<string[]>([]);
  const [selectedScam, setSelectedScam] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [explainText, setExplainText] = useState("");

  const phishingIndicators = [
    { id: "sender", label: "Sender Domain: 'paypal-security.com' is not official paypal.com." },
    { id: "subject", label: "Artificial Urgency: Threatening to block account in 2 hours." },
    { id: "grammar", label: "Grammar Mistake: 'We was noticed suspicious syncs' is poor English." },
    { id: "link", label: "Sketchy Link: http://192.168.1.5/verify-paypal leads to a private IP, not PayPal." }
  ];

  const handleIndicatorClick = (id: string) => {
    if (checked) return;
    if (spottedIndicators.includes(id)) {
      setSpottedIndicators(prev => prev.filter(i => i !== id));
    } else {
      setSpottedIndicators(prev => [...prev, id]);
    }
  };

  const handleSelectScam = (side: "left" | "right") => {
    if (checked) return;
    setSelectedScam(side);
  };

  const handleCheck = () => {
    if (selectedScam === "right" && spottedIndicators.length >= 2) {
      setChecked(true);
      setExplainText("Correct! Email 2 is the phishing attempt. The sender domain uses an lookalike, the link leads to an unofficial IP address, it threatens an immediate account lock, and contains spelling errors.");
      onComplete();
    } else {
      alert("Try finding at least 2 suspicious elements in the fake email (right side) and select it as the scam!");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Real Email (Left) */}
        <div className="border border-white/10 bg-cyber-bg/40 p-4 rounded-xl space-y-3 opacity-80">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
            <span>Email 1: Verified Official</span>
          </div>
          
          <div className="space-y-1 font-mono text-[10px] text-on-surface-variant border-b border-white/5 pb-2">
            <div>From: PayPal Support &lt;support@paypal.com&gt;</div>
            <div>Subject: Your monthly PayPal account summary</div>
          </div>
          <div className="font-inter text-xs text-white leading-relaxed space-y-2">
            <p>Dear Jane Doe,</p>
            <p>Your monthly transaction statement for June is now ready to view. To access your ledger, please log into your account securely on our website.</p>
            <p>Visit: <span className="text-blue-400 underline">https://www.paypal.com/signin</span></p>
          </div>
        </div>

        {/* Fake Email (Right) */}
        <div className={`border p-4 rounded-xl space-y-3 transition-all ${
          selectedScam === "right" ? "border-cyan-400 bg-cyan-950/5" : "border-white/10 bg-cyber-bg/40"
        }`} onClick={() => handleSelectScam("right")}>
          <div className="flex justify-between items-center">
            <span className="text-amber-400 text-[10px] font-mono uppercase font-bold tracking-wider">
              Email 2: Check for Scams
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono">Click suspicious elements:</span>
          </div>
          
          <div className="space-y-1.5 font-mono text-[10px] border-b border-white/5 pb-2">
            <div 
              onClick={(e) => { e.stopPropagation(); handleIndicatorClick("sender"); }}
              className={`p-1 rounded cursor-pointer transition-colors ${
                spottedIndicators.includes("sender") ? "bg-red-500/20 text-red-300 font-bold border border-red-500/40" : "hover:bg-white/5 text-on-surface-variant"
              }`}
            >
              From: PayPal billing &lt;support@paypal-security.com&gt;
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); handleIndicatorClick("subject"); }}
              className={`p-1 rounded cursor-pointer transition-colors ${
                spottedIndicators.includes("subject") ? "bg-red-500/20 text-red-300 font-bold border border-red-500/40" : "hover:bg-white/5 text-on-surface-variant"
              }`}
            >
              Subject: URGENT: Complete account verification to avoid lock
            </div>
          </div>
          
          <div className="font-inter text-xs text-white leading-relaxed space-y-2">
            <p>Dear Customer,</p>
            <p 
              onClick={(e) => { e.stopPropagation(); handleIndicatorClick("grammar"); }}
              className={`p-1 rounded cursor-pointer transition-colors ${
                spottedIndicators.includes("grammar") ? "bg-red-500/20 text-red-300 font-bold border border-red-500/40" : "hover:bg-white/5"
              }`}
            >
              We was noticed suspicious connection from Eastern Europe. You must verified your account today.
            </p>
            <p 
              onClick={(e) => { e.stopPropagation(); handleIndicatorClick("link"); }}
              className={`p-1 rounded cursor-pointer transition-colors ${
                spottedIndicators.includes("link") ? "bg-red-500/20 text-red-300 font-bold border border-red-500/40" : "hover:bg-white/5 text-blue-400 underline"
              }`}
            >
              Click http://192.168.1.5/verify-paypal to login
            </p>
          </div>
        </div>

      </div>

      {/* Control Actions */}
      <div className="space-y-4">
        <div className="text-xs text-on-surface-variant font-inter">
          <span className="font-bold text-white">Spotted indicators ({spottedIndicators.length} / 4):</span>
          <div className="mt-2 space-y-1">
            {phishingIndicators.map((ind) => (
              <div key={ind.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${spottedIndicators.includes(ind.id) ? "bg-emerald-400" : "bg-white/10"}`} />
                <span className={spottedIndicators.includes(ind.id) ? "text-emerald-400 font-medium" : "text-white/40"}>
                  {ind.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {checked && (
          <div className="bg-emerald-950/5 border border-emerald-500/10 p-4 rounded-xl font-inter text-xs text-emerald-400/90 leading-relaxed">
            {explainText}
          </div>
        )}

        {!checked ? (
          <Button
            variant="action"
            className="w-full"
            onClick={handleCheck}
            disabled={selectedScam !== "right" || spottedIndicators.length < 2}
          >
            Submit Scam Audit
          </Button>
        ) : (
          <p className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider text-center mt-2">
            ✓ Phishing Audit Verified Passed
          </p>
        )}
      </div>

    </div>
  );
}

// --- SPOT FAKE SCREENSHOTS INTERACTIVE ACTIVITY ---
function SpotFakeScreenshotsActivity({ onComplete, isCompleted: _isCompleted }: { onComplete: () => void; isCompleted: boolean }) {
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const hotspots = {
    font: { label: "Font Mismatch", desc: "The transaction ID uses a plain Helvetica font while the rest uses custom Roboto. Fake app templates frequently mess up details like fonts." },
    balance: { label: "Account Balance", desc: "Shows 'Available Balance: $0.00' after transferring $500, indicating a hardcoded display error." },
    timestamp: { label: "Timestamp", desc: "Transaction date shows 2026-07-03 but the system phone time shows 10:22 AM while the receipt shows 3:45 PM. Timestamp mismatches prove it is generated." }
  };

  const handleSelect = (id: keyof typeof hotspots) => {
    setClickedHotspot(id);
  };

  const handleVerify = () => {
    if (!clickedHotspot) return;
    setSubmitted(true);
    onComplete();
  };

  return (
    <div className="space-y-4">
      <div className="border border-white/10 bg-cyber-bg/40 p-4 rounded-xl space-y-4">
        <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">
          UPI Receipt Screenshot Auditor
        </span>
        
        {/* Mock phone screen */}
        <div className="max-w-[280px] mx-auto border-4 border-white/20 rounded-[32px] p-4 bg-[#0A0D14] space-y-4 relative overflow-hidden select-none">
          <div className="flex justify-between items-center text-[10px] text-white/40 font-mono pb-2 border-b border-white/5">
            <span className="text-cyan-400 font-bold">[10:22 AM]</span>
            <span>4G LTE</span>
          </div>

          <div className="text-center py-4 space-y-1">
            <span className="text-xs text-white/55 block">Transferred Successfully to</span>
            <span className="text-white font-bold text-base font-inter">Rajesh Kumar</span>
            <span className="text-emerald-400 font-outfit text-3xl font-extrabold block mt-2">$500.00</span>
          </div>

          <div className="space-y-3 font-mono text-[10px] border-t border-white/5 pt-3">
            {/* Font mismatch hotspot */}
            <div 
              onClick={() => handleSelect("font")}
              className={`p-2 border rounded-lg cursor-pointer ${
                clickedHotspot === "font" ? "border-cyan-400 bg-cyan-950/20" : "border-white/5 bg-white/[0.01]"
              }`}
            >
              <div className="text-white/40">TXN ID:</div>
              <div className="text-cyan-300 font-sans text-xs tracking-wider">TXN9384029410384</div>
            </div>

            {/* Timestamp hotspot */}
            <div 
              onClick={() => handleSelect("timestamp")}
              className={`p-2 border rounded-lg cursor-pointer ${
                clickedHotspot === "timestamp" ? "border-cyan-400 bg-cyan-950/20" : "border-white/5 bg-white/[0.01]"
              }`}
            >
              <div className="text-white/40">Date:</div>
              <div className="text-white font-bold">03 Jul 2026, 03:45 PM</div>
            </div>

            {/* Balance hotspot */}
            <div 
              onClick={() => handleSelect("balance")}
              className={`p-2 border rounded-lg cursor-pointer ${
                clickedHotspot === "balance" ? "border-cyan-400 bg-cyan-950/20" : "border-white/5 bg-white/[0.01]"
              }`}
            >
              <div className="text-white/40">From:</div>
              <div className="text-white">HDFC Bank AC XX39</div>
              <div className="text-white/30 text-[8px] mt-1">Avail Bal: $0.00</div>
            </div>
          </div>
        </div>
      </div>

      {clickedHotspot && (
        <div className="p-3 bg-cyan-950/5 border border-cyan-400/20 rounded-xl font-inter text-xs text-on-surface-variant">
          <span className="font-bold text-white block mb-1">
            ⚠️ {hotspots[clickedHotspot as keyof typeof hotspots].label}:
          </span>
          {hotspots[clickedHotspot as keyof typeof hotspots].desc}
        </div>
      )}

      {!submitted ? (
        <Button
          variant="action"
          className="w-full"
          onClick={handleVerify}
          disabled={!clickedHotspot}
        >
          Confirm Scam Indicator & Pass
        </Button>
      ) : (
        <p className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider text-center mt-2">
          ✓ Fake Screenshot Verification Passed
        </p>
      )}

    </div>
  );
}

// --- PERMISSIONS AUDIT INTERACTIVE ACTIVITY ---
function PermissionsAuditActivity({ onComplete, isCompleted: _isCompleted }: { onComplete: () => void; isCompleted: boolean }) {
  const [choices, setChoices] = useState<Record<string, "allow" | "deny" | null>>({
    flashlight: null,
    navigation: null,
    calculator: null
  });
  const [checked, setChecked] = useState(false);

  const handleChoice = (app: string, action: "allow" | "deny") => {
    if (checked) return;
    setChoices(prev => ({ ...prev, [app]: action }));
  };

  const verify = () => {
    const isCorrect = 
      choices.flashlight === "deny" && 
      choices.navigation === "allow" && 
      choices.calculator === "deny";
      
    if (isCorrect) {
      setChecked(true);
      onComplete();
    } else {
      alert("Verification Failed. Think about app hygiene: flashlight or calculator apps have no business checking your contacts or reading files!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 font-mono text-xs">
        
        {/* Card 1: Flashlight app */}
        <div className="p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white block">1. Flashlight App</span>
            <span className="text-[10px] text-on-surface-variant">Requests: Contacts list & background location</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleChoice("flashlight", "allow")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] ${
                choices.flashlight === "allow" ? "border-red-500 bg-red-950/20 text-red-400 font-bold" : "border-white/5 bg-white/5 text-white/40"
              }`}
              disabled={checked}
            >
              ALLOW
            </button>
            <button 
              onClick={() => handleChoice("flashlight", "deny")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] ${
                choices.flashlight === "deny" ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold" : "border-white/5 bg-white/5 text-white/40"
              }`}
              disabled={checked}
            >
              DENY
            </button>
          </div>
        </div>

        {/* Card 2: Google Maps */}
        <div className="p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white block">2. Google Maps App</span>
            <span className="text-[10px] text-on-surface-variant">Requests: Active GPS location coordinates</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleChoice("navigation", "allow")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] ${
                choices.navigation === "allow" ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold" : "border-white/5 bg-white/5 text-white/40"
              }`}
              disabled={checked}
            >
              ALLOW
            </button>
            <button 
              onClick={() => handleChoice("navigation", "deny")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] ${
                choices.navigation === "deny" ? "border-red-500 bg-red-950/20 text-red-400 font-bold" : "border-white/5 bg-white/5 text-white/40"
              }`}
              disabled={checked}
            >
              DENY
            </button>
          </div>
        </div>

        {/* Card 3: Calculator App */}
        <div className="p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white block">3. Basic Calculator App</span>
            <span className="text-[10px] text-on-surface-variant">Requests: Storage folder & microphone access</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleChoice("calculator", "allow")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] ${
                choices.calculator === "allow" ? "border-red-500 bg-red-950/20 text-red-400 font-bold" : "border-white/5 bg-white/5 text-white/40"
              }`}
              disabled={checked}
            >
              ALLOW
            </button>
            <button 
              onClick={() => handleChoice("calculator", "deny")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] ${
                choices.calculator === "deny" ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold" : "border-white/5 bg-white/5 text-white/40"
              }`}
              disabled={checked}
            >
              DENY
            </button>
          </div>
        </div>

      </div>

      {!checked ? (
        <Button 
          variant="action" 
          className="w-full mt-2" 
          onClick={verify}
          disabled={Object.values(choices).some(v => v === null)}
        >
          Verify Permissions Policy
        </Button>
      ) : (
        <p className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider text-center mt-2">
          ✓ App Permissions Audited Safely
        </p>
      )}
    </div>
  );
}

// --- GENERIC CHECKLIST ACTIVITY ---
function GenericChecklistActivity({ onComplete, isCompleted }: { onComplete: () => void; isCompleted: boolean }) {
  return (
    <div className="space-y-4 text-center">
      <div className="p-4 border border-cyan-400/20 bg-cyan-950/5 rounded-xl font-inter text-xs text-on-surface-variant leading-relaxed">
        To complete this activity, verify you have audited this configuration or read the checklist criteria carefully.
      </div>
      
      {!isCompleted ? (
        <Button variant="action" className="w-full" onClick={onComplete}>
          Verify Audit & Proceed
        </Button>
      ) : (
        <p className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider text-center">
          ✓ Activity Verified Complete
        </p>
      )}
    </div>
  );
}
