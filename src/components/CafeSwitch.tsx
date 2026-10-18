import { branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { statusShort } from '../lib/status';
import { fmtTime } from '../lib/time';

/**
 * "● Brixton open till 4pm   ● Dulwich open till 3pm". Tap a name to make it your café:
 * prices, phone, directions and the booking form follow, and it's remembered.
 */
export function CafeSwitch({ showStatus = true }: { showStatus?: boolean }) {
  const { branch, setBranch, status, evening, wineLive } = useBranch();
  const wineClose = branches.brixton.hours.flat().find((s) => s.kind === 'wine')?.close ?? 0;
  return (
    <div className="switch" role="radiogroup" aria-label="Choose your café">
      {(['brixton', 'dulwich'] as BranchId[]).map((id) => {
        let line = statusShort(status[id]);
        // Previewing the evening in daytime: show Brixton as it reads on a Friday night
        if (evening && !wineLive && id === 'brixton') line = { open: true, text: `wine till ${fmtTime(wineClose)}` };
        const on = branch.id === id;
        return (
          <button key={id} type="button" role="radio" aria-checked={on} className={`switch__cafe ${on ? 'is-on' : ''}`} onClick={() => setBranch(id)}>
            {showStatus && <i className={line.open ? 'is-open' : ''} aria-hidden="true" />}
            <b>{branches[id].short}</b>
            {showStatus && <span>{line.text}</span>}
          </button>
        );
      })}
    </div>
  );
}
