"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 bg-[#fafaf9]/85 backdrop-blur-[16px] backdrop-saturate-[1.8] border-b border-black/[0.06] max-sm:py-3.5 max-sm:px-5">
      <div className="text-xl font-bold tracking-tight text-zinc-900">
        agency<span className="text-emerald-500">AI</span>
      </div>

      {/* Desktop nav links */}
      <div className="hidden lg:flex gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-all duration-400 ease-smooth ${
              activeSection === link.href.slice(1)
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            {link.label}
            {activeSection === link.href.slice(1) && (
              <span className="block h-[2px] bg-emerald-500 rounded-full mt-0.5 animate-[fade-in_0.2s_ease-smooth]" />
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="#contact"
          className="bg-zinc-900 text-[#fafaf9] px-[22px] py-2.5 rounded-btn text-sm font-semibold tracking-tight hover:bg-zinc-700 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth max-sm:hidden"
        >
          Book a Free Call
        </Link>

        {/* Hamburger button — visible below lg */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-btn hover:bg-black/[0.04] transition-all duration-400 ease-smooth"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span
              className={`block h-[1.5px] bg-zinc-900 rounded-full transition-all duration-300 ease-smooth ${
                mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] bg-zinc-900 rounded-full transition-all duration-300 ease-smooth ${
                mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[57px] bg-[#fafaf9]/98 backdrop-blur-[20px] z-40 lg:hidden animate-[fade-in_0.2s_ease-smooth]"
        >
          <div className="flex flex-col gap-1 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[17px] font-medium py-3.5 px-4 rounded-btn transition-all duration-400 ease-smooth ${
                  activeSection === link.href.slice(1)
                    ? "text-zinc-900 bg-black/[0.04]"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.02]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 px-4">
              <Link
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block bg-zinc-900 text-[#fafaf9] px-7 py-3.5 rounded-btn text-[15px] font-semibold tracking-[-0.2px] text-center hover:bg-zinc-700 transition-all duration-400 ease-smooth"
              >
                Book a Free Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
