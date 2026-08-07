import React from "react";
import {
  Upload,
  BarChart3,
  Sparkles,
  Layers,
  Users,
  Image,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Film,
  CheckCircle2,
} from "lucide-react";

export type StudioTabId =
  | "upload"
  | "snapshot"
  | "improve"
  | "breakdown"
  | "plans"
  | "storyboard"
  | "export";

interface StudioNavGroup {
  groupName: string;
  items: {
    id: StudioTabId;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    description: string;
  }[];
}

interface StudioSidebarProps {
  activeTab: StudioTabId;
  onSelectTab: (tab: StudioTabId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  appliedEditsCount: number;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  appliedEditsCount,
}) => {
  const navGroups: StudioNavGroup[] = [
    {
      groupName: "Script Analysis",
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
          id: "improve",
          label: "AI Rewrites & Diff",
          icon: Sparkles,
          badge: appliedEditsCount > 0 ? `${appliedEditsCount} applied` : undefined,
          description: "Dialogue & structure polish",
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
          label: "Casting & Budget",
          icon: Users,
          description: "Talent shortlist & location incentives",
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
          id: "export",
          label: "Pitch Deck & Export",
          icon: FileCheck2,
          description: "Summary package & call sheets",
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
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
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
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all relative group ${
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
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info / Version tag */}
      {!collapsed && (
        <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Project Saved to Studio</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
            Auto-synced • v1.4 Active
          </p>
        </div>
      )}
    </aside>
  );
};
