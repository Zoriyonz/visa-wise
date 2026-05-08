"use client";

import type { ReactNode } from "react";

interface OptionButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export function OptionButton({ children, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-cream border border-border rounded-[10px] px-5 py-4 font-body text-[15px] text-dark hover:bg-dark hover:text-cream hover:border-dark transition-colors duration-150"
    >
      {children}
    </button>
  );
}
