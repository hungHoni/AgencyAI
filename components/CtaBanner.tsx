import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="px-12 max-sm:px-5">
      <div className="max-w-site mx-auto bg-zinc-900 rounded-card p-16 grid grid-cols-[1fr_auto] gap-12 items-center relative overflow-hidden max-lg:grid-cols-1 max-lg:text-center max-lg:p-12 max-lg:px-8 max-sm:p-10 max-sm:px-6">
        {/* Radial gradient overlays for depth */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[60%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold text-zinc-100 tracking-[-1px] leading-[1.1] mb-2 text-wrap-balance">
            Ready to stop missing customers?
          </h2>
          <p className="text-[15px] text-zinc-500 max-w-[420px] leading-[1.6] max-lg:mx-auto">
            Book a free 15-minute call. We&apos;ll show you exactly what your AI
            chatbot could do for your business.
          </p>
        </div>

        <Link
          href="#contact"
          className="relative z-10 bg-emerald-500 text-white px-9 py-4 rounded-btn text-[15px] font-semibold tracking-[-0.2px] whitespace-nowrap shrink-0 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth"
        >
          Book a Free Call
        </Link>
      </div>
    </section>
  );
}
