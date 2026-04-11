import css from './CollegeCartTicker.module.css';
import logoWhite from '../assets/collegecart/logo-white.png';

const ITEMS = Array(12).fill(null);

function CollegeCartTicker() {
    return (
        <div className={css.ticker}>
            <div className={css.ticker__track}>
                {ITEMS.map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <a
                        key={i}
                        href="https://collegecart.org"
                        target="_blank"
                        rel="noreferrer"
                        className={css.ticker__item}
                    >
                        <img src={logoWhite} alt="" className={css.ticker__logo} />
                        <span>collegecart.org</span>
                    </a>
                ))}
                {ITEMS.map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <a
                        key={`dup-${i}`}
                        href="https://collegecart.org"
                        target="_blank"
                        rel="noreferrer"
                        className={css.ticker__item}
                    >
                        <img src={logoWhite} alt="" className={css.ticker__logo} />
                        <span>collegecart.org</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default CollegeCartTicker;
