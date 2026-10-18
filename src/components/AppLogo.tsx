import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
  showBackground?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 36,
  showBackground = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      aria-label="AR Trace & Draw Logo"
    >
      <defs>
        <linearGradient id="appLogoBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
        <filter id="appLogoShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#1e3a8a" flood-opacity="0.25" />
        </filter>
      </defs>

      {/* Blue Canvas (as in user's icon) */}
      {showBackground && (
        <rect width="512" height="512" rx="128" fill="url(#appLogoBg)" />
      )}

      {/* White Rounded Squircle Card */}
      <rect
        x={showBackground ? 76 : 16}
        y={showBackground ? 76 : 16}
        width={showBackground ? 360 : 480}
        height={showBackground ? 360 : 480}
        rx={showBackground ? 84 : 112}
        fill="#ffffff"
        filter={showBackground ? 'url(#appLogoShadow)' : undefined}
      />

      {/* Blue Camera Symbol */}
      <g stroke="#1d70f5" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Top-left shutter/flash button */}
        <path d="M164 186 V176 Q164 170 170 170 H192 Q198 170 198 176 V186" />

        {/* Camera Body Outline (with bottom opening for lens) */}
        <path d="M 198 186
                 L 214 186
                 L 226 164
                 Q 231 154 242 154
                 H 270
                 Q 281 154 286 164
                 L 298 186
                 H 348
                 Q 366 186 366 204
                 V 314
                 Q 366 332 348 332
                 H 312" />

        <path d="M 200 332
                 H 164
                 Q 146 332 146 314
                 V 204
                 Q 146 186 164 186
                 H 198" />

        {/* Center Outer Lens Ring */}
        <circle cx="256" cy="264" r="64" strokeWidth="18" />

        {/* Center Inner Lens Ring */}
        <circle cx="256" cy="264" r="38" strokeWidth="18" />

        {/* Top-right sensor dot */}
        <circle cx="342" cy="216" r="8" fill="#1d70f5" stroke="none" />
      </g>
    </svg>
  );
};
