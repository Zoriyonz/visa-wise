"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { CTAButton } from "./CTAButton";
import { Logo } from "./Logo";
import { Wordmark } from "./Wordmark";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-border"
      style={{
        backgroundColor: "rgba(245, 240, 232, 0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={40} />
          <Wordmark />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-[14px] text-muted hover:text-dark transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <CTAButton href="/form" variant="dark" size="md">
          <span className="hidden sm:inline">Start Analysis</span>
          <span className="sm:hidden">Start</span>
        </CTAButton>
      </div>
    </motion.header>
  );
}
