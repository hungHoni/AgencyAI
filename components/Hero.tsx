import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

export default function Hero() {
  return (
    <section id="hero" className="relative grid grid-cols-[5fr_4fr] gap-20 px-12 py-24 pb-20 max-w-site mx-auto items-center min-h-[85dvh] max-lg:grid-cols-1 max-lg:gap-12 max-lg:min-h-auto max-lg:px-8 max-lg:py-16 max-sm:px-5 max-sm:py-12">
      {/* Ambient gradient for depth */}
      <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div>
        {/* Hero tag */}
        <div className="inline-flex items-center gap-2 bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-600 mb-7 tracking-[0.3px] uppercase">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-[breathe_2.4s_ease-in-out_infinite]" />
          AI-Powered for Local Businesses
        </div>

        <h1 className="text-[clamp(2.75rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-1.8px] mb-6 max-w-[560px] text-wrap-balance">
          An AI employee that never&nbsp;sleeps.
        </h1>

        <p className="text-[17px] text-zinc-600 mb-10 max-w-[480px] leading-[1.7] tracking-[-0.1px]">
          Custom AI chatbots that answer customer questions, capture leads, book
          appointments, and handle support around the clock. Built for businesses
          that can&apos;t afford to miss a single customer.
        </p>

        <div className="flex gap-3 items-center">
          <Link
            href="#contact"
            className="bg-zinc-900 text-[#fafaf9] px-7 py-3.5 rounded-btn text-[15px] font-semibold tracking-[-0.2px] hover:bg-zinc-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth"
          >
            Get Started
          </Link>
          <Link
            href="#contact"
            className="bg-transparent text-zinc-600 px-6 py-3.5 rounded-btn text-[15px] font-medium tracking-[-0.2px] border border-black/10 hover:border-zinc-400 hover:text-zinc-900 hover:-translate-y-0.5 transition-all duration-400 ease-smooth"
          >
            Book a Free Call
          </Link>
        </div>
      </div>

      <div>
        <ChatWidget />
      </div>
    </section>
  );
}
