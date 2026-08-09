import React from "react";
import { Film, BookOpen, Download, LayoutGrid } from "lucide-react";
import { ProjectOption } from "./reelRefineData";
import { AnimatedFilmLogo } from "./AnimatedFilmLogo";

interface StudioHeaderProps {
  currentProject: ProjectOption;
  versionTag: string;
  onToggleScriptReader: () => void;
  isScriptReaderOpen: boolean;
  onExport: () => void;
  onGoToHome: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentProject,
  versionTag,
  onToggleScriptReader,
  isScriptReaderOpen,
  onExport,
  onGoToHome,
}) => {
  return (
    <header className="bg-card border-b border-border z-30 sticky top-0 shadow-xs px-4 lg:px-6 py-3 font-sans">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo & Active Project Indicator */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onGoToHome}
            className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            title="Go to Home Page"
          >
            <AnimatedFilmLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-lg text-foreground tracking-tight group-hover:text-[#001b94] transition-colors">
                  Good Film Studios
                </span>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-[#001b94]/10 text-[#001b94] font-mono">
                  Studio Edition
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                AI Screenplay Intelligence & Production Hub
              </p>
            </div>
          </button>

          <div className="h-6 w-[1px] bg-border hidden sm:block" />

          {/* Active Script Badge (Pills to Home) */}
          <button
            type="button"
            onClick={onGoToHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-foreground transition-all cursor-pointer group"
            title="Active Studio Project — Click to view Movie Catalog on Home Page"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="max-w-[150px] sm:max-w-[200px] truncate font-semibold">
              {currentProject.title}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono hidden md:inline">
              ({versionTag})
            </span>
            <LayoutGrid className="h-3.5 w-3.5 text-[#001b94] opacity-70 group-hover:opacity-100 transition-opacity ml-1" />
          </button>
        </div>

        {/* Center Section: Quick Stats */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          <div className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
            {currentProject.pages} Pages
          </div>
          <div className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
            {currentProject.scenesCount} Scenes
          </div>
          <div className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono">
            {currentProject.budgetTier} Tier
          </div>
        </div>

        {/* Right Section: Script Reader Toggle & Export Action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleScriptReader}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isScriptReaderOpen
                ? "bg-[#0F294D] text-white border-[#0F294D]"
                : "border-border bg-background hover:bg-accent text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#FF6F00]" />
            <span className="hidden sm:inline">Live Script Reader</span>
          </button>

          <button
            type="button"
            onClick={onExport}
            className="px-3.5 py-1.5 rounded-lg bg-[#001b94] hover:bg-[#001b94]/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Package</span>
          </button>
        </div>
      </div>
    </header>
  );
};
