import { useState } from 'react';
import './SponsorCarousel.css';
import dropdownArrow from '../assets/control_button/dropdown_arrow.svg';

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

    // double it because it loops seamlessly
    const doubleLogos = [...logos, ...logos];

    return (
        <div className={`${darkMode ? 'sponsors--dark' : 'sponsors--light'}`}>
            <div className="footer__sponsors-tab">
                <span className="footer__sponsors-desc">
                    <button
                        onClick={() => setCarouselVisible((v) => !v)}
                        className="footer__sponsors-text"
                        aria-expanded={carouselVisible}
                    >
                        ScottyLabs is sponsored by{' '}
                        <span
                            className={`footer__sponsors-arrow ${carouselVisible ? 'footer__sponsors-arrow--open' : ''}`}
                        >
                            <img src={dropdownArrow} alt="Dropdown arrow" />
                        </span>
                    </button>
                </span>
            </div>

            <div
                className={`footer__sponsors ${
                    carouselVisible ? 'footer__sponsors--open' : 'footer__sponsors--closed'
                }`}
                aria-hidden={!carouselVisible}
            >
                <div className="footer__sponsors-carousel">
                    <div className="carousel">
                        <ul className="carousel__track">
                            {doubleLogos.map((logo) => (
                                <li className="carousel__item">
                                    <img src={logo.src} alt="" className="carousel__image" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SponsorCarousel;
