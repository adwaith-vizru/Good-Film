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

INT. MISSION CONTROL - BRIEFING ROOM - NIGHT

DIRECTOR HAYES (52) slams a tablet onto the glass conference table.

HAYES
Protocol strictly forbids unsanctioned launches during solar surges. Permission denied, Dr. Rivers.

ALEX
Then override them. We didn't trek across the Mare Tranquillitatis just to turn around.

INT. SHUTTLE COCKPIT - MID-FLIGHT

The cockpit hums with high-frequency static. Alarm klaxons sound softly in the background.

MARCUS
The secondary generator is holding at sixty percent. We should reach orbital equilibrium in twenty minutes.

ALEX
Good. I'll recalibrate the sensor array while we wait.

INT. SHUTTLE COCKPIT - SOLAR EYE

The shuttle shakes violently as the engines ignite. Outside, the solar winds whirl like liquid gold.

ALEX
The ion density is three thousand particles per cubic centimeter! That means the radiation field is critical!`;

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
    rationale: "Act II pacing currently drifts between Pages 55–72. Inserting a secondary hazard during atmospheric entry sharpens urgency.",
    sceneLocation: "INT. SHUTTLE COCKPIT - MID-FLIGHT",
    pageRange: "Pages 55–72",
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
    pageRange: "Pages 18–22",
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
    pageRange: "Pages 88–92",
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
    pageRange: "Pages 3–5",
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
    pageRange: "Pages 12–14",
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
    pageRange: "Pages 34–36",
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

// Expanded actor database for search popup in Casting card
export interface ActorSearchEntry {
  name: string;
  fitScore: number;
  starPowerScore: number;
  budgetImpact: "Low" | "Medium" | "High";
  imageTag: string;
  knownFor: string;
  genre: string;
  gender: "M" | "F" | "NB";
  ageRange: string;
}

export const AI_ACTOR_DATABASE: ActorSearchEntry[] = [
  { name: "Florence Pugh", fitScore: 96, starPowerScore: 94, budgetImpact: "High", imageTag: "FP", knownFor: "Dune: Part Two, Oppenheimer, Black Widow", genre: "Sci-Fi / Drama", gender: "F", ageRange: "25-35" },
  { name: "Gemma Chan", fitScore: 92, starPowerScore: 85, budgetImpact: "Medium", imageTag: "GC", knownFor: "Eternals, Crazy Rich Asians, Humans", genre: "Sci-Fi / Drama", gender: "F", ageRange: "30-40" },
  { name: "Cailee Spaeny", fitScore: 88, starPowerScore: 78, budgetImpact: "Low", imageTag: "CS", knownFor: "Alien: Romulus, Civil War, Priscilla", genre: "Sci-Fi / Thriller", gender: "F", ageRange: "20-30" },
  { name: "Zendaya", fitScore: 94, starPowerScore: 98, budgetImpact: "High", imageTag: "ZD", knownFor: "Dune, Euphoria, Spider-Man", genre: "Sci-Fi / Drama", gender: "F", ageRange: "22-32" },
  { name: "Saoirse Ronan", fitScore: 91, starPowerScore: 88, budgetImpact: "Medium", imageTag: "SR", knownFor: "Little Women, Lady Bird, Brooklyn", genre: "Drama / Period", gender: "F", ageRange: "25-35" },
  { name: "Anya Taylor-Joy", fitScore: 93, starPowerScore: 92, budgetImpact: "High", imageTag: "AT", knownFor: "Furiosa, The Queen's Gambit, Last Night in Soho", genre: "Action / Thriller", gender: "F", ageRange: "22-32" },
  { name: "Lupita Nyong'o", fitScore: 90, starPowerScore: 89, budgetImpact: "Medium", imageTag: "LN", knownFor: "Black Panther, Us, 12 Years a Slave", genre: "Action / Drama", gender: "F", ageRange: "30-42" },
  { name: "Jenna Ortega", fitScore: 87, starPowerScore: 86, budgetImpact: "Medium", imageTag: "JO", knownFor: "Wednesday, Scream VI, Beetlejuice 2", genre: "Horror / Comedy", gender: "F", ageRange: "18-28" },
  { name: "Margot Robbie", fitScore: 90, starPowerScore: 96, budgetImpact: "High", imageTag: "MR", knownFor: "Barbie, Once Upon a Time in Hollywood, I Tonya", genre: "Drama / Comedy", gender: "F", ageRange: "28-38" },
  { name: "Thomasin McKenzie", fitScore: 86, starPowerScore: 76, budgetImpact: "Low", imageTag: "TM", knownFor: "Last Night in Soho, Jojo Rabbit, Leave No Trace", genre: "Drama / Thriller", gender: "F", ageRange: "20-30" },
  { name: "Oscar Isaac", fitScore: 95, starPowerScore: 92, budgetImpact: "High", imageTag: "OI", knownFor: "Dune, Moon Knight, Ex Machina", genre: "Sci-Fi / Drama", gender: "M", ageRange: "35-50" },
  { name: "Dev Patel", fitScore: 91, starPowerScore: 84, budgetImpact: "Medium", imageTag: "DP", knownFor: "Monkey Man, The Green Knight, Lion", genre: "Action / Drama", gender: "M", ageRange: "28-40" },
  { name: "Alden Ehrenreich", fitScore: 87, starPowerScore: 75, budgetImpact: "Low", imageTag: "AE", knownFor: "Oppenheimer, Solo: A Star Wars Story", genre: "Sci-Fi / Drama", gender: "M", ageRange: "28-38" },
  { name: "Timothée Chalamet", fitScore: 94, starPowerScore: 97, budgetImpact: "High", imageTag: "TC", knownFor: "Dune, Call Me by Your Name, Wonka", genre: "Sci-Fi / Drama", gender: "M", ageRange: "22-32" },
  { name: "Pedro Pascal", fitScore: 93, starPowerScore: 95, budgetImpact: "High", imageTag: "PP", knownFor: "The Last of Us, The Mandalorian, Narcos", genre: "Sci-Fi / Action", gender: "M", ageRange: "38-52" },
  { name: "Paul Mescal", fitScore: 89, starPowerScore: 82, budgetImpact: "Medium", imageTag: "PM", knownFor: "Gladiator II, Normal People, Aftersun", genre: "Drama / Action", gender: "M", ageRange: "25-35" },
  { name: "Barry Keoghan", fitScore: 88, starPowerScore: 81, budgetImpact: "Medium", imageTag: "BK", knownFor: "Saltburn, The Banshees of Inisherin, Eternals", genre: "Thriller / Drama", gender: "M", ageRange: "25-35" },
  { name: "Jonathan Majors", fitScore: 86, starPowerScore: 79, budgetImpact: "Low", imageTag: "JM", knownFor: "Creed III, Magazine Dreams, Devotion", genre: "Drama / Action", gender: "M", ageRange: "28-40" },
  { name: "Glen Powell", fitScore: 87, starPowerScore: 83, budgetImpact: "Medium", imageTag: "GP", knownFor: "Top Gun: Maverick, Anyone but You, Twisters", genre: "Action / Comedy", gender: "M", ageRange: "28-38" },
  { name: "Austin Butler", fitScore: 90, starPowerScore: 88, budgetImpact: "Medium", imageTag: "AB", knownFor: "Elvis, Dune: Part Two, The Bikeriders", genre: "Drama / Sci-Fi", gender: "M", ageRange: "26-36" },
  { name: "Ke Huy Quan", fitScore: 85, starPowerScore: 80, budgetImpact: "Low", imageTag: "KQ", knownFor: "Everything Everywhere All at Once, Loki", genre: "Sci-Fi / Action", gender: "M", ageRange: "45-55" },
  { name: "Stephanie Hsu", fitScore: 84, starPowerScore: 74, budgetImpact: "Low", imageTag: "SH", knownFor: "Everything Everywhere All at Once, The Marvelous Mrs. Maisel", genre: "Sci-Fi / Comedy", gender: "F", ageRange: "25-38" },
  { name: "Mia Goth", fitScore: 86, starPowerScore: 77, budgetImpact: "Low", imageTag: "MG", knownFor: "Pearl, X, MaXXXine", genre: "Horror / Thriller", gender: "F", ageRange: "25-35" },
  { name: "LaKeith Stanfield", fitScore: 89, starPowerScore: 83, budgetImpact: "Medium", imageTag: "LS", knownFor: "Atlanta, Get Out, Sorry to Bother You", genre: "Sci-Fi / Thriller", gender: "M", ageRange: "28-38" },
];

// AI Budget Suggestion templates per tier
export interface AIBudgetSuggestion {
  category: string;
  low: number;
  high: number;
  aiNote: string;
}

export const getAIBudgetSuggestions = (
  tier: "Micro" | "Indie" | "Studio",
  castBudgetLow: number,
  castBudgetHigh: number
): AIBudgetSuggestion[] => {
  const base = BUDGET_CATEGORIES.map((cat) => {
    const vals = tier === "Micro" ? cat.micro : tier === "Indie" ? cat.indie : cat.studio;
    let aiNote = "";
    if (cat.category === "Talent & Cast") {
      aiNote = "Auto-calculated from your cast selections. Adjust in casting card.";
      return { category: cat.category, low: castBudgetLow || vals.low, high: castBudgetHigh || vals.high, aiNote };
    }
    if (cat.category === "Crew & HODs") aiNote = `Recommended ${tier} scale crew. Includes key HODs: DP, AD, Production Designer, Costume, Gaffer.`;
    else if (cat.category === "Locations & Stages") aiNote = `Based on ${tier === "Studio" ? "LED volume + soundstage" : tier === "Indie" ? "regional location" : "local"} shooting.`;
    else if (cat.category === "Gear, VFX & Practical Effects") aiNote = `${tier === "Studio" ? "Full CG pipeline + practical SFX" : tier === "Indie" ? "Moderate VFX + practical" : "Minimal VFX, practical focus"}.`;
    else if (cat.category === "Post-Production & Sound Design") aiNote = `${tier === "Studio" ? "Dolby Atmos mix, DI, full color grade" : "Standard post pipeline"}.`;
    else if (cat.category === "Insurance & Contingency (10%)") aiNote = "Industry standard 10% contingency buffer.";
    return { category: cat.category, low: vals.low, high: vals.high, aiNote };
  });
  return base;
};

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

// Multi-Project Data Types & Storage
export interface ActPacingItem {
  act: string;
  label: string;
  score: number;
  status: string;
}

export interface RiskItem {
  title: string;
  impact: string;
  tag: string;
}

export interface ScriptSnapshotData {
  verdict: string;
  overallScore: number;
  actPacing: ActPacingItem[];
  strengths: string[];
  opportunities: string[];
  topRisks: RiskItem[];
  productionTierLabel: string;
  estimatedBudgetRange: string;
}

export const PROJECT_SNAPSHOTS: Record<string, ScriptSnapshotData> = {
  "proj-1": {
    verdict: "Compelling sci-fi thriller with strong protagonist drive; Act II pacing & antagonist depth need targeted polish.",
    overallScore: 78,
    actPacing: [
      { act: "Act I (Pages 1–30)", label: "Inciting Incident & Hook", score: 92, status: "Tightly Paced" },
      { act: "Act II (Pages 31–85)", label: "Solar Entry & Orbital Transit", score: 68, status: "Needs Polish" },
      { act: "Act III (Pages 86–114)", label: "Solar Eye Climax", score: 88, status: "High Tension" },
    ],
    strengths: [
      "Clear protagonist journey & high-stakes survival goal (Dr. Alex Rivers)",
      "Visually evocative scene descriptions across desolate lunar set pieces",
      "Tightly written Act I setup with immediate 10-minute solar magnetosphere clock",
    ],
    opportunities: [
      "Act II pacing drifts around Pages 55–72 during orbital transit sequence",
      "Antagonist motivation under-defined in Director Hayes briefing room scene",
      "Climactic dialogue relies on scientific exposition instead of visual subtext",
    ],
    topRisks: [
      { title: "High VFX Density in Solar Eye Climax", impact: "Est. +$350K to post budget", tag: "High Impact" },
      { title: "Ext. Night Exterior Lighting Setup", impact: "Demands high-power LED volume or stage rigging", tag: "Medium Impact" },
    ],
    productionTierLabel: "Indie Tier",
    estimatedBudgetRange: "Est. $4.5M – $8M",
  },
  "proj-2": {
    verdict: "Atmospheric cyberpunk mystery with incredible visual direction; mid-Act II memory vault chase needs structural trimming.",
    overallScore: 84,
    actPacing: [
      { act: "Act I (Pages 1–32)", label: "Neon Alley & Memory Heist Hook", score: 88, status: "Fast-Paced" },
      { act: "Act II (Pages 33–90)", label: "Flooded Underbelly & Server Vault", score: 72, status: "Needs Polish" },
      { act: "Act III (Pages 91–122)", label: "Syndicate Server Core Confrontation", score: 94, status: "High Tension" },
    ],
    strengths: [
      "Rich cyberpunk worldbuilding & rain-slicked neon visual aesthetic",
      "Compelling synthetic detective protagonist arc (Detective Ren)",
      "High-concept memory theft premise with strong studio franchise appeal",
    ],
    opportunities: [
      "Act II memory vault sequence drags between Pages 58–74 during server navigation",
      "Echo-4 neural AI partner requires deeper emotional subtext and back-and-forth",
      "Cybernetic terminology overload slows dialogue rhythm in Scene 7",
    ],
    topRisks: [
      { title: "Heavy Holographic Core & Neural VFX Density", impact: "Est. +$650K for synth FX & neon rendering", tag: "High Impact" },
      { title: "Indoor Rain Tank & Stage Water Logistics", impact: "Requires dedicated studio wet stage", tag: "High Impact" },
    ],
    productionTierLabel: "Studio Tier",
    estimatedBudgetRange: "Est. $15M – $25M",
  },
  "proj-3": {
    verdict: "Tightly scripted 1940s noir thriller with exceptional dialogue subtext; minor polish needed for Chief Vance's betrayal reveal.",
    overallScore: 89,
    actPacing: [
      { act: "Act I (Pages 1–25)", label: "Blue Note Club & Envelope Setup", score: 90, status: "Intimate Setup" },
      { act: "Act II (Pages 26–70)", label: "Heist Planning & Police Standoff", score: 82, status: "Well Paced" },
      { act: "Act III (Pages 71–98)", label: "Midnight Exchange & Pier Reveal", score: 86, status: "Climactic Twist" },
    ],
    strengths: [
      "Exceptional subtext-rich dialogue economy (88/100 dialogue score)",
      "Highly practical, low-cost location setup suited for indie/micro budget",
      "Compelling jazz piano rhythm framing every scene tension curve",
    ],
    opportunities: [
      "Clara's heist involvement rationale needs earlier emotional grounding",
      "Police HQ interrogation scene on Pages 78–84 drags slightly before climax",
      "Saxophone solo transition in Scene 4 needs smoother visual pacing",
    ],
    topRisks: [
      { title: "Vintage 1940s Period Costuming & Props", impact: "Requires authentic period cars & wardrobe", tag: "Medium Impact" },
      { title: "Night Exterior Wet-Down & Strobe Rigging", impact: "Practical street lighting & rain trucks needed", tag: "Low Impact" },
    ],
    productionTierLabel: "Micro Tier",
    estimatedBudgetRange: "Est. $800K – $1.5M",
  },
  "proj-4": {
    verdict: "Visceral underwater sci-fi thriller with claustrophobic tension; Act II submarine descent requires streamlined technical jargon.",
    overallScore: 81,
    actPacing: [
      { act: "Act I (Pages 1–28)", label: "Surface Distress & Sub Crew Setup", score: 86, status: "Tightly Paced" },
      { act: "Act II (Pages 29–80)", label: "Keres Trench Descent & Pressure Spike", score: 70, status: "Needs Polish" },
      { act: "Act III (Pages 81–108)", label: "Abyssal Station Rescue & Ancient Ping", score: 91, status: "High Tension" },
    ],
    strengths: [
      "Masterful claustrophobic atmospheric tension and sound design potential",
      "Dynamic clash of philosophies between Dr. Mara Chen & Captain Jonas Reed",
      "High-concept mystery surrounding deep sea sonar pings in trench floor",
    ],
    opportunities: [
      "Sonar and bathymetric technical jargon drags during Pages 52–68",
      "Submarine ballast engine repair subplot slows dramatic momentum",
      "Control room radio static exposition could be conveyed visually",
    ],
    topRisks: [
      { title: "Underwater Submarine Stage & Practical Water Tank", impact: "Est. +$500K for water gimbal tank shoots", tag: "High Impact" },
      { title: "Abyssal Spatial Audio & Dolby Sonar Mixing", impact: "Requires Dolby Atmos spatial sound mix", tag: "Medium Impact" },
    ],
    productionTierLabel: "Studio Tier",
    estimatedBudgetRange: "Est. $12M – $20M",
  },
};

export const PROJECT_IMPROVEMENTS: Record<string, ScriptImprovement[]> = {
  "proj-1": INITIAL_IMPROVEMENTS,
  "proj-2": [
    {
      id: "imp-201",
      category: "Structure",
      title: "Tighten Sector 7 Neon Alley Chase Pacing",
      rationale: "Act II pacing currently drifts in Sector 7 alley. Elevating the neural purge clock sharpens dramatic tension.",
      sceneLocation: "EXT. SECTOR 7 - NEON ALLEYWAY",
      pageRange: "Pages 58–74",
      originalSnippet: `REN
(into neural-link)
Echo-4, scan the alley. The memory smuggler passed through here forty seconds ago.

ECHO-4 (V.O.)
Signal detected. Traces of raw bio-data left on the optic terminal near the ramen stall.`,
      suggestedSnippet: `REN
(into neural-link)
Echo-4! The memory smuggler's neural trace is fading fast!

ECHO-4 (V.O.)
(alarm blaring)
Signal detected! Bio-data decay rate is critical near the ramen stall! We have twenty seconds before full purge!`,
      applied: false,
    },
    {
      id: "imp-202",
      category: "Characters",
      title: "Deepen Detective Ren's Synthetic Backstory",
      rationale: "Ren's internal conflict regarding his own erased human memories elevates emotional engagement in Act I.",
      sceneLocation: "EXT. SECTOR 7 - NEON ALLEYWAY",
      pageRange: "Pages 15–20",
      originalSnippet: `REN (32), a synthetic detective with optics glowing ice-blue, pulls his rain-soaked trench coat tight.`,
      suggestedSnippet: `REN (32), a synthetic detective with ice-blue optics flickering with fragmented memories, clutches his rain-soaked trench coat.`,
      applied: false,
    },
    {
      id: "imp-203",
      category: "Dialogue",
      title: "Sharpen Syndicate Boss Confrontation",
      rationale: "Replacing corporate jargon with a high-stakes psychological bribe heightens climactic dialogue.",
      sceneLocation: "INT. UNDERGROUND MEMORY VAULT",
      pageRange: "Pages 92–98",
      originalSnippet: `SYNTH-DEALER
You shouldn't have tracked me down here, Ren. These memories belong to the Syndicate.`,
      suggestedSnippet: `SYNTH-DEALER
Walk away, Ren. In this bio-chip is your original human memory—the only piece of your past left. Destroy me, and you destroy yourself.`,
      applied: false,
    },
    {
      id: "imp-204",
      category: "Structure",
      title: "Enhance Acid-Rain Visual Atmosphere",
      rationale: "Establishing acid rain weather hazards on page 4 immediately grounds the flooded cyberpunk setting.",
      sceneLocation: "EXT. SECTOR 7 ALLEYWAY",
      pageRange: "Pages 4–8",
      originalSnippet: `Acid rain slicks the chrome cobblestones. Neon signs flicker in Japanese and High-Tech script.`,
      suggestedSnippet: `Corrosive acid rain sizzles on chrome cobblestones. Neon signs flicker wildly in Japanese and High-Tech script.`,
      applied: false,
    },
  ],
  "proj-3": [
    {
      id: "imp-301",
      category: "Structure",
      title: "Escalate Blue Note Club Heist Tension",
      rationale: "Introducing Police Chief Vance's unexpected arrival at the club during scene 12 escalates Act II danger.",
      sceneLocation: "INT. BLUE NOTE CLUB",
      pageRange: "Pages 45–60",
      originalSnippet: `LEO
(without breaking tempo)
I told you I'm out of the game, Clara. The Chief has eyes on every door in this club.`,
      suggestedSnippet: `LEO
(without breaking tempo)
I told you I'm out of the game, Clara! Chief Vance's squad car just pulled up out front!`,
      applied: false,
    },
    {
      id: "imp-302",
      category: "Characters",
      title: "Flesh out Clara's High-Stakes Dilemma",
      rationale: "Anchoring Clara's heist motive in protecting her brother's framed reputation elevates character sympathy.",
      sceneLocation: "INT. BLUE NOTE CLUB",
      pageRange: "Pages 10–14",
      originalSnippet: `CLARA
The Chief is the one who hired the thieves. Look under the stamp, Leo. That's his personal seal.`,
      suggestedSnippet: `CLARA
(hands trembling)
The Chief framed my brother for the heist, Leo. Look under the stamp—that's his personal seal!`,
      applied: false,
    },
    {
      id: "imp-303",
      category: "Dialogue",
      title: "Sharpen Chief Vance Interrogation Subtext",
      rationale: "Replacing blunt threats with subtle, rhythmically paced subtext makes the police chief far more menacing.",
      sceneLocation: "INT. BLUE NOTE CLUB",
      pageRange: "Pages 78–84",
      originalSnippet: `LEO
If Chief Vance finds out I have this...

CLARA
He won't. Not if we move before midnight.`,
      suggestedSnippet: `LEO
If Vance catches us with his seal...

CLARA
He won't. Not if we play our final set and disappear before midnight.`,
      applied: false,
    },
  ],
  "proj-4": [
    {
      id: "imp-401",
      category: "Structure",
      title: "Heighten Keres Trench Descent Pressure",
      rationale: "Act II pacing currently drifts on Pages 52–68. Injecting hull pressure cracks elevates claustrophobic urgency.",
      sceneLocation: "INT. SUBMARINE LEVIATHAN - CONN TOWER",
      pageRange: "Pages 52–68",
      originalSnippet: `JONAS
(without looking up)
You want to take my boat into the Keres Trench. Uncharted. Unpressurised below 5,000 metres.`,
      suggestedSnippet: `JONAS
(bulkhead rivet snaps like a gunshot)
Depth 4,800! We're three hundred metres past safe hull collapse limits! The Keres Trench will crush us!`,
      applied: false,
    },
    {
      id: "imp-402",
      category: "Characters",
      title: "Strengthen Dr. Mara Chen & Captain Jonas Conflict",
      rationale: "Personal backstory regarding Jonas' lost crew deepens emotional resonance before trench entry.",
      sceneLocation: "INT. SUBMARINE LEVIATHAN - CONN TOWER",
      pageRange: "Pages 16–22",
      originalSnippet: `MARA
Your boat is the only vessel rated for that depth.

JONAS
Rated and tested are two very different words, Doctor.`,
      suggestedSnippet: `MARA
Your boat is the only vessel rated for that depth.

JONAS
Five years ago I left four crewmen at the bottom of that trench, Doctor. Rated and tested are two very different words.`,
      applied: false,
    },
    {
      id: "imp-403",
      category: "Dialogue",
      title: "Eliminate Sonar Exposition in Climax",
      rationale: "Replacing spoken sonar calculations with visual ocean viewport reactions heightens climactic awe.",
      sceneLocation: "INT. SUBMARINE LEVIATHAN - CONN TOWER",
      pageRange: "Pages 85–92",
      originalSnippet: `MARA
(whispering)
That signal... it's not from the station.

JONAS
No. It's coming from below it.`,
      suggestedSnippet: `MARA
(staring out viewport as massive bioluminescent rings ignite in the dark)
Jonas... look at the trench floor. That's no natural station ping.

JONAS
(whispering)
No. It's something ancient awakening below us.`,
      applied: false,
    },
  ],
};

export const PROJECT_SCENES: Record<string, SceneBreakdown[]> = {
  "proj-1": INITIAL_SCENE_BREAKDOWNS,
  "proj-2": [
    {
      id: "sc-201",
      sceneNumber: 1,
      slugline: "EXT. SECTOR 7 - NEON ALLEYWAY - NIGHT",
      setting: "EXT",
      timeOfDay: "NIGHT",
      pages: 3.2,
      summary: "Detective Ren tracks a memory smuggler through acid-rain slicked cyberpunk alleys.",
      characters: ["Detective Ren", "Echo-4 (V.O.)"],
      vfxScore: 4,
      props: ["Neural scanner", "Ion stunner", "Synthetic trenchcoat"],
      estimatedMinutes: 3.5,
    },
    {
      id: "sc-202",
      sceneNumber: 2,
      slugline: "INT. UNDERGROUND MEMORY VAULT - CONTINUOUS",
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 4.8,
      summary: "Ren confronts a synth-dealer amidst towering holographic server racks leaking bio-data.",
      characters: ["Detective Ren", "Synth Dealer"],
      vfxScore: 5,
      props: ["Bio-chip container", "Optic terminal"],
      estimatedMinutes: 5.0,
    },
    {
      id: "sc-203",
      sceneNumber: 3,
      slugline: "INT. SYNDICATE SERVER CORE - NIGHT",
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 5.5,
      summary: "Climactic standoff inside the syndicate neural core as purge protocols melt stolen memories.",
      characters: ["Detective Ren", "Syndicate Boss", "Echo-4"],
      vfxScore: 5,
      props: ["Master override key", "Neural port cable"],
      estimatedMinutes: 6.0,
    },
  ],
  "proj-3": [
    {
      id: "sc-301",
      sceneNumber: 1,
      slugline: "INT. BLUE NOTE CLUB - NIGHT",
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 4.0,
      summary: "Leo plays melancholic piano while Clara slides him a sealed manila envelope containing stolen art blueprints.",
      characters: ["Leo Morgan", "Clara"],
      vfxScore: 1,
      props: ["Upright piano", "Manila envelope", "Whiskey glass"],
      estimatedMinutes: 4.0,
    },
    {
      id: "sc-302",
      sceneNumber: 2,
      slugline: "INT. POLICE HEADQUARTERS - INTERROGATION",
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 3.5,
      summary: "Corrupt Police Chief Vance interrogates Leo under harsh overhead spotlights.",
      characters: ["Leo Morgan", "Chief Vance"],
      vfxScore: 1,
      props: ["Steel desk", "Record player", "Brass badge"],
      estimatedMinutes: 3.5,
    },
    {
      id: "sc-303",
      sceneNumber: 3,
      slugline: "EXT. FOGGY PIER - MIDNIGHT",
      setting: "EXT",
      timeOfDay: "NIGHT",
      pages: 4.5,
      summary: "High-stakes painting exchange at the docks as fog rolls off the river.",
      characters: ["Leo Morgan", "Clara", "Chief Vance"],
      vfxScore: 2,
      props: ["Framed oil painting", "1942 sedan", "Revolver"],
      estimatedMinutes: 5.0,
    },
  ],
  "proj-4": [
    {
      id: "sc-401",
      sceneNumber: 1,
      slugline: "EXT. RESEARCH VESSEL NEREID - DAWN",
      setting: "EXT",
      timeOfDay: "DAY",
      pages: 3.0,
      summary: "Dr. Mara Chen receives distress pings from the lost abyssal research station.",
      characters: ["Dr. Mara Chen"],
      vfxScore: 3,
      props: ["Sonar monitor", "Satellite phone"],
      estimatedMinutes: 3.0,
    },
    {
      id: "sc-402",
      sceneNumber: 2,
      slugline: "INT. SUBMARINE LEVIATHAN - COCKPIT",
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 5.2,
      summary: "Captain Jonas Reed pilots the sub past crush depth into the dark Keres Trench.",
      characters: ["Dr. Mara Chen", "Captain Jonas Reed"],
      vfxScore: 4,
      props: ["Pressure gauge", "Control yoke", "Floodlight switch"],
      estimatedMinutes: 5.5,
    },
    {
      id: "sc-403",
      sceneNumber: 3,
      slugline: "INT. ABYSSAL STATION - AIRLOCK",
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 6.0,
      summary: "Climactic discovery on the trench floor as bioluminescent ancient structures light up.",
      characters: ["Dr. Mara Chen", "Captain Jonas Reed", "Dr. Aris Thorne"],
      vfxScore: 5,
      props: ["Dive suit", "Emergency flare", "Bioluminescent sample jar"],
      estimatedMinutes: 6.5,
    },
  ],
};

export const PROJECT_CASTING: Record<string, CastRole[]> = {
  "proj-1": INITIAL_CASTING,
  "proj-2": [
    {
      id: "role-201",
      roleName: "Detective Ren (Lead Synthetic Investigator)",
      ageRange: "30s",
      vibe: "Stoic, haunted, cybernetically enhanced detective",
      actorOptions: [
        { name: "Hiroyuki Sanada", fitScore: 96, starPowerScore: 92, budgetImpact: "High", imageTag: "Sanada", knownFor: "Shogun, John Wick 4" },
        { name: "Steven Yeun", fitScore: 93, starPowerScore: 89, budgetImpact: "Medium", imageTag: "Yeun", knownFor: "Beef, Minari" },
        { name: "Andrew Koji", fitScore: 90, starPowerScore: 82, budgetImpact: "Low", imageTag: "Koji", knownFor: "Warrior, Bullet Train" },
      ],
      selectedActor: "Hiroyuki Sanada",
    },
    {
      id: "role-202",
      roleName: "Echo-4 (Neural AI Partner)",
      ageRange: "20s-30s",
      vibe: "Analytical, protective voice & holographic companion",
      actorOptions: [
        { name: "Rinko Kikuchi", fitScore: 95, starPowerScore: 88, budgetImpact: "Medium", imageTag: "Kikuchi", knownFor: "Pacific Rim, Babel" },
        { name: "Karen Fukuhara", fitScore: 91, starPowerScore: 86, budgetImpact: "Low", imageTag: "Fukuhara", knownFor: "The Boys, Bullet Train" },
      ],
      selectedActor: "Rinko Kikuchi",
    },
  ],
  "proj-3": [
    {
      id: "role-301",
      roleName: "Leo Morgan (Jazz Pianist & Protagonist)",
      ageRange: "30s",
      vibe: "World-weary, soulful musician trapped in noir heist",
      actorOptions: [
        { name: "Oscar Isaac", fitScore: 97, starPowerScore: 94, budgetImpact: "High", imageTag: "Isaac", knownFor: "Inside Llewyn Davis, Dune" },
        { name: "Mahershala Ali", fitScore: 94, starPowerScore: 91, budgetImpact: "Medium", imageTag: "Ali", knownFor: "Green Book, Moonlight" },
      ],
      selectedActor: "Oscar Isaac",
    },
    {
      id: "role-302",
      roleName: "Clara (Femme Fatale Heist Lead)",
      ageRange: "20s-30s",
      vibe: "Sharp, elegant, desperate sister holding stolen blueprint",
      actorOptions: [
        { name: "Ana de Armas", fitScore: 96, starPowerScore: 95, budgetImpact: "High", imageTag: "DeArmas", knownFor: "Knives Out, No Time to Die" },
        { name: "Margot Robbie", fitScore: 92, starPowerScore: 98, budgetImpact: "High", imageTag: "Robbie", knownFor: "Barbie, Babylon" },
      ],
      selectedActor: "Ana de Armas",
    },
  ],
  "proj-4": [
    {
      id: "role-401",
      roleName: "Dr. Mara Chen (Lead Marine Biologist)",
      ageRange: "30s-40s",
      vibe: "Determined, scientific brilliance, fearless oceanic explorer",
      actorOptions: [
        { name: "Michelle Yeoh", fitScore: 98, starPowerScore: 96, budgetImpact: "High", imageTag: "Yeoh", knownFor: "Everything Everywhere All At Once" },
        { name: "Constance Wu", fitScore: 92, starPowerScore: 87, budgetImpact: "Medium", imageTag: "Wu", knownFor: "Crazy Rich Asians" },
      ],
      selectedActor: "Michelle Yeoh",
    },
    {
      id: "role-402",
      roleName: "Captain Jonas Reed (Rogue Submarine Captain)",
      ageRange: "40s",
      vibe: "Gritty, scarred, veteran deep-sea sub commander",
      actorOptions: [
        { name: "Mads Mikkelsen", fitScore: 97, starPowerScore: 93, budgetImpact: "High", imageTag: "Mikkelsen", knownFor: "Casino Royale, Hannibal" },
        { name: "Karl Urban", fitScore: 94, starPowerScore: 89, budgetImpact: "Medium", imageTag: "Urban", knownFor: "The Boys, Dredd" },
      ],
      selectedActor: "Mads Mikkelsen",
    },
  ],
};

export const PROJECT_STORYBOARDS: Record<string, StoryboardConcept[]> = {
  "proj-1": INITIAL_STORYBOARDS,
  "proj-2": [
    {
      id: "sb-201",
      sceneNumber: 1,
      title: "Sector 7 Rain & Neon Reflection",
      cameraSetup: "Low-Angle Tracking Shot (Anamorphic 35mm)",
      lightingStyle: "Bioluminescent Cyan Rim Lighting & High-Contrast Pink Neon",
      promptDescription: "Synthetic investigator in trenchcoat walking down acid-rain wet cobblestone alley reflected in neon puddles.",
      moodTags: ["Cyberpunk", "Atmospheric", "Noir"],
      gradientStyle: "from-purple-950/60 via-slate-900 to-cyan-950",
    },
    {
      id: "sb-202",
      sceneNumber: 2,
      title: "Memory Vault Bio-Chip Jack-In",
      cameraSetup: "Extreme Close-Up on Optical Lens Glow",
      lightingStyle: "Pulsing Emerald Telemetry & Server Matrix Glow",
      promptDescription: "Close-up on glowing bio-chip being inserted into neural port with micro-sparks.",
      moodTags: ["High Tech", "Tension", "Sci-Fi"],
      gradientStyle: "from-emerald-950/60 via-slate-900 to-amber-950",
    },
  ],
  "proj-3": [
    {
      id: "sb-301",
      sceneNumber: 1,
      title: "Blue Note Piano Stage Smoke",
      cameraSetup: "Medium Over-the-Shoulder Shot (85mm Lens)",
      lightingStyle: "Warm Amber Spotlight + Deep Sepia Shadows",
      promptDescription: "Jazz pianist fingers on ivory keys with cigarette smoke curling in amber spotlight.",
      moodTags: ["1940s Noir", "Intimate", "Melancholy"],
      gradientStyle: "from-amber-900/50 via-slate-900 to-black",
    },
  ],
  "proj-4": [
    {
      id: "sb-401",
      sceneNumber: 2,
      title: "Abyssal Trench Pressure Gauge Spike",
      cameraSetup: "Dutch Angle Medium Shot",
      lightingStyle: "Deep Cyan Floodlight + Crimson Pressure Strobe",
      promptDescription: "Submarine viewport looking into black ocean abyss with glowing bioluminescent rings in distance.",
      moodTags: ["Underwater Horror", "Claustrophobic", "High Tension"],
      gradientStyle: "from-cyan-950/70 via-slate-900 to-blue-950",
    },
  ],
};

// Dynamic Data Helpers for Project Switching & Custom Uploaded Scripts
export function getSnapshotDataForProject(project: ProjectOption): ScriptSnapshotData {
  if (PROJECT_SNAPSHOTS[project.id]) {
    return PROJECT_SNAPSHOTS[project.id];
  }
  return {
    verdict: `Automated AI coverage summary for "${project.title}": Compelling narrative premise; Act II pacing and subtext require targeted polish.`,
    overallScore: 82,
    actPacing: [
      { act: "Act I (Pages 1–30)", label: "Inciting Incident & Hook", score: 88, status: "Tightly Paced" },
      { act: "Act II (Pages 31–85)", label: "Mid-Section Escalation", score: 72, status: "Needs Polish" },
      { act: `Act III (Pages 86–${project.pages || 110})`, label: "Climax & Resolution", score: 90, status: "High Tension" },
    ],
    strengths: [
      `High-concept story structure framing "${project.title}"`,
      "Clear protagonist motivation established in opening scenes",
      "Visually distinct location set-pieces with strong cinematic potential",
    ],
    opportunities: [
      "Act II pacing drifts between Pages 50–70 during transitional sequences",
      "Secondary character motivation can be sharpened in key dialogue scenes",
    ],
    topRisks: [
      { title: "VFX & Location Budget Allocation", impact: "Est. tailored to scene breakdown complexity", tag: "Medium Impact" },
      { title: "Dialogue Subtext Optimization", impact: "Consolidate exposition in middle act", tag: "Low Impact" },
    ],
    productionTierLabel: `${project.budgetTier} Tier`,
    estimatedBudgetRange: project.budgetTier === "Studio" ? "Est. $10M – $25M" : project.budgetTier === "Micro" ? "Est. $500K – $1.5M" : "Est. $3M – $7M",
  };
}

export function getImprovementsForProject(project: ProjectOption): ScriptImprovement[] {
  if (PROJECT_IMPROVEMENTS[project.id]) {
    return PROJECT_IMPROVEMENTS[project.id];
  }
  return [
    {
      id: `imp-custom-1`,
      category: "Structure",
      title: `Optimize Act II Pacing & Urgency in ${project.title}`,
      rationale: `Act II pacing currently drifts mid-script. Elevating high-stakes consequences sharpens dramatic tension.`,
      sceneLocation: "INT. SHUTTLE COCKPIT - MID-FLIGHT",
      pageRange: "Pages 50–65",
      originalSnippet: `MARCUS
The secondary generator is holding at sixty percent. We should reach orbital equilibrium in twenty minutes.

ALEX
Good. I'll recalibrate the sensor array while we wait.`,
      suggestedSnippet: `MARCUS
(timer flashing red)
The secondary generator is flickering at thirty percent! We have less than five minutes before orbit decay!

ALEX
Hold her steady, Marcus! I'm rerouting main power now!`,
      applied: false,
    },
    {
      id: `imp-custom-2`,
      category: "Dialogue",
      title: "Eliminate Expositional Dialogue in Climax",
      rationale: "Replacing spoken explanations with visual reactions heightens tension and visual storytelling.",
      sceneLocation: "INT. MISSION CONTROL - BRIEFING ROOM",
      pageRange: "Pages 85–95",
      originalSnippet: `HAYES
Protocol strictly forbids unsanctioned launches during solar surges. Permission denied, Dr. Rivers.`,
      suggestedSnippet: `HAYES
(slamming table)
I lost two pilots to solar storms last year, Alex. I won't let you throw your lives away. Launch denied!`,
      applied: false,
    },
  ];
}

export function getScenesForProject(project: ProjectOption): SceneBreakdown[] {
  if (PROJECT_SCENES[project.id]) {
    return PROJECT_SCENES[project.id];
  }
  return [
    {
      id: `sc-custom-1`,
      sceneNumber: 1,
      slugline: `EXT. ${project.title.toUpperCase()} - OPENING LOCATION`,
      setting: "EXT",
      timeOfDay: "DAY",
      pages: 4.0,
      summary: `Opening sequence introducing main characters and world setup for ${project.title}.`,
      characters: ["Lead Character", "Supporting Role"],
      vfxScore: 3,
      props: ["Key prop 1", "Communication gear"],
      estimatedMinutes: 4.0,
    },
    {
      id: `sc-custom-2`,
      sceneNumber: 2,
      slugline: `INT. MAIN HEADQUARTERS - CONTINUOUS`,
      setting: "INT",
      timeOfDay: "NIGHT",
      pages: 5.5,
      summary: "High stakes dialogue scene establishing inciting incident and central conflict.",
      characters: ["Lead Character", "Antagonist"],
      vfxScore: 2,
      props: ["Control panel", "Security badge"],
      estimatedMinutes: 5.5,
    },
  ];
}

export function getCastingForProject(project: ProjectOption): CastRole[] {
  if (PROJECT_CASTING[project.id]) {
    return PROJECT_CASTING[project.id];
  }
  return [
    {
      id: `role-custom-1`,
      roleName: `Lead Protagonist (${project.title})`,
      ageRange: "30s",
      vibe: "Determined, charismatic lead protagonist",
      actorOptions: [
        { name: "Florence Pugh", fitScore: 95, starPowerScore: 94, budgetImpact: "High", imageTag: "Pugh", knownFor: "Dune Part 2, Oppenheimer" },
        { name: "Dev Patel", fitScore: 92, starPowerScore: 89, budgetImpact: "Medium", imageTag: "Patel", knownFor: "Monkey Man, Slumdog" },
      ],
      selectedActor: "Florence Pugh",
    },
  ];
}

export function getStoryboardsForProject(project: ProjectOption): StoryboardConcept[] {
  if (PROJECT_STORYBOARDS[project.id]) {
    return PROJECT_STORYBOARDS[project.id];
  }
  return [
    {
      id: `sb-custom-1`,
      sceneNumber: 1,
      title: `${project.title} - Opening Vista`,
      cameraSetup: "Wide Anamorphic Establishing Shot",
      lightingStyle: "High-Contrast Atmospheric Cinematic Grade",
      promptDescription: `Cinematic concept shot introducing the world of ${project.title} with dramatic volumetric lighting.`,
      moodTags: ["Cinematic", "High Tension", "Atmospheric"],
      gradientStyle: "from-[#0F294D] via-slate-900 to-[#FF6F00]/30",
    },
  ];
}


