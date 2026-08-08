import React, { useState, useRef } from "react";
import { Upload, FileText, Sparkles, AlertCircle, ShieldCheck, Check } from "lucide-react";
import { SAMPLE_SCRIPT_TITLE } from "./reelRefineData";

interface DragDropUploaderProps {
  onFileSelect: (fileName: string, isSample?: boolean) => void;
  isAnalyzing: boolean;
  analysisBeat: number;
}

export const DragDropUploader: React.FC<DragDropUploaderProps> = ({
  onFileSelect,
  isAnalyzing,
  analysisBeat,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "fdx" && ext !== "txt") {
      setErrorMsg("Unsupported file format. Please upload a .pdf, .fdx, or .txt script.");
      return;
    }
    setErrorMsg(null);
    onFileSelect(file.name, false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const beats = [
    { label: "Parsing scenes & character arcs...", progress: 33 },
    { label: "Finding narrative strengths & dialogue rhythm...", progress: 66 },
    { label: "Spotting high-leverage fixes & production opportunities...", progress: 100 },
  ];

  const currentBeat = beats[Math.min(analysisBeat, 2)];

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Title */}
      <div className="text-center space-y-3 pt-2 pb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FF6F00]/10 text-[#FF6F00] border border-[#FF6F00]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6F00]" /> Screenplay Analysis Studio
        </span>
        <h1 className="text-3xl md:text-4xl font-normal font-display tracking-tight text-[#0F294D] dark:text-foreground">
          Polish your script. Plan your production.
        </h1>
        <p className="text-sm text-[#64748B] dark:text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
          Upload your screenplay for instantaneous Coverage AI insights, targeted dialogue fixes, and a 3-part production plan.
        </p>
      </div>

      {/* Main Upload Card / Analysis Loading */}
      {isAnalyzing ? (
        <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#EBF3FC] dark:bg-sky-950/60 rounded-full flex items-center justify-center mx-auto border border-[#001b94]/20 dark:border-sky-800/60 text-[#001b94] dark:text-sky-300">
            <Sparkles className="w-8 h-8 animate-spin-slow" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-[#0F294D] dark:text-foreground">Analyzing Screenplay</h3>
            <p className="text-sm font-medium text-[#FF6F00]">{currentBeat.label}</p>
          </div>

          {/* 3 Beats Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-[#001b94] dark:bg-sky-500 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${currentBeat.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#64748B] dark:text-muted-foreground px-1 font-medium">
              <span className={analysisBeat >= 0 ? "text-[#001b94] dark:text-sky-400 font-bold" : ""}>1. Parsing</span>
              <span className={analysisBeat >= 1 ? "text-[#001b94] dark:text-sky-400 font-bold" : ""}>2. Strengths</span>
              <span className={analysisBeat >= 2 ? "text-[#001b94] dark:text-sky-400 font-bold" : ""}>3. Spotting Fixes</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload your script file (.pdf, .fdx, or .txt)"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-200 bg-card ${
              isDragOver
                ? "border-[#001b94] dark:border-sky-400 bg-[#EBF3FC]/50 dark:bg-sky-950/40 scale-[1.01]"
                : "border-border hover:border-[#001b94] dark:hover:border-sky-400"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.fdx,.txt"
              className="hidden"
            />
            <div className="w-16 h-16 bg-[#EBF3FC] dark:bg-sky-950/60 rounded-xl border border-[#001b94]/20 dark:border-sky-800/60 flex items-center justify-center mx-auto mb-4 text-[#001b94] dark:text-sky-300">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-[#0F294D] dark:text-foreground mb-1">
              Drag & drop your screenplay here
            </h3>
            <p className="text-xs text-[#64748B] dark:text-muted-foreground mb-4">
              Supports <span className="font-semibold text-[#0F294D] dark:text-foreground">.pdf</span>,{" "}
              <span className="font-semibold text-[#0F294D] dark:text-foreground">.fdx</span> (Final Draft), or{" "}
              <span className="font-semibold text-[#0F294D] dark:text-foreground">.txt</span> files
            </p>
            <button
              type="button"
              className="px-6 py-2.5 bg-[#001b94] dark:bg-sky-600 hover:bg-[#001470] dark:hover:bg-sky-500 text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors focus:ring-2 focus:ring-[#001b94] focus:outline-none"
            >
              Select File from Device
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Secondary Action: Try Sample Script */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF3FC] dark:bg-sky-950/60 border border-[#001b94]/20 dark:border-sky-800/60 flex items-center justify-center text-[#001b94] dark:text-sky-300">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#0F294D] dark:text-foreground">No script file ready?</p>
                <p className="text-xs text-[#64748B] dark:text-muted-foreground">Try our sample screenplay: <span className="font-semibold text-[#001b94] dark:text-sky-400">"{SAMPLE_SCRIPT_TITLE}"</span></p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFileSelect(`${SAMPLE_SCRIPT_TITLE}.fdx`, true)}
              className="w-full sm:w-auto px-5 py-2 bg-[#FF6F00] hover:bg-[#e06200] text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Load Sample Script
            </button>
          </div>

          {/* Privacy Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#64748B] dark:text-muted-foreground pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Privacy Guarantee: Your file is processed locally for this session only and is never stored unless explicitly saved.</span>
          </div>
        </div>
      )}
    </div>
  );
};
