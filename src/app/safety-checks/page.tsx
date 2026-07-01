"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Search,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCw,
  Info,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Eye,
  FileText,
  Award,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import Confetti from "@/components/Confetti";
import { markCheckCompleted, getCompletedChecks } from "@/components/ProgressTracker";

export default function SafetyChecksPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] font-mono text-cyan-400">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        LOADING AUDIT MODULES...
      </div>
    }>
      <SafetyChecksContent />
    </Suspense>
  );
}

// ----------------------------------------------------
// Phishing Emails Static Database for "Spot the Scam"
// ----------------------------------------------------
interface PhishingElement {
  id: string;
  text: string;
  explanation: string;
  isPhishingIndicator: boolean;
}

interface PhishingEmail {
  id: string;
  name: string;
  sender: string;
  senderIndicator: PhishingElement;
  subject: string;
  subjectIndicator: PhishingElement;
  routing: string;
  routingIndicator: PhishingElement;
  greeting: string;
  greetingIndicator: PhishingElement;
  bodyHtml: PhishingElement[];
  attachment?: {
    name: string;
    size: string;
    indicator: PhishingElement;
  };
}

const PHISHING_EMAILS: PhishingEmail[] = [
  {
    id: "email-1",
    name: "PayPal Account Security Alert",
    sender: "PayPal Billing",
    senderIndicator: {
      id: "sender",
      text: "support@paypaI-security.com",
      isPhishingIndicator: true,
      explanation: "Domain Typosquatting: Look closely at 'paypaI'. It uses a capital 'I' (eye) instead of a lowercase 'l' (el), pointing to a non-PayPal domain.",
    },
    subject: "Security Notification",
    subjectIndicator: {
      id: "subject",
      text: "IMMEDIATE RESPONSE REQ: STORAGE ACCT TERMINATION",
      isPhishingIndicator: true,
      explanation: "Artificial Urgency: Forcing immediate action by threatening account termination is a prime indicator of social engineering.",
    },
    routing: "Mailer Daemon Stamps",
    routingIndicator: {
      id: "routing",
      text: "SPF=none, DKIM=fail, DMARC=none",
      isPhishingIndicator: true,
      explanation: "Failed Routing Security: Technical headers show the email failed SPF/DKIM verification, proving the sender forged their identity.",
    },
    greeting: "Greeting Header",
    greetingIndicator: {
      id: "greeting",
      text: "Dear Client,",
      isPhishingIndicator: true,
      explanation: "Generic Salutation: Legitimate services address you by your registered name. Scammers use mass greetings like 'Client' or 'Customer'.",
    },
    bodyHtml: [
      {
        id: "body-1",
        text: "We noticed unauthorized billing syncs from a terminal in Eastern Europe.",
        isPhishingIndicator: false,
        explanation: "Contextual backstory used to raise fear, a common psychological hook.",
      },
      {
        id: "body-2",
        text: "Please click here http://192.168.1.5/verify-paypal-credentials to verify your status.",
        isPhishingIndicator: true,
        explanation: "Suspicious Target URL: PayPal never redirects you to raw local IP addresses or unencrypted HTTP channels.",
      },
      {
        id: "body-3",
        text: "If you fail to verify inside 2 hours, your assets will be frozen.",
        isPhishingIndicator: true,
        explanation: "High Pressure Threat: Threatening immediate asset freezes prevents the victim from contacting support to verify.",
      },
    ],
  },
  {
    id: "email-2",
    name: "Express Courier Delivery Failure",
    sender: "FedX Shipments Office",
    senderIndicator: {
      id: "sender",
      text: "admin-notification@fedx-delvry-tracking.net",
      isPhishingIndicator: true,
      explanation: "Misspelled Domain: The domain uses 'fedx' instead of 'fedex' and 'delvry' instead of 'delivery'. Official couriers own their direct domain names.",
    },
    subject: "Package Status",
    subjectIndicator: {
      id: "subject",
      text: "Package #834927-NY: Unpaid customs duties / Address error",
      isPhishingIndicator: false,
      explanation: "Standard tracking subject line. Not explicitly a phishing giveaway on its own, but sets the bait.",
    },
    routing: "Server Mailer Relay",
    routingIndicator: {
      id: "routing",
      text: "SPF=pass, DKIM=none",
      isPhishingIndicator: false,
      explanation: "No DKIM signature, which is questionable, but SPF checks out since the scammer sent it from a configured spam server.",
    },
    greeting: "Greeting Header",
    greetingIndicator: {
      id: "greeting",
      text: "Dear parcel recipient,",
      isPhishingIndicator: true,
      explanation: "Generic Greeting: Couriers scan package labels containing your real name, so they should address you by name.",
    },
    bodyHtml: [
      {
        id: "body-1",
        text: "We was unable to deliver your package because of address error. Please verified it.",
        isPhishingIndicator: true,
        explanation: "Grammar & Spelling Mistakes: The use of 'We was unable' and 'Please verified' are classic indicators of overseas phishing outfits operating without editorial review.",
      },
      {
        id: "body-2",
        text: "To update your credentials and pay the remaining $1.50 custom charges, click below.",
        isPhishingIndicator: true,
        explanation: "Low Fee Trap: Scammers request tiny fees ($1.50) because users let their guard down. The goal is to capture credit card digits, not the $1.50 fee.",
      },
      {
        id: "body-3",
        text: "Verify Address: http://fedex-delivery-customs-payment-gateway.net/update",
        isPhishingIndicator: true,
        explanation: "Misleading Subdomain: The link uses a massive hyphenated string to appear legitimate, but the actual domain is 'fedex-delivery-customs-payment-gateway.net', which is not FedEx.",
      },
    ],
    attachment: {
      name: "fedex_package_invoice_834927.exe",
      size: "4.8 MB",
      indicator: {
        id: "attachment",
        text: "fedex_package_invoice_834927.exe",
        isPhishingIndicator: true,
        explanation: "Dangerous Executable: Invoices and delivery bills are documents (.pdf, .png). An executable file (.exe) will install malware on your Windows machine immediately when opened.",
      },
    },
  },
  {
    id: "email-3",
    name: "Internal Company HR Memo",
    sender: "HR Relations",
    senderIndicator: {
      id: "sender",
      text: "hr-benefits@corp-internall-relations.com",
      isPhishingIndicator: true,
      explanation: "Suspicious Misspelling: 'internall' has an extra 'l'. Impersonating internal company HR is a targeted spear-phishing tactic.",
    },
    subject: "Mandatory Employee Notice",
    subjectIndicator: {
      id: "subject",
      text: "MANDATORY REQ: Work Schedule Changes & Pension Benefits Update",
      isPhishingIndicator: true,
      explanation: "Authority Trigger: Labeling an email as 'MANDATORY' from HR creates immediate panic and forces employee compliance.",
    },
    routing: "Internal Routing Simulator",
    routingIndicator: {
      id: "routing",
      text: "DKIM=fail, DMARC=fail",
      isPhishingIndicator: true,
      explanation: "Failed Authenticity: The mail failed internal DMARC guidelines. HR emails sent within the company domain should always pass verification.",
    },
    greeting: "Employee Greeting",
    greetingIndicator: {
      id: "greeting",
      text: "Hello Team Member,",
      isPhishingIndicator: true,
      explanation: "Generic Salutation: Authentic company HR announcements will generally address the team professionally or call out individual employee names.",
    },
    bodyHtml: [
      {
        id: "body-1",
        text: "Please review the updated corporate policies regarding remote work allocations and pension fund distributions.",
        isPhishingIndicator: false,
        explanation: "Boring corporate corporate-speak designed to make employees lower their suspicion levels.",
      },
      {
        id: "body-2",
        text: "You must download and fill the attached ZIP container package to verify your active status by Friday.",
        isPhishingIndicator: true,
        explanation: "Urgent Deadline: A tight Friday deadline creates pressure, leading employees to click attachments without thinking.",
      },
      {
        id: "body-3",
        text: "If you do not register, your benefits allocation for next month will be held back.",
        isPhishingIndicator: true,
        explanation: "Financial Threat: Threats regarding salary or benefits are highly effective motivators in corporate spear-phishing.",
      },
    ],
    attachment: {
      name: "corporate_work_policies_2026.zip",
      size: "12.4 MB",
      indicator: {
        id: "attachment",
        text: "corporate_work_policies_2026.zip",
        isPhishingIndicator: true,
        explanation: "ZIP Payload Vector: Compressed files (.zip, .rar) are used to hide executable scripts from standard browser security scanners.",
      },
    },
  },
];

// Common passwords list
const COMMON_PASSWORDS = [
  "password", "123456", "12345678", "123456789", "12345", "1234", "qwerty", "admin", "admin123",
  "password123", "letmein", "welcome", "security", "login", "root", "guest", "secret", "master",
  "access", "pass123", "changeme", "test1234", "111111", "000000", "p@ssword", "iloveyou", "football",
  "monkey", "dragon", "superman", "trustnoone"
];

// Privacy Review Questions
interface PrivacyQuestion {
  id: number;
  q: string;
  options: { text: string; score: number; recommendation: string }[];
}

const PRIVACY_QUESTIONS: PrivacyQuestion[] = [
  {
    id: 1,
    q: "Is Multi-Factor Authentication (MFA) enabled on your primary email and bank accounts?",
    options: [
      { text: "Yes, using Authenticator Apps or Hardware Keys (Highly Secure)", score: 20, recommendation: "Excellent. Hardware keys or authenticator apps block 99.9% of automated hijacks." },
      { text: "Yes, using SMS text message codes (Moderately Secure)", score: 12, recommendation: "SMS MFA is vulnerable to SIM-swapping. Consider transitioning to Google Authenticator, Aegis, or a physical YubiKey." },
      { text: "No, passwords only (Vulnerable)", score: 0, recommendation: "Crucial: Enable MFA immediately on primary emails and financial portals. Passwords alone are highly vulnerable." },
    ],
  },
  {
    id: 2,
    q: "Do you reuse passwords across multiple social media, shopping, or school websites?",
    options: [
      { text: "No, every account has a unique, randomized password", score: 20, recommendation: "Perfect isolation policy. If one site leaks, your other accounts remain entirely safe." },
      { text: "I have 2-3 standard passwords that I rotate (Vulnerable)", score: 5, recommendation: "Credential stuffing: Scammers test leaked passwords across popular services. Never reuse passwords." },
      { text: "Yes, I reuse the same password for convenience (Critical)", score: 0, recommendation: "High Risk: If a single minor forum database is breached, attackers can unlock all your primary accounts." },
    ],
  },
  {
    id: 3,
    q: "Is browser synchronization active without a custom sync passphrase?",
    options: [
      { text: "Synchronized using a custom sync passphrase (Secure)", score: 15, recommendation: "Excellent. Passphrases ensure cloud providers cannot read your local browsing credentials." },
      { text: "Yes, basic sync is on using default credentials (Medium)", score: 8, recommendation: "Syncing syncs password lists in plaintext to cloud accounts. Configure a master sync passcode." },
      { text: "No sync, I keep data strictly localized (Secure)", score: 15, recommendation: "Keeping data local eliminates cloud synchronization breaches." },
    ],
  },
  {
    id: 4,
    q: "How are your social media profiles configured for public search visibility?",
    options: [
      { text: "Private: Friends-only, locked profiles (Secure)", score: 15, recommendation: "Great work. Scammers target public details (family, locations) to build social hooks." },
      { text: "Public: Anyone can view posts, but email/phone are hidden (Medium)", score: 7, recommendation: "Restrict post visibility. Scammers map public posts to answer security questions." },
      { text: "Fully Public: All posts and contact details are searchable (High)", score: 0, recommendation: "Action Required: Set profiles to private. Hide phone numbers and email domains from public indexing." },
    ],
  },
  {
    id: 5,
    q: "Is continuous background location sharing active on your mobile phone?",
    options: [
      { text: "Disabled: Locations turned off entirely or limited per app (Secure)", score: 15, recommendation: "Perfect. Limiting background location tracking blocks telemetry profiling." },
      { text: "Enabled for maps and transport apps (Moderate)", score: 10, recommendation: "Review app permissions. Ensure only actively used navigation programs have location rights." },
      { text: "Enabled continuously for all apps (Vulnerable)", score: 0, recommendation: "High Risk: Ad trackers log location points to build habits maps. Audit and restrict background location rights." },
    ],
  },
  {
    id: 6,
    q: "When did you last audit app permissions (microphone, camera, files) on your device?",
    options: [
      { text: "Within the last month (Secure)", score: 15, recommendation: "Keep doing this. Regular permission audits prevent idle apps from accessing hardware sensors." },
      { text: "More than 6 months ago (Moderate)", score: 8, recommendation: "Run a system audit today. Remove files and camera access for games or tools that do not require them." },
      { text: "Never audited / I approve all permissions (Vulnerable)", score: 0, recommendation: "Immediate action: Scrutinize app permissions. Games requesting microphone access are telemetry trackers." },
    ],
  },
];

// Browser Safety Checklist Items
interface BrowserCheckItem {
  id: string;
  title: string;
  category: string;
  question: string;
  info: string;
}

const BROWSER_CHECKLIST_ITEMS: BrowserCheckItem[] = [
  {
    id: "https",
    title: "HTTPS Connection Awareness",
    category: "Encryption Protocols",
    question: "Do you verify the address bar starts with 'https://' and has a lock symbol before entering credentials?",
    info: "HTTPS encrypts the session channel between your browser and the web server. Unencrypted HTTP transmits passwords in plaintext, visible to anyone capturing packets on your local network.",
  },
  {
    id: "updates",
    title: "Automatic Browser Updates",
    category: "Vulnerability Patches",
    question: "Are automatic updates enabled in your browser configurations, and do you relaunch it when requested?",
    info: "Browsers patch zero-day sandbox escape vulnerabilities constantly. Keeping your browser outdated allows malicious web scripts to run code directly on your operating system.",
  },
  {
    id: "manager",
    title: "Dedicated Password Manager Integration",
    category: "Credential Storage",
    question: "Do you store your passwords in a dedicated manager (e.g. Bitwarden, 1Password) instead of standard browser databases?",
    info: "Standard browser database files are readable by simple local utility scripts. Dedicated managers encrypt databases with specialized master keys, separate from the browser session.",
  },
  {
    id: "extensions",
    title: "Extension Auditing & Hygiene",
    category: "Browser Add-ons",
    question: "Do you restrict extensions to active, highly-reviewed ones and audit their site access permissions?",
    info: "Malicious extensions read form inputs, capture credentials, and redirect searches. Restrict permissions to 'On Click' rather than allowing them to read every webpage.",
  },
  {
    id: "popups",
    title: "Popup Blocker Activation",
    category: "Exploit Blocking",
    question: "Is your browser's default pop-up blocker enabled, alongside a tracker blocker (like uBlock Origin)?",
    info: "Malicious ad popups use drive-by downloads to install files. Trackers load invisible scripts that drain performance and monitor keystrokes.",
  },
  {
    id: "cookies",
    title: "Cookie Privacy Settings",
    category: "Data Tracking",
    question: "Do you block third-party cookies or configure your browser to wipe cookie caches when you exit?",
    info: "Third-party cookies track you across different websites to map your habits. Wiping cookies on exit limits tracking profiling and logs you out securely.",
  },
];

function SafetyChecksContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeToolParam = searchParams.get("tool") || "password";

  const [activeTab, setActiveTab] = useState<string>(activeToolParam);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);
  const [completedChecks, setCompletedChecks] = useState({
    password: false,
    scam: false,
    privacy: false,
    browser: false,
  });

  useEffect(() => {
    const updateChecks = () => {
      setCompletedChecks(getCompletedChecks());
    };
    updateChecks();
    window.addEventListener("safesteps_progress_changed", updateChecks);
    return () => {
      window.removeEventListener("safesteps_progress_changed", updateChecks);
    };
  }, []);

  const isScamLocked = !completedChecks.password;
  const isPrivacyLocked = !completedChecks.password || !completedChecks.scam;
  const isBrowserLocked = !completedChecks.password || !completedChecks.scam || !completedChecks.privacy;

  useEffect(() => {
    if (activeToolParam && activeToolParam !== activeTab) {
      // Force redirect if trying to access locked tab directly via URL parameter
      if (activeToolParam === "scam" && !completedChecks.password) {
        setActiveTab("password");
        return;
      }
      if (activeToolParam === "privacy" && (!completedChecks.password || !completedChecks.scam)) {
        setActiveTab("password");
        return;
      }
      if (activeToolParam === "browser" && (!completedChecks.password || !completedChecks.scam || !completedChecks.privacy)) {
        setActiveTab("password");
        return;
      }
      setActiveTab(activeToolParam);
    }
  }, [activeToolParam, completedChecks]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tool", tab);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const triggerCompletion = (badgeName: string) => {
    setShowConfetti(true);
    setUnlockedBadge(badgeName);
    showToast(`Safety check passed! +10 Safety Points earned.`, "success");
    setTimeout(() => {
      setShowConfetti(false);
    }, 4500);
  };

  // --- 1. PASSWORD HEALTH CHECK STATE & LOGIC ---
  const [password, setPassword] = useState("");
  const [strengthScore, setStrengthScore] = useState(0); // 0 to 4
  const [entropyBits, setEntropyBits] = useState(0);
  const [crackTime, setCrackTime] = useState("0 seconds");
  const [passwordWeaknesses, setPasswordWeaknesses] = useState<string[]>([]);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false,
  });

  // Password Generator State
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({
    upper: true,
    lower: true,
    number: true,
    symbol: true,
  });
  const [suggestedPassword, setSuggestedPassword] = useState("");

  const handleGeneratePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charPool = "";
    if (genOptions.upper) charPool += uppercaseChars;
    if (genOptions.lower) charPool += lowercaseChars;
    if (genOptions.number) charPool += numberChars;
    if (genOptions.symbol) charPool += symbolChars;

    if (!charPool) {
      showToast("Select at least one character set!", "warning");
      return;
    }

    let result = "";
    const mandatoryChars: string[] = [];
    if (genOptions.upper) mandatoryChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
    if (genOptions.lower) mandatoryChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
    if (genOptions.number) mandatoryChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    if (genOptions.symbol) mandatoryChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);

    for (let i = mandatoryChars.length; i < genLength; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      result += charPool[randomIndex];
    }

    const tempArray = [...result];
    mandatoryChars.forEach((c) => {
      const pos = Math.floor(Math.random() * (tempArray.length + 1));
      tempArray.splice(pos, 0, c);
    });

    const finalPass = tempArray.join("");
    setSuggestedPassword(finalPass);
    showToast("Generated a secure password suggestion", "success");
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Password copied to clipboard!", "success");
  };

  const evaluatePassword = (pass: string) => {
    if (!pass) {
      setStrengthScore(0);
      setEntropyBits(0);
      setCrackTime("0 seconds");
      setPasswordWeaknesses([]);
      setPasswordRequirements({ length: false, upper: false, lower: false, number: false, symbol: false });
      return;
    }

    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const meetsLength = pass.length >= 12;

    setPasswordRequirements({
      length: meetsLength,
      upper: hasUpper,
      lower: hasLower,
      number: hasDigit,
      symbol: hasSpecial,
    });

    const weaknesses: string[] = [];

    const lowerPass = pass.toLowerCase();
    const isCommon = COMMON_PASSWORDS.some((common) => lowerPass === common || lowerPass.includes(`123${common}`));
    
    if (isCommon) {
      weaknesses.push("Warning: This matches a very common blocklist password.");
    }

    if (/qwerty|asdfgh|zxcvbn/i.test(pass)) {
      weaknesses.push("Keyboard sequence: These characters lie next to each other on the keyboard.");
    }
    if (/1234|2345|3456|4567|5678|6789|000|111|222/i.test(pass)) {
      weaknesses.push("Number pattern: Repeating or sequential digits are easily guessed.");
    }

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10;
    if (hasSpecial) charsetSize += 33;

    const entropy = charsetSize > 0 ? Math.round(pass.length * Math.log2(charsetSize)) : 0;
    setEntropyBits(entropy);

    const guesses = Math.pow(charsetSize, pass.length);
    const seconds = guesses / 100000000000;

    let timeText = "";
    if (seconds < 1) {
      timeText = "Instantly (Under 1 second)";
    } else if (seconds < 60) {
      timeText = `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      timeText = `${Math.round(seconds / 60)} minutes`;
    } else if (seconds < 86400) {
      timeText = `${Math.round(seconds / 3600)} hours`;
    } else if (seconds < 31536000) {
      timeText = `${Math.round(seconds / 86400)} days`;
    } else if (seconds < 3153600000) {
      timeText = `${Math.round(seconds / 31536000)} years`;
    } else {
      timeText = "Trillions of years (Extremely Secure)";
    }

    setCrackTime(timeText);

    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    
    let varieties = 0;
    if (hasLower) varieties++;
    if (hasUpper) varieties++;
    if (hasDigit) varieties++;
    if (hasSpecial) varieties++;
    
    if (varieties >= 3) score += 1;
    if (entropy > 60 && varieties === 4) score += 1;

    if (isCommon) {
      score = 1;
    } else if (weaknesses.length > 0) {
      score = Math.max(1, score - 1);
    }

    const finalScore = Math.min(4, Math.max(1, score));
    setStrengthScore(finalScore);
    setPasswordWeaknesses(weaknesses);

    if (finalScore >= 3 && !isCommon) {
      const current = getCompletedChecks();
      if (!current.password) {
        markCheckCompleted("password", true);
        triggerCompletion("Password Defender");
      }
    }
  };

  const getStrengthLabel = () => {
    switch (strengthScore) {
      case 4:
        return { text: "Very strong passphrase", color: "text-emerald-400", barColor: "bg-emerald-400" };
      case 3:
        return { text: "Strong password", color: "text-cyan-400", barColor: "bg-cyan-400" };
      case 2:
        return { text: "Moderate strength", color: "text-amber-400", barColor: "bg-amber-400" };
      case 1:
      default:
        return { text: "Weak password", color: "text-red-400", barColor: "bg-red-500" };
    }
  };

  // --- 2. SPOT THE SCAM STATE & LOGIC ---
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [clickedIndicators, setClickedIndicators] = useState<string[]>([]);
  const [scamSubmitted, setScamSubmitted] = useState(false);
  const [scamScore, setScamScore] = useState(0);
  const [scamReviewElement, setScamReviewElement] = useState<string | null>(null);

  const activeEmail = PHISHING_EMAILS[activeEmailIndex];

  const getTotalIndicators = () => {
    let count = 0;
    if (activeEmail.senderIndicator.isPhishingIndicator) count++;
    if (activeEmail.subjectIndicator.isPhishingIndicator) count++;
    if (activeEmail.routingIndicator.isPhishingIndicator) count++;
    if (activeEmail.greetingIndicator.isPhishingIndicator) count++;
    activeEmail.bodyHtml.forEach((b) => {
      if (b.isPhishingIndicator) count++;
    });
    if (activeEmail.attachment?.indicator.isPhishingIndicator) count++;
    return count;
  };

  const handleIndicatorClick = (id: string) => {
    if (scamSubmitted) {
      setScamReviewElement(id);
      return;
    }

    if (clickedIndicators.includes(id)) {
      setClickedIndicators(clickedIndicators.filter((item) => item !== id));
      showToast("Removed element selection", "info");
    } else {
      setClickedIndicators([...clickedIndicators, id]);
      showToast("Flagged suspicious element", "warning");
    }
  };

  const handleSubmitScam = () => {
    let correctClicks = 0;
    const allIndicators: string[] = [];

    if (activeEmail.senderIndicator.isPhishingIndicator) allIndicators.push("sender");
    if (activeEmail.subjectIndicator.isPhishingIndicator) allIndicators.push("subject");
    if (activeEmail.routingIndicator.isPhishingIndicator) allIndicators.push("routing");
    if (activeEmail.greetingIndicator.isPhishingIndicator) allIndicators.push("greeting");
    activeEmail.bodyHtml.forEach((b) => {
      if (b.isPhishingIndicator) allIndicators.push(b.id);
    });
    if (activeEmail.attachment?.indicator.isPhishingIndicator) allIndicators.push("attachment");

    clickedIndicators.forEach((id) => {
      if (allIndicators.includes(id)) {
        correctClicks++;
      }
    });

    setScamScore(correctClicks);
    setScamSubmitted(true);
    
    const current = getCompletedChecks();
    if (!current.scam) {
      markCheckCompleted("scam", true);
      triggerCompletion("Scam Spotter");
    } else {
      showToast(`Audit complete! Spotted ${correctClicks} indicators.`, "success");
    }
  };

  const handleResetScam = () => {
    setClickedIndicators([]);
    setScamSubmitted(false);
    setScamScore(0);
    setScamReviewElement(null);
  };

  const handleEmailChange = (index: number) => {
    setActiveEmailIndex(index);
    setClickedIndicators([]);
    setScamSubmitted(false);
    setScamScore(0);
    setScamReviewElement(null);
  };

  const getIndicatorDetail = (id: string) => {
    if (id === "sender") return activeEmail.senderIndicator;
    if (id === "subject") return activeEmail.subjectIndicator;
    if (id === "routing") return activeEmail.routingIndicator;
    if (id === "greeting") return activeEmail.greetingIndicator;
    if (id === "attachment") return activeEmail.attachment?.indicator;
    return activeEmail.bodyHtml.find((b) => b.id === id);
  };

  // --- 3. PRIVACY HEALTH REVIEW STATE & LOGIC ---
  const [privacyStep, setPrivacyStep] = useState(0);
  const [privacyAnswers, setPrivacyAnswers] = useState<number[]>([]);
  const [privacyScore, setPrivacyScore] = useState(0);
  const [privacySubmitted, setPrivacySubmitted] = useState(false);

  const handlePrivacyAnswer = (optionScore: number, index: number) => {
    const updatedAnswers = [...privacyAnswers];
    updatedAnswers[privacyStep] = index;
    setPrivacyAnswers(updatedAnswers);

    if (privacyStep < PRIVACY_QUESTIONS.length - 1) {
      setPrivacyStep(privacyStep + 1);
    } else {
      let total = 0;
      updatedAnswers.forEach((ansIdx, qIdx) => {
        total += PRIVACY_QUESTIONS[qIdx].options[ansIdx].score;
      });
      setPrivacyScore(total);
      setPrivacySubmitted(true);
      
      const current = getCompletedChecks();
      if (!current.privacy) {
        markCheckCompleted("privacy", true);
        triggerCompletion("Privacy Protector");
      } else {
        showToast("Privacy review compiled successfully", "success");
      }
    }
  };

  const handleResetPrivacy = () => {
    setPrivacyStep(0);
    setPrivacyAnswers([]);
    setPrivacyScore(0);
    setPrivacySubmitted(false);
  };

  // --- 4. BROWSER SAFETY REVIEW STATE & LOGIC ---
  const [browserChecks, setBrowserChecks] = useState<string[]>([]);
  const [browserSubmitted, setBrowserSubmitted] = useState(false);
  const [browserScore, setBrowserScore] = useState(0);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const handleToggleBrowserCheck = (id: string) => {
    if (browserChecks.includes(id)) {
      setBrowserChecks(browserChecks.filter((item) => item !== id));
    } else {
      setBrowserChecks([...browserChecks, id]);
    }
  };

  const handleCalculateBrowserScore = () => {
    const score = Math.round((browserChecks.length / BROWSER_CHECKLIST_ITEMS.length) * 100);
    setBrowserScore(score);
    setBrowserSubmitted(true);
    
    const current = getCompletedChecks();
    if (!current.browser) {
      markCheckCompleted("browser", true);
      triggerCompletion("Browser Protector");
    } else {
      showToast(`Browser safety posture calculated: ${score}% secure`, "success");
    }
  };

  const handleResetBrowser = () => {
    setBrowserChecks([]);
    setBrowserSubmitted(false);
    setBrowserScore(0);
    setExpandedInfo(null);
  };

  return (
    <div className="space-y-8 relative">
      <Confetti active={showConfetti} />

      {/* Unlocked Badge Pop-up Modal */}
      <AnimatePresence>
        {unlockedBadge && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUnlockedBadge(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-cyber-panel border border-cyan-400/40 p-6 rounded-[6px] shadow-[0_0_30px_rgba(34,211,238,0.2)] max-w-sm w-full text-center relative z-10 space-y-4"
            >
              <div className="w-16 h-16 bg-cyan-950/20 border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto text-cyan-400 animate-bounce">
                <Award className="w-8 h-8" />
              </div>
              
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest block">ACHIEVEMENT UNLOCKED</span>
                <h3 className="font-outfit font-extrabold text-white text-lg">{unlockedBadge} Badge</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-inter">
                  +10 Safety Points earned. Check out your updated score on the Home page.
                </p>
              </div>

              <div className="pt-2">
                <Button variant="action" className="w-full py-2" onClick={() => setUnlockedBadge(null)}>
                  Awesome!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Safety Checkups
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base font-inter leading-relaxed max-w-2xl">
          Four interactive checkups to help you secure your digital life.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 font-mono text-[13px] overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => handleTabChange("password")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === "password"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-on-surface-variant hover:text-white"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Password Checkup</span>
        </button>

        <button
          onClick={() => {
            if (isScamLocked) {
              showToast("Complete Password Checkup first to unlock!", "warning");
            } else {
              handleTabChange("scam");
            }
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold transition-all cursor-pointer ${
            isScamLocked ? "opacity-45 text-white/30" : ""
          } ${
            activeTab === "scam"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-on-surface-variant hover:text-white"
          }`}
        >
          {isScamLocked ? <LockKeyhole className="w-3.5 h-3.5" /> : <Search className="w-4 h-4" />}
          <span>Scam Spotter</span>
        </button>

        <button
          onClick={() => {
            if (isPrivacyLocked) {
              showToast("Complete Scam Spotter first to unlock!", "warning");
            } else {
              handleTabChange("privacy");
            }
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold transition-all cursor-pointer ${
            isPrivacyLocked ? "opacity-45 text-white/30" : ""
          } ${
            activeTab === "privacy"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-on-surface-variant hover:text-white"
          }`}
        >
          {isPrivacyLocked ? <LockKeyhole className="w-3.5 h-3.5" /> : <EyeOff className="w-4 h-4" />}
          <span>Privacy Quiz</span>
        </button>

        <button
          onClick={() => {
            if (isBrowserLocked) {
              showToast("Complete Privacy Quiz first to unlock!", "warning");
            } else {
              handleTabChange("browser");
            }
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold transition-all cursor-pointer ${
            isBrowserLocked ? "opacity-45 text-white/30" : ""
          } ${
            activeTab === "browser"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-on-surface-variant hover:text-white"
          }`}
        >
          {isBrowserLocked ? <LockKeyhole className="w-3.5 h-3.5" /> : <Shield className="w-4 h-4" />}
          <span>Browser Health Check</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* Tab 1: Password Health Check */}
          {activeTab === "password" && (
            <motion.div
              key="password-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Password tester & Suggestion generator */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Strength Meter Input */}
                <Panel title="Interactive Password Strength Meter" idTag="Analyser" topBorderColor="cyan">
                  <div className="space-y-6 pt-1">
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                        TEST PASSWORD OR PASSPHRASE
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Type password to evaluate strength..."
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            evaluatePassword(e.target.value);
                          }}
                          className="w-full bg-cyber-bg border border-white/10 focus:border-cyan-400/50 hover:border-white/15 px-4 py-3 rounded-[6px] text-white font-mono text-sm placeholder-white/20 outline-none transition-all focus:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                        />
                        <Lock className="absolute right-4 top-3.5 w-4 h-4 text-white/20" />
                      </div>
                    </div>

                    {/* Progress Bar & Rating */}
                    {password && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-on-surface-variant font-semibold">STRENGTH ESTIMATE:</span>
                          <span className={`font-bold ${getStrengthLabel().color}`}>
                            {getStrengthLabel().text}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 border border-white/10 rounded-[2px] overflow-hidden p-[1px]">
                          <div
                            className={`h-full rounded-[1px] transition-all duration-500 ${getStrengthLabel().barColor}`}
                            style={{ width: `${(strengthScore / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Requirements checklist */}
                    {password && (
                      <div className="border border-white/5 bg-cyber-bg/50 p-4 rounded-[6px] space-y-2.5">
                        <span className="font-mono text-[9px] text-on-surface-variant font-bold tracking-widest block uppercase">
                          Basic Rules
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            {passwordRequirements.length ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className={passwordRequirements.length ? "text-white" : "text-on-surface-variant"}>At least 12 characters</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {passwordRequirements.upper ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white/20" />
                            )}
                            <span className={passwordRequirements.upper ? "text-white" : "text-on-surface-variant"}>Contains uppercase letters</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {passwordRequirements.lower ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white/20" />
                            )}
                            <span className={passwordRequirements.lower ? "text-white" : "text-on-surface-variant"}>Contains lowercase letters</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {passwordRequirements.number ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white/20" />
                            )}
                            <span className={passwordRequirements.number ? "text-white" : "text-on-surface-variant"}>Contains numbers</span>
                          </div>

                          <div className="flex items-center gap-2 sm:col-span-2">
                            {passwordRequirements.symbol ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white/20" />
                            )}
                            <span className={passwordRequirements.symbol ? "text-white" : "text-on-surface-variant"}>Contains special characters</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Improvement Warnings */}
                    {password && passwordWeaknesses.length > 0 && (
                      <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-[6px] space-y-2">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Tips to make it stronger</span>
                        </div>
                        <ul className="text-xs text-on-surface-variant list-disc pl-4 space-y-1 font-inter">
                          {passwordWeaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Panel>

                {/* Password generator widget */}
                <Panel title="Secure Password Suggestion Generator" idTag="Password Suggestion">
                  <div className="space-y-4 pt-1 font-mono text-xs">
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="w-full space-y-1">
                        <span className="text-on-surface-variant">PASSWORD LENGTH: {genLength} CHARS</span>
                        <input
                          type="range"
                          min="8"
                          max="32"
                          value={genLength}
                          onChange={(e) => setGenLength(Number(e.target.value))}
                          className="w-full accent-cyan-400 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <Button
                        variant="action"
                        className="w-full sm:w-auto flex-shrink-0"
                        onClick={handleGeneratePassword}
                      >
                        Generate
                      </Button>
                    </div>

                    {/* Character Set Toggles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={genOptions.upper}
                          onChange={(e) => setGenOptions({ ...genOptions, upper: e.target.checked })}
                          className="accent-cyan-400"
                        />
                        <span className="text-on-surface-variant">A-Z Caps</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={genOptions.lower}
                          onChange={(e) => setGenOptions({ ...genOptions, lower: e.target.checked })}
                          className="accent-cyan-400"
                        />
                        <span className="text-on-surface-variant">a-z Low</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={genOptions.number}
                          onChange={(e) => setGenOptions({ ...genOptions, number: e.target.checked })}
                          className="accent-cyan-400"
                        />
                        <span className="text-on-surface-variant">0-9 Digits</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={genOptions.symbol}
                          onChange={(e) => setGenOptions({ ...genOptions, symbol: e.target.checked })}
                          className="accent-cyan-400"
                        />
                        <span className="text-on-surface-variant">Symbols</span>
                      </label>
                    </div>

                    {/* Output and copy */}
                    {suggestedPassword && (
                      <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-[6px] mt-4">
                        <code className="text-cyan-300 font-bold select-all text-sm break-all font-mono">
                          {suggestedPassword}
                        </code>
                        <button
                          onClick={() => copyToClipboard(suggestedPassword)}
                          className="text-on-surface-variant hover:text-cyan-400 p-2 bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-[4px] cursor-pointer transition-colors"
                          title="Copy Password"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                  </div>
                </Panel>
              </div>

              {/* Right Column: Entropy Stats Readout */}
              <div className="lg:col-span-5">
                <Panel title="Safety Metrics" idTag="Metrics">
                  <div className="font-mono text-xs space-y-6 pt-1">
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant">Password Length:</span>
                        <span className="text-white font-bold">{password ? password.length : 0} Chars</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant">Safety Strength Score:</span>
                        <span className="text-cyan-400 font-bold">{entropyBits} Bits</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant">Estimated Cracking Time:</span>
                        <span className="text-white font-bold">{password ? crackTime : "N/A"}</span>
                      </div>
                    </div>

                    <div className="border border-white/5 bg-white/5 p-5 rounded-[6px] space-y-3 font-inter text-xs leading-relaxed text-on-surface-variant">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold tracking-wider uppercase text-[10px]">
                        <Info className="w-3.5 h-3.5" />
                        <span>Why Length Matters</span>
                      </div>
                      <p>
                        A long password made of 4 simple, random words (like <code className="bg-black/30 px-1 py-0.5 font-mono text-emerald-300">apple-pencil-couch-ocean</code>) is extremely hard for a computer to guess, but very easy for you to remember.
                      </p>
                      <p>
                        Short passwords, even with special symbols, are easy for computers to crack in seconds. Length is the key to safety.
                      </p>
                    </div>

                  </div>
                </Panel>
              </div>

              {/* Workflow Guidance Banner */}
              <div className="lg:col-span-12 border border-white/5 bg-gradient-to-r from-blue-950/10 to-indigo-950/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-outfit font-bold text-white text-sm">Ready to test your scam-spotting skills?</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-inter font-medium">
                    If you are satisfied with your password checkup, proceed to the next step to test your ability to spot email scams.
                  </p>
                </div>
                <Button 
                  variant="friendly" 
                  onClick={() => handleTabChange("scam")}
                >
                  Go to Scam Spotter Game →
                </Button>
              </div>

            </motion.div>
          )}

          {/* Tab 2: Spot the Scam */}
          {activeTab === "scam" && (
            <motion.div
              key="scam-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Phishing Email Selector Panel */}
              <div className="lg:col-span-12 flex flex-wrap gap-2 font-mono text-[11px]">
                {PHISHING_EMAILS.map((email, idx) => (
                  <button
                    key={email.id}
                    onClick={() => handleEmailChange(idx)}
                    className={`px-4 py-2 border rounded-[4px] font-semibold transition-all cursor-pointer ${
                      activeEmailIndex === idx
                        ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                        : "border-white/5 text-on-surface-variant hover:text-white"
                    }`}
                  >
                    Scam Quiz #{idx + 1}: {email.name}
                  </button>
                ))}
              </div>

              {/* Phishing Email Sandbox Inspector */}
              <div className="lg:col-span-8 space-y-6">
                <Panel title="Email Inbox Simulator" idTag="Sandbox" topBorderColor="cyan">
                  <div className="space-y-4 pt-1">
                    
                    {/* Inbox client UI headers */}
                    <div className="border border-white/5 bg-cyber-bg/50 p-4 rounded-[6px] space-y-3 text-xs font-mono">
                      
                      {/* Sender */}
                      <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant font-bold w-20 flex-shrink-0 mt-1">SENDER:</span>
                        <button
                          onClick={() => handleIndicatorClick("sender")}
                          className={`w-full text-left px-2 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                            scamSubmitted
                              ? activeEmail.senderIndicator.isPhishingIndicator
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/5 text-white/50 border border-white/5"
                              : clickedIndicators.includes("sender")
                              ? "bg-red-950 text-red-400 border border-red-500/30"
                              : "bg-white/5 border border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/20 text-white"
                          }`}
                        >
                          <span className="font-bold block text-white/80">{activeEmail.sender}</span>
                          <span className="font-mono text-[10px] break-all">{activeEmail.senderIndicator.text}</span>
                        </button>
                      </div>

                      {/* Subject */}
                      <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant font-bold w-20 flex-shrink-0 mt-1">SUBJECT:</span>
                        <button
                          onClick={() => handleIndicatorClick("subject")}
                          className={`w-full text-left px-2 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                            scamSubmitted
                              ? activeEmail.subjectIndicator.isPhishingIndicator
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/5 text-white/50 border border-white/5"
                              : clickedIndicators.includes("subject")
                              ? "bg-red-950 text-red-400 border border-red-500/30"
                              : "bg-white/5 border border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/20 text-white"
                          }`}
                        >
                          {activeEmail.subjectIndicator.text}
                        </button>
                      </div>

                      {/* Routing stamps */}
                      <div className="flex items-start gap-2">
                        <span className="text-on-surface-variant font-bold w-20 flex-shrink-0 mt-1">ROUTING:</span>
                        <button
                          onClick={() => handleIndicatorClick("routing")}
                          className={`w-full text-left px-2 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                            scamSubmitted
                              ? activeEmail.routingIndicator.isPhishingIndicator
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/5 text-white/50 border border-white/5"
                              : clickedIndicators.includes("routing")
                              ? "bg-red-950 text-red-400 border border-red-500/30"
                              : "bg-white/5 border border-dashed border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/20 text-white"
                          }`}
                        >
                          {activeEmail.routingIndicator.text}
                        </button>
                      </div>

                    </div>

                    {/* Email body sandbox */}
                    <div className="border border-white/5 bg-white/5 p-6 rounded-[6px] font-inter text-sm text-on-surface space-y-4">
                      
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">SANDBOX SIMULATOR CONTENT</span>
                      </div>

                      {/* Greeting indicator */}
                      <div>
                        <button
                          onClick={() => handleIndicatorClick("greeting")}
                          className={`text-left px-1.5 py-0.5 rounded-[2px] font-semibold transition-all cursor-pointer ${
                            scamSubmitted
                              ? activeEmail.greetingIndicator.isPhishingIndicator
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : "bg-transparent text-white"
                              : clickedIndicators.includes("greeting")
                              ? "bg-red-950 text-red-400 border border-red-500/30"
                              : "border border-dashed border-transparent hover:border-cyan-400/40 hover:bg-cyan-950/20 text-white"
                          }`}
                        >
                          {activeEmail.greetingIndicator.text}
                        </button>
                      </div>

                      {/* Body segments */}
                      <div className="space-y-3 leading-relaxed">
                        {activeEmail.bodyHtml.map((item) => (
                          <div key={item.id}>
                            <button
                              onClick={() => handleIndicatorClick(item.id)}
                              className={`text-left px-1.5 py-1 rounded-[2px] transition-all cursor-pointer block w-full ${
                                scamSubmitted
                                  ? item.isPhishingIndicator
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                    : "bg-transparent text-on-surface"
                                  : clickedIndicators.includes(item.id)
                                  ? "bg-red-950 text-red-400 border border-red-500/30"
                                  : "border border-dashed border-transparent hover:border-cyan-400/40 hover:bg-cyan-950/10"
                              }`}
                            >
                              {item.text}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Attachment if present */}
                      {activeEmail.attachment && (
                        <div className="pt-4 border-t border-white/5 mt-4">
                          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-2">
                            EMAIL ATTACHMENTS (SANDBOX ISOLATED):
                          </span>
                          <button
                            onClick={() => handleIndicatorClick("attachment")}
                            className={`flex items-center gap-3 p-3 border rounded-[6px] transition-all cursor-pointer ${
                              scamSubmitted
                                ? activeEmail.attachment.indicator.isPhishingIndicator
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                  : "bg-white/5 border-white/5"
                                : clickedIndicators.includes("attachment")
                                ? "bg-red-950 text-red-400 border border-red-500/30"
                                : "bg-white/5 border-white/10 hover:border-cyan-400/40 hover:bg-cyan-950/20"
                            }`}
                          >
                            <FileText className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <div className="text-left font-mono text-xs">
                              <span className="font-semibold text-white block">{activeEmail.attachment.name}</span>
                              <span className="text-[10px] text-on-surface-variant">{activeEmail.attachment.size}</span>
                            </div>
                          </button>
                        </div>
                      )}

                      <p className="text-[11px] text-on-surface-variant border-t border-white/5 pt-4 font-mono">
                        SafeSteps Learning Sandbox: Click suspicious fields to flag them.
                      </p>

                    </div>

                    {/* Verification Trigger Button */}
                    <div className="flex justify-end pt-2">
                      {!scamSubmitted ? (
                        <Button
                          variant="action"
                          onClick={handleSubmitScam}
                          disabled={clickedIndicators.length === 0}
                        >
                          Check My Answers
                        </Button>
                      ) : (
                        <Button variant="technical" onClick={handleResetScam}>
                          Reset Sandbox
                        </Button>
                      )}
                    </div>

                  </div>
                </Panel>
              </div>

              {/* Right Column: Phishing feedback report */}
              <div className="lg:col-span-4 space-y-6">
                <Panel title="Scam Spotting Report" idTag="Flagged Items">
                  <div className="space-y-5 pt-1">
                    
                    {/* Score Gauge */}
                    <div className="text-center py-4 bg-white/5 border border-white/5 rounded-[6px] space-y-2">
                      <span className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                        Indicators Spotted
                      </span>
                      <div className="font-outfit text-4xl font-extrabold text-white">
                        {scamSubmitted ? scamScore : clickedIndicators.length} <span className="text-cyan-400">/</span> {getTotalIndicators()}
                      </div>
                      <div className="w-[85%] mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <div
                          className={`h-full transition-all duration-300 ${scamSubmitted ? "bg-emerald-400" : "bg-cyan-400"}`}
                          style={{
                            width: `${
                              ((scamSubmitted ? scamScore : clickedIndicators.length) / getTotalIndicators()) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Detail feedback / Explanation box */}
                    <div className="min-h-[160px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        
                        {/* 1. Review Element detail selected */}
                        {scamSubmitted && scamReviewElement ? (
                          <motion.div
                            key="review-detail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border border-cyan-400/30 bg-cyan-950/15 p-4 rounded-[6px] space-y-2.5 text-xs"
                          >
                            <div className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5" />
                              <span>ANALYZING ELEMENT</span>
                            </div>
                            <p className="text-white font-semibold font-mono text-[11px] leading-relaxed italic border-l-2 border-white/10 pl-2">
                              "{getIndicatorDetail(scamReviewElement)?.text}"
                            </p>
                            <p className="text-on-surface-variant font-inter leading-relaxed mt-1">
                              {getIndicatorDetail(scamReviewElement)?.explanation}
                            </p>
                          </motion.div>
                        ) : scamSubmitted ? (
                          // 2. Summary of Submission
                          <motion.div
                            key="scam-submitted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border border-emerald-500/20 bg-emerald-950/5 p-4 rounded-[6px] space-y-3 text-xs font-inter"
                          >
                            <div className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>AUDIT VERIFIED</span>
                            </div>
                            <p className="text-on-surface-variant leading-relaxed">
                              You have locked in your selections. Click on any green highlighted component inside the email sandbox to study why it is marked as a phishing indicator.
                            </p>
                          </motion.div>
                        ) : (
                          // 3. Instruction guide
                          <motion.div
                            key="instructions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center border border-dashed border-white/10 p-4 rounded-[6px]"
                          >
                            <HelpCircle className="w-8 h-8 text-white/20 mx-auto mb-2 animate-pulse" />
                            <p className="text-xs text-on-surface-variant font-inter leading-relaxed">
                              Click on the parts of this email that look suspicious (like weird email addresses or spelling). Then click 'Check My Answers'.
                            </p>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>

                  </div>
                </Panel>
              </div>

              {/* Workflow Guidance Banner */}
              {scamSubmitted && (
                <div className="lg:col-span-12 border border-white/5 bg-gradient-to-r from-blue-950/10 to-indigo-950/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-outfit font-bold text-white text-sm">Ready for the next step?</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-inter font-medium">
                      Let's check your social accounts, location permissions, and privacy settings next.
                    </p>
                  </div>
                  <Button 
                    variant="friendly" 
                    onClick={() => handleTabChange("privacy")}
                  >
                    Go to Privacy Settings Quiz →
                  </Button>
                </div>
              )}

            </motion.div>
          )}

          {/* Tab 3: Privacy Health Review */}
          {activeTab === "privacy" && (
            <motion.div
              key="privacy-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Question Wizard */}
              <div className="lg:col-span-8">
                <Panel title="Privacy Settings Quiz" idTag="Privacy Review" topBorderColor="cyan">
                  <div className="space-y-6 pt-1">
                    
                    {!privacySubmitted ? (
                      <div className="space-y-6">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-on-surface-variant">Step {privacyStep + 1} of {PRIVACY_QUESTIONS.length}: Profile Audit</span>
                            <span className="text-cyan-400 font-bold">{Math.round(((privacyStep + 1) / PRIVACY_QUESTIONS.length) * 100)}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                            <div
                              className="h-full bg-cyan-400 transition-all duration-300"
                              style={{ width: `${((privacyStep + 1) / PRIVACY_QUESTIONS.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Question title */}
                        <div className="space-y-4">
                          <h3 className="font-outfit font-bold text-white text-lg leading-relaxed">
                            {PRIVACY_QUESTIONS[privacyStep].q}
                          </h3>

                          {/* Options */}
                          <div className="flex flex-col gap-3 font-inter">
                            {PRIVACY_QUESTIONS[privacyStep].options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => handlePrivacyAnswer(opt.score, idx)}
                                className="w-full text-left p-4 border border-white/5 hover:border-cyan-400/30 bg-cyber-bg/40 hover:bg-cyan-950/5 text-sm text-on-surface hover:text-white rounded-[6px] transition-all cursor-pointer flex items-start gap-3 group"
                              >
                                <span className="w-5 h-5 bg-white/5 border border-white/10 group-hover:border-cyan-400/50 rounded-full flex items-center justify-center flex-shrink-0 text-cyan-400 text-xs font-mono mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{opt.text}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 text-center py-6 font-inter">
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 rounded-full mx-auto animate-bounce">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-outfit font-bold text-white text-xl">
                            Privacy Review Completed!
                          </h3>
                          <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                            Well done! We have compiled your personal isolation configurations. Please review the recommendations on the right side.
                          </p>
                        </div>

                        <div className="pt-2 max-w-xs mx-auto">
                          <Button variant="technical" className="w-full py-2.5" onClick={handleResetPrivacy}>
                            Take Audit Again
                          </Button>
                        </div>
                      </div>
                    )}

                  </div>
                </Panel>
              </div>

              {/* Right Panel: Scoring & Recommendations */}
              <div className="lg:col-span-4">
                <Panel title="Personalized Recommendations" idTag="Custom Advice">
                  <div className="space-y-5 pt-1">
                    
                    {/* Score display */}
                    {privacySubmitted && (
                      <div className="text-center py-4 bg-white/5 border border-white/5 rounded-[6px] space-y-1">
                        <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">
                          PRIVACY SCORE
                        </span>
                        <div className="font-outfit text-4xl font-extrabold text-white">
                          {privacyScore} <span className="text-cyan-400 font-normal">/</span> 100
                        </div>
                        <div className="w-[85%] mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] mt-1.5">
                          <div
                            className={`h-full transition-all duration-500 ${
                              privacyScore >= 80 ? "bg-emerald-400" : privacyScore >= 50 ? "bg-cyan-400" : "bg-red-500"
                            }`}
                            style={{ width: `${privacyScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Recommendations Feed */}
                    <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 font-inter text-xs">
                      {privacySubmitted ? (
                        privacyAnswers.map((ansIdx, qIdx) => {
                          const optionDetail = PRIVACY_QUESTIONS[qIdx].options[ansIdx];
                          const isHealthy = optionDetail.score >= 15;
                          
                          return (
                            <div
                              key={qIdx}
                              className={`p-3.5 border rounded-[6px] space-y-1.5 ${
                                isHealthy
                                  ? "border-emerald-500/10 bg-emerald-950/5"
                                  : "border-red-500/20 bg-red-950/5"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                                {isHealthy ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                )}
                                <span className={isHealthy ? "text-emerald-400" : "text-red-400"}>
                                  QUESTION {qIdx + 1}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                {optionDetail.recommendation}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-[6px] font-mono text-on-surface-variant">
                          <Eye className="w-6 h-6 mx-auto mb-2 text-white/15" />
                          <span className="font-inter text-xs">Recommendations will appear here after taking the quiz.</span>
                        </div>
                      )}
                    </div>

                  </div>
                </Panel>
              </div>

              {/* Workflow Guidance Banner */}
              {privacySubmitted && (
                <div className="lg:col-span-12 border border-white/5 bg-gradient-to-r from-blue-950/10 to-indigo-950/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-outfit font-bold text-white text-sm">Almost there! 🌟</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-inter font-medium">
                      Your privacy posture is set up. Let's finish up with your browser health configuration checkup.
                    </p>
                  </div>
                  <Button 
                    variant="friendly" 
                    onClick={() => handleTabChange("browser")}
                  >
                    Go to Browser Health Check →
                  </Button>
                </div>
              )}

            </motion.div>
          )}

          {/* Tab 4: Browser Safety Review */}
          {activeTab === "browser" && (
            <motion.div
              key="browser-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Checklist details */}
              <div className="lg:col-span-8">
                <Panel title="Browser Configuration Checklist" idTag="Browser Checklist" topBorderColor="cyan">
                  <div className="space-y-4 pt-1">
                    
                    <p className="text-sm text-on-surface-variant font-inter leading-relaxed">
                      This checklist helps you review browser configuration parameters. Check off items that match your browsing setup.
                    </p>

                    <div className="space-y-3.5 pt-2">
                      {BROWSER_CHECKLIST_ITEMS.map((item) => {
                        const isChecked = browserChecks.includes(item.id);
                        const isExpanded = expandedInfo === item.id;
                        
                        return (
                          <div
                            key={item.id}
                            className={`border rounded-[6px] transition-all overflow-hidden ${
                              isChecked
                                ? "border-cyan-400/25 bg-cyan-950/5"
                                : "border-white/5 bg-transparent"
                            }`}
                          >
                            <div className="flex items-start gap-3 p-4">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleBrowserCheck(item.id)}
                                className="mt-1 accent-cyan-400"
                                id={`check-${item.id}`}
                              />
                              
                              <div className="flex-1 space-y-1 font-inter">
                                <label
                                  htmlFor={`check-${item.id}`}
                                  className="font-outfit font-semibold text-white text-sm cursor-pointer block select-none"
                                >
                                  {item.title}
                                </label>
                                <span className="font-mono text-[9px] text-cyan-400/70 font-bold uppercase tracking-wider block">
                                  {item.category}
                                </span>
                                <p className="text-on-surface-variant text-xs leading-relaxed pt-1">
                                  {item.question}
                                </p>
                              </div>

                              <button
                                onClick={() => setExpandedInfo(isExpanded ? null : item.id)}
                                className="text-on-surface-variant hover:text-white p-1 border border-white/5 hover:border-white/15 bg-white/5 rounded-[4px] cursor-pointer self-start"
                                title="Learn details"
                              >
                                <Info className="w-3.5 h-3.5 text-cyan-400" />
                              </button>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-white/5 bg-black/20 p-4 font-inter text-xs text-on-surface-variant leading-relaxed space-y-1"
                                >
                                  <span className="font-mono text-[9px] text-white font-bold uppercase tracking-wider block">
                                    WHY IT MATTERS:
                                  </span>
                                  <p>{item.info}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-3">
                      {!browserSubmitted ? (
                        <Button
                          variant="action"
                          onClick={handleCalculateBrowserScore}
                          disabled={browserChecks.length === 0}
                        >
                          Check My Setup
                        </Button>
                      ) : (
                        <Button variant="technical" onClick={handleResetBrowser}>
                          Reset Checklist
                        </Button>
                      )}
                    </div>

                  </div>
                </Panel>
              </div>

              {/* Right panel: Browser Scoring feedback */}
              <div className="lg:col-span-4">
                <Panel title="Browser Safety Rating" idTag="Safety Posture">
                  <div className="space-y-5 pt-1">
                    
                    {browserSubmitted ? (
                      <div className="space-y-4">
                        {/* Score Card */}
                        <div className="text-center py-5 bg-white/5 border border-white/5 rounded-[6px] space-y-1">
                          <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">
                            SAFETY POSTURE RATING
                          </span>
                          <div className="font-outfit text-4xl font-extrabold text-white">
                            {browserScore} <span className="text-cyan-400 font-normal">%</span>
                          </div>
                          <div className="w-[85%] mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] mt-1.5">
                            <div
                              className={`h-full transition-all duration-500 ${
                                browserScore >= 80 ? "bg-emerald-400" : browserScore >= 50 ? "bg-cyan-400" : "bg-red-500"
                              }`}
                              style={{ width: `${browserScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Audit summary */}
                        <div className="border border-white/5 bg-white/5 p-4 rounded-[6px] space-y-2 text-xs font-inter leading-relaxed text-on-surface-variant">
                          <div className="flex items-center gap-1 text-cyan-400 font-mono font-bold tracking-wider uppercase text-[10px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>POSTURE ANALYSIS</span>
                          </div>
                          <p>
                            {browserScore === 100
                              ? "Excellent! Your browser configurations follow our maximum protection guidelines. Traps and trackers are blocked."
                              : browserScore >= 50
                              ? "Secure baseline. Check out the remaining items in the audit list to patch potential tracking holes."
                              : "Vulnerable posture. Consider deploying a secure manager and auditing active browser extension rights today."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-white/10 rounded-[6px] font-mono text-on-surface-variant">
                        <Lock className="w-6 h-6 mx-auto mb-2 text-white/15" />
                        <span className="font-inter text-xs">Complete the checklist to compile your safety posture details.</span>
                      </div>
                    )}

                  </div>
                </Panel>
              </div>

              {/* Workflow Guidance Banner */}
              {browserSubmitted && (
                <div className="lg:col-span-12 border border-white/5 bg-gradient-to-r from-emerald-950/10 to-teal-950/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 animate-pulse">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-outfit font-bold text-white text-sm">Congratulations! 🎉 You are fully checked.</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-inter font-medium">
                      You have completed all four safety checkups. Collect your student completion certificate!
                    </p>
                  </div>
                  <Button 
                    variant="friendly" 
                    onClick={() => router.push("/certificate")}
                  >
                    Get My Certificate →
                  </Button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

// ----------------------------------------------------
// Phishing Emails Static Database for "Spot the Scam"
// ----------------------------------------------------
// (End of file, keep rest the same)
