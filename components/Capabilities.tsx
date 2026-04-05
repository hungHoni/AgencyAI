const capabilities = [
  {
    title: "Answer questions",
    description:
      "Services, pricing, hours, policies, directions. Anything a customer would normally call about.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    title: "Book appointments",
    description:
      "Checks availability, books slots, sends confirmations. Syncs directly with your calendar.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "Capture leads",
    description:
      "Collects name, email, phone from interested visitors. Sends them to you the moment they come in.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "Handle support",
    description:
      "Returns, complaints, status checks. Resolves simple issues on the spot, escalates when needed.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16">
      <div className="text-xs font-semibold text-emerald-600 tracking-[1.2px] uppercase mb-3">
        Capabilities
      </div>
      <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 max-w-[520px]">
        Everything your customers need, instantly.
      </h2>
      <p className="text-base text-zinc-600 max-w-[480px] leading-[1.7] mb-14">
        Your chatbot is trained on your business. It knows your services, prices,
        hours, and policies. No scripts, no decision trees.
      </p>

      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {capabilities.map((cap) => (
          <div
            key={cap.title}
            className="grid grid-cols-[52px_1fr] gap-4 p-7 rounded-card border border-transparent items-start transition-all duration-400 ease-smooth hover:bg-white hover:border-black/[0.06] hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="w-[52px] h-[52px] bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] rounded-btn flex items-center justify-center">
              {cap.icon}
            </div>
            <div>
              <h4 className="text-base font-bold tracking-[-0.3px] mb-1">
                {cap.title}
              </h4>
              <p className="text-sm text-zinc-600 leading-[1.6]">
                {cap.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
