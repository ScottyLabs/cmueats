import { useContext } from 'react';
import { ExternalLink, MapPin, X } from 'lucide-react';
import { highlightColors } from '../constants/colors';
import { DrawerContext } from '../contexts/DrawerContext';
import css from './DrawerHeader.module.css';

function DrawerHeader() {
    const isMobile = window.innerWidth <= 600;
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    if (!location) return null;
    const { name, statusMsg, location: physicalLocation, url } = location;

    return (
        <div className={css['drawer-header-container']}>
            {!isMobile && <div className={css.header__status} style={{ '--status-color': highlightColors[location.locationState] }}>
                {statusMsg}
            </div>}
            <div className={css.header__title}>
                <h3 className={css.title__text}>
                    <a className={css['location-link']} href={url} target="_blank" rel="noreferrer">
                        <span>{name}</span>
                        <ExternalLink size={22} strokeWidth={3} aria-hidden />
                    </a>
                </h3>
                {!isMobile && <button
                    type="button"
                    onClick={() => drawerContext.setIsDrawerActive(false)}
                    className={css['title__close-button']}
                    aria-label="Close location drawer"
                >
                    <X size={36} />
                </button>}
            </div>

            {isMobile && <div className={css.header__status} style={{ '--status-color': highlightColors[location.locationState] }}>
                {statusMsg}
            </div>}
            <div className={css.header__location}>
                <MapPin size={16} />
                <span>{physicalLocation}</span>
            </div>
        </div>
    );
}

export default DrawerHeader;
