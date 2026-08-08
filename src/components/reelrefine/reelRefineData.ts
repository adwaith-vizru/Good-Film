export interface ScriptImprovement {
  id: string;
  category: "Structure" | "Characters" | "Dialogue";
  title: string;
  rationale: string;
  originalSnippet: string;
  suggestedSnippet: string;
  sceneLocation: string;
  pageRange: string;
  applied: boolean;
}

export interface CastRole {
  id: string;
  roleName: string;
  ageRange: string;
  vibe: string;
  actorOptions: {
    name: string;
    fitScore: number; // 0-100
    starPowerScore: number; // 0-100
    budgetImpact: "Low" | "Medium" | "High";
    imageTag: string;
    knownFor: string;
  }[];
  selectedActor: string | null;
}

export interface LocationOption {
  id: string;
  region: string;
  country: string;
  permitEase: "Fast Track" | "Moderate" | "Strict";
  climateWindow: string;
  taxIncentive: string;
  vibeMatch: string;
  pinned: boolean;
  matchScore?: number;
}

export interface BudgetCategory {
  category: string;
  micro: { low: number; high: number };
  indie: { low: number; high: number };
  studio: { low: number; high: number };
}

export const SAMPLE_SCRIPT_TITLE = "The Golden Horizon";
export const SAMPLE_SCRIPT_AUTHOR = "Elena Vance & Marcus Wright";
export const SAMPLE_SCRIPT_LOGLINE = "A disgraced atmospheric scientist and an idealistic pilot embark on a clandestine flight into a solar storm to retrieve energy data that could save humanity's final lunar colony.";

export const SAMPLE_SCRIPT_CONTENT = `TITLE: THE GOLDEN HORIZON
LOGLINE: A disgraced atmospheric scientist and an idealistic pilot embark on a clandestine flight into a solar storm.

EXT. LUNAR BASE ALPHA - LAUNCH PAD - NIGHT

The harsh sunlight glints off the solar panels. Snow-like dust blows across the desolate terrain. 

DR. ALEX RIVERS (34) checks the telemetry visor attached to her helmet. Her breath fogs the inner visor.

ALEX
(into comms)
Core sensor temperature is dropping. We have ten minutes before the magnetosphere collapses.

CAPTAIN MARCUS VANE (38) leans against the shuttle ramp, adjusting his flight gloves with practiced calm.

MARCUS
Ten minutes is a luxury, Alex. Ground Control locked the thrusters three minutes ago.

ALEX
Then override them. We didn't trek across the Mare Tranquillitatis just to turn around.

MARCUS
If I fire the aux units manually, we burn forty percent of our reserve fuel before reaching low orbit.

ALEX
(firm)
We burn whatever it takes. Look at the telemetry, Marcus. That storm isn't dying down—it's concentrating directly over Sector 4.

Marcus stares at the monitor. The amber pulse flickers rhythmically.

MARCUS
(sighs)
Alright. Strap in. It's going to be a bumpy ride.

INT. SHUTTLE COCKPIT - CONTINUOUS

The cockpit hums with high-frequency static. Alarm klaxons sound softly in the background.

Alex flips three toggle switches on the overhead panel.

ALEX
Initiating secondary ignition sequence. 3... 2... 1...

The shuttle shakes violently as the engines ignite. Outside, the solar winds whirl like liquid gold.`;

export const PROJECT_SCRIPTS: Record<string, string> = {
  "proj-1": SAMPLE_SCRIPT_CONTENT,
  "proj-2": `TITLE: NEO-TOKYO CYBERPUNK
LOGLINE: In a flooded 2088 megacity, a synthetic investigator uncovers a memory theft syndicate in the neon underbelly.

EXT. SECTOR 7 - NEON ALLEYWAY - NIGHT (RAIN)

Acid rain slicks the chrome cobblestones. Neon signs flicker in Japanese and High-Tech script.

REN (32), a synthetic detective with optics glowing ice-blue, pulls his rain-soaked trench coat tight.

REN
(into neural-link)
Echo-4, scan the alley. The memory smuggler passed through here forty seconds ago.

ECHO-4 (V.O.)
Signal detected. Traces of raw bio-data left on the optic terminal near the ramen stall.

REN
He's bleeding neural code. We're close.

INT. UNDERGROUND MEMORY VAULT - CONTINUOUS

Holographic servers hum softly. Drains leak water onto black fiber-optic cables.

A hooded SYNTH-DEALER clutches a glowing bio-chip.

SYNTH-DEALER
You shouldn't have tracked me down here, Ren. These memories belong to the Syndicate.

REN
(drawing ion stunner)
They belong to the victims you wiped. Step away from the terminal.`,

  "proj-3": `TITLE: MIDNIGHT NOIR
LOGLINE: A 1940s jazz club pianist becomes entangled in a high-stakes art heist involving a corrupt police chief.

INT. BLUE NOTE CLUB - NIGHT

Thick cigarette smoke hangs over the velvet booths. Low saxophone plays from the corner stage.

LEO MORGAN (30), wearing a loosened bowtie, plays a melancholy C-minor chord on the upright piano.

CLARA (28) glides past the tables, sliding a sealed manila envelope onto the piano keys.

CLARA
(whispering)
Don't open it until the band plays the final set, Leo.

LEO
(without breaking tempo)
I told you I'm out of the game, Clara. The Chief has eyes on every door in this club.

CLARA
The Chief is the one who hired the thieves. Look under the stamp, Leo. That's his personal seal.

Leo pauses on the keys. A sharp dissonance rings out.

LEO
If Chief Vance finds out I have this...

CLARA
He won't. Not if we move before midnight.`,

  "proj-4": `TITLE: ECHOES OF THE DEEP
LOGLINE: A marine biologist and a rogue submarine captain descend into an uncharted trench to rescue a lost research team — and discover something ancient waiting below.

EXT. RESEARCH VESSEL NEREID - OCEAN SURFACE - DAWN

Grey swells roll beneath a steel-hulled research ship. Fog clings to the deck.

DR. MARA CHEN (36), sharp-eyed and windswept, stares at a sonar display bolted to the railing.

MARA
(into radio)
Control, we've lost contact with the Abyssal Station crew. Last ping was at 4,200 metres, fourteen hours ago.

CONTROL (V.O.)
Dr. Chen, recovery protocol requires a 72-hour wait before—

MARA
Fourteen hours of silence at crush depth is not a protocol problem. It's a survival problem.

INT. SUBMARINE LEVIATHAN - CONN TOWER - CONTINUOUS

CAPTAIN JONAS REED (45), unshaven and scarred, leans over a bathymetric chart glowing cyan.

JONAS
(without looking up)
You want to take my boat into the Keres Trench. Uncharted. Unpressurised below 5,000 metres.

MARA
Your boat is the only vessel rated for that depth.

JONAS
Rated and tested are two very different words, Doctor.

A deep, resonant PING echoes through the hull. Both freeze.

MARA
(whispering)
That signal... it's not from the station.

JONAS
No. It's coming from below it.`,
};

export const INITIAL_IMPROVEMENTS: ScriptImprovement[] = [
  {
    id: "imp-1",
    category: "Structure",
    title: "Tighten Act II Pacing & Escalation",
    rationale: "Act II pacing currently drifts between pp. 55-72. Inserting a secondary hazard during atmospheric entry sharpens urgency.",
    sceneLocation: "INT. SHUTTLE COCKPIT - MID-FLIGHT",
    pageRange: "pp. 55–72",
    originalSnippet: `MARCUS
The secondary generator is holding at sixty percent. We should reach orbital equilibrium in twenty minutes.

ALEX
Good. I'll recalibrate the sensor array while we wait.`,
    suggestedSnippet: `MARCUS
The secondary generator is flickering at forty percent! We have nine minutes before atmospheric drag pulls us into the storm's vortex!

ALEX
(recalibrating frantically)
Not if I channel the solar burst directly into the shields. Hold her steady, Marcus!`,
    applied: false,
  },
  {
    id: "imp-2",
    category: "Characters",
    title: "Sharpen Antagonist Motivation in Act I",
    rationale: "Director Hayes' objection feels overly bureaucratic. Anchoring his refusal in personal past tragedy elevates emotional stakes.",
    sceneLocation: "INT. MISSION CONTROL - BRIEFING ROOM",
    pageRange: "pp. 18–22",
    originalSnippet: `HAYES
Protocol strictly forbids unsanctioned launches during solar surges. Permission denied, Dr. Rivers.`,
    suggestedSnippet: `HAYES
I buried three pilot friends during the '38 flare storm, Alex. I won't let your idealism add two more names to the memorial wall. Mission aborted.`,
    applied: false,
  },
  {
    id: "imp-3",
    category: "Dialogue",
    title: "Eliminate Expositional Dialogue in Climax",
    rationale: "Replacing spoken scientific explanations with visual cockpit reactions heightens tension and visual storytelling.",
    sceneLocation: "INT. SHUTTLE COCKPIT - SOLAR EYE",
    pageRange: "pp. 88–92",
    originalSnippet: `ALEX
The ion density is three thousand particles per cubic centimeter! That means the radiation field is critical!`,
    suggestedSnippet: `ALEX
(watching the telemetry visor flash crimson)
Sensors are blinding out... It's off the charts!`,
    applied: false,
  },
  {
    id: "imp-4",
    category: "Structure",
    title: "Strengthen Inciting Incident Hook",
    rationale: "Moving the storm warning telemetry report to page 3 immediately establishes the clock for the entire script.",
    sceneLocation: "EXT. LUNAR OUTPOST - COMM TOWER",
    pageRange: "pp. 3–5",
    originalSnippet: `ALEX
I've been reviewing the monthly weather logs. Nothing unusual to report so far.`,
    suggestedSnippet: `ALEX
(staring at monitor)
This isn't a routine flare surge. The magnetosphere is bowing inwards right now!`,
    applied: false,
  },
  {
    id: "imp-5",
    category: "Characters",
    title: "Deepen Co-Pilot Marcus Backstory",
    rationale: "Adding a quiet character moment before launch shows Marcus' internal conflict regarding leaving the lunar dome.",
    sceneLocation: "INT. PRE-FLIGHT LOCKER ROOM",
    pageRange: "pp. 12–14",
    originalSnippet: `MARCUS
Just double checking the helmet seals. Ready when you are.`,
    suggestedSnippet: `MARCUS
(clasping his daughter's worn holopendant)
One last run, kiddo. Daddy promises he'll make it back for dinner.`,
    applied: false,
  },
  {
    id: "imp-6",
    category: "Dialogue",
    title: "Trim Redundant Subtext in Argument",
    rationale: "Shortening back-and-forth dialogue lines speeds up the rhythm of the debate in scene 14.",
    sceneLocation: "INT. HYPERBARIC LAB",
    pageRange: "pp. 34–36",
    originalSnippet: `ALEX
You don't trust my math because I failed the simulator test three years ago!

MARCUS
I don't trust your math because three years ago your simulator test destroyed the mock shuttle module!`,
    suggestedSnippet: `ALEX
You're still judging me by the simulator crash!

MARCUS
I'm judging you by the fact that we barely survived it!`,
    applied: false,
  },
];

export const INITIAL_CASTING: CastRole[] = [
  {
    id: "role-1",
    roleName: "Dr. Alex Rivers (Lead Protagonist)",
    ageRange: "30–38",
    vibe: "Determined, hyper-intelligent, emotionally guarded atmospheric scientist.",
    actorOptions: [
      {
        name: "Florence Pugh",
        fitScore: 96,
        starPowerScore: 94,
        budgetImpact: "High",
        imageTag: "FP",
        knownFor: "Dune: Part Two, Oppenheimer, Black Widow",
      },
      {
        name: "Gemma Chan",
        fitScore: 92,
        starPowerScore: 85,
        budgetImpact: "Medium",
        imageTag: "GC",
        knownFor: "Eternals, Crazy Rich Asians, Humans",
      },
      {
        name: "Cailee Spaeny",
        fitScore: 88,
        starPowerScore: 78,
        budgetImpact: "Low",
        imageTag: "CS",
        knownFor: "Alien: Romulus, Civil War, Priscilla",
      },
    ],
    selectedActor: "Gemma Chan",
  },
  {
    id: "role-2",
    roleName: "Captain Marcus Vane (Co-Pilot)",
    ageRange: "35–45",
    vibe: "Grounded, pragmatic veteran pilot with quiet charisma and family stakes.",
    actorOptions: [
      {
        name: "Oscar Isaac",
        fitScore: 95,
        starPowerScore: 92,
        budgetImpact: "High",
        imageTag: "OI",
        knownFor: "Dune, Moon Knight, Ex Machina",
      },
      {
        name: "Dev Patel",
        fitScore: 91,
        starPowerScore: 84,
        budgetImpact: "Medium",
        imageTag: "DP",
        knownFor: "Monkey Man, The Green Knight, Lion",
      },
      {
        name: "Alden Ehrenreich",
        fitScore: 87,
        starPowerScore: 75,
        budgetImpact: "Low",
        imageTag: "AE",
        knownFor: "Oppenheimer, Solo: A Star Wars Story",
      },
    ],
    selectedActor: "Dev Patel",
  },
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    category: "Talent & Cast",
    micro: { low: 80, high: 140 },
    indie: { low: 220, high: 450 },
    studio: { low: 800, high: 1800 },
  },
  {
    category: "Crew & HODs",
    micro: { low: 110, high: 180 },
    indie: { low: 280, high: 520 },
    studio: { low: 950, high: 1600 },
  },
  {
    category: "Locations & Stages",
    micro: { low: 45, high: 85 },
    indie: { low: 140, high: 260 },
    studio: { low: 400, high: 850 },
  },
  {
    category: "Gear, VFX & Practical Effects",
    micro: { low: 65, high: 120 },
    indie: { low: 210, high: 410 },
    studio: { low: 750, high: 1500 },
  },
  {
    category: "Post-Production & Sound Design",
    micro: { low: 40, high: 75 },
    indie: { low: 110, high: 220 },
    studio: { low: 350, high: 700 },
  },
  {
    category: "Insurance & Contingency (10%)",
    micro: { low: 35, high: 60 },
    indie: { low: 90, high: 180 },
    studio: { low: 320, high: 650 },
  },
];

export const INITIAL_LOCATIONS: LocationOption[] = [
  {
    id: "loc-1",
    region: "Atlanta & North Georgia",
    country: "United States",
    permitEase: "Fast Track",
    climateWindow: "Year-Round (Climate Controlled Soundstages)",
    taxIncentive: "30% Transferable Tax Credit",
    vibeMatch: "Ideal LED Volume & Sci-Fi stage availability with top-tier union crew.",
    pinned: true,
    matchScore: 96,
  },
  {
    id: "loc-2",
    region: "Vancouver & Okanagan Valley",
    country: "Canada",
    permitEase: "Fast Track",
    climateWindow: "May – October (Low precipitation for outdoor sets)",
    taxIncentive: "28–35% Foreign Production Credit",
    vibeMatch: "Desolate quarry landscapes matching lunar surfaces + world-class VFX post hubs.",
    pinned: true,
    matchScore: 93,
  },
  {
    id: "loc-3",
    region: "Almería (Tabernas Desert)",
    country: "Spain",
    permitEase: "Moderate",
    climateWindow: "September – April (Mild desert temperatures)",
    taxIncentive: "30–50% Cash Rebate for foreign shoots",
    vibeMatch: "Stunning barren desert topography for outer-rim lunar exterior plates.",
    pinned: false,
    matchScore: 88,
  },
];

export const GLOBAL_LOCATION_DATABASE: LocationOption[] = [
  {
    id: "loc-db-1",
    region: "Wellington & Stone Street Studios",
    country: "New Zealand",
    permitEase: "Fast Track",
    climateWindow: "October – April",
    taxIncentive: "35–40% International Screen Production Grant",
    vibeMatch: "World-class Wētā FX post-production integration & sci-fi virtual volume stages.",
    pinned: false,
    matchScore: 95,
  },
  {
    id: "loc-db-2",
    region: "Budapest & Korda Studios",
    country: "Hungary",
    permitEase: "Fast Track",
    climateWindow: "Year-Round",
    taxIncentive: "30% Direct Cash Rebate",
    vibeMatch: "Massive interior soundstage facilities & sci-fi futuristic set build infrastructure.",
    pinned: false,
    matchScore: 92,
  },
  {
    id: "loc-db-3",
    region: "Melbourne & Docklands Studios",
    country: "Australia",
    permitEase: "Fast Track",
    climateWindow: "November – March",
    taxIncentive: "40% Producer Offset + State Incentives",
    vibeMatch: "State-of-the-art LED volume stage & experienced VFX ocean tank facilities.",
    pinned: false,
    matchScore: 90,
  },
  {
    id: "loc-db-4",
    region: "Reykjavík & Highland Glaciers",
    country: "Iceland",
    permitEase: "Moderate",
    climateWindow: "May – September",
    taxIncentive: "35% Reimbursement Scheme",
    vibeMatch: "Unearthly volcanic volcanic landscapes ideal for exterior extraterrestrial plates.",
    pinned: false,
    matchScore: 89,
  },
  {
    id: "loc-db-5",
    region: "London & Pinewood Studios",
    country: "United Kingdom",
    permitEase: "Fast Track",
    climateWindow: "Year-Round",
    taxIncentive: "34% Audio-Visual Expenditure Credit (AVEC)",
    vibeMatch: "Top tier sci-fi feature soundstages & world-renowned creature FX teams.",
    pinned: false,
    matchScore: 94,
  },
  {
    id: "loc-db-6",
    region: "Ouarzazate & Atlas Studios",
    country: "Morocco",
    permitEase: "Moderate",
    climateWindow: "October – May",
    taxIncentive: "30% Cash Rebate for Foreign Shoots",
    vibeMatch: "Vast desert dune topography matching outer-rim desolate planet surfaces.",
    pinned: false,
    matchScore: 86,
  },
  {
    id: "loc-db-[#7]",
    region: "Oahu & Honolulu Filming Hub",
    country: "Hawaii, USA",
    permitEase: "Fast Track",
    climateWindow: "Year-Round",
    taxIncentive: "22–25% Tax Credit",
    vibeMatch: "Exotic coastal exterior landscapes for oceanic / planet surface plates.",
    pinned: false,
    matchScore: 87,
  },
  {
    id: "loc-db-8",
    region: "Prague & Barrandov Studios",
    country: "Czech Republic",
    permitEase: "Fast Track",
    climateWindow: "April – October",
    taxIncentive: "20% Film Production Rebate",
    vibeMatch: "Historic studio infrastructure with versatile set construction and union crews.",
    pinned: false,
    matchScore: 91,
  },
];

export interface SceneBreakdown {
  id: string;
  sceneNumber: number;
  slugline: string;
  setting: "INT" | "EXT";
  timeOfDay: "DAY" | "NIGHT" | "CONTINUOUS";
  pages: number;
  summary: string;
  characters: string[];
  vfxScore: number; // 1-5
  props: string[];
  estimatedMinutes: number;
}

export const INITIAL_SCENE_BREAKDOWNS: SceneBreakdown[] = [
  {
    id: "sc-1",
    sceneNumber: 1,
    slugline: "EXT. LUNAR BASE ALPHA - LAUNCH PAD - NIGHT",
    setting: "EXT",
    timeOfDay: "NIGHT",
    pages: 2.5,
    summary: "Alex checks telemetry in solar dust storm. Marcus warns of Ground Control lockdown.",
    characters: ["Dr. Alex Rivers", "Captain Marcus Vane"],
    vfxScore: 4,
    props: ["Telemetry visor", "Flight helmet", "Manual override keycard"],
    estimatedMinutes: 3.5,
  },
  {
    id: "sc-2",
    sceneNumber: 2,
    slugline: "INT. SHUTTLE COCKPIT - CONTINUOUS",
    setting: "INT",
    timeOfDay: "CONTINUOUS",
    pages: 1.8,
    summary: "Manual override ignition. Shuttle shakes as solar wind sweeps across windshield.",
    characters: ["Dr. Alex Rivers", "Captain Marcus Vane"],
    vfxScore: 5,
    props: ["Toggle panels", "Emergency lever", "Holopendant"],
    estimatedMinutes: 2.5,
  },
  {
    id: "sc-3",
    sceneNumber: 3,
    slugline: "INT. MISSION CONTROL - BRIEFING ROOM - DAY",
    setting: "INT",
    timeOfDay: "DAY",
    pages: 4.0,
    summary: "Director Hayes denies unsanctioned launch request, citing past flare casualty history.",
    characters: ["Director Hayes", "Dr. Alex Rivers"],
    vfxScore: 2,
    props: ["Holographic briefing map", "Comm datapad"],
    estimatedMinutes: 5.0,
  },
  {
    id: "sc-4",
    sceneNumber: 4,
    slugline: "INT. HYPERBARIC LAB - NIGHT",
    setting: "INT",
    timeOfDay: "NIGHT",
    pages: 3.2,
    summary: "Alex and Marcus debate past simulator crash while preparing high-altitude suit seals.",
    characters: ["Dr. Alex Rivers", "Captain Marcus Vane"],
    vfxScore: 1,
    props: ["Pressurized suits", "Diagnostic tablet"],
    estimatedMinutes: 4.0,
  },
  {
    id: "sc-5",
    sceneNumber: 5,
    slugline: "EXT. MAGNETOSPHERE CORRIDOR - DAY",
    setting: "EXT",
    timeOfDay: "DAY",
    pages: 5.1,
    summary: "Shuttle enters solar eye storm. Radiation shields flare as core sensors overload.",
    characters: ["Dr. Alex Rivers", "Captain Marcus Vane"],
    vfxScore: 5,
    props: ["Shield boost switch", "Telemetry visor"],
    estimatedMinutes: 6.5,
  },
];

export interface StoryboardConcept {
  id: string;
  sceneNumber: number;
  title: string;
  cameraSetup: string;
  lightingStyle: string;
  promptDescription: string;
  moodTags: string[];
  gradientStyle: string;
}

export const INITIAL_STORYBOARDS: StoryboardConcept[] = [
  {
    id: "sb-1",
    sceneNumber: 1,
    title: "Desolate Lunar Launch Pad",
    cameraSetup: "Low-Angle Wide (Anamorphic 35mm)",
    lightingStyle: "Harsh High-Contrast Solar Flare + Crimson Warning Strobe",
    promptDescription: "A lone explorer in a matte-white suit standing next to a weathered shuttle ramp under glowing amber solar dust.",
    moodTags: ["Isolation", "Imminent Danger", "Cinematic Sci-Fi"],
    gradientStyle: "from-amber-900/40 via-slate-900 to-indigo-950",
  },
  {
    id: "sb-2",
    sceneNumber: 2,
    title: "Ignition Cockpit Tremor",
    cameraSetup: "Extreme Close-Up on Helmet Visor Reflection",
    lightingStyle: "Pulsing Emerald Telemetry & Amber Ignition Glow",
    promptDescription: "Tight shot on Alex's eyes reflected in the gold-coated visor, with intense amber engine flare illuminating her face.",
    moodTags: ["High Tension", "Intimate", "Climax"],
    gradientStyle: "from-emerald-950/60 via-slate-900 to-amber-950",
  },
  {
    id: "sb-3",
    sceneNumber: 5,
    title: "Solar Eye Storm Vortex",
    cameraSetup: "Tracking Overhead Bird's Eye Shot",
    lightingStyle: "Liquid Gold Plasma Whirling Over Deep Space Black",
    promptDescription: "Sleek exploration craft diving through a swirling hurricane of golden plasma radiation.",
    moodTags: ["Epic Scale", "Visually Stunning", "Climactic"],
    gradientStyle: "from-[#FF6F00]/30 via-[#0F294D] to-black",
  },
];

export interface ProjectOption {
  id: string;
  title: string;
  author: string;
  logline: string;
  pages: number;
  scenesCount: number;
  draftVersion: string;
  budgetTier: "Micro" | "Indie" | "Studio";
  genre?: string;
  tagline?: string;
  gradient?: string;
  highlights?: string[];
}

export const SAMPLE_PROJECTS: ProjectOption[] = [
  {
    id: "proj-1",
    title: "The Golden Horizon",
    author: "Elena Vance & Marcus Wright",
    logline: "A disgraced atmospheric scientist and an idealistic pilot embark on a clandestine flight into a solar storm to retrieve energy data.",
    pages: 114,
    scenesCount: 9,
    draftVersion: "v1.4 - Active",
    budgetTier: "Indie",
    genre: "Sci-Fi / Adventure",
    tagline: "Into the heart of the solar storm.",
    gradient: "from-[#0F294D] via-[#1E3A8A] to-[#FF6F00]",
    highlights: ["3 Dialogue Rewrites", "5 Breakdown Scenes", "LED Stage Compatible"],
  },
  {
    id: "proj-2",
    title: "Neo-Tokyo Cyberpunk",
    author: "Kenji Sato",
    logline: "In a flooded 2088 megacity, a synthetic investigator uncovers a memory theft syndicate in the neon underbelly.",
    pages: 122,
    scenesCount: 14,
    draftVersion: "v2.1 - Revised",
    budgetTier: "Studio",
    genre: "Cyberpunk / Mystery",
    tagline: "Memories can be stolen. Truth cannot.",
    gradient: "from-[#111827] via-[#4C1D95] to-[#EC4899]",
    highlights: ["High VFX Density", "Studio Production Plan", "Anamorphic Shot Concepts"],
  },
  {
    id: "proj-3",
    title: "Midnight Noir",
    author: "Sarah Jenkins",
    logline: "A 1940s jazz club pianist becomes entangled in a high-stakes art heist involving a corrupt police chief.",
    pages: 98,
    scenesCount: 8,
    draftVersion: "v1.0 - Draft",
    budgetTier: "Micro",
    genre: "Crime / Noir Drama",
    tagline: "Every shadow holds a secret.",
    gradient: "from-[#1C1917] via-[#44403C] to-[#B45309]",
    highlights: ["Location Incentive Match", "Tight Micro Budget", "Character-Driven Scenes"],
  },
  {
    id: "proj-4",
    title: "Echoes of the Deep",
    author: "Priya Dasgupta",
    logline: "A marine biologist and a rogue submarine captain descend into an uncharted trench to rescue a lost research team — and discover something ancient waiting below.",
    pages: 108,
    scenesCount: 11,
    draftVersion: "v1.2 - Revised",
    budgetTier: "Studio",
    genre: "Thriller / Sci-Fi",
    tagline: "The abyss has been listening.",
    gradient: "from-[#0C4A6E] via-[#155E75] to-[#06B6D4]",
    highlights: ["Underwater VFX Pipeline", "Practical Tank Stages", "Dolby Atmos Sound Design"],
  },
];

