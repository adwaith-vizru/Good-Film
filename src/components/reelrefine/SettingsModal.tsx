import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  Bell,
  Zap,
  KeyRound,
  User,
  Lock,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  QrCode,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToast: (msg: string) => void;
}

type SettingsTab = "general" | "notifications" | "personalization" | "apiKey" | "account";

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveToast,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // Live General Settings State
  const [appearance, setAppearance] = useState("Light");
  const [contrast, setContrast] = useState("Standard");
  const [accentColor, setAccentColor] = useState("Good Film Navy");
  const [iconColor, setIconColor] = useState("Default");
  const [language, setLanguage] = useState("English (US)");

  // MFA Interactive Flow State
  const [mfaSetupStep, setMfaSetupStep] = useState<"idle" | "qr" | "enabled">("idle");
  const [mfaCode, setMfaCode] = useState("");

  // Personalization State
  const [aiPersona, setAiPersona] = useState("Director's Cut");
  const [autoSaveFreq, setAutoSaveFreq] = useState("Real-time Sync");
  const [scriptFont, setScriptFont] = useState("Courier Prime 12pt");

  // Notifications State
  const [emailDigest, setEmailDigest] = useState("Weekly Studio Summary");
  const [rewriteAlerts, setRewriteAlerts] = useState("Enabled");

  // API Key State with Security Masking
  const [apiKey, setApiKey] = useState("gf_sk_98472938472910384752");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // LIVE APPEARANCE HANDLER
  const handleAppearanceChange = (newVal: string) => {
    setAppearance(newVal);
    if (newVal === "Dark") {
      document.documentElement.classList.add("dark");
    } else if (newVal === "Light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
    onSaveToast(`Appearance mode set to ${newVal}`);
  };

  // LIVE CONTRAST HANDLER
  const handleContrastChange = (newVal: string) => {
    setContrast(newVal);
    if (newVal === "High") {
      document.documentElement.classList.add("contrast-125");
    } else {
      document.documentElement.classList.remove("contrast-125");
    }
    onSaveToast(`UI Contrast updated to ${newVal}`);
  };

  // LIVE ACCENT COLOR HANDLER
  const handleAccentColorChange = (newVal: string) => {
    setAccentColor(newVal);
    if (newVal === "Studio Amber") {
      document.documentElement.style.setProperty("--primary-accent", "#FF6F00");
    } else if (newVal === "Ocean Teal") {
      document.documentElement.style.setProperty("--primary-accent", "#0D9488");
    } else {
      document.documentElement.style.setProperty("--primary-accent", "#001b94");
    }
    onSaveToast(`Studio accent color set to ${newVal}`);
  };

  // LIVE ICON COLOR HANDLER
  const handleIconColorChange = (newVal: string) => {
    setIconColor(newVal);
    onSaveToast(`Icon theme updated to ${newVal}`);
  };

  // LIVE LANGUAGE HANDLER
  const handleLanguageChange = (newVal: string) => {
    setLanguage(newVal);
    onSaveToast(`Studio interface language set to ${newVal}`);
  };

  // MFA VERIFICATION HANDLER
  const handleVerifyMfa = () => {
    if (mfaCode.length >= 4) {
      setMfaSetupStep("enabled");
      onSaveToast("MFA Multi-Factor Authentication enabled successfully!");
    } else {
      onSaveToast("Please enter a valid 6-digit authenticator code.");
    }
  };

  if (!isOpen) return null;

  const sidebarNavItems: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "personalization", label: "Personalization", icon: Zap },
    { id: "apiKey", label: "API Key", icon: KeyRound },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in font-sans text-slate-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="bg-[#121214] border border-slate-800 rounded-3xl max-w-4xl w-full h-[82vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 bg-[#18181b] border-b md:border-b-0 md:border-r border-slate-800/80 p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-4">
            {/* Top Close Button (X) */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="w-9 h-9 rounded-xl border border-slate-700/80 bg-[#27272a] text-slate-200 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 md:hidden">Studio Settings</span>
            </div>

            {/* Sidebar Tab List */}
            <nav className="space-y-1 overflow-y-auto no-scrollbar pr-1">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-3 ${
                      isActive
                        ? "bg-[#27272a] text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 hidden md:block">
            Good Film Studios v1.4
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="flex-1 bg-[#121214] p-6 md:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <h2 id="settings-modal-title" className="text-xl font-display font-semibold text-white tracking-tight capitalize">
                {activeTab === "general" ? "General" : sidebarNavItems.find((i) => i.id === activeTab)?.label}
              </h2>

              <button
                type="button"
                onClick={() => {
                  onSaveToast("All settings saved and applied to studio!");
                  onClose();
                }}
                className="px-4 py-1.5 bg-[#001b94] hover:bg-[#001470] text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
              >
                Save & Close
              </button>
            </div>

            {/* GENERAL TAB VIEW — ALL FEATURES LIVE */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-in">
                {/* Security Callout Banner & Interactive MFA Flow */}
                <div className="bg-[#09090b] p-5 rounded-2xl border border-slate-800/90 space-y-4 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
                      <Lock className="w-5 h-5" />
                    </div>
                    {mfaSetupStep !== "idle" && (
                      <button
                        type="button"
                        onClick={() => setMfaSetupStep("idle")}
                        className="text-slate-500 hover:text-slate-300 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">Secure your studio account</h3>
                      {mfaSetupStep === "enabled" && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold border border-emerald-500/30">
                          MFA Enabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-lg">
                      Add multi-factor authentication (MFA), like a text message or authenticator app, to protect your studio scripts.
                    </p>
                  </div>

                  {/* Interactive MFA QR Setup Flow */}
                  {mfaSetupStep === "idle" && (
                    <button
                      type="button"
                      onClick={() => setMfaSetupStep("qr")}
                      className="px-4 py-2 bg-[#27272a] hover:bg-slate-700 text-white border border-slate-700 rounded-full text-xs font-semibold transition-all"
                    >
                      Set up MFA
                    </button>
                  )}

                  {mfaSetupStep === "qr" && (
                    <div className="p-4 bg-[#18181b] border border-slate-800 rounded-xl space-y-3 animate-fade-in text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center text-slate-900">
                          <QrCode className="w-12 h-12 text-slate-900" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-200">1. Scan QR with Authenticator App</p>
                          <p className="text-[11px] text-slate-400 font-mono">Secret Key: GOODFILM-STUDIO-849204</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <p className="font-semibold text-slate-200">2. Enter 6-Digit Code</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                            placeholder="123456"
                            className="bg-[#09090b] border border-slate-700 text-white font-mono text-center text-sm tracking-widest px-3 py-1.5 rounded-lg w-32 focus:outline-none focus:ring-1 focus:ring-[#001b94]"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyMfa}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Verify & Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {mfaSetupStep === "enabled" && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Account protected with 2FA Authenticator
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMfaSetupStep("idle");
                          onSaveToast("MFA disabled.");
                        }}
                        className="text-[11px] text-slate-400 hover:text-white underline font-mono"
                      >
                        Disable
                      </button>
                    </div>
                  )}
                </div>

                {/* General Live Interactive Settings Rows List */}
                <div className="space-y-1 text-xs">
                  {/* Row 1: Live Appearance */}
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200 block">Appearance</span>
                      <span className="text-[11px] text-slate-400">Live UI theme mode toggle</span>
                    </div>
                    <select
                      value={appearance}
                      onChange={(e) => handleAppearanceChange(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="System">System Default</option>
                      <option value="Dark">Dark Mode</option>
                      <option value="Light">Light Mode</option>
                    </select>
                  </div>

                  {/* Row 2: Live Contrast */}
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200 block">Contrast</span>
                      <span className="text-[11px] text-slate-400">Adjust screen contrast mode</span>
                    </div>
                    <select
                      value={contrast}
                      onChange={(e) => handleContrastChange(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Standard">Standard Contrast</option>
                      <option value="High">High Contrast</option>
                      <option value="System">System Default</option>
                    </select>
                  </div>

                  {/* Row 3: Live Accent Color */}
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200 block">Accent color</span>
                      <span className="text-[11px] text-slate-400">Primary studio highlight color</span>
                    </div>
                    <select
                      value={accentColor}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Good Film Navy">Default (Good Film Navy)</option>
                      <option value="Studio Amber">Studio Amber (#FF6F00)</option>
                      <option value="Ocean Teal">Ocean Teal (#0D9488)</option>
                    </select>
                  </div>

                  {/* Row 4: Live Icon Color */}
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200 block">Icon color</span>
                      <span className="text-[11px] text-slate-400">Sidebar & button icon palette</span>
                    </div>
                    <select
                      value={iconColor}
                      onChange={(e) => handleIconColorChange(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Default">Default Palette</option>
                      <option value="Black">Black Icons</option>
                      <option value="Monochrome">Monochrome</option>
                    </select>
                  </div>

                  {/* Row 5: Live Language */}
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200 block">Language</span>
                      <span className="text-[11px] text-slate-400">Studio workspace language</span>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Spanish">Spanish (ES)</option>
                      <option value="French">French (FR)</option>
                      <option value="Auto-detect">Auto-detect</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB VIEW */}
            {activeTab === "notifications" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <p className="text-slate-400">Manage studio alerts, AI rewrite notifications, and export status updates.</p>

                <div className="space-y-1">
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-200">Studio Digest Email</div>
                      <div className="text-[11px] text-slate-400">Receive summary reports for screenplay improvements</div>
                    </div>
                    <select
                      value={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Weekly Studio Summary">Weekly Summary</option>
                      <option value="Immediate">Immediate</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>

                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-200">AI Rewrite Toast Alerts</div>
                      <div className="text-[11px] text-slate-400">Show notification toasts when AI suggestions are applied</div>
                    </div>
                    <select
                      value={rewriteAlerts}
                      onChange={(e) => setRewriteAlerts(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Enabled">Enabled</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PERSONALIZATION TAB VIEW */}
            {activeTab === "personalization" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <p className="text-slate-400">Configure AI copilot analysis personas, auto-save frequency, and reader fonts.</p>

                <div className="space-y-1">
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-200">AI Model Persona</div>
                      <div className="text-[11px] text-slate-400">Controls subtext analysis tone & rewrite style</div>
                    </div>
                    <select
                      value={aiPersona}
                      onChange={(e) => setAiPersona(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Director's Cut">Director's Cut</option>
                      <option value="Executive Producer">Executive Producer</option>
                      <option value="Dialogue Polish">Dialogue Polish</option>
                    </select>
                  </div>

                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-200">Live Reader Typography</div>
                      <div className="text-[11px] text-slate-400">Default font used in Live Script Reader drawer</div>
                    </div>
                    <select
                      value={scriptFont}
                      onChange={(e) => setScriptFont(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Courier Prime 12pt">Courier Prime 12pt</option>
                      <option value="Modern Clean Sans">Modern Clean Sans</option>
                    </select>
                  </div>

                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-200">Auto-save Frequency</div>
                      <div className="text-[11px] text-slate-400">Interval between automated draft checkpoints</div>
                    </div>
                    <select
                      value={autoSaveFreq}
                      onChange={(e) => setAutoSaveFreq(e.target.value)}
                      className="bg-[#18181b] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium cursor-pointer"
                    >
                      <option value="Real-time Sync">Real-time Sync</option>
                      <option value="Every 1 Minute">Every 1 Minute</option>
                      <option value="Every 5 Minutes">Every 5 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* API KEY TAB VIEW */}
            {activeTab === "apiKey" && (
              <div className="space-y-5 animate-fade-in text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">Studio AI API Key</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold border border-emerald-500/30">
                      Active & Verified
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Your API key is stored securely in local browser storage and used for live AI screenplay analysis and rewrites.
                  </p>
                </div>

                {/* API Key Input Box */}
                <div className="p-5 bg-[#18181b] border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Studio Secret API Key
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {showApiKey ? "Key visible on screen" : "Masked with * for security"}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API Key (e.g. gf_sk_...)"
                      className="w-full bg-[#09090b] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#001b94] pr-24 tracking-wider"
                    />

                    {/* View / Eye Toggle Button */}
                    <div className="absolute right-2 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-[11px] font-medium border border-slate-700/60"
                        title={showApiKey ? "Hide API Key" : "View API Key"}
                      >
                        {showApiKey ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>View</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-400">
                      Keys are encrypted at rest. Never share your studio secret keys.
                    </p>
                    <button
                      type="button"
                      onClick={() => onSaveToast("API Key updated and stored securely!")}
                      className="px-4 py-2 bg-[#001b94] hover:bg-[#001470] text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB VIEW */}
            {activeTab === "account" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <p className="text-slate-400">Writer profile and active studio organization information.</p>

                <div className="space-y-1">
                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="font-medium text-slate-200">Writer Profile</span>
                    <span className="text-slate-400 font-mono">Elena Vance & Marcus Wright</span>
                  </div>

                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="font-medium text-slate-200">Studio Email</span>
                    <span className="text-slate-400 font-mono">writer@goodfilm.studios</span>
                  </div>

                  <div className="py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="font-medium text-slate-200">Studio Role</span>
                    <span className="text-slate-400 font-mono">Lead Screenwriter / Director</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Esc</kbd> to exit settings</span>
            <button
              type="button"
              onClick={() => {
                onSaveToast("Studio preferences saved!");
                onClose();
              }}
              className="px-4 py-2 bg-[#27272a] hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
