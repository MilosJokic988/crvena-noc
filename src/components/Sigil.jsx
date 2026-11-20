// Mistični sigil inspirisan Lilitinim sigilom: unutrašnji znak se sam iscrta,
// spoljni prsten sa znakovima se polako okreće, a sve tinja kao žar.
// `ring={false}` daje samo znak (za logo i male ikonice).

const TICKS = Array.from({ length: 48 }, (_, i) => i);
const GLYPHS = ['ᛉ', 'ᛟ', 'ᚦ', 'ᛞ', 'ᛇ', 'ᚨ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᚱ', 'ᛊ'];

export default function Sigil({ className = '', ring = true, id = 's' }) {
  return (
    <svg className={`sigil ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,70,40,.35)" />
          <stop offset="60%" stopColor="rgba(179,0,27,.12)" />
          <stop offset="100%" stopColor="rgba(179,0,27,0)" />
        </radialGradient>
        <linearGradient id={`${id}-line`} gradientUnits="userSpaceOnUse" x1="100" y1="30" x2="100" y2="178">
          <stop offset="0%" stopColor="#ffb08a" />
          <stop offset="50%" stopColor="#ff4a2a" />
          <stop offset="100%" stopColor="#b3001b" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {ring && (
        <>
          <circle cx="100" cy="100" r="98" fill={`url(#${id}-core)`} />
          <g className="sigil-ring" fill="none" stroke="rgba(255,120,90,.55)" strokeWidth=".6">
            <circle cx="100" cy="100" r="94" />
            <circle cx="100" cy="100" r="80" />
            {TICKS.map((i) => (
              <line key={i} x1="100" y1="6" x2="100" y2={i % 4 === 0 ? 14 : 10}
                transform={`rotate(${i * 7.5} 100 100)`} />
            ))}
            {GLYPHS.map((g, i) => (
              <text key={i} x="100" y="90" transform={`rotate(${i * 30 + 15} 100 100)`}
                textAnchor="middle" fontSize="8" fill="rgba(255,170,140,.75)" stroke="none"
                dy="-73">{g}</text>
            ))}
          </g>
          <g className="sigil-ring rev" fill="none" stroke="rgba(255,90,60,.35)" strokeWidth=".5" strokeDasharray="2 4">
            <circle cx="100" cy="100" r="74" />
          </g>
        </>
      )}

      <g className="sigil-mark" filter={`url(#${id}-glow)`} fill="none" stroke={`url(#${id}-line)`}
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* središnja osa */}
        <path pathLength="1" d="M100 46 L100 166" />
        {/* polumesec / rogovi na vrhu */}
        <path pathLength="1" d="M70 40 C 74 62, 90 70, 100 70 C 110 70, 126 62, 130 40" />
        <circle pathLength="1" cx="100" cy="38" r="6" />
        {/* poprečna greda sa krajevima koji se spuštaju */}
        <path pathLength="1" d="M62 106 L62 92 L138 92 L138 106" />
        {/* srednji znak */}
        <path pathLength="1" d="M84 112 L100 134 L116 112" />
        <path pathLength="1" d="M92 80 L108 80" />
        {/* donji polumesec */}
        <path pathLength="1" d="M72 146 C 78 166, 122 166, 128 146" />
        {/* podnožje */}
        <path pathLength="1" d="M88 166 L112 166" />
        <path pathLength="1" d="M94 174 L106 174" />
      </g>
      <g className="sigil-dots" fill="#ffb08a" filter={`url(#${id}-glow)`}>
        <circle cx="70" cy="38" r="3" />
        <circle cx="130" cy="38" r="3" />
        <circle cx="62" cy="111" r="3" />
        <circle cx="138" cy="111" r="3" />
        <circle cx="72" cy="143" r="2.6" />
        <circle cx="128" cy="143" r="2.6" />
        <circle cx="100" cy="100" r="2.4" />
      </g>
    </svg>
  );
}
