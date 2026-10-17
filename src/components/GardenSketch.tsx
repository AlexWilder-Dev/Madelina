import { motion } from 'framer-motion';

/**
 * The Dulwich back garden as described by visitors (no photo of it is public yet):
 * a decked area, a sun sail overhead and a privacy wall, with plants. Drawn in the same gold line as their logo.
 */
export function GardenSketch({ className = '' }: { className?: string }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.4, delay: i * 0.12, ease: 'easeInOut' as const } }),
  };
  return (
    <motion.svg
      className={`garden-sketch ${className}`}
      viewBox="0 0 320 220"
      role="img"
      aria-label="Line drawing of a decked garden under a triangular sun sail, with a slatted privacy wall and plants"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* privacy wall slats */}
        {Array.from({ length: 11 }, (_, i) => (
          <motion.path key={`w${i}`} variants={draw} custom={i * 0.2} d={`M${40 + i * 22} 66 V170`} opacity={0.3} />
        ))}
        <motion.path variants={draw} custom={0} d="M34 64 H286" opacity={0.6} />
        {/* posts */}
        <motion.path variants={draw} custom={1} d="M30 28 V176" />
        <motion.path variants={draw} custom={1} d="M292 20 V176" />
        {/* sun sail */}
        <motion.path variants={draw} custom={2} d="M30 30 Q 162 50 292 22 Q 236 50 190 66 Q 116 50 30 30 Z" fill="var(--sail-fill)" />
        {/* deck */}
        <motion.path variants={draw} custom={3} d="M8 176 H312" />
        {Array.from({ length: 4 }, (_, i) => (
          <motion.path key={`d${i}`} variants={draw} custom={4 + i * 0.2} d={`M${14 - i * 2} ${184 + i * 9} H${306 + i * 2}`} opacity={0.6} />
        ))}
        {/* table and two chairs */}
        <motion.path variants={draw} custom={5} d="M132 146 H188 M160 146 V176 M146 176 H174" />
        <motion.path variants={draw} custom={5.5} d="M110 128 V176 M110 150 H128 L128 176 M110 150 L104 176" />
        <motion.path variants={draw} custom={5.5} d="M210 128 V176 M210 150 H192 L192 176 M210 150 L216 176" />
        {/* potted plants */}
        <motion.path variants={draw} custom={6} d="M56 176 L60 156 H80 L84 176 M70 156 C 60 140, 52 132, 46 118 M70 156 C 72 138, 78 126, 86 112 M70 156 C 66 136, 68 124, 70 106" />
        <motion.path variants={draw} custom={6.5} d="M244 176 L248 160 H264 L268 176 M256 160 C 248 146, 242 140, 236 130 M256 160 C 262 146, 270 138, 278 130 M256 160 C 256 146, 256 136, 258 124" />
      </g>
    </motion.svg>
  );
}
