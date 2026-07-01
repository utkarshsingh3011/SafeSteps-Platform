"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Key,
  Laptop,
  Globe,
  Terminal,
  Eye,
  Download,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Zap,
  CreditCard,
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { markLessonCompleted, getCompletedLessons } from "@/components/ProgressTracker";

interface QuizQuestion {
  q: string;
  options: string[];
  correctAnswer: number;
}

interface HubLesson {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  whatYouWillLearn: string;
  whyItMatters: string;
  practicalActivity: string;
  illustration: string;
  checklists: string[];
  quiz: QuizQuestion[];
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  relatedActivity: string;
  relatedActivityUrl: string;
}

const LESSONS: HubLesson[] = [
  {
    id: "HUB-001",
    category: "getting-started",
    title: "Getting Started with Digital Safety",
    summary: "Learn the basics of digital safety and how to protect yourself online.",
    content: "Digital safety is all about building simple, everyday habits. Just like locking your front door or looking both ways before crossing the street, staying safe online is easy when you know what to watch out for. This project will guide you through the essentials of protecting your accounts, emails, and devices.",
    whatYouWillLearn: "Understand what digital safety means, identify common online threats, and learn how to navigate this platform.",
    whyItMatters: "Every day, we use the internet to study, connect with friends, and shop. Knowing the basics of safety helps you explore the digital world with confidence and peace of mind.",
    practicalActivity: "Review the safety path milestones on the SafeSteps Home dashboard.",
    illustration: `+-------------------------------------------------------------+
| SAFE STEPS LEARNING PATH                                    |
|                                                             |
| Home Dashboard  ===> Complete checks ===> Earn Safety Score |
|       |                                                     |
|       +--- study lessons in hub to get points and badges!  |
+-------------------------------------------------------------+`,
    checklists: [
      "Understand that online safety is built on simple daily habits.",
      "Check your progress meter on the Home page regularly.",
      "Learn topics in order to build up your knowledge step by step.",
    ],
    quiz: [
      {
        q: "What is the best way to maintain digital safety?",
        options: [
          "Buying expensive commercial security software.",
          "Building simple, daily habits like checking links and passwords.",
          "Never using the internet or social media.",
          "Writing down passwords on notebooks.",
        ],
        correctAnswer: 1,
      },
      {
        q: "Why is digital safety important for students?",
        options: [
          "It is required to pass class exams.",
          "It helps protect personal documents, profiles, and online transactions.",
          "It automatically speeds up your home internet connection.",
          "It blocks all websites from showing any advertisements.",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "3 min read",
    difficulty: "Beginner",
    relatedActivity: "Home Dashboard",
    relatedActivityUrl: "/"
  },
  {
    id: "HUB-002",
    category: "passwords",
    title: "Passwords & Authentication",
    summary: "Learn why long passwords made of simple words are safer than short complex ones.",
    content: "Computers guess passwords by running through dictionary lists and combinations at lightning speed. A password containing upper, lower, and special characters like 'P@ssw0rd!' is easily guessable because it is short. Instead, choosing four random common words to create a passphrase (e.g. 'correct-horse-battery-staple') creates a massive character set, making it highly secure yet easy to remember.",
    whatYouWillLearn: "How to choose secure passphrases, avoid simple word lists, and use two-factor authentication (2FA).",
    whyItMatters: "Passwords are the lock on your digital front door. A weak password lets computer programs guess their way inside your accounts in seconds.",
    practicalActivity: "Use the Password Checkup tool to test your password strength.",
    illustration: `+-------------------------------------------------------------+
| BRUTE FORCE GUESS TIME (100 Billion Guesses/Sec)            |
|                                                             |
| "P@ssw0rd!" (8 Chars)       ====> Instantly Cracked         |
| "Tr0ub14!" (8 Chars)        ====> 1.2 Seconds               |
| "correct-horse-battery..."  ====> Trillions of Years        |
+-------------------------------------------------------------+`,
    checklists: [
      "Create passphrases containing at least 15+ characters.",
      "Choose 4 random, simple words instead of typing complex codes.",
      "Use a password manager to securely save your logins.",
    ],
    quiz: [
      {
        q: "Why is a password like 'P@ssw0rd!' considered weak?",
        options: [
          "It does not use special characters.",
          "It is too long to calculate.",
          "It is short and easily guessed by automated hacking programs.",
          "It is difficult for users to remember.",
        ],
        correctAnswer: 2,
      },
      {
        q: "Which of the following password choices is the safest?",
        options: [
          "S3cr3t! (7 characters)",
          "correct-horse-battery-staple (28 characters, random words)",
          "Password123 (11 characters)",
          "Guest_User (10 characters)",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "3 min read",
    difficulty: "Beginner",
    relatedActivity: "Password Checkup",
    relatedActivityUrl: "/safety-checks?tool=password"
  },
  {
    id: "HUB-003",
    category: "phishing",
    title: "How Fake Emails Trick People",
    summary: "Learn how to spot phishing emails and avoid clicking suspicious links.",
    content: "Phishing emails pretend to be from brands you trust, like PayPal or Google. Always check the sender's actual address (e.g., support@paypaI.com using a capital 'I' instead of 'l') rather than just the sender's display name. Look out for artificial urgency prompts requesting immediate actions, and verify link destinations before clicking.",
    whatYouWillLearn: "Spot lookalike email domains, identify urgency tricks, and inspect link destinations.",
    whyItMatters: "Scammers use fake emails to steal passwords or install viruses. Spotting these early keeps your computer and accounts safe.",
    practicalActivity: "Identify fake indicators in the Scam Spotter inbox simulator.",
    illustration: `+-------------------------------------------------------------+
| EMAIL SENDER SPOOFING EXPLAINED                             |
|                                                             |
| DISPLAY NAME:  PayPal Support  <--- Looks friendly          |
| ACTUAL SENDER: support@paypaI-billing.com                   |
|                        ^--- Uses a capital "I" to trick you!|
+-------------------------------------------------------------+`,
    checklists: [
      "Double-check the sender's email spelling character by character.",
      "Be suspicious of urgent warnings (like account closing alerts).",
      "Hover over web links to see where they lead before clicking.",
    ],
    quiz: [
      {
        q: "If the sender display name says 'PayPal' but the email is 'support@paypaI-billing.com', is it safe?",
        options: [
          "Yes, display names are verified.",
          "Yes, it has the word paypal in the text.",
          "No, scammers use lookalike domain names to bypass security inspections.",
          "Only if the email lacks a logo.",
        ],
        correctAnswer: 2,
      },
      {
        q: "What is a common sign of a scam email?",
        options: [
          "A tool to speed up email delivery.",
          "Threatening negative consequences (like account deletion) to force rapid compliance.",
          "Checking routing DKIM values.",
          "Adding a secure encryption lock.",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "4 min read",
    difficulty: "Beginner",
    relatedActivity: "Scam Spotter",
    relatedActivityUrl: "/safety-checks?tool=scam"
  },
  {
    id: "HUB-004",
    category: "browsing",
    title: "HTTPS & Safe Browsing",
    summary: "Find out how the web browser lock icon protects your passwords and messages.",
    content: "Standard HTTP connections transmit data in plain text, making it visible to anyone on the same network. HTTPS encrypts traffic using SSL/TLS, ensuring security. The browser padlock icon verifies that your credentials and page activities are encrypted between your device and the destination server.",
    whatYouWillLearn: "Difference between HTTP and HTTPS, checking the lock icon, and browser security settings.",
    whyItMatters: "Typing passwords or card numbers on unencrypted web pages allows hackers on the same network to intercept them.",
    practicalActivity: "Verify that all pages you browse use secure HTTPS connections.",
    illustration: `+-------------------------------------------------------------+
| HTTPS SESSION ENCRYPTION PIPELINE                           |
|                                                             |
| [User Browser] === (Encrypted Session SSL/TLS) ===> [Server] |
|       ^                                                     |
|       +--- [Wi-Fi Attacker] (Reads only garbage data!)      |
+-------------------------------------------------------------+`,
    checklists: [
      "Check that URLs start with https://, not http://.",
      "Look for the padlock icon before typing passwords.",
      "Avoid sharing card details on unsecured pages.",
    ],
    quiz: [
      {
        q: "What does the 'S' in HTTPS stand for?",
        options: [
          "System",
          "Server",
          "Secure (SSL/TLS Encryption)",
          "Session Speed",
        ],
        correctAnswer: 2,
      },
      {
        q: "Does a lock icon mean a website is completely safe and not a scam?",
        options: [
          "Yes, scam websites are blocked from getting HTTPS certificates.",
          "No, HTTPS only encrypts the connection. A phishing site can easily have an HTTPS certificate.",
          "Yes, it proves the website has been vetted by state authorities.",
          "No, HTTPS only works on internal company intranets.",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "3 min read",
    difficulty: "Beginner",
    relatedActivity: "Browser Health Check",
    relatedActivityUrl: "/safety-checks?tool=browser"
  },
  {
    id: "HUB-005",
    category: "social",
    title: "Social Media Privacy",
    summary: "Protect your accounts from scammers mining your personal details.",
    content: "Scammers look at public social media posts to find answers to security questions (like your pet's name or your birthday). Keep your profiles private to protect your account.",
    whatYouWillLearn: "Configuring privacy settings, recognizing data mining posts, and declining unsafe requests.",
    whyItMatters: "Public details can be used by scammers to recover and hijack your accounts or build highly convincing phishing attacks.",
    practicalActivity: "Review your social profile privacy options and restrict public views.",
    illustration: `+-------------------------------------------------------------+
| DATA MINING ATTACK VECTOR                                   |
|                                                             |
| Public Post:  "Happy birthday to my dog Buddy!"             |
| Scammer Log:  Pet Name = Buddy                              |
| Hijack Stage: Resets password by guessing security question|
+-------------------------------------------------------------+`,
    checklists: [
      "Set your social media profiles to private.",
      "Hide your email address and phone number from public searches.",
      "Decline connection requests from accounts you do not know.",
    ],
    quiz: [
      {
        q: "How do scammers use information from public social media profiles?",
        options: [
          "To block you from logging into your browser.",
          "To gather details (pet names, birth locations) to answer account recovery security questions.",
          "To install ransomware directly on your machine.",
          "To read your browser tracking cookies.",
        ],
        correctAnswer: 1,
      },
      {
        q: "Which of the following is a recommended social media setup?",
        options: [
          "Making all posts public so friends can verify them.",
          "Leaving phone numbers public so clients can reach you.",
          "Restricting visibility to confirmed friends and disabling search index tags.",
          "Checking into locations in real-time.",
        ],
        correctAnswer: 2,
      },
    ],
    readTime: "4 min read",
    difficulty: "Beginner",
    relatedActivity: "Privacy Quiz",
    relatedActivityUrl: "/safety-checks?tool=privacy"
  },
  {
    id: "HUB-006",
    category: "payments",
    title: "Safe Online Payments",
    summary: "Keep your card credentials safe when shopping online.",
    content: "Never type credit card numbers directly on sketchy retail sites. Always check if the payment is processed by a trusted gateway (like PayPal or Stripe) and use virtual cards.",
    whatYouWillLearn: "Identify secure checkout portals, avoid saving card credentials, and understand payment tokenization.",
    whyItMatters: "Entering cards on unverified small retail databases leaves them open to data breaches and fraud.",
    practicalActivity: "Check the checkup options in the Privacy Settings review.",
    illustration: `+-------------------------------------------------------------+
| SECURE CHECKOUT ROUTING SCHEMATIC                           |
|                                                             |
| [Merchant Shop] --(Redirects tokenized payload)--> [Gateway] |
|       ^                                               |
|       +--- (Never sees your raw credit card numbers!)  |
+-------------------------------------------------------------+`,
    checklists: [
      "Use secure methods like Apple Pay or Google Pay.",
      "Never save cards on random websites.",
      "Check the URL to ensure it is a secure payment portal.",
    ],
    quiz: [
      {
        q: "Why is saving credit card details on retail websites considered risky?",
        options: [
          "The website loads much slower.",
          "Retail databases are often target vectors for breach leakages.",
          "Banks charge extra fees for saved cards.",
          "Browsers do not support saved card payments.",
        ],
        correctAnswer: 1,
      },
      {
        q: "What represents a secure online payment habit?",
        options: [
          "Emailing credit card details to merchants.",
          "Using tokenized payments or virtual single-use cards.",
          "Saving card numbers in public text documents.",
          "Using unencrypted HTTP checkout forms.",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "4 min read",
    difficulty: "Intermediate",
    relatedActivity: "Privacy Quiz",
    relatedActivityUrl: "/safety-checks?tool=privacy"
  },
  {
    id: "HUB-007",
    category: "wifi",
    title: "Public Wi-Fi Safety",
    summary: "Understand the safety risks of using open networks in public spaces.",
    content: "Public Wi-Fi networks are unencrypted, meaning others nearby can spy on your traffic or set up fake clone hotspots. Use a secure VPN to protect yourself.",
    whatYouWillLearn: "Why open networks are insecure, hotspot clones, and using VPNs for safety.",
    whyItMatters: "Anyone connected to the same open network can intercept unencrypted data, exposing logins, searches, and profiles.",
    practicalActivity: "Disable your laptop or smartphone's auto-connect Wi-Fi features.",
    illustration: `+-------------------------------------------------------------+
| ROGUE HOTSPOT SCHEMATIC                                     |
|                                                             |
| [Your Device] ---> [Rogue Access Point ("Free Wi-Fi")] ---> |
|                          |                                  |
|                          v                                  |
|                    [Hacker captures all unencrypted logs!]  |
+-------------------------------------------------------------+`,
    checklists: [
      "Turn off auto-connect to public networks.",
      "Use a Virtual Private Network (VPN) to encrypt traffic.",
      "Turn off file sharing in public spaces.",
    ],
    quiz: [
      {
        q: "Why is connecting to open public Wi-Fi hotspots risky?",
        options: [
          "Public connections drain battery files faster.",
          "Web browsers block public Wi-Fi access automatically.",
          "It is slower than mobile data speeds.",
          "Anyone on the network can capture your traffic, or deploy rogue clone access points.",
        ],
        correctAnswer: 3,
      },
      {
        q: "What software utility encrypts your internet packets on public connections?",
        options: [
          "A firewall rule",
          "A compiler script",
          "A Virtual Private Network (VPN)",
          "An antivirus database tool",
        ],
        correctAnswer: 2,
      },
    ],
    readTime: "5 min read",
    difficulty: "Intermediate",
    relatedActivity: "Privacy Quiz",
    relatedActivityUrl: "/safety-checks?tool=privacy"
  },
  {
    id: "HUB-008",
    category: "mobile",
    title: "Mobile Security Basics",
    summary: "Keep your mobile device safe from malicious apps and permissions.",
    content: "Smartphones contain highly personal details. Scammers try to trick you into installing apps outside official app stores, or grant permissions like constant location or microphone access. Audit apps regularly.",
    whatYouWillLearn: "Managing phone permissions, avoiding unofficial app downloads, and updating mobile systems.",
    whyItMatters: "A compromised smartphone can share your real-time location, read messages, or steal codes.",
    practicalActivity: "Check which smartphone apps have background access to your location.",
    illustration: `+-------------------------------------------------------------+
| APP PERMISSION AUDIT SCHEMATIC                              |
|                                                             |
| [Calculator App] ===(Asks for Location & Contacts?)===> [X]  |
|                                                             |
| Action: Deny unnecessary access to keep your phone secure!  |
+-------------------------------------------------------------+`,
    checklists: [
      "Only download apps from official app stores.",
      "Review app permissions; decline location or contact access if unnecessary.",
      "Keep your phone's operating system updated.",
    ],
    quiz: [
      {
        q: "Why is it important to review phone app permissions?",
        options: [
          "It speeds up cellular network connections.",
          "It stops apps from silently tracking your location, files, or contacts.",
          "It increases storage capacity.",
          "It automatically logs you out of social media.",
        ],
        correctAnswer: 1,
      },
      {
        q: "Where is the safest place to download phone apps?",
        options: [
          "Official platform app stores (like Google Play or Apple App Store).",
          "Direct links from text messages.",
          "Third-party software forums.",
          "Shared files from friends over chat.",
        ],
        correctAnswer: 0,
      },
    ],
    readTime: "4 min read",
    difficulty: "Beginner",
    relatedActivity: "Privacy Quiz",
    relatedActivityUrl: "/safety-checks?tool=privacy"
  },
  {
    id: "HUB-009",
    category: "footprint",
    title: "Managing Your Digital Footprint",
    summary: "Learn what information you leave behind online and how to control it.",
    content: "Every account, post, and cookie writes an online footprint about you. This trail can last forever and be searched by colleges, employers, or identity thieves. Delete old, unused accounts to stay secure.",
    whatYouWillLearn: "What a digital footprint is, tracing visible details, and closing inactive accounts.",
    whyItMatters: "Old accounts are highly vulnerable to hacks since they are rarely checked, giving attackers entrance to your old personal records.",
    practicalActivity: "Search your name in quotation marks on a public search engine to audit public details.",
    illustration: `+-------------------------------------------------------------+
| THE DIGITAL FOOTPRINT TRAIL                                 |
|                                                             |
| Inactive Accounts ==> Old Passwords ==> Potential Breach     |
|                                                              |
| Action: Delete old profiles to shrink your attack footprint!|
+-------------------------------------------------------------+`,
    checklists: [
      "Delete old, unused accounts and profiles.",
      "Think carefully before sharing private details online.",
      "Clear old browser data and tracking caches.",
    ],
    quiz: [
      {
        q: "Why are inactive, old accounts a safety risk?",
        options: [
          "They take up too much public space.",
          "They are easily hacked since they use old passwords and aren't monitored.",
          "They automatically charge subscription fees.",
          "They block you from creating new profiles.",
        ],
        correctAnswer: 1,
      },
      {
        q: "How can you shrink your digital footprint?",
        options: [
          "Creating more accounts with similar passwords.",
          "Deleting old profiles and avoiding posting private details publicly.",
          "Enabling automatic location check-ins.",
          "Sharing your email address on public forums.",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "4 min read",
    difficulty: "Beginner",
    relatedActivity: "Browser Health Check",
    relatedActivityUrl: "/safety-checks?tool=browser"
  },
  {
    id: "HUB-010",
    category: "checklist",
    title: "Student Safety Checklist",
    summary: "Review your safety configurations and checklist habits.",
    content: "Staying secure online is an ongoing journey. Establish healthy safety habits by regular checklist audits. Follow these guidelines to secure your school, payment, and social accounts.",
    whatYouWillLearn: "Setting up a safety routine, auditing devices periodically, and staying updated on safety habits.",
    whyItMatters: "Security is a continuous habit, not a one-time checkup. Regular reviews keep you secure as technology and scams change.",
    practicalActivity: "Review and complete the Digital Safety Checklist under the Support page.",
    illustration: `+-------------------------------------------------------------+
| CONTINUOUS HABIT CYCLE                                      |
|                                                             |
| Audit Checklist ===> Identify holes ===> Apply checks ===+  |
|         ^                                                |  |
|         +================== (Repeat monthly) ============+  |
+-------------------------------------------------------------+`,
    checklists: [
      "Set a calendar reminder to review your security settings monthly.",
      "Keep all device software set to auto-update.",
      "Audit your passwords to ensure none are shared across accounts.",
    ],
    quiz: [
      {
        q: "How often should you review your personal security settings?",
        options: [
          "Once every few years.",
          "Only after you have been hacked.",
          "Regularly (e.g., once a month) to keep habits strong.",
          "Never, modern systems protect themselves.",
        ],
        correctAnswer: 2,
      },
      {
        q: "What represents a healthy security habit?",
        options: [
          "Sharing passwords with friends to avoid forgetting them.",
          "Using different passwords and checking your safety settings periodically.",
          "Leaving all app permissions enabled.",
          "Never updating your smartphone operating system.",
        ],
        correctAnswer: 1,
      },
    ],
    readTime: "3 min read",
    difficulty: "Intermediate",
    relatedActivity: "Home Dashboard",
    relatedActivityUrl: "/"
  }
];

const TERMINAL_COMMANDS = [
  {
    label: "Verify Open Connection Ports",
    cmd: "netstat -ano | findstr LISTENING",
    platform: "PowerShell",
  },
  {
    label: "Check System Firewall Settings",
    cmd: "Get-NetFirewallProfile | Format-Table Name, Enabled",
    platform: "PowerShell",
  },
  {
    label: "Check Network Sockets",
    cmd: "ss -tulpn",
    platform: "Linux/macOS Bash",
  },
  {
    label: "Create a Secure SSH Key Pair",
    cmd: 'ssh-keygen -t ed25519 -a 100 -C "student@safesteps"',
    platform: "Terminal Command",
  },
];

export default function LearningHubPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeLesson, setActiveLesson] = useState<HubLesson | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Quiz progress states
  const [completedLessons, setCompletedLessons] = useState<{ [id: string]: boolean }>({});
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizGradeCorrect, setQuizGradeCorrect] = useState(false);

  // Sync completed lessons on mount and update
  useEffect(() => {
    const updateLessons = () => {
      setCompletedLessons(getCompletedLessons());
    };
    updateLessons();
    window.addEventListener("safesteps_progress_changed", updateLessons);
    return () => {
      window.removeEventListener("safesteps_progress_changed", updateLessons);
    };
  }, []);

  const categories = [
    { id: "all", label: "All Topics", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "getting-started", label: "Getting Started", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "passwords", label: "Passwords", icon: <Key className="w-3.5 h-3.5" /> },
    { id: "phishing", label: "Email Safety", icon: <Search className="w-3.5 h-3.5" /> },
    { id: "browsing", label: "Safe Browsing", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "social", label: "Social Media", icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: "payments", label: "Online Payments", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: "wifi", label: "Public Wi-Fi", icon: <Wifi className="w-3.5 h-3.5" /> },
    { id: "mobile", label: "Mobile Security", icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: "footprint", label: "Digital Footprint", icon: <Eye className="w-3.5 h-3.5" /> },
    { id: "checklist", label: "Checklist", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast("Command copied to clipboard", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpenLesson = (lesson: HubLesson) => {
    setActiveLesson(lesson);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizGradeCorrect(false);
  };

  const handleSelectQuizAnswer = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    const updated = [...quizAnswers];
    updated[questionIdx] = optionIdx;
    setQuizAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    if (!activeLesson) return;
    if (quizAnswers.length < activeLesson.quiz.length || quizAnswers.includes(undefined as any)) {
      showToast("Please answer all questions before submitting!", "warning");
      return;
    }

    let allCorrect = true;
    activeLesson.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] !== q.correctAnswer) {
        allCorrect = false;
      }
    });

    setQuizSubmitted(true);
    setQuizGradeCorrect(allCorrect);

    if (allCorrect) {
      markLessonCompleted(activeLesson.id, true);
      showToast(`Quiz Passed! Lesson marked as completed.`, "success");
    } else {
      showToast("Some quiz answers were incorrect. Review and try again.", "warning");
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizGradeCorrect(false);
  };

  const filteredLessons = LESSONS.filter((art) => {
    const matchesCategory = selectedCategory === "all" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Learning Hub
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base font-inter">
          Curriculum safety lessons, conceptual illustrations, and mini-quizzes to help you study.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Guides (8 / 12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search safety lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cyber-panel border border-white/10 focus:border-cyan-400/50 hover:border-white/20 pl-10 pr-4 py-2 text-sm text-white rounded-[6px] placeholder-white/20 font-inter outline-none transition-all focus:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/20" />
            </div>

            {/* Scrollable Categories List */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 font-mono text-[11px] scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-[4px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                      : "border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lessons list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredLessons.length > 0 ? (
                filteredLessons.map((art) => {
                  const isCompleted = !!completedLessons[art.id];
                  
                  return (
                    <motion.div
                      key={art.id}
                      layout
                      initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Panel
                        title={art.title}
                        idTag={art.id}
                        topBorderColor="cyan"
                        className="h-full flex flex-col justify-between hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.06)]"
                      >
                        <div className="space-y-3">
                          <p className="text-on-surface-variant text-sm font-inter leading-relaxed">
                            {art.summary}
                          </p>

                          {/* Difficulty and reading time indicators */}
                          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                            <span className="flex items-center gap-1 text-on-surface-variant/80 bg-white/5 px-2 py-0.5 border border-white/5 rounded-[2px]">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span>{art.readTime}</span>
                            </span>
                            <span className={`px-2 py-0.5 border rounded-[2px] font-bold ${
                              art.difficulty === "Beginner"
                                ? "text-emerald-400 bg-emerald-950/20 border-emerald-500/25"
                                : art.difficulty === "Intermediate"
                                ? "text-cyan-400 bg-cyan-950/20 border-cyan-500/25"
                                : "text-red-400 bg-red-950/20 border-red-500/25"
                            }`}>
                              {art.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-cyan-400/80 font-bold uppercase tracking-wider">
                              Topic: {art.category}
                            </span>
                            {isCompleted && (
                              <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/25 px-1.5 py-0.5 rounded-[2px] font-bold">✓ Complete</span>
                            )}
                          </div>
                          
                          <Button
                            variant="technical"
                            onClick={() => handleOpenLesson(art)}
                            className="py-1 px-3"
                            icon={<ChevronRight className="w-3.5 h-3.5" />}
                          >
                            Study Lesson
                          </Button>
                        </div>
                      </Panel>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-16 border border-dashed border-white/10 rounded-[6px]">
                  <p className="font-mono text-xs text-on-surface-variant">
                    No lessons match this search query. Try another word!
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Side: Command References (4 / 12) */}
        <div className="lg:col-span-4">
          <Panel title="Helpful Commands" icon={<Terminal className="w-4 h-4" />} idTag="Console">
            <div className="space-y-5 pt-1">
              <span className="font-mono text-[10px] text-on-surface-variant block uppercase tracking-wider">
                Run these in your command line for local audits:
              </span>
              
              <div className="space-y-4">
                {TERMINAL_COMMANDS.map((item, index) => (
                  <div key={index} className="border border-white/5 bg-cyber-bg/60 p-4 rounded-[6px] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-white/80 font-bold">{item.label}</span>
                      <span className="text-on-surface-variant text-[10px]">{item.platform}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/40 border border-white/5 p-2.5 rounded-[4px]">
                      <code className="font-mono text-xs text-cyan-300 break-all select-all pr-2">
                        {item.cmd}
                      </code>
                      <button
                        onClick={() => handleCopy(item.cmd, index)}
                        className="text-on-surface-variant hover:text-cyan-400 p-1 bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-[4px] flex-shrink-0 transition-all cursor-pointer"
                        title="Copy command"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

      </div>

      {/* Lesson Curriculum Modal Dialog */}
      <AnimatePresence>
        {activeLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLesson(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-3xl bg-cyber-panel border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] rounded-[6px] relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-1 w-full bg-cyan-400" />
              
              {/* Header */}
              <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="font-mono text-[9px] text-cyan-400/80 font-bold tracking-widest uppercase block">
                    Lesson Document // {activeLesson.id}
                  </span>
                  <h3 className="font-outfit text-xl font-bold text-white mt-0.5">
                    {activeLesson.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="font-mono text-xs text-on-surface-variant hover:text-white px-2 py-1 border border-white/5 hover:border-white/20 bg-white/5 rounded-[4px] cursor-pointer"
                >
                  [ESC]_CLOSE
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
                
                {/* Meta details */}
                <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4 font-mono text-[10px]">
                  <div>
                    <span className="text-on-surface-variant block uppercase">DIFFICULTY:</span>
                    <span className="text-cyan-400 font-bold">{activeLesson.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block uppercase">READING TIME:</span>
                    <span className="text-white font-bold">{activeLesson.readTime}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block uppercase">RELATED ACTIVITY:</span>
                    <Link href={activeLesson.relatedActivityUrl} className="text-cyan-400 hover:underline font-bold" onClick={() => setActiveLesson(null)}>
                      {activeLesson.relatedActivity}
                    </Link>
                  </div>
                </div>

                {/* What You'll Learn & Why It Matters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1.5 font-inter text-xs">
                    <span className="font-mono text-[9px] text-cyan-400 block uppercase tracking-wider font-bold">
                      💡 What you'll learn
                    </span>
                    <p className="text-white leading-relaxed">
                      {activeLesson.whatYouWillLearn}
                    </p>
                  </div>
                  <div className="space-y-1.5 font-inter text-xs">
                    <span className="font-mono text-[9px] text-emerald-400 block uppercase tracking-wider font-bold">
                      🛡️ Why it matters
                    </span>
                    <p className="text-white leading-relaxed">
                      {activeLesson.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* Lesson Description */}
                <div className="space-y-1.5 font-inter text-sm border-b border-white/5 pb-4">
                  <span className="font-mono text-[9px] text-on-surface-variant block uppercase tracking-wider font-bold">
                    3-5 Minute Lesson Reading
                  </span>
                  <p className="text-white leading-relaxed">
                    {activeLesson.content}
                  </p>
                </div>

                {/* Cyber Illustration (Code box / ASCII Schematic) */}
                <div className="space-y-1.5 border-b border-white/5 pb-4">
                  <span className="font-mono text-[9px] text-on-surface-variant block uppercase tracking-wider font-bold">
                    Visual Schematic
                  </span>
                  <pre className="bg-black/50 border border-cyan-400/15 p-4 rounded-[6px] font-mono text-[10px] text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                    {activeLesson.illustration}
                  </pre>
                </div>

                {/* Key Takeaways & Small Practical Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-on-surface-variant block uppercase tracking-wider font-bold">
                      Key Takeaways
                    </span>
                    <ul className="space-y-2 text-xs text-on-surface-variant font-inter">
                      {activeLesson.checklists.map((check, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-amber-400 block uppercase tracking-wider font-bold">
                      🎯 Small Practical Activity
                    </span>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-[6px] text-xs text-on-surface-variant font-inter leading-relaxed">
                      {activeLesson.practicalActivity}
                    </div>
                  </div>
                </div>

                {/* Mini Quiz */}
                <div className="border-t border-white/5 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 block uppercase tracking-wider font-bold">
                      Interactive Mini Quiz
                    </span>
                    {completedLessons[activeLesson.id] && (
                      <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/25 px-2 py-0.5 rounded-[2px] font-bold">QUIZ COMPLETED</span>
                    )}
                  </div>
                  
                  <div className="space-y-5">
                    {activeLesson.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2.5">
                        <p className="text-xs text-white font-inter font-semibold leading-relaxed">
                          Q{qIdx + 1}: {q.q}
                        </p>
                        
                        <div className="flex flex-col gap-2 font-inter text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[qIdx] === optIdx;
                            const isCorrectAnswer = optIdx === q.correctAnswer;
                            
                            let optionStyle = "border-white/5 bg-cyber-bg/40 text-on-surface-variant hover:text-white hover:border-white/10";
                            
                            if (isSelected) {
                              if (quizSubmitted) {
                                optionStyle = isCorrectAnswer
                                  ? "border-emerald-500 bg-emerald-950/10 text-emerald-400 font-semibold"
                                  : "border-red-500 bg-red-950/10 text-red-400 font-semibold";
                              } else {
                                optionStyle = "border-cyan-400 bg-cyan-950/10 text-cyan-400 font-semibold";
                              }
                            } else if (quizSubmitted && isCorrectAnswer) {
                              optionStyle = "border-emerald-500/50 bg-emerald-950/5 text-emerald-400";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                className={`w-full text-left p-3 border rounded-[4px] transition-all cursor-pointer ${optionStyle}`}
                                disabled={quizSubmitted}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submission and feedback */}
                  <div className="pt-2 flex items-center justify-between">
                    {quizSubmitted ? (
                      <div className="flex items-center gap-3">
                        {quizGradeCorrect ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Passed // Score: 2/2</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                              <AlertCircle className="w-4 h-4" />
                              <span>Failed // Try again!</span>
                            </div>
                            <button
                              onClick={handleResetQuiz}
                              className="text-[10px] text-cyan-400 font-mono underline hover:text-cyan-300 block"
                            >
                              Try Quiz Again
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="ml-auto">
                        <Button
                          variant="action"
                          className="py-1.5 text-[11px]"
                          onClick={handleSubmitQuiz}
                        >
                          Submit Answers
                        </Button>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Footer controls */}
              <div className="border-t border-white/5 px-6 py-4 bg-cyber-bg/40 flex justify-end flex-shrink-0">
                <Button variant="technical" onClick={() => setActiveLesson(null)}>
                  Close
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
