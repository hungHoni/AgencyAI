"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";

const NAV_KEYS = [
  { href: "#capabilities", key: "nav.capabilities" },
  { href: "#services", key: "nav.services" },
  { href: "#how-it-works", key: "nav.process" },
  { href: "#contact", key: "nav.contact" },
];

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 flex items-center justify-center rounded-btn hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-400 ease-smooth ${className}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-zinc-400 fill-none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-zinc-500 fill-none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, t } = useTranslation();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const sections = NAV_KEYS.map((l) => l.href.slice(1));
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function LanguageToggle({ className = "" }: { className?: string }) {
    return (
      <div className={`flex items-center gap-1 text-xs font-medium ${className}`}>
        <button
          onClick={() => setLocale("en")}
          className={`px-1.5 py-0.5 rounded transition-all duration-400 ease-smooth ${locale === "en" ? "text-zinc-900 dark:text-zinc-100 font-semibold" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
        >
          EN
        </button>
        <span className="text-zinc-300 dark:text-zinc-600">|</span>
        <button
          onClick={() => setLocale("vi")}
          className={`px-1.5 py-0.5 rounded transition-all duration-400 ease-smooth ${locale === "vi" ? "text-zinc-900 dark:text-zinc-100 font-semibold" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
        >
          VI
        </button>
      </div>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 bg-[var(--bg)]/85 backdrop-blur-[16px] backdrop-saturate-[1.8] border-b border-[var(--border)] max-sm:py-3.5 max-sm:px-5">
        <div className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          agency<span className="text-blue-400">AI</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex gap-8">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-400 ease-smooth ${activeSection === link.href.slice(1)
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
            >
              {t(link.key)}
              {activeSection === link.href.slice(1) && (
                <span className="block h-[2px] bg-blue-400 rounded-full mt-0.5 animate-[fade-in_0.2s_ease-smooth]" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden lg:flex" />
          <ThemeToggle className="hidden sm:flex" />
          <Link
            href="#contact"
            className="bg-[var(--text-primary)] text-[var(--bg)] px-[22px] py-2.5 rounded-btn text-sm font-semibold tracking-tight hover:opacity-85 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth max-sm:hidden"
          >
            {t("nav.bookCall")}
          </Link>

          {/* Hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-btn hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-400 ease-smooth relative z-[70]"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className={`block h-[1.5px] bg-[var(--text-primary)] rounded-full transition-all duration-300 ease-smooth ${mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""
                  }`}
              />
              <span
                className={`block h-[1.5px] bg-[var(--text-primary)] rounded-full transition-all duration-300 ease-smooth ${mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu — portaled to body to escape stacking context */}
      {mobileOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[60] lg:hidden animate-[fade-in_0.15s_ease-smooth]">
          {/* Full opaque background */}
          <div className="absolute inset-0 bg-[var(--bg)]" />

          {/* Nav bar replica at top */}
          <div className="relative z-10 flex items-center justify-between px-12 py-4 border-b border-[var(--border)] max-sm:py-3.5 max-sm:px-5">
            <div className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              agency<span className="text-blue-400">AI</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-btn hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-400 ease-smooth"
              aria-label={t("nav.closeMenu")}
            >
              <div className="w-5 flex flex-col gap-[5px]">
                <span className="block h-[1.5px] bg-[var(--text-primary)] rounded-full rotate-45 translate-y-[3.25px] transition-all duration-300 ease-smooth" />
                <span className="block h-[1.5px] bg-[var(--text-primary)] rounded-full -rotate-45 -translate-y-[3.25px] transition-all duration-300 ease-smooth" />
              </div>
            </button>
          </div>

          {/* Menu content */}
          <div className="relative z-10 flex flex-col gap-1 px-6 py-8">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[17px] font-medium py-3.5 px-4 rounded-btn transition-all duration-400 ease-smooth ${activeSection === link.href.slice(1)
                    ? "text-[var(--text-primary)] bg-[var(--border)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
                  }`}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="mt-4 px-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <Link
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block bg-[var(--text-primary)] text-[var(--bg)] px-7 py-3.5 rounded-btn text-[15px] font-semibold tracking-[-0.2px] text-center hover:opacity-85 transition-all duration-400 ease-smooth"
              >
                {t("nav.bookCall")}
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
