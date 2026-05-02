import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme/context";
import { BackgroundGlow } from "@/components/ui/background-glow";
import "./globals.css";

const mainFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-main",
  display: "swap",
});

const serifFont = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agencyai.com"),
  title: "AgencyAI — AI Agents for Local Businesses",
  description:
    "Custom AI agents that answer customer questions, capture leads, book appointments, and handle support 24/7. Built for dentists, salons, restaurants, and local businesses.",
  openGraph: {
    title: "AgencyAI — AI Agents for Local Businesses",
    description:
      "Custom AI agents that answer customer questions, capture leads, book appointments, and handle support 24/7.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgencyAI — AI Agents for Local Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgencyAI — AI Agents for Local Businesses",
    description:
      "Custom AI agents that answer customer questions, capture leads, book appointments, and handle support 24/7.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mainFont.variable} ${serifFont.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=document.cookie.match(/(?:^|; )theme=([^;]*)/);var v=t&&t[1];if(v==='dark'||((!v)&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-main)] antialiased bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
        <ThemeProvider>
          <LocaleProvider>
            <BackgroundGlow />
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-zinc-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-btn focus:text-sm focus:font-semibold">
              Skip to content
            </a>
            {children}
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
