import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Send,
  ChevronDown,
  ChevronUp,
  Columns,
  MessageSquare,
  Copy,
  Wand2,
} from "lucide-react";
import { ScriptImprovement } from "./reelRefineData";

interface DiffModalProps {
  isOpen: boolean;
  improvement: ScriptImprovement | null;
  onClose: () => void;
  onApply: (id: string) => void;
  onRevert: (id: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestedSnippet?: string;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  improvement,
  onClose,
  onApply,
  onRevert,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDiffBanner, setShowDiffBanner] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session when modal opens for an improvement
  useEffect(() => {
    if (isOpen && improvement) {
      const initialMsgs: ChatMessage[] = [
        {
          id: "msg-1",
          sender: "ai",
          text: `Welcome! I'm your AI Screenplay Assistant for **${improvement.title}** (${improvement.sceneLocation}, ${improvement.pageRange}).\n\n**Rationale:** ${improvement.rationale}\n\nHow would you like to refine this scene? You can ask me to adjust tone, rewrite dialogue, generate alternate versions, or analyze character subtext.`,
          timestamp: "Just now",
        },
      ];
      setMessages(initialMsgs);
      setInputQuery("");
      setShowDiffBanner(true);
    }
  }, [isOpen, improvement?.id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !improvement) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    // Generate intelligent AI response based on query
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let aiText = "";
      let customSnippet: string | undefined = undefined;

      if (qLower.includes("punchy") || qLower.includes("short") || qLower.includes("tighten")) {
        customSnippet = improvement.suggestedSnippet
          .split("\n")
          .map((line) => (line.length > 50 ? line.slice(0, 48) + "..." : line))
          .join("\n");

        aiText = `Here is a **tightened, ultra-punchy version** for ${improvement.sceneLocation}:\n\nStripped out non-essential filler words to maximize dramatic tension and clock urgency.`;
      } else if (qLower.includes("alternate") || qLower.includes("options") || qLower.includes("version")) {
        aiText = `Here are **3 distinct narrative options** for this beat:\n\n1. **High Tension:** Escalates immediate physical danger.\n2. **Emotional & Personal:** Focuses on hidden character vulnerability.\n3. **Subtle Subtext:** Relies on visual action rather than explicit spoken words.\n\nWhich direction fits your vision best?`;
      } else if (qLower.includes("subtext") || qLower.includes("character") || qLower.includes("motivation")) {
        aiText = `**Character Subtext Breakdown:**\n\nIn this scene, the dialogue operates on two layers:\n- **Surface level:** Debate over safety protocol and operational risk.\n- **Internal subtext:** The protagonist is driven by guilt over a past mission failure, while the antagonist fears repeating tragic losses.\n\n*Tip:* Pause after line 2 to allow physical reaction before speaking.`;
      } else if (qLower.includes("pacing") || qLower.includes("act")) {
        aiText = `**Pacing Analysis for ${improvement.pageRange}:**\n\nThis edit sharpens Act escalation by introducing a strict time clock. It moves the inciting incident forward by ~4 pages, preventing Act II drift.`;
      } else {
        aiText = `I've analyzed your request regarding "${query}".\n\nFor ${improvement.sceneLocation}, keeping the dialogue grounded in personal stakes elevates emotional engagement. Would you like me to rewrite this beat with more sarcasm, high drama, or quiet intensity?`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedSnippet: customSnippet,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const quickPrompts = [
    "Make dialogue punchier & shorter",
    "Give me 3 alternate versions",
    "Add subtle character subtext",
    "How does this affect pacing?",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diff-modal-title"
    >
      <div className="bg-card rounded-2xl border border-border max-w-4xl w-full overflow-hidden flex flex-col h-[90vh] shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#001b94] border border-white/20 flex items-center justify-center text-amber-400 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="diff-modal-title" className="text-base font-display font-semibold text-white">
                  AI Screenplay Copilot & Assistant
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FF6F00]/20 text-amber-300 border border-[#FF6F00]/30">
                  {improvement.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {improvement.sceneLocation} • <span className="text-[#FF6F00] font-semibold">{improvement.pageRange}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDiffBanner(!showDiffBanner)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                showDiffBanner
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-transparent text-slate-400 hover:text-white border-slate-700"
              }`}
              title="Toggle Side-by-Side Snippet Banner"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showDiffBanner ? "Hide Snippet" : "View Snippet"}</span>
              {showDiffBanner ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close assistant modal"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Original vs Rewrite Snippet Comparison Banner */}
        {showDiffBanner && (
          <div className="px-5 py-4 bg-slate-950/80 border-b border-border/80 text-xs font-mono flex-shrink-0 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-rose-400 font-sans uppercase">
                  <span>Current Draft Snippet</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-800 text-rose-300">- Before</span>
                </div>
                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-900/50 text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto">
                  {improvement.originalSnippet}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-400 font-sans uppercase">
                  <span>Suggested Rewrite</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">+ Polished</span>
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-emerald-200 text-[11px] font-semibold leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto">
                  {improvement.suggestedSnippet}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Chat Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-background">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#0F294D]"
                    : "bg-gradient-to-br from-[#001b94] to-[#1E3A8A]"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-1 max-w-[85%]">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono px-1">
                  <span>{msg.sender === "user" ? "Writer" : "Screenplay AI"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#001b94] text-white rounded-tr-xs"
                      : "bg-slate-100 dark:bg-slate-800/80 text-foreground border border-border rounded-tl-xs space-y-2"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Inline Suggested Snippet Box if AI generated custom snippet */}
                  {msg.suggestedSnippet && (
                    <div className="mt-3 p-3 bg-card border border-emerald-500/40 rounded-xl space-y-2">
                      <div className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF6F00]" /> Generated Dialogue Variation
                      </div>
                      <pre className="font-mono text-[11px] whitespace-pre-wrap text-foreground bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-border">
                        {msg.suggestedSnippet}
                      </pre>
                      <button
                        type="button"
                        onClick={() => {
                          onApply(improvement.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" /> Apply Variation to Script
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 mr-auto text-xs text-muted-foreground">
              <div className="w-8 h-8 rounded-xl bg-[#001b94] flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs flex items-center gap-2 border border-border">
                <Sparkles className="w-4 h-4 text-[#FF6F00] animate-spin-slow" />
                <span className="font-medium text-xs text-[#001b94]">AI is analyzing scene beats...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-[#FF6F00]" /> Quick Prompts:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 bg-card hover:bg-[#001b94]/10 hover:text-[#001b94] hover:border-[#001b94]/40 border border-border text-foreground rounded-full text-[11px] font-medium whitespace-nowrap transition-all shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar & Actions */}
        <div className="p-4 bg-card border-t border-border flex-shrink-0 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask AI questions about ${improvement.sceneLocation} or request specific dialogue rewrites...`}
              className="flex-1 px-4 py-2.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001b94] font-medium placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isTyping}
              className="px-4 py-2.5 bg-[#001b94] hover:bg-[#001470] disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-border">Esc</kbd> to exit assistant
            </span>

            <div className="flex items-center gap-2">
              {improvement.applied ? (
                <button
                  type="button"
                  onClick={() => {
                    onRevert(improvement.id);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Revert Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onApply(improvement.id);
                    onClose();
                  }}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Apply Rewrite to Screenplay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
