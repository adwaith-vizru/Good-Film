import React, { useState } from "react";
import {
  Megaphone,
  Calendar,
  ShieldCheck,
  Languages,
  Image,
  Film,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Globe,
  Star,
  Clock,
  TrendingUp,
  Wand2,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { ProjectOption } from "./reelRefineData";

export type ReleaseSubTab = "window" | "certification" | "languages" | "poster" | "trailer";

interface ReleaseStrategyProps {
  currentProject: ProjectOption;
  onBack: () => void;
  activeSubTab?: ReleaseSubTab;
  onSelectSubTab?: (tab: ReleaseSubTab) => void;
}

function getReleaseData(project: ProjectOption) {
  const dataMap: Record<string, ReturnType<typeof defaultReleaseData>> = {
    "proj-1": {
      // Release Window
      recommendedWindow: "October 2025 — Early Awards Season",
      windowReasoning: "Sci-fi adventure with critical appeal benefits from fall release. October avoids summer blockbuster fatigue and positions for early awards consideration.",
      competitiveCalendar: [
        { month: "Sep 2025", density: "Medium", notes: "Venice/TIFF festival premieres; limited theatrical competition." },
        { month: "Oct 2025", density: "Low", notes: "Ideal window — fewer sci-fi releases, awards buzz season begins." },
        { month: "Nov 2025", density: "High", notes: "Major tentpole releases crowd the marketplace." },
        { month: "Dec 2025", density: "High", notes: "Holiday blockbusters dominate screens." },
      ],
      windowScore: 82,

      // Certification
      predictedRating: "PG-13",
      ratingConfidence: 88,
      ratingFactors: [
        { factor: "Intense sci-fi action sequences", impact: "Pushes toward PG-13", severity: "Medium" },
        { factor: "No graphic violence or gore", impact: "Keeps below R threshold", severity: "Low" },
        { factor: "Mild profanity (2 instances)", impact: "Within PG-13 bounds", severity: "Low" },
        { factor: "Thematic intensity (survival stakes)", impact: "Age-appropriate tension", severity: "Low" },
      ],
      cbfcRating: "U/A",
      cbfcNotes: "Clean content suitable for universal audience with parental guidance for intense sequences.",

      // Languages
      primaryLanguage: "English",
      recommendedDubs: [
        { language: "Spanish (Latin America)", marketSize: "Large", priority: "High", reasoning: "2nd largest theatrical market for sci-fi genre." },
        { language: "Mandarin Chinese", marketSize: "Large", priority: "High", reasoning: "Largest international market; sci-fi resonates strongly." },
        { language: "Hindi", marketSize: "Large", priority: "Medium", reasoning: "Growing OTT market; dubbed sci-fi content trending." },
        { language: "Japanese", marketSize: "Medium", priority: "Medium", reasoning: "Strong sci-fi audience; premium OTT positioning." },
        { language: "Korean", marketSize: "Medium", priority: "Medium", reasoning: "High per-capita spend on sci-fi content." },
        { language: "French", marketSize: "Medium", priority: "Low", reasoning: "European market coverage; subtitle-preferred audience." },
      ],
      subtitleLanguages: ["Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Korean", "Mandarin", "Hindi", "Arabic", "Thai", "Turkish"],

      // Poster Concepts
      posterConcepts: [
        {
          title: "Solar Eye — Key Art A",
          description: "Silhouette of Alex and Marcus standing before a massive solar storm. Golden plasma tendrils frame the composition. The shuttle is visible in the middle distance. Tagline: 'Into the heart of the solar storm.'",
          style: "Cinematic IMAX",
          palette: "Deep navy, golden amber, plasma white",
        },
        {
          title: "Lunar Departure — Key Art B",
          description: "Ground-level shot from behind the shuttle on the lunar surface. Alex's helmeted figure is dwarfed by the rising sun. Desolate terrain stretches to the horizon.",
          style: "IMAX Vertical",
          palette: "Silver-grey lunar tones, stark sunlight, deep shadows",
        },
        {
          title: "Character Poster — Alex Rivers",
          description: "Close-up of Alex through her telemetry visor. Data readouts reflect on the glass. Her expression is determined but vulnerable. Solar glow illuminates one side.",
          style: "Character Portrait",
          palette: "Warm amber glow, cool blue shadows, visor reflections",
        },
      ],

      // Trailer
      keyScenes: [
        { scene: "Lunar Launch Pad — Opening", timestamp: "0:00–0:15", purpose: "Establish setting & stakes", notes: "Alex checking telemetry, Marcus adjusting gloves. '10 minutes before collapse.'" },
        { scene: "Director Hayes Confrontation", timestamp: "0:15–0:30", purpose: "Conflict escalation", notes: "Permission denied. Alex's defiant response. 'We didn't trek across the Mare Tranquillitatis just to turn around.'" },
        { scene: "Solar Storm Entry", timestamp: "0:30–1:00", purpose: "Visual spectacle", notes: "Shuttle entering golden plasma hurricane. VFX showcase. Music crescendo." },
        { scene: "Cockpit Crisis", timestamp: "1:00–1:20", purpose: "Tension peak", notes: "Systems failing. Alex and Marcus' partnership tested. Quick cuts." },
        { scene: "Solar Eye Reveal", timestamp: "1:20–1:35", purpose: "Awe moment", notes: "The eye of the solar storm. Silence. Then the data signal. Hope." },
        { scene: "Title Card + Tagline", timestamp: "1:35–1:45", purpose: "Brand identity", notes: "THE GOLDEN HORIZON. 'Into the heart of the solar storm.' Release date." },
      ],
      trailerTone: "Epic yet intimate. Build from quiet lunar desolation to awe-inspiring solar spectacle. Emphasize the human relationship at the core.",
      trailerStructure: "3-act mini-structure: 1) Quiet stakes setup (15s), 2) Conflict and spectacle (45s), 3) Emotional resolution + title (25s). Total: 1:45.",
      trailerMusic: "Original score recommended. Reference: Hans Zimmer's 'Interstellar' combined with quieter moments from Jóhann Jóhannsson's 'Arrival'.",
    },
    "proj-2": {
      recommendedWindow: "November 2025 — Late Fall / Pre-Awards",
      windowReasoning: "Cyberpunk mystery benefits from the fall prestige window. Darker aesthetic suits winter release. Avoid summer where lighter blockbusters dominate.",
      competitiveCalendar: [
        { month: "Oct 2025", density: "Low", notes: "Possible but risks audience split with horror season." },
        { month: "Nov 2025", density: "Medium", notes: "Good window; prestige releases begin but audience appetite is high." },
        { month: "Dec 2025", density: "High", notes: "Holiday blockbusters; risky for mid-budget genre film." },
        { month: "Jan 2026", density: "Low", notes: "Possible dump month positioning; counter-programming opportunity." },
      ],
      windowScore: 76,
      predictedRating: "R",
      ratingConfidence: 82,
      ratingFactors: [
        { factor: "Violence in noir investigation scenes", impact: "Pushes toward R", severity: "High" },
        { factor: "Dark thematic content (memory theft)", impact: "Mature subject matter", severity: "Medium" },
        { factor: "Brief strong language", impact: "Multiple instances", severity: "Medium" },
        { factor: "Atmospheric drug references", impact: "Minor but present", severity: "Low" },
      ],
      cbfcRating: "A",
      cbfcNotes: "Adult certification likely due to violence and dark themes. May limit Indian theatrical audience but fits OTT positioning.",
      primaryLanguage: "English / Japanese (dual)",
      recommendedDubs: [
        { language: "Japanese", marketSize: "Large", priority: "High", reasoning: "Cyberpunk genre originated in Japanese media; highest cultural resonance." },
        { language: "Korean", marketSize: "Medium", priority: "High", reasoning: "Strong sci-fi/noir audience; K-drama crossover appeal." },
        { language: "Spanish (Latin America)", marketSize: "Large", priority: "Medium", reasoning: "Growing appetite for genre content." },
        { language: "Mandarin Chinese", marketSize: "Large", priority: "Medium", reasoning: "Cyberpunk aesthetic resonates; gaming crossover audience." },
      ],
      subtitleLanguages: ["Japanese", "Korean", "Spanish", "French", "German", "Mandarin", "Portuguese", "Thai", "Indonesian"],
      posterConcepts: [
        {
          title: "Neon Rain — Key Art A",
          description: "Detective Ren standing in a rain-soaked neon alley. Reflections of holographic ads shimmer in the floodwater. A single glowing memory chip in their hand.",
          style: "Noir Cinematic",
          palette: "Deep purple, electric cyan, hot pink neon, rain-wet blacks",
        },
        {
          title: "Memory Vault — Key Art B",
          description: "Surreal composition of fractured memories floating in a digital void. Ren's face partially dissolved into data streams. The Archivist's silhouette looms behind.",
          style: "Digital Art / Surreal",
          palette: "Glitch colors, data green, void black, memory gold",
        },
      ],
      keyScenes: [
        { scene: "Neon Alley Opening", timestamp: "0:00–0:12", purpose: "World establishment", notes: "Rain. Neon. Flooded streets. Ren walks through the underbelly." },
        { scene: "Memory Heist Discovery", timestamp: "0:12–0:30", purpose: "Inciting incident", notes: "Victim's stolen memories. 'Someone is erasing people from the inside out.'" },
        { scene: "Server Vault Chase", timestamp: "0:30–1:00", purpose: "Action spectacle", notes: "High-speed chase through flooded server corridors. VFX showcase." },
        { scene: "Identity Crisis", timestamp: "1:00–1:20", purpose: "Emotional core", notes: "Ren questions own synthetic nature. 'If my memories aren't real, am I?'" },
        { scene: "Title Card", timestamp: "1:20–1:35", purpose: "Brand identity", notes: "NEO-TOKYO CYBERPUNK. 'Memories can be stolen. Truth cannot.'" },
      ],
      trailerTone: "Atmospheric noir meets cyberpunk spectacle. Slow burn opening transitioning to high-energy investigation. Existential undertone throughout.",
      trailerStructure: "Mood-first approach: 1) Atmospheric world intro (12s), 2) Mystery escalation (18s), 3) Action showcase (30s), 4) Emotional twist + title (25s). Total: 1:35.",
      trailerMusic: "Synthwave score with noir jazz undertones. Reference: Blade Runner 2049 OST meets 'Cowboy Bebop' jazz noir.",
    },
    "proj-3": {
      recommendedWindow: "December 2025 — Awards Season Core",
      windowReasoning: "Period noir drama is perfectly positioned for December limited release, expanding in January with awards momentum. Festival premiere at Venice/TIFF is essential.",
      competitiveCalendar: [
        { month: "Sep 2025", density: "Low", notes: "Festival premiere window (Venice/TIFF/Telluride)." },
        { month: "Nov 2025", density: "Medium", notes: "Limited platform release possible." },
        { month: "Dec 2025", density: "Medium", notes: "Awards-qualifying limited release; counter-programming to blockbusters." },
        { month: "Jan 2026", density: "Low", notes: "Expansion with awards nominations momentum." },
      ],
      windowScore: 85,
      predictedRating: "PG-13",
      ratingConfidence: 75,
      ratingFactors: [
        { factor: "Period-appropriate violence (fistfights)", impact: "Within PG-13 bounds", severity: "Low" },
        { factor: "Thematic darkness (corruption, heist)", impact: "Mature themes", severity: "Medium" },
        { factor: "Period smoking and drinking", impact: "Contextually appropriate", severity: "Low" },
        { factor: "Mild romantic content", impact: "Tastefully handled", severity: "Low" },
      ],
      cbfcRating: "U/A",
      cbfcNotes: "Suitable for universal audience with parental guidance. Period setting contextualizes content.",
      primaryLanguage: "English",
      recommendedDubs: [
        { language: "French", marketSize: "Medium", priority: "High", reasoning: "Strong market for period noir; French audiences love the genre." },
        { language: "Italian", marketSize: "Medium", priority: "Medium", reasoning: "Classic cinema appreciation; festival audience." },
        { language: "Spanish", marketSize: "Large", priority: "Medium", reasoning: "Growing appetite for prestige content." },
      ],
      subtitleLanguages: ["French", "Italian", "Spanish", "German", "Portuguese", "Japanese", "Korean", "Mandarin"],
      posterConcepts: [
        {
          title: "Jazz Club Shadows — Key Art A",
          description: "Jack silhouetted at the piano in a smoky jazz club. Amber spotlight creates dramatic shadows. A mysterious figure watches from the bar.",
          style: "Classic Noir",
          palette: "Deep blacks, amber spotlight, smoke grey, vintage gold",
        },
        {
          title: "The Heist — Key Art B",
          description: "Split composition: half jazz club warmth, half cold city streets at night. A stolen painting visible in the shadows between the two worlds.",
          style: "Diptych Poster",
          palette: "Warm amber vs. cold blue-grey, noir contrast",
        },
      ],
      keyScenes: [
        { scene: "Jazz Club Opening", timestamp: "0:00–0:15", purpose: "Atmosphere", notes: "Piano melody. Smoky club. Jack plays as the camera slowly pushes in." },
        { scene: "The Proposition", timestamp: "0:15–0:30", purpose: "Inciting incident", notes: "Vivian approaches Jack. 'I need someone who can keep a secret and play a tune.'" },
        { scene: "The Heist Sequence", timestamp: "0:30–0:55", purpose: "Tension", notes: "Intercut heist with Jack's piano performance. Parallel tension building." },
        { scene: "Betrayal Reveal", timestamp: "0:55–1:10", purpose: "Twist", notes: "Chief Benton's involvement revealed. 'Every shadow holds a secret.'" },
        { scene: "Title Card", timestamp: "1:10–1:20", purpose: "Brand identity", notes: "MIDNIGHT NOIR. Piano note fades to black." },
      ],
      trailerTone: "Atmospheric period noir. Slow, confident, dripping with style. Jazz score drives the rhythm.",
      trailerStructure: "Musical structure: 1) Solo piano intro (15s), 2) Ensemble build — plot introduction (15s), 3) Jazz crescendo — heist and tension (25s), 4) Piano resolution — twist + title (25s). Total: 1:20.",
      trailerMusic: "Original jazz score essential. Solo piano opening, building to full combo. Reference: 'Whiplash' intensity meets 'La La Land' atmosphere.",
    },
    "proj-4": {
      recommendedWindow: "June 2025 — Summer Blockbuster Season",
      windowReasoning: "Underwater sci-fi thriller benefits from summer theatrical release. Spectacle-driven premise suits the season. Position as counter-programming to superhero tentpoles.",
      competitiveCalendar: [
        { month: "May 2025", density: "High", notes: "Superhero tentpoles dominate; avoid direct competition." },
        { month: "Jun 2025", density: "Medium", notes: "Post-tentpole window; audience seeking variety." },
        { month: "Jul 2025", density: "Medium", notes: "Family films dominate; counter-programming opportunity for adult thriller." },
        { month: "Aug 2025", density: "Low", notes: "End-of-summer; audience fatigue but less competition." },
      ],
      windowScore: 74,
      predictedRating: "PG-13",
      ratingConfidence: 85,
      ratingFactors: [
        { factor: "Intense underwater action", impact: "Standard PG-13 action", severity: "Low" },
        { factor: "Creature/entity horror elements", impact: "Pushes toward PG-13 ceiling", severity: "Medium" },
        { factor: "Character peril and death", impact: "Rescue team casualties", severity: "Medium" },
        { factor: "Mild language", impact: "Within PG-13 bounds", severity: "Low" },
      ],
      cbfcRating: "U/A",
      cbfcNotes: "Suitable for universal audience with parental guidance. Horror elements are tension-based rather than graphic.",
      primaryLanguage: "English",
      recommendedDubs: [
        { language: "Mandarin Chinese", marketSize: "Large", priority: "High", reasoning: "Largest international market; underwater spectacle drives repeat viewings." },
        { language: "Spanish (Latin America)", marketSize: "Large", priority: "High", reasoning: "Strong appetite for action-thriller content." },
        { language: "Hindi", marketSize: "Large", priority: "Medium", reasoning: "Growing theatrical market for dubbed Hollywood content." },
        { language: "Korean", marketSize: "Medium", priority: "Medium", reasoning: "Strong genre audience; Netflix positioning." },
        { language: "Japanese", marketSize: "Medium", priority: "Medium", reasoning: "Deep-sea themes resonate with Japanese audiences." },
      ],
      subtitleLanguages: ["Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Korean", "Mandarin", "Hindi", "Arabic", "Thai"],
      posterConcepts: [
        {
          title: "The Descent — Key Art A",
          description: "Submarine descending into an impossibly deep trench. Bioluminescent creatures illuminate the darkness. A massive ancient structure is barely visible far below.",
          style: "Vertical IMAX",
          palette: "Abyssal blue-black, bioluminescent cyan, ancient amber glow",
        },
        {
          title: "The Entity — Key Art B",
          description: "Close-up of Dr. Priya Marin's face behind submarine glass. In the reflection, the ancient entity's form is partially visible. Fear and wonder in her expression.",
          style: "Character Thriller",
          palette: "Cold submarine blue, warm skin tones, entity amber",
        },
      ],
      keyScenes: [
        { scene: "Surface Briefing", timestamp: "0:00–0:12", purpose: "Stakes setup", notes: "Research team lost. 'We go down, or they never come back up.'" },
        { scene: "Submarine Descent", timestamp: "0:12–0:30", purpose: "Visual spectacle", notes: "Descent into the trench. Pressure increases. Systems strain." },
        { scene: "Lost Team Discovery", timestamp: "0:30–0:50", purpose: "Horror reveal", notes: "Finding the research station. Something is wrong. 'They didn't drown. They were taken.'" },
        { scene: "Entity Encounter", timestamp: "0:50–1:10", purpose: "Climactic spectacle", notes: "The ancient presence reveals itself. Scale beyond comprehension." },
        { scene: "Title Card", timestamp: "1:10–1:25", purpose: "Brand identity", notes: "ECHOES OF THE DEEP. 'The abyss has been listening.' Sonar pulse fade." },
      ],
      trailerTone: "Claustrophobic tension building to cosmic awe. Submarine thriller pacing with Lovecraftian wonder at the climax.",
      trailerStructure: "Pressure-cooker: 1) Surface calm — mission briefing (12s), 2) Descent — building pressure (18s), 3) Discovery — horror elements (20s), 4) Entity — awe and scale (15s), 5) Title (10s). Total: 1:25.",
      trailerMusic: "Minimal ambient score. Heavy sound design focus — sonar pings, hull groaning, deep-water pressure. Reference: 'Arrival' score meets submarine thriller sound design.",
    },
  };

  return dataMap[project.id] || defaultReleaseData();
}

function defaultReleaseData() {
  return {
    recommendedWindow: "TBD — Pending analysis",
    windowReasoning: "Complete script analysis and market viability assessment to generate release window recommendation.",
    competitiveCalendar: [] as { month: string; density: string; notes: string }[],
    windowScore: 50,
    predictedRating: "TBD",
    ratingConfidence: 0,
    ratingFactors: [] as { factor: string; impact: string; severity: string }[],
    cbfcRating: "TBD",
    cbfcNotes: "Pending content analysis.",
    primaryLanguage: "English",
    recommendedDubs: [] as { language: string; marketSize: string; priority: string; reasoning: string }[],
    subtitleLanguages: [] as string[],
    posterConcepts: [] as { title: string; description: string; style: string; palette: string; isNew?: boolean }[],
    keyScenes: [] as { scene: string; timestamp: string; purpose: string; notes: string }[],
    trailerTone: "Pending analysis.",
    trailerStructure: "Pending analysis.",
    trailerMusic: "Pending analysis.",
  };
}

const SUB_TABS: { id: ReleaseSubTab; label: string; icon: React.ElementType }[] = [
  { id: "window", label: "Release Window", icon: Calendar },
  { id: "certification", label: "Certification", icon: ShieldCheck },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "poster", label: "AI Poster Generator", icon: Image },
  { id: "trailer", label: "Trailer Rec.", icon: Film },
];

export const ReleaseStrategy: React.FC<ReleaseStrategyProps> = ({
  currentProject,
  onBack,
  activeSubTab: externalSubTab,
  onSelectSubTab,
}) => {
  const data = getReleaseData(currentProject);
  const [internalSubTab, setInternalSubTab] = useState<ReleaseSubTab>("window");
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSubTabChange = (tab: ReleaseSubTab) => {
    setInternalSubTab(tab);
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    }
  };

  // AI Poster Generator Interactive State
  const [posterPrompt, setPosterPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Cinematic IMAX");
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [customPosters, setCustomPosters] = useState<
    { title: string; description: string; style: string; palette: string; isNew?: boolean }[]
  >([]);

  const handleGeneratePoster = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptText =
      posterPrompt.trim() ||
      `Cinematic key art for ${currentProject.title}, ${selectedStyle} style, high contrast lighting, 8k resolution`;

    setIsGeneratingPoster(true);

    setTimeout(() => {
      setIsGeneratingPoster(false);
      const newPoster = {
        title: `${currentProject.title} — AI Poster #${customPosters.length + 1}`,
        description: promptText,
        style: selectedStyle,
        palette: "AI Studio Render • HDR Anamorphic Glow & Deep Contrast",
        isNew: true,
      };
      setCustomPosters((prev) => [newPoster, ...prev]);
      setPosterPrompt("");
    }, 1800);
  };

  const densityColor = (d: string) => {
    if (d === "High") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (d === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  const priorityColor = (p: string) => {
    if (p === "High") return "bg-[#001b94]/10 text-[#001b94] dark:bg-sky-900/30 dark:text-sky-400";
    if (p === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  };

  const allPosterConcepts = [...customPosters, ...data.posterConcepts];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground tracking-tight">
              Release & Marketing Strategy
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Distribution strategy for <span className="font-semibold text-foreground">"{currentProject.title}"</span>
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" /> Pitch Deck
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl p-1.5 overflow-x-auto">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
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

      {/* Release Window */}
      {activeSubTab === "window" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-[#0F294D] via-[#001b94] to-[#1E3A8A] rounded-2xl p-6 text-white border border-white/10">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-display font-bold tracking-tight">{data.windowScore}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">Window Score</div>
              </div>
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#FF6F00]" />
                  <span className="text-sm font-semibold text-amber-300">{data.recommendedWindow}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{data.windowReasoning}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Competitive Calendar</h3>
            </div>
            <div className="space-y-2.5">
              {data.competitiveCalendar.map((month, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-foreground w-20 flex-shrink-0">{month.month}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${densityColor(month.density)}`}>
                    {month.density}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex-1">{month.notes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certification Prediction */}
      {activeSubTab === "certification" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* MPAA */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FF6F00]" />
                <h3 className="text-sm font-semibold text-foreground">MPAA Rating Prediction</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-[#001b94] flex items-center justify-center">
                  <span className="text-xl font-display font-bold text-white">{data.predictedRating}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Predicted Rating</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{data.ratingConfidence}% confidence</div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden w-32 mt-1">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${data.ratingConfidence}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* CBFC */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#FF6F00]" />
                <h3 className="text-sm font-semibold text-foreground">CBFC Rating Prediction</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-amber-500 flex items-center justify-center">
                  <span className="text-lg font-display font-bold text-white">{data.cbfcRating}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Predicted Certification</div>
                  <p className="text-[10px] text-muted-foreground mt-1">{data.cbfcNotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Factors */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Rating Factors</h3>
            </div>
            <div className="space-y-2.5">
              {data.ratingFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${densityColor(factor.severity)}`}>
                    {factor.severity}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-foreground">{factor.factor}</div>
                    <div className="text-[10px] text-muted-foreground">{factor.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Options */}
      {activeSubTab === "languages" && (
        <div className="space-y-5">
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Recommended Dubs</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                Primary: {data.primaryLanguage}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.recommendedDubs.map((dub, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">{dub.language}</h4>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${priorityColor(dub.priority)}`}>
                      {dub.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {dub.marketSize} Market
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{dub.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Subtitle Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.subtitleLanguages.map((lang, idx) => (
                <span key={idx} className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Poster Generator */}
      {activeSubTab === "poster" && (
        <div className="space-y-6">
          {/* Interactive AI Prompt Text Bar & Controls Container */}
          <div className="bg-gradient-to-r from-[#0F294D] via-[#001b94] to-[#1E3A8A] rounded-2xl p-5 md:p-6 text-white border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6F00] border border-white/15">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white font-display">AI Poster Generator</h3>
                  <p className="text-xs text-slate-200">
                    Write a custom text prompt or pick a preset style to generate new AI key art for <span className="font-semibold text-amber-300">"{currentProject.title}"</span>.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3 h-3 inline mr-1 text-[#FF6F00]" /> Studio AI Engine v2.4
              </span>
            </div>

            <form onSubmit={handleGeneratePoster} className="space-y-3 pt-1">
              <div className="relative">
                <textarea
                  rows={3}
                  value={posterPrompt}
                  onChange={(e) => setPosterPrompt(e.target.value)}
                  placeholder={`Write your poster prompt for "${currentProject.title}" (e.g. Dramatic IMAX key art with Dr. Alex Rivers facing the solar storm, volumetric amber light, anamorphic lens flare, high contrast 8k)...`}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-none font-sans"
                />
                {posterPrompt && (
                  <button
                    type="button"
                    onClick={() => setPosterPrompt("")}
                    className="absolute right-3 top-3 text-xs font-mono text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 bg-white/10 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Style Presets Bar & Generate Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-[10px] font-mono text-slate-300 flex-shrink-0 uppercase">Style:</span>
                  {["Cinematic IMAX", "Minimalist Teaser", "Character Portrait", "Illustrated Retro", "Dark Noir"].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all flex-shrink-0 cursor-pointer ${
                        selectedStyle === style
                          ? "bg-[#FF6F00] text-white font-semibold shadow-md"
                          : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPoster}
                  className="px-5 py-2.5 bg-[#FF6F00] hover:bg-[#e06200] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  {isGeneratingPoster ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating Poster...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-white" />
                      <span>Generate Poster with AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Sample Prompts */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[10px]">
              <span className="text-slate-300 font-mono flex-shrink-0">Sample Prompts:</span>
              {[
                `Dramatic IMAX key art for ${currentProject.title}, solar storm background, high contrast`,
                `Minimalist teaser poster with helmet reflection and glowing magnetosphere`,
                `Retro 80s sci-fi illustrated poster with plasma trails and bold typography`,
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setPosterPrompt(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors truncate max-w-[280px] cursor-pointer"
                  title={prompt}
                >
                  + "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Generated Posters Grid */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-[#FF6F00]" />
                <h3 className="text-sm font-semibold text-foreground">AI Poster Concepts</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF6F00]/10 text-[#FF6F00]">
                  {allPosterConcepts.length} concepts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPosterConcepts.map((poster, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group hover:border-[#FF6F00]/50 transition-all">
                  {/* Poster placeholder with stylized gradient */}
                  <div className="h-48 bg-gradient-to-b from-[#0F294D] via-[#001b94] to-[#1E3A8A] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-[#FF6F00]/20 via-transparent to-black/40 pointer-events-none" />
                    <div className="text-center space-y-2 px-4 relative z-10">
                      <Image className="h-9 w-9 text-[#FF6F00] mx-auto group-hover:scale-110 transition-transform" />
                      <div className="text-[11px] font-semibold text-white tracking-wide">{poster.title}</div>
                      <span className="inline-block text-[9px] font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                        {poster.isNew ? "✨ Newly Generated" : "AI-Generated Concept"}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 z-10">
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white/90 border border-white/20">
                        {poster.style}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-foreground truncate">{poster.title}</h4>
                      {poster.isNew && (
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">{poster.description}</p>
                    <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                      <Star className="h-3 w-3 text-[#FF6F00] flex-shrink-0" />
                      <span className="text-[9px] font-mono text-muted-foreground truncate">{poster.palette}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trailer Recommendation */}
      {activeSubTab === "trailer" && (
        <div className="space-y-5">
          {/* Tone & Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FF6F00]" />
                <h3 className="text-sm font-semibold text-foreground">Trailer Tone</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{data.trailerTone}</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#FF6F00]" />
                <h3 className="text-sm font-semibold text-foreground">Recommended Structure</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{data.trailerStructure}</p>
            </div>
          </div>

          {/* Music Recommendation */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Music Direction</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{data.trailerMusic}</p>
          </div>

          {/* Key Scenes Timeline */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Key Scenes for Trailer</h3>
            </div>
            <div className="space-y-3">
              {data.keyScenes.map((scene, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <span className="text-[10px] font-mono font-semibold text-[#001b94] dark:text-sky-400">{scene.timestamp}</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#FF6F00]/10 text-[#FF6F00]">{scene.purpose}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground">{scene.scene}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{scene.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
