"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "warning" | "info";

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    const ACHIEVEMENT_NAMES: { [id: string]: string } = {
      "first-login": "First Login",
      "first-lesson": "First Lesson",
      "password-protector": "Password Defender",
      "scam-spotter": "Scam Spotter",
      "privacy-explorer": "Privacy Explorer",
      "browser-hygiene": "Browser Protector",
      "weekly-learner": "Weekly Learner",
      "safesteps-graduate": "SafeSteps Graduate",
    };

    const handleUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const name = ACHIEVEMENT_NAMES[customEvent.detail.id] || customEvent.detail.id;
      showToast(`Achievement Unlocked: ${name}! 🏆`, "success");
    };

    window.addEventListener("safesteps_achievement_unlocked", handleUnlock);
    return () => {
      window.removeEventListener("safesteps_achievement_unlocked", handleUnlock);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-cyber-panel border border-cyan-500/30 text-white rounded-[6px] shadow-[0_0_15px_rgba(34,211,238,0.12)] p-4 flex items-start gap-3 relative font-mono text-xs overflow-hidden"
            >
              {/* Highlight line */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                toast.type === "success" ? "bg-emerald-400" :
                toast.type === "warning" ? "bg-red-400" : "bg-cyan-400"
              }`} />
              
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {toast.type === "warning" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {toast.type === "info" && <Info className="w-4 h-4 text-cyan-400" />}
              </div>

              {/* Text content */}
              <div className="flex-1 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest block uppercase">
                  SafeSteps // {toast.type}
                </span>
                <p className="text-white font-inter font-medium leading-relaxed">{toast.text}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-on-surface-variant hover:text-white transition-colors p-0.5 border border-transparent hover:border-white/10 rounded-[4px] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
