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
      <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 max-w-[520px]">
        Three steps. That&apos;s it.
      </h2>
      <p className="text-base text-zinc-600 max-w-[480px] leading-[1.7]">
        No technical knowledge required. We handle everything from start to
        finish.
      </p>

      <div className="grid grid-cols-3 gap-12 mt-14 relative max-sm:grid-cols-1 max-sm:gap-8">
        {/* Connecting line — hidden on tablet/mobile */}
        <div className="absolute top-7 left-[15%] right-[15%] h-px bg-black/10 max-lg:hidden" />

        {steps.map((step) => (
          <div key={step.num} className="text-left relative">
            <div className="w-14 h-14 bg-white border border-black/10 rounded-full flex items-center justify-center text-xl font-bold mb-5 relative z-[1] tracking-[-0.5px]">
              {step.num}
            </div>
            <h4 className="text-[17px] font-bold tracking-[-0.3px] mb-1.5">
              {step.title}
            </h4>
            <p className="text-sm text-zinc-600 leading-[1.6] max-w-[280px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
