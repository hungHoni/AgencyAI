"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation, useTranslationData } from "@/lib/i18n/context";

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();
  const data = useTranslationData();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-play steps
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section id="how-it-works" ref={ref} className="max-w-site mx-auto px-12 py-32 max-sm:px-5 max-sm:py-20 relative z-10">
      
      <div className="grid grid-cols-[1fr_1.1fr] gap-24 items-center max-lg:grid-cols-1 max-lg:gap-16">
        
        {/* Left Side: Header & Stepper */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-24px)", transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div className="text-xs font-semibold text-blue-500 tracking-[1.2px] uppercase mb-4">{t("howItWorks.sectionTag")}</div>
          <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-6 max-w-[500px] text-wrap-balance">{t("howItWorks.headline")}</h2>
          <p className="text-[17px] text-zinc-600 leading-[1.7] mb-12 max-w-[480px]">{t("howItWorks.subtext")}</p>
          
          <div className="flex flex-col relative max-w-[500px]">
            {/* Background absolute line */}
            <div className="absolute left-[23px] top-4 bottom-12 w-[2px] bg-black/[0.04]" />
            
            {data.howItWorks.steps.map((step, i) => {
              const isActive = activeStep === i;
              const isPast = activeStep > i;

              return (
                <div 
                  key={i}
                  className="relative flex gap-6 pb-12 cursor-pointer group"
                  onClick={() => setActiveStep(i)}
                >
                  {/* Active highlight line linking nodes */}
                  {i !== 2 && (
                    <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-blue-500 origin-top transition-transform duration-700 ease-in-out z-10" 
                      style={{ transform: isPast ? "scaleY(1)" : "scaleY(0)" }} 
                    />
                  )}

                  <div 
                    className={`relative z-20 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold tracking-[-0.5px] shrink-0 transition-all duration-500 ${
                      isActive 
                        ? "bg-blue-500 text-white shadow-[0_0_24px_rgba(96,165,250,0.5)] scale-110" 
                        : isPast 
                          ? "bg-blue-500 text-white" 
                          : "bg-white border-2 border-black/10 text-zinc-400 group-hover:border-black/20"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <div className={`pt-2 transition-all duration-500 ${isActive ? "opacity-100 translate-x-2" : "opacity-40 hover:opacity-70"}`}>
                    <h4 className={`text-[19px] font-bold tracking-[-0.3px] mb-2 ${isActive ? "text-zinc-900" : "text-zinc-600"}`}>{step.title}</h4>
                    <p className="text-[15px] text-zinc-600 leading-[1.6] max-w-[340px]">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Animated Visualizations */}
        <div 
          className="relative w-full h-[520px] flex items-center justify-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(24px)", transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}
        >

           {/* Step 1 Graphic: Calendar / Booking */}
           {/* Abstract Calendar UI popping up */}
           <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out z-10 ${activeStep === 0 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
              <div className="w-[300px] h-[340px] bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-black/[0.04] flex flex-col py-7 px-7 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
                 
                 <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="w-24 h-4 bg-zinc-200 rounded-full" />
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                       <div className="w-4 h-4 bg-blue-500 rounded-md" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-3 mb-8 relative z-10">
                    {[...Array(12)].map((_, j) => (
                      <div key={j} className={`h-12 rounded-[10px] transition-all duration-500 delay-${j*100} ${j === 6 ? 'bg-blue-500 shadow-lg shadow-blue-500/25 scale-110' : 'bg-zinc-100'}`} />
                    ))}
                 </div>
                 
                 <div className="mt-auto h-12 w-full bg-zinc-900 rounded-[12px] flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="w-1/2 h-2.5 bg-white/20 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                 </div>
              </div>
           </div>

           {/* Step 2 Graphic: AI Brain / Building */}
           <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out z-10 ${activeStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
              <div className="w-full h-full relative flex items-center justify-center">
                 {/* Glowing backdrops */}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse,rgba(96,165,250,0.12)_0%,transparent_60%)] animate-pulse" />
                 
                 {/* Orbits */}
                 <div className="absolute w-[220px] h-[220px] animate-[spin_8s_linear_infinite]">
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.8)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
                    <div className="w-full h-full rounded-full border border-blue-400/20" />
                 </div>
                 <div className="absolute w-[300px] h-[300px] animate-[spin_12s_linear_infinite_reverse]">
                    <div className="w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)] absolute top-1/2 -right-1.5 -translate-y-1/2" />
                    <div className="w-full h-full rounded-full border border-amber-400/20" />
                 </div>

                 {/* Center AI Node */}
                 <div className="w-24 h-24 bg-[#1a1a1f] rounded-[24px] shadow-2xl border border-white/10 flex items-center justify-center relative z-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.2),transparent)]" />
                    <svg className="w-10 h-10 text-blue-400 animate-pulse drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
              </div>
           </div>

           {/* Step 3 Graphic: Go Live (Browser) */}
           <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out z-10 ${activeStep === 2 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
              <div className="w-[380px] bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-black/[0.06] overflow-hidden flex flex-col">
                 <div className="h-10 bg-zinc-50 border-b border-black/[0.04] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20" />
                 </div>
                 <div className="p-8 flex flex-col justify-center items-center h-[260px] relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-transparent">
                    {/* Floating confetti / shapes */}
                    <div className="absolute top-10 left-10 w-4 h-4 bg-amber-300 rounded-sm rotate-12 animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-5 h-5 bg-blue-300 rounded-full animate-bounce" style={{animationDuration: '3s'}} />
                    
                    {/* Success Shield */}
                    <div className="w-20 h-20 bg-blue-500 rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-500/30 relative z-10 mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    
                    <div className="w-3/4 h-5 bg-zinc-800 rounded-full mb-3" />
                    <div className="w-1/2 h-4 bg-zinc-200 rounded-full" />
                 </div>
              </div>
           </div>

        </div>
        
      </div>
    </section>
  );
}
