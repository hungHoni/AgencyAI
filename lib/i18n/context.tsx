"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale } from "./types";
import { DEFAULT_LOCALE } from "./types";
import en from "./translations/en.json";
import vi from "./translations/vi.json";

const translations: Record<Locale, typeof en> = { en, vi };

function getCookieLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  const val = match?.[1];
  if (val === "en") return "en";
  return "vi";
}

function setCookieLocale(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current == null) return path;
    current = current[key];
  }
  return typeof current === "string" ? current : path;
}

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(getCookieLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setCookieLocale(l);
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string) => getNestedValue(translations[locale], key),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LocaleContext);
}

// Helper to get raw translation data (for arrays/objects like metrics, chatDemo)
export function useTranslationData() {
  const { locale } = useContext(LocaleContext);
  return translations[locale];
}
