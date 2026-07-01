"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "technical" | "action" | "ghost" | "friendly" | "friendly-outline";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export default function Button({
  variant = "primary",
  children,
  icon,
  iconPosition = "right",
  className = "",
  ...props
}: ButtonProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        // Solid blue, white text, 6px radius, hover cyan glow
        return "bg-blue-600 hover:bg-blue-500 text-white font-inter font-semibold text-sm border border-transparent shadow-sm hover:shadow-[0_0_12px_rgba(34,211,238,0.45)] hover:border-cyan-400/50 rounded-[6px]";
      
      case "friendly":
        // Soft gradient, white text, rounded-full
        return "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-inter font-bold text-sm border border-transparent shadow-md hover:shadow-cyan-400/20 rounded-full px-6";
      
      case "friendly-outline":
        // Friendly outline, rounded-full
        return "border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-on-surface hover:text-white font-inter font-medium text-sm rounded-full px-6";

      case "technical":
        // Ghost style with 1px cyan border and uppercase mono font
        return "border border-cyan-400/40 bg-cyan-950/15 hover:bg-cyan-950/30 text-cyan-400 hover:text-cyan-300 font-mono text-[12px] font-bold tracking-wider uppercase rounded-[6px] hover:shadow-[0_0_10px_rgba(34,211,238,0.25)]";
      
      case "action":
        // Bottom-right clipped corner chamfer, cyan background with black text
        return "bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[13px] font-bold tracking-wider uppercase chamfer-br border border-transparent hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]";
      
      case "ghost":
      default:
        // Plain text with hover effect
        return "text-on-surface-variant hover:text-white font-inter text-sm hover:bg-white/5 rounded-[6px]";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${className}`}
      {...props as any}
    >
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  );
}
