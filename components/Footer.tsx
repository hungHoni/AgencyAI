"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="max-w-site mx-auto px-12 max-sm:px-5 border-t border-black/[0.04] py-8">
      <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-6">
        
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-5 max-sm:flex-col max-sm:gap-2 max-sm:text-center">
          <div className="text-[17px] font-bold tracking-tight text-zinc-900 leading-none">
            agency<span className="text-blue-500">AI</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-zinc-200 rounded-full" />
          <p className="text-[13px] text-zinc-400">&copy; {new Date().getFullYear()} {t("footer.copyright")}</p>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-6 max-sm:flex-col max-sm:gap-4">
          <div className="flex gap-6">
            <Link href="#services" className="text-[13px] text-zinc-500 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth">{t("footer.services")}</Link>
            <Link href="#how-it-works" className="text-[13px] text-zinc-500 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth">{t("footer.process")}</Link>
            <Link href="#contact" className="text-[13px] text-zinc-500 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth">{t("footer.contact")}</Link>
          </div>
          
          <div className="hidden sm:block w-px h-3.5 bg-black/[0.06]" />
          
          <div className="flex gap-5">
            <Link href="#" className="text-[13px] text-zinc-400 hover:text-zinc-600 transition-all duration-400 ease-smooth">{t("footer.privacyPolicy")}</Link>
            <Link href="#" className="text-[13px] text-zinc-400 hover:text-zinc-600 transition-all duration-400 ease-smooth">{t("footer.termsOfService")}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
