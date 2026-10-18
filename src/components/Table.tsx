import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Print, type PrintProps } from './Print';

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/**
 * Three prints dealt onto the table. Tap one to bring it to the top;
 * with a mouse you can also slide them around.
 */
export function Table({ prints, id }: { prints: PrintProps[]; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<number[]>(() => prints.map((_, i) => i));
  const [drag, setDrag] = useState(false);
  useEffect(() => setDrag(finePointer()), []);
  useEffect(() => setOrder(prints.map((_, i) => i)), [id, prints.length]);

  const lift = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i]);

  return (
    <div className="table" ref={ref}>
      {prints.map((p, i) => (
        <motion.div
          key={`${id}-${i}`}
          className={`table__slot table__slot--${i + 1}`}
          style={{ zIndex: order.indexOf(i) + 1 }}
          initial={{ opacity: 0, y: 40, rotate: (p.rotate ?? 0) * 2.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.12 + i * 0.1 }}
        >
          <Print {...p} drag={drag} onLift={() => lift(i)} dragConstraintsRef={ref} />
        </motion.div>
      ))}
    </div>
  );
}
