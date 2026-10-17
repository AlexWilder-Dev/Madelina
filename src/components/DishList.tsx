import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { dishPhotos, type Dish } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { Price } from './Price';

/**
 * A menu section as a list of big names. Dishes we have a photo of show it inline on phones;
 * on wide screens the photo sits beside the list and changes as you move down it.
 */
export function DishList({ dishes }: { dishes: Dish[] }) {
  const { other } = useBranch();
  const otherDishes = other.menu.flatMap((s) => s.dishes);
  const firstPhoto = dishes.find((d) => dishPhotos[d.id])?.id ?? null;
  const [active, setActive] = useState<string | null>(firstPhoto);
  const shown = active && dishPhotos[active] ? active : firstPhoto;

  return (
    <div className={`dishlist ${firstPhoto ? 'has-photo' : ''}`}>
      <ul>
        {dishes.map((d) => {
          const photo = dishPhotos[d.id];
          const twin = otherDishes.find((x) => x.id === d.id);
          const elsewhere = twin && twin.price !== d.price ? twin.price : null;
          return (
            <li
              key={d.id}
              className={`dish ${photo ? 'dish--photo' : ''} ${shown === d.id ? 'is-shown' : ''}`}
              onMouseEnter={() => photo && setActive(d.id)}
            >
              {photo && <img className="dish__inline" src={photo.src} alt={photo.alt} loading="lazy" width={1000} height={1250} />}
              <div className="dish__head">
                <h3>
                  {d.name}
                  {d.vegan && (
                    <abbr title="Vegan" className="dish__v">
                      Ⓥ
                    </abbr>
                  )}
                </h3>
                <Price value={d.price} />
              </div>
              <p className="dish__desc">{d.description}</p>
              <AnimatePresence initial={false}>
                {elsewhere !== null && (
                  <motion.p key={other.id} className="dish__else" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    £{elsewhere} at {other.short}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      {firstPhoto && (
        <div className="dishlist__aside" aria-hidden="true">
          <div className="dishlist__frame">
            <AnimatePresence initial={false}>
              {shown && (
                <motion.img
                  key={shown}
                  src={dishPhotos[shown].src}
                  alt=""
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 0.75, 0.2, 1] }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
