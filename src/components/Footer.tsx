import Link from "next/link";

import { Logo } from "./Logo";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="bg-dark border-t border-dark-border py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} />
          <Wordmark inverted />
        </Link>

        <Link
          href="/terms"
          className="font-body text-[13px] text-muted hover:text-cream transition-colors"
        >
          Terms of Service
        </Link>

        <p className="font-body text-[13px] text-muted text-center md:text-right">
          © 2026 Visa-Wise. Informational only. Not legal advice.
        </p>
      </div>
    </footer>
  );
}
