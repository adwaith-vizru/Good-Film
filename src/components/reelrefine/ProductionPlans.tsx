import React, { useState } from "react";
import { Users, DollarSign, MapPin, Check, Plus, Star, Sparkles, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Sliders, ShieldCheck } from "lucide-react";
import { CastRole, BudgetCategory, LocationOption, BUDGET_CATEGORIES } from "./reelRefineData";

interface ProductionPlansProps {
  casting: CastRole[];
  locations: LocationOption[];
  budgetTier: "Micro" | "Indie" | "Studio";
  shortlistedActors: Record<string, string>;
  pinnedLocationIds: string[];
  onToggleActorShortlist: (roleId: string, actorName: string) => void;
  onBudgetTierChange: (tier: "Micro" | "Indie" | "Studio") => void;
  onToggleLocationPin: (locId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProductionPlans: React.FC<ProductionPlansProps> = ({
  casting,
  locations,
  budgetTier,
  shortlistedActors,
  pinnedLocationIds,
  onToggleActorShortlist,
  onBudgetTierChange,
  onToggleLocationPin,
  onNext,
  onBack,
}) => {
  const [sliderValue, setSliderValue] = useState(65);
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);
  const [showAltLocations, setShowAltLocations] = useState(false);

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
      {/* Step Header */}
      <div className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FF6F00]/10 text-[#FF6F00] border border-[#FF6F00]/20 mb-2">
            Step 4 of 5 • Lean Production Planning
          </span>
          <h2 className="text-2xl font-normal font-display text-[#0F294D]">Casting, Budget & Locations</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure key attachment targets, project scale, and filming incentives in one calm step.
          </p>
        </div>

        <div className="bg-[#EBF3FC] px-4 py-2 rounded-xl border border-[#001b94]/20 text-right">
          <span className="text-xs font-semibold text-[#001b94] uppercase tracking-wider block">Estimated Total Budget</span>
          <span className="text-xl font-semibold text-[#001b94]">
            {formatCurrency(totals.low)} – {formatCurrency(totals.high)}
          </span>
        </div>
      </div>

      {/* CARD A: CASTING */}
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] border border-[#001b94]/20 flex items-center justify-center text-[#001b94]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal font-display text-[#0F294D]">Card A: Casting & Talent Shortlist</h3>
              <p className="text-xs text-[#64748B]">Top roles auto-detected from scene analysis</p>
            </div>
          </div>

          {/* Interactive Star Power vs Budget Slider */}
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-border space-y-1.5 max-w-xs w-full">
            <div className="flex justify-between text-xs font-semibold text-[#0F294D]">
              <span className={sliderValue < 40 ? "text-[#001b94] font-semibold" : ""}>Budget-Friendly</span>
              <span className={sliderValue > 60 ? "text-[#001b94] font-semibold" : ""}>Star Power</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full accent-[#001b94] cursor-pointer h-2 bg-slate-200 rounded-lg"
              aria-label="Star power versus budget friendly balance slider"
            />
            <p className="text-[11px] text-[#64748B] text-center">
              Preference: <span className="font-semibold text-[#001b94]">{sliderValue > 50 ? "High Commercial Appeal" : "Indie Realism"}</span>
            </p>
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-6">
          {casting.map((role) => {
            const currentSelected = shortlistedActors[role.id] || role.selectedActor;
            return (
              <div key={role.id} className="space-y-3 bg-[#F8FAFC] p-4 md:p-5 rounded-xl border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-medium text-[#0F294D]">{role.roleName}</h4>
                    <p className="text-xs text-[#64748B]">
                      Age Range: <span className="font-medium text-[#0F294D]">{role.ageRange}</span> • Vibe:{" "}
                      <span className="italic text-[#334155]">{role.vibe}</span>
                    </p>
                  </div>
                </div>

                {/* Actor Suggestions Grid */}
                <div className="grid md:grid-cols-3 gap-3 pt-1">
                  {role.actorOptions.map((actor) => {
                    const isSelected = currentSelected === actor.name;
                    return (
                      <div
                        key={actor.name}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 bg-card ${
                          isSelected
                            ? "border-[#001b94] ring-2 ring-[#001b94]/20"
                            : "border-border hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-8 h-8 rounded-full bg-[#001b94] text-white font-semibold text-xs flex items-center justify-center">
                              {actor.imageTag}
                            </span>
                            <span className="text-xs font-semibold text-[#001b94] bg-[#EBF3FC] px-2 py-0.5 rounded border border-[#001b94]/20 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#FF6F00] text-[#FF6F00]" /> {actor.fitScore}% Fit
                            </span>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#0F294D] text-sm">{actor.name}</h5>
                            <p className="text-xs text-[#64748B] line-clamp-1">{actor.knownFor}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-medium text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                              Star Power: {actor.starPowerScore}%
                            </span>
                            <span className="text-[11px] font-medium text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                              Impact: {actor.budgetImpact}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleActorShortlist(role.id, actor.name)}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-[#001b94] text-white"
                              : "bg-[#F1F5F9] hover:bg-slate-200 text-[#0F294D]"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Shortlisted
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> Add to Shortlist
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CARD B: BUDGET */}
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] border border-[#001b94]/20 flex items-center justify-center text-[#001b94]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal font-display text-[#0F294D]">Card B: Production Budget Scale</h3>
              <p className="text-xs text-[#64748B]">Quick estimate range based on project tier</p>
            </div>
          </div>

          <div className="bg-[#EBF3FC] px-4 py-2 rounded-xl border border-[#001b94]/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#001b94] block">Estimated Range</span>
            <span className="text-lg font-bold text-[#001b94]">
              {formatCurrency(totals.low)} – {formatCurrency(totals.high)}
            </span>
          </div>
        </div>

        {/* Radio Scale Selection (3 options: Micro, Indie, Studio-lite) */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { key: "Micro", label: "Micro Budget", range: "< $500K", desc: "Non-union, local stage, ultra-lean crew" },
            { key: "Indie", label: "Indie Feature", range: "$500K – $2M", desc: "SAG Tier 2, regional tax rebate, VFX post" },
            { key: "Studio", label: "Studio-Lite", range: "$2M – $5M", desc: "Full union heads, LED volume, A-list talent" },
          ].map((tier) => {
            const isChecked = budgetTier === tier.key;
            return (
              <button
                key={tier.key}
                type="button"
                onClick={() => onBudgetTierChange(tier.key as any)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 bg-card ${
                  isChecked
                    ? "border-[#001b94] ring-2 ring-[#001b94]/20"
                    : "border-border hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#0F294D] text-sm">{tier.label}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? "border-[#001b94] bg-[#001b94] text-white" : "border-slate-300"}`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#001b94] mb-1">{tier.range}</div>
                  <p className="text-xs text-[#64748B] leading-snug">{tier.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Breakdown Table Expander */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
            className="text-xs font-medium text-[#001b94] hover:underline flex items-center gap-1.5 focus:outline-none"
          >
            {showBudgetBreakdown ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
            <span>{showBudgetBreakdown ? "Hide Line Item Breakdown" : "View Line Item Category Breakdown"}</span>
          </button>

          {showBudgetBreakdown && (
            <div className="mt-3 bg-[#F8FAFC] p-4 rounded-xl border border-border space-y-2 animate-fade-in">
              <div className="grid grid-cols-12 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-border pb-2">
                <span className="col-span-6">Category</span>
                <span className="col-span-3 text-right">Low Est.</span>
                <span className="col-span-3 text-right">High Est.</span>
              </div>
              {BUDGET_CATEGORIES.map((cat) => {
                const values = budgetTier === "Micro" ? cat.micro : budgetTier === "Indie" ? cat.indie : cat.studio;
                return (
                  <div key={cat.category} className="grid grid-cols-12 text-xs text-[#334155] font-medium py-1">
                    <span className="col-span-6">{cat.category}</span>
                    <span className="col-span-3 text-right text-[#0F294D]">${values.low}K</span>
                    <span className="col-span-3 text-right text-[#0F294D]">${values.high}K</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[11px] text-[#64748B] italic">
          Note: Illustrative ranges for preliminary development only; refine line items with your line producer.
        </p>
      </div>

      {/* CARD C: LOCATIONS */}
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] border border-[#001b94]/20 flex items-center justify-center text-[#001b94]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal font-display text-[#0F294D]">Card C: Matching Production Hubs & Locations</h3>
              <p className="text-xs text-[#64748B]">Up to 3 top regions matching screenplay setting & tax rebates</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#001b94] bg-[#EBF3FC] px-3 py-1.5 rounded-lg border border-[#001b94]/20">
            {pinnedLocationIds.length} location(s) pinned
          </span>
        </div>

        {/* Location Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {locations.map((loc) => {
            const isPinned = pinnedLocationIds.includes(loc.id);
            return (
              <div
                key={loc.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 bg-card ${
                  isPinned ? "border-[#001b94] ring-2 ring-[#001b94]/20" : "border-border hover:border-slate-300"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[#0F294D] text-base">{loc.region}</h4>
                      <p className="text-xs font-semibold text-[#64748B]">{loc.country}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#001b94] bg-[#EBF3FC] px-2.5 py-1 rounded-full border border-[#001b94]/20">
                      {loc.taxIncentive}
                    </span>
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-lg border border-border">
                    <span className="font-semibold text-[#0F294D]">Match Note:</span> {loc.vibeMatch}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">Permits: {loc.permitEase}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">Window: {loc.climateWindow}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleLocationPin(loc.id)}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    isPinned
                      ? "bg-[#001b94] text-white"
                      : "bg-[#F1F5F9] hover:bg-slate-200 text-[#0F294D]"
                  }`}
                >
                  {isPinned ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Location Pinned
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" /> Pin Location
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Expander for Alt Options */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowAltLocations(!showAltLocations)}
            className="text-xs font-medium text-[#001b94] hover:underline inline-flex items-center gap-1"
          >
            {showAltLocations ? "Hide alternate regions" : "See alternate international filming hubs"}
          </button>
          {showAltLocations && (
            <p className="text-xs text-[#64748B] mt-2 bg-[#F8FAFC] p-3 rounded-lg border border-border">
              Additional options: Wellington (New Zealand), Budapest (Hungary), and Melbourne (Australia) are available on request.
            </p>
          )}
        </div>
      </div>

      {/* Actions (Max 3 visible: Back, Generate Summary) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 text-[#0F294D] hover:text-[#001b94] font-medium text-xs rounded-lg border border-border hover:border-slate-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Script Fixes
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#001b94] hover:bg-[#001470] text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#001b94]"
        >
          Generate Summary & Export <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
