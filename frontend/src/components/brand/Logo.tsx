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

export const NextHrIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 36, 
  className = '' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_4px_14px_rgba(79,70,229,0.32)] transition-transform duration-300 ${className}`}
    >
      <defs>
        {/* Base Container Shield Gradient */}
        <linearGradient id="nhr_bg_grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>

        {/* Left Vertical Pillar: Indigo Glow */}
        <linearGradient id="nhr_left_grad" x1="12" y1="12" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="40%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>

        {/* Forward Diagonal Vector: Electric Indigo to Cyan */}
        <linearGradient id="nhr_diag_grad" x1="14" y1="12" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        {/* Right Vertical Pillar: Cyan Accent */}
        <linearGradient id="nhr_right_grad" x1="28" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Inner Radial Luminous Halo */}
        <radialGradient id="nhr_core_glow" cx="24" cy="24" r="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </radialGradient>

        {/* Dynamic Border Stroke Gradient */}
        <linearGradient id="nhr_border_stroke" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#312E81" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Backplate */}
      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="13"
        fill="url(#nhr_bg_grad)"
        stroke="url(#nhr_border_stroke)"
        strokeWidth="1.2"
      />

      {/* Radial Ambient Core Glow */}
      <circle cx="24" cy="24" r="14" fill="url(#nhr_core_glow)" />

      {/* Futuristic Stylized "N" Form */}
      {/* Left Pillar */}
      <path
        d="M13.5 14C13.5 12.8954 14.3954 12 15.5 12H17C18.1046 12 19 12.8954 19 14V34C19 35.1046 18.1046 36 17 36H15.5C14.3954 36 13.5 35.1046 13.5 34V14Z"
        fill="url(#nhr_left_grad)"
      />

      {/* Diagonal Velocity Ribbon */}
      <path
        d="M18.2 13.1C18.9 12.2 20.2 11.9 21.2 12.5L30.2 24.5C30.9 25.4 30.7 26.7 29.8 27.4L28.2 28.6C27.3 29.3 26 29.1 25.3 28.2L16.5 16C15.8 15 16.1 13.7 17.1 13.2L18.2 13.1Z"
        fill="url(#nhr_diag_grad)"
      />

      {/* Right Pillar */}
      <path
        d="M29 14C29 12.8954 29.8954 12 31 12H32.5C33.6046 12 34.5 12.8954 34.5 14V34C34.5 35.1046 33.6046 36 32.5 36H31C29.8954 36 29 35.1046 29 34V14Z"
        fill="url(#nhr_right_grad)"
      />

      {/* Center Precision Spark */}
      <circle cx="24" cy="24" r="2.8" fill="#FFFFFF" opacity="0.9" />
      <circle cx="24" cy="24" r="1.5" fill="#38BDF8" />
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
  // Dimension tokens
  const config = {
    sm: { icon: 28, text: 'text-base', hr: 'text-base', sub: 'text-[9px]', badge: 'text-[8px] px-1 py-0.2' },
    md: { icon: 36, text: 'text-xl', hr: 'text-xl', sub: 'text-[10px]', badge: 'text-[9px] px-1.5 py-0.5' },
    lg: { icon: 44, text: 'text-2xl sm:text-[26px]', hr: 'text-2xl sm:text-[26px]', sub: 'text-xs', badge: 'text-[10px] px-2 py-0.5' },
    xl: { icon: 52, text: 'text-3xl sm:text-4xl', hr: 'text-3xl sm:text-4xl', sub: 'text-sm', badge: 'text-xs px-2.5 py-0.5' },
  }[size];

  const primaryTextColor = variant === 'dark' ? 'text-white' : 'text-[#0F172A]';
  const subtitleColor = variant === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Premium NextHR Vector Mark */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <NextHrIcon size={config.icon} />
      </div>

      {/* Typography: NextHR */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${config.text} ${primaryTextColor}`}>
            Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#06B6D4]">HR</span>
          </span>

          {showBadge && (
            <span className={`inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/25 font-bold font-mono text-[#6366F1] shadow-2xs ${config.badge}`}>
              {badgeText}
            </span>
          )}
        </div>

        {showSubtitle && (
          <span className={`${config.sub} ${subtitleColor} font-medium tracking-normal mt-0.5`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
