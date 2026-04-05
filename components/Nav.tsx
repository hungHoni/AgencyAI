import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 bg-[#fafaf9]/85 backdrop-blur-[16px] backdrop-saturate-[1.8] border-b border-black/[0.06] max-sm:py-3.5 max-sm:px-5">
      <div className="text-xl font-bold tracking-tight text-zinc-900">
        agency<span className="text-emerald-500">AI</span>
      </div>

      {/* Desktop nav links — hidden below 1024px */}
      <div className="hidden lg:flex gap-8">
        <Link
          href="#capabilities"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-all duration-400 ease-smooth"
        >
          Capabilities
        </Link>
        <Link
          href="#services"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-all duration-400 ease-smooth"
        >
          Services
        </Link>
        <Link
          href="#how-it-works"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-all duration-400 ease-smooth"
        >
          Process
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-all duration-400 ease-smooth"
        >
          Contact
        </Link>
      </div>

      <Link
        href="#contact"
        className="bg-zinc-900 text-[#fafaf9] px-[22px] py-2.5 rounded-btn text-sm font-semibold tracking-tight hover:bg-zinc-700 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth"
      >
        Book a Free Call
      </Link>
    </nav>
  );
}
