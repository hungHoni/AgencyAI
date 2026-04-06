const steps = [
  {
    num: 1,
    title: "Book a free call",
    description:
      "Tell us about your business, your customers, and what you need help with.",
  },
  {
    num: 2,
    title: "We build it",
    description:
      "Custom chatbot trained on your business data, ready in days, not weeks.",
  },
  {
    num: 3,
    title: "Go live",
    description:
      "One line of code on your site. We handle deployment, monitoring, and updates.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16">
      <div className="text-xs font-semibold text-emerald-600 tracking-[1.2px] uppercase mb-3">
        Process
      </div>
      <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 max-w-[520px] text-wrap-balance">
        Three steps. That&apos;s it.
      </h2>
      <p className="text-base text-zinc-600 max-w-[480px] leading-[1.7]">
        No technical knowledge required. We handle everything from start to
        finish.
      </p>

      {/* Staggered 2-column layout instead of banned 3-column equal grid */}
      <div className="mt-14 flex flex-col gap-5 max-w-[720px]">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="grid grid-cols-[56px_1fr] gap-5 items-start"
            style={{ marginLeft: `${i * 40}px` }}
          >
            <div className="w-14 h-14 bg-white border border-black/10 rounded-full flex items-center justify-center text-xl font-bold tracking-[-0.5px] shrink-0 shadow-card">
              {step.num}
            </div>
            <div className="pt-1">
              <h4 className="text-[17px] font-bold tracking-[-0.3px] mb-1.5">
                {step.title}
              </h4>
              <p className="text-sm text-zinc-600 leading-[1.6] max-w-[320px]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
