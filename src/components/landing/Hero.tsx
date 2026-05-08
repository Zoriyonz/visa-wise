"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CTAButton } from "@/components/CTAButton";
import { useReducedMotion } from "@/lib/use-reduced-motion";

import { ScrollIndicator } from "./ScrollIndicator";

const HEADLINE_LINES = [
  "Know your immigration pathway",
  "before you spend thousands",
  "on a lawyer",
] as const;

export function Hero() {
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    const targets = lineRefs.current.filter(Boolean);
    if (targets.length === 0) return;
    gsap.fromTo(
      targets,
      { clipPath: "inset(0 0 100% 0)", y: 20 },
      {
        clipPath: "inset(0 0 0% 0)",
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3,
      },
    );
  }, [reduced]);

  return (
    <section className="noise-overlay relative flex min-h-screen items-center justify-center px-6 pt-32 pb-24 md:pt-40">
      <div className="relative mx-auto max-w-[800px] text-center">
        <h1 className="font-display font-light text-dark text-center text-[44px] md:text-[56px] xl:text-display-xl mx-auto leading-[1.05] tracking-[-0.02em]">
          {HEADLINE_LINES.map((line, lineIndex) => (
            <span
              key={line}
              style={{ display: "block", overflow: "hidden" }}
            >
              <span
                ref={(node) => {
                  lineRefs.current[lineIndex] = node;
                }}
                style={{
                  display: "inline-block",
                  clipPath: reduced ? undefined : "inset(0 0 100% 0)",
                  willChange: "clip-path, transform",
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="font-body text-muted text-center mt-8 text-[16px] md:text-[18px] max-w-[540px] mx-auto"
          style={{ lineHeight: 1.6 }}
        >
          Answer a few targeted questions. Our engine checks 40+ pathways
          against published IRCC and USCIS guidelines — not AI guesswork.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-10 flex justify-center"
        >
          <CTAButton href="/form" size="lg" variant="dark">
            Start Your Analysis — $19.99
          </CTAButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="font-body text-[13px] text-muted text-center mt-6"
        >
          Used by immigrants navigating Express Entry, H-1B, EB-2, and 40+
          other pathways
        </motion.p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
