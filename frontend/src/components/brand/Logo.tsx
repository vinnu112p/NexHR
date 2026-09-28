import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'glass';
  showSubtitle?: boolean;
  subtitleText?: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
}

export const NexHrIcon: React.FC<{ size?: number; className?: string; withTile?: boolean }> = ({ 
  size = 40, 
  className = '',
  withTile = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_8px_24px_rgba(99,102,241,0.32)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_12px_32px_rgba(99,102,241,0.55)] ${className}`}
    >
      <defs>
        {/* Luxury Obsidian Tile Background */}
        <linearGradient id="nex_tile_bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#101322" />
          <stop offset="50%" stopColor="#0B0D18" />
          <stop offset="100%" stopColor="#05060A" />
        </linearGradient>

        {/* Outer Chamfer Rim Glow */}
        <linearGradient id="nex_tile_rim" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#A855F7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.75" />
        </linearGradient>

        {/* Ambient Backlight Radiance */}
        <radialGradient id="nex_ambient_radiance" cx="60" cy="60" r="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#06B6D4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B0D18" stopOpacity="0" />
        </radialGradient>

        {/* Left Pillar: Royal Indigo -> Electric Iris */}
        <linearGradient id="nex_left_pillar" x1="24" y1="92" x2="44" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="40%" stopColor="#4338CA" />
          <stop offset="80%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        {/* Left Pillar Side Bevel: Deep Shadow */}
        <linearGradient id="nex_left_bevel" x1="18" y1="88" x2="26" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        {/* Primary Diagonal Blade (Top-Left -> Bottom-Right Nexus fold): Neon Iris to Violet */}
        <linearGradient id="nex_diag_blade" x1="36" y1="22" x2="90" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="30%" stopColor="#6366F1" />
          <stop offset="70%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* Intersecting Right Wing / Ascending Loop (Cyan to Electric Mint): Forms X & completes N */}
        <linearGradient id="nex_cyan_ribbon" x1="38" y1="92" x2="102" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="30%" stopColor="#06B6D4" />
          <stop offset="70%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Underside Shadow Occlusion */}
        <linearGradient id="nex_twist_shadow" x1="45" y1="45" x2="68" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#090A15" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.4" />
        </linearGradient>

        {/* Razor Specular Sheen */}
        <linearGradient id="nex_specular" x1="30" y1="20" x2="90" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#A5F3FC" stopOpacity="0.7" />
        </linearGradient>

        {/* Drop shadow for 3D Ribbon Overlap */}
        <filter id="nex_ribbon_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* Optional Luxury Obsidian Backing Squircle */}
      {withTile && (
        <>
          <rect
            x="3"
            y="3"
            width="114"
            height="114"
            rx="32"
            fill="url(#nex_tile_bg)"
            stroke="url(#nex_tile_rim)"
            strokeWidth="1.8"
          />
          <circle cx="60" cy="60" r="48" fill="url(#nex_ambient_radiance)" />
        </>
      )}

      {/* ================= 3D CONTINUOUS NEXUS RIBBON ================= */}
      
      {/* 1. Rear Intersecting Band (Ascending from bottom to create the rear branch of 'X') */}
      <path
        d="M44 88L70 56L60 44L34 76L44 88Z"
        fill="url(#nex_twist_shadow)"
      />

      {/* 2. Ascending Cyan/Emerald Wing (Sweeps from bottom center-left, loops up to top right) */}
      <path
        d="M40 88C43 92 50 93 54 89L94 40C98 35 97 28 92 24C87 20 80 21 76 26L38 74C35 78 36 84 40 88Z"
        fill="url(#nex_cyan_ribbon)"
      />

      {/* 3. Left Stem: Volumetric Isometric Pillar of 'N' */}
      {/* 3a: Shaded Left Edge */}
      <path
        d="M24 90L19 84V40L24 35V90Z"
        fill="url(#nex_left_bevel)"
      />
      {/* 3b: Front Facing Illuminated Stem */}
      <path
        d="M24 90V35L38 22V77L24 90Z"
        fill="url(#nex_left_pillar)"
      />
      {/* 3c: Chamfered Top Facet */}
      <path
        d="M24 35L38 22L46 30L32 43L24 35Z"
        fill="#A5B4FC"
      />

      {/* 4. Primary Descending Fold (Crosses front-facing from Top-Left apex to Bottom-Right) */}
      <path
        d="M38 22L88 84C92 89 98 89 102 85C106 81 106 74 101 69L64 24C60 19 54 18 50 21L38 22Z"
        fill="url(#nex_diag_blade)"
        filter="url(#nex_ribbon_shadow)"
      />

      {/* 5. Right Upright Tower (Completing the outer 'N' silhouette with forward taper) */}
      <path
        d="M84 42L98 25C101 22 105 24 105 28V76C105 82 101 86 96 88L84 74V42Z"
        fill="url(#nex_left_pillar)"
      />

      {/* 6. Specular Razor Edge Highlights */}
      <path
        d="M38 22L88 84"
        stroke="url(#nex_specular)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M24 35L38 22"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M76 26L94 40"
        stroke="#67E8F9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />

      {/* 7. Central Nexus Convergence Node (The Autonomous Core) */}
      <g filter="url(#nex_ribbon_shadow)">
        <circle cx="62" cy="54" r="5" fill="#0B0D18" stroke="url(#nex_tile_rim)" strokeWidth="1.2" />
        <circle cx="62" cy="54" r="2.8" fill="#FFFFFF" />
        <circle cx="62" cy="54" r="1.2" fill="#6366F1" />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = false,
  subtitleText = 'Autonomous HR & Payroll Platform',
  showBadge = false,
  badgeText = 'v2.4',
  className = '',
  onClick,
}) => {
  // Dimension tokens tailored for visual harmony
  const config = {
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]', badge: 'text-[8px] px-1.5 py-0.5' },
    md: { icon: 40, text: 'text-xl sm:text-[22px]', sub: 'text-[10px]', badge: 'text-[9px] px-2 py-0.5' },
    lg: { icon: 48, text: 'text-2xl sm:text-[28px]', sub: 'text-xs', badge: 'text-[10px] px-2.5 py-0.5' },
    xl: { icon: 58, text: 'text-3xl sm:text-4xl', sub: 'text-sm', badge: 'text-xs px-3 py-1' },
  }[size];

  const primaryTextColor = variant === 'dark' ? 'text-white' : 'text-[#0F172A]';
  const subtitleColor = variant === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* 3D Dimensional Nexus Ribbon Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <NexHrIcon size={config.icon} />
      </div>

      {/* Typography: NexHR */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${config.text} ${primaryTextColor} transition-colors`}>
            Nex<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] via-[#6366F1] to-[#A855F7] font-black">HR</span>
          </span>

          {showBadge && (
            <span className={`inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/25 font-bold font-mono text-[#6366F1] shadow-2xs ${config.badge}`}>
              {badgeText}
            </span>
          )}
        </div>

        {showSubtitle && (
          <span className={`${config.sub} ${subtitleColor} font-medium tracking-normal mt-0.5 transition-colors`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
