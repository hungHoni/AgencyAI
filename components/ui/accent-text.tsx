import { Fragment } from "react";

/**
 * Renders text with `*accent*` markers as italic editorial-serif emphasis.
 * Example: "An AI employee that *never sleeps.*"
 */
export function AccentText({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em
            key={i}
            className="font-[family-name:var(--font-serif)] italic font-normal tracking-[-0.5px]"
          >
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
