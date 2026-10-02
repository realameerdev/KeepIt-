import React from 'react';

interface KeepItLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'dark' | 'white' | 'blue' | 'current';
  showText?: boolean;
  textSize?: string;
}

export const KeepItLogo: React.FC<KeepItLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showText = false,
  textSize,
}) => {
  const sizeMap: Record<string, number> = {
    xs: 20,
    sm: 26,
    md: 34,
    lg: 44,
    xl: 60,
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 34;

  const colorStyles: Record<string, { fill: string; text: string }> = {
    dark: { fill: '#0F172A', text: 'text-slate-900' },
    white: { fill: '#FFFFFF', text: 'text-white' },
    blue: { fill: '#0284C7', text: 'text-sky-600' },
    current: { fill: 'currentColor', text: 'text-current' },
  };

  const selectedColor = colorStyles[variant] || colorStyles.dark;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
        aria-label="KeepIt Logo"
      >
        {/*
          Official KeepIt V-Starburst Brand Mark:
          4-fold rotational starburst formed by 4 radiating V-ribbons
          meeting at rounded apexes around a central diamond negative space.
        */}
        <g fill={selectedColor.fill}>
          {/* Top Arm (0°) */}
          <path
            d="M 52.2 25.5 H 57.2 L 50.8 45.4 C 50.3 47.0 49.2 47.0 47.8 45.2 L 42.8 34.8 H 47.6 L 49.5 40.2 L 52.2 25.5 Z"
          />
          {/* Right Arm (90°) */}
          <path
            d="M 52.2 25.5 H 57.2 L 50.8 45.4 C 50.3 47.0 49.2 47.0 47.8 45.2 L 42.8 34.8 H 47.6 L 49.5 40.2 L 52.2 25.5 Z"
            transform="rotate(90 50 50)"
          />
          {/* Bottom Arm (180°) */}
          <path
            d="M 52.2 25.5 H 57.2 L 50.8 45.4 C 50.3 47.0 49.2 47.0 47.8 45.2 L 42.8 34.8 H 47.6 L 49.5 40.2 L 52.2 25.5 Z"
            transform="rotate(180 50 50)"
          />
          {/* Left Arm (270°) */}
          <path
            d="M 52.2 25.5 H 57.2 L 50.8 45.4 C 50.3 47.0 49.2 47.0 47.8 45.2 L 42.8 34.8 H 47.6 L 49.5 40.2 L 52.2 25.5 Z"
            transform="rotate(270 50 50)"
          />
        </g>
      </svg>

      {showText && (
        <span
          className={`font-extrabold tracking-[-0.04em] font-sans ${textSize || (pixelSize > 36 ? 'text-2xl' : 'text-xl')} ${selectedColor.text}`}
        >
          Keep<span className="font-semibold opacity-90">It</span>
        </span>
      )}
    </div>
  );
};
