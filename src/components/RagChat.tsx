"use client";

import { useState, useRef, useEffect } from "react";
import {
  queryRAG,
  getCompanies,
  formatSection,
  filingYear,
  type QueryResponse,
  type Company,
} from "@/lib/rag-api";

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: QueryResponse["citations"];
  latency_ms?: number;
  error?: boolean;
};

export default function RagChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [ticker, setTicker] = useState("");
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getCompanies()
      .then((data) => setCompanies(data.companies))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setLoading(true);

    try {
      const result = await queryRAG(query, { ticker: ticker || undefined });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          citations: result.citations,
          latency_ms: result.latency_ms,
        },
      ]);
    } catch (err) {
      const isRateLimit = err instanceof Error && err.message === "rate_limited";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isRateLimit
            ? "Rate limited — please wait a moment and try again (10 requests/min)."
            : "The API is currently unavailable. Make sure it's running locally or the production URL is configured.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  function toggleCitations(index: number) {
    setExpandedCitations((prev) => {
      const next = new Set(prev);
      if (next.has(index)) { next.delete(index); } else { next.add(index); }
      return next;
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
      {/* company filter */}
      <div className="flex items-center gap-2 pb-3 border-b border-base-300">
        <span className="text-xs text-base-content/50 whitespace-nowrap">Filter by company</span>
        <select
          className="select select-bordered select-sm flex-1 max-w-xs text-sm"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c.ticker} value={c.ticker}>
              {c.ticker} — {c.company_name}
            </option>
          ))}
        </select>
        {ticker && (
          <button
            className="btn btn-ghost btn-xs text-base-content/50"
            onClick={() => setTicker("")}
          >
            clear
          </button>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2">
            <p className="text-base-content/40 text-sm">
              Ask anything about S&amp;P 500 companies&apos; 10-K filings.
            </p>
            <p className="text-base-content/30 text-xs">
              Covers Risk Factors (Item 1A) and MD&amp;A (Item 7) for 100 companies.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-primary text-sm">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="chat chat-start">
                <div
                  className={`chat-bubble text-sm ${
                    msg.error ? "chat-bubble-error opacity-80" : ""
                  }`}
                >
                  {msg.content}

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-base-content/10">
                      <button
                        className="text-xs text-base-content/50 hover:text-base-content/80 transition-colors flex items-center gap-1"
                        onClick={() => toggleCitations(i)}
                      >
                        <span>
                          {expandedCitations.has(i) ? "▾" : "▸"}{" "}
                          {msg.citations.length} citation
                          {msg.citations.length !== 1 ? "s" : ""}
                        </span>
                      </button>

                      {expandedCitations.has(i) && (
                        <ul className="mt-2 space-y-2">
                          {msg.citations.map((c, ci) => (
                            <li
                              key={ci}
                              className="text-xs bg-base-200/50 rounded p-2 space-y-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="badge badge-xs badge-ghost font-mono">
                                  {c.ticker}
                                </span>
                                <span className="text-base-content/60">
                                  {c.company_name}
                                </span>
                                <span className="text-base-content/40 ml-auto">
                                  {formatSection(c.section)} · {filingYear(c.filing_date)}
                                </span>
                              </div>
                              <p className="text-base-content/60 italic leading-relaxed">
                                &ldquo;{c.cited_text}&rdquo;
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {msg.latency_ms && (
                  <div className="chat-footer text-xs text-base-content/30 mt-0.5">
                    answered in {(msg.latency_ms / 1000).toFixed(1)}s
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble text-sm">
              <span className="loading loading-dots loading-sm" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-base-300">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            className="textarea textarea-bordered flex-1 resize-none text-sm leading-relaxed min-h-[44px] max-h-[160px]"
            placeholder="Ask about risks, financials, or strategy across S&P 500 10-Ks…"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm h-[44px]"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Send"
            )}
          </button>
        </div>
        <p className="text-xs text-base-content/30 mt-1.5">
          Enter to send · Shift+Enter for newline · 10 req/min
        </p>
      </form>
    </div>
  );
}
