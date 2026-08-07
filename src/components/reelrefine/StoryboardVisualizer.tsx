import React, { useState } from "react";
import { Image, Camera, Sun, Sparkles, Copy, Check, Wand2 } from "lucide-react";
import { INITIAL_STORYBOARDS, StoryboardConcept } from "./reelRefineData";

export const StoryboardVisualizer: React.FC = () => {
  const [storyboards] = useState<StoryboardConcept[]>(INITIAL_STORYBOARDS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (sb: StoryboardConcept) => {
    const fullPrompt = `${sb.promptDescription} --camera "${sb.cameraSetup}" --lighting "${sb.lightingStyle}" --ar 16:9 --v 6.0`;
    navigator.clipboard.writeText(fullPrompt);
    setCopiedId(sb.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Image className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              AI Storyboard & Concept Visualizer
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate cinematic shot keyframes, camera setup guides, and lighting atmosphere prompts for key climactic scenes.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-[#001b94] hover:bg-[#001b94]/90 text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
        >
          <Wand2 className="h-4 w-4 text-[#FF6F00]" />
          <span>Generate New Keyframe</span>
        </button>
      </div>

      {/* Storyboard Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storyboards.map((sb) => (
          <div
            key={sb.id}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#001b94]/40 transition-all shadow-xs flex flex-col justify-between"
          >
            {/* Visual Canvas Card Preview */}
            <div className={`h-48 bg-gradient-to-br ${sb.gradientStyle} p-5 relative flex flex-col justify-between text-white border-b border-border`}>
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-mono font-semibold">
                  SCENE #{sb.sceneNumber} KEYFRAME
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(sb)}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
                  title="Copy Midjourney / Stable Diffusion Prompt"
                >
                  {copiedId === sb.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="z-10">
                <h3 className="font-display font-semibold text-lg drop-shadow-md">{sb.title}</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono mt-0.5">
                  <Camera className="h-3.5 w-3.5" />
                  <span>{sb.cameraSetup}</span>
                </div>
              </div>
            </div>

            {/* Content & Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Lighting Setup */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1 font-mono">
                    <Sun className="h-3.5 w-3.5 text-[#FF6F00]" /> Lighting Atmosphere
                  </div>
                  <p className="text-xs text-foreground font-medium">{sb.lightingStyle}</p>
                </div>

                {/* Prompt Description */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1 font-mono">
                    <Sparkles className="h-3.5 w-3.5 text-[#001b94]" /> Visual Concept Prompt
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-border/50">
                    "{sb.promptDescription}"
                  </p>
                </div>
              </div>

              {/* Mood Tags */}
              <div className="pt-2 border-t border-border flex flex-wrap gap-1.5">
                {sb.moodTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
