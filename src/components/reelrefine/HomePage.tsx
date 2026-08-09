import React, { useState } from "react";
import {
  Film,
  Upload,
  Sparkles,
  ArrowRight,
  FileText,
  Pause,
  Layers,
  CheckCircle2,
  Clapperboard,
  BookOpen,
  BarChart3,
  Users,
  ShieldCheck,
  Search,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { SAMPLE_PROJECTS, ProjectOption } from "./reelRefineData";
import { AnimatedFilmLogo } from "./AnimatedFilmLogo";

interface HomePageProps {
  currentProject: ProjectOption;
  onSelectProject: (proj: ProjectOption, targetTab?: "snapshot" | "improve" | "breakdown" | "plans" | "export") => void;
  onGoToUpload: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentProject,
  onSelectProject,
  onGoToUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Top-to-Bottom Slideshow state for Featured Films (All movies)
  const featuredFilms = SAMPLE_PROJECTS;
  const [slideshowIdx, setSlideshowIdx] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);

  React.useEffect(() => {
    if (isSlideshowPaused) return;
    const timer = setInterval(() => {
      setSlideshowIdx((prev) => (prev + 1) % featuredFilms.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isSlideshowPaused, featuredFilms.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideshowIdx((prev) => (prev - 1 + featuredFilms.length) % featuredFilms.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideshowIdx((prev) => (prev + 1) % featuredFilms.length);
  };

  const totalPages = SAMPLE_PROJECTS.reduce((acc, p) => acc + p.pages, 0);
  const totalScenes = SAMPLE_PROJECTS.reduce((acc, p) => acc + p.scenesCount, 0);

  const filteredProjects = SAMPLE_PROJECTS.filter((proj) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      proj.title.toLowerCase().includes(q) ||
      proj.author.toLowerCase().includes(q) ||
      proj.logline.toLowerCase().includes(q) ||
      (proj.genre && proj.genre.toLowerCase().includes(q)) ||
      (proj.tagline && proj.tagline.toLowerCase().includes(q)) ||
      proj.budgetTier.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-8">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F294D] via-[#001b94] to-[#1E3A8A] text-white p-6 md:p-10 shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FF6F00]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 backdrop-blur-md text-amber-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6F00]" /> Studio Screenplay Catalog
          </div>
          <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
            <AnimatedFilmLogo size="lg" className="flex-shrink-0" animated={false} />
            <h1 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
              Welcome to Good Film Studios
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            Your centralized AI screenplay intelligence and production planning hub. Select any movie project below to view Coverage AI insights, interactive scene rewrites, casting shortlists, and 3-part production packages.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onGoToUpload}
              className="px-5 py-2.5 bg-[#FF6F00] hover:bg-[#e06200] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 group"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Screenplay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Vertical Top-to-Bottom Slideshow Button with Hover Pause */}
            <button
              type="button"
              onClick={() => onSelectProject(featuredFilms[slideshowIdx], "snapshot")}
              onMouseEnter={() => setIsSlideshowPaused(true)}
              onMouseLeave={() => setIsSlideshowPaused(false)}
              onPointerEnter={() => setIsSlideshowPaused(true)}
              onPointerLeave={() => setIsSlideshowPaused(false)}
              onFocus={() => setIsSlideshowPaused(true)}
              onBlur={() => setIsSlideshowPaused(false)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2.5 relative group overflow-hidden h-[42px] min-w-[280px] sm:min-w-[335px]"
            >
              <FileText className="w-4 h-4 text-amber-400 flex-shrink-0 relative z-10" />

              <div className="flex-1 overflow-hidden h-full relative z-10 flex flex-col justify-center">
                {featuredFilms.map((film, idx) => {
                  const isActive = idx === slideshowIdx;
                  return (
                    <div
                      key={film.id}
                      className={`absolute inset-x-0 flex items-center transition-all duration-500 ease-in-out ${
                        isActive
                          ? "translate-y-0 opacity-100 scale-100"
                          : idx < slideshowIdx
                          ? "-translate-y-full opacity-0 pointer-events-none"
                          : "translate-y-full opacity-0 pointer-events-none"
                      }`}
                    >
                      <span className="text-white font-semibold whitespace-nowrap">
                        Load Featured: {film.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-transform flex-shrink-0 relative z-10" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid Overlay */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold font-mono text-white">{SAMPLE_PROJECTS.length} Movies</div>
            <div className="text-[11px] text-slate-300">Active Screenplays</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold font-mono text-amber-300">{totalPages} Pages</div>
            <div className="text-[11px] text-slate-300">Parsed & Analyzed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold font-mono text-emerald-300">{totalScenes} Scenes</div>
            <div className="text-[11px] text-slate-300">Breakdown Ready</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold font-mono text-sky-300">3 Tiers</div>
            <div className="text-[11px] text-slate-300">Micro, Indie & Studio</div>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-2xl font-display font-semibold text-[#0F294D] dark:text-foreground tracking-tight">
            Movie Projects & Screenplay Cards
          </h2>
          <p className="text-xs text-[#64748B] dark:text-muted-foreground font-medium">
            Choose a movie script to jump directly into its analysis, script snapshot, and budget plan.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToUpload}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#001b94] dark:text-sky-400 hover:text-[#FF6F00] transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>+ Import external file (.fdx / .pdf)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies by title, author, genre, or keyword..."
          className="w-full pl-11 pr-10 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001b94] dark:focus:ring-sky-400 focus:border-[#001b94] dark:focus:border-sky-400 placeholder:text-slate-400 font-medium transition-all shadow-xs text-foreground"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Movie Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-display font-semibold text-[#0F294D] dark:text-foreground">No movies found</h3>
          <p className="text-xs text-[#64748B] dark:text-muted-foreground font-medium">No screenplays match "{searchQuery}". Try a different search term.</p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs font-semibold text-[#001b94] dark:text-sky-400 hover:text-[#FF6F00] transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const isActive = proj.id === currentProject.id;
          const bgGradient = proj.gradient || "from-[#0F294D] via-[#1E3A8A] to-[#FF6F00]";

          return (
            <div
              key={proj.id}
              className={`group bg-card rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl ${
                isActive
                  ? "border-[#001b94] ring-2 ring-[#001b94]/20"
                  : "border-border hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Card Top Header Visual */}
              <div>
                <div className={`h-36 bg-gradient-to-br ${bgGradient} p-5 text-white flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute right-2 bottom-2 text-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    <Clapperboard className="w-28 h-28" />
                  </div>

                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-300 border border-white/20">
                      {proj.genre || "Feature Screenplay"}
                    </span>

                    {isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-mono font-medium">
                        {proj.budgetTier} Budget
                      </span>
                    )}
                  </div>

                  <div className="z-10">
                    <h3 className="text-xl font-display font-bold text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-200 font-medium">By {proj.author}</p>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-4">
                  {/* Tagline / Logline */}
                  <div className="space-y-1.5">
                    {proj.tagline && (
                      <p className="text-xs font-semibold text-[#FF6F00] italic">
                        "{proj.tagline}"
                      </p>
                    )}
                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed font-medium">
                      {proj.logline}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0F294D] dark:text-slate-200 text-[11px] font-mono font-medium flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#001b94]" /> {proj.pages} Pages
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0F294D] dark:text-slate-200 text-[11px] font-mono font-medium flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#FF6F00]" /> {proj.scenesCount} Scenes
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-mono font-semibold">
                      {proj.draftVersion}
                    </span>
                  </div>

                  {/* Highlights List */}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <div className="text-[10px] font-mono uppercase font-semibold text-muted-foreground tracking-wider">
                        Studio Package Highlights
                      </div>
                      <div className="space-y-1">
                        {proj.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-foreground font-medium">
                            <Sparkles className="w-3 h-3 text-[#FF6F00] flex-shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectProject(proj, "snapshot")}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isActive
                      ? "bg-[#001b94] hover:bg-[#001470] text-white"
                      : "bg-[#0F294D] hover:bg-[#001b94] text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Open Studio Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectProject(proj, "improve")}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-medium text-center truncate transition-colors"
                  >
                    Rewrites
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectProject(proj, "breakdown")}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-medium text-center truncate transition-colors"
                  >
                    Breakdown
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectProject(proj, "export")}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-medium text-center truncate transition-colors"
                  >
                    Pitch Deck
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Upload Screenplay Prompt Card */}
      <div className="bg-card dark:bg-gradient-to-r dark:from-slate-900 dark:to-[#0F294D] text-foreground dark:text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-border shadow-md transition-all">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#001b94]/10 dark:bg-white/10 text-[#001b94] dark:text-emerald-400 border border-[#001b94]/20 dark:border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant Local Processing
          </div>
          <h3 className="text-xl md:text-2xl font-display font-semibold text-[#0F294D] dark:text-white">
            Have a custom screenplay to analyze?
          </h3>
          <p className="text-xs md:text-sm text-[#64748B] dark:text-slate-300 max-w-xl font-medium">
            Upload your Final Draft (.fdx), PDF, or plain text screenplay to generate instant dialogue fixes, scene breakdowns, and production plans.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToUpload}
          className="px-6 py-3 bg-[#FF6F00] hover:bg-[#e06200] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex-shrink-0 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Screenplay File</span>
        </button>
      </div>
    </div>
  );
};
