import { ExternalLink, MapPin, X } from 'lucide-react';
import { highlightColors } from '../constants/colors';
import css from './DrawerHeader.module.css';
import { useDrawerTabsContext } from '../contexts/DrawerTabsContext';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import { useIsMobileContext } from '../contexts/IsMobileContext';

function DrawerHeader() {
    const isMobile = useIsMobileContext();
    const { location } = useDrawerTabsContext();
    const { closeDrawer } = useDrawerAPIContext();
    const { name, location: physicalLocation, url } = location;

    const mobileCSS = isMobile ? '-mobile' : '';

    return (
        <div className={css[`drawer-header-container${mobileCSS}`]}>
            {!isMobile && (
                <button
                    type="button"
                    onClick={() => closeDrawer()}
                    className={css['header__close-button']}
                    aria-label="Close location drawer"
                >
                    <X size={36} />
                </button>
            )}
            <div
                className={css[`header__status${mobileCSS}`]}
                style={{ '--status-color': highlightColors[location.locationState] }}
            >
                {location.statusMsg.longStatus}
            </div>
            <div className={css[`header__title${mobileCSS}`]}>
                <h3 className={css.title__text}>
                    <a className={css['location-link']} href={url} target="_blank" rel="noreferrer">
                        <span>{name}</span>
                        <ExternalLink size={22} strokeWidth={3} aria-hidden />
                    </a>
                </h3>
            </div>
            <div className={css.header__location}>
                <MapPin size={16} />
                <span>{physicalLocation}</span>
            </div>
        </div>
    );
}

export default DrawerHeader;
