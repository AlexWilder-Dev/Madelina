import { dishPhotos, type Dish } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { Print } from './Print';
import { Price } from './Price';

/** A section of the menu card. Dishes we have a photo of get a little print beside them. */
export function Items({ dishes }: { dishes: Dish[] }) {
  const { other } = useBranch();
  const otherDishes = other.menu.flatMap((s) => s.dishes);
  return (
    <ul className="card__list">
      {dishes.map((d, i) => {
        const photo = dishPhotos[d.id];
        const twin = otherDishes.find((x) => x.id === d.id);
        const elsewhere = twin && twin.price !== d.price ? twin.price : null;
        return (
          <li key={d.id} className={`item ${photo ? 'item--photo' : ''}`}>
            {photo && <Print className="item__print" src={photo.src} alt={photo.alt} rotate={i % 2 ? 4 : -4} />}
            <div className="item__text">
              <h3>
                {d.name}
                {d.vegan && (
                  <abbr title="Vegan" className="item__v">
                    Ⓥ
                  </abbr>
                )}
              </h3>
              <p>{d.description}</p>
              {elsewhere !== null && (
                <p className="item__else">
                  £{elsewhere} at {other.short}
                </p>
              )}
            </div>
            <Price value={d.price} />
          </li>
        );
      })}
    </ul>
  );
}

