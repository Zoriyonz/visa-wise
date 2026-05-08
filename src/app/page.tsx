import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FAQ } from "@/components/landing/FAQ";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { TrustBar } from "@/components/landing/TrustBar";
import { WhatYouGet } from "@/components/landing/WhatYouGet";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <WhatYouGet />
        <Testimonials />
        <FAQ />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
