import React, { useState } from "react";
import { Layers, Search, Filter, Flame, Users, Clock, Sparkles } from "lucide-react";
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
      sc.characters.some((c) => c.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterSetting === "INT") return sc.setting === "INT";
    if (filterSetting === "EXT") return sc.setting === "EXT";
    if (filterSetting === "HIGH_VFX") return sc.vfxScore >= 4;
    return true;
  });

  const totalPages = activeScenes.reduce((sum, sc) => sum + sc.pages, 0);
  const totalMins = activeScenes.reduce((sum, sc) => sum + sc.estimatedMinutes, 0);

  return (
    <div className="space-y-6">
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
            <span className="text-muted-foreground block text-[10px]">TOTAL SCENES</span>
            <span className="font-mono text-sm font-semibold">{activeScenes.length} Scenes</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span className="text-muted-foreground block text-[10px]">ESTIMATED RUNTIME</span>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSetting === mode
                  ? "bg-[#001b94] text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
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

      {/* Breakdown List / Cards */}
      <div className="space-y-4">
        {filtered.map((sc) => (
          <div
            key={sc.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-[#001b94]/40 transition-all shadow-xs space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-xl bg-[#001b94]/10 text-[#001b94] font-mono font-semibold text-xs flex items-center justify-center">
                  #{sc.sceneNumber}
                </span>
                <div>
                  <h3 className="font-mono font-semibold text-sm text-foreground">
                    {sc.slugline}
                  </h3>
                  <p className="text-xs text-muted-foreground">{sc.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className={`px-2.5 py-1 rounded-md ${
                    sc.setting === "INT"
                      ? "bg-sky-500/10 text-sky-700 dark:text-sky-400"
                      : "bg-[#FF6F00]/10 text-[#FF6F00]"
                  }`}
                >
                  {sc.setting}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {sc.timeOfDay}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {sc.pages} Pages
                </span>
              </div>
            </div>

            {/* Matrix Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Cast Required */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl space-y-1.5">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#001b94]" /> Cast Required
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sc.characters.map((char) => (
                    <span
                      key={char}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-border text-foreground font-medium text-[11px]"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Props */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl space-y-1.5">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6F00]" /> Key Props & Wardrobe
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sc.props.map((prop) => (
                    <span
                      key={prop}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-border text-slate-600 dark:text-slate-400 text-[11px]"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>

              {/* VFX Complexity Rating */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl space-y-1.5">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-rose-500" /> VFX Complexity Score
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-2.5 w-6 rounded-sm ${
                          lvl <= sc.vfxScore ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {sc.vfxScore}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
