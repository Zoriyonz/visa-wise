"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./use-reduced-motion";

interface CountUpResult {
  value: number;
  ref: React.RefObject<HTMLDivElement | null>;
}

export function useCountUp(target: number, duration = 1.6): CountUpResult {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const triggered = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || triggered.current) continue;
          triggered.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, reduced]);

  return { value: reduced ? target : animatedValue, ref };
}
