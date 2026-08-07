import React, { useState } from "react";
import { X, Search, BookOpen, Copy, Check } from "lucide-react";
import { SAMPLE_SCRIPT_CONTENT, SAMPLE_SCRIPT_TITLE, SAMPLE_SCRIPT_AUTHOR } from "./reelRefineData";

interface ScriptReaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScriptReaderDrawer: React.FC<ScriptReaderDrawerProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptLines = SAMPLE_SCRIPT_CONTENT.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_SCRIPT_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[540px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transition-all duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-[#FF6F00]" />
          <div>
            <h3 className="font-display font-semibold text-sm">{SAMPLE_SCRIPT_TITLE}</h3>
            <p className="text-[11px] text-slate-400 font-mono">By {SAMPLE_SCRIPT_AUTHOR}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy script text"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border bg-slate-50 dark:bg-slate-900/50">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search screenplay text or scene headers..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001b94]"
          />
        </div>
      </div>

      {/* Script Reader View */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed space-y-1.5 bg-[#FAF9F6] text-slate-900 dark:bg-slate-950 dark:text-slate-200">
        {scriptLines.map((line, idx) => {
          const isHeader = line.startsWith("EXT.") || line.startsWith("INT.") || line.startsWith("TITLE:");
          const isCharacter = line.trim() === line && line.length > 0 && line === line.toUpperCase() && !isHeader;
          const isMatch = searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());

          return (
            <div
              key={idx}
              className={`flex gap-4 ${isMatch ? "bg-amber-100 dark:bg-amber-950/60 p-1 rounded" : ""}`}
            >
              <span className="w-8 text-[10px] text-slate-400 select-none text-right flex-shrink-0 font-mono">
                {idx + 1}
              </span>
              <span
                className={`${
                  isHeader
                    ? "font-semibold text-[#001b94] dark:text-sky-400 mt-2"
                    : isCharacter
                    ? "font-semibold text-emerald-800 dark:text-emerald-400 tracking-wider pl-12"
                    : "text-slate-800 dark:text-slate-300"
                }`}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-border bg-card text-[11px] text-muted-foreground flex items-center justify-between font-mono">
        <span>Standard Final Draft (.fdx) Format</span>
        <span>{scriptLines.length} Lines</span>
      </div>
    </div>
  );
};
