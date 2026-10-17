import { brand } from '../data/madelina';

/** The little flower from their monogram, as a separator. */
function Flower() {
  return (
    <svg className="flower" viewBox="0 0 20 20" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="10" cy="5.2" rx="3.1" ry="4.6" transform={`rotate(${a} 10 10)`} />
      ))}
      <circle cx="10" cy="10" r="2.2" className="flower__heart" />
    </svg>
  );
}

/** Their own phrases, running across a marigold band. */
export function Marquee() {
  const line = brand.phrases.map((p) => (
    <span key={p}>
      {p}
      <Flower />
    </span>
  ));
  return (
    <div className="marquee" role="img" aria-label={brand.phrases.join(', ')}>
      <div className="marquee__track" aria-hidden="true">
        <div>{line}</div>
        <div>{line}</div>
      </div>
    </div>
  );
}
