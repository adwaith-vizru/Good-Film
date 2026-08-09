import React, { useState } from "react";
import {
  PieChart,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ProjectOption } from "./reelRefineData";

interface InvestmentIntelligenceProps {
  currentProject: ProjectOption;
  onNext: () => void;
  onBack: () => void;
}

function getInvestmentData(project: ProjectOption) {
  const dataMap: Record<string, ReturnType<typeof defaultInvestmentData>> = {
    "proj-1": {
      readinessScore: 74,
      readinessLabel: "Investment Ready — Moderate Confidence",
      roiProjections: [
        { channel: "Domestic Theatrical", conservative: "1.8x", moderate: "2.6x", optimistic: "4.2x" },
        { channel: "International Theatrical", conservative: "1.2x", moderate: "2.1x", optimistic: "3.5x" },
        { channel: "SVOD License (Netflix/Apple)", conservative: "2.0x", moderate: "3.0x", optimistic: "4.0x" },
        { channel: "TVOD + Home Video", conservative: "0.8x", moderate: "1.2x", optimistic: "1.8x" },
      ],
      marketComps: [
        { title: "Gravity (2013)", budget: "$100M", revenue: "$723M", multiplier: "7.2x", notes: "Orbital survival benchmark; strong female lead drove broad demo." },
        { title: "The Martian (2015)", budget: "$108M", revenue: "$630M", multiplier: "5.8x", notes: "Scientist protagonist; humor + tension balance." },
        { title: "Moon (2009)", budget: "$5M", revenue: "$10M", multiplier: "2.0x", notes: "Micro-budget sci-fi reference; critical darling, limited commercial." },
      ],
      riskFactors: [
        { factor: "VFX Dependency", severity: "Medium", notes: "Solar storm sequences require significant post-production investment. LED volume can reduce on-set costs." },
        { factor: "Genre Saturation", severity: "Low", notes: "Space thriller market has capacity; differentiated character-driven approach reduces saturation risk." },
        { factor: "Cast Attachment", severity: "Medium", notes: "No star attachment yet. A-list talent would significantly improve pre-sales potential." },
      ],
      pitchHighlights: [
        "Scientist-protagonist survival thriller with proven market appeal (Gravity, The Martian)",
        "LED volume compatible — production cost optimization potential",
        "Strong OTT acquisition interest in sci-fi adventure genre (up 22% YoY)",
        "Clean IP — no franchise dependency, sequel potential built into narrative",
        "International appeal: universal survival themes with minimal cultural localization needed",
      ],
      estimatedBudget: "$4.5M – $8M",
      breakEvenTarget: "$14M – $24M (total combined revenue)",
    },
    "proj-2": {
      readinessScore: 82,
      readinessLabel: "Strong Investment Candidate",
      roiProjections: [
        { channel: "Domestic Theatrical", conservative: "1.5x", moderate: "2.2x", optimistic: "3.8x" },
        { channel: "International Theatrical", conservative: "2.0x", moderate: "3.2x", optimistic: "5.0x" },
        { channel: "SVOD License", conservative: "2.5x", moderate: "3.8x", optimistic: "5.5x" },
        { channel: "Franchise/Sequel Rights", conservative: "1.0x", moderate: "4.0x", optimistic: "8.0x" },
      ],
      marketComps: [
        { title: "Blade Runner 2049", budget: "$150M", revenue: "$259M", multiplier: "1.7x", notes: "Critical success; niche theatrical but massive home entertainment." },
        { title: "Alita: Battle Angel", budget: "$170M", revenue: "$405M", multiplier: "2.4x", notes: "Strong international; cyberpunk aesthetic drives visual engagement." },
        { title: "Everything Everywhere", budget: "$25M", revenue: "$141M", multiplier: "5.6x", notes: "Genre-bending sci-fi; awards momentum drove theatrical legs." },
      ],
      riskFactors: [
        { factor: "High VFX Budget", severity: "High", notes: "Flooded cyberpunk city requires extensive environment creation. Est. $8M–$15M VFX budget." },
        { factor: "Niche Genre Appeal", severity: "Medium", notes: "Cyberpunk noir skews heavily M 18-34. Broader marketing strategy needed." },
        { factor: "Competition Window", severity: "Medium", notes: "Neon Abyss (Paramount) in Q4 2025 creates direct genre competition." },
      ],
      pitchHighlights: [
        "Franchise potential: world-building supports series adaptation and sequel development",
        "Cyberpunk genre experiencing cultural renaissance (gaming + anime crossover)",
        "Netflix and HBO Max actively acquiring cyberpunk content (35% demand increase YoY)",
        "Detective Ren character has merchandising and IP extension potential",
        "Visual spectacle differentiator with unique flooded-city aesthetic",
      ],
      estimatedBudget: "$25M – $45M",
      breakEvenTarget: "$75M – $135M (total combined revenue)",
    },
    "proj-3": {
      readinessScore: 62,
      readinessLabel: "Moderate Investment Potential — Awards Play",
      roiProjections: [
        { channel: "Limited Theatrical", conservative: "1.2x", moderate: "2.0x", optimistic: "3.5x" },
        { channel: "Festival Circuit", conservative: "0.5x", moderate: "1.0x", optimistic: "2.0x" },
        { channel: "SVOD License", conservative: "2.0x", moderate: "3.5x", optimistic: "5.0x" },
        { channel: "Awards Season Momentum", conservative: "1.0x", moderate: "3.0x", optimistic: "8.0x" },
      ],
      marketComps: [
        { title: "Green Book (2018)", budget: "$23M", revenue: "$321M", multiplier: "14.0x", notes: "Awards momentum drove massive theatrical; period + music." },
        { title: "L.A. Confidential", budget: "$35M", revenue: "$126M", multiplier: "3.6x", notes: "Period noir crime; sustained cult following." },
        { title: "Whiplash (2014)", budget: "$3.3M", revenue: "$49M", multiplier: "14.8x", notes: "Jazz-themed; micro-budget awards darling." },
      ],
      riskFactors: [
        { factor: "Limited Theatrical Ceiling", severity: "Medium", notes: "Period noir audience skews older; limited opening weekend potential." },
        { factor: "Awards Dependency", severity: "High", notes: "ROI heavily dependent on festival selection and awards season performance." },
        { factor: "Period Production Costs", severity: "Low", notes: "1940s setting requires wardrobe and set design but manageable at micro-budget." },
      ],
      pitchHighlights: [
        "Micro-budget production with outsized awards potential (Whiplash, Moonlight template)",
        "Jazz club setting provides unique sonic and visual identity",
        "Character-driven narrative requires minimal VFX investment",
        "Strong SVOD acquisition interest for prestige period content",
        "Apple TV+ and MUBI premium platform fit (90%+ platform scores)",
      ],
      estimatedBudget: "$1.5M – $4M",
      breakEvenTarget: "$6M – $12M (total combined revenue)",
    },
    "proj-4": {
      readinessScore: 76,
      readinessLabel: "Investment Ready — Strong Potential",
      roiProjections: [
        { channel: "Domestic Theatrical", conservative: "1.5x", moderate: "2.5x", optimistic: "4.0x" },
        { channel: "International Theatrical", conservative: "1.8x", moderate: "2.8x", optimistic: "4.5x" },
        { channel: "SVOD License", conservative: "2.2x", moderate: "3.2x", optimistic: "4.8x" },
        { channel: "TVOD + Home Video", conservative: "0.8x", moderate: "1.5x", optimistic: "2.2x" },
      ],
      marketComps: [
        { title: "The Abyss (1989)", budget: "$70M", revenue: "$90M", multiplier: "1.3x", notes: "Underwater sci-fi discovery benchmark; cult status." },
        { title: "Arrival (2016)", budget: "$47M", revenue: "$203M", multiplier: "4.3x", notes: "Discovery sci-fi with emotional core; awards + commercial." },
        { title: "Deep Blue Sea (1999)", budget: "$82M", revenue: "$165M", multiplier: "2.0x", notes: "Underwater creature feature; strong international numbers." },
      ],
      riskFactors: [
        { factor: "Underwater Production", severity: "High", notes: "Tank/underwater filming significantly increases production costs and schedule complexity." },
        { factor: "Creature/Entity Design", severity: "Medium", notes: "Ancient entity requires unique VFX design that could become a marketing asset or liability." },
        { factor: "Genre History", severity: "Low", notes: "Underwater (2020) underperformed at box office; marketing strategy must differentiate." },
      ],
      pitchHighlights: [
        "Combines survival thriller with cosmic horror — dual genre appeal",
        "Claustrophobic submarine setting provides natural built-in tension",
        "Dolby Atmos sound design opportunities for premium theatrical experience",
        "Deep-sea exploration trending due to real-world oceanographic interest",
        "Practical tank stages can reduce VFX costs while maintaining realism",
      ],
      estimatedBudget: "$15M – $30M",
      breakEvenTarget: "$45M – $90M (total combined revenue)",
    },
  };

  return dataMap[project.id] || defaultInvestmentData();
}

function defaultInvestmentData() {
  return {
    readinessScore: 60,
    readinessLabel: "Moderate Investment Potential",
    roiProjections: [
      { channel: "Theatrical", conservative: "1.2x", moderate: "2.0x", optimistic: "3.5x" },
      { channel: "SVOD License", conservative: "1.5x", moderate: "2.5x", optimistic: "4.0x" },
    ],
    marketComps: [] as { title: string; budget: string; revenue: string; multiplier: string; notes: string }[],
    riskFactors: [] as { factor: string; severity: string; notes: string }[],
    pitchHighlights: ["Script analysis in progress. Complete all prior steps for full investment assessment."],
    estimatedBudget: "TBD",
    breakEvenTarget: "TBD",
  };
}

export const InvestmentIntelligence: React.FC<InvestmentIntelligenceProps> = ({
  currentProject,
  onNext,
  onBack,
}) => {
  const data = getInvestmentData(currentProject);
  const [showComps, setShowComps] = useState(true);
  const [showRisks, setShowRisks] = useState(true);

  const severityColor = (s: string) => {
    if (s === "High") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (s === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground tracking-tight">
              Investment Intelligence
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Investment analysis for <span className="font-semibold text-foreground">"{currentProject.title}"</span> — readiness, ROI projections & risk assessment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" /> Storyboards
          </button>
          <button onClick={onNext} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#001b94] text-white hover:bg-[#001070] transition-colors flex items-center gap-1.5 cursor-pointer">
            Pitch Deck <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Investment Readiness Banner */}
      <div className="bg-gradient-to-r from-[#0F294D] via-[#001b94] to-[#1E3A8A] rounded-2xl p-6 text-white border border-white/10">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl font-display font-bold tracking-tight">{data.readinessScore}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">Readiness Score</div>
          </div>
          <div className="flex-1 min-w-[250px] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF6F00]" />
              <span className="text-sm font-semibold text-amber-300">{data.readinessLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-[10px] font-mono uppercase text-slate-300">Estimated Budget</div>
                <div className="text-sm font-semibold text-white mt-0.5">{data.estimatedBudget}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-[10px] font-mono uppercase text-slate-300">Break-Even Target</div>
                <div className="text-sm font-semibold text-white mt-0.5">{data.breakEvenTarget}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Projections Table */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#FF6F00]" />
          <h3 className="text-sm font-semibold text-foreground">ROI Projections by Channel</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Distribution Channel</th>
                <th className="text-right py-2 px-2 font-semibold text-red-400">Conservative</th>
                <th className="text-right py-2 px-2 font-semibold text-amber-500">Moderate</th>
                <th className="text-right py-2 px-2 font-semibold text-emerald-500">Optimistic</th>
              </tr>
            </thead>
            <tbody>
              {data.roiProjections.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-2 font-semibold text-foreground">{row.channel}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-red-500 dark:text-red-400">{row.conservative}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-amber-600 dark:text-amber-400 font-semibold">{row.moderate}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{row.optimistic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Comps + Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Market Comps */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <button onClick={() => setShowComps(!showComps)} className="flex items-center justify-between w-full cursor-pointer">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Market Comparables</h3>
            </div>
            {showComps ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {showComps && (
            <div className="space-y-3">
              {data.marketComps.map((comp, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">{comp.title}</h4>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{comp.multiplier}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <span>Budget: {comp.budget}</span>
                    <span>Revenue: {comp.revenue}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{comp.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk Factors */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <button onClick={() => setShowRisks(!showRisks)} className="flex items-center justify-between w-full cursor-pointer">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Risk Assessment</h3>
            </div>
            {showRisks ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {showRisks && (
            <div className="space-y-3">
              {data.riskFactors.map((risk, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">{risk.factor}</h4>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${severityColor(risk.severity)}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{risk.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Investor Pitch Highlights */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#FF6F00]" />
          <h3 className="text-sm font-semibold text-foreground">Investor Pitch Highlights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {data.pitchHighlights.map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
