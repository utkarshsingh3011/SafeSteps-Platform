"use client";

import React from "react";
import { motion } from "framer-motion";

interface PanelProps {
  title?: string;
  icon?: React.ReactNode;
  idTag?: string;
  topBorderColor?: "cyan" | "blue" | "emerald" | "none";
  className?: string;
  children: React.ReactNode;
  noHoverAnim?: boolean;
}

export default function Panel({
  title,
  icon,
  idTag,
  topBorderColor = "none",
  className = "",
  children,
  noHoverAnim = false,
}: PanelProps) {
  
  const getTopBorderClass = () => {
    switch (topBorderColor) {
      case "cyan":
        return "border-t-[3px] border-cyan-400";
      case "blue":
        return "border-t-[3px] border-blue-500";
      case "emerald":
        return "border-t-[3px] border-emerald-400";
      default:
        return "";
    }
  };

  const hoverProps = noHoverAnim
    ? {}
    : {
        whileHover: { y: -4, transition: { duration: 0.2 } },
      };

  return (
    <motion.div
      {...hoverProps}
      className={`bg-cyber-panel border border-white/10 hover:border-cyan-400/35 hover:shadow-[0_0_15px_rgba(34,211,238,0.06)] rounded-2xl transition-all duration-300 relative flex flex-col ${getTopBorderClass()} ${className}`}
    >
      {/* Panel Header */}
      {(title || idTag) && (
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 min-h-[48px]">
          <div className="flex items-center gap-2">
            {icon && <div className="text-cyan-400">{icon}</div>}
            {title && (
              <h3 className="font-outfit font-semibold text-white tracking-wide text-[16px]">
                {title}
              </h3>
            )}
          </div>
          {idTag && (
            <span className="font-mono text-[10px] font-semibold text-cyan-400 bg-cyan-950/20 px-2.5 py-0.5 border border-cyan-400/20 rounded-full tracking-wide">
              {idTag}
            </span>
          )}
        </div>
      )}

      {/* Panel Body */}
      <div className="p-5 flex-1 flex flex-col">{children}</div>
    </motion.div>
  );
}
