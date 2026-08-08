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
} from "./reelRefineData";

import { StudioHeader } from "./StudioHeader";
import { StudioSidebar, StudioTabId } from "./StudioSidebar";
import { ScriptReaderDrawer } from "./ScriptReaderDrawer";
import { DragDropUploader } from "./DragDropUploader";
import { ScriptSnapshot } from "./ScriptSnapshot";
import { ScriptImprover } from "./ScriptImprover";
import { SceneBreakdownView } from "./SceneBreakdownView";
import { ProductionPlans } from "./ProductionPlans";
import { StoryboardVisualizer } from "./StoryboardVisualizer";
import { SummaryExport } from "./SummaryExport";
import { DiffModal } from "./DiffModal";

export const ReelRefineStudio: React.FC = () => {
  // Navigation & Project State
  const [activeTab, setActiveTab] = useState<StudioTabId>("upload");
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
  const [casting] = useState<CastRole[]>(INITIAL_CASTING);
  const [shortlistedActors, setShortlistedActors] = useState<Record<string, string>>({
    "role-1": "Gemma Chan",
    "role-2": "Dev Patel",
  });
  const [budgetTier, setBudgetTier] = useState<"Micro" | "Indie" | "Studio">("Indie");
  const [locations] = useState<LocationOption[]>(INITIAL_LOCATIONS);
  const [pinnedLocationIds, setPinnedLocationIds] = useState<string[]>(["loc-1", "loc-2"]);

  // Diff Modal State
  const [diffModalOpen, setDiffModalOpen] = useState<boolean>(false);
  const [selectedDiffImp, setSelectedDiffImp] = useState<ScriptImprovement | null>(null);

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const appliedCount = improvements.filter((imp) => imp.applied).length;
  const versionTag = appliedCount === 0 ? "v1.4 - Active" : `v${appliedCount + 1}.0 - Modified`;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleSelectProject = (proj: ProjectOption) => {
    setCurrentProject(proj);
    setFileName(`${proj.title.replace(/\s+/g, "_")}.fdx`);
    setBudgetTier(proj.budgetTier);
    triggerToast(`Loaded project: "${proj.title}"`);
  };

  const handleFileSelect = (selectedName: string) => {
    setFileName(selectedName);
    setIsAnalyzing(true);
    setAnalysisBeat(0);

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
    setShortlistedActors((prev) => ({
      ...prev,
      [roleId]: actorName,
    }));
    triggerToast(`Shortlisted ${actorName} for role.`);
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

  const handleTriggerDownload = (fileType: string, label: string) => {
    triggerToast(`Downloading ${label}... Export package generated.`);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://reelrefine.studio/share/${currentProject.id}`);
    triggerToast("View-only studio share link copied to clipboard!");
  };

  const handleReset = () => {
    setActiveTab("upload");
    setImprovements(INITIAL_IMPROVEMENTS);
    setShortlistedActors({ "role-1": "Gemma Chan", "role-2": "Dev Patel" });
    setPinnedLocationIds(["loc-1", "loc-2"]);
    setBudgetTier("Indie");
    triggerToast("Studio workspace reset to original state.");
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
        onSelectProject={handleSelectProject}
        versionTag={versionTag}
        onToggleScriptReader={() => setScriptReaderOpen(!scriptReaderOpen)}
        isScriptReaderOpen={scriptReaderOpen}
        onExport={() => setActiveTab("export")}
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
        />

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 w-full min-h-0">
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
              onNext={() => setActiveTab("improve")}
              onBack={() => setActiveTab("upload")}
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

          {activeTab === "breakdown" && <SceneBreakdownView />}

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
              onNext={() => setActiveTab("storyboard")}
              onBack={() => setActiveTab("breakdown")}
            />
          )}

          {activeTab === "storyboard" && <StoryboardVisualizer />}

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
      />

      {/* Script Rewrite Diff Modal */}
      <DiffModal
        isOpen={diffModalOpen}
        improvement={selectedDiffImp}
        onClose={() => setDiffModalOpen(false)}
        onApply={handleApplyImprovement}
        onRevert={handleRevertImprovement}
      />
    </div>
  );
};
