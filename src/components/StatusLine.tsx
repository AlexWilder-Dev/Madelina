import { fmtTime, whenLabel, type Status } from '../lib/time';

/** "Open until 3pm", "Wine night until 11pm", "Closed now · Opens tomorrow at 8am". */
export function statusText(status: Status): { head: string; sub?: string } {
  if (status.open) {
    const wine = status.session.kind === 'wine';
    const head = wine ? `Wine night until ${fmtTime(status.session.close)}` : `Open until ${fmtTime(status.session.close)}`;
    let sub: string | undefined;
    if (status.closesIn <= 45) sub = `Last ${status.closesIn} minutes`;
    else if (status.next) sub = `Then wine night from ${fmtTime(status.next.session.open)}`;
    return { head, sub };
  }
  if (!status.next) return { head: 'Closed' };
  const { session, dow, daysAway } = status.next;
  const at = fmtTime(session.open);
  const when = whenLabel(daysAway, dow);
  if (session.kind === 'wine') return { head: 'Closed now', sub: `Wine night ${when} from ${at}` };
  return { head: 'Closed now', sub: daysAway === 0 ? `Opens at ${at} today` : `Opens ${when} at ${at}` };
}

export function StatusPill({ status }: { status: Status }) {
  const t = statusText(status);
  return (
    <span className={`status-pill ${status.open ? 'is-open' : ''}`}>
      <span className={`dot ${status.open ? 'dot--open' : ''}`} aria-hidden="true" />
      <span>{status.open ? t.head : t.sub ?? t.head}</span>
    </span>
  );
}
