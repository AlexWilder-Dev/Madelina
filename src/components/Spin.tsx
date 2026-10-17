import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/** A cup or bowl lifted out of their photos, turning slowly as the page scrolls past it. */
export function Spin({ src, size, turn = 90, className = '' }: { src: string; size: number; turn?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-turn / 2, turn / 2]);
  return (
    <div ref={ref} className={`spin ${className}`} aria-hidden="true">
      <motion.img src={src} alt="" width={size} height={size} style={{ rotate }} loading="lazy" />
    </div>
  );
}
