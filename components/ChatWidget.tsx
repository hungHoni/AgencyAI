"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type ReactNode,
} from "react";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi! I'm the AgencyAI assistant. Ask me anything about our AI chatbot services, pricing, or process. How can I help?",
};

function TypingIndicator() {
  return (
    <div className="bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] max-w-[85%] shrink-0 animate-chat-bubble">
      <div className="flex gap-1.5 items-center h-[18px]">
        <span className="typing-dot w-[6px] h-[6px] bg-zinc-500 rounded-full" />
        <span className="typing-dot w-[6px] h-[6px] bg-zinc-500 rounded-full" />
        <span className="typing-dot w-[6px] h-[6px] bg-zinc-500 rounded-full" />
      </div>
    </div>
  );
}

// ─── Extracted as a stable component outside the parent ───
function ChatShell({
  compact,
  onClose,
  children,
}: {
  compact: boolean;
  onClose?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`bg-zinc-900 text-zinc-300 relative flex flex-col ${
        compact
          ? "rounded-2xl h-[520px] w-[380px] max-sm:w-[calc(100vw-48px)] max-sm:h-[70vh] animate-chat-panel"
          : "rounded-[calc(var(--radius)+4px)] shadow-elevated h-[480px]"
      }`}
    >
      {/* Inner border refraction */}
      <div className="absolute top-3 left-3 right-3 bottom-3 border border-white/[0.04] rounded-card pointer-events-none z-0" />

      {/* Header */}
      <div
        className={`flex items-center gap-3 border-b border-white/[0.06] shrink-0 relative z-10 ${
          compact ? "px-5 py-4" : "px-6 pb-[18px] pt-6"
        }`}
      >
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
            AgencyAI
          </div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-[5px] mt-px">
            <span className="w-[5px] h-[5px] bg-emerald-500 rounded-full animate-[breathe_2.4s_ease-in-out_infinite]" />
            Online now
          </div>
        </div>
        {compact && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-white/10 transition-all duration-400 ease-smooth"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-zinc-400 fill-none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const floatingScrollRef = useRef<HTMLDivElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const floatingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll chat containers to bottom without moving the page
    if (heroScrollRef.current) {
      heroScrollRef.current.scrollTop = heroScrollRef.current.scrollHeight;
    }
    if (floatingScrollRef.current) {
      floatingScrollRef.current.scrollTop = floatingScrollRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const userMessage = input.trim();
    setInput("");
    setError(null);

    const apiHistory = messages.slice(1);
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsStreaming(true);
    setShowTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: apiHistory }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || "Our AI is taking a break. Use the contact form below."
        );
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setShowTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };
          return updated;
        });
      }

      const userCount = newMessages.filter((m) => m.role === "user").length;
      if (userCount >= 3 && !leadCaptured) {
        setShowLeadCapture(true);
      }
    } catch (err) {
      setShowTyping(false);
      setError(
        err instanceof Error
          ? err.message
          : "Our AI is taking a break. Use the contact form below."
      );
    } finally {
      setIsStreaming(false);
      setShowTyping(false);
    }
  }, [input, isStreaming, messages, leadCaptured]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function handleLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;
    setLeadStatus("sending");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          business: "Via chatbot",
          email: leadEmail,
          message: "Lead captured from chatbot conversation",
        }),
      });
    } catch {
      // Silently fail
    }
    setLeadStatus("sent");
    setLeadCaptured(true);
    setTimeout(() => setShowLeadCapture(false), 2000);
  }

  // ─── Shared messages + compose (rendered inline, NOT as a sub-component) ───
  function renderMessages(scrollRef: React.RefObject<HTMLDivElement | null>, compact: boolean) {
    return (
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto flex flex-col gap-3 relative z-10 min-h-0 ${
          compact ? "px-5 py-4" : "px-6 py-5"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={`${i}-${msg.role}`}
            className={`break-words overflow-wrap-anywhere animate-chat-bubble ${
              msg.role === "assistant"
                ? "bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] text-[13px] text-zinc-400 leading-[1.65] max-w-[85%] shrink-0"
                : "bg-emerald-500 px-4 py-[13px] rounded-[14px_14px_4px_14px] text-[13px] text-white leading-[1.65] max-w-[85%] ml-auto shrink-0"
            }`}
          >
            {msg.content || (
              <span className="inline-block w-1.5 h-4 bg-zinc-500 animate-pulse" />
            )}
          </div>
        ))}

        {showTyping && <TypingIndicator />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-[14px_14px_14px_4px] text-[13px] text-red-400 leading-[1.65] max-w-[85%] shrink-0 break-words animate-chat-bubble">
            {error}{" "}
            <a href="#contact" className="underline hover:text-red-300">
              Use the contact form
            </a>
          </div>
        )}

        {showLeadCapture && leadStatus !== "sent" && (
          <div className="bg-white/5 border border-emerald-500/20 px-4 py-4 rounded-[14px] max-w-[85%] shrink-0 animate-chat-bubble">
            <p className="text-[12px] text-zinc-400 mb-3">
              Enjoying the chat? Leave your info and we&apos;ll follow up with a
              custom demo.
            </p>
            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-btn py-2 px-3 text-[12px] text-zinc-100 outline-none focus:border-emerald-500/30 placeholder:text-zinc-600 transition-all duration-400 ease-smooth"
              />
              <input
                type="email"
                placeholder="Your email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-btn py-2 px-3 text-[12px] text-zinc-100 outline-none focus:border-emerald-500/30 placeholder:text-zinc-600 transition-all duration-400 ease-smooth"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={leadStatus === "sending"}
                  className="bg-emerald-500 text-white text-[12px] font-semibold px-4 py-2 rounded-btn hover:bg-emerald-600 transition-all duration-400 ease-smooth disabled:opacity-60"
                >
                  {leadStatus === "sending" ? "Sending..." : "Send"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLeadCapture(false);
                    setLeadCaptured(true);
                  }}
                  className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-all duration-400 ease-smooth"
                >
                  No thanks
                </button>
              </div>
            </form>
          </div>
        )}
        {showLeadCapture && leadStatus === "sent" && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-[14px] text-[12px] text-emerald-400 max-w-[85%] shrink-0 animate-chat-bubble">
            Thanks! We&apos;ll be in touch soon.
          </div>
        )}

      </div>
    );
  }

  function renderCompose(inputRef: React.RefObject<HTMLInputElement | null>, compact: boolean) {
    return (
      <div
        className={`flex gap-2 border-t border-white/[0.06] shrink-0 relative z-10 ${
          compact ? "px-5 py-4" : "px-6 py-5"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about our services..."
          disabled={isStreaming}
          className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-btn py-3 px-3.5 text-[13px] text-zinc-100 outline-none transition-all duration-400 ease-smooth focus:border-emerald-500/30 placeholder:text-zinc-600 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={isStreaming || !input.trim()}
          className="bg-emerald-500 border-none rounded-btn px-3.5 py-3 flex items-center justify-center shrink-0 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-400 ease-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
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
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <>
      {/* Hero mode — inline in hero section */}
      <ChatShell compact={false}>
        {renderMessages(heroScrollRef, false)}
        {renderCompose(heroInputRef, false)}
      </ChatShell>

      {/* Floating bubble + panel */}
      <div className="fixed bottom-6 right-6 z-50 max-sm:bottom-4 max-sm:right-4">
        {floatingOpen ? (
          <div className="shadow-elevated">
            <ChatShell compact onClose={() => setFloatingOpen(false)}>
              {renderMessages(floatingScrollRef, true)}
              {renderCompose(floatingInputRef, true)}
            </ChatShell>
          </div>
        ) : (
          <button
            onClick={() => setFloatingOpen(true)}
            className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-elevated hover:bg-emerald-600 hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-400 ease-smooth animate-[bubble-in_0.5s_cubic-bezier(0.16,1,0.3,1)_1.5s_both]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-white fill-none"
              strokeWidth={2}
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
