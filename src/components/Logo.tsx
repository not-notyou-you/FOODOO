// src/components/Logo.tsx
import { APP_ICON_LOOP } from "./AppIcon.tsx";

interface LogoProps {
  width?: number;
}

export function Logo({ width = 240 }: LogoProps) {
  return (
    <svg
      className="logo"
      width={width}
      viewBox="0 0 320 220"
      role="img"
      aria-label="FOODOO"
      focusable="false"
    >
      <rect width="320" height="220" rx="28" fill="#003049" />
      <g fill="#ffffff" fontFamily="var(--font-num)" fontSize="84">
        <text x="36" y="104" textLength="64" lengthAdjust="spacingAndGlyphs">
          F
        </text>
        <text x="36" y="196" textLength="248" lengthAdjust="spacingAndGlyphs">
          DOO
        </text>
      </g>
      <path
        d={APP_ICON_LOOP}
        fill="none"
        stroke="#f77f00"
        strokeWidth="34"
        strokeLinejoin="round"
        transform="translate(200 74) scale(0.56) translate(-256 -256)"
      />
    </svg>
  );
}
