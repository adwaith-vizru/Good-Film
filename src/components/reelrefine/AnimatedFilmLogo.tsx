import React, { useState } from "react";

interface AnimatedFilmLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  isHovered?: boolean;
  animated?: boolean;
}

export const AnimatedFilmLogo: React.FC<AnimatedFilmLogoProps> = ({
  size = "md",
  className = "",
  isHovered: externalIsHovered,
  animated = true,
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

  const isSpinning = animated && isHovered;

  return (
    <div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`film-logo-container relative overflow-hidden bg-gradient-to-br from-[#060D20] via-[#0B1942] to-[#001777] flex items-center justify-center border border-amber-500/35 shadow-md transition-all duration-300 ${
        animated ? "group-hover:border-amber-400/80 group-hover:shadow-[0_0_20px_rgba(255,111,0,0.5)]" : ""
      } ${sizeClasses} ${className}`}
      title={animated ? "Good Film Studios — Hover to animate cinema emblem" : "Good Film Studios Logo"}
    >
      {/* Background Ambient Radial Glow */}
      <div
        className={`absolute inset-0 bg-radial from-[#FF6F00]/25 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
          isSpinning ? "opacity-100 animate-pulse" : "opacity-30"
        }`}
      />

      {/* SVG Cinema Emblem Artwork */}
      <div className="relative z-10 overflow-hidden flex items-center justify-center" style={{ width: svgSize.width, height: svgSize.height }}>
        <svg
          width={svgSize.width}
          height={svgSize.height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Gold Premium Metallic Gradient */}
            <linearGradient id="goldMetallic" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF2AD" />
              <stop offset="35%" stopColor="#FF9F00" />
              <stop offset="70%" stopColor="#FF6F00" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>

            {/* Sapphire Electric Blue Lens Gradient */}
            <linearGradient id="sapphireLens" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#001470" />
              <stop offset="50%" stopColor="#0052FF" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>

            {/* Inner Lens Glow Filter */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Lens Bezel Ring */}
          <circle cx="24" cy="24" r="22" stroke="url(#goldMetallic)" strokeWidth="1.5" strokeOpacity="0.8" />
          <circle cx="24" cy="24" r="19.5" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />

          {/* Rotating Aperture & Film Sprocket Ring Group */}
          <g
            style={{
              transformOrigin: "24px 24px",
              animation: isSpinning ? "spinSlow 8s linear infinite" : "none",
              transition: "transform 0.5s ease-out",
            }}
          >
            {/* 8 Precision Film Reel Sprocket Holes on Rim */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="22.8"
                y="3.2"
                width="2.4"
                height="3.5"
                rx="0.8"
                fill="url(#goldMetallic)"
                transform={`rotate(${angle} 24 24)`}
              />
            ))}

            {/* Inner Aperture Blade Ring */}
            <circle cx="24" cy="24" r="15" stroke="url(#goldMetallic)" strokeWidth="1" strokeOpacity="0.5" fill="#060D20" fillOpacity="0.6" />
          </g>

          {/* Stylized Futuristic Metallic "G" Studio Monogram */}
          <path
            d="M34.5 13.5C31.5 10.5 27.2 9 22.5 9C14.2 9 7.5 15.7 7.5 24C7.5 32.3 14.2 39 22.5 39C29.8 39 35.8 34.2 37.5 27.5H30.5C29 29.8 26 31.5 22.5 31.5C18.4 31.5 15 28.1 15 24C15 19.9 18.4 16.5 22.5 16.5C25.2 16.5 27.6 17.9 29.2 20H37C34.8 13.5 29.2 9 22.5 9Z"
            fill="url(#goldMetallic)"
          />

          {/* "G" Bold Horizontal Studio Crossbar */}
          <path
            d="M21 21.5H37.5V26.5H28.5V30.5H23.5V26.5H21V21.5Z"
            fill="url(#goldMetallic)"
          />

          {/* Anamorphic Sapphire Play Lens Wedge */}
          <polygon
            points="27,18.5 36,24 27,29.5"
            fill="url(#sapphireLens)"
            filter="url(#glowEffect)"
          />

          {/* Central AI Cinema Flare Star */}
          <g transform="translate(24 24)">
            <path
              d="M0 -5.5L1.4 -1.4L5.5 0L1.4 1.4L0 5.5L-1.4 1.4L-5.5 0L-1.4 -1.4Z"
              fill="#FFFFFF"
              className={isSpinning ? "animate-pulse" : ""}
            />
            <circle cx="0" cy="0" r="1.5" fill="#FFD700" />
          </g>
        </svg>
      </div>

      {/* Subtle Glossy Reflection Bar */}
      <div className="absolute top-0 right-0 left-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};
