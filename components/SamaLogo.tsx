'use client';

import React from 'react';

interface SamaLogoProps {
  className?: string;
  variant?: 'full' | 'emblem' | 'horizontal' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'default' | 'light' | 'dark';
}

export function SamaLogo({
  className = '',
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  theme = 'default'
}: SamaLogoProps) {
  // Dimensions based on size preset
  const emblemSizes = {
    xs: 32,
    sm: 44,
    md: 56,
    lg: 84,
    xl: 120
  };

  const currentEmblemSize = emblemSizes[size] || 56;

  // The 3D Emblem SVG strictly color-matched to the website's palette:
  // - Deep Dark Slate/Teal: #1D2D2E
  // - Vibrant Coral/Sunset Orange: #FF7E47
  // - Sunny Gold: #FFD95A & #FBBF24
  // - Tourism Sky Blue/Cyan: #4CC9FE & #0284C7
  const renderEmblem = (dim: number) => (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105 select-none"
      role="img"
      aria-label="شعار شركة سما البارقة للسفر والسياحة"
    >
      <defs>
        {/* Brand Matched S Gradients: #1D2D2E + #0E5E75 + #0284C7 + #4CC9FE */}
        <linearGradient id="brandTealDark" x1="50" y1="30" x2="250" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4CC9FE" />
          <stop offset="30%" stopColor="#0284C7" />
          <stop offset="65%" stopColor="#0B4B5B" />
          <stop offset="100%" stopColor="#1D2D2E" />
        </linearGradient>

        <linearGradient id="brandTealSpecular" x1="120" y1="40" x2="160" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#4CC9FE" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </linearGradient>

        {/* Brand Matched Gold/Sunset Gradients: #FFD95A + #FF7E47 + #D97706 */}
        <linearGradient id="brandGoldLinear" x1="40" y1="40" x2="260" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9DB" />
          <stop offset="25%" stopColor="#FFD95A" />
          <stop offset="55%" stopColor="#FF7E47" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#873E18" />
        </linearGradient>

        <linearGradient id="brandAirplaneShine" x1="80" y1="120" x2="240" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDF0" />
          <stop offset="35%" stopColor="#FFD95A" />
          <stop offset="75%" stopColor="#FF7E47" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="brandRingGrad" x1="20" y1="80" x2="280" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="30%" stopColor="#FFD95A" />
          <stop offset="65%" stopColor="#FF7E47" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Subtle Brand Ambient Glow */}
        <radialGradient id="brandAura" cx="150" cy="150" r="140" gradientUnits="userSpaceOnUse">
          <stop offset="50%" stopColor="#FFD95A" stopOpacity="0.18" />
          <stop offset="80%" stopColor="#FF7E47" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FF7E47" stopOpacity="0" />
        </radialGradient>

        {/* Brand Neobrutalist / 3D Shadows */}
        <filter id="brandLogoShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#1D2D2E" floodOpacity="0.3" />
        </filter>

        <filter id="brandPlaneShadow" x="-20%" y="-20%" width="150%" height="150%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#1D2D2E" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ambient background soft warm glow */}
      <circle cx="150" cy="150" r="135" fill="url(#brandAura)" />

      {/* Subtle globe longitude / latitude curve lines matching #FFD95A & #1D2D2E */}
      <g stroke="#FFD95A" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="3 4">
        <circle cx="150" cy="150" r="105" fill="none" />
        <ellipse cx="150" cy="150" rx="60" ry="105" fill="none" />
        <line x1="45" y1="150" x2="255" y2="150" />
        <path d="M 60 100 Q 150 120 240 100" fill="none" />
        <path d="M 60 200 Q 150 180 240 200" fill="none" />
      </g>

      {/* Back Gold-Orange Orbital Swoosh */}
      <path
        d="M 65 190 C 40 130, 80 60, 160 55 C 220 50, 255 90, 245 130 C 240 150, 220 180, 195 195"
        fill="none"
        stroke="url(#brandRingGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#brandLogoShadow)"
      />
      <path
        d="M 70 185 C 48 135, 85 70, 158 65 C 212 60, 245 95, 238 130"
        fill="none"
        stroke="#FFF"
        strokeWidth="1.5"
        strokeOpacity="0.8"
        strokeLinecap="round"
      />

      {/* The 3D Beveled Letter 'S' Body with #1D2D2E & #4CC9FE palette */}
      <g filter="url(#brandLogoShadow)">
        {/* Outer S Base / Solid Deep Slate Edge */}
        <path
          d="M 205 78 
             C 185 52, 145 46, 115 56 
             C 80 68, 65 102, 75 132 
             C 82 152, 102 165, 130 174 
             C 170 186, 198 198, 192 228 
             C 186 254, 152 265, 118 258 
             C 90 252, 72 235, 62 215 
             L 90 202 
             C 98 216, 110 226, 126 230 
             C 145 234, 162 226, 166 212 
             C 170 196, 152 186, 124 176 
             C 88 163, 50 148, 52 108 
             C 54 68, 92 40, 138 34 
             C 170 30, 206 42, 228 66 
             Z"
          fill="#1D2D2E"
        />

        {/* Main 3D S Gradient Face */}
        <path
          d="M 200 82 
             C 182 58, 145 52, 118 60 
             C 86 70, 72 100, 80 128 
             C 86 146, 106 158, 134 167 
             C 174 180, 202 192, 196 222 
             C 190 248, 156 258, 122 252 
             C 96 246, 78 230, 68 212 
             L 94 200 
             C 100 212, 112 220, 126 224 
             C 142 228, 158 220, 162 208 
             C 166 194, 148 184, 120 174 
             C 84 161, 56 146, 58 110 
             C 60 74, 95 48, 136 42 
             C 166 38, 198 48, 218 72 
             Z"
          fill="url(#brandTealDark)"
        />

        {/* 3D Inner Bevel Cyan Highlight for S */}
        <path
          d="M 198 83 
             C 181 60, 146 54, 120 62 
             C 90 71, 76 99, 83 125 
             C 88 142, 107 154, 133 163 
             L 125 174 
             C 98 165, 78 152, 72 132 
             C 64 102, 80 72, 114 62 
             C 142 54, 178 60, 196 82 
             Z"
          fill="url(#brandTealSpecular)"
        />

        {/* S Warm Gold/Coral Trim Accent */}
        <path
          d="M 136 42 C 166 38, 198 48, 218 72 L 210 78 C 192 56, 162 48, 134 50 Z"
          fill="url(#brandGoldLinear)"
        />
        <path
          d="M 68 212 L 94 200 C 100 212, 112 220, 126 224 L 122 232 C 104 228, 88 218, 78 206 Z"
          fill="url(#brandGoldLinear)"
        />
      </g>

      {/* Front Dynamic Warm Gold/Coral Orbital Ring wrapping through the S */}
      <path
        d="M 52 175 
           C 70 215, 120 252, 180 248 
           C 235 244, 275 200, 260 145 
           C 255 125, 238 98, 215 78
           C 210 74, 202 82, 206 87
           C 226 106, 242 128, 246 148
           C 258 192, 222 232, 174 236
           C 124 240, 82 208, 64 172
           Z"
        fill="url(#brandGoldLinear)"
        filter="url(#brandLogoShadow)"
      />

      {/* Golden Orbital Ring Inner Sheen */}
      <path
        d="M 58 174 C 74 210, 120 242, 172 238 C 220 234, 248 200, 244 152"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeOpacity="0.85"
      />

      {/* The Soaring 3D Warm Gold/Sunset Orange Airplane */}
      <g filter="url(#brandPlaneShadow)" transform="translate(14, -6)">
        {/* Airplane Main Fuselage & Cockpit */}
        <path
          d="M 235 78 
             L 218 85 
             L 175 122 
             L 135 152 
             L 115 165 
             L 100 174 
             L 108 177 
             L 130 172 
             L 155 160 
             L 188 138 
             L 225 102 
             L 242 82 
             Z"
          fill="url(#brandAirplaneShine)"
        />

        {/* Right Main Swept Wing */}
        <path
          d="M 180 120 
             L 230 102 
             L 255 105 
             L 220 128 
             L 172 144 
             Z"
          fill="url(#brandGoldLinear)"
        />

        {/* Left Wing (Extending down-left) */}
        <path
          d="M 152 142 
             L 125 188 
             L 138 190 
             L 178 152 
             Z"
          fill="#D97706"
        />

        {/* Airplane Tail Fin (Vertical Stabilizer) */}
        <path
          d="M 115 165 
             L 98 142 
             L 108 140 
             L 128 162 
             Z"
          fill="url(#brandGoldLinear)"
        />

        {/* Tail Horizontal Stabilizer */}
        <path
          d="M 104 172 
             L 86 182 
             L 92 186 
             L 112 176 
             Z"
          fill="#FF7E47"
        />

        {/* Glossy Fuselage Highlight Beam */}
        <path
          d="M 238 80 L 178 128 L 138 156 L 142 153 L 182 124 L 240 78 Z"
          fill="#FFFFFF"
          fillOpacity="0.9"
        />

        {/* Jet Engine Pod under wing */}
        <ellipse cx="185" cy="138" rx="8" ry="4" transform="rotate(-35 185 138)" fill="#1D2D2E" />
        <ellipse cx="184" cy="137" rx="6" ry="2.5" transform="rotate(-35 184 137)" fill="url(#brandGoldLinear)" />
      </g>

      {/* Sparkle at airplane nose tip */}
      <g transform="translate(252, 73)">
        <ellipse cx="0" cy="0" rx="7.5" ry="1.8" fill="#FFFFFF" transform="rotate(45)" />
        <ellipse cx="0" cy="0" rx="7.5" ry="1.8" fill="#FFFFFF" transform="rotate(-45)" />
        <circle cx="0" cy="0" r="3" fill="#FFFDF0" />
      </g>
    </svg>
  );

  // If emblem only requested
  if (variant === 'emblem') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderEmblem(currentEmblemSize)}</div>;
  }

  // Full / Stacked Badge Variant (Emblem on top, Arabic typography below)
  if (variant === 'badge' || variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {renderEmblem(currentEmblemSize)}
        <div className="mt-2.5 flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-black text-[#1D2D2E] tracking-tight leading-none drop-shadow-sm">
            سما البارقة
          </span>
          {showSubtitle && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-[2.5px] w-6 sm:w-8 bg-gradient-to-r from-transparent via-[#FFD95A] to-[#FF7E47] rounded-full"></span>
              <span className="text-xs sm:text-sm font-black text-[#FF7E47] tracking-widest flex items-center gap-1.5 bg-[#FDFFF5] px-2.5 py-0.5 rounded-full border border-[#1D2D2E]/20">
                للسفر والسياحة
                <span className="text-[#FF7E47] text-[10px]">✈</span>
              </span>
              <span className="h-[2.5px] w-6 sm:w-8 bg-gradient-to-l from-transparent via-[#FFD95A] to-[#FF7E47] rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Brand Lockup (Emblem on Right/Left + Arabic typography next to it)
  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {renderEmblem(currentEmblemSize)}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-[#1D2D2E] tracking-tight leading-tight group-hover:text-[#FF7E47] transition-colors">
            سما البارقة
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] sm:text-xs font-black text-[#FF7E47] tracking-wide flex items-center gap-1">
              للسفر والسياحة
              <span className="text-[#FF7E47] text-[10px]">✈</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] text-[#1D2D2E]/60 font-black">
              • تجربة لا تُنسى
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SamaLogo;
