import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-site mx-auto px-12 py-10 border-t border-black/[0.06] flex items-center justify-between max-sm:flex-col max-sm:gap-4 max-sm:px-5 max-sm:py-8">
      <div className="text-[13px] text-zinc-400 font-medium">agencyAI</div>
      <div className="flex gap-6">
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
    </footer>
  );
}
