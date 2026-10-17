import type { JSX } from 'react';

type Name =
  | 'phone'
  | 'pin'
  | 'plate'
  | 'book'
  | 'instagram'
  | 'facebook'
  | 'arrow'
  | 'check'
  | 'glass'
  | 'sail'
  | 'people'
  | 'clock'
  | 'minus'
  | 'plus';

const paths: Record<Name, JSX.Element> = {
  phone: (
    <path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
    </>
  ),
  book: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V8.5Z" />,
  arrow: <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  glass: (
    <>
      <path d="M8 3h8l-.6 5.2a3.4 3.4 0 0 1-6.8 0Z" />
      <path d="M12 11.6V20M8.5 20.5h7" />
    </>
  ),
  sail: (
    <>
      <path d="M3.5 7.5 20.5 4 12 15.5Z" />
      <path d="M3.5 7.5V20M20.5 4V20M2.5 20.5h19" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M15.5 14.4a4.6 4.6 0 0 1 5 5.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  minus: <path d="M6 12h12" />,
  plus: <path d="M6 12h12M12 6v12" />,
};

export function Icon({ name, size = 20 }: { name: Name; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
