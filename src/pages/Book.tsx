import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { brand, branches, enquiryTypes, type EnquiryType, type EnquiryTypeId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { longDate, timesFor, upcomingDates } from '../lib/slots';
import { BranchWords } from '../components/BranchWords';

type Sent = { name: string; type: EnquiryType; branchName: string; date: string; time?: string; guests: number };

export function Book() {
  const { branch, setBranch, now } = useBranch();
  const [params, setParams] = useSearchParams();
  const requested = params.get('type') as EnquiryTypeId | null;
  const requestedType = enquiryTypes.find((t) => t.id === requested);

  // Garden tables only exist at Dulwich, wine nights only at Brixton: follow the request to the right café.
  useEffect(() => {
    if (requestedType && !requestedType.branches.includes(branch.id)) setBranch(requestedType.branches[0]);
  }, [requestedType, branch.id, setBranch]);

  const available = enquiryTypes.filter((t) => t.branches.includes(branch.id));
  const type = available.find((t) => t.id === requested) ?? available[0];
  const hire = type.id === 'hire';
  const dates = useMemo(() => upcomingDates(branch, type.slots, now, hire ? 21 : 10), [branch, type.slots, now, hire]);

  const [dateIso, setDateIso] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Sent | null>(null);

  const date = dates.find((d) => d.iso === dateIso) ?? null;
  const times = date && !hire ? timesFor(date.sessions, date.label === 'Today', now) : [];

  useEffect(() => {
    setDateIso('');
    setTime('');
    setGuests(hire ? 20 : 2);
  }, [type.id, branch.id, hire]);

  // Arriving from another booking link starts a fresh request
  useEffect(() => setSent(null), [requested]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Choose a day';
    if (!hire && !time) errs.time = 'Choose a time';
    if (!name.trim()) errs.name = 'A name for the booking';
    const c = contact.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && c.replace(/\D/g, '').length < 10) errs.contact = 'A phone number or email, so we can reply';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent({
      name: name.trim().split(/\s+/)[0],
      type,
      branchName: branch.name,
      date: longDate(date!.iso),
      time: times.find((t) => String(t.value) === time)?.label,
      guests,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="book">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.section key="sent" className="book__sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h1>
              Thank you, <em>{sent.name}.</em>
            </h1>
            <p className="book__summary">
              {sent.branchName} has your request: {sent.type.label.toLowerCase()} on {sent.date}
              {sent.time ? ` at ${sent.time}` : ''}, for {sent.guests} {sent.guests === 1 ? 'person' : 'people'}.
            </p>
            <p>{sent.type.reply}</p>
            <p className="book__demo">This is a demo site: nothing has actually been sent.</p>
            <p className="links">
              <button type="button" onClick={() => setSent(null)}>
                Make another request
              </button>
              <a href={brand.instagram.url} target="_blank" rel="noreferrer">
                {brand.instagram.handle}
              </a>
            </p>
          </motion.section>
        ) : (
          <motion.form key="form" className="book__form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="book__head">
              <h1>
                Book a <em>table</em>
              </h1>
              <p>Tell us when you’d like to come and we’ll get back to you. No need to DM.</p>
            </header>

            <div className="field">
              <span className="field__label">Café</span>
              <BranchWords id="book" />
            </div>

            <fieldset className="field">
              <legend className="field__label">For</legend>
              <div className="options">
                {available.map((t) => (
                  <label key={t.id} className={type.id === t.id ? 'is-on' : ''}>
                    <input
                      type="radio"
                      name="type"
                      checked={type.id === t.id}
                      onChange={() => {
                        setParams({ type: t.id }, { replace: true });
                        setErrors({});
                      }}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
              <p className="field__hint">
                {branch.id === 'brixton' ? 'Garden tables are at Dulwich.' : 'Wine nights are at Brixton.'}{' '}
                <button type="button" className="inline" onClick={() => setBranch(branch.id === 'brixton' ? 'dulwich' : 'brixton')}>
                  Switch to {branches[branch.id === 'brixton' ? 'dulwich' : 'brixton'].short}
                </button>
              </p>
            </fieldset>

            <div className="field-row">
              <label className="field">
                <span className="field__label">Day</span>
                <select
                  value={dateIso}
                  onChange={(e) => {
                    setDateIso(e.target.value);
                    setTime('');
                  }}
                >
                  <option value="">Choose…</option>
                  {dates.map((d) => (
                    <option key={d.iso} value={d.iso}>
                      {d.label === 'Today' || d.label === 'Tomorrow' ? `${d.label}, ${longDate(d.iso)}` : longDate(d.iso)}
                    </option>
                  ))}
                </select>
                {errors.date && <span className="field__error">{errors.date}</span>}
              </label>

              {!hire && (
                <label className="field">
                  <span className="field__label">Time</span>
                  <select value={time} onChange={(e) => setTime(e.target.value)} disabled={!date}>
                    <option value="">{date ? 'Choose…' : 'Day first'}</option>
                    {times.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  {errors.time && <span className="field__error">{errors.time}</span>}
                </label>
              )}

              <label className="field">
                <span className="field__label">People</span>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                  {(hire ? [10, 15, 20, 25, 30, 40, 50] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((n) => (
                    <option key={n} value={n}>
                      {n}
                      {hire && n === 50 ? '+' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span className="field__label">Name</span>
              <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </label>
            <label className="field">
              <span className="field__label">Phone or email</span>
              <input autoComplete="tel" value={contact} onChange={(e) => setContact(e.target.value)} />
              {errors.contact && <span className="field__error">{errors.contact}</span>}
            </label>
            <label className="field">
              <span className="field__label">{hire ? 'The occasion, timings, food' : 'Anything else'}</span>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>

            <button type="submit" className="pill pill--ink pill--big">
              Send to {branch.name}
            </button>
            <p className="field__hint">
              Or call <a href={`tel:${branch.phone.tel}`}>{branch.phone.display}</a>.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </main>
  );
}
