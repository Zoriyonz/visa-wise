"use client";

import { motion } from "framer-motion";

import { useReducedMotion } from "@/lib/use-reduced-motion";

export function ScrollIndicator() {
  const reduced = useReducedMotion();
  return (
    <div
      className="relative h-8 w-px bg-border overflow-hidden"
      aria-hidden="true"
    >
      {!reduced && (
        <motion.div
          className="absolute left-0 top-0 h-3 w-px bg-dark"
          animate={{ y: [0, 32] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
