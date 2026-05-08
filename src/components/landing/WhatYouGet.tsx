import { SectionLabel } from "@/components/SectionLabel";

import { AnalysisPreview } from "./AnalysisPreview";
import { DeliverableList } from "./DeliverableList";

export function WhatYouGet() {
  return (
    <section className="bg-dark py-20 md:py-[120px] px-6 lg:px-10">
      <div className="mx-auto mb-16 max-w-3xl md:mb-20">
        <SectionLabel inverted>DELIVERABLES</SectionLabel>
        <h2 className="font-display font-light text-display-lg text-cream mt-6">
          Everything you need to move forward
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-center">
        <DeliverableList />
        <AnalysisPreview />
      </div>
    </section>
  );
}
