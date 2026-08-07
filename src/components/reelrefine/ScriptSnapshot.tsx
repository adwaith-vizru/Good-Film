import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Zap,
  ShieldAlert,
  Sparkles,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";

interface ScriptSnapshotProps {
  fileName: string;
  onNext: () => void;
  onBack: () => void;
}

export const ScriptSnapshot: React.FC<ScriptSnapshotProps> = ({ fileName, onNext, onBack }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRisks, setShowRisks] = useState(true);

  const verdict =
    "Compelling sci-fi thriller with strong protagonist drive; Act II pacing & antagonist depth need targeted polish.";

  const strengths = [
    "Clear protagonist journey & high-stakes survival goal (Dr. Alex Rivers)",
    "Visually evocative scene descriptions across desolate lunar set pieces",
    "Tightly written Act I setup with immediate 10-minute solar magnetosphere clock",
  ];

  const opportunities = [
    "Act II pacing drifts around pp. 55–72 during orbital transit sequence",
    "Antagonist motivation under-defined in Director Hayes briefing room scene",
    "Climactic dialogue relies on scientific exposition instead of visual subtext",
  ];

  const topRisks = [
    { title: "High VFX Density in Solar Eye Climax", impact: "Est. +$350K to post budget", tag: "High Impact" },
    { title: "Ext. Night Exterior Lighting Setup", impact: "Demands high-power LED volume or stage rigging", tag: "Medium Impact" },
  ];

  const actPacing = [
    { act: "Act I (pp. 1–30)", label: "Inciting Incident & Hook", score: 92, status: "Tightly Paced" },
    { act: "Act II (pp. 31–85)", label: "Solar Entry & Orbital Transit", score: 68, status: "Needs Polish" },
    { act: "Act III (pp. 86–114)", label: "Solar Eye Climax", score: 88, status: "High Tension" },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner: Script Readiness Meter & Quick Stats Grid */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              <span>Screenplay Intelligence Snapshot</span> • <span className="text-[#001b94] font-semibold">{fileName}</span>
            </div>
            <h2 className="text-2xl font-display font-semibold text-foreground">
              Executive Readiness Overview
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#001b94]/5 p-3 rounded-2xl border border-[#001b94]/20 self-stretch lg:self-auto justify-between lg:justify-start">
            <div className="text-right">
              <div className="text-[10px] font-mono font-semibold text-[#001b94] uppercase tracking-wider">
                Overall Coverage Score
              </div>
              <div className="text-2xl font-semibold font-mono text-[#001b94]">
                78% <span className="text-xs font-normal text-muted-foreground">/ High Potential</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#001b94] text-white flex items-center justify-center font-semibold font-mono text-base shadow-xs">
              78
            </div>
          </div>
        </div>

        {/* 4 Metric Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold text-muted-foreground flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-[#001b94]" /> Act I Pacing
            </div>
            <div className="text-sm font-semibold font-mono text-foreground">92 / 100</div>
            <span className="text-[10px] text-emerald-600 font-medium">Exceptional Hook</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-[#FF6F00]" /> Dialogue Economy
            </div>
            <div className="text-sm font-semibold font-mono text-foreground">76 / 100</div>
            <span className="text-[10px] text-amber-600 font-medium">Subtext Opportunity</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold text-muted-foreground flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5 text-[#001b94]" /> Commercial Fit
            </div>
            <div className="text-sm font-semibold font-mono text-foreground">84 / 100</div>
            <span className="text-[10px] text-emerald-600 font-medium">Sci-Fi Thriller</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold text-muted-foreground flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-[#FF6F00]" /> Production Score
            </div>
            <div className="text-sm font-semibold font-mono text-foreground">Indie Tier</div>
            <span className="text-[10px] text-slate-500 font-medium">Est. $4.5M – $8M</span>
          </div>
        </div>

        {/* Executive Coverage Verdict */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border flex items-start gap-3">
          <Zap className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-semibold font-mono uppercase tracking-wider text-muted-foreground block mb-0.5">
              Coverage Verdict & Summary
            </span>
            <p className="text-xs md:text-sm font-medium text-foreground leading-relaxed">
              "{verdict}"
            </p>
          </div>
        </div>
      </div>

      {/* Act Pacing Intensity Bar Visualizer */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-base text-foreground">Act-by-Act Narrative Pacing</h3>
          <span className="text-xs font-mono text-muted-foreground">114 Total Pages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actPacing.map((item) => (
            <div key={item.act} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-foreground">{item.act}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    item.score >= 80
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.score >= 80 ? "bg-[#001b94]" : "bg-[#FF6F00]"
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Primary Cards: Narrative Strengths & High-Leverage Fixes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Strengths */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-between space-y-4 hover:border-[#001b94]/40 transition-all shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#001b94] font-semibold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-display">Top Narrative Strengths</h3>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            ✓ Script structure is ready for casting & location scouting
          </div>
        </div>

        {/* Card 2: High-Leverage Fixes */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-between space-y-4 hover:border-[#001b94]/40 transition-all shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#001b94] font-semibold text-base">
                <Sparkles className="w-5 h-5 text-[#FF6F00]" />
                <h3 className="font-display">High-Leverage Fixes</h3>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FF6F00]/10 text-[#FF6F00]">
                Step 3 Focus
              </span>
            </div>
            <ul className="space-y-2.5">
              {opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F00] mt-1.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="w-full text-left pt-2 text-xs font-semibold text-[#001b94] dark:text-sky-400 bg-[#001b94]/10 p-3 rounded-xl border border-[#001b94]/20 hover:bg-[#001b94]/20 transition-colors flex items-center justify-between"
          >
            <span>Inspect side-by-side AI script rewrites in Step 3</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Production Risks Inspector */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowRisks(!showRisks)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldAlert className="w-4 h-4 text-[#FF6F00]" />
            <span>Production Feasibility & Risk Inspection ({topRisks.length} Items)</span>
          </div>
          {showRisks ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {showRisks && (
          <div className="px-6 pb-5 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5 pt-4">
            {topRisks.map((risk, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-xs p-3 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">{risk.title}</span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{risk.impact}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold">
                  {risk.tag}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deep Coverage Drawer */}
      {showDetails && (
        <div className="p-6 bg-[#001b94] text-white rounded-2xl space-y-3 shadow-lg">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF6F00]">
            Deep Coverage Breakdown & Scene Metrics
          </h4>
          <p className="text-xs text-white/90 leading-relaxed">
            The screenplay displays 82% scene economy in Act I, with dialogue density peaking at 42 lines/page in Act II. Pacing can be optimized by consolidating interior cockpit chatter on pp. 62–68.
          </p>
          <button
            type="button"
            onClick={() => setShowDetails(false)}
            className="text-xs font-semibold text-[#FF6F00] hover:underline"
          >
            Hide Detailed Metrics ▲
          </button>
        </div>
      )}

      {/* Bottom Step Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 text-foreground font-medium text-xs rounded-xl border border-border hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Script Import
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full sm:w-auto px-5 py-2.5 text-foreground font-medium text-xs rounded-xl border border-border hover:bg-accent transition-colors"
          >
            {showDetails ? "Close Deep Metrics" : "View Deep Metrics"}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#001b94] hover:bg-[#001b94]/90 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            Start AI Rewrites <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
