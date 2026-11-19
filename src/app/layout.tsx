import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Visa-Wise — Free Canadian immigration pathway analysis",
  description:
    "Answer a few targeted questions. Our engine checks 40+ Canadian pathways against published IRCC guidelines — not AI guesswork.",
  icons: {
    icon: "/visawise_logo_v3.svg",
    shortcut: "/visawise_logo_v3.svg",
    apple: "/visawise_logo_v3.svg",
  },
  openGraph: {
    title: "Visa-Wise",
    description: "Know your immigration pathway before you spend thousands on a lawyer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F0E8",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const fontVariables = `${cormorant.variable} ${inter.variable} ${jetbrains.variable}`;
  return (
    <html lang="en" data-scroll-behavior="smooth" className={fontVariables}>
      <body className="font-body bg-cream text-dark antialiased">{children}</body>
    </html>
  );
}
