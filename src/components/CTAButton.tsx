"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type CTAVariant = "dark" | "cream";
type CTASize = "md" | "lg";

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: CTAVariant;
  size?: CTASize;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const SIZE_CLASSES: Record<CTASize, string> = {
  md: "h-10 px-6 text-[14px] rounded-[12px]",
  lg: "h-[52px] px-8 text-[15px] rounded-[14px]",
};

const VARIANT_CLASSES: Record<CTAVariant, string> = {
  dark:
    "bg-dark text-cream shadow-cta hover:shadow-cta-hover hover:brightness-[0.85] hover:scale-[1.02]",
  cream: "bg-cream text-dark hover:brightness-[0.95] hover:scale-[1.02]",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center font-body font-semibold transition-[transform,filter,box-shadow] duration-200 ease-out";

export function CTAButton({
  children,
  href,
  onClick,
  variant = "dark",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ariaLabel,
}: CTAButtonProps) {
  const widthClass = fullWidth ? "w-full" : "";
  const composed = `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${widthClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={composed} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={composed}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
