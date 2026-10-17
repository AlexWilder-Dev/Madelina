import { AnimatePresence, motion } from 'framer-motion';

/** A price that cross-fades when the branch (and so the number) changes. */
export function Price({ value }: { value: number }) {
  return (
    <span className="price" aria-label={`£${value}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          £{value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
