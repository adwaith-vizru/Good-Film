import React from "react";
import { Download, FileText, Share2, CheckCircle2, Film, Users, DollarSign, MapPin, Sparkles, Check, Copy } from "lucide-react";
import { ScriptImprovement, CastRole, LocationOption, BUDGET_CATEGORIES } from "./reelRefineData";

interface SummaryExportProps {
  fileName: string;
  versionTag: string;
  improvements: ScriptImprovement[];
  casting: CastRole[];
  shortlistedActors: Record<string, string>;
  budgetTier: "Micro" | "Indie" | "Studio";
  locations: LocationOption[];
  pinnedLocationIds: string[];
  onTriggerDownload: (fileType: string, label: string) => void;
  onCopyShareLink: () => void;
  onReset: () => void;
}

export const SummaryExport: React.FC<SummaryExportProps> = ({
  fileName,
  versionTag,
  improvements,
  casting,
  shortlistedActors,
  budgetTier,
  locations,
  pinnedLocationIds,
  onTriggerDownload,
  onCopyShareLink,
  onReset,
}) => {
  const appliedImprovements = improvements.filter((imp) => imp.applied);
  const pinnedLocations = locations.filter((loc) => pinnedLocationIds.includes(loc.id));

  const calculateTotal = () => {
    let lowSum = 0;
    let highSum = 0;
    BUDGET_CATEGORIES.forEach((cat) => {
      if (budgetTier === "Micro") {
        lowSum += cat.micro.low;
        highSum += cat.micro.high;
      } else if (budgetTier === "Indie") {
        lowSum += cat.indie.low;
        highSum += cat.indie.high;
      } else {
        lowSum += cat.studio.low;
        highSum += cat.studio.high;
      }
    });
    return { low: lowSum, high: highSum };
  };

  const totals = calculateTotal();
  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}M`;
    return `$${val}K`;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner: Success Header */}
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Development Packet Compiled</span>
        </div>
        <h2 className="text-3xl font-normal font-display text-[#0F294D] dark:text-foreground">
          Executive Summary & Production Export
        </h2>
        <p className="text-xs text-[#64748B] dark:text-muted-foreground max-w-2xl font-medium">
          Your project <span className="font-semibold text-[#001b94] dark:text-sky-400">"{fileName}"</span> has been refined to{" "}
          <span className="font-semibold text-emerald-800 dark:text-emerald-400">{versionTag}</span>. Download your complete coverage deck and script package below.
        </p>
      </div>

      {/* 4 Summary Tiles */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tile 1: Accepted Improvements */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-medium text-[#0F294D] dark:text-foreground">
              <Sparkles className="w-5 h-5 text-[#FF6F00]" />
              <h3 className="font-display">Accepted Improvements</h3>
            </div>
            <span className="text-xs font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-[#001b94]/20 dark:border-sky-800/60">
              {appliedImprovements.length} Applied
            </span>
          </div>

          {appliedImprovements.length === 0 ? (
            <p className="text-xs text-[#64748B] dark:text-muted-foreground italic py-2">No rewrites applied in this pass. Original script preserved.</p>
          ) : (
            <ul className="space-y-2">
              {appliedImprovements.map((imp) => (
                <li key={imp.id} className="text-xs text-[#334155] dark:text-slate-300 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#0F294D] dark:text-foreground">{imp.title}:</strong> {imp.sceneLocation} ({imp.pageRange})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tile 2: Cast Shortlist */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-medium text-[#0F294D] dark:text-foreground">
              <Users className="w-5 h-5 text-[#001b94] dark:text-sky-400" />
              <h3 className="font-display">Talent Attachment Shortlist</h3>
            </div>
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              {casting.length} Roles
            </span>
          </div>

          <div className="space-y-2">
            {casting.map((role) => {
              const actor = shortlistedActors[role.id] || role.selectedActor;
              return (
                <div key={role.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="font-medium text-[#0F294D] dark:text-foreground">{role.roleName.split("(")[0]}</span>
                  <span className="font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-2.5 py-1 rounded border border-[#001b94]/20 dark:border-sky-800/60">
                    {actor}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tile 3: Budget Range */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-medium text-[#0F294D] dark:text-foreground">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-display">Budget Range & Tier</h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              {budgetTier} Tier
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#0F294D] dark:text-foreground">
              {formatCurrency(totals.low)} – {formatCurrency(totals.high)}
            </div>
            <p className="text-xs text-[#64748B] dark:text-muted-foreground">
              Includes talent fees, LED volume stage time, crew HODs, VFX post, and 10% contingency reserve.
            </p>
          </div>
        </div>

        {/* Tile 4: Pinned Locations */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-medium text-[#0F294D] dark:text-foreground">
              <MapPin className="w-5 h-5 text-[#001b94] dark:text-sky-400" />
              <h3 className="font-display">Pinned Filming Locations</h3>
            </div>
            <span className="text-xs font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-[#001b94]/20 dark:border-sky-800/60">
              {pinnedLocations.length} Hubs
            </span>
          </div>

          {pinnedLocations.length === 0 ? (
            <p className="text-xs text-[#64748B] dark:text-muted-foreground italic py-2">No location hubs pinned.</p>
          ) : (
            <div className="space-y-2">
              {pinnedLocations.map((loc) => (
                <div key={loc.id} className="text-xs text-[#334155] dark:text-slate-300 flex items-center justify-between">
                  <span className="font-medium text-[#0F294D] dark:text-foreground">{loc.region}</span>
                  <span className="text-[11px] font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-2 py-0.5 rounded border border-[#001b94]/20 dark:border-sky-800/60">
                    {loc.taxIncentive}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Options Card */}
      <div className="bg-[#001b94] dark:bg-[#001470] text-white rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <h3 className="text-xl font-normal font-display text-white">Export Package Deliverables</h3>
            <p className="text-xs text-white/80">Download formatted assets for dev execs & production partners</p>
          </div>
          <button
            type="button"
            onClick={onCopyShareLink}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#FF6F00] font-medium text-xs rounded-lg border border-white/20 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-[#FF6F00]"
          >
            <Copy className="w-3.5 h-3.5" /> Share Link (View-Only)
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Option 1: Coverage PDF */}
          <button
            type="button"
            onClick={() => onTriggerDownload("pdf", "GoodFilmStudios_Coverage_Report.pdf")}
            className="p-5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-left transition-all space-y-3 group focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 text-[#FF6F00] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm">Coverage PDF</h4>
              <p className="text-xs text-white/70">Executive readiness score, strengths & fix log</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#FF6F00] gap-1">
              <Download className="w-3.5 h-3.5" /> Download .pdf
            </div>
          </button>

          {/* Option 2: Development Pack ZIP */}
          <button
            type="button"
            onClick={() => onTriggerDownload("zip", "GoodFilmStudios_Dev_Pack.zip")}
            className="p-5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-left transition-all space-y-3 group focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 text-[#FF6F00] flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm">Development Pack (.zip)</h4>
              <p className="text-xs text-white/70">PDF + casting deck + budget sheet + location notes</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#FF6F00] gap-1">
              <Download className="w-3.5 h-3.5" /> Download .zip
            </div>
          </button>

          {/* Option 3: Script v{n} */}
          <button
            type="button"
            onClick={() => onTriggerDownload("script", `${fileName.replace(/\.[^/.]+$/, "")}_${versionTag}_Edited.fdx`)}
            className="p-5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-left transition-all space-y-3 group focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 text-[#FF6F00] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm">Script {versionTag} (.fdx)</h4>
              <p className="text-xs text-white/70">Revised screenplay file with applied rewrites</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#FF6F00] gap-1">
              <Download className="w-3.5 h-3.5" /> Download .fdx
            </div>
          </button>
        </div>
      </div>

      {/* Start New Session Action */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2.5 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F294D] dark:text-foreground border border-border font-medium text-xs rounded-lg transition-colors"
        >
          Review Another Screenplay
        </button>
      </div>
    </div>
  );
};
