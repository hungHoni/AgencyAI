const metrics = [
  { value: "24/7", label: "Always available" },
  { value: "~80%", label: "Questions handled instantly" },
  { value: "Zero", label: "Missed customer inquiries" },
  { value: "No code", label: "Required to get started" },
];

export default function Metrics() {
  return (
    <div className="px-12 py-14 max-w-site mx-auto border-t border-black/[0.06] max-sm:px-5 max-sm:py-10">
      <div className="flex justify-start max-sm:flex-wrap">
        {metrics.map((m, i) => (
          <div
            key={m.value}
            className={`text-left flex-1 ${
              i > 0 ? "pl-10 border-l border-black/[0.06] max-sm:border-l-0 max-sm:pl-0" : ""
            } max-sm:w-1/2 max-sm:py-4`}
          >
            <div className="text-[32px] font-bold tracking-[-1px]">{m.value}</div>
            <div className="text-[13px] text-zinc-400 font-medium mt-0.5">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
