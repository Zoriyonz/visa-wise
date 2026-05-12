interface DocumentsChecklistProps {
  items: string[];
}

export function DocumentsChecklist({ items }: DocumentsChecklistProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 rounded-[16px] border border-border bg-surface p-8">
      <h2 className="font-display text-[28px] text-dark">Documents & Steps Checklist</h2>
      <p className="font-body text-[14px] text-muted mt-2">
        Based on your matching pathways
      </p>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4">
            <span
              className="mt-1 h-4 w-4 shrink-0 rounded-[4px] border border-border bg-cream"
              aria-hidden="true"
            />
            <span className="font-body text-[15px] text-dark">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
