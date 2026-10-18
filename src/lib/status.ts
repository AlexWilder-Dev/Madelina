import { DAY_SHORT, fmtTime, type Status } from './time';

/** "open till 4pm", "wine till 11pm", "opens tomorrow, 8am": short enough to sit beside a café's name. */
export function statusShort(status: Status): { open: boolean; text: string } {
  if (status.open) {
    const till = fmtTime(status.session.close);
    return { open: true, text: status.session.kind === 'wine' ? `wine till ${till}` : `open till ${till}` };
  }
  if (!status.next) return { open: false, text: 'closed' };
  const { session, dow, daysAway } = status.next;
  const at = fmtTime(session.open);
  if (daysAway === 0) return { open: false, text: session.kind === 'wine' ? `wine from ${at}` : `opens at ${at}` };
  return { open: false, text: `opens ${daysAway === 1 ? 'tomorrow' : DAY_SHORT[dow]}, ${at}` };
}
