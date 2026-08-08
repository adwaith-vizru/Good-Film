import React, { useState } from "react";
import {
  Check,
  Eye,
  X,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  MessageSquare,
  CheckCircle2,
  Columns,
  ListFilter,
  SlidersHorizontal,
  Bot,
} from "lucide-react";
import { ScriptImprovement } from "./reelRefineData";

interface ScriptImproverProps {
  improvements: ScriptImprovement[];
  versionTag: string;
  appliedCount: number;
  onApply: (id: string) => void;
  onRevert: (id: string) => void;
  onOpenDiff: (imp: ScriptImprovement) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScriptImprover: React.FC<ScriptImproverProps> = ({
  improvements,
  versionTag,
  appliedCount,
  onApply,
  onRevert,
  onOpenDiff,
  onNext,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<"ALL" | "Structure" | "Characters" | "Dialogue">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPLIED">("ALL");
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [expandedInlineDiffIds, setExpandedInlineDiffIds] = useState<string[]>(["imp-1"]);

  const filtered = improvements.filter((imp) => {
    if (dismissedIds.includes(imp.id)) return false;
    if (activeCategory !== "ALL" && imp.category !== activeCategory) return false;
    if (statusFilter === "PENDING" && imp.applied) return false;
    if (statusFilter === "APPLIED" && !imp.applied) return false;
    return true;
  });

  const toggleInlineDiff = (id: string) => {
    setExpandedInlineDiffIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleApplyAllFiltered = () => {
    filtered.forEach((imp) => {
      if (!imp.applied) onApply(imp.id);
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Versioning Indicator */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              AI Screenplay Rewrites & Intelligent Diff
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Review side-by-side script improvements. Apply dialogue polish, scene pacing edits, or antagonist motivations in one click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono">
            <span className="text-muted-foreground block text-[10px]">CURRENT DRAFT</span>
            <span className="font-semibold text-foreground">{versionTag}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#001b94]/10 text-xs font-mono text-[#001b94]">
            <span className="text-muted-foreground block text-[10px]">APPLIED REWRITES</span>
            <span className="font-semibold">{appliedCount} Applied</span>
          </div>
        </div>
      </div>

      {/* Filter & Batch Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {(["ALL", "Structure", "Characters", "Dialogue"] as const).map((cat) => {
            const count = improvements.filter((imp) =>
              cat === "ALL" ? !dismissedIds.includes(imp.id) : imp.category === cat && !dismissedIds.includes(imp.id)
            ).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#001b94] text-white shadow-xs"
                    : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat === "Structure" && <Layers className="w-3.5 h-3.5" />}
                {cat === "Characters" && <Users className="w-3.5 h-3.5" />}
                {cat === "Dialogue" && <MessageSquare className="w-3.5 h-3.5" />}
                <span>{cat === "ALL" ? "All Categories" : cat}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Filter & Batch Apply */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {(["ALL", "PENDING", "APPLIED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium font-mono transition-all ${
                  statusFilter === st
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApplyAllFiltered}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Apply All Visible</span>
          </button>
        </div>
      </div>

      {/* Suggestion Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-10 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No suggestions match current filters.</p>
            <p className="text-xs text-muted-foreground">Switch category tabs or filter criteria to inspect other scene rewrites.</p>
          </div>
        ) : (
          filtered.map((imp) => {
            const isInlineExpanded = expandedInlineDiffIds.includes(imp.id);
            return (
              <div
                key={imp.id}
                className={`bg-card rounded-2xl border transition-all shadow-xs space-y-4 p-5 md:p-6 ${
                  imp.applied
                    ? "border-emerald-500/60 bg-emerald-500/5"
                    : "border-border hover:border-[#001b94]/40"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-[#001b94]/10 text-[#001b94]">
                        {imp.category.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                        {imp.sceneLocation}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {imp.pageRange}
                      </span>
                      {imp.applied && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Applied in Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{imp.title}</h3>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      type="button"
                      onClick={() => toggleInlineDiff(imp.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
                        isInlineExpanded
                          ? "bg-[#001b94] text-white border-[#001b94]"
                          : "bg-background border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>{isInlineExpanded ? "Hide Side-by-Side" : "Side-by-Side Diff"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDiff(imp)}
                      className="px-3 py-1.5 text-xs font-medium text-[#001b94] bg-[#001b94]/10 hover:bg-[#001b94]/20 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Bot className="w-3.5 h-3.5 text-[#FF6F00]" /> AI Assistant Chat
                    </button>

                    {imp.applied ? (
                      <button
                        type="button"
                        onClick={() => onRevert(imp.id)}
                        className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Revert
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onApply(imp.id)}
                        className="px-4 py-1.5 text-xs font-medium text-white bg-[#001b94] hover:bg-[#001b94]/90 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Apply
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDismiss(imp.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Dismiss suggestion"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rationale Microcopy */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/60 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">AI Narrative Rationale: </span>
                    {imp.rationale}
                  </div>
                </div>

                {/* Interactive Inline Side-by-Side Diff Preview */}
                {isInlineExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                    {/* Original Box */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider font-sans">
                        <span>Original Screenplay Text</span>
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-200">
                          - Before Edit
                        </span>
                      </div>
                      <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/40 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {imp.originalSnippet}
                      </div>
                    </div>

                    {/* Suggested Box */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-sans">
                        <span>Suggested Improved Rewrite</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200">
                          + Improved Pacing & Subtext
                        </span>
                      </div>
                      <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-300 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200 font-semibold leading-relaxed whitespace-pre-wrap">
                        {imp.suggestedSnippet}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Step Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 text-foreground font-medium text-xs rounded-xl border border-border hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Script Snapshot
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#001b94] hover:bg-[#001b94]/90 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          Next: Scene Breakdowns <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
