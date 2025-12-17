import { useState } from 'react';
import clsx from 'clsx';
import css from './SponsorCarousel.module.css';
import DropdownArrow from '../assets/control_button/dropdown_arrow.svg?react';
import ScottyDog from '../assets/scottydog.svg?react';

function SponsorCarousel({ darkMode, openByDefault }: { darkMode: boolean; openByDefault: boolean }) {
    const [carouselVisible, setCarouselVisible] = useState(openByDefault);

    const logos = Object.values(
        import.meta.glob('../assets/logos/*', {
            eager: true,
            query: 'url',
        }) as Record<string, { default: string }>,
    ).map(({ default: logoUrl }) => {
        const filename = logoUrl.split('/').pop() || '';
        return {
            src: logoUrl,
            alt: filename,
        };
    });

    // double it to make it loop seamlessly
    const doubleLogos = [...logos, ...logos.map((l) => ({ ...l, alt: `${l.alt}2` }))];

    return (
        <div className={clsx(css.sponsors, darkMode ? css['sponsors--dark'] : css['sponsors--light'])}>
            <div className={css[`carousel-container`]} aria-hidden={!carouselVisible}>
                <button
                    onClick={() => setCarouselVisible((v) => !v)}
                    className={css['sponsors-button']}
                    aria-expanded={carouselVisible}
                    type="button"
                >
                    <ScottyDog className={css['sponsors-button__dog']} /> ScottyLabs is sponsored by{' '}
                    <DropdownArrow className={css[`sponsors-button__arrow`]} />
                </button>
                <div className={css.carousel}>
                    <ul className={css.carousel__track}>
                        {doubleLogos.map((logo) => (
                            <li className={css.carousel__item} key={logo.alt}>
                                <img src={logo.src} alt={logo.alt} className={css.carousel__image} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SponsorCarousel;
