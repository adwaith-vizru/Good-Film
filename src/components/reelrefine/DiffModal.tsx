import React, { useEffect } from "react";
import { X, Check, FileCode, RotateCcw, Sparkles, AlertCircle } from "lucide-react";
import { ScriptImprovement } from "./reelRefineData";

interface DiffModalProps {
  isOpen: boolean;
  improvement: ScriptImprovement | null;
  onClose: () => void;
  onApply: (id: string) => void;
  onRevert: (id: string) => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  improvement,
  onClose,
  onApply,
  onRevert,
}) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diff-modal-title"
    >
      <div className="bg-card rounded-2xl border border-border max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6F00]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 id="diff-modal-title" className="text-base font-display font-semibold text-white">
                Screenplay Rewrite Inspection
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {improvement.sceneLocation} • Page Range: <span className="text-[#FF6F00] font-semibold">{improvement.pageRange}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close diff modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Rationale Banner */}
        <div className="px-6 py-3.5 bg-[#001b94]/10 border-b border-border flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="h-4 w-4 text-[#FF6F00] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#001b94] dark:text-sky-400 uppercase tracking-wider font-mono">
              AI Recommendation Rationale:
            </span>{" "}
            {improvement.rationale}
          </div>
        </div>

        {/* Diff Comparison Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-background font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider font-sans">
                <span>Original Scene Dialogue / Action</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-200">
                  - Current Draft
                </span>
              </div>
              <div className="p-5 bg-rose-50/70 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {improvement.originalSnippet}
              </div>
            </div>

            {/* Suggested Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-sans">
                <span>Suggested Improved Rewrite</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200">
                  + Polished Subtext & Clock
                </span>
              </div>
              <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-300 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200 font-semibold leading-relaxed whitespace-pre-wrap">
                {improvement.suggestedSnippet}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-card border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-border">Esc</kbd> to exit
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-accent text-xs font-medium rounded-xl border border-border transition-colors"
            >
              Cancel
            </button>

            {improvement.applied ? (
              <button
                type="button"
                onClick={() => {
                  onRevert(improvement.id);
                  onClose();
                }}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Revert Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onApply(improvement.id);
                  onClose();
                }}
                className="px-6 py-2 bg-[#001b94] hover:bg-[#001b94]/90 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Check className="w-4 h-4" /> Apply Rewrite to Screenplay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
