import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import {
  PieChart as PieChartIcon,
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
  Film,
  Tv,
  Globe2,
  Globe,
  Music,
  Disc,
  Calculator,
  Coins,
  ArrowUpRight,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { ProjectOption, AI_ACTOR_DATABASE } from "./reelRefineData";

interface InvestmentIntelligenceProps {
  currentProject: ProjectOption;
  shortlistedActors?: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export interface PlatformChannelItem {
  id: string;
  name: string;
  icon: any;
  percentage: number;
  colorGradient: string;
  description: string;
  keyPartners: string;
}

export interface OTTPlatformPrediction {
  platform: string;
  badge: string;
  matchScore: number;
  share: number;
  color: string;
  dealMultiplier: number;
  dealType: string;
  appetiteReason: string;
}

// Data model for Investment Intelligence & ROI - Unique per film project
function getInvestmentData(project: ProjectOption) {
  const dataMap: Record<string, ReturnType<typeof defaultInvestmentData>> = {
    "proj-1": {
      readinessScore: 74,
      readinessLabel: "Investment Ready — Moderate Confidence",
      defaultInvestmentUSD: 10,
      estimatedBudget: "$10M – $25M",
      breakEvenTarget: "$14M – $24M (total combined revenue)",
      aiScenarios: {
        conservative: { multiplier: 1.3, badge: "AI Risk Floor", label: "Conservative (1.3x)" },
        moderate: { multiplier: 1.8, badge: "🤖 AI Best Match (88%)", label: "AI Forecast (1.8x)" },
        optimistic: { multiplier: 2.6, badge: "🚀 AI Hit Target", label: "Optimistic (2.6x)" },
      },
      ottBuyerPredictions: [
        { platform: "Apple TV+", badge: "Prestige Sci-Fi Fit", matchScore: 88, share: 29, color: "#10b981", dealMultiplier: 1.55, dealType: "Global Sci-Fi Original Buyout", appetiteReason: "Premium visual spectacle aligns with Apple's prestige content strategy." },
        { platform: "Netflix", badge: "High Volume Fit", matchScore: 82, share: 27, color: "#e50914", dealMultiplier: 1.45, dealType: "3-Year Worldwide Exclusive SVOD", appetiteReason: "Strong international appeal; sci-fi is a top-performing genre on the platform." },
        { platform: "Amazon Prime", badge: "Active Buyer", matchScore: 76, share: 25, color: "#00a8e1", dealMultiplier: 1.35, dealType: "Worldwide SVOD + VOD Rights", appetiteReason: "Fits Prime's appetite for mid-budget sci-fi originals." },
        { platform: "Disney+", badge: "Co-Exclusive", matchScore: 58, share: 19, color: "#113ccf", dealMultiplier: 1.15, dealType: "Domestic Streaming License", appetiteReason: "Lacks family-friendly elements; better suited for Star/Hulu banner." },
      ],
      platformChannels: [
        {
          id: "box_office",
          name: "Box Office (Domestic)",
          icon: Film,
          percentage: 32,
          colorGradient: "from-[#001b94] via-blue-600 to-emerald-500",
          description: "Domestic multiplex & single screen theatrical receipts",
          keyPartners: "AMC, Regal, Cinemark, National Theatrical Chains",
        },
        {
          id: "satellite",
          name: "Satellite TV Rights",
          icon: Tv,
          percentage: 25,
          colorGradient: "from-blue-600 via-teal-600 to-emerald-400",
          description: "Pre-sales cable broadcast & television network license deals",
          keyPartners: "HBO, Showtime, Starz, Turner Networks",
        },
        {
          id: "ott",
          name: "OTT Platforms",
          icon: Globe2,
          percentage: 18,
          colorGradient: "from-teal-600 via-emerald-600 to-teal-400",
          description: "Post-theatrical SVOD exclusive streaming rights",
          keyPartners: "Netflix, Amazon Prime Video, Apple TV+, Hulu",
        },
        {
          id: "international",
          name: "International Box Office",
          icon: Globe,
          percentage: 15,
          colorGradient: "from-teal-500 via-emerald-500 to-green-400",
          description: "Overseas distribution across Europe, Latin America & Asia-Pacific",
          keyPartners: "Sony Pictures Releasing, Universal International, Lionsgate",
        },
        {
          id: "music",
          name: "Music & Digital Rights",
          icon: Music,
          percentage: 6,
          colorGradient: "from-emerald-500 via-green-500 to-lime-400",
          description: "Soundtrack album rights + Spotify & Apple Music digital revenue",
          keyPartners: "Universal Music Group, Sony Music, Warner Music",
        },
        {
          id: "other",
          name: "Other (DVD, Merchandise)",
          icon: Disc,
          percentage: 4,
          colorGradient: "from-green-500 via-lime-500 to-emerald-300",
          description: "In-flight entertainment, physical home media & merchandise licensing",
          keyPartners: "Criterion, AirInflight, Global Licensing Agencies",
        },
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
    },
    "proj-2": {
      readinessScore: 82,
      readinessLabel: "Strong Investment Candidate — High Streaming Yield",
      defaultInvestmentUSD: 25,
      estimatedBudget: "$25M – $45M",
      breakEvenTarget: "$35M – $65M (total combined revenue)",
      aiScenarios: {
        conservative: { multiplier: 1.5, badge: "AI Risk Floor", label: "Conservative (1.5x)" },
        moderate: { multiplier: 2.2, badge: "🤖 AI Best Match (92%)", label: "AI Forecast (2.2x)" },
        optimistic: { multiplier: 3.8, badge: "🚀 AI Franchise Hit", label: "Optimistic (3.8x)" },
      },
      ottBuyerPredictions: [
        { platform: "Netflix", badge: "Top Buyer Match", matchScore: 90, share: 32, color: "#e50914", dealMultiplier: 1.65, dealType: "Global Original + Anime Spinoff Rights", appetiteReason: "Cyberpunk and mystery genres perform exceptionally well; series spinoff potential." },
        { platform: "HBO Max", badge: "Flagship Match", matchScore: 85, share: 28, color: "#6366f1", dealMultiplier: 1.52, dealType: "Pay-1 Exclusive Streaming Buyout", appetiteReason: "Mature themes align well with HBO's brand. Strong limited series potential." },
        { platform: "Apple TV+", badge: "Prestige Visuals", matchScore: 78, share: 22, color: "#10b981", dealMultiplier: 1.42, dealType: "Worldwide Exclusive Streaming License", appetiteReason: "Visual spectacle fits Apple's premium slate." },
        { platform: "Amazon Prime", badge: "Global SVOD", matchScore: 72, share: 18, color: "#00a8e1", dealMultiplier: 1.32, dealType: "Post-Theatrical Streaming Acquisition", appetiteReason: "Fits prestige genre content but requires significant VFX investment." },
      ],
      platformChannels: [
        {
          id: "ott",
          name: "OTT Platforms (Exclusive SVOD)",
          icon: Globe2,
          percentage: 38,
          colorGradient: "from-[#FF6F00] via-amber-500 to-emerald-400",
          description: "Premium global streaming pre-sales & exclusive window rights",
          keyPartners: "Netflix Original, HBO Max, Amazon Prime Video",
        },
        {
          id: "box_office",
          name: "Box Office (Domestic)",
          icon: Film,
          percentage: 22,
          colorGradient: "from-blue-600 via-indigo-600 to-teal-400",
          description: "Metropolitan IMAX & cyberpunk genre fan theatrical legs",
          keyPartners: "IMAX Corporation, AMC Theatres, Landmark Theatres",
        },
        {
          id: "international",
          name: "International Box Office",
          icon: Globe,
          percentage: 20,
          colorGradient: "from-teal-600 via-emerald-500 to-green-400",
          description: "High East Asian & European theatrical pre-sales (Japan/Korea heavy)",
          keyPartners: "Toho, CJ Entertainment, Constantining Film",
        },
        {
          id: "satellite",
          name: "Satellite TV & Pay-TV Rights",
          icon: Tv,
          percentage: 12,
          colorGradient: "from-indigo-600 via-blue-500 to-teal-400",
          description: "Global premium Pay-TV & cable network licensing",
          keyPartners: "WOWOW Japan, Sky Cinema UK, Canal+ France",
        },
        {
          id: "music",
          name: "Synthwave Soundtrack & Gaming Rights",
          icon: Music,
          percentage: 5,
          colorGradient: "from-pink-500 via-purple-500 to-indigo-400",
          description: "Cyberpunk synthwave soundtrack streams + video game cross-licensing",
          keyPartners: "Milan Records, Lakeshore Records, CD Projekt Red",
        },
        {
          id: "other",
          name: "IP Licensing & Merch",
          icon: Disc,
          percentage: 3,
          colorGradient: "from-emerald-500 via-teal-400 to-lime-300",
          description: "Anime spinoff rights, apparel, and VR experience licensing",
          keyPartners: "Crunchyroll, Good Smile Company, Dark Horse Comics",
        },
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
    },
    "proj-3": {
      readinessScore: 62,
      readinessLabel: "Moderate Investment Potential — Awards Prestige Play",
      defaultInvestmentUSD: 4,
      estimatedBudget: "$4M – $8M",
      breakEvenTarget: "$6M – $12M (total combined revenue)",
      aiScenarios: {
        conservative: { multiplier: 1.2, badge: "AI Risk Floor", label: "Conservative (1.2x)" },
        moderate: { multiplier: 2.0, badge: "🤖 AI Best Match (85%)", label: "AI Forecast (2.0x)" },
        optimistic: { multiplier: 3.5, badge: "🚀 AI Sleeper Hit", label: "Optimistic (3.5x)" },
      },
      ottBuyerPredictions: [
        { platform: "MUBI / Criterion", badge: "Cinephile Target", matchScore: 92, share: 35, color: "#8b5cf6", dealMultiplier: 1.45, dealType: "Global Cinephile Exclusive License", appetiteReason: "Perfect fit for curated cinema platforms and awards circuit." },
        { platform: "Apple TV+", badge: "Awards Circuit", matchScore: 80, share: 28, color: "#10b981", dealMultiplier: 1.40, dealType: "Prestige Awards Season Buyout", appetiteReason: "High-quality period content aligns with Apple's brand positioning." },
        { platform: "Amazon Prime", badge: "Prestige Drama", matchScore: 72, share: 20, color: "#00a8e1", dealMultiplier: 1.30, dealType: "Worldwide SVOD Rights", appetiteReason: "Fits Prime's prestige content strategy; potential awards play." },
        { platform: "Netflix", badge: "Festival Catch", matchScore: 65, share: 17, color: "#e50914", dealMultiplier: 1.20, dealType: "Exclusive Festival SVOD Window", appetiteReason: "Period dramas have moderate performance; strong awards potential helps visibility." },
      ],
      platformChannels: [
        {
          id: "ott",
          name: "Prestige SVOD & Arthouse Streaming",
          icon: Globe2,
          percentage: 42,
          colorGradient: "from-amber-500 via-orange-500 to-rose-400",
          description: "Exclusive festival acquisition pre-sales to boutique streamers",
          keyPartners: "Apple TV+, MUBI, Criterion Channel, Hulu",
        },
        {
          id: "music",
          name: "Jazz Soundtrack & Vinyl Sales",
          icon: Music,
          percentage: 22,
          colorGradient: "from-purple-600 via-indigo-500 to-amber-400",
          description: "Original 1940s Jazz soundtrack vinyl, physical CD & Spotify streams",
          keyPartners: "Blue Note Records, Verve Music Group, Concord Jazz",
        },
        {
          id: "satellite",
          name: "Prestige TV & Cable Pre-Sales",
          icon: Tv,
          percentage: 18,
          colorGradient: "from-[#001b94] via-blue-600 to-teal-400",
          description: "Public broadcast & premium cable window licensing",
          keyPartners: "PBS Masterpiece, BBC Film, Arte France",
        },
        {
          id: "box_office",
          name: "Limited Platform Theatrical",
          icon: Film,
          percentage: 12,
          colorGradient: "from-teal-600 via-emerald-500 to-amber-300",
          description: "Platform rollout in NY/LA leading to awards season expansion",
          keyPartners: "A24, Neon, Sony Pictures Classics",
        },
        {
          id: "international",
          name: "International Festival Distributors",
          icon: Globe,
          percentage: 4,
          colorGradient: "from-emerald-500 via-green-400 to-teal-300",
          description: "European festival territory rights (Cannes/Venice presales)",
          keyPartners: "FilmNation, Curzon Artificial Eye, Wild Bunch",
        },
        {
          id: "other",
          name: "Educational & Ancillary",
          icon: Disc,
          percentage: 2,
          colorGradient: "from-gray-500 via-slate-400 to-zinc-300",
          description: "University film libraries & specialty screening licenses",
          keyPartners: "Swank Motion Pictures, Kanopy",
        },
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
    },
    "proj-4": {
      readinessScore: 76,
      readinessLabel: "Investment Ready — Strong Dual-Genre Potential",
      defaultInvestmentUSD: 15,
      estimatedBudget: "$15M – $30M",
      breakEvenTarget: "$22M – $45M (total combined revenue)",
      aiScenarios: {
        conservative: { multiplier: 1.4, badge: "AI Risk Floor", label: "Conservative (1.4x)" },
        moderate: { multiplier: 2.1, badge: "🤖 AI Best Match (89%)", label: "AI Forecast (2.1x)" },
        optimistic: { multiplier: 3.2, badge: "🚀 AI Hit Upside", label: "Optimistic (3.2x)" },
      },
      ottBuyerPredictions: [
        { platform: "Amazon Prime", badge: "Action Thriller Fit", matchScore: 88, share: 32, color: "#00a8e1", dealMultiplier: 1.48, dealType: "Global Action Thriller Original", appetiteReason: "Prime actively acquires high-concept survival thrillers." },
        { platform: "Netflix", badge: "High Completion", matchScore: 82, share: 28, color: "#e50914", dealMultiplier: 1.40, dealType: "Worldwide Exclusive SVOD", appetiteReason: "High completion rate on underwater survival stories." },
        { platform: "Disney+", badge: "Pay-1 Window", matchScore: 74, share: 22, color: "#113ccf", dealMultiplier: 1.30, dealType: "20th Century Studios Pay-1 Rights", appetiteReason: "Lacks family-friendly elements; better suited for Star/Hulu banner." },
        { platform: "HBO Max", badge: "Pay-TV & SVOD", matchScore: 70, share: 18, color: "#6366f1", dealMultiplier: 1.22, dealType: "Cable & Streaming Co-Exclusive", appetiteReason: "Fits blockbuster movie night lineup." },
      ],
      platformChannels: [
        {
          id: "box_office",
          name: "Box Office (Domestic IMAX/4DX)",
          icon: Film,
          percentage: 38,
          colorGradient: "from-blue-700 via-indigo-600 to-cyan-400",
          description: "Claustrophobic underwater thriller draws heavy 4DX & Dolby Atmos crowds",
          keyPartners: "IMAX 3D, Regal 4DX, AMC Prime",
        },
        {
          id: "international",
          name: "International Box Office",
          icon: Globe,
          percentage: 24,
          colorGradient: "from-teal-600 via-cyan-500 to-emerald-400",
          description: "High global appetite for creature features & deep-sea survival",
          keyPartners: "Warner Bros. International, Universal Pictures, Eurozoom",
        },
        {
          id: "ott",
          name: "OTT Platforms (SVOD)",
          icon: Globe2,
          percentage: 18,
          colorGradient: "from-[#FF6F00] via-amber-500 to-teal-400",
          description: "Exclusive post-theatrical Halloween/Horror season streaming rights",
          keyPartners: "Shudder, Netflix, Peacock Premium, Paramount+",
        },
        {
          id: "satellite",
          name: "Satellite & Cable Network",
          icon: Tv,
          percentage: 12,
          colorGradient: "from-indigo-600 via-blue-500 to-teal-300",
          description: "Late-night cable broadcast & Halloween event marathons",
          keyPartners: "Syfy Network, AMC FearFest, Chiller",
        },
        {
          id: "music",
          name: "Dolby Sound Design & Score",
          icon: Music,
          percentage: 5,
          colorGradient: "from-cyan-500 via-blue-500 to-teal-300",
          description: "Sub-bass underwater soundscape licensing & OST album",
          keyPartners: "Waxwork Records, Back Lot Music",
        },
        {
          id: "other",
          name: "Home Media & Collector Editions",
          icon: Disc,
          percentage: 3,
          colorGradient: "from-slate-500 via-teal-500 to-cyan-300",
          description: "Steelbook 4K UHD Blu-Ray & submarine simulation VR experiences",
          keyPartners: "Scream Factory, Arrow Video, Meta Quest Store",
        },
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
    },
  };

  return dataMap[project.id] || defaultInvestmentData();
}

function defaultInvestmentData() {
  return {
    readinessScore: 60,
    readinessLabel: "Moderate Investment Potential",
    defaultInvestmentUSD: 10,
    estimatedBudget: "$10M",
    breakEvenTarget: "$18M",
    aiScenarios: {
      conservative: { multiplier: 1.3, badge: "AI Risk Floor", label: "Conservative (1.3x)" },
      moderate: { multiplier: 1.8, badge: "🤖 AI Best Match (80%)", label: "AI Forecast (1.8x)" },
      optimistic: { multiplier: 2.6, badge: "🚀 AI Hit Target", label: "Optimistic (2.6x)" },
    },
    ottBuyerPredictions: [
      { platform: "Netflix", badge: "Global Fit", matchScore: 82, share: 30, color: "#e50914", dealMultiplier: 1.45, dealType: "Worldwide SVOD Exclusive", appetiteReason: "Strong international appeal; sci-fi is a top-performing genre on the platform." },
      { platform: "Amazon Prime", badge: "Active Buyer", matchScore: 76, share: 25, color: "#00a8e1", dealMultiplier: 1.35, dealType: "Global Streaming Rights", appetiteReason: "Fits Prime's appetite for mid-budget sci-fi originals." },
      { platform: "Apple TV+", badge: "Prestige Buyout", matchScore: 88, share: 29, color: "#10b981", dealMultiplier: 1.55, dealType: "Original Content License", appetiteReason: "Premium visual spectacle aligns with Apple's prestige content strategy." },
    ],
    platformChannels: [
      {
        id: "box_office",
        name: "Box Office (Domestic)",
        icon: Film,
        percentage: 35,
        colorGradient: "from-[#001b94] via-blue-600 to-emerald-500",
        description: "Domestic theatrical receipts",
        keyPartners: "Major National Chains",
      },
      {
        id: "ott",
        name: "OTT Platforms",
        icon: Globe2,
        percentage: 30,
        colorGradient: "from-teal-600 via-emerald-600 to-teal-400",
        description: "Post-theatrical SVOD rights",
        keyPartners: "Global Streaming Platforms",
      },
      {
        id: "satellite",
        name: "Satellite TV Rights",
        icon: Tv,
        percentage: 20,
        colorGradient: "from-blue-600 via-teal-600 to-emerald-400",
        description: "Pre-sales cable broadcast",
        keyPartners: "Premium Cable Networks",
      },
      {
        id: "international",
        name: "International Box Office",
        icon: Globe,
        percentage: 15,
        colorGradient: "from-teal-500 via-emerald-500 to-green-400",
        description: "Overseas distribution",
        keyPartners: "International Sales Agents",
      },
    ],
    marketComps: [] as { title: string; budget: string; revenue: string; multiplier: string; notes: string }[],
    riskFactors: [] as { factor: string; severity: string; notes: string }[],
    pitchHighlights: ["Script analysis in progress."],
  };
}

export const InvestmentIntelligence: React.FC<InvestmentIntelligenceProps> = ({
  currentProject,
  shortlistedActors,
  onNext,
  onBack,
}) => {
  const data = getInvestmentData(currentProject);

  // Interactive Investment Simulator & AI Predictor State
  const [investedAmount, setInvestedAmount] = useState<number>(data.defaultInvestmentUSD || 10);
  const [scenario, setScenario] = useState<"conservative" | "moderate" | "optimistic">("moderate");
  const [calcBase, setCalcBase] = useState<"gross_returns" | "investment_base">("gross_returns");
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionConfidence, setPredictionConfidence] = useState<number>(data.readinessScore || 82);
  const [showComps, setShowComps] = useState<boolean>(true);
  const [showRisks, setShowRisks] = useState<boolean>(true);

  // OTT View & Donut Hover State (Defaulting to "bar" as in screenshot)
  const [ottView, setOttView] = useState<"bar" | "pie">("bar");
  const [activeOttIndex, setActiveOttIndex] = useState<number | null>(null);

  // Dynamic AI Scenario Recalibration Offset State
  const [aiOffset, setAiOffset] = useState<number>(0);

  // Sync state whenever selected film project changes
  useEffect(() => {
    setInvestedAmount(data.defaultInvestmentUSD || 10);
    setPredictionConfidence(data.readinessScore || 82);
    setScenario("moderate");
    setAiOffset(0);
  }, [currentProject.id]);

  // Dynamic Star Power Boost from Cast Shortlist
  const shortlistedNames = shortlistedActors ? Object.values(shortlistedActors).filter(Boolean) : [];
  let castBoost = 0;
  shortlistedNames.forEach((actorName) => {
    const actor = AI_ACTOR_DATABASE.find((a) => a.name.toLowerCase() === actorName.toLowerCase());
    const score = actor?.starPowerScore || 80;
    if (score >= 90) castBoost += 0.3;
    else if (score >= 80) castBoost += 0.2;
    else castBoost += 0.1;
  });
  castBoost = Number(castBoost.toFixed(2));

  // USD Formatter ($ Millions)
  const fmtUSD = (val: number) => `$${val.toFixed(1)}M`;

  // Range Values Calculations (Base Multiplier + Live Scan Offset + Shortlisted Cast Boost)
  const lowMult = Number((data.aiScenarios.conservative.multiplier + aiOffset + castBoost).toFixed(1));
  const baseMult = Number((data.aiScenarios.moderate.multiplier + aiOffset + castBoost).toFixed(1));
  const highMult = Number((data.aiScenarios.optimistic.multiplier + aiOffset + castBoost).toFixed(1));

  const lowRevenue = investedAmount * lowMult;
  const baseRevenue = investedAmount * baseMult;
  const highRevenue = investedAmount * highMult;

  const lowProfit = lowRevenue - investedAmount;
  const baseProfit = baseRevenue - investedAmount;
  const highProfit = highRevenue - investedAmount;

  const lowRoi = ((lowProfit / investedAmount) * 100).toFixed(0);
  const baseRoi = ((baseProfit / investedAmount) * 100).toFixed(0);
  const highRoi = ((highProfit / investedAmount) * 100).toFixed(0);

  // Active Selected Scenario Multiplier
  const scenarioMultiplier = scenario === "conservative" ? lowMult : scenario === "optimistic" ? highMult : baseMult;
  const totalRevenue = investedAmount * scenarioMultiplier;
  const netProfit = totalRevenue - investedAmount;
  const roiPercentage = ((netProfit / investedAmount) * 100).toFixed(0);

  const handleRunAiPrediction = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      // Simulate live AI model recalibration on script text & market comps
      const newConfidence = Math.min(95, Math.max(78, (data.readinessScore || 82) + Math.floor(Math.random() * 5) - 2));
      const newOffset = parseFloat(((Math.random() * 0.4) - 0.2).toFixed(1));
      setPredictionConfidence(newConfidence);
      setAiOffset(newOffset);
    }, 1200);
  };

  const severityColor = (s: string) => {
    if (s === "High") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (s === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#001b94]/10 dark:bg-sky-500/10 text-[#001b94] dark:text-sky-400">
              <PieChartIcon className="h-5 w-5 text-[#FF6F00]" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
                Investment Returns & ROI
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#001b94] dark:text-sky-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF6F00]" /> AI FINANCIAL PREDICTOR
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AI-predicted financial returns for <span className="font-semibold text-foreground">"{currentProject.title}"</span> — Script-driven yield forecasting & platform income model.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Pitch Deck & Export
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#001b94] text-white hover:bg-[#001070] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            Release & Marketing <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Banner: Investment & Profit Overview (Clean Minimal White Studio Palette) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Banner Top Row: Header + Clean Refined Badges */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001b94]/10 text-[#001b94] dark:bg-sky-500/10 dark:text-sky-400 border border-[#001b94]/15 flex items-center justify-center font-bold">
              <Coins className="h-5 w-5 text-[#001b94] dark:text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider font-bold">
                  AI Predictor & Financial Simulator
                </span>
                {/* Refined Clean Confidence Badge */}
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {predictionConfidence}% AI Confidence Score
                </span>
                {/* Refined Amber Cast Boost Badge */}
                {shortlistedNames.length > 0 && (
                  <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    +{castBoost.toFixed(1)}x Cast Boost ({shortlistedNames.join(", ")})
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                Invested Amount: <span className="text-[#001b94] dark:text-sky-400 font-mono">{fmtUSD(investedAmount)}</span>
              </h3>
            </div>
          </div>

          {/* Clean Neutral AI Trigger Button */}
          <button
            type="button"
            onClick={handleRunAiPrediction}
            disabled={isPredicting}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-400 dark:text-amber-600 ${isPredicting ? "animate-spin" : ""}`} />
            {isPredicting ? "Analyzing Script Returns..." : "Re-Run AI Predictor"}
          </button>
        </div>

        {/* Clean Number Input Box in USD Millions ($M) — Placed FIRST */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <Calculator className="h-4 w-4 text-[#001b94] dark:text-sky-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white block">
                Enter Producer Investment Amount ($ Millions):
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Type custom capital for <span className="text-slate-900 dark:text-slate-200 font-semibold">{currentProject.title}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus-within:border-[#001b94] transition-colors shadow-xs">
            <span className="text-base font-mono font-bold text-[#001b94] dark:text-sky-400">$</span>
            <input
              type="number"
              min="0.1"
              max="10000"
              step="0.5"
              value={investedAmount || ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setInvestedAmount(isNaN(val) ? 0 : val);
              }}
              placeholder={data.defaultInvestmentUSD.toString()}
              className="w-24 bg-transparent text-base font-bold text-slate-900 dark:text-white font-mono focus:outline-none placeholder-slate-400"
            />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">Million ($M)</span>
          </div>
        </div>

        {/* Visual AI Return Multiplier Range Model Bar */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase font-bold tracking-wider">
              <Zap className="w-4 h-4 text-[#FF6F00]" />
              AI Predicted Yield Range: <span className="text-[#001b94] dark:text-sky-400 font-extrabold">{lowMult}x — {highMult}x</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-medium">
              Base AI Target: <span className="font-bold text-slate-900 dark:text-white">{baseMult}x Return</span>
            </span>
          </div>

          {/* Range Track with 3 Restrained Interactive Point Pins */}
          <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setScenario("conservative")}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                scenario === "conservative"
                  ? "bg-[#001b94] text-white border-[#001b94] shadow-sm font-bold"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className={`text-[10px] font-mono uppercase font-semibold ${scenario === "conservative" ? "text-slate-200" : "text-slate-500"}`}>
                Risk Floor (Min)
              </div>
              <div className="text-sm font-bold font-mono mt-0.5">{lowMult}x Return</div>
              <div className={`text-[10px] mt-0.5 ${scenario === "conservative" ? "text-slate-200" : "text-slate-500"}`}>{fmtUSD(lowRevenue)} Total</div>
            </button>

            <button
              type="button"
              onClick={() => setScenario("moderate")}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                scenario === "moderate"
                  ? "bg-[#001b94] text-white border-[#001b94] shadow-sm font-bold"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className={`text-[10px] font-mono uppercase font-semibold flex items-center gap-1 ${scenario === "moderate" ? "text-slate-200" : "text-slate-500"}`}>
                <Sparkles className={`w-3 h-3 ${scenario === "moderate" ? "text-amber-300" : "text-amber-500"}`} />
                AI Base Forecast
              </div>
              <div className="text-sm font-bold font-mono mt-0.5">{baseMult}x Target</div>
              <div className={`text-[10px] mt-0.5 ${scenario === "moderate" ? "text-slate-200" : "text-slate-500"}`}>{fmtUSD(baseRevenue)} Total</div>
            </button>

            <button
              type="button"
              onClick={() => setScenario("optimistic")}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                scenario === "optimistic"
                  ? "bg-[#001b94] text-white border-[#001b94] shadow-sm font-bold"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className={`text-[10px] font-mono uppercase font-semibold ${scenario === "optimistic" ? "text-slate-200" : "text-slate-500"}`}>
                Hit Upside (Max)
              </div>
              <div className="text-sm font-bold font-mono mt-0.5">{highMult}x Return</div>
              <div className={`text-[10px] mt-0.5 ${scenario === "optimistic" ? "text-slate-200" : "text-slate-500"}`}>{fmtUSD(highRevenue)} Total</div>
            </button>
          </div>
        </div>

        {/* Key Financial Metrics Grid displaying Crisp Monochromatic Typography */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-mono uppercase font-semibold text-slate-500 dark:text-slate-400">Producer Investment</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{fmtUSD(investedAmount)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Principal Capital</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-mono uppercase font-semibold text-slate-500 dark:text-slate-400">Projected Revenue Range</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{fmtUSD(lowRevenue)} – {fmtUSD(highRevenue)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Target: <span className="font-bold text-[#001b94] dark:text-sky-400">{fmtUSD(totalRevenue)} ({scenarioMultiplier}x)</span></div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-mono uppercase font-semibold text-slate-500 dark:text-slate-400">Net Profit Range</div>
            <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">+{fmtUSD(lowProfit)} – +{fmtUSD(highProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Target Profit: <span className="font-bold text-emerald-700 dark:text-emerald-400">+{fmtUSD(netProfit)}</span></div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-mono uppercase font-semibold text-slate-500 dark:text-slate-400">Net Producer ROI Range</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">+{lowRoi}% – +{highRoi}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Target ROI: <span className="font-bold text-[#001b94] dark:text-sky-400">+{roiPercentage}%</span></div>
          </div>
        </div>

        {/* Right Card: OTT Platform Share & Fit Scores (Matching Market Viability UI) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF6F00]/10 text-[#FF6F00] flex items-center justify-center font-bold">
                <Tv className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                  OTT Platform Market Share
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                    100% Total Share
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribution of streaming platform share out of 100% based on audience fit
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6F00]" />
                <span>Top: <strong className="text-[#001b94] dark:text-sky-300">{(data.ottBuyerPredictions[0]?.platform || "Apple TV+")} ({(data.ottBuyerPredictions[0]?.share || 29)}%)</strong></span>
              </div>

              {/* View Toggle Switch: Pie vs Bar (Matches Screenshot) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setOttView("pie")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    ottView === "pie"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <PieChartIcon className="h-3.5 w-3.5" />
                  <span>Pie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOttView("bar")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    ottView === "bar"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Bar</span>
                </button>
              </div>
            </div>
          </div>

          {ottView === "bar" ? (
            /* Bar Graph List View (Identical to User Screenshot) */
            <div className="space-y-3 py-1">
              {(data.ottBuyerPredictions || []).map((ott, idx) => {
                const dealFee = investedAmount * ott.dealMultiplier;
                const profitGain = dealFee - investedAmount;
                const roiPct = ((profitGain / investedAmount) * 100).toFixed(0);

                return (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ott.color }} />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ott.platform}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#001b94] dark:text-sky-300">
                          {ott.share}% Share
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700">
                          {ott.matchScore}% Fit
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar for Share (Matching Screenshot) */}
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${ott.share}%`, backgroundColor: ott.color }}
                        />
                      </div>
                    </div>

                    {/* Deal Value & Profit Line */}
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-600 dark:text-slate-400">
                        Est. Deal: <strong className="text-slate-900 dark:text-white">{fmtUSD(dealFee)}</strong> ({ott.dealMultiplier}x)
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Projected Profit: +{fmtUSD(profitGain)} (+{roiPct}% ROI)
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ott.appetiteReason}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Pie View */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[220px] bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                <div className="w-full h-56 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={data.ottBuyerPredictions}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={82}
                        paddingAngle={4}
                        dataKey="share"
                        onMouseEnter={(_, index) => setActiveOttIndex(index)}
                        onMouseLeave={() => setActiveOttIndex(null)}
                      >
                        {data.ottBuyerPredictions.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="currentColor"
                            strokeWidth={activeOttIndex === index ? 3 : 1}
                            className="transition-all duration-300 cursor-pointer hover:opacity-90"
                          />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-display font-bold text-[#001b94] dark:text-sky-300">
                      {activeOttIndex !== null ? `${data.ottBuyerPredictions[activeOttIndex].matchScore}%` : "84%"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase font-semibold tracking-wider">
                      {activeOttIndex !== null ? data.ottBuyerPredictions[activeOttIndex].platform : "Avg Fit Index"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 grid grid-cols-1 gap-2">
                {data.ottBuyerPredictions.map((ott, idx) => {
                  const isHovered = activeOttIndex === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setActiveOttIndex(idx)}
                      onMouseLeave={() => setActiveOttIndex(null)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer space-y-1 ${
                        isHovered
                          ? "bg-slate-100 dark:bg-slate-800/90 border-[#001b94] dark:border-sky-400 shadow-sm scale-[1.01]"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs" style={{ backgroundColor: ott.color }} />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ott.platform}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-display font-bold text-[#001b94] dark:text-sky-300 bg-[#001b94]/10 dark:bg-sky-500/20 px-2 py-0.5 rounded-md font-mono">
                            {ott.share}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-semibold">
                            ({ott.matchScore}% Fit)
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-1">{ott.appetiteReason}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Financial Predictor Forecasting Callouts */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-amber-50/50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 rounded-2xl border border-blue-200/60 dark:border-blue-900/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              AI Predictor Analysis & Rationale for "{currentProject.title}"
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            Model: FilmYield-v4.2 • Trained on 1,400+ theatrical releases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-border space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Genre Yield Index
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI script analysis flags high yield potential for <span className="font-semibold text-foreground">{currentProject.genre || "Sci-Fi Thriller"}</span> due to strong visual keyframe beats.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-border space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              OTT SVOD Buyer Appetite
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Streaming platform acquisition demand for {currentProject.genre || "this genre"} scripts is up <span className="font-semibold text-emerald-600 dark:text-emerald-400">+28% YoY</span>.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-border space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Capital Payback Velocity
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI models predict <span className="font-semibold text-foreground">100% capital recoupment</span> within 8-10 months of initial distribution window.
            </p>
          </div>
        </div>
      </div>

      {/* Main Feature Section: Platform & Income Breakdown (Customized per project) */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#FF6F00]" />
              <h3 className="text-base font-semibold text-foreground">
                AI-Predicted Platform & Revenue Breakdown — {currentProject.title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue allocation across distribution platforms when a producer invests <span className="font-semibold text-foreground">{fmtUSD(investedAmount)}</span> (Scenario: {scenario.toUpperCase()} {scenarioMultiplier}x).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setCalcBase("gross_returns")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                calcBase === "gross_returns"
                  ? "bg-[#001b94] text-white font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Gross Returns ({fmtUSD(totalRevenue)})
            </button>
            <button
              type="button"
              onClick={() => setCalcBase("investment_base")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                calcBase === "investment_base"
                  ? "bg-[#001b94] text-white font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Investment Base ({fmtUSD(investedAmount)})
            </button>
          </div>
        </div>

        {/* Breakdown Progress Bars (Dynamic per project) */}
        <div className="space-y-4">
          {data.platformChannels.map((item) => {
            const Icon = item.icon;
            const targetBase = calcBase === "gross_returns" ? totalRevenue : investedAmount;
            const platformRevenueUSD = targetBase * (item.percentage / 100);

            return (
              <div
                key={item.id}
                className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
              >
                <div className="flex items-center justify-between gap-4 text-xs font-semibold mb-2">
                  <div className="flex items-center gap-2.5 min-w-[220px]">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-[#001b94] dark:group-hover:text-sky-400 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-foreground font-medium text-xs sm:text-sm">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {fmtUSD(platformRevenueUSD)}
                    </span>
                    <span className="w-12 text-right font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.colorGradient} transition-all duration-500 ease-out`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Income Breakdown Summary Footnote */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>
              100% of revenue allocation calculated across distribution channels tailored to {currentProject.title}.
            </span>
          </div>
          <div className="font-mono font-bold text-foreground">
            Total Revenue Pool: <span className="text-emerald-600 dark:text-emerald-400">{fmtUSD(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Deep Dive Platform Monetization Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[#FF6F00]" />
          Platform Monetization Details & Deal Structures
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.platformChannels.map((item) => {
            const Icon = item.icon;
            const projectedVal = totalRevenue * (item.percentage / 100);

            return (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-4 space-y-3 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#001b94]/10 dark:bg-sky-900/40 text-[#001b94] dark:text-sky-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{item.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{item.percentage}% Share</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {fmtUSD(projectedVal)}
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground">Projected</div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground font-mono">Key Buyers:</span>
                  <span className="font-medium text-foreground truncate max-w-[170px]">
                    {item.keyPartners}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investor Waterfall & Returns Calculation */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-[#FF6F00]" />
            <h3 className="text-sm font-semibold text-foreground">
              Producer Capital Recoupment & Waterfall Model
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            50/50 Preferred Equity Waterfall Split
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Step 1: Recoupment</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                100% Capital First
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-foreground">
              {fmtUSD(investedAmount)}
            </div>
            <p className="text-[10px] text-muted-foreground">
              100% of producer's initial principal capital is paid back before any net profit distribution.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Step 2: Investor Profit Share</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                50% Split Pool
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              +{fmtUSD(netProfit * 0.5)}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Investor receives 50% share of remaining net profit post full principal recoupment.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Step 3: Studio Back-End</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                50% Studio Share
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-[#FF6F00]">
              +{fmtUSD(netProfit * 0.5)}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Production studio retains 50% back-end backend profit pool + future sequel IP rights.
            </p>
          </div>
        </div>
      </div>

      {/* Market Comps + Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Market Comps */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <button
            type="button"
            onClick={() => setShowComps(!showComps)}
            className="flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Market Comparables for {currentProject.title}</h3>
            </div>
            {showComps ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showComps && (
            <div className="space-y-3">
              {data.marketComps.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">{comp.title}</h4>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {comp.multiplier}
                    </span>
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
          <button
            type="button"
            onClick={() => setShowRisks(!showRisks)}
            className="flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#FF6F00]" />
              <h3 className="text-sm font-semibold text-foreground">Risk Assessment for {currentProject.title}</h3>
            </div>
            {showRisks ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showRisks && (
            <div className="space-y-3">
              {data.riskFactors.map((risk, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">{risk.factor}</h4>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${severityColor(
                        risk.severity
                      )}`}
                    >
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
          <h3 className="text-sm font-semibold text-foreground">Investor Pitch Highlights — {currentProject.title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {data.pitchHighlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
