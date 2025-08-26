import { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './SponsorCarousel.css';

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'monitor';

const responsive = {
    monitor: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
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

function SponsorCarousel() {
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
        { src: './logos/accenturelogo.svg', alt: 'Accenture logo' },
        { src: './logos/agentuity.svg', alt: 'Agentuity logo' },
        { src: './logos/Balyasny_Logo_White.svg', alt: 'Balyasny logo' },
        { src: './logos/Citadel_LLC_Logo.svg', alt: 'Citadel LLC logo' },
        { src: './logos/Coderabbit_dark_6440dcbc3a.svg', alt: 'Coderabbit logo' },
        { src: './logos/commvault.svg', alt: 'Commvault logo' },
        { src: './logos/deshawlogo.svg', alt: 'DE Shaw logo' },
        { src: './logos/flyiologo.svg', alt: 'Fly.io logo' },
        { src: './logos/hrt.svg', alt: 'Hudson River Trading logo' },
        { src: './logos/jane.svg', alt: 'Jane Street logo' },
        { src: './logos/modallogo.svg', alt: 'Modal logo' },
        { src: './logos/optiverlogo.svg', alt: 'Optiver logo' },
        { src: './logos/sandia.svg', alt: 'Sandia National Laboratories logo' },
        { src: './logos/ScaleAIlogo.svg', alt: 'Scale AI logo' },
    ];

    return (
        <Carousel
            responsive={responsive}
            deviceType={deviceType}
            swipeable={false}
            draggable={false}
            showDots
            ssr // renders carousel on server-side
            infinite
            autoPlay
            autoPlaySpeed={2000}
            keyBoardControl
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            {logos.map((logo) => (
                <div key={logo.alt}>
                    <img src={logo.src} alt={logo.alt} className="carousel__image" />
                </div>
            ))}
        </Carousel>
    );
}

export default SponsorCarousel;
