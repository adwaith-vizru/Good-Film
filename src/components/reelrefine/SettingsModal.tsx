import React, { useState } from "react";
import {
  X,
  Settings,
  Sparkles,
  ShieldCheck,
  Sliders,
  Save,
  Check,
  RotateCcw,
  Palette,
  FileCode,
  Globe,
  Bot,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveToast,
}) => {
  const [aiPersona, setAiPersona] = useState<"director" | "producer" | "dialogue">("director");
  const [autoSaveFreq, setAutoSaveFreq] = useState<"realtime" | "1m" | "5m">("realtime");
  const [scriptFont, setScriptFont] = useState<"courier" | "inter">("courier");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveToast("Studio preferences saved successfully!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="bg-card rounded-2xl border border-border max-w-xl w-full overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#001b94] border border-white/20 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-base font-display font-semibold text-white">
                Studio Preferences & Settings
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Good Film Studios • Configuration & AI Tuning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[75vh] text-xs">
          {/* Section 1: AI Analysis Engine Persona */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-[#0F294D] uppercase font-mono tracking-wider">
              <Bot className="w-4 h-4 text-[#001b94]" /> 1. AI Screenplay Copilot Persona
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "director", label: "Director's Cut", desc: "Focuses on subtext, pacing & visual drama" },
                { key: "producer", label: "Executive Producer", desc: "Commercial appeal, budget & casting fit" },
                { key: "dialogue", label: "Dialogue Polish", desc: "Sharp, naturalistic spoken lines & rhythm" },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setAiPersona(p.key as any)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                    aiPersona === p.key
                      ? "border-[#001b94] bg-[#001b94]/10 ring-1 ring-[#001b94]"
                      : "border-border hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold text-[#0F294D] flex items-center justify-between">
                    <span>{p.label}</span>
                    {aiPersona === p.key && <Check className="w-3.5 h-3.5 text-[#001b94]" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Auto-Save & Cloud Sync */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 font-semibold text-[#0F294D] uppercase font-mono tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Auto-Sync & Backup Frequency
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "realtime", label: "Real-time Sync", desc: "Instant auto-save on every edit" },
                { key: "1m", label: "Every 1 Minute", desc: "Periodic background backup" },
                { key: "5m", label: "Every 5 Minutes", desc: "Manual draft checkpoints" },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setAutoSaveFreq(f.key as any)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                    autoSaveFreq === f.key
                      ? "border-[#001b94] bg-[#001b94]/10 ring-1 ring-[#001b94]"
                      : "border-border hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold text-[#0F294D] flex items-center justify-between">
                    <span>{f.label}</span>
                    {autoSaveFreq === f.key && <Check className="w-3.5 h-3.5 text-[#001b94]" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Screenplay Formatting Font */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 font-semibold text-[#0F294D] uppercase font-mono tracking-wider">
              <FileCode className="w-4 h-4 text-[#FF6F00]" /> 3. Live Script Reader Formatting
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScriptFont("courier")}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  scriptFont === "courier"
                    ? "border-[#001b94] bg-[#001b94]/10 ring-1 ring-[#001b94]"
                    : "border-border hover:border-slate-300"
                }`}
              >
                <div className="font-semibold text-[#0F294D] font-mono">Courier Prime (Industry Standard)</div>
                <p className="text-[10px] text-muted-foreground">Monospaced font 12pt standard for screenplay drafts.</p>
              </button>

              <button
                type="button"
                onClick={() => setScriptFont("inter")}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  scriptFont === "inter"
                    ? "border-[#001b94] bg-[#001b94]/10 ring-1 ring-[#001b94]"
                    : "border-border hover:border-slate-300"
                }`}
              >
                <div className="font-semibold text-[#0F294D] font-sans">Modern Clean Sans (Reading Mode)</div>
                <p className="text-[10px] text-muted-foreground">Proportional sans-serif font for quick mobile reading.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-card border-t border-border flex items-center justify-between gap-3">
          <span className="text-[11px] text-muted-foreground font-mono">
            Good Film Studios v1.4 • Saved locally
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-accent text-xs font-medium rounded-xl border border-border transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#001b94] hover:bg-[#001470] text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" /> Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
