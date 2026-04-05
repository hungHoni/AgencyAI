export default function ChatPreview() {
  return (
    <div className="bg-zinc-900 rounded-[calc(var(--radius)+4px)] p-6 shadow-elevated text-zinc-300 relative">
      {/* Inner border refraction overlay */}
      <div className="absolute top-3 left-3 right-3 bottom-3 border border-white/[0.04] rounded-card pointer-events-none" />

      {/* Chat header */}
      <div className="flex items-center gap-3 pb-[18px] mb-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 bg-emerald-500 rounded-btn flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] stroke-white fill-none"
            strokeWidth={2}
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-zinc-100 tracking-[-0.2px]">
            Rosewood Hair Studio
          </div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-[5px] mt-px">
            <span className="w-[5px] h-[5px] bg-emerald-500 rounded-full animate-[breathe_2.4s_ease-in-out_infinite]" />
            Online now
          </div>
        </div>
      </div>

      {/* Chat bubbles */}
      <div className="flex flex-col gap-3">
        <div className="bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] text-[13px] text-zinc-400 leading-[1.65] max-w-[85%]">
          Hi there! Welcome to Rosewood. I can answer questions about our
          services, help you book an appointment, or check pricing. How can I
          help?
        </div>
        <div className="bg-emerald-500 px-4 py-[13px] rounded-[14px_14px_4px_14px] text-[13px] text-white leading-[1.65] max-w-[85%] ml-auto">
          Do you do balayage? How much is it?
        </div>
        <div className="bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] text-[13px] text-zinc-400 leading-[1.65] max-w-[85%]">
          Absolutely. Balayage starts at $165 for medium-length hair, including
          consultation, color, and blowout. Our colorist Priya specializes in
          balayage and has openings this week. Want to book, or any other
          questions?
        </div>
        <div className="bg-emerald-500 px-4 py-[13px] rounded-[14px_14px_4px_14px] text-[13px] text-white leading-[1.65] max-w-[85%] ml-auto">
          What&apos;s the difference between balayage and highlights?
        </div>
        <div className="bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] text-[13px] text-zinc-400 leading-[1.65] max-w-[85%]">
          Balayage is hand-painted for a natural, sun-kissed gradient. Highlights
          use foils for more defined streaks. Balayage grows out more naturally,
          so fewer touch-ups. Most clients prefer it for low-maintenance color.
        </div>
      </div>

      {/* Chat compose bar */}
      <div className="flex gap-2 mt-5">
        <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-btn py-3 px-3.5 text-[13px] text-zinc-500">
          Ask anything about our services...
        </div>
        <button className="bg-emerald-500 border-none rounded-btn px-3.5 py-3 flex items-center hover:bg-emerald-600 transition-all duration-400 ease-smooth">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 stroke-white fill-none"
            strokeWidth={2}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
