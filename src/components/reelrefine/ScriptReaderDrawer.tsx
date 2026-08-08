import React, { useState } from "react";
import { X, Search, BookOpen, Copy, Check, Sparkles, FileText, AlertCircle } from "lucide-react";
import {
  SAMPLE_SCRIPT_CONTENT,
  SAMPLE_SCRIPT_TITLE,
  SAMPLE_SCRIPT_AUTHOR,
  PROJECT_SCRIPTS,
  ProjectOption,
  ScriptImprovement,
} from "./reelRefineData";

interface ScriptReaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject?: ProjectOption;
  improvements?: ScriptImprovement[];
}

export const ScriptReaderDrawer: React.FC<ScriptReaderDrawerProps> = ({
  isOpen,
  onClose,
  currentProject,
  improvements = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [draftMode, setDraftMode] = useState<"raw" | "polished">("raw");

  if (!isOpen) return null;

  const scriptTitle = currentProject?.title || SAMPLE_SCRIPT_TITLE;
  const scriptAuthor = currentProject?.author || SAMPLE_SCRIPT_AUTHOR;
  const rawScriptContent =
    (currentProject && PROJECT_SCRIPTS[currentProject.id]) || SAMPLE_SCRIPT_CONTENT;

  // Filter all currently applied AI rewrites from the studio state
  const appliedImprovements = improvements.filter((imp) => imp.applied);

  // Dynamically apply all user-selected AI rewrites into the screenplay text
  let polishedScriptContent = rawScriptContent;
  appliedImprovements.forEach((imp) => {
    if (imp.originalSnippet && imp.suggestedSnippet) {
      polishedScriptContent = polishedScriptContent.replace(
        imp.originalSnippet.trim(),
        imp.suggestedSnippet.trim()
      );
    }
  });

  const activeContent = draftMode === "raw" ? rawScriptContent : polishedScriptContent;
  const scriptLines = activeContent.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const appliedSnippetsText = appliedImprovements.map((imp) => imp.suggestedSnippet).join("\n");

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[560px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transition-all duration-300 font-sans">
      {/* Drawer Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#001b94] rounded-lg border border-white/20 text-amber-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-sm">{scriptTitle}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-white/10">
                {draftMode === "raw" ? "Raw Writer Upload" : `AI Polished (${appliedImprovements.length} Applied)`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">By {scriptAuthor}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy screenplay text"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close screenplay reader"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Version Toggle Bar */}
      <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center bg-card border border-border p-1 rounded-xl w-full text-xs">
          <button
            type="button"
            onClick={() => setDraftMode("raw")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              draftMode === "raw"
                ? "bg-[#001b94] text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Raw Original Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setDraftMode("polished")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              draftMode === "polished"
                ? "bg-[#001b94] text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Polished Draft ({appliedImprovements.length})</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border bg-slate-50 dark:bg-slate-900/50">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search screenplay text or scene headers..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001b94] font-medium"
          />
        </div>
      </div>

      {/* Script Reader View */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed space-y-1.5 bg-[#FAF9F6] text-slate-900 dark:bg-slate-950 dark:text-slate-200">
        {draftMode === "polished" && appliedImprovements.length === 0 && (
          <div className="p-4 mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-sans flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">No AI rewrites applied yet.</span> Go to the <strong>AI Rewrites & Diff</strong> tab and click "Apply" on any suggestion to see instant changes reflected here!
            </div>
          </div>
        )}

        {scriptLines.map((line, idx) => {
          const isHeader =
            line.startsWith("EXT.") || line.startsWith("INT.") || line.startsWith("TITLE:");
          const isCharacter =
            line.trim() === line && line.length > 0 && line === line.toUpperCase() && !isHeader;
          const isMatch = searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());
          
          const isPolishedLine =
            draftMode === "polished" &&
            appliedImprovements.length > 0 &&
            appliedSnippetsText.includes(line.trim()) &&
            line.trim().length > 3;

          return (
            <div
              key={idx}
              className={`flex gap-4 ${
                isMatch
                  ? "bg-amber-100 dark:bg-amber-950/60 p-1 rounded"
                  : isPolishedLine
                  ? "bg-emerald-100/80 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-300 dark:border-emerald-800"
                  : ""
              }`}
            >
              <span className="w-8 text-[10px] text-slate-400 select-none text-right flex-shrink-0 font-mono">
                {idx + 1}
              </span>
              <div className="flex-1">
                {isPolishedLine && idx === scriptLines.findIndex((l) => l.trim() === line.trim()) && (
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase block w-max mb-1">
                    + Applied AI Polished Beat
                  </span>
                )}
                <span
                  className={`${
                    isHeader
                      ? "font-semibold text-[#001b94] dark:text-sky-400 mt-2 block"
                      : isCharacter
                      ? "font-semibold text-emerald-800 dark:text-emerald-400 tracking-wider pl-12 block"
                      : "text-slate-800 dark:text-slate-300"
                  }`}
                >
                  {line}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-border bg-card text-[11px] text-muted-foreground flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${draftMode === "raw" ? "bg-slate-400" : "bg-emerald-500 animate-pulse"}`}></span>
          {draftMode === "raw" ? "Raw Writer Original Upload" : `AI Modified Draft (${appliedImprovements.length} Rewrites Applied)`}
        </span>
        <span>{scriptLines.length} Lines</span>
      </div>
    </div>
  );
};
