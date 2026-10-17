import { motion } from 'framer-motion';
import { branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';

/** "Brixton / Dulwich" as two words in a heading: the one you're on is set in full, the other faint. */
export function BranchWords({ id }: { id: string }) {
  const { branch, setBranch } = useBranch();
  return (
    <span className="words" role="radiogroup" aria-label="Choose your Madelina">
      {(['brixton', 'dulwich'] as BranchId[]).map((b) => {
        const on = branch.id === b;
        return (
          <button key={b} type="button" role="radio" aria-checked={on} className={on ? 'is-on' : ''} onClick={() => setBranch(b)}>
            {branches[b].short}
            {on && <motion.span layoutId={`words-${id}`} className="words__line" transition={{ type: 'spring', stiffness: 420, damping: 40 }} />}
          </button>
        );
      })}
    </span>
  );
}
