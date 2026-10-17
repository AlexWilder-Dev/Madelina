import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { brand, branches, enquiryTypes, type EnquiryType, type EnquiryTypeId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { longDate, timesFor, upcomingDates } from '../lib/slots';
import { BranchSwitch } from '../components/BranchSwitch';
import { Icon } from '../components/Icon';
import { PlateRim } from '../components/Ornaments';

type Sent = { name: string; type: EnquiryType; branchName: string; date: string; time?: string; guests: number };

export function Book() {
  const { branch, setBranch, now } = useBranch();
  const [params, setParams] = useSearchParams();
  const available = enquiryTypes.filter((t) => t.branches.includes(branch.id));
  const requested = params.get('type') as EnquiryTypeId | null;
  const requestedType = enquiryTypes.find((t) => t.id === requested);

  // Garden tables only exist at Dulwich, wine nights and hire at Brixton: follow the request to the right branch.
  useEffect(() => {
    if (requestedType && !requestedType.branches.includes(branch.id)) setBranch(requestedType.branches[0]);
  }, [requestedType, branch.id, setBranch]);

  const type = available.find((t) => t.id === requested) ?? available[0];
  const dates = useMemo(() => upcomingDates(branch, type.slots, now, type.id === 'hire' ? 10 : 8), [branch, type, now]);

  const [dateIso, setDateIso] = useState<string>('');
  const [time, setTime] = useState<number | ''>('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [occasion, setOccasion] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Sent | null>(null);

  const date = dates.find((d) => d.iso === dateIso) ?? null;
  const times = date && type.id !== 'hire' ? timesFor(date.sessions, date.label === 'Today', now) : [];

  useEffect(() => {
    setDateIso('');
    setTime('');
    setGuests(type.id === 'hire' ? 12 : 2);
  }, [type.id, branch.id]);

  // Arriving from another "book" link (e.g. a garden or hire card) starts a fresh request
  useEffect(() => {
    setSent(null);
  }, [requested]);

  function chooseType(id: EnquiryTypeId) {
    const t = enquiryTypes.find((x) => x.id === id)!;
    if (!t.branches.includes(branch.id)) setBranch(t.branches[0]);
    setParams({ type: id }, { replace: true });
    setErrors({});
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Pick a day';
    if (type.id !== 'hire' && time === '') errs.time = 'Pick a time';
    if (!name.trim()) errs.name = 'We need a name for the booking';
    const c = contact.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && c.replace(/[^\d]/g, '').length < 10)
      errs.contact = 'A phone number or email so they can reply';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent({
      name: name.trim().split(' ')[0],
      type,
      branchName: branch.name,
      date: longDate(date!.iso),
      time: time === '' ? undefined : times.find((t) => t.value === time)?.label,
      guests,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const maxGuests = type.id === 'hire' ? 60 : 12;

  return (
    <main className="page book">
      <section className="wrap page-head">
        <p className="eyebrow">Book · {branch.name}</p>
        <h1>{sent ? 'Request sent' : 'Ask for a table'}</h1>
        {!sent && (
          <p className="page-head__lede">
            Instead of a DM: tell {branch.name} when you’d like to come and they’ll get back to you.
          </p>
        )}
      </section>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.section
            key="sent"
            className="wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="ticket">
              <PlateRim />
              <div className="ticket__body">
                <span className="ticket__tick">
                  <Icon name="check" size={28} />
                </span>
                <h2>Thanks, {sent.name}.</h2>
                <p>
                  {sent.branchName} has your request for <strong>{sent.type.label.toLowerCase()}</strong> on{' '}
                  <strong>{sent.date}</strong>
                  {sent.time ? (
                    <>
                      {' '}
                      at <strong>{sent.time}</strong>
                    </>
                  ) : null}
                  , for <strong>{sent.guests} {sent.guests === 1 ? 'person' : 'people'}</strong>.
                </p>
                <p className="ticket__small">{sent.type.reply}</p>
                <p className="ticket__demo">This is a demo site: nothing has actually been sent.</p>
                <div className="ticket__actions">
                  <button type="button" className="btn btn--paper" onClick={() => setSent(null)}>
                    Make another request
                  </button>
                  <a className="btn btn--paper" href={brand.instagram.url} target="_blank" rel="noreferrer">
                    <Icon name="instagram" /> {brand.instagram.handle}
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.form
            key="form"
            className="wrap book-form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <fieldset className="field">
              <legend>Which Madelina?</legend>
              <BranchSwitch size="lg" id="book" />
            </fieldset>

            <fieldset className="field">
              <legend>What for?</legend>
              <div className="chips chips--types">
                {enquiryTypes.map((t) => {
                  const here = t.branches.includes(branch.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`chip chip--type ${type.id === t.id ? 'is-on' : ''} ${here ? '' : 'is-elsewhere'}`}
                      aria-pressed={type.id === t.id}
                      onClick={() => chooseType(t.id)}
                    >
                      <Icon name={t.icon} />
                      <span>
                        {t.label}
                        {!here && <small> · {branches[t.branches[0]].short}</small>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="field__hint">{type.blurb}</p>
            </fieldset>

            <fieldset className="field">
              <legend>Day</legend>
              <div className="chips chips--scroll" role="listbox" aria-label="Day">
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    role="option"
                    aria-selected={dateIso === d.iso}
                    className={`chip chip--date ${dateIso === d.iso ? 'is-on' : ''}`}
                    onClick={() => {
                      setDateIso(d.iso);
                      setTime('');
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {errors.date && <p className="field__error">{errors.date}</p>}
            </fieldset>

            {type.id !== 'hire' && (
              <fieldset className="field">
                <legend>Arriving</legend>
                {date ? (
                  <div className="chips chips--wrap">
                    {times.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        className={`chip chip--time ${time === t.value ? 'is-on' : ''}`}
                        aria-pressed={time === t.value}
                        onClick={() => setTime(t.value)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="field__hint">Pick a day to see times.</p>
                )}
                {errors.time && <p className="field__error">{errors.time}</p>}
              </fieldset>
            )}

            <fieldset className="field">
              <legend>How many?</legend>
              <div className="stepper">
                <button type="button" aria-label="One fewer" onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                  <Icon name="minus" />
                </button>
                <output aria-live="polite">
                  {guests} {guests === 1 ? 'person' : 'people'}
                </output>
                <button type="button" aria-label="One more" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}>
                  <Icon name="plus" />
                </button>
              </div>
            </fieldset>

            {type.occasions && (
              <fieldset className="field">
                <legend>The occasion</legend>
                <div className="chips chips--wrap">
                  {type.occasions.map((o) => (
                    <button
                      key={o}
                      type="button"
                      className={`chip ${occasion === o ? 'is-on' : ''}`}
                      aria-pressed={occasion === o}
                      onClick={() => setOccasion(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="field field--text">
              <label htmlFor="bk-name">Your name</label>
              <input id="bk-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="field__error">{errors.name}</p>}
            </div>
            <div className="field field--text">
              <label htmlFor="bk-contact">Phone or email</label>
              <input
                id="bk-contact"
                autoComplete="tel"
                inputMode="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {errors.contact && <p className="field__error">{errors.contact}</p>}
            </div>
            <div className="field field--text">
              <label htmlFor="bk-notes">Anything else? {type.id === 'hire' ? '(daytime or evening, food, timings)' : '(optional)'}</label>
              <textarea id="bk-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="btn btn--gold book-form__submit">
              Send to {branch.name}
              <Icon name="arrow" />
            </button>
            <p className="field__hint book-form__alt">
              Or call <a href={`tel:${branch.phone.tel}`}>{branch.phone.display}</a>, or message{' '}
              <a href={brand.instagram.url} target="_blank" rel="noreferrer">
                {brand.instagram.handle}
              </a>
              .
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </main>
  );
}
