import { motion } from 'framer-motion';
import type { CSSProperties, RefObject } from 'react';
import { Price } from './Price';

export type PrintProps = {
  src: string;
  alt: string;
  caption?: string;
  price?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  /** Let the print be pushed around the table (pointer devices only) */
  drag?: boolean;
  onLift?: () => void;
  eager?: boolean;
  dragConstraintsRef?: RefObject<HTMLDivElement | null>;
};

/** A photo printed with a white border and a pencil caption, as if dealt onto the table. */
export function Print({ src, alt, caption, price, rotate = 0, className = '', style, drag, onLift, eager, dragConstraintsRef }: PrintProps) {
  return (
    <motion.figure
      className={`print ${className}`}
      style={{ rotate, ...style }}
      drag={drag}
      dragMomentum={false}
      dragConstraints={dragConstraintsRef}
      dragElastic={0.08}
      whileDrag={{ scale: 1.04, rotate: rotate * 0.4, cursor: 'grabbing' }}
      whileHover={drag ? { y: -6 } : undefined}
      onPointerDown={onLift}
    >
      <img src={src} alt={alt} draggable={false} loading={eager ? 'eager' : 'lazy'} width={900} height={1125} />
      {caption && (
        <figcaption>
          <span>{caption}</span>
          {price !== undefined && <Price value={price} />}
        </figcaption>
      )}
    </motion.figure>
  );
}
