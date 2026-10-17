import { motion } from 'framer-motion';

/**
 * The rim of Madelina's painted plates: ochre "eyes" with red centres and thin
 * green, blue and brown trails between them on a cream glaze, edged in terracotta.
 */
export function PlateRim({ className = '', height = 26 }: { className?: string; height?: number }) {
  const id = 'rim-' + height;
  // The glaze band sits between the terracotta edge (3px) and the cobalt line (bottom 6px)
  const top = 3;
  const bottom = height - 6;
  const mid = (top + bottom) / 2;
  const ry = Math.max((bottom - top) / 2 - 0.5, 2);
  return (
    <svg className={`plate-rim ${className}`} height={height} width="100%" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="30" height={height} patternUnits="userSpaceOnUse">
          <rect width="30" height={height} fill="var(--glaze)" />
          <rect width="30" height="3" fill="var(--terracotta)" />
          <rect y={height - 3} width="30" height="3" fill="var(--terracotta)" />
          <rect y={height - 6} width="30" height="2" fill="var(--cobalt)" />
          <line x1="3" y1={top + 1} x2="3" y2={bottom - 1} stroke="var(--leaf)" strokeWidth="1.4" />
          <line x1="5.5" y1={top + 1} x2="5.5" y2={bottom - 1} stroke="var(--cobalt)" strokeWidth="1.1" />
          <line x1="8" y1={top + 1} x2="8" y2={bottom - 1} stroke="var(--umber)" strokeWidth="1" />
          <ellipse cx="19" cy={mid} rx="6.2" ry={ry} fill="var(--umber)" />
          <ellipse cx="19" cy={mid} rx="4.8" ry={Math.max(ry - 1.4, 1.5)} fill="var(--ochre)" />
          <ellipse cx="19" cy={mid + 0.8} rx="2.4" ry={Math.max(ry * 0.45, 1)} fill="var(--paprika)" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}

/** The leafy sprig that wraps their monogram, drawn as a single gold line. */
export function Sprig({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={`sprig ${className}`}
      viewBox="0 0 120 60"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 52 C 30 46, 62 36, 112 10" />
        <path d="M24 47 C 20 38, 24 30, 33 27 C 35 36, 31 43, 24 47 Z" />
        <path d="M27 46 C 34 52, 44 53, 50 47 C 42 41, 33 41, 27 46 Z" />
        <path d="M48 39 C 45 29, 50 22, 59 20 C 60 29, 56 35, 48 39 Z" />
        <path d="M52 38 C 60 43, 69 43, 75 37 C 68 31, 59 32, 52 38 Z" />
        <path d="M74 28 C 73 20, 78 14, 86 13 C 86 21, 82 26, 74 28 Z" />
        <path d="M78 27 C 85 31, 93 30, 97 24 C 91 19, 84 21, 78 27 Z" />
        <path d="M98 17 C 99 11, 104 7, 110 7 C 109 13, 104 16, 98 17 Z" />
      </g>
    </svg>
  );
}

/**
 * A brass dome pendant like the ones over the Brixton counter.
 * `lit` swings it gently and turns the bulb on (wine nights).
 */
export function Lamp({ lit, className = '' }: { lit: boolean; className?: string }) {
  return (
    <motion.svg
      className={`lamp ${lit ? 'is-lit' : ''} ${className}`}
      viewBox="0 0 80 120"
      aria-hidden="true"
      style={{ originX: 0.5, originY: 0 }}
      animate={{ rotate: lit ? [0, 2.2, -1.6, 1, 0] : 0 }}
      transition={{ duration: 3.2, ease: 'easeInOut' }}
    >
      <line x1="40" y1="0" x2="40" y2="52" stroke="var(--lamp-cord)" strokeWidth="1.5" />
      <rect x="35" y="50" width="10" height="9" rx="2" fill="var(--brass-dark)" />
      <path d="M38 59 h4 v5 h-4 z" fill="var(--brass-dark)" />
      <path d="M12 96 C 12 76, 24 64, 40 64 C 56 64, 68 76, 68 96 Z" fill="var(--brass)" />
      <path d="M17 93 C 18 79, 27 69, 40 68" fill="none" stroke="var(--brass-light)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <rect x="9" y="94" width="62" height="4" rx="2" fill="var(--brass-dark)" />
      <motion.circle
        cx="40"
        cy="103"
        r="8"
        initial={false}
        animate={{ fill: lit ? '#ffd98a' : '#c9c2a6', opacity: lit ? 1 : 0.55 }}
        transition={{ duration: 0.8 }}
      />
    </motion.svg>
  );
}
