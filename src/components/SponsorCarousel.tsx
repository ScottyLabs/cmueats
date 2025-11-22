import { useState } from 'react';
import './SponsorCarousel.css';

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
                        onClick={() => {
                            console.log(carouselVisible);
                            setCarouselVisible(!carouselVisible);
                        }}
                        className="footer__sponsors-text"
                    >
                        ScottyLabs is sponsored by
                    </button>
                </span>
            </div>
            <div className={`footer__sponsors ${carouselVisible ? '' : 'footer__sponsors--hidden'}`}>
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
