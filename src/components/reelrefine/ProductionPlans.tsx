import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Trash2,
  Edit3,
  Zap,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";

type ProductionSubTab = "budget" | "schedule" | "locations" | "casting";
import {
  CastRole,
  BudgetCategory,
  LocationOption,
  BUDGET_CATEGORIES,
  GLOBAL_LOCATION_DATABASE,
  AI_ACTOR_DATABASE,
  ActorSearchEntry,
  getAIBudgetSuggestions,
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
  activeSubTab?: ProductionSubTab;
  onSelectSubTab?: (tab: ProductionSubTab) => void;
}

// Custom budget overrides by category
interface BudgetOverride {
  category: string;
  low: number;
  high: number;
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
  activeSubTab: externalSubTab,
  onSelectSubTab,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<ProductionSubTab>("budget");
  const productionSubTab = externalSubTab || internalSubTab;

  const handleSubTabChange = (tab: ProductionSubTab) => {
    setInternalSubTab(tab);
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    }
  };
  const [sliderValue, setSliderValue] = useState(65);
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);
  const [showAltLocations, setShowAltLocations] = useState(false);

  // Search Bar 1: Search existing dashboard cards
  const [searchDashboardQuery, setSearchDashboardQuery] = useState("");

  // Search Bar 2: Search & Add new global hub location
  const [newLocationQuery, setNewLocationQuery] = useState("");
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  // Cast Search Modal State
  const [castModalOpen, setCastModalOpen] = useState(false);
  const [castModalRoleId, setCastModalRoleId] = useState<string | null>(null);
  const [castSearchQuery, setCastSearchQuery] = useState("");

  // Selected Role State for Card A Single Viewport
  const [selectedRoleId, setSelectedRoleId] = useState<string>(casting[0]?.id || "role-1");

  const activeRole = useMemo(() => {
    return casting.find((r) => r.id === selectedRoleId) || casting[0] || null;
  }, [casting, selectedRoleId]);

  // Budget Entry Modal State
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetOverrides, setBudgetOverrides] = useState<BudgetOverride[]>([]);
  const [tempBudgetEdits, setTempBudgetEdits] = useState<Record<string, { low: string; high: string }>>({});

  // Refs for modal overlay close
  const castModalRef = useRef<HTMLDivElement>(null);
  const budgetModalRef = useRef<HTMLDivElement>(null);

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

  // Calculate cast budget for auto-population
  const castBaseTier = budgetTier === "Micro"
    ? BUDGET_CATEGORIES.find((c) => c.category === "Talent & Cast")?.micro
    : budgetTier === "Indie"
    ? BUDGET_CATEGORIES.find((c) => c.category === "Talent & Cast")?.indie
    : BUDGET_CATEGORIES.find((c) => c.category === "Talent & Cast")?.studio;

  const castBudgetLow = Math.max(30, (castBaseTier?.low || 220) + talentLowDelta);
  const castBudgetHigh = Math.max(60, (castBaseTier?.high || 450) + talentHighDelta);

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

      // Apply cast budget adjustment
      if (cat.category === "Talent & Cast") {
        baseLow = castBudgetLow;
        baseHigh = castBudgetHigh;
      }

      // Apply user overrides if any
      const override = budgetOverrides.find((o) => o.category === cat.category);
      if (override) {
        baseLow = override.low;
        baseHigh = override.high;
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

  // AI Budget Suggestions
  const aiBudgetSuggestions = useMemo(
    () => getAIBudgetSuggestions(budgetTier, castBudgetLow, castBudgetHigh),
    [budgetTier, castBudgetLow, castBudgetHigh]
  );

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

  // Cast Search Modal — filter actors
  const castSearchResults = useMemo(() => {
    if (!castSearchQuery.trim()) return AI_ACTOR_DATABASE.slice(0, 8);
    const q = castSearchQuery.toLowerCase();
    return AI_ACTOR_DATABASE.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.knownFor.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q)
    );
  }, [castSearchQuery]);

  // Get AI suggested actor for a given role
  const getAISuggestedActor = (roleId: string): ActorSearchEntry | null => {
    const role = casting.find((r) => r.id === roleId);
    if (!role) return null;
    // Pick top fit score actor from database not already selected
    const currentlySelected = shortlistedActors[roleId] || role.selectedActor;
    const sorted = [...AI_ACTOR_DATABASE]
      .filter((a) => a.name !== currentlySelected)
      .sort((a, b) => b.fitScore - a.fitScore);
    return sorted[0] || null;
  };

  // Open cast modal for a specific role
  const handleOpenCastModal = (roleId: string) => {
    setCastModalRoleId(roleId);
    setCastSearchQuery("");
    setCastModalOpen(true);
  };

  // Select actor from modal
  const handleSelectActorFromModal = (actorName: string) => {
    if (castModalRoleId) {
      onToggleActorShortlist(castModalRoleId, actorName);
    }
    setCastModalOpen(false);
    setCastModalRoleId(null);
  };

  // Open budget modal
  const handleOpenBudgetModal = () => {
    // Pre-fill temp edits from current overrides or defaults
    const edits: Record<string, { low: string; high: string }> = {};
    BUDGET_CATEGORIES.forEach((cat) => {
      const override = budgetOverrides.find((o) => o.category === cat.category);
      const defaults = budgetTier === "Micro" ? cat.micro : budgetTier === "Indie" ? cat.indie : cat.studio;
      if (cat.category === "Talent & Cast") {
        edits[cat.category] = {
          low: String(castBudgetLow),
          high: String(castBudgetHigh),
        };
      } else {
        edits[cat.category] = {
          low: String(override?.low ?? defaults.low),
          high: String(override?.high ?? defaults.high),
        };
      }
    });
    setTempBudgetEdits(edits);
    setBudgetModalOpen(true);
  };

  // Save budget overrides from modal
  const handleSaveBudgetOverrides = () => {
    const newOverrides: BudgetOverride[] = [];
    Object.entries(tempBudgetEdits).forEach(([category, vals]) => {
      if (category === "Talent & Cast") return; // auto from cast
      const low = parseInt(vals.low) || 0;
      const high = parseInt(vals.high) || 0;
      newOverrides.push({ category, low, high });
    });
    setBudgetOverrides(newOverrides);
    setBudgetModalOpen(false);
  };

  // Apply AI suggestion to budget
  const handleApplyAISuggestion = (category: string, low: number, high: number) => {
    setTempBudgetEdits((prev) => ({
      ...prev,
      [category]: { low: String(low), high: String(high) },
    }));
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (castModalOpen && castModalRef.current && !castModalRef.current.contains(e.target as Node)) {
        setCastModalOpen(false);
      }
      if (budgetModalOpen && budgetModalRef.current && !budgetModalRef.current.contains(e.target as Node)) {
        setBudgetModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [castModalOpen, budgetModalOpen]);

  return (
    <div className="space-y-8 font-sans">
      {/* Step Header */}
      <div className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FF6F00]/10 text-[#FF6F00] border border-[#FF6F00]/20 mb-2">
            Production Planning
          </span>
          <h2 className="text-2xl font-normal font-display text-[#0F294D] dark:text-foreground">Production Planning</h2>
          <p className="text-xs text-[#64748B] dark:text-muted-foreground mt-0.5">
            Budget estimation, shooting schedule, location scouting, and casting & talent management.
          </p>
        </div>

        <div className="bg-[#EBF3FC] dark:bg-sky-950/60 px-4 py-2 rounded-xl border border-[#001b94]/20 dark:border-sky-800/60 text-right">
          <span className="text-xs font-semibold text-[#001b94] dark:text-sky-300 uppercase tracking-wider block">Estimated Total Budget</span>
          <span className="text-xl font-semibold text-[#001b94] dark:text-sky-300">
            {formatCurrency(totals.low)} – {formatCurrency(totals.high)}
          </span>
        </div>
      </div>

      {/* Production Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl p-1.5 overflow-x-auto">
        {([
          { id: "budget" as ProductionSubTab, label: "Budget Estimation", icon: DollarSign },
          { id: "schedule" as ProductionSubTab, label: "Shooting Schedule", icon: Calendar },
          { id: "locations" as ProductionSubTab, label: "Location Scout", icon: MapPin },
          { id: "casting" as ProductionSubTab, label: "Casting & Talent", icon: Users },
        ]).map((tab) => {
          const Icon = tab.icon;
          const isActive = productionSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSubTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#001b94] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#FF6F00]" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CASTING & TALENT SUB-TAB */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {productionSubTab === "casting" && <>
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] dark:bg-sky-950/60 border border-[#001b94]/20 dark:border-sky-800/60 flex items-center justify-center text-[#001b94] dark:text-sky-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal font-display text-[#0F294D] dark:text-foreground">Card A: Casting & Talent Shortlist</h3>
              <p className="text-xs text-[#64748B] dark:text-muted-foreground">Top roles auto-detected from scene analysis</p>
            </div>
          </div>

          {/* Interactive Star Power vs Budget Slider */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900/60 p-3 rounded-xl border border-border space-y-1.5 max-w-xs w-full">
            <div className="flex justify-between text-xs font-semibold text-[#0F294D] dark:text-foreground">
              <span className={sliderValue < 40 ? "text-[#001b94] dark:text-sky-400 font-semibold" : ""}>Budget-Friendly</span>
              <span className={sliderValue > 60 ? "text-[#001b94] dark:text-sky-400 font-semibold" : ""}>Star Power</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full accent-[#001b94] dark:accent-sky-400 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              aria-label="Star power versus budget friendly balance slider"
            />
            <p className="text-[11px] text-[#64748B] dark:text-muted-foreground text-center">
              Preference: <span className="font-semibold text-[#001b94] dark:text-sky-400">{sliderValue > 50 ? "High Commercial Appeal" : "Indie Realism"}</span>
            </p>
          </div>
        </div>

        {/* Role Selector Dropdown Bar placed just above Add Cast */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F8FAFC] dark:bg-slate-900/60 rounded-xl border border-border">
          <div className="flex-1 space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-[#0F294D] dark:text-foreground flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Users className="w-4 h-4 text-[#001b94] dark:text-sky-400" /> Select Script Character Role:
            </label>
            <div className="relative max-w-lg">
              <select
                value={activeRole?.id || ""}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-background border border-border rounded-xl text-xs sm:text-sm font-medium text-[#0F294D] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#001b94] dark:focus:ring-sky-400 cursor-pointer appearance-none shadow-sm truncate"
              >
                {casting.map((role) => {
                  const assigned = shortlistedActors[role.id] || role.selectedActor;
                  return (
                    <option key={role.id} value={role.id}>
                      {role.roleName} ({role.ageRange}) {assigned ? `• Assigned: ${assigned}` : "• Unassigned"}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* + Add Cast Button */}
          {activeRole && (
            <div className="flex items-center gap-2 self-start sm:self-end pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => handleOpenCastModal(activeRole.id)}
                className="px-4 py-2.5 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Cast
              </button>
            </div>
          )}
        </div>

        {/* Active Selected Role Details & Cards Viewport */}
        {activeRole && (() => {
          const currentSelected = shortlistedActors[activeRole.id] || activeRole.selectedActor;
          const aiSuggested = getAISuggestedActor(activeRole.id);

          return (
            <div className="space-y-4">
              {/* Active Role Meta Card */}
              <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900/50 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-[#0F294D] dark:text-foreground">{activeRole.roleName}</h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#001b94]/10 dark:bg-sky-500/20 text-[#001b94] dark:text-sky-300 border border-[#001b94]/20 dark:border-sky-800/50">
                      Role {casting.findIndex((r) => r.id === activeRole.id) + 1} of {casting.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-muted-foreground mt-0.5">
                    Age Range: <span className="font-medium text-[#0F294D] dark:text-foreground">{activeRole.ageRange}</span> • Vibe:{" "}
                    <span className="italic text-[#334155] dark:text-slate-300">{activeRole.vibe}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-3 py-1.5 rounded-lg border border-[#001b94]/20 dark:border-sky-800/60 block">
                    Shortlisted: <strong className="text-[#0F294D] dark:text-foreground ml-1">{currentSelected || "None Selected"}</strong>
                  </span>
                </div>
              </div>

              {/* Actor Suggestions Grid for Active Role */}
              <div className="grid md:grid-cols-3 gap-3 pt-1">
                {/* AI Suggested Cast Card */}
                {aiSuggested && (
                  <div className="p-4 rounded-xl border-2 border-[#FF6F00]/40 bg-gradient-to-br from-[#FF6F00]/5 via-amber-50/40 to-orange-50/30 dark:from-[#FF6F00]/10 dark:via-amber-950/30 dark:to-orange-950/20 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#FF6F00]/60 hover:shadow-lg">
                    <div className="absolute top-0 right-0 px-2.5 py-1 bg-gradient-to-r from-[#FF6F00] to-amber-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Pick
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6F00] to-amber-500 text-white font-semibold text-xs flex items-center justify-center shadow-md">
                          {aiSuggested.imageTag}
                        </span>
                        <span className="text-xs font-semibold text-[#FF6F00] bg-[#FF6F00]/10 px-2 py-0.5 rounded border border-[#FF6F00]/20 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#FF6F00] text-[#FF6F00]" /> {aiSuggested.fitScore}% Fit
                        </span>
                      </div>
                      <div>
                        <h5 className="font-medium text-[#0F294D] dark:text-foreground text-sm">{aiSuggested.name}</h5>
                        <p className="text-xs text-[#64748B] dark:text-muted-foreground line-clamp-1">{aiSuggested.knownFor}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Star Power: {aiSuggested.starPowerScore}%
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            aiSuggested.budgetImpact === "High"
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                              : aiSuggested.budgetImpact === "Low"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          Impact: {aiSuggested.budgetImpact}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleActorShortlist(activeRole.id, aiSuggested.name)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#FF6F00] to-amber-500 hover:from-[#e06200] hover:to-amber-600 text-white shadow-md hover:shadow-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Use AI Suggestion
                    </button>
                  </div>
                )}

                {/* Existing Actor Options for Active Role */}
                {activeRole.actorOptions.map((actor) => {
                  const isSelected = currentSelected === actor.name;
                  return (
                    <div
                      key={actor.name}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 bg-card ${
                        isSelected
                          ? "border-[#001b94] dark:border-sky-400 ring-2 ring-[#001b94]/20 dark:ring-sky-400/20"
                          : "border-border hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-full bg-[#001b94] dark:bg-sky-600 text-white font-semibold text-xs flex items-center justify-center">
                            {actor.imageTag}
                          </span>
                          <span className="text-xs font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-2 py-0.5 rounded border border-[#001b94]/20 dark:border-sky-800/60 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#FF6F00] text-[#FF6F00]" /> {actor.fitScore}% Fit
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-[#0F294D] dark:text-foreground text-sm">{actor.name}</h5>
                          <p className="text-xs text-[#64748B] dark:text-muted-foreground line-clamp-1">{actor.knownFor}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            Star Power: {actor.starPowerScore}%
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              actor.budgetImpact === "High"
                                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                                : actor.budgetImpact === "Low"
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                            }`}
                          >
                            Impact: {actor.budgetImpact}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleActorShortlist(activeRole.id, actor.name)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "bg-[#001b94] dark:bg-sky-600 text-white"
                            : "bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F294D] dark:text-slate-200"
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
        })()}

        {/* All Script Cast Quick Navigation Bar */}
        <div className="p-3 bg-[#F8FAFC] dark:bg-slate-900/40 rounded-xl border border-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-[#64748B] dark:text-muted-foreground font-mono uppercase text-[10px]">
            Script Roles ({casting.length}):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {casting.map((role) => {
              const assigned = shortlistedActors[role.id] || role.selectedActor;
              const isCurrent = role.id === activeRole?.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-[#001b94] dark:bg-sky-600 text-white shadow-sm font-semibold"
                      : "bg-background hover:bg-slate-200 dark:hover:bg-slate-800 text-[#0F294D] dark:text-foreground border border-border"
                  }`}
                >
                  <span>{role.roleName.split(" ")[0]}</span>
                  {assigned && (
                    <span className={`text-[10px] ${isCurrent ? "text-sky-200" : "text-[#001b94] dark:text-sky-400 font-semibold"}`}>
                      ({assigned})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CAST SEARCH MODAL (POPUP OVERLAY) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {castModalOpen && castModalRoleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            ref={castModalRef}
            className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col animate-scale-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border bg-gradient-to-r from-[#001b94]/5 to-[#FF6F00]/5 dark:from-sky-950/30 dark:to-amber-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#001b94] dark:bg-sky-600 text-white flex items-center justify-center">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F294D] dark:text-foreground">Search & Add Cast</h3>
                    <p className="text-xs text-[#64748B] dark:text-muted-foreground">
                      For: <span className="font-semibold text-[#001b94] dark:text-sky-300">{casting.find((r) => r.id === castModalRoleId)?.roleName}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCastModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mt-4">
                <input
                  type="text"
                  value={castSearchQuery}
                  onChange={(e) => setCastSearchQuery(e.target.value)}
                  placeholder="Search actors by name, known films, or genre..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001b94] dark:focus:ring-sky-400 font-medium text-foreground"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {castSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCastSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body — Results */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {/* AI Suggestion Card — Top of results */}
              {(() => {
                const aiPick = getAISuggestedActor(castModalRoleId);
                if (!aiPick) return null;
                return (
                  <div className="p-4 rounded-xl border-2 border-[#FF6F00]/40 bg-gradient-to-r from-[#FF6F00]/5 via-amber-50/30 to-orange-50/20 dark:from-[#FF6F00]/10 dark:via-amber-950/30 dark:to-orange-950/20 flex items-center justify-between gap-4 group hover:border-[#FF6F00]/60 transition-all">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6F00] to-amber-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                        {aiPick.imageTag}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-[#0F294D] dark:text-foreground text-sm truncate">{aiPick.name}</h5>
                          <span className="px-2 py-0.5 bg-gradient-to-r from-[#FF6F00] to-amber-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 flex-shrink-0">
                            <Sparkles className="w-3 h-3" /> AI Recommended
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-muted-foreground truncate">{aiPick.knownFor}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-1.5 py-0.5 rounded">
                            {aiPick.fitScore}% Fit
                          </span>
                          <span className="text-[10px] font-medium text-[#64748B] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            ★ {aiPick.starPowerScore}%
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            aiPick.budgetImpact === "High" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : aiPick.budgetImpact === "Low" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}>
                            {aiPick.budgetImpact} Impact
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectActorFromModal(aiPick.name)}
                      className="px-4 py-2 bg-gradient-to-r from-[#FF6F00] to-amber-500 hover:from-[#e06200] hover:to-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 flex-shrink-0 shadow-md hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Select
                    </button>
                  </div>
                );
              })()}

              {/* Search Result Actor Cards */}
              <div className="text-[10px] uppercase font-mono font-semibold text-muted-foreground px-1 pt-2">
                {castSearchQuery ? `${castSearchResults.length} result(s) for "${castSearchQuery}"` : "Popular actors"}
              </div>
              {castSearchResults.map((actor) => {
                const isAlreadySelected = Object.values(shortlistedActors).includes(actor.name);
                return (
                  <div
                    key={actor.name}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isAlreadySelected
                        ? "border-[#001b94]/30 dark:border-sky-400/30 bg-[#EBF3FC]/40 dark:bg-sky-950/20"
                        : "border-border hover:border-slate-300 dark:hover:border-slate-600 bg-card hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-9 h-9 rounded-full bg-[#001b94] dark:bg-sky-600 text-white font-semibold text-xs flex items-center justify-center flex-shrink-0">
                        {actor.imageTag}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-medium text-[#0F294D] dark:text-foreground text-sm truncate">{actor.name}</h5>
                        <p className="text-xs text-[#64748B] dark:text-muted-foreground truncate">{actor.knownFor}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-1.5 py-0.5 rounded">
                            {actor.fitScore}% Fit
                          </span>
                          <span className="text-[10px] font-medium text-[#64748B] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            ★ {actor.starPowerScore}%
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            actor.budgetImpact === "High" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : actor.budgetImpact === "Low" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}>
                            {actor.budgetImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectActorFromModal(actor.name)}
                      className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 flex-shrink-0 transition-all ${
                        isAlreadySelected
                          ? "bg-[#001b94] dark:bg-sky-600 text-white"
                          : "bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#001b94] dark:hover:bg-sky-600 hover:text-white text-[#0F294D] dark:text-slate-200"
                      }`}
                    >
                      {isAlreadySelected ? <><Check className="w-3.5 h-3.5" /> Selected</> : <><Plus className="w-3.5 h-3.5" /> Select</>}
                    </button>
                  </div>
                );
              })}

              {castSearchResults.length === 0 && (
                <div className="text-center py-8 text-sm text-[#64748B] dark:text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  No actors found matching "{castSearchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </>}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BUDGET ESTIMATION SUB-TAB */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {productionSubTab === "budget" && <>
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] dark:bg-sky-950/60 border border-[#001b94]/20 dark:border-sky-800/60 flex items-center justify-center text-[#001b94] dark:text-sky-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal font-display text-[#0F294D] dark:text-foreground">Card B: Production Budget Scale</h3>
              <p className="text-xs text-[#64748B] dark:text-muted-foreground">Auto-scaling estimate based on shortlisted cast & project tier</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* + Add Budget Item Button */}
            <button
              type="button"
              onClick={handleOpenBudgetModal}
              className="px-4 py-2 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Budget Item
            </button>

            <div className="bg-[#EBF3FC] dark:bg-sky-950/60 px-4 py-2 rounded-xl border border-[#001b94]/20 dark:border-sky-800/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#001b94] dark:text-sky-300 block">Estimated Range</span>
              <span className="text-lg font-bold text-[#001b94] dark:text-sky-300">
                {formatCurrency(totals.low)} – {formatCurrency(totals.high)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Cast Selection Impact Auto-Recalculation Banner */}
        <div className="p-4 bg-gradient-to-r from-[#001b94]/10 via-[#0F294D]/10 to-amber-500/10 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-amber-950/30 rounded-xl border border-[#001b94]/20 dark:border-sky-800/40 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#001b94] dark:text-sky-300 font-semibold uppercase font-mono tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FF6F00]" /> Live Cast Budget Auto-Adjustment
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#001b94] dark:bg-sky-600 text-white text-[10px] font-mono uppercase font-bold">
              {highImpactCount >= 1 ? "Studio Scale" : lowImpactCount >= 2 ? "Micro Scale" : "Indie Scale"}
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300">
            {highImpactCount >= 1 ? (
              <>
                Selecting A-list talent (<span className="font-semibold text-[#0F294D] dark:text-foreground">{shortlistedCast.filter((a) => a.impact === "High").map((a) => a.actorName).join(", ")}</span>) has auto-scaled your budget recommendation to <strong className="text-[#001b94] dark:text-sky-300">Studio-Lite ($2M–$5M)</strong> with a <span className="font-semibold text-rose-600 dark:text-rose-400">+{formatCurrency(talentHighDelta)} talent allocation premium</span>.
              </>
            ) : lowImpactCount >= 2 ? (
              <>
                Selecting budget-friendly indie talent (<span className="font-semibold text-[#0F294D] dark:text-foreground">{shortlistedCast.filter((a) => a.impact === "Low").map((a) => a.actorName).join(", ")}</span>) has auto-scaled your budget recommendation to <strong className="text-emerald-700 dark:text-emerald-400">Micro Budget (&lt;$500K)</strong>, saving approximately <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(Math.abs(talentHighDelta))}</span> in talent overhead.
              </>
            ) : (
              <>
                Selected cast shortlist (<span className="font-semibold text-[#0F294D] dark:text-foreground">{shortlistedCast.map((a) => `${a.actorName} (${a.impact})`).join(", ")}</span>) is balanced for an <strong className="text-[#001b94] dark:text-sky-300">Indie Feature ($500K–$2M)</strong> budget scale.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {shortlistedCast.map((a) => (
              <span
                key={a.roleId}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                  a.impact === "High"
                    ? "bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/50"
                    : a.impact === "Low"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50"
                    : "bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-900/50"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" /> {a.actorName} ({a.impact} Impact)
              </span>
            ))}
          </div>
        </div>

        {/* AI Budget Suggestion Card */}
        <div className="p-4 rounded-xl border-2 border-[#FF6F00]/30 bg-gradient-to-r from-[#FF6F00]/5 via-amber-50/30 to-orange-50/20 dark:from-[#FF6F00]/10 dark:via-amber-950/30 dark:to-orange-950/20 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6F00] to-amber-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0F294D] dark:text-foreground flex items-center gap-1.5">
                AI Budget Suggestion
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#FF6F00] to-amber-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                  {budgetTier} Tier
                </span>
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-muted-foreground">AI-recommended budget breakdown based on your cast & project scope</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {aiBudgetSuggestions.map((s) => (
              <div key={s.category} className="p-2.5 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-[#FF6F00]/10 dark:border-amber-800/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F294D] dark:text-foreground truncate">{s.category}</span>
                  {s.category === "Talent & Cast" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#001b94]/10 dark:bg-sky-500/20 text-[#001b94] dark:text-sky-300 rounded font-bold">AUTO</span>
                  )}
                </div>
                <div className="text-xs font-bold text-[#FF6F00]">
                  ${s.low}K – ${s.high}K
                </div>
                <p className="text-[10px] text-[#64748B] dark:text-muted-foreground line-clamp-2">{s.aiNote}</p>
              </div>
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
                    ? "border-[#001b94] dark:border-sky-400 ring-2 ring-[#001b94]/20 dark:ring-sky-400/20"
                    : "border-border hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#0F294D] dark:text-foreground text-sm">{tier.label}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? "border-[#001b94] dark:border-sky-400 bg-[#001b94] dark:bg-sky-500 text-white" : "border-slate-300 dark:border-slate-700"}`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#001b94] dark:text-sky-400 mb-1">{tier.range}</div>
                  <p className="text-xs text-[#64748B] dark:text-muted-foreground leading-snug">{tier.desc}</p>
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
            className="text-xs font-medium text-[#001b94] dark:text-sky-400 hover:underline flex items-center gap-1.5 focus:outline-none"
          >
            {showBudgetBreakdown ? <ChevronUp className="w-4 h-4 text-[#64748B] dark:text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-[#64748B] dark:text-muted-foreground" />}
            <span>{showBudgetBreakdown ? "Hide Line Item Breakdown" : "View Line Item Category Breakdown"}</span>
          </button>

          {showBudgetBreakdown && (
            <div className="mt-3 bg-[#F8FAFC] dark:bg-slate-900/60 p-4 rounded-xl border border-border space-y-2 animate-fade-in">
              <div className="grid grid-cols-12 text-xs font-semibold text-[#64748B] dark:text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                <span className="col-span-5">Category</span>
                <span className="col-span-2 text-right">Low Est.</span>
                <span className="col-span-2 text-right">High Est.</span>
                <span className="col-span-3 text-right">Source</span>
              </div>
              {BUDGET_CATEGORIES.map((cat) => {
                let values = budgetTier === "Micro" ? cat.micro : budgetTier === "Indie" ? cat.indie : cat.studio;
                let lowDisplay = values.low;
                let highDisplay = values.high;
                let source = "Default";

                if (cat.category === "Talent & Cast") {
                  lowDisplay = castBudgetLow;
                  highDisplay = castBudgetHigh;
                  source = "Cast Auto";
                }

                const override = budgetOverrides.find((o) => o.category === cat.category);
                if (override) {
                  lowDisplay = override.low;
                  highDisplay = override.high;
                  source = "Custom";
                }

                return (
                  <div key={cat.category} className="grid grid-cols-12 text-xs text-[#334155] dark:text-slate-300 font-medium py-1">
                    <span className="col-span-5 flex items-center gap-1.5">
                      {cat.category}
                      {cat.category === "Talent & Cast" && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#001b94]/10 dark:bg-sky-500/20 text-[#001b94] dark:text-sky-300 font-semibold">
                          Cast Adjusted
                        </span>
                      )}
                    </span>
                    <span className="col-span-2 text-right text-[#0F294D] dark:text-foreground">${lowDisplay}K</span>
                    <span className="col-span-2 text-right text-[#0F294D] dark:text-foreground">${highDisplay}K</span>
                    <span className={`col-span-3 text-right text-[10px] font-semibold ${
                      source === "Cast Auto" ? "text-[#001b94] dark:text-sky-300" 
                      : source === "Custom" ? "text-[#FF6F00]" 
                      : "text-[#64748B] dark:text-muted-foreground"
                    }`}>
                      {source}
                    </span>
                  </div>
                );
              })}

              {/* Totals row */}
              <div className="grid grid-cols-12 text-xs font-bold text-[#0F294D] dark:text-foreground py-2 border-t border-border mt-1">
                <span className="col-span-5">TOTAL</span>
                <span className="col-span-2 text-right text-[#001b94] dark:text-sky-300">{formatCurrency(totals.low)}</span>
                <span className="col-span-2 text-right text-[#001b94] dark:text-sky-300">{formatCurrency(totals.high)}</span>
                <span className="col-span-3"></span>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-[#64748B] dark:text-muted-foreground italic">
          Note: Illustrative ranges for preliminary development only; refine line items with your line producer.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BUDGET ENTRY MODAL (POPUP OVERLAY) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            ref={budgetModalRef}
            className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl mx-4 max-h-[85vh] overflow-hidden flex flex-col animate-scale-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border bg-gradient-to-r from-[#001b94]/5 to-emerald-500/5 dark:from-sky-950/30 dark:to-emerald-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#001b94] dark:bg-sky-600 text-white flex items-center justify-center">
                    <DollarSign className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F294D] dark:text-foreground">Add / Edit Budget Items</h3>
                    <p className="text-xs text-[#64748B] dark:text-muted-foreground">
                      Set custom budget values for each category. Tier: <span className="font-semibold text-[#001b94] dark:text-sky-300">{budgetTier}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body — Budget Fields */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* AI Suggestion Banner */}
              <div className="p-3 rounded-xl border border-[#FF6F00]/30 bg-gradient-to-r from-[#FF6F00]/5 to-amber-50/30 dark:from-[#FF6F00]/10 dark:to-amber-950/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6F00] to-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0F294D] dark:text-foreground">AI Budget Suggestions Available</p>
                  <p className="text-[11px] text-[#64748B] dark:text-muted-foreground">Click "Use AI" next to any category to auto-fill the AI-recommended range.</p>
                </div>
              </div>

              {/* Budget Category Fields */}
              {BUDGET_CATEGORIES.map((cat) => {
                const isCastRow = cat.category === "Talent & Cast";
                const aiSugg = aiBudgetSuggestions.find((s) => s.category === cat.category);
                const editVals = tempBudgetEdits[cat.category] || { low: "0", high: "0" };

                return (
                  <div
                    key={cat.category}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      isCastRow
                        ? "border-[#001b94]/20 dark:border-sky-800/40 bg-[#EBF3FC]/30 dark:bg-sky-950/20"
                        : "border-border bg-[#F8FAFC] dark:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#0F294D] dark:text-foreground">{cat.category}</h4>
                        {isCastRow && (
                          <span className="text-[9px] px-2 py-0.5 bg-[#001b94] dark:bg-sky-600 text-white rounded-full font-bold uppercase tracking-wider">
                            Auto from Cast
                          </span>
                        )}
                      </div>

                      {!isCastRow && aiSugg && (
                        <button
                          type="button"
                          onClick={() => handleApplyAISuggestion(cat.category, aiSugg.low, aiSugg.high)}
                          className="px-2.5 py-1 bg-gradient-to-r from-[#FF6F00] to-amber-500 hover:from-[#e06200] hover:to-amber-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" /> Use AI
                        </button>
                      )}
                    </div>

                    {aiSugg && (
                      <p className="text-[11px] text-[#64748B] dark:text-muted-foreground">{aiSugg.aiNote}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-muted-foreground">
                          Low Estimate ($K)
                        </label>
                        <input
                          type="number"
                          value={editVals.low}
                          onChange={(e) =>
                            setTempBudgetEdits((prev) => ({
                              ...prev,
                              [cat.category]: { ...prev[cat.category], low: e.target.value },
                            }))
                          }
                          disabled={isCastRow}
                          className={`w-full px-3 py-2 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 ${
                            isCastRow
                              ? "bg-[#EBF3FC] dark:bg-sky-950/40 border-[#001b94]/20 dark:border-sky-800/40 text-[#001b94] dark:text-sky-300 cursor-not-allowed"
                              : "bg-background border-border focus:ring-[#001b94] dark:focus:ring-sky-400 text-foreground"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-muted-foreground">
                          High Estimate ($K)
                        </label>
                        <input
                          type="number"
                          value={editVals.high}
                          onChange={(e) =>
                            setTempBudgetEdits((prev) => ({
                              ...prev,
                              [cat.category]: { ...prev[cat.category], high: e.target.value },
                            }))
                          }
                          disabled={isCastRow}
                          className={`w-full px-3 py-2 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 ${
                            isCastRow
                              ? "bg-[#EBF3FC] dark:bg-sky-950/40 border-[#001b94]/20 dark:border-sky-800/40 text-[#001b94] dark:text-sky-300 cursor-not-allowed"
                              : "bg-background border-border focus:ring-[#001b94] dark:focus:ring-sky-400 text-foreground"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-[#F8FAFC] dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setBudgetModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#64748B] dark:text-muted-foreground hover:text-[#0F294D] dark:hover:text-foreground border border-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBudgetOverrides}
                className="px-5 py-2 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-3.5 h-3.5" /> Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      </>}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SHOOTING SCHEDULE SUB-TAB */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {productionSubTab === "schedule" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] dark:bg-sky-950/60 border border-[#001b94]/20 dark:border-sky-800/60 flex items-center justify-center text-[#001b94] dark:text-sky-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-normal font-display text-[#0F294D] dark:text-foreground">Shooting Schedule</h3>
                <p className="text-xs text-[#64748B] dark:text-muted-foreground">AI-generated production timeline based on scene analysis</p>
              </div>
            </div>

            {/* Schedule Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#EBF3FC] dark:bg-sky-950/60 rounded-xl p-4 border border-[#001b94]/20 dark:border-sky-800/60 text-center">
                <div className="text-2xl font-display font-bold text-[#001b94] dark:text-sky-300">24</div>
                <div className="text-[10px] font-mono uppercase text-[#001b94] dark:text-sky-300">Estimated Shoot Days</div>
              </div>
              <div className="bg-[#EBF3FC] dark:bg-sky-950/60 rounded-xl p-4 border border-[#001b94]/20 dark:border-sky-800/60 text-center">
                <div className="text-2xl font-display font-bold text-[#001b94] dark:text-sky-300">4</div>
                <div className="text-[10px] font-mono uppercase text-[#001b94] dark:text-sky-300">Production Weeks</div>
              </div>
              <div className="bg-[#EBF3FC] dark:bg-sky-950/60 rounded-xl p-4 border border-[#001b94]/20 dark:border-sky-800/60 text-center">
                <div className="text-2xl font-display font-bold text-[#001b94] dark:text-sky-300">3</div>
                <div className="text-[10px] font-mono uppercase text-[#001b94] dark:text-sky-300">Location Units</div>
              </div>
            </div>

            {/* Weekly Schedule Blocks */}
            <div className="space-y-4">
              {[
                {
                  week: "Week 1 — Pre-Production & Stage Setup",
                  days: "Days 1–6",
                  scenes: ["INT. Mission Control — Briefing Room", "INT. Lab — Equipment Prep", "INT. Shuttle Cockpit — Static Shots"],
                  notes: "Stage construction, lighting setup, LED volume calibration. Rehearsals with principal cast.",
                  status: "Prep Phase",
                },
                {
                  week: "Week 2 — Interior Principal Photography",
                  days: "Days 7–12",
                  scenes: ["INT. Shuttle Cockpit — All Dialogue", "INT. Mission Control — Hayes Confrontation", "INT. Cargo Bay — Equipment Failure"],
                  notes: "Core interior scenes on LED volume stage. Night shoots for cockpit sequences.",
                  status: "Active Shoot",
                },
                {
                  week: "Week 3 — Exterior & VFX Plates",
                  days: "Days 13–18",
                  scenes: ["EXT. Lunar Surface — Launch Pad", "EXT. Solar Storm Approach", "VFX Plate: Solar Eye Sequence"],
                  notes: "Exterior lunar surface on stage. VFX reference plates and motion capture for solar sequences.",
                  status: "Active Shoot",
                },
                {
                  week: "Week 4 — Pick-ups & Wrap",
                  days: "Days 19–24",
                  scenes: ["Pick-up shots for all locations", "Additional VFX reference plates", "Cast and crew wrap"],
                  notes: "Final pick-ups, B-roll, and production wrap. Begin post-production handoff.",
                  status: "Wrap Phase",
                },
              ].map((week, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#0F294D] dark:text-foreground">{week.week}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#001b94]/10 text-[#001b94] dark:bg-sky-900/30 dark:text-sky-400">{week.days}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        week.status === "Active Shoot" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        week.status === "Prep Phase" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}>{week.status}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {week.scenes.map((scene, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-foreground">
                        <Clock className="h-3 w-3 text-[#FF6F00] flex-shrink-0" />
                        <span>{scene}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#64748B] dark:text-muted-foreground leading-relaxed border-t border-border pt-2">{week.notes}</p>
                </div>
              ))}
            </div>

            {/* AI Notes */}
            <div className="p-4 rounded-xl border-2 border-[#FF6F00]/30 bg-gradient-to-r from-[#FF6F00]/5 via-amber-50/30 to-orange-50/20 dark:from-[#FF6F00]/10 dark:via-amber-950/30 dark:to-orange-950/20 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FF6F00]" />
                <span className="text-xs font-semibold text-[#0F294D] dark:text-foreground">AI Schedule Notes</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-muted-foreground leading-relaxed">
                Schedule is optimized for LED volume stage availability. Week 3 exterior shoots are weather-dependent — backup interior scenes are available. Night shoot premium applies to 40% of scheduled days. Consider 2nd unit for VFX plate capture to parallel principal photography.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LOCATION SCOUT SUB-TAB */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {productionSubTab === "locations" && <>
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] dark:bg-sky-950/60 border border-[#001b94]/20 dark:border-sky-800/60 flex items-center justify-center text-[#001b94] dark:text-sky-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal font-display text-[#0F294D] dark:text-foreground">Card C: Matching Production Hubs & Locations</h3>
              <p className="text-xs text-[#64748B] dark:text-muted-foreground">Script-matched filming regions & tax rebate incentives</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-3 py-1.5 rounded-lg border border-[#001b94]/20 dark:border-sky-800/60">
            {pinnedLocationIds.length} location(s) pinned
          </span>
        </div>

        {/* 2 SEARCH BARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] dark:bg-slate-900/60 p-4 rounded-xl border border-border">
          {/* SEARCH BAR 1: Search Existing Dashboard Cards */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F294D] dark:text-foreground flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#001b94] dark:text-sky-400" /> 1. Search Dashboard Location Cards
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchDashboardQuery}
                onChange={(e) => setSearchDashboardQuery(e.target.value)}
                placeholder="Filter displayed cards by region, country, or tax credit..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001b94] dark:focus:ring-sky-400 font-medium text-foreground"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchDashboardQuery && (
                <button
                  type="button"
                  onClick={() => setSearchDashboardQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* SEARCH BAR 2: Search & Add New Global Hub Location */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-[#0F294D] dark:text-foreground flex items-center gap-1.5">
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
                className="w-full pl-9 pr-8 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6F00] font-medium text-foreground"
              />
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {newLocationQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setNewLocationQuery("");
                    setIsAddDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                        <span className="font-semibold text-[#0F294D] dark:text-foreground truncate">{dbLoc.region}</span>
                        <span className="text-[10px] text-[#64748B] dark:text-muted-foreground">({dbLoc.country})</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-muted-foreground truncate">{dbLoc.taxIncentive}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-[#001b94]/10 dark:bg-sky-500/20 text-[#001b94] dark:text-sky-300 text-[10px] font-mono font-bold border border-[#001b94]/20 dark:border-sky-800/50 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF6F00]" /> {dbLoc.matchScore || 90}% Match
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddNewLocationFromDb(dbLoc)}
                        className="px-2.5 py-1 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md flex items-center gap-1 transition-colors"
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
            <div className="col-span-2 text-center py-8 bg-[#F8FAFC] dark:bg-slate-900/60 rounded-xl border border-border space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-[#0F294D] dark:text-foreground">No location cards match "{searchDashboardQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchDashboardQuery("")}
                className="text-xs font-semibold text-[#001b94] dark:text-sky-400 hover:underline"
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
                    isPinned
                      ? "border-[#001b94] dark:border-sky-400 ring-2 ring-[#001b94]/20 dark:ring-sky-400/20"
                      : "border-border hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#0F294D] dark:text-foreground text-base">{loc.region}</h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#001b94]/10 dark:bg-sky-500/20 text-[#001b94] dark:text-sky-300 border border-[#001b94]/20 dark:border-sky-800/50 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#FF6F00]" /> {score}% Match
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#64748B] dark:text-muted-foreground">{loc.country}</p>
                      </div>

                      <span className="text-[11px] font-bold text-[#001b94] dark:text-sky-300 bg-[#EBF3FC] dark:bg-sky-950/60 px-2.5 py-1 rounded-full border border-[#001b94]/20 dark:border-sky-800/60 flex-shrink-0">
                        {loc.taxIncentive}
                      </span>
                    </div>

                    <p className="text-xs text-[#334155] dark:text-slate-300 leading-relaxed bg-[#F8FAFC] dark:bg-slate-900/80 p-2.5 rounded-lg border border-border">
                      <span className="font-semibold text-[#0F294D] dark:text-foreground">Match Note:</span> {loc.vibeMatch}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] dark:text-slate-300 font-medium flex-wrap">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Permits: {loc.permitEase}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Window: {loc.climateWindow}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleLocationPin(loc.id)}
                    className={`w-full py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      isPinned
                        ? "bg-[#001b94] dark:bg-sky-600 text-white"
                        : "bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F294D] dark:text-slate-200"
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
            className="text-xs font-medium text-[#001b94] dark:text-sky-400 hover:underline inline-flex items-center gap-1"
          >
            {showAltLocations ? "Hide alternate regions" : "See alternate international filming hubs"}
          </button>
          {showAltLocations && (
            <p className="text-xs text-[#64748B] dark:text-muted-foreground mt-2 bg-[#F8FAFC] dark:bg-slate-900/60 p-3 rounded-lg border border-border">
              Additional options: Wellington (New Zealand), Budapest (Hungary), and Melbourne (Australia) are available on request.
            </p>
          )}
        </div>
      </div>

      </>}

      {/* Actions (Max 3 visible: Back, Generate Summary) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 text-[#0F294D] dark:text-foreground hover:text-[#001b94] dark:hover:text-sky-300 font-medium text-xs rounded-lg border border-border hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Script Fixes
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#001b94]"
        >
          Generate Summary & Export <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
