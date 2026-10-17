import { fmtTime, whenLabel, type Status } from './time';

/** "Open until 3pm", "Wine night until 11pm", or "Opens tomorrow, 8am". */
export function statusLine(status: Status): { open: boolean; text: string } {
  if (status.open) {
    const until = fmtTime(status.session.close);
    if (status.session.kind === 'wine') return { open: true, text: `Wine night until ${until}` };
    if (status.closesIn <= 45) return { open: true, text: `Open, closing at ${until}` };
    return { open: true, text: `Open until ${until}` };
  }
  if (!status.next) return { open: false, text: 'Closed' };
  const { session, dow, daysAway } = status.next;
  const at = fmtTime(session.open);
  if (session.kind === 'wine') return { open: false, text: daysAway === 0 ? `Wine night from ${at}` : `Wine night ${whenLabel(daysAway, dow)} ${at}` };
  if (daysAway === 0) return { open: false, text: `Opens at ${at}` };
  return { open: false, text: `Opens ${whenLabel(daysAway, dow)}, ${at}` };
}
