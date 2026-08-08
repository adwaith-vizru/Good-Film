import React, { useState } from "react";
import {
  Image,
  Camera,
  Sun,
  Sparkles,
  Copy,
  Check,
  Wand2,
  X,
  Plus,
  Film,
  Trash2,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { INITIAL_STORYBOARDS, StoryboardConcept } from "./reelRefineData";

const CAMERA_PRESETS = [
  "Low-Angle Wide (Anamorphic 35mm)",
  "Extreme Close-Up on Visor Reflection",
  "Tracking Overhead Bird's Eye Shot",
  "Dutch Angle Medium Over-The-Shoulder",
  "Steadicam Tracking Shot (85mm Lens)",
];

const LIGHTING_PRESETS = [
  "Harsh High-Contrast Solar Flare + Crimson Warning Strobe",
  "Pulsing Emerald Telemetry & Amber Ignition Glow",
  "Liquid Gold Plasma Whirling Over Deep Space Black",
  "Volumetric Golden Hour Rays & Atmospheric Dust",
  "Bioluminescent Blue & Neon Cyan Rim Lighting",
];

const QUICK_CHIPS = [
  "Anamorphic 35mm Lens Flare",
  "Volumetric Solar Dust",
  "IMAX 70mm Photorealistic",
  "Deep Space Black Contrast",
  "High Tension Color Grade",
];

const GRADIENT_PRESETS = [
  "from-amber-900/50 via-slate-900 to-indigo-950",
  "from-emerald-950/60 via-slate-900 to-amber-950",
  "from-[#FF6F00]/40 via-[#0F294D] to-black",
  "from-cyan-950/60 via-slate-900 to-blue-950",
  "from-purple-950/50 via-slate-900 to-rose-950",
];

export const StoryboardVisualizer: React.FC = () => {
  const [storyboards, setStoryboards] = useState<StoryboardConcept[]>(INITIAL_STORYBOARDS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Prompt Bar Modal/Drawer State
  const [showPromptBar, setShowPromptBar] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [sceneNum, setSceneNum] = useState<number>(3);
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_PRESETS[0]);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyPrompt = (sb: StoryboardConcept) => {
    const fullPrompt = `${sb.promptDescription} --camera "${sb.cameraSetup}" --lighting "${sb.lightingStyle}" --ar 16:9 --v 6.0`;
    navigator.clipboard.writeText(fullPrompt);
    setCopiedId(sb.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddQuickChip = (chip: string) => {
    if (!promptText.includes(chip)) {
      setPromptText((prev) => (prev ? `${prev}, ${chip}` : chip));
    }
  };

  const handleGenerateKeyframe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const generatedTitle =
        titleInput.trim() ||
        promptText.split(" ").slice(0, 4).join(" ").replace(/,/g, "") ||
        `Scene #${sceneNum} Concept`;

      const randomGradient = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];

      const newKeyframe: StoryboardConcept = {
        id: `sb-custom-${Date.now()}`,
        sceneNumber: sceneNum,
        title: generatedTitle,
        cameraSetup: selectedCamera,
        lightingStyle: selectedLighting,
        promptDescription: promptText.trim(),
        moodTags: ["AI Generated", "Cinematic 35mm", "Custom Concept"],
        gradientStyle: randomGradient,
      };

      setStoryboards((prev) => [newKeyframe, ...prev]);
      setIsGenerating(false);
      setShowPromptBar(false);

      // Reset form
      setPromptText("");
      setTitleInput("");

      // Trigger Toast
      setToastMsg(`Generated new AI Keyframe: "${generatedTitle}"`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 1200);
  };

  const handleDeleteKeyframe = (id: string) => {
    setStoryboards((prev) => prev.filter((sb) => sb.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F294D] dark:bg-slate-900 text-white px-5 py-3 rounded-xl border border-border text-xs font-medium flex items-center gap-2.5 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Image className="h-5 w-5 text-[#FF6F00]" />
            <h2 className="text-xl font-display font-semibold text-[#0F294D] dark:text-foreground">
              AI Storyboard & Concept Visualizer
            </h2>
          </div>
          <p className="text-xs text-[#64748B] dark:text-muted-foreground">
            Generate cinematic shot keyframes, camera setup guides, and lighting atmosphere prompts for key climactic scenes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPromptBar(!showPromptBar)}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 shadow-xs transition-all self-start md:self-auto ${
            showPromptBar
              ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              : "bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white"
          }`}
        >
          {showPromptBar ? (
            <>
              <X className="h-4 w-4 text-[#FF6F00]" />
              <span>Close Generator</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 text-[#FF6F00]" />
              <span>Generate New Keyframe</span>
            </>
          )}
        </button>
      </div>

      {/* PROMPT TYPE BAR / GENERATOR PANEL */}
      {showPromptBar && (
        <form
          onSubmit={handleGenerateKeyframe}
          className="bg-card border-2 border-[#001b94]/30 dark:border-sky-500/30 rounded-2xl p-6 shadow-lg space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-[#001b94] dark:text-sky-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-[#FF6F00]" />
              <span>AI Keyframe Prompt Bar & Generator</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPromptBar(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Input Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0F294D] dark:text-foreground flex items-center justify-between">
              <span>Enter Keyframe Visual Prompt:</span>
              <span className="text-[10px] font-mono text-muted-foreground">Supports Midjourney / DALL-E / Flux descriptors</span>
            </label>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. A wide cinematic 35mm shot of Dr. Alex Rivers navigating through a blinding solar storm in a matte-white suit, illuminated by amber engine flares and deep space shadows..."
              className="w-full p-3.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001b94] dark:focus:ring-sky-400 text-foreground font-medium placeholder:text-slate-400"
              required
            />
          </div>

          {/* Quick Style Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-semibold text-muted-foreground block">
              + Quick Add Style Descriptors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleAddQuickChip(chip)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#FF6F00]" /> {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Grid (Scene #, Title, Camera, Lighting) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-border">
            {/* Scene # */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#0F294D] dark:text-foreground">Scene Number</label>
              <select
                value={sceneNum}
                onChange={(e) => setSceneNum(Number(e.target.value))}
                className="w-full p-2 text-xs bg-background border border-border rounded-lg text-foreground font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    Scene #{num}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#0F294D] dark:text-foreground">Keyframe Title (Optional)</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Solar Chamber Breach"
                className="w-full p-2 text-xs bg-background border border-border rounded-lg text-foreground font-medium"
              />
            </div>

            {/* Camera Setup Preset */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#0F294D] dark:text-foreground">Camera Setup</label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full p-2 text-xs bg-background border border-border rounded-lg text-foreground font-medium truncate"
              >
                {CAMERA_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </div>

            {/* Lighting Style Preset */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#0F294D] dark:text-foreground">Lighting & Mood</label>
              <select
                value={selectedLighting}
                onChange={(e) => setSelectedLighting(e.target.value)}
                className="w-full p-2 text-xs bg-background border border-border rounded-lg text-foreground font-medium truncate"
              >
                {LIGHTING_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPromptBar(false)}
              className="px-4 py-2 text-xs font-medium text-[#0F294D] dark:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !promptText.trim()}
              className="px-5 py-2 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Synthesizing AI Keyframe...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#FF6F00]" /> Generate Keyframe with AI
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Storyboard Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storyboards.map((sb) => (
          <div
            key={sb.id}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#001b94]/40 dark:hover:border-sky-500/40 transition-all shadow-xs flex flex-col justify-between"
          >
            {/* Visual Canvas Card Preview */}
            <div className={`h-48 bg-gradient-to-br ${sb.gradientStyle} p-5 relative flex flex-col justify-between text-white border-b border-border`}>
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-mono font-semibold">
                  SCENE #{sb.sceneNumber} KEYFRAME
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(sb)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
                    title="Copy Prompt"
                  >
                    {copiedId === sb.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  {sb.id.startsWith("sb-custom-") && (
                    <button
                      type="button"
                      onClick={() => handleDeleteKeyframe(sb.id)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-900/60 backdrop-blur-md text-white transition-colors text-rose-300"
                      title="Delete Keyframe"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
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
                    <Sparkles className="h-3.5 w-3.5 text-[#001b94] dark:text-sky-400" /> Visual Concept Prompt
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
