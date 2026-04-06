"use client";

import { useRef, useEffect, useState } from "react";

const metrics = [
  { value: "24/7", label: "Always available", isText: true },
  { value: "~80%", label: "Questions handled instantly", prefix: "~", number: 80, suffix: "%" },
  { value: "Zero", label: "Missed customer inquiries", isText: true },
  { value: "No code", label: "Required to get started", isText: true },
];

function AnimatedNumber({ prefix = "", number, suffix = "" }: { prefix?: string; number: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const steps = 40;
    const increment = number / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= number) {
        setCount(number);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [visible, number]);

  return (
    <div ref={ref} className="text-[32px] font-bold tracking-[-1px] tabular-nums">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="px-12 py-14 max-w-site mx-auto border-t border-black/[0.06] max-sm:px-5 max-sm:py-10">
      <div className="flex justify-start max-sm:flex-wrap">
        {metrics.map((m, i) => (
          <div
            key={m.value}
            className={`text-left flex-1 ${
              i > 0 ? "pl-10 border-l border-black/[0.06] max-sm:border-l-0 max-sm:pl-0" : ""
            } max-sm:w-1/2 max-sm:py-4`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
            }}
          >
            {m.isText ? (
              <div className="text-[32px] font-bold tracking-[-1px]">{m.value}</div>
            ) : (
              <AnimatedNumber prefix={m.prefix} number={m.number!} suffix={m.suffix} />
            )}
            <div className="text-[13px] text-zinc-400 font-medium mt-0.5">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
