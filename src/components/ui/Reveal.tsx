"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  duration?: number;
  delay?: number;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right";
}

export default function Reveal({
  children,
  className = "",
  once = true,
  duration = 700,
  delay = 0,
  animation = "fade-up",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once]);

  const animationClass = {
    "fade-up": isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
    "fade-down": isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0",
    "fade-left": isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
    "fade-right": isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0",
  }[animation];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${animationClass} ${className}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
