// Đavolji rogovi, nacrtani u SVG-u. `className` određuje gde stoje i koliko su veliki.
export default function Horns({ className = '' }) {
  return (
    <svg className={`horns ${className}`} viewBox="0 0 400 120" aria-hidden="true">
      <defs>
        <linearGradient id="hornFill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1a0003" />
          <stop offset="35%" stopColor="#5e000c" />
          <stop offset="75%" stopColor="#c4001c" />
          <stop offset="100%" stopColor="#ff7a3a" />
        </linearGradient>
        <filter id="hornGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#hornGlow)" fill="url(#hornFill)">
        {/* levi rog */}
        <path d="M62 120 C 26 96, 10 52, 40 4 C 36 38, 60 74, 122 120 Z" />
        {/* desni rog (preslikan) */}
        <path d="M338 120 C 374 96, 390 52, 360 4 C 364 38, 340 74, 278 120 Z" />
      </g>
      <g fill="none" stroke="rgba(255,200,170,.45)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M58 104 C 36 86, 28 58, 38 20" />
        <path d="M342 104 C 364 86, 372 58, 362 20" />
      </g>
      <g stroke="rgba(0,0,0,.35)" strokeWidth="2" strokeLinecap="round">
        <path d="M48 98 L 74 94 M38 80 L 60 78 M32 62 L 50 61" />
        <path d="M352 98 L 326 94 M362 80 L 340 78 M368 62 L 350 61" />
      </g>
    </svg>
  );
}
