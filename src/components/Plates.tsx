import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { featured } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { Price } from './Price';
import { Icon } from './Icon';

/** Their dishes on their own painted plates, cropped round, with this branch's price. */
export function Plates() {
  const { branch } = useBranch();
  const dishes = branch.menu.flatMap((s) => s.dishes);
  return (
    <div className="plates" role="list">
      {featured.map((f, i) => {
        const dish = f.dishId ? dishes.find((d) => d.id === f.dishId) : undefined;
        return (
          <motion.div
            role="listitem"
            key={f.photo}
            className="plate"
            initial={{ opacity: 0, rotate: -14, scale: 0.92 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.05 }}
          >
            <div className="plate__disc">
              <img src={f.photo} alt={f.alt} loading={i < 2 ? 'eager' : 'lazy'} width={720} height={720} />
            </div>
            <div className="plate__text">
              <h3>
                {dish?.name ?? f.title}
                {dish?.vegan && <span className="vegan-mark">Ⓥ</span>}
              </h3>
              {dish ? <Price value={dish.price} className="plate__price" /> : <span className="plate__price">{f.priceNote}</span>}
              <p>{f.line ?? dish?.description}</p>
            </div>
          </motion.div>
        );
      })}
      <div role="listitem" className="plate plate--more">
        <Link to="/menu" className="plate__disc plate__disc--link">
          <span>
            The whole menu
            <Icon name="arrow" />
          </span>
        </Link>
      </div>
    </div>
  );
}
