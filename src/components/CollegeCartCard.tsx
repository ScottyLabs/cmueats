import { motion } from 'motion/react';
import clsx from 'clsx';
import { ICollegeCartPromo } from '../data/collegeCartPromos';
import cardCss from './EateryCard.module.css';
import css from './CollegeCartCard.module.css';
import logoWhite from '../assets/collegecart/logo-white.png';

function CollegeCartCard({ promo, animate = false }: { promo: ICollegeCartPromo; animate?: boolean }) {
    return (
        <motion.a
            layout
            href={promo.url}
            target="_blank"
            rel="noreferrer"
            className={clsx(cardCss.card, cardCss['card-in-main-grid'], css.collegecart_card)}
            initial={
                animate
                    ? {
                          opacity: 0,
                          transform: 'translate(-10px,0)',
                          filter: 'blur(3px)',
                      }
                    : false
            }
            animate={{
                transform: 'translate(0,0)',
                opacity: 1,
                filter: 'blur(0)',
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.7, ease: [0.08, 0.67, 0.64, 1.01] }}
        >
            <div className={css.collegecart_card__header}>
                <img src={logoWhite} alt="" className={css.collegecart_card__logo} />
                <span className={css.collegecart_card__brand}>CollegeCart</span>
            </div>
            <div className={css.collegecart_card__body}>
                <img src={promo.image} alt={promo.category} className={css.collegecart_card__image} />
                <div className={css.collegecart_card__text}>
                    <span className={css.collegecart_card__category}>{promo.category}</span>
                    <span className={css.collegecart_card__tagline}>{promo.tagline}</span>
                </div>
            </div>
        </motion.a>
    );
}

export default CollegeCartCard;
