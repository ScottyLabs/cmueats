import { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'monitor';

const responsive = {
    monitor: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const getDeviceType = (width: number): DeviceType => {
    if (width >= 3000) return 'monitor';
    if (width >= 1024) return 'desktop';
    if (width >= 464) return 'tablet';
    return 'mobile';
};

const SponsorCarousel = () => {
    const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

    useEffect(() => {
        const updateDeviceType = () => {
            setDeviceType(getDeviceType(window.innerWidth));
        };

        updateDeviceType();
        window.addEventListener('resize', updateDeviceType);

        return () => window.removeEventListener('resize', updateDeviceType);
    }, []);

    const logos = [
        { src: './src/assets/logos/accenture-logo-darkmode.png', alt: 'Accenture Logo' },
        { src: './src/assets/logos/agentuity-logo.png', alt: 'Agentuity Logo' },
        { src: './src/assets/logos/balyasny-logo-darkmode.png', alt: 'Balyasny Logo' },
        { src: './src/assets/logos/citadel-logo.png', alt: 'Citadel Logo' },
        { src: './src/assets/logos/coderabbit-logo-darkmode.png', alt: 'CodeRabbit Logo' },
        { src: './src/assets/logos/commvault-logo-darkmode.png', alt: 'Commvault Logo' },
        { src: './src/assets/logos/deshaw-logo.png', alt: 'D.E. Shaw Logo' },
        { src: './src/assets/logos/fly-io-logo.png', alt: 'Fly.io Logo' },
        { src: './src/assets/logos/hrt-logo.png', alt: 'HRT Logo' },
        { src: './src/assets/logos/jane-street-logo-darkmode.png', alt: 'Jane Street Logo' },
        { src: './src/assets/logos/modal-logo.png', alt: 'Modal Logo' },
        { src: './src/assets/logos/optiver-logo-darkmode.png', alt: 'Optiver Logo' },
        { src: './src/assets/logos/sandia-logo-darkmode.png', alt: 'Sandia Logo' },
        { src: './src/assets/logos/scale-logo-color.png', alt: 'Scale AI Logo' },
    ];

    return (
        <Carousel
            responsive={responsive}
            deviceType={deviceType}
            swipeable={false}
            draggable={false}
            showDots={true}
            ssr={true} // renders carousel on server-side
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            {logos.map((logo, index) => (
                <div key={index}>
                    <img src={logo.src} alt={logo.alt} />
                </div>
            ))}
        </Carousel>
    );
};

export default SponsorCarousel;
