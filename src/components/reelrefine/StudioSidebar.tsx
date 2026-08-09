import React from "react";
import {
  Home,
  Upload,
  BarChart3,
  Sparkles,
  Layers,
  Users,
  Image,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Settings,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Megaphone,
} from "lucide-react";

export type StudioTabId =
  | "home"
  | "upload"
  | "snapshot"
  | "quality"
  | "improve"
  | "market"
  | "breakdown"
  | "plans"
  | "storyboard"
  | "investment"
  | "export"
  | "release";

interface StudioNavGroup {
  groupName: string;
  items: {
    id: StudioTabId;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    description: string;
    subItems?: { label: string; subTabId: string }[];
  }[];
}

interface StudioSidebarProps {
  activeTab: StudioTabId;
  onSelectTab: (tab: StudioTabId, subTabId?: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  appliedEditsCount: number;
  onOpenSettings?: () => void;
  activeReleaseSubTab?: string;
  activeProductionSubTab?: string;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  appliedEditsCount,
  onOpenSettings,
  activeReleaseSubTab = "window",
  activeProductionSubTab = "budget",
}) => {
  const navGroups: StudioNavGroup[] = [
    {
      groupName: "Overview",
      items: [
        {
          id: "home",
          label: "Home / Movies",
          icon: Home,
          badge: "3",
          description: "Movie catalog & project dashboard",
        },
      ],
    },
    {
      groupName: "Script Intelligence",
      items: [
        {
          id: "upload",
          label: "Upload & Import",
          icon: Upload,
          description: "Script files & sample projects",
        },
        {
          id: "snapshot",
          label: "Script Snapshot",
          icon: BarChart3,
          badge: "114p",
          description: "Structure, pacing & logline",
        },
        {
          id: "quality",
          label: "Script Quality Analysis",
          icon: ShieldCheck,
          description: "Dialogue, structure & character depth",
        },
        {
          id: "improve",
          label: "AI Rewrites & Diff",
          icon: Sparkles,
          badge: appliedEditsCount > 0 ? `${appliedEditsCount} applied` : undefined,
          description: "Dialogue & structure polish",
        },
        {
          id: "market",
          label: "Market Viability",
          icon: TrendingUp,
          description: "Commercial success, collision & OTT fit",
        },
      ],
    },
    {
      groupName: "Pre-Production",
      items: [
        {
          id: "breakdown",
          label: "Scene Breakdowns",
          icon: Layers,
          badge: "5 scenes",
          description: "Props, cast tags & VFX difficulty",
        },
        {
          id: "plans",
          label: "Production Planning",
          icon: Users,
          description: "Budget, schedule, locations & casting",
          subItems: [
            { label: "Budget Estimation", subTabId: "budget" },
            { label: "Shooting Schedule", subTabId: "schedule" },
            { label: "Location Scout", subTabId: "locations" },
            { label: "Casting & Talent", subTabId: "casting" },
          ],
        },
      ],
    },
    {
      groupName: "Delivery & Pitch",
      items: [
        {
          id: "storyboard",
          label: "AI Visual Storyboards",
          icon: Image,
          badge: "3 concepts",
          description: "Cinematic shot keyframes",
        },
        {
          id: "investment",
          label: "Investment Intelligence",
          icon: PieChart,
          description: "Investment score & market comps",
        },
        {
          id: "export",
          label: "Pitch Deck & Export",
          icon: FileCheck2,
          description: "Summary package & call sheets",
        },
        {
          id: "release",
          label: "Release & Marketing",
          icon: Megaphone,
          description: "Release window, certification & posters",
          subItems: [
            { label: "Release Window", subTabId: "window" },
            { label: "Certification Prediction", subTabId: "certification" },
            { label: "Language Options", subTabId: "languages" },
            { label: "AI Poster Generator", subTabId: "poster" },
            { label: "Trailer Recommendation", subTabId: "trailer" },
          ],
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-card border-r border-border flex flex-col justify-between transition-all duration-300 z-20 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="py-4 space-y-6 overflow-y-auto min-h-0 flex-1">
        {/* Sidebar Header / Collapse Toggle */}
        <div className="px-4 flex items-center justify-between">
          {!collapsed && (
            <div className="text-[11px] font-mono font-semibold uppercase text-muted-foreground tracking-wider">
              Studio Navigation
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav Items Grouped */}
        <nav className="space-y-5 px-2">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] uppercase font-semibold text-muted-foreground/70 tracking-wider font-mono">
                  {group.groupName}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all relative group cursor-pointer ${
                        isActive
                          ? "bg-[#001b94] text-white font-medium shadow-xs"
                          : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                      title={collapsed ? `${item.label}: ${item.description}` : undefined}
                    >
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive
                            ? "text-[#FF6F00]"
                            : "text-slate-500 group-hover:text-foreground"
                        }`}
                      />

                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </button>

                    {/* Sub-items tree (only when expanded & active) */}
                    {!collapsed && isActive && item.subItems && (
                      <div className="ml-7 mt-1.5 mb-1.5 space-y-0.5 border-l-2 border-[#FF6F00]/50 pl-2.5">
                        {item.subItems.map((sub, idx) => {
                          const isSubActive =
                            (item.id === "release" && activeReleaseSubTab === sub.subTabId) ||
                            (item.id === "plans" && activeProductionSubTab === sub.subTabId);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTab(item.id, sub.subTabId);
                              }}
                              className={`w-full text-left text-[11px] py-1 px-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                                isSubActive
                                  ? "text-[#001b94] dark:text-sky-300 font-bold bg-[#001b94]/10 dark:bg-sky-900/40"
                                  : "text-slate-700 dark:text-slate-300 font-medium hover:text-[#001b94] dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform ${
                                  isSubActive ? "bg-[#FF6F00] scale-125 shadow-2xs" : "bg-[#FF6F00]/70"
                                }`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info & Settings Button */}
      <div className="p-3 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2">
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span className="truncate">Project Saved to Studio</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              Auto-synced • v1.4 Active
            </p>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto" title="Project Auto-synced" />
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-[#001b94] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
          title="Studio Settings & Preferences"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>
      </div>
    </aside>
  );
};
