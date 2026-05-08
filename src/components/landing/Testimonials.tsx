"use client";

import { motion } from "framer-motion";

import { SectionLabel } from "@/components/SectionLabel";

const TESTIMONIALS = [
  {
    quote:
      "\u201CI spent weeks trying to understand Express Entry. This tool gave me a complete picture in 20 minutes — and identified that my CRS score was high enough for a provincial draw I hadn\u2019t even considered.\u201D",
    name: "Priya M.",
    role: "Software Engineer, India \u2192 Canada",
  },
  {
    quote:
      "\u201CAs an F-1 student watching my OPT clock run down, I needed clarity fast. The gap analysis told me exactly what I needed to do to strengthen my EB-2 NIW case.\u201D",
    name: "Wei L.",
    role: "PhD Candidate, China \u2192 United States",
  },
  {
    quote:
      "\u201CMy lawyer wanted $450 just to tell me my options. For $9.99 I got a report that was honestly more thorough than what I\u2019d have gotten in that meeting.\u201D",
    name: "Fatima O.",
    role: "Healthcare Professional, Nigeria \u2192 Canada",
  },
] as const;

export function Testimonials() {
  return (
    <section className="bg-cream py-20 md:py-[120px] px-6 lg:px-10">
      <div className="mx-auto mb-16 max-w-3xl md:mb-20">
        <SectionLabel>WHAT PEOPLE SAY</SectionLabel>
        <h2 className="font-display font-light text-display-lg text-dark mt-6">
          Real people. Real pathways.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TESTIMONIALS.map((testimonial, index) => (
          <motion.figure
            key={testimonial.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="bg-surface border border-border rounded-[24px] p-6 md:p-8"
          >
            <blockquote
              className="font-display italic text-[20px] text-dark"
              style={{ lineHeight: 1.4 }}
            >
              {testimonial.quote}
            </blockquote>
            <div className="h-px bg-border mt-8" />
            <figcaption>
              <p className="font-body font-semibold text-[14px] text-dark mt-6">
                {testimonial.name}
              </p>
              <p className="font-body text-[13px] text-muted mt-1">
                {testimonial.role}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
