import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-site mx-auto px-12 border-t border-black/[0.06] max-sm:px-5">
      <div className="flex items-center justify-between py-10 max-sm:flex-col max-sm:gap-6 max-sm:py-8">
        <div>
          <div className="text-base font-bold tracking-tight text-zinc-900 mb-1">
            agency<span className="text-emerald-500">AI</span>
          </div>
          <p className="text-[13px] text-zinc-400">
            AI chatbots for local businesses.
          </p>
        </div>

        <div className="flex gap-6 max-sm:flex-wrap max-sm:justify-center">
          <Link
            href="#services"
            className="text-[13px] text-zinc-400 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth"
          >
            Services
          </Link>
          <Link
            href="#how-it-works"
            className="text-[13px] text-zinc-400 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth"
          >
            Process
          </Link>
          <Link
            href="#contact"
            className="text-[13px] text-zinc-400 font-medium hover:text-zinc-900 transition-all duration-400 ease-smooth"
          >
            Contact
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 border-t border-black/[0.04] text-[12px] text-zinc-400 max-sm:flex-col max-sm:gap-3">
        <span>&copy; {new Date().getFullYear()} AgencyAI. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="#" className="hover:text-zinc-600 transition-all duration-400 ease-smooth">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-zinc-600 transition-all duration-400 ease-smooth">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
