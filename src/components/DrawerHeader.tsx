import { useContext } from 'react';
import { Clock, ExternalLink, MapPin, X } from 'lucide-react';
import { highlightColors } from '../constants/colors';
import { DrawerContext } from '../contexts/DrawerContext';
import css from './DrawerHeader.module.css';

function DrawerHeader() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    if (!location) return null;
    const { name, statusMsg, location: physicalLocation, url } = location;

    let relativeTime = 'Status unavailable';
    let absoluteTime = '';
    if (statusMsg) {
        const start = statusMsg.indexOf('(');
        const end = statusMsg.lastIndexOf(')');
        if (start >= 0 && end >= 0 && end > start) {
            relativeTime = statusMsg.slice(0, start).trim();
            absoluteTime = statusMsg.slice(start + 1, end).trim();
        } else {
            relativeTime = statusMsg;
        }
    }

    return (
        <div className={css['drawer-header-container']}>
            <div className={css.header}>
                <h3 className={css['drawer-loction-text']}>
                    <a className={css['location-link']} href={url} target="_blank" rel="noreferrer">
                        <span>{name}</span>
                        <ExternalLink size={18} aria-hidden />
                    </a>
                </h3>
                <button
                    type="button"
                    onClick={() => drawerContext.setIsDrawerActive(false)}
                    className={css['close-button']}
                    aria-label="Close location drawer"
                >
                    <X size={36} />
                </button>
            </div>

            <div className={css['status-container']}>
                <span
                    className={css['status-text']}
                    style={{ '--status-color': highlightColors[location?.locationState ?? 0] }}
                >
                    {relativeTime}
                </span>
                {absoluteTime && (
                    <span className={css['status-absolute-time']}>
                        <Clock size={16} />
                        {absoluteTime}
                    </span>
                )}
            </div>

            <div>
                <div className={css['location-text']}>
                    <MapPin size={16} />
                    <span>{physicalLocation}</span>
                </div>
            </div>
        </div>
    );
}

export default DrawerHeader;
