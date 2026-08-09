import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  DollarSign,
  Tv,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { ProjectOption } from "./reelRefineData";

interface MarketViabilityProps {
  currentProject: ProjectOption;
  onNext: () => void;
  onBack: () => void;
}

function getMarketData(project: ProjectOption) {
  const dataMap: Record<string, ReturnType<typeof defaultMarketData>> = {
    "proj-1": {
      commercialScore: 72,
      commercialVerdict: "Moderate-to-Strong commercial potential. Sci-fi adventure with universal survival themes appeals to global audiences. Requires targeted marketing to avoid comparison fatigue with existing space thrillers.",
      collisionRisks: [
        { title: "SpaceBound: Reentry (Universal)", window: "Q2 2025", genre: "Sci-Fi Action", threat: "Medium", notes: "Similar orbital survival premise; differentiate through character-driven focus." },
        { title: "Solar Winds (A24)", window: "Q3 2025", genre: "Sci-Fi Drama", threat: "Low", notes: "Art-house positioning reduces direct audience overlap." },
      ],
      ottFit: [
        { platform: "Netflix", score: 82, reasoning: "Strong international appeal; sci-fi is a top-performing genre on the platform." },
        { platform: "Amazon Prime", score: 76, reasoning: "Fits Prime's appetite for mid-budget sci-fi originals." },
        { platform: "Disney+", score: 58, reasoning: "Lacks family-friendly elements; better suited for Star/Hulu banner." },
        { platform: "Apple TV+", score: 88, reasoning: "Premium visual spectacle aligns with Apple's prestige content strategy." },
      ],
      comparables: [
        { title: "Gravity (2013)", budget: "$100M", boxOffice: "$723M", roi: "623%", relevance: "Orbital survival thriller benchmark" },
        { title: "The Martian (2015)", budget: "$108M", boxOffice: "$630M", roi: "483%", relevance: "Scientist-protagonist space survival" },
        { title: "Interstellar (2014)", budget: "$165M", boxOffice: "$677M", roi: "310%", relevance: "Science-driven epic with emotional core" },
      ],
      genreTrend: "Rising",
      genreTrendNote: "Sci-fi adventure has seen a 22% increase in global box office share over the past 3 years. OTT platforms are actively acquiring.",
      demographics: [
        { segment: "M 18-34", percentage: 35 },
        { segment: "F 18-34", percentage: 22 },
        { segment: "M 35-49", percentage: 20 },
        { segment: "F 35-49", percentage: 12 },
        { segment: "50+", percentage: 11 },
      ],
    },
    "proj-2": {
      commercialScore: 78,
      commercialVerdict: "Strong commercial viability. Cyberpunk aesthetic with mystery elements has proven franchise potential. Studio-tier production quality required but ROI projections are favorable across theatrical and OTT windows.",
      collisionRisks: [
        { title: "Neon Abyss (Paramount)", window: "Q4 2025", genre: "Cyberpunk Action", threat: "High", notes: "Direct genre competitor with major star attachment. Consider schedule differentiation." },
        { title: "Memory Lapse (Netflix)", window: "Q1 2026", genre: "Sci-Fi Thriller", threat: "Medium", notes: "Similar memory-theft concept but different tone." },
      ],
      ottFit: [
        { platform: "Netflix", score: 90, reasoning: "Cyberpunk and mystery genres perform exceptionally well; series spinoff potential." },
        { platform: "Amazon Prime", score: 72, reasoning: "Fits prestige genre content but requires significant VFX investment." },
        { platform: "HBO Max", score: 85, reasoning: "Mature themes align well with HBO's brand. Strong limited series potential." },
        { platform: "Apple TV+", score: 78, reasoning: "Visual spectacle fits Apple's premium slate." },
      ],
      comparables: [
        { title: "Blade Runner 2049 (2017)", budget: "$150M", boxOffice: "$259M", roi: "73%", relevance: "Cyberpunk detective noir benchmark" },
        { title: "Ghost in the Shell (2017)", budget: "$110M", boxOffice: "$169M", roi: "54%", relevance: "Anime-inspired cyberpunk" },
        { title: "Alita: Battle Angel (2019)", budget: "$170M", boxOffice: "$405M", roi: "138%", relevance: "Visual cyberpunk with strong int'l numbers" },
      ],
      genreTrend: "Stable-Rising",
      genreTrendNote: "Cyberpunk is experiencing a cultural renaissance driven by gaming (Cyberpunk 2077) and anime. OTT demand for the genre is up 35%.",
      demographics: [
        { segment: "M 18-34", percentage: 40 },
        { segment: "F 18-34", percentage: 18 },
        { segment: "M 35-49", percentage: 22 },
        { segment: "F 35-49", percentage: 10 },
        { segment: "50+", percentage: 10 },
      ],
    },
    "proj-3": {
      commercialScore: 58,
      commercialVerdict: "Niche but prestige-viable. Period noir with jazz elements appeals strongly to awards-circuit audiences. Limited theatrical potential but strong OTT and festival appeal.",
      collisionRisks: [
        { title: "Harlem Blues (Searchlight)", window: "Awards Season 2025", genre: "Period Drama", threat: "Low", notes: "Different era and setting; complementary rather than competitive." },
      ],
      ottFit: [
        { platform: "Netflix", score: 65, reasoning: "Period dramas have moderate performance; strong awards potential helps visibility." },
        { platform: "Amazon Prime", score: 72, reasoning: "Fits Prime's prestige content strategy; potential awards play." },
        { platform: "Apple TV+", score: 80, reasoning: "High-quality period content aligns with Apple's brand positioning." },
        { platform: "MUBI/Criterion", score: 92, reasoning: "Perfect fit for curated cinema platforms." },
      ],
      comparables: [
        { title: "L.A. Confidential (1997)", budget: "$35M", boxOffice: "$126M", roi: "260%", relevance: "Period noir crime benchmark" },
        { title: "Green Book (2018)", budget: "$23M", boxOffice: "$321M", roi: "1296%", relevance: "Period drama with music elements" },
        { title: "Ma Rainey's Black Bottom (2020)", budget: "$20M", boxOffice: "N/A (Netflix)", roi: "N/A", relevance: "Jazz-era period drama; streaming success" },
      ],
      genreTrend: "Stable",
      genreTrendNote: "Period noir is a stable niche genre. Limited theatrical ceiling but consistent demand on prestige streaming platforms and festival circuits.",
      demographics: [
        { segment: "M 18-34", percentage: 15 },
        { segment: "F 18-34", percentage: 12 },
        { segment: "M 35-49", percentage: 25 },
        { segment: "F 35-49", percentage: 22 },
        { segment: "50+", percentage: 26 },
      ],
    },
    "proj-4": {
      commercialScore: 75,
      commercialVerdict: "Strong theatrical potential. Underwater sci-fi thriller combines proven survival elements with cosmic horror intrigue. The claustrophobic submarine setting provides natural tension that resonates with global audiences.",
      collisionRisks: [
        { title: "Depth Charge (Lionsgate)", window: "Summer 2025", genre: "Underwater Action", threat: "Medium", notes: "Action-focused underwater film; different tone but similar setting." },
        { title: "The Trench (Warner Bros.)", window: "Q4 2025", genre: "Sci-Fi Horror", threat: "Low", notes: "Horror-focused vs. discovery-focused; different target demographics." },
      ],
      ottFit: [
        { platform: "Netflix", score: 84, reasoning: "Sci-fi thrillers consistently rank in top 10; strong binge potential." },
        { platform: "Amazon Prime", score: 78, reasoning: "Underwater production value aligns with Prime's big-budget originals." },
        { platform: "Hulu", score: 70, reasoning: "Fits thriller/horror crossover audience." },
        { platform: "Apple TV+", score: 82, reasoning: "Spectacular underwater visuals fit Apple's premium aesthetic." },
      ],
      comparables: [
        { title: "The Abyss (1989)", budget: "$70M", boxOffice: "$90M", roi: "29%", relevance: "Underwater sci-fi discovery benchmark" },
        { title: "Underwater (2020)", budget: "$80M", boxOffice: "$41M", roi: "-49%", relevance: "Recent underwater thriller; marketing cautionary tale" },
        { title: "Arrival (2016)", budget: "$47M", boxOffice: "$203M", roi: "332%", relevance: "Sci-fi discovery with strong emotional core" },
      ],
      genreTrend: "Rising",
      genreTrendNote: "Deep-sea exploration is an emerging trend driven by real-world oceanic discoveries and James Cameron's renewed focus on the genre.",
      demographics: [
        { segment: "M 18-34", percentage: 30 },
        { segment: "F 18-34", percentage: 20 },
        { segment: "M 35-49", percentage: 22 },
        { segment: "F 35-49", percentage: 15 },
        { segment: "50+", percentage: 13 },
      ],
    },
  };

  return dataMap[project.id] || defaultMarketData();
}

function defaultMarketData() {
  return {
    commercialScore: 65,
    commercialVerdict: "Moderate commercial potential. Further market analysis recommended.",
    collisionRisks: [] as { title: string; window: string; genre: string; threat: string; notes: string }[],
    ottFit: [
      { platform: "Netflix", score: 70, reasoning: "General audience appeal." },
      { platform: "Amazon Prime", score: 68, reasoning: "Standard genre fit." },
    ],
    comparables: [] as { title: string; budget: string; boxOffice: string; roi: string; relevance: string }[],
    genreTrend: "Stable" as string,
    genreTrendNote: "Genre is performing at market average.",
    demographics: [
      { segment: "M 18-34", percentage: 30 },
      { segment: "F 18-34", percentage: 20 },
      { segment: "M 35-49", percentage: 20 },
      { segment: "F 35-49", percentage: 15 },
      { segment: "50+", percentage: 15 },
    ],
  };
}

export const MarketViability: React.FC<MarketViabilityProps> = ({
  currentProject,
  onNext,
  onBack,
}) => {
  const data = getMarketData(currentProject);
  const [showCollision, setShowCollision] = useState(true);
  const [showComps, setShowComps] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [demographicView, setDemographicView] = useState<"bar" | "pie">("bar");
  const [activeDemoIndex, setActiveDemoIndex] = useState<number | null>(null);
  const [ottView, setOttView] = useState<"pie" | "bar">("pie");

  const DEMO_COLORS = ["#001b94", "#2563eb", "#6366f1", "#8b5cf6", "#ff6f00"];

  const demographicPieData = data.demographics.map((dem, idx) => ({
    ...dem,
    color: DEMO_COLORS[idx % DEMO_COLORS.length],
  }));

  const PLATFORM_COLORS: Record<string, string> = {
    Netflix: "#E50914",
    "Amazon Prime": "#00A8E1",
    "HBO Max": "#8020E0",
    "Apple TV+": "#10B981",
    "Disney+": "#113CCF",
    Hulu: "#00ED82",
    "MUBI/Criterion": "#FF6F00",
  };

  // Calculate normalized shares out of 100%
  const rawSum = data.ottFit.reduce((acc, curr) => acc + curr.score, 0);
  let normalizedData = data.ottFit.map((ott) => {
    const rawShare = Math.round((ott.score / (rawSum || 1)) * 100);
    return {
      name: ott.platform,
      score: ott.score,
      share: rawShare,
      reasoning: ott.reasoning,
      color: PLATFORM_COLORS[ott.platform] || "#001b94",
    };
  });

  // Ensure total share sums to exactly 100%
  const currentShareSum = normalizedData.reduce((acc, curr) => acc + curr.share, 0);
  const diffShare = 100 - currentShareSum;
  if (diffShare !== 0 && normalizedData.length > 0) {
    normalizedData[0].share += diffShare;
  }

  const pieData = normalizedData;
  const avgScore = Math.round(rawSum / (data.ottFit.length || 1));
  const topOtt = [...pieData].sort((a, b) => b.share - a.share)[0] || pieData[0];

  const threatColor = (t: string) => {
    if (t === "High") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (t === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground tracking-tight">
              Market Viability
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Commercial analysis for <span className="font-semibold text-foreground">"{currentProject.title}"</span> — success prediction, collision & OTT fit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" /> AI Rewrites
          </button>
          <button onClick={onNext} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#001b94] text-white hover:bg-[#001070] transition-colors flex items-center gap-1.5 cursor-pointer">
            Scene Breakdowns <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Left Card = AI Market Verdict | Right Card = OTT Platform Share Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: AI Market Verdict (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F294D] via-[#001b94] to-[#1E3A8A] rounded-2xl p-6 text-white border border-white/10 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FF6F00]" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-300">
                  AI Market Verdict
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold border border-white/20">
                Commercial Score
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <div className="text-6xl font-display font-extrabold tracking-tight text-white">
                {data.commercialScore}
              </div>
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Commercial Score
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {data.commercialScore >= 75 ? "High Commercial Viability" : "Moderate Viability"}
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-normal pt-1">
              {data.commercialVerdict}
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 space-y-2">
            <div className="text-[10px] font-mono uppercase font-bold text-amber-300 tracking-wider">
              Genre Trend & Market Pulse
            </div>
            <div className="flex items-center justify-between text-xs bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="font-semibold text-white">{data.genreTrend} Trend</span>
              <span className="text-emerald-300 font-mono font-bold">Strong OTT Demand</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {data.genreTrendNote}
            </p>
          </div>
        </div>

        {/* Right Card: OTT Platform Share & Fit Scores (Pie Chart out of 100%) (7 Cols) */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF6F00]/10 text-[#FF6F00] flex items-center justify-center font-bold">
                <Tv className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 flex-wrap">
                  OTT Platform Market Share
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                    100% Total Share
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Distribution of streaming platform share out of 100% based on audience fit
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-border">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6F00]" />
                <span>Top: <strong className="text-[#001b94] dark:text-sky-300">{topOtt.name} ({topOtt.share}%)</strong></span>
              </div>

              {/* Switching Button: Pie vs Bar Graph */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setOttView("pie")}
                  title="Pie Chart View"
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    ottView === "pie"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PieChartIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Pie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOttView("bar")}
                  title="Bar Graph View"
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    ottView === "bar"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bar</span>
                </button>
              </div>
            </div>
          </div>

          {ottView === "pie" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Column: Donut Pie Chart (5 Cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[220px] bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                <div className="w-full h-56 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={82}
                        paddingAngle={4}
                        dataKey="share"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="currentColor"
                            strokeWidth={activeIndex === index ? 3 : 1}
                            className="transition-all duration-300 cursor-pointer hover:opacity-90"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-display font-bold text-[#001b94] dark:text-sky-300">
                      {activeIndex !== null ? `${pieData[activeIndex].score}%` : `${avgScore}%`}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono uppercase font-semibold tracking-wider">
                      {activeIndex !== null ? pieData[activeIndex].name : "Avg Fit Index"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Platform Cards (7 Cols) */}
              <div className="md:col-span-7 grid grid-cols-1 gap-2">
                {pieData.map((ott, idx) => {
                  const isHovered = activeIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer space-y-1 ${
                        isHovered
                          ? "bg-slate-100 dark:bg-slate-800/90 border-[#001b94] dark:border-sky-400 shadow-sm scale-[1.01]"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs"
                            style={{ backgroundColor: ott.color }}
                          />
                          <h4 className="text-xs font-bold text-foreground">{ott.name}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-display font-bold text-[#001b94] dark:text-sky-300 bg-[#001b94]/10 dark:bg-sky-500/20 px-2 py-0.5 rounded-md font-mono">
                            {ott.share}%
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono font-semibold">
                            ({ott.score}% Fit)
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-1">
                        {ott.reasoning}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-1">
              {pieData.map((ott, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ott.color }} />
                      <h4 className="text-xs font-bold text-foreground">{ott.name}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#001b94] dark:text-sky-300">
                        {ott.share}% Share
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60">
                        {ott.score}% Fit
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar for Share */}
                  <div className="space-y-1">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${ott.share}%`, backgroundColor: ott.color }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {ott.reasoning}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collision Analysis */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <button onClick={() => setShowCollision(!showCollision)} className="flex items-center justify-between w-full cursor-pointer">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Collision Analysis</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {data.collisionRisks.length} competing titles
            </span>
          </div>
          {showCollision ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {showCollision && data.collisionRisks.length > 0 && (
          <div className="space-y-3">
            {data.collisionRisks.map((risk, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-foreground">{risk.title}</h4>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${threatColor(risk.threat)}`}>
                      {risk.threat} Threat
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{risk.window}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#001b94]/10 text-[#001b94] dark:bg-sky-900/30 dark:text-sky-400">
                    {risk.genre}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{risk.notes}</p>
              </div>
            ))}
          </div>
        )}

        {showCollision && data.collisionRisks.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No significant collision risks detected in the current release window.</p>
          </div>
        )}
      </div>

      {/* Comparables Table + Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Comparables */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border p-5 space-y-4">
          <button onClick={() => setShowComps(!showComps)} className="flex items-center justify-between w-full cursor-pointer">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Comparable Titles</h3>
            </div>
            {showComps ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {showComps && data.comparables.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Title</th>
                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Budget</th>
                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Box Office</th>
                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground">ROI</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground hidden md:table-cell">Relevance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparables.map((comp, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-2 font-semibold text-foreground">{comp.title}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">{comp.budget}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-foreground font-semibold">{comp.boxOffice}</td>
                      <td className={`py-2.5 px-2 text-right font-mono font-semibold ${
                        comp.roi.startsWith("-") ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
                      }`}>{comp.roi}</td>
                      <td className="py-2.5 px-2 text-muted-foreground hidden md:table-cell">{comp.relevance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Target Demographics */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Target Demographics</h3>
            </div>

            {/* Switching Button: Bar vs Pie Chart */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setDemographicView("bar")}
                title="Bar Graph View"
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  demographicView === "bar"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Bar</span>
              </button>
              <button
                type="button"
                onClick={() => setDemographicView("pie")}
                title="Pie Chart View"
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  demographicView === "pie"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <PieChartIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pie</span>
              </button>
            </div>
          </div>

          {demographicView === "bar" ? (
            <div className="space-y-2.5">
              {data.demographics.map((dem, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{dem.segment}</span>
                    <span className="font-mono font-semibold text-foreground">{dem.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#001b94] dark:bg-sky-500 transition-all duration-700"
                      style={{ width: `${dem.percentage * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 py-1">
              <div className="w-full h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="percentage"
                      nameKey="segment"
                      onMouseEnter={(_, index) => setActiveDemoIndex(index)}
                      onMouseLeave={() => setActiveDemoIndex(null)}
                    >
                      {demographicPieData.map((entry, index) => (
                        <Cell
                          key={`demo-cell-${index}`}
                          fill={entry.color}
                          stroke="currentColor"
                          strokeWidth={activeDemoIndex === index ? 2 : 1}
                          className="transition-all duration-300 cursor-pointer hover:opacity-90"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-popover/95 backdrop-blur-md border border-border p-2 rounded-lg shadow-md text-xs font-sans">
                              <p className="font-semibold text-foreground">{item.segment}</p>
                              <p className="font-mono text-[#001b94] dark:text-sky-400 font-bold">{item.percentage}% of audience</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Grid below pie chart */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 w-full text-[11px] pt-1 border-t border-border/50">
                {demographicPieData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-1 rounded-md transition-colors ${
                      activeDemoIndex === idx ? "bg-slate-100 dark:bg-slate-800" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-300 truncate font-medium">{item.segment}</span>
                    </div>
                    <span className="font-mono font-semibold text-foreground ml-1">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Genre Trend */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Genre Trend</h3>
          </div>
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
            data.genreTrend.includes("Rising") ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
            "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}>
            {data.genreTrend}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{data.genreTrendNote}</p>
      </div>
    </div>
  );
};
