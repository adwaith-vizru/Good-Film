import React, { useState } from "react";
import {
  Users,
  DollarSign,
  MapPin,
  Check,
  Plus,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Globe,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  CastRole,
  BudgetCategory,
  LocationOption,
  BUDGET_CATEGORIES,
  GLOBAL_LOCATION_DATABASE,
} from "./reelRefineData";

interface ProductionPlansProps {
  casting: CastRole[];
  locations: LocationOption[];
  budgetTier: "Micro" | "Indie" | "Studio";
  shortlistedActors: Record<string, string>;
  pinnedLocationIds: string[];
  onToggleActorShortlist: (roleId: string, actorName: string) => void;
  onBudgetTierChange: (tier: "Micro" | "Indie" | "Studio") => void;
  onToggleLocationPin: (locId: string) => void;
  onAddLocation?: (newLoc: LocationOption) => void;
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
  onAddLocation,
  onNext,
  onBack,
}) => {
  const [sliderValue, setSliderValue] = useState(65);
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);
  const [showAltLocations, setShowAltLocations] = useState(false);

  // Search Bar 1: Search existing dashboard cards
  const [searchDashboardQuery, setSearchDashboardQuery] = useState("");

  // Search Bar 2: Search & Add new global hub location
  const [newLocationQuery, setNewLocationQuery] = useState("");
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  // Compute shortlisted actor details & budget impact
  const shortlistedCast = casting.map((role) => {
    const selectedName = shortlistedActors[role.id] || role.selectedActor;
    const actorObj = role.actorOptions.find((a) => a.name === selectedName);
    return {
      roleId: role.id,
      roleName: role.roleName,
      actorName: selectedName,
      impact: actorObj?.budgetImpact || "Medium",
      starPower: actorObj?.starPowerScore || 80,
      fitScore: actorObj?.fitScore || 90,
    };
  });

  const highImpactCount = shortlistedCast.filter((a) => a.impact === "High").length;
  const lowImpactCount = shortlistedCast.filter((a) => a.impact === "Low").length;

  // Calculate talent budget delta from shortlisted cast choices
  let talentLowDelta = 0;
  let talentHighDelta = 0;
  shortlistedCast.forEach((a) => {
    if (a.impact === "High") {
      talentLowDelta += 200;
      talentHighDelta += 450;
    } else if (a.impact === "Low") {
      talentLowDelta -= 60;
      talentHighDelta -= 120;
    }
  });

  const calculateTotal = () => {
    let lowSum = 0;
    let highSum = 0;
    BUDGET_CATEGORIES.forEach((cat) => {
      let baseLow = 0;
      let baseHigh = 0;
      if (budgetTier === "Micro") {
        baseLow = cat.micro.low;
        baseHigh = cat.micro.high;
      } else if (budgetTier === "Indie") {
        baseLow = cat.indie.low;
        baseHigh = cat.indie.high;
      } else {
        baseLow = cat.studio.low;
        baseHigh = cat.studio.high;
      }

      if (cat.category === "Talent & Cast") {
        baseLow = Math.max(30, baseLow + talentLowDelta);
        baseHigh = Math.max(60, baseHigh + talentHighDelta);
      }

      lowSum += baseLow;
      highSum += baseHigh;
    });
    return { low: lowSum, high: highSum };
  };

  const totals = calculateTotal();
  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}M`;
    return `$${val}K`;
  };

  // Filter existing dashboard locations (Search Bar 1)
  const filteredDashboardLocations = locations.filter((loc) => {
    if (!searchDashboardQuery.trim()) return true;
    const q = searchDashboardQuery.toLowerCase();
    return (
      loc.region.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      loc.taxIncentive.toLowerCase().includes(q) ||
      loc.vibeMatch.toLowerCase().includes(q)
    );
  });

  // Filter global location database for adding new location (Search Bar 2)
  const globalDatabaseResults = GLOBAL_LOCATION_DATABASE.filter((dbLoc) => {
    if (!newLocationQuery.trim()) return true;
    const q = newLocationQuery.toLowerCase();
    return (
      dbLoc.region.toLowerCase().includes(q) ||
      dbLoc.country.toLowerCase().includes(q) ||
      dbLoc.taxIncentive.toLowerCase().includes(q)
    );
  });

  const handleAddNewLocationFromDb = (dbLoc: LocationOption) => {
    if (onAddLocation) {
      onAddLocation({
        ...dbLoc,
        id: `loc-custom-${Date.now()}`,
        pinned: true,
      });
    }
    setNewLocationQuery("");
    setIsAddDropdownOpen(false);
  };

  const handleAddCustomUserLocation = () => {
    if (!newLocationQuery.trim()) return;
    const customName = newLocationQuery.trim();
    if (onAddLocation) {
      onAddLocation({
        id: `loc-user-${Date.now()}`,
        region: customName,
        country: "International Production Hub",
        permitEase: "Fast Track",
        climateWindow: "Year-Round",
        taxIncentive: "25-35% Production Incentive",
        vibeMatch: `Custom filming region evaluated for active screenplay themes.`,
        pinned: true,
        matchScore: 88,
      });
    }
    setNewLocationQuery("");
    setIsAddDropdownOpen(false);
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
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                actor.budgetImpact === "High"
                                  ? "bg-rose-100 text-rose-700"
                                  : actor.budgetImpact === "Low"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
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
              <p className="text-xs text-[#64748B]">Auto-scaling estimate based on shortlisted cast & project tier</p>
            </div>
          </div>

          <div className="bg-[#EBF3FC] px-4 py-2 rounded-xl border border-[#001b94]/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#001b94] block">Estimated Range</span>
            <span className="text-lg font-bold text-[#001b94]">
              {formatCurrency(totals.low)} – {formatCurrency(totals.high)}
            </span>
          </div>
        </div>

        {/* Live Cast Selection Impact Auto-Recalculation Banner */}
        <div className="p-4 bg-gradient-to-r from-[#001b94]/10 via-[#0F294D]/10 to-amber-500/10 rounded-xl border border-[#001b94]/20 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#001b94] font-semibold uppercase font-mono tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FF6F00]" /> Live Cast Budget Auto-Adjustment
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#001b94] text-white text-[10px] font-mono uppercase font-bold">
              {highImpactCount >= 1 ? "Studio Scale" : lowImpactCount >= 2 ? "Micro Scale" : "Indie Scale"}
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300">
            {highImpactCount >= 1 ? (
              <>
                Selecting A-list talent (<span className="font-semibold text-[#0F294D]">{shortlistedCast.filter((a) => a.impact === "High").map((a) => a.actorName).join(", ")}</span>) has auto-scaled your budget recommendation to <strong className="text-[#001b94]">Studio-Lite ($2M–$5M)</strong> with a <span className="font-semibold text-rose-600">+{formatCurrency(talentHighDelta)} talent allocation premium</span>.
              </>
            ) : lowImpactCount >= 2 ? (
              <>
                Selecting budget-friendly indie talent (<span className="font-semibold text-[#0F294D]">{shortlistedCast.filter((a) => a.impact === "Low").map((a) => a.actorName).join(", ")}</span>) has auto-scaled your budget recommendation to <strong className="text-emerald-700">Micro Budget (&lt;$500K)</strong>, saving approximately <span className="font-semibold text-emerald-600">{formatCurrency(Math.abs(talentHighDelta))}</span> in talent overhead.
              </>
            ) : (
              <>
                Selected cast shortlist (<span className="font-semibold text-[#0F294D]">{shortlistedCast.map((a) => `${a.actorName} (${a.impact})`).join(", ")}</span>) is balanced for an <strong className="text-[#001b94]">Indie Feature ($500K–$2M)</strong> budget scale.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {shortlistedCast.map((a) => (
              <span
                key={a.roleId}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                  a.impact === "High"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : a.impact === "Low"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" /> {a.actorName} ({a.impact} Impact)
              </span>
            ))}
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
                let values = budgetTier === "Micro" ? cat.micro : budgetTier === "Indie" ? cat.indie : cat.studio;
                let lowDisplay = values.low;
                let highDisplay = values.high;

                if (cat.category === "Talent & Cast") {
                  lowDisplay = Math.max(30, lowDisplay + talentLowDelta);
                  highDisplay = Math.max(60, highDisplay + talentHighDelta);
                }

                return (
                  <div key={cat.category} className="grid grid-cols-12 text-xs text-[#334155] font-medium py-1">
                    <span className="col-span-6 flex items-center gap-1.5">
                      {cat.category}
                      {cat.category === "Talent & Cast" && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#001b94]/10 text-[#001b94] font-semibold">
                          Cast Adjusted
                        </span>
                      )}
                    </span>
                    <span className="col-span-3 text-right text-[#0F294D]">${lowDisplay}K</span>
                    <span className="col-span-3 text-right text-[#0F294D]">${highDisplay}K</span>
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
              <p className="text-xs text-[#64748B]">Script-matched filming regions & tax rebate incentives</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#001b94] bg-[#EBF3FC] px-3 py-1.5 rounded-lg border border-[#001b94]/20">
            {pinnedLocationIds.length} location(s) pinned
          </span>
        </div>

        {/* 2 SEARCH BARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-border">
          {/* SEARCH BAR 1: Search Existing Dashboard Cards */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F294D] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#001b94]" /> 1. Search Dashboard Location Cards
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchDashboardQuery}
                onChange={(e) => setSearchDashboardQuery(e.target.value)}
                placeholder="Filter displayed cards by region, country, or tax credit..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001b94] font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchDashboardQuery && (
                <button
                  type="button"
                  onClick={() => setSearchDashboardQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* SEARCH BAR 2: Search & Add New Global Hub Location */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-[#0F294D] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FF6F00]" /> 2. Search & Add New Production Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={newLocationQuery}
                onChange={(e) => {
                  setNewLocationQuery(e.target.value);
                  setIsAddDropdownOpen(true);
                }}
                onFocus={() => setIsAddDropdownOpen(true)}
                placeholder="Type global hub (e.g. Wellington, Budapest, London, Iceland)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6F00] font-medium"
              />
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {newLocationQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setNewLocationQuery("");
                    setIsAddDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Global Hub Search Dropdown Results with Match Percentage */}
            {isAddDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-50 p-2 max-h-72 overflow-y-auto space-y-1 animate-fade-in">
                <div className="px-2 py-1 text-[10px] uppercase font-mono font-semibold text-muted-foreground flex items-center justify-between">
                  <span>Global Location Database</span>
                  <span>With Script Match Score %</span>
                </div>

                {globalDatabaseResults.map((dbLoc) => (
                  <div
                    key={dbLoc.id}
                    className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0F294D] truncate">{dbLoc.region}</span>
                        <span className="text-[10px] text-[#64748B]">({dbLoc.country})</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">{dbLoc.taxIncentive}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-[#001b94]/10 text-[#001b94] text-[10px] font-mono font-bold border border-[#001b94]/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF6F00]" /> {dbLoc.matchScore || 90}% Match
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddNewLocationFromDb(dbLoc)}
                        className="px-2.5 py-1 bg-[#001b94] hover:bg-[#001470] text-white text-[10px] font-semibold uppercase tracking-wider rounded-md flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Card
                      </button>
                    </div>
                  </div>
                ))}

                {/* Custom User Location Option */}
                {newLocationQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleAddCustomUserLocation}
                    className="w-full p-2.5 rounded-lg bg-[#FF6F00]/10 hover:bg-[#FF6F00]/20 text-[#FF6F00] border border-[#FF6F00]/30 text-left transition-colors flex items-center justify-between text-xs font-semibold"
                  >
                    <span className="truncate">
                      + Add Custom Region: "{newLocationQuery.trim()}"
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FF6F00] text-white text-[10px] font-mono font-bold flex-shrink-0 ml-2">
                      88% Calculated Match
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Location Cards Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredDashboardLocations.length === 0 ? (
            <div className="col-span-2 text-center py-8 bg-[#F8FAFC] rounded-xl border border-border space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-[#0F294D]">No location cards match "{searchDashboardQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchDashboardQuery("")}
                className="text-xs font-semibold text-[#001b94] hover:underline"
              >
                Clear dashboard search filter
              </button>
            </div>
          ) : (
            filteredDashboardLocations.map((loc) => {
              const isPinned = pinnedLocationIds.includes(loc.id);
              const score = loc.matchScore || 90;

              return (
                <div
                  key={loc.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 bg-card ${
                    isPinned ? "border-[#001b94] ring-2 ring-[#001b94]/20" : "border-border hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#0F294D] text-base">{loc.region}</h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#001b94]/10 text-[#001b94] border border-[#001b94]/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#FF6F00]" /> {score}% Match
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#64748B]">{loc.country}</p>
                      </div>

                      <span className="text-[11px] font-bold text-[#001b94] bg-[#EBF3FC] px-2.5 py-1 rounded-full border border-[#001b94]/20 flex-shrink-0">
                        {loc.taxIncentive}
                      </span>
                    </div>

                    <p className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-lg border border-border">
                      <span className="font-semibold text-[#0F294D]">Match Note:</span> {loc.vibeMatch}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium flex-wrap">
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
            })
          )}
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
