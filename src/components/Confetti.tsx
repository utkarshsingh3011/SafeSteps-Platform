"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  d: number;
  color: string;
  tilt: number;
  tiltAngleIncremental: number;
  tiltAngle: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle colors
    const colors = [
      "#22d3ee", // Cyan
      "#8aebff", // Muted cyan
      "#3b82f6", // Blue
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ef4444", // Red
    ];

    const particles: Particle[] = [];
    const maxParticles = 100;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 4 + 4,
        d: Math.random() * maxParticles + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
      });
    }

    let timeElapsed = 0;

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx!.beginPath();
        ctx!.lineWidth = p.r;
        ctx!.strokeStyle = p.color;
        ctx!.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx!.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx!.stroke();
      });

      update();
    }

    function update() {
      timeElapsed += 1;
      
      // Stop and clear after ~3 seconds (180 frames)
      if (timeElapsed > 180) {
        ctx!.clearRect(0, 0, width, height);
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(draw);
      }
    }

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none w-full h-full"
    />
  );
}
