"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import ChatWidget from "@/components/ChatWidget";
import SplineScene from "@/components/SplineScene";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [showSpline, setShowSpline] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Delay Spline loading so text + chat load first
  useEffect(() => {
    const timer = setTimeout(() => setShowSpline(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative grid grid-cols-[5fr_4fr] gap-20 px-12 py-20 pb-16 max-w-site mx-auto items-center min-h-[85dvh] max-lg:grid-cols-1 max-lg:gap-12 max-lg:min-h-auto max-lg:px-8 max-lg:py-14 max-sm:px-5 max-sm:py-10">
      {/* Ambient gradients */}
      <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(96,165,250,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(96,165,250,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* 3D Spline scene — full hero background, centered, hidden on mobile */}
      {showSpline && (
        <div
          className="absolute inset-0 z-0 flex items-center justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.92)",
            transition: "opacity 2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <div
            className="w-[900px] h-[900px] translate-x-[10%] max-lg:w-[700px] max-lg:h-[700px] max-lg:translate-x-0 max-lg:opacity-30 max-sm:w-[500px] max-sm:h-[500px] max-sm:translate-y-[15%]"
            style={{ WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 95%)", maskImage: "linear-gradient(to bottom, black 75%, transparent 95%)" }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Left column — text content */}
      <div className="relative z-50 pointer-events-auto">
        <div
          className="inline-flex items-center gap-2 bg-[rgba(96,165,250,0.06)] border border-[rgba(96,165,250,0.15)] px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-500 mb-7 tracking-[0.3px] uppercase"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0s",
          }}
        >
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-[breathe_2.4s_ease-in-out_infinite]" />
          {t("hero.tag")}
        </div>

        <h1
          className="text-[clamp(2.75rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-1.8px] mb-6 max-w-[560px] text-wrap-balance"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s",
          }}
        >
          {t("hero.headline")}
        </h1>

        <p
          className="text-lg text-zinc-700 mb-10 max-w-[480px] leading-[1.7] tracking-[-0.1px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.16s",
          }}
        >
          {t("hero.subtext")}
        </p>

        <div
          className="flex gap-3 items-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.24s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.24s",
          }}
        >
          <a
            href="#contact"
            className="bg-zinc-900 text-[#fafaf9] px-7 py-3.5 rounded-btn text-[15px] font-semibold tracking-[-0.2px] hover:bg-zinc-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth"
          >
            {t("hero.getStarted")}
          </a>
          <a
            href="#contact"
            className="bg-transparent text-zinc-600 px-6 py-3.5 rounded-btn text-[15px] font-medium tracking-[-0.2px] border border-black/10 hover:border-zinc-400 hover:text-zinc-900 hover:-translate-y-0.5 transition-all duration-400 ease-smooth"
          >
            {t("hero.bookCall")}
          </a>
        </div>
      </div>

      {/* Right column — ChatWidget */}
      <div
        className="relative z-10"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(40px)",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
        }}
      >
        <ChatWidget />
      </div>
    </section>
  );
}
