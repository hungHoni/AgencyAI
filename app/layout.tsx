import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgencyAI — AI Chatbots for Local Businesses",
  description:
    "Custom AI chatbots that answer customer questions, capture leads, book appointments, and handle support 24/7. Built for dentists, salons, restaurants, and local businesses.",
  openGraph: {
    title: "AgencyAI — AI Chatbots for Local Businesses",
    description:
      "Custom AI chatbots that answer customer questions, capture leads, book appointments, and handle support 24/7.",
    type: "website",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
