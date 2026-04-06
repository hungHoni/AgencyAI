"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-[120px] font-extrabold tracking-[-4px] leading-none text-zinc-200 mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-[-0.5px] mb-2">
        {t("notFound.heading")}
      </h1>
      <p className="text-base text-zinc-600 mb-8 max-w-[360px]">
        {t("notFound.description")}
      </p>
      <Link
        href="/"
        className="bg-zinc-900 text-[#fafaf9] px-7 py-3.5 rounded-btn text-[15px] font-semibold tracking-[-0.2px] hover:bg-zinc-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth"
      >
        {t("notFound.backHome")}
      </Link>
    </main>
  );
}
