import React, { useState } from "react";

interface AnimatedFilmLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  isHovered?: boolean;
}

export const AnimatedFilmLogo: React.FC<AnimatedFilmLogoProps> = ({
  size = "md",
  className = "",
  isHovered: externalIsHovered,
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const isHovered = externalIsHovered !== undefined ? externalIsHovered : internalHover;

  const sizeClasses = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  }[size];

  const svgSize = {
    sm: { width: 22, height: 22 },
    md: { width: 28, height: 28 },
    lg: { width: 38, height: 38 },
  }[size];

  return (
    <div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`film-logo-container relative overflow-hidden bg-gradient-to-br from-[#0F294D] via-[#001470] to-[#001b94] flex items-center justify-center border border-white/10 shadow-sm transition-all duration-300 group-hover:border-[#FF6F00]/50 group-hover:shadow-[0_0_15px_rgba(255,111,0,0.4)] ${sizeClasses} ${className}`}
      title="Good Film Studios — Animated Film Reel"
    >
      {/* Background Subtle Shimmer Glow */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-[#FF6F00]/0 via-[#FF6F00]/15 to-[#FF6F00]/0 transition-opacity duration-300 ${isHovered ? "opacity-100 animate-pulse" : "opacity-0 group-hover:opacity-100"}`} />

      {/* Film Strip Lens Frame Cutout */}
      <div className="relative z-10 overflow-hidden flex items-center justify-center" style={{ width: svgSize.width, height: svgSize.height }}>
        <svg
          width={svgSize.width}
          height={svgSize.height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Mask/Clip for the Film Viewing Aperture */}
            <clipPath id="filmApertureClip">
              <rect x="3" y="3" width="26" height="26" rx="4" />
            </clipPath>

            {/* Gradient for Film Sprocket Rails */}
            <linearGradient id="filmRailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6F00" />
              <stop offset="50%" stopColor="#FFA040" />
              <stop offset="100%" stopColor="#FF6F00" />
            </linearGradient>

            {/* Inner Glow Lens Shadow */}
            <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="linear" slope="0.7" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite operator="out" in2="SourceAlpha" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" />
            </filter>
          </defs>

          {/* Film Viewport Outer Bezel */}
          <rect x="2.5" y="2.5" width="27" height="27" rx="4.5" stroke="#FF6F00" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />

          {/* Clipped Film Strip Track Area */}
          <g clipPath="url(#filmApertureClip)">
            {/* Background aperture window */}
            <rect x="3" y="3" width="26" height="26" fill="#080F1E" />

            {/* Vertically Scrolling Film Strip Group */}
            <g
              className={`film-logo-strip film-logo-strip-hover ${isHovered ? "film-logo-strip-hovering" : ""}`}
              style={{
                animation: isHovered ? "filmScroll 0.7s linear infinite" : "none",
              }}
            >
              {/* Pattern 1 & Pattern 2 stacked (Each pattern is 60px tall with 3 frames) */}
              {[0, 60].map((offsetY) => (
                <g key={offsetY} transform={`translate(0, ${offsetY})`}>
                  {/* --- FRAME 1 (y: 0 - 20) --- */}
                  <g>
                    {/* Left Sprocket Holes */}
                    <rect x="4.5" y="2.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    <rect x="4.5" y="13.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    {/* Right Sprocket Holes */}
                    <rect x="25" y="2.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    <rect x="25" y="13.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    {/* Center Frame Border */}
                    <rect x="8.5" y="1.5" width="15" height="17" rx="1.5" stroke="#FF6F00" strokeWidth="1.2" fill="#0F294D" fillOpacity="0.8" />
                    {/* Content: Film Frame Reels / Play Symbol */}
                    <polygon points="14,6.5 14,13.5 19,10" fill="#FF6F00" />
                    {/* Divider */}
                    <line x1="3" y1="19.5" x2="29" y2="19.5" stroke="#FF6F00" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="1.5 1" />
                  </g>

                  {/* --- FRAME 2 (y: 20 - 40) --- */}
                  <g>
                    {/* Left Sprocket Holes */}
                    <rect x="4.5" y="22.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    <rect x="4.5" y="33.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    {/* Right Sprocket Holes */}
                    <rect x="25" y="22.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    <rect x="25" y="33.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    {/* Center Frame Border */}
                    <rect x="8.5" y="21.5" width="15" height="17" rx="1.5" stroke="#FF6F00" strokeWidth="1.2" fill="#001b94" fillOpacity="0.8" />
                    {/* Content: Camera Lens Circle */}
                    <circle cx="16" cy="30" r="3.5" stroke="#FF6F00" strokeWidth="1.2" fill="none" />
                    <circle cx="16" cy="30" r="1.2" fill="#FF6F00" />
                    {/* Divider */}
                    <line x1="3" y1="39.5" x2="29" y2="39.5" stroke="#FF6F00" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="1.5 1" />
                  </g>

                  {/* --- FRAME 3 (y: 40 - 60) --- */}
                  <g>
                    {/* Left Sprocket Holes */}
                    <rect x="4.5" y="42.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    <rect x="4.5" y="53.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    {/* Right Sprocket Holes */}
                    <rect x="25" y="42.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    <rect x="25" y="53.5" width="2.5" height="4" rx="0.6" fill="url(#filmRailGrad)" />
                    {/* Center Frame Border */}
                    <rect x="8.5" y="41.5" width="15" height="17" rx="1.5" stroke="#FF6F00" strokeWidth="1.2" fill="#0F294D" fillOpacity="0.8" />
                    {/* Content: Star / Award Symbol */}
                    <path d="M16 45.5L17.2 48H19.8L17.7 49.5L18.5 52L16 50.4L13.5 52L14.3 49.5L12.2 48H14.8L16 45.5Z" fill="#FF6F00" />
                    {/* Divider */}
                    <line x1="3" y1="59.5" x2="29" y2="59.5" stroke="#FF6F00" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="1.5 1" />
                  </g>
                </g>
              ))}
            </g>

            {/* Subtle Glass Lens Reflection overlay */}
            <path
              d="M3 3 L20 3 L3 20 Z"
              fill="white"
              fillOpacity="0.08"
              pointerEvents="none"
            />
          </g>

          {/* Aperture Frame Highlight Border */}
          <rect
            x="3"
            y="3"
            width="26"
            height="26"
            rx="4"
            stroke="#FF6F00"
            strokeWidth="1.5"
            strokeOpacity={isHovered ? "0.9" : "0.5"}
            fill="none"
            className="transition-all duration-300"
          />
        </svg>
      </div>

      {/* Projector Flash/Glow Effect on Hover */}
      <div
        className={`absolute inset-0 bg-radial from-[#FF6F00]/25 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-100 animate-pulse" : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>
  );
};
