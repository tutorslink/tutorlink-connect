import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  GripHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Help me find a mathematics tutor.",
  "How does Tutors Link work?",
  "How do I apply as a tutor?",
  "What academic levels are available?",
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load persistent conversation history from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("tl_chatbot_history");
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Welcome message
        setMessages([
          {
            role: "assistant",
            content:
              "Hello! Welcome to Tutors Link. I am your academic virtual assistant. How can I help you find the perfect tutor or guide you through our services today?",
          },
        ]);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Save history on changes
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("tl_chatbot_history", JSON.stringify(messages));
    }
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: Message = { role: "user", content: text };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs,
          currentUrl: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with our assistant backend.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    sessionStorage.removeItem("tl_chatbot_history");
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! Welcome to Tutors Link. I am your academic virtual assistant. How can I help you find the perfect tutor or guide you through our services today?",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expandable Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.92 }}
          className="mb-4 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-10rem)] shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-border/80 bg-background"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between cursor-move">
            <div className="flex items-center gap-2">
              <div className="bg-white/15 p-2 rounded-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold tracking-tight text-white m-0">
                  Tutors Link AI
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-white/85 font-medium">
                    Always online & verified
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10 rounded-full text-xs"
                onClick={handleClearHistory}
                title="Reset conversation"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/10"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-foreground border border-border/40 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-bounce" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-border/40 max-w-[78%] px-4 py-3 rounded-2xl rounded-tl-none text-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Connection Issue</p>
                  <p className="mt-0.5 opacity-90">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions (if no current conversation context or as helpful quick actions) */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-border/50 bg-slate-50/70 dark:bg-slate-900/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" /> Suggested Prompts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="text-xs bg-white dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700/50 border border-border/60 hover:border-blue-200 text-muted-foreground px-2.5 py-1.5 rounded-full text-left transition-all duration-150"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t bg-background flex gap-2 items-center"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 bg-slate-50 border-border/80 focus-visible:ring-blue-500 rounded-xl"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 h-9 w-9 rounded-xl shrink-0"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
        </motion.div>
      )}

      {/* Floating Action Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
