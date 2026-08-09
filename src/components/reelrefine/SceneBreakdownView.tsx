import React, { useState } from "react";
import { Layers, Search, Filter, Flame, Users, Sparkles } from "lucide-react";
import { INITIAL_SCENE_BREAKDOWNS, SceneBreakdown, ProjectOption, getScenesForProject } from "./reelRefineData";

interface SceneBreakdownViewProps {
  scenes?: SceneBreakdown[];
  currentProject?: ProjectOption;
}

export const SceneBreakdownView: React.FC<SceneBreakdownViewProps> = ({ scenes, currentProject }) => {
  const activeScenes = scenes || (currentProject ? getScenesForProject(currentProject) : INITIAL_SCENE_BREAKDOWNS);
  const [search, setSearch] = useState("");
  const [filterSetting, setFilterSetting] = useState<"ALL" | "INT" | "EXT" | "HIGH_VFX">("ALL");

  const filtered = activeScenes.filter((sc) => {
    const matchesSearch =
      sc.slugline.toLowerCase().includes(search.toLowerCase()) ||
      sc.summary.toLowerCase().includes(search.toLowerCase()) ||
      sc.characters.some((c) => c.toLowerCase().includes(search.toLowerCase())) ||
      sc.props.some((p) => p.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterSetting === "INT") return sc.setting === "INT";
    if (filterSetting === "EXT") return sc.setting === "EXT";
    if (filterSetting === "HIGH_VFX") return sc.vfxScore >= 4;
    return true;
  });

  const totalMins = activeScenes.reduce((sum, sc) => sum + sc.estimatedMinutes, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              Scene & Character Breakdown Matrix
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Automated production breakdown tags, character scene matrices, prop lists, and VFX difficulty scores.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span className="text-muted-foreground block text-[10px] font-mono">TOTAL SCENES</span>
            <span className="font-mono text-sm font-semibold">{activeScenes.length} Scenes</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span className="text-muted-foreground block text-[10px] font-mono">ESTIMATED RUNTIME</span>
            <span className="font-mono text-sm font-semibold">{totalMins} Mins</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slugline, character, or props..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001b94]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1 font-mono">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {(["ALL", "INT", "EXT", "HIGH_VFX"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterSetting(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterSetting === mode
                  ? "bg-[#001b94] text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {mode === "ALL"
                ? "All Scenes"
                : mode === "INT"
                ? "Interior Only"
                : mode === "EXT"
                ? "Exterior Only"
                : "High VFX (4+)"}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown List Cards (New UI match) */}
      <div className="space-y-5">
        {filtered.map((sc) => (
          <div
            key={sc.id}
            className="bg-card border border-slate-200/90 dark:border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            {/* Top Row: Scene # Badge + Slugline + Summary & Badges */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#001b94]/10 dark:bg-sky-900/40 text-[#001b94] dark:text-sky-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                  #{sc.sceneNumber}
                </span>
                <div className="space-y-0.5">
                  <h3 className="font-mono font-bold text-sm text-[#0F294D] dark:text-foreground tracking-wide uppercase">
                    {sc.slugline}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {sc.summary}
                  </p>
                </div>
              </div>

              {/* Right Badges */}
              <div className="flex items-center gap-2 text-[10px] font-medium flex-shrink-0">
                <span
                  className={`px-3 py-1 rounded-full uppercase font-semibold border ${
                    sc.setting === "INT"
                      ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-900/50"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/50"
                  }`}
                >
                  {sc.setting}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold">
                  {sc.timeOfDay}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-mono">
                  {sc.pages} Pages
                </span>
              </div>
            </div>

            {/* Bottom Row: 3 Pillar Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-xs">
              {/* Pillar 1: Cast Required */}
              <div className="bg-[#F8FAFC] dark:bg-slate-900/60 p-5 rounded-[22px] border border-slate-100 dark:border-slate-800 space-y-3 flex flex-col justify-between min-h-[105px]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                  <Users className="h-4 w-4 text-[#001b94] dark:text-sky-400" />
                  <span>CAST REQUIRED</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {sc.characters.map((char) => (
                    <span
                      key={char}
                      className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-[#001b94] dark:text-sky-300 font-semibold text-xs shadow-2xs"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar 2: Key Props & Wardrobe */}
              <div className="bg-[#F8FAFC] dark:bg-slate-900/60 p-5 rounded-[22px] border border-slate-100 dark:border-slate-800 space-y-3 flex flex-col justify-between min-h-[105px]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                  <Sparkles className="h-4 w-4 text-[#FF6F00]" />
                  <span>KEY PROPS & WARDROBE</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {sc.props.map((prop) => (
                    <span
                      key={prop}
                      className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs shadow-2xs"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar 3: VFX Complexity Score */}
              <div className="bg-[#F8FAFC] dark:bg-slate-900/60 p-5 rounded-[22px] border border-slate-100 dark:border-slate-800 space-y-2 flex flex-col justify-between min-h-[110px]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-emerald-500" />
                    <span>VFX COMPLEXITY SCORE</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {sc.vfxScore}/5
                  </span>
                </div>

                <div className="space-y-2 pt-0.5">
                  <div className="text-xs font-bold text-[#0F294D] dark:text-foreground">
                    {sc.vfxScore >= 5
                      ? "Extremely High complexity"
                      : sc.vfxScore >= 4
                      ? "High complexity"
                      : sc.vfxScore >= 3
                      ? "Moderate complexity"
                      : sc.vfxScore >= 2
                      ? "Low complexity"
                      : "Minimal complexity"}
                  </div>

                  {/* Single Continuous Linear Progress Bar (as in screenshot) */}
                  <div className="h-2.5 w-full bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] dark:bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${(sc.vfxScore / 5) * 100}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight pt-0.5">
                    {sc.vfxScore >= 4
                      ? "Solar storm VFX • Particle systems • Atmospheric scattering"
                      : sc.vfxScore >= 3
                      ? "Practical SFX • Compositing • Screen overlays"
                      : "Minimal post • Practical lighting"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
