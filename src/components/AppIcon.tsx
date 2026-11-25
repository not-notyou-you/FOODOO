// src/components/AppIcon.tsx
interface AppIconProps {
  size?: number;
  label?: string;
}

export const APP_ICON_LOOP =
  "M256 256 C 300 190, 410 190, 410 256 C 410 322, 300 322, 256 256 C 212 190, 102 190, 102 256 C 102 322, 212 322, 256 256 Z";
export const APP_ICON_F =
  "M88 80 H236 V132 H146 V158 H216 V206 H146 V244 H88 Z";
export const APP_ICON_D =
  "M292 296 H352 A76 76 0 0 1 352 448 H292 Z M340 340 H352 A32 32 0 0 1 352 404 H340 Z";

export function AppIcon({ size = 40, label }: AppIconProps) {
  const labelled = label !== undefined;
  return (
    <svg
      className="app-icon"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role={labelled ? "img" : undefined}
      aria-label={label}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      <rect width="512" height="512" rx="112" fill="#003049" />
      <path
        d={APP_ICON_LOOP}
        fill="none"
        stroke="#f77f00"
        strokeWidth="44"
        strokeLinejoin="round"
        transform="rotate(-45 256 256)"
      />
      <path d={APP_ICON_F} fill="#ffffff" />
      <path d={APP_ICON_D} fill="#ffffff" fillRule="evenodd" />
    </svg>
  );
}
