"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="max-w-site mx-auto px-12 border-t border-black/[0.06] max-sm:px-5">
      <div className="flex items-center justify-between py-10 max-sm:flex-col max-sm:gap-6 max-sm:py-8">
        <div>
          <div className="text-base font-bold tracking-tight text-zinc-900 mb-1">
            agency<span className="text-blue-400">AI</span>
          </div>
          <p className="text-[13px] text-zinc-400">{t("footer.tagline")}</p>
        </div>
        <div className="flex gap-6 max-sm:flex-wrap max-sm:justify-center">
          <Link href="#services" className="text-[13px] text-zinc-400 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth">{t("footer.services")}</Link>
          <Link href="#how-it-works" className="text-[13px] text-zinc-400 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth">{t("footer.process")}</Link>
          <Link href="#contact" className="text-[13px] text-zinc-400 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth">{t("footer.contact")}</Link>
        </div>
      </div>
      <div className="flex items-center justify-between py-5 border-t border-black/[0.04] text-[12px] text-zinc-400 max-sm:flex-col max-sm:gap-3">
        <span>&copy; {new Date().getFullYear()} {t("footer.copyright")}</span>
        <div className="flex gap-5">
          <Link href="#" className="hover:text-zinc-600 transition-all duration-400 ease-smooth">{t("footer.privacyPolicy")}</Link>
          <Link href="#" className="hover:text-zinc-600 transition-all duration-400 ease-smooth">{t("footer.termsOfService")}</Link>
        </div>
      </div>
    </footer>
  );
}
