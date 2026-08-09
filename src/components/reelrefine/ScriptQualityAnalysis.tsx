import React, { useState } from "react";
import {
  ShieldCheck,
  MessageSquare,
  Layers,
  Users,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { ProjectOption } from "./reelRefineData";

interface ScriptQualityAnalysisProps {
  currentProject: ProjectOption;
  onNext: () => void;
  onBack: () => void;
}

// Per-project quality data
function getQualityData(project: ProjectOption) {
  const dataMap: Record<string, ReturnType<typeof defaultData>> = {
    "proj-1": {
      overallScore: 76,
      dialogueNaturalness: 72,
      dialogueSubtext: 68,
      dialogueVariety: 80,
      structureAdherence: 85,
      incitingIncidentPage: 8,
      midpointPage: 55,
      climaxPage: 98,
      characterDepth: [
        { name: "Dr. Alex Rivers", score: 88, arc: "Redemption", notes: "Strong protagonist drive; internal conflict well externalized through scientific obsession." },
        { name: "Captain Marcus Vane", score: 74, arc: "Loyalty", notes: "Compelling co-lead but motivation clarity drops in Act II transit." },
        { name: "Director Hayes", score: 52, arc: "Opposition", notes: "Antagonist feels underwritten; needs deeper ideological stakes." },
      ],
      pacingRhythm: [
        { segment: "Pages 1–15", tempo: "Fast", intensity: 88 },
        { segment: "Pages 16–30", tempo: "Building", intensity: 78 },
        { segment: "Pages 31–55", tempo: "Moderate", intensity: 62 },
        { segment: "Pages 56–72", tempo: "Slow", intensity: 48 },
        { segment: "Pages 73–90", tempo: "Accelerating", intensity: 75 },
        { segment: "Pages 91–114", tempo: "Climactic", intensity: 94 },
      ],
      toneConsistency: 78,
      toneNotes: "Strong tonal throughline in Acts I & III; mid-Act II drifts from urgency into exposition-heavy territory. Recommend tightening orbital transit sequence.",
      topInsights: [
        "Dialogue economy is strong in Act I but drops during technical briefing scenes.",
        "Character arcs for Alex and Marcus are well-interleaved; Hayes needs a mirror scene.",
        "The pacing valley between pages 56–72 risks audience disengagement.",
      ],
    },
    "proj-2": {
      overallScore: 84,
      dialogueNaturalness: 82,
      dialogueSubtext: 86,
      dialogueVariety: 78,
      structureAdherence: 88,
      incitingIncidentPage: 12,
      midpointPage: 58,
      climaxPage: 105,
      characterDepth: [
        { name: "Detective Ren", score: 92, arc: "Identity", notes: "Exceptional synthetic detective arc; existential questions woven naturally into noir investigation." },
        { name: "Mira Tanaka", score: 78, arc: "Betrayal", notes: "Strong supporting role with surprising pivot in Act III." },
        { name: "The Archivist", score: 70, arc: "Power", notes: "Intriguing villain concept; needs more screen time to land." },
      ],
      pacingRhythm: [
        { segment: "Pages 1–20", tempo: "Atmospheric", intensity: 82 },
        { segment: "Pages 21–40", tempo: "Building", intensity: 76 },
        { segment: "Pages 41–65", tempo: "Moderate", intensity: 68 },
        { segment: "Pages 66–90", tempo: "Accelerating", intensity: 80 },
        { segment: "Pages 91–110", tempo: "Climactic", intensity: 92 },
        { segment: "Pages 111–122", tempo: "Resolution", intensity: 70 },
      ],
      toneConsistency: 86,
      toneNotes: "Excellent noir-cyberpunk tone sustained throughout. Memory vault sequences feel appropriately surreal.",
      topInsights: [
        "Subtext-heavy dialogue works especially well for Detective Ren's synthetic identity crisis.",
        "The flooded city worldbuilding adds a unique visual layer to the cyberpunk genre.",
        "Act II memory vault chase could be trimmed by 8–10 pages without losing impact.",
      ],
    },
    "proj-3": {
      overallScore: 70,
      dialogueNaturalness: 76,
      dialogueSubtext: 72,
      dialogueVariety: 65,
      structureAdherence: 74,
      incitingIncidentPage: 10,
      midpointPage: 48,
      climaxPage: 85,
      characterDepth: [
        { name: "Jack Mercer", score: 80, arc: "Moral Dilemma", notes: "Well-drawn pianist protagonist; jazz metaphors effectively mirror internal conflict." },
        { name: "Chief Benton", score: 58, arc: "Corruption", notes: "Standard corrupt authority figure; would benefit from humanizing moments." },
        { name: "Vivian LaRue", score: 72, arc: "Survival", notes: "Compelling femme fatale with genuine vulnerability underneath." },
      ],
      pacingRhythm: [
        { segment: "Pages 1–15", tempo: "Atmospheric", intensity: 75 },
        { segment: "Pages 16–35", tempo: "Building", intensity: 70 },
        { segment: "Pages 36–55", tempo: "Moderate", intensity: 65 },
        { segment: "Pages 56–80", tempo: "Accelerating", intensity: 78 },
        { segment: "Pages 81–98", tempo: "Climactic", intensity: 85 },
      ],
      toneConsistency: 72,
      toneNotes: "Noir atmosphere is well-established but occasionally broken by modern-sounding dialogue in period setting.",
      topInsights: [
        "Period-appropriate dialogue needs another pass for consistency.",
        "Jazz club scenes are the strongest; lean into musical metaphors throughout.",
        "The heist sequence is well-paced but the setup takes too long.",
      ],
    },
    "proj-4": {
      overallScore: 80,
      dialogueNaturalness: 78,
      dialogueSubtext: 74,
      dialogueVariety: 82,
      structureAdherence: 82,
      incitingIncidentPage: 14,
      midpointPage: 52,
      climaxPage: 94,
      characterDepth: [
        { name: "Dr. Priya Marin", score: 84, arc: "Discovery", notes: "Compelling scientist protagonist driven by curiosity and guilt over the lost team." },
        { name: "Captain Dex Harlow", score: 76, arc: "Redemption", notes: "Rogue submarine captain with interesting backstory; needs clearer motivation reveal." },
        { name: "The Entity", score: 66, arc: "Ancient", notes: "Fascinating concept but needs more established rules for the ancient presence." },
      ],
      pacingRhythm: [
        { segment: "Pages 1–18", tempo: "Building", intensity: 76 },
        { segment: "Pages 19–38", tempo: "Moderate", intensity: 70 },
        { segment: "Pages 39–60", tempo: "Tense", intensity: 80 },
        { segment: "Pages 61–80", tempo: "Accelerating", intensity: 86 },
        { segment: "Pages 81–108", tempo: "Climactic", intensity: 92 },
      ],
      toneConsistency: 80,
      toneNotes: "Claustrophobic submarine atmosphere is well-sustained. Transition to cosmic horror in Act III is handled smoothly.",
      topInsights: [
        "Underwater setting creates natural tension; use it more in Act I.",
        "The discovery sequence is the strongest part of the script.",
        "Sound design cues in the script are excellent for immersive experience.",
      ],
    },
  };

  return dataMap[project.id] || defaultData();
}

function defaultData() {
  return {
    overallScore: 72,
    dialogueNaturalness: 70,
    dialogueSubtext: 65,
    dialogueVariety: 74,
    structureAdherence: 78,
    incitingIncidentPage: 10,
    midpointPage: 55,
    climaxPage: 95,
    characterDepth: [
      { name: "Protagonist", score: 75, arc: "Growth", notes: "Well-defined journey with room for deeper internal conflict." },
      { name: "Antagonist", score: 60, arc: "Opposition", notes: "Needs clearer motivation and ideological grounding." },
    ],
    pacingRhythm: [
      { segment: "Act I", tempo: "Moderate", intensity: 72 },
      { segment: "Act II", tempo: "Moderate", intensity: 60 },
      { segment: "Act III", tempo: "Climactic", intensity: 85 },
    ],
    toneConsistency: 70,
    toneNotes: "Generally consistent tone with occasional drifts that need tightening.",
    topInsights: [
      "Protagonist arc is well-defined; antagonist needs strengthening.",
      "Dialogue economy could improve in exposition-heavy scenes.",
    ],
  };
}

function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label: string }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#10B981" : score >= 65 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground"
          fontSize={size * 0.22}
          fontWeight={600}
          transform={`rotate(90, ${size / 2}, ${size / 2})`}
        >
          {score}
        </text>
      </svg>
      <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

function BarMeter({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    value >= 80 ? "bg-emerald-500" : value >= 65 ? "bg-amber-500" : "bg-red-400";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
        <span className="font-mono font-semibold text-foreground">{value}/100</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export const ScriptQualityAnalysis: React.FC<ScriptQualityAnalysisProps> = ({
  currentProject,
  onNext,
  onBack,
}) => {
  const data = getQualityData(currentProject);
  const [showCharacters, setShowCharacters] = useState(true);
  const [showPacing, setShowPacing] = useState(true);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground tracking-tight">
              Script Quality Analysis
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Deep quality assessment for <span className="font-semibold text-foreground">"{currentProject.title}"</span> — dialogue, structure, characters & pacing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" /> Script Snapshot
          </button>
          <button onClick={onNext} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#001b94] text-white hover:bg-[#001070] transition-colors flex items-center gap-1.5 cursor-pointer">
            AI Rewrites <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Overall Score + Dialogue Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Overall Quality Score */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Overall Quality Score</h3>
          </div>
          <div className="flex justify-center py-2">
            <ScoreRing score={data.overallScore} size={120} label="Composite Score" />
          </div>
          <div className="text-center">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              data.overallScore >= 80 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
              data.overallScore >= 65 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {data.overallScore >= 80 ? "Production Ready" : data.overallScore >= 65 ? "Needs Polish" : "Requires Revision"}
            </span>
          </div>
        </div>

        {/* Dialogue Quality Metrics */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Dialogue Quality</h3>
          </div>
          <div className="space-y-3">
            <BarMeter value={data.dialogueNaturalness} label="Naturalness" />
            <BarMeter value={data.dialogueSubtext} label="Subtext Depth" />
            <BarMeter value={data.dialogueVariety} label="Voice Variety" />
          </div>
        </div>

        {/* Structure Adherence */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Structure Adherence</h3>
          </div>
          <div className="space-y-3">
            <BarMeter value={data.structureAdherence} label="3-Act Compliance" />
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Inciting</div>
                <div className="text-sm font-semibold text-foreground">p.{data.incitingIncidentPage}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Midpoint</div>
                <div className="text-sm font-semibold text-foreground">p.{data.midpointPage}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Climax</div>
                <div className="text-sm font-semibold text-foreground">p.{data.climaxPage}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Depth Analysis */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <button
          onClick={() => setShowCharacters(!showCharacters)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Character Depth Analysis</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {data.characterDepth.length} characters
            </span>
          </div>
          {showCharacters ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {showCharacters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.characterDepth.map((char, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground">{char.name}</h4>
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                    char.score >= 80 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    char.score >= 65 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {char.score}/100
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#001b94]/10 text-[#001b94] dark:bg-sky-900/30 dark:text-sky-400">
                    {char.arc} Arc
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{char.notes}</p>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      char.score >= 80 ? "bg-emerald-500" : char.score >= 65 ? "bg-amber-500" : "bg-red-400"
                    }`}
                    style={{ width: `${char.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pacing Rhythm Visualization */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <button
          onClick={() => setShowPacing(!showPacing)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Pacing Rhythm</h3>
          </div>
          {showPacing ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {showPacing && (
          <div className="space-y-4">
            {/* Bar chart visualization */}
            <div className="flex items-end gap-2 h-32">
              {data.pacingRhythm.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono font-semibold text-foreground">{item.intensity}</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-md overflow-hidden" style={{ height: "100%" }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        item.intensity >= 80 ? "bg-[#001b94] dark:bg-sky-500" :
                        item.intensity >= 60 ? "bg-amber-500" : "bg-slate-400"
                      }`}
                      style={{ height: `${item.intensity}%`, marginTop: `${100 - item.intensity}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] font-mono text-muted-foreground leading-tight">{item.segment}</div>
                    <div className="text-[9px] font-medium text-slate-600 dark:text-slate-400">{item.tempo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tone Consistency + Top Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tone Consistency */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">Tone Consistency</h3>
          </div>
          <div className="flex items-center gap-4">
            <ScoreRing score={data.toneConsistency} size={70} label="Score" />
            <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{data.toneNotes}</p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">AI Quality Insights</h3>
          </div>
          <div className="space-y-2.5">
            {data.topInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
