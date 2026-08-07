"use client";

import React, { useEffect, useState } from "react";
import { type JSX } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type TextShimmerWaveProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  transition?: Transition;
  baseColor?: string;
  gradientColor?: string;
};

export function TextShimmerWave({
  children,
  as: Component = "p",
  className,
  duration = 1.2,
  zDistance = 12,
  xDistance = 2,
  yDistance = -4,
  spread = 1,
  scaleDistance = 1.12,
  rotateYDistance = 15,
  transition,
  baseColor: customBaseColor,
  gradientColor: customGradientColor,
}: TextShimmerWaveProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements,
  );

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const baseColor = customBaseColor || (isDark ? "#a1a1aa" : "#18181b");
  const gradientColor = customGradientColor || (isDark ? "#ffffff" : "#71717a");

  return (
    <MotionComponent
      className={cn("relative inline-block [perspective:500px]", className)}
      style={{ color: baseColor }}
    >
      {children.split("").map((char, i) => {
        const delay = (i * duration * (1 / spread)) / children.length;

        return (
          <motion.span
            key={`${char}-${i}-${isDark}`}
            className="inline-block whitespace-pre [transform-style:preserve-3d]"
            initial={{
              translateZ: 0,
              scale: 1,
              rotateY: 0,
              color: baseColor,
            }}
            animate={{
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: [baseColor, gradientColor, baseColor],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatDelay: (children.length * 0.05) / spread,
              delay,
              ease: "easeInOut",
              ...transition,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}

export default function TextShimmerMotion() {
  return (
    <TextShimmerWave
      duration={1}
      spread={1}
      zDistance={1}
      scaleDistance={1.1}
      rotateYDistance={20}
    >
      Shadcnspace generating your table...
    </TextShimmerWave>
  );
}
