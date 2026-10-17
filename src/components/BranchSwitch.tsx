import { motion } from 'framer-motion';
import { branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';

const ORDER: BranchId[] = ['brixton', 'dulwich'];

/** Brixton / Dulwich. Every price, phone number, hour and event on the site follows this. */
export function BranchSwitch({ size = 'sm', id = 'switch' }: { size?: 'sm' | 'lg'; id?: string }) {
  const { branch, setBranch, status } = useBranch();
  return (
    <div className={`branch-switch branch-switch--${size}`} role="radiogroup" aria-label="Choose your Madelina">
      {ORDER.map((bid) => {
        const active = branch.id === bid;
        const open = status[bid].open;
        return (
          <button
            key={bid}
            type="button"
            role="radio"
            aria-checked={active}
            className={`branch-switch__opt ${active ? 'is-active' : ''}`}
            onClick={() => setBranch(bid)}
          >
            {active && (
              <motion.span
                layoutId={`switch-pill-${id}`}
                className="branch-switch__pill"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="branch-switch__label">
              <span className={`dot ${open ? 'dot--open' : ''}`} aria-hidden="true" />
              {branches[bid].short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
