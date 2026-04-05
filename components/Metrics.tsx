const metrics = [
  { value: "24/7", label: "Always available" },
  { value: "~80%", label: "Questions handled instantly" },
  { value: "Zero", label: "Missed customer inquiries" },
  { value: "No code", label: "Required to get started" },
];

export default function Metrics() {
  return (
    <div className="flex justify-start gap-16 px-12 py-14 max-w-site mx-auto border-t border-black/[0.06] max-sm:px-5 max-sm:py-10 max-sm:gap-8 max-sm:flex-wrap">
      {metrics.map((m) => (
        <div key={m.value} className="text-left">
          <div className="text-[32px] font-bold tracking-[-1px]">{m.value}</div>
          <div className="text-[13px] text-zinc-400 font-medium mt-0.5">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
