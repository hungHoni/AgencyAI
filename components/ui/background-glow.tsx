"use client";

import { cn } from "@/lib/utils";

export function BackgroundGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 dark:hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Soft Yellow Glow — center */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #FFF991 0%, transparent 70%)",
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />

      {/* Purple Glow — top right */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, rgba(173, 109, 244, 0.5), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
