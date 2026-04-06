import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/lib/i18n/context";
import MountainScene from "@/components/MountainScene";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agencyai.com"),
  title: "AgencyAI — AI Chatbots for Local Businesses",
  description:
    "Custom AI chatbots that answer customer questions, capture leads, book appointments, and handle support 24/7. Built for dentists, salons, restaurants, and local businesses.",
  openGraph: {
    title: "AgencyAI — AI Chatbots for Local Businesses",
    description:
      "Custom AI chatbots that answer customer questions, capture leads, book appointments, and handle support 24/7.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgencyAI — AI Chatbots for Local Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgencyAI — AI Chatbots for Local Businesses",
    description:
      "Custom AI chatbots that answer customer questions, capture leads, book appointments, and handle support 24/7.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-[family-name:var(--font-outfit)] antialiased">
        <LocaleProvider>
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
            <MountainScene />
          </div>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-zinc-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-btn focus:text-sm focus:font-semibold">
            Skip to content
          </a>
          {children}
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
