import './SponsorCarousel.css';

function SponsorCarousel({ darkMode }: { darkMode: Boolean }) {
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
                    <p className="footer__sponsors-text">ScottyLabs is sponsored by</p>
                </span>
            </div>
            <div className="footer__sponsors">
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
