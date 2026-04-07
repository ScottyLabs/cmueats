import css from './CollegeCartScotty.module.css';
import logoWhite from '../assets/collegecart/logo-white.png';

function CollegeCartScotty() {
    return (
        <div className={css.scotty_container} aria-hidden="true">
            <div className={css.scotty}>
                <img src={logoWhite} alt="" className={css.scotty__img} />
            </div>
        </div>
    );
}

export default CollegeCartScotty;
