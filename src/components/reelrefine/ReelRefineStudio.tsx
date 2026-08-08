import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  INITIAL_IMPROVEMENTS,
  INITIAL_CASTING,
  INITIAL_LOCATIONS,
  SAMPLE_PROJECTS,
  ProjectOption,
  ScriptImprovement,
  CastRole,
  LocationOption,
  getImprovementsForProject,
  getCastingForProject,
} from "./reelRefineData";

import { StudioHeader } from "./StudioHeader";
import { StudioSidebar, StudioTabId } from "./StudioSidebar";
import { HomePage } from "./HomePage";
import { ScriptReaderDrawer } from "./ScriptReaderDrawer";
import { DragDropUploader } from "./DragDropUploader";
import { ScriptSnapshot } from "./ScriptSnapshot";
import { ScriptImprover } from "./ScriptImprover";
import { SceneBreakdownView } from "./SceneBreakdownView";
import { ProductionPlans } from "./ProductionPlans";
import { StoryboardVisualizer } from "./StoryboardVisualizer";
import { SummaryExport } from "./SummaryExport";
import { DiffModal } from "./DiffModal";
import { SettingsModal } from "./SettingsModal";

export const ReelRefineStudio: React.FC = () => {
  // Navigation & Project State — Home page set as default landing page
  const [activeTab, setActiveTab] = useState<StudioTabId>("home");
  const [currentProject, setCurrentProject] = useState<ProjectOption>(SAMPLE_PROJECTS[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [scriptReaderOpen, setScriptReaderOpen] = useState<boolean>(false);

  // File Upload Analysis State
  const [fileName, setFileName] = useState<string>("The_Golden_Horizon.fdx");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisBeat, setAnalysisBeat] = useState<number>(0);

  // Script Improvements State
  const [improvements, setImprovements] = useState<ScriptImprovement[]>(INITIAL_IMPROVEMENTS);

  // Casting & Locations State
  const [casting, setCasting] = useState<CastRole[]>(INITIAL_CASTING);
  const [shortlistedActors, setShortlistedActors] = useState<Record<string, string>>({
    "role-1": "Gemma Chan",
    "role-2": "Dev Patel",
  });
  const [budgetTier, setBudgetTier] = useState<"Micro" | "Indie" | "Studio">("Indie");
  const [locations, setLocations] = useState<LocationOption[]>(INITIAL_LOCATIONS);
  const [pinnedLocationIds, setPinnedLocationIds] = useState<string[]>(["loc-1", "loc-2"]);

  // Diff Modal State
  const [diffModalOpen, setDiffModalOpen] = useState<boolean>(false);
  const [selectedDiffImp, setSelectedDiffImp] = useState<ScriptImprovement | null>(null);

  // Settings Modal State
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Initialize Light Mode as default
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const appliedCount = improvements.filter((imp) => imp.applied).length;
  const versionTag = appliedCount === 0 ? "v1.4 - Active" : `v${appliedCount + 1}.0 - Modified`;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleSelectProject = (
    proj: ProjectOption,
    targetTab?: "snapshot" | "improve" | "breakdown" | "plans" | "export"
  ) => {
    setCurrentProject(proj);
    setFileName(`${proj.title.replace(/\s+/g, "_")}.fdx`);
    setBudgetTier(proj.budgetTier);
    setImprovements(getImprovementsForProject(proj));
    setCasting(getCastingForProject(proj));
    if (targetTab) {
      setActiveTab(targetTab);
    }
    triggerToast(`Loaded movie script: "${proj.title}"`);
  };

  const handleFileSelect = (selectedName: string) => {
    setFileName(selectedName);
    setIsAnalyzing(true);
    setAnalysisBeat(0);

    const cleanTitle = selectedName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const customProj: ProjectOption = {
      id: `proj-custom-${Date.now()}`,
      title: cleanTitle,
      author: "Uploaded Screenplay",
      logline: `User uploaded script: ${selectedName}`,
      pages: 110,
      scenesCount: 12,
      draftVersion: "v1.0 - Active",
      budgetTier: "Indie",
      genre: "Feature Script",
    };
    setCurrentProject(customProj);
    setImprovements(getImprovementsForProject(customProj));
    setCasting(getCastingForProject(customProj));

    const t1 = setTimeout(() => setAnalysisBeat(1), 1200);
    const t2 = setTimeout(() => setAnalysisBeat(2), 2400);
    const t3 = setTimeout(() => {
      setIsAnalyzing(false);
      setActiveTab("snapshot");
      triggerToast(`Analysis complete for "${selectedName}". Snapshot ready.`);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleApplyImprovement = (id: string) => {
    setImprovements((prev) =>
      prev.map((imp) => (imp.id === id ? { ...imp, applied: true } : imp))
    );
    const imp = improvements.find((i) => i.id === id);
    triggerToast(`Applied rewrite: "${imp?.title || "Script Edit"}"`);
  };

  const handleRevertImprovement = (id: string) => {
    setImprovements((prev) =>
      prev.map((imp) => (imp.id === id ? { ...imp, applied: false } : imp))
    );
    triggerToast("Reverted script rewrite.");
  };

  const handleOpenDiff = (imp: ScriptImprovement) => {
    setSelectedDiffImp(imp);
    setDiffModalOpen(true);
  };

  const handleToggleActorShortlist = (roleId: string, actorName: string) => {
    const updatedShortlist = {
      ...shortlistedActors,
      [roleId]: actorName,
    };
    setShortlistedActors(updatedShortlist);

    // Auto-recalculate budget tier based on cast impact
    let highImpactCount = 0;
    let lowImpactCount = 0;

    casting.forEach((role) => {
      const selected = updatedShortlist[role.id] || role.selectedActor;
      const actor = role.actorOptions.find((a) => a.name === selected);
      if (actor?.budgetImpact === "High") highImpactCount++;
      if (actor?.budgetImpact === "Low") lowImpactCount++;
    });

    let autoTier: "Micro" | "Indie" | "Studio" = budgetTier;
    if (highImpactCount >= 1) {
      autoTier = "Studio";
    } else if (lowImpactCount >= 2) {
      autoTier = "Micro";
    } else {
      autoTier = "Indie";
    }

    if (autoTier !== budgetTier) {
      setBudgetTier(autoTier);
      triggerToast(
        `Shortlisted ${actorName}. Budget auto-scaled to ${
          autoTier === "Studio"
            ? "Studio-Lite ($2M-$5M)"
            : autoTier === "Micro"
            ? "Micro (<$500K)"
            : "Indie ($500K-$2M)"
        } tier.`
      );
    } else {
      triggerToast(`Shortlisted ${actorName} for role.`);
    }
  };

  const handleToggleLocationPin = (locId: string) => {
    setPinnedLocationIds((prev) =>
      prev.includes(locId) ? prev.filter((id) => id !== locId) : [...prev, locId]
    );
    const loc = locations.find((l) => l.id === locId);
    if (!pinnedLocationIds.includes(locId)) {
      triggerToast(`Pinned location: ${loc?.region}`);
    }
  };

  const handleAddLocation = (newLoc: LocationOption) => {
    setLocations((prev) => {
      if (prev.some((l) => l.id === newLoc.id || l.region.toLowerCase() === newLoc.region.toLowerCase())) {
        return prev;
      }
      return [newLoc, ...prev];
    });
    setPinnedLocationIds((prev) => (prev.includes(newLoc.id) ? prev : [...prev, newLoc.id]));
    triggerToast(`Added & pinned ${newLoc.region} (${newLoc.matchScore || 92}% Script Match)`);
  };

  const handleTriggerDownload = (fileType: string, label: string) => {
    triggerToast(`Downloading ${label}... Export package generated.`);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://goodfilm.studios/share/${currentProject.id}`);
    triggerToast("View-only studio share link copied to clipboard!");
  };

  const handleReset = () => {
    setActiveTab("home");
    setImprovements(INITIAL_IMPROVEMENTS);
    setShortlistedActors({ "role-1": "Gemma Chan", "role-2": "Dev Patel" });
    setPinnedLocationIds(["loc-1", "loc-2"]);
    setBudgetTier("Indie");
    triggerToast("Studio workspace reset to Home page.");
  };

  return (
    <div className="h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F294D] text-white px-5 py-3 rounded-xl border border-border text-xs font-medium flex items-center gap-2.5 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Studio Header */}
      <StudioHeader
        currentProject={currentProject}
        versionTag={versionTag}
        onToggleScriptReader={() => setScriptReaderOpen(!scriptReaderOpen)}
        isScriptReaderOpen={scriptReaderOpen}
        onExport={() => setActiveTab("export")}
        onGoToHome={() => setActiveTab("home")}
      />

      {/* Main Studio Body: Sidebar + Dynamic Workspace Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Studio Sidebar Navigation */}
        <StudioSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          appliedEditsCount={appliedCount}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 w-full min-h-0">
          {activeTab === "home" && (
            <HomePage
              currentProject={currentProject}
              onSelectProject={handleSelectProject}
              onGoToUpload={() => setActiveTab("upload")}
            />
          )}

          {activeTab === "upload" && (
            <DragDropUploader
              onFileSelect={handleFileSelect}
              isAnalyzing={isAnalyzing}
              analysisBeat={analysisBeat}
            />
          )}

          {activeTab === "snapshot" && (
            <ScriptSnapshot
              fileName={fileName}
              currentProject={currentProject}
              onNext={() => setActiveTab("improve")}
              onBack={() => setActiveTab("home")}
            />
          )}

          {activeTab === "improve" && (
            <ScriptImprover
              improvements={improvements}
              versionTag={versionTag}
              appliedCount={appliedCount}
              onApply={handleApplyImprovement}
              onRevert={handleRevertImprovement}
              onOpenDiff={handleOpenDiff}
              onNext={() => setActiveTab("breakdown")}
              onBack={() => setActiveTab("snapshot")}
            />
          )}

          {activeTab === "breakdown" && <SceneBreakdownView currentProject={currentProject} />}

          {activeTab === "plans" && (
            <ProductionPlans
              casting={casting}
              locations={locations}
              budgetTier={budgetTier}
              shortlistedActors={shortlistedActors}
              pinnedLocationIds={pinnedLocationIds}
              onToggleActorShortlist={handleToggleActorShortlist}
              onBudgetTierChange={setBudgetTier}
              onToggleLocationPin={handleToggleLocationPin}
              onAddLocation={handleAddLocation}
              onNext={() => setActiveTab("storyboard")}
              onBack={() => setActiveTab("breakdown")}
            />
          )}

          {activeTab === "storyboard" && <StoryboardVisualizer currentProject={currentProject} />}

          {activeTab === "export" && (
            <SummaryExport
              fileName={fileName}
              versionTag={versionTag}
              improvements={improvements}
              casting={casting}
              shortlistedActors={shortlistedActors}
              budgetTier={budgetTier}
              locations={locations}
              pinnedLocationIds={pinnedLocationIds}
              onTriggerDownload={handleTriggerDownload}
              onCopyShareLink={handleCopyShareLink}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      {/* Slide-out Live Script Reader */}
      <ScriptReaderDrawer
        isOpen={scriptReaderOpen}
        onClose={() => setScriptReaderOpen(false)}
        currentProject={currentProject}
        improvements={improvements}
      />

      {/* Script Rewrite Diff Modal */}
      <DiffModal
        isOpen={diffModalOpen}
        improvement={selectedDiffImp}
        onClose={() => setDiffModalOpen(false)}
        onApply={handleApplyImprovement}
        onRevert={handleRevertImprovement}
      />

      {/* Studio Settings & Preferences Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSaveToast={triggerToast}
      />
    </div>
  );
};
