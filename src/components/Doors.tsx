import { motion } from 'framer-motion';
import { branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { StatusPill } from './StatusLine';
import { Sprig } from './Ornaments';
import shopBrixton from '../assets/photos/shop-brixton.webp';
import shopDulwich from '../assets/photos/shop-dulwich.webp';

const photo: Record<BranchId, string> = { brixton: shopBrixton, dulwich: shopDulwich };

/**
 * The two shopfronts side by side, each with its live status. Tapping one makes it "your Madelina"
 * for the rest of the site. The black fascia with gold lettering is taken from both real shopfronts.
 */
export function Doors() {
  const { branch, setBranch, status, evening } = useBranch();
  return (
    <div className="doors" role="radiogroup" aria-label="Choose your Madelina">
      {(['brixton', 'dulwich'] as const).map((id) => {
        const b = branches[id];
        const active = branch.id === id;
        const lit = evening && id === 'brixton';
        return (
          <motion.button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`door ${active ? 'is-active' : ''} ${lit ? 'is-lit' : ''}`}
            onClick={() => setBranch(id)}
            whileTap={{ scale: 0.98 }}
          >
            <span className="door__fascia">
              <Fascia text={b.fascia} />
            </span>
            <span className="door__photo">
              <img src={photo[id]} alt="" width={900} height={1125} fetchPriority={id === 'brixton' ? 'high' : 'auto'} />
              <span className="door__light" aria-hidden="true" />
            </span>
            <span className="door__meta">
              <span className="door__name">{b.short}</span>
              <span className="door__street">{b.area}</span>
              <StatusPill status={status[id]} />
            </span>
            {active && (
              <motion.span
                layoutId="door-ring"
                className="door__ring"
                aria-hidden="true"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Gold lettering on black, as above each door. */
export function Fascia({ text }: { text: string }) {
  if (text === 'monogram')
    return (
      <span className="door__no door__no--mono" aria-hidden="true">
        <Sprig className="door__sprig" flip />M<Sprig className="door__sprig" />
      </span>
    );
  return <span className="door__no">{text}</span>;
}
