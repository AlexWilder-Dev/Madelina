import { AnimatePresence, motion } from 'framer-motion';

/** A price that flips when the branch (and so the number) changes. */
export function Price({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`price ${className}`} aria-label={`£${value}`}>
      <span aria-hidden="true">£</span>
      <span className="price__num" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '-0.9em', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '0.9em', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
