import React, { useState } from "react";
import { Film, BookOpen, ChevronDown, Download, Sparkles, Check } from "lucide-react";
import { SAMPLE_PROJECTS, ProjectOption } from "./reelRefineData";

interface StudioHeaderProps {
  currentProject: ProjectOption;
  onSelectProject: (proj: ProjectOption) => void;
  versionTag: string;
  onToggleScriptReader: () => void;
  isScriptReaderOpen: boolean;
  onExport: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentProject,
  onSelectProject,
  versionTag,
  onToggleScriptReader,
  isScriptReaderOpen,
  onExport,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border z-30 sticky top-0 shadow-xs px-4 lg:px-6 py-3">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo & Project Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0F294D] to-[#001b94] flex items-center justify-center text-white shadow-xs">
              <Film className="h-5 w-5 text-[#FF6F00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-lg text-foreground tracking-tight">
                  ReelRefine
                </span>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-[#001b94]/10 text-[#001b94] font-mono">
                  Studio Edition
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                AI Screenplay Intelligence & Production Hub
              </p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-border hidden sm:block" />

          {/* Project Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-all"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="max-w-[140px] truncate font-semibold">{currentProject.title}</span>
              <span className="text-[10px] text-muted-foreground font-mono hidden md:inline">
                ({versionTag})
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-card border border-border rounded-xl shadow-xl z-50 p-1.5">
                <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider font-mono">
                  Select Studio Script
                </div>
                <div className="space-y-1 mt-1">
                  {SAMPLE_PROJECTS.map((proj) => {
                    const isSelected = proj.id === currentProject.id;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => {
                          onSelectProject(proj);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-[#001b94]/10 text-[#001b94] font-semibold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"
                        }`}
                      >
                        <div>
                          <div className="font-medium truncate">{proj.title}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {proj.pages} pages • {proj.budgetTier} Budget
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#001b94]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
