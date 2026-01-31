import { Pin, MapPin } from 'lucide-react';
import { ILocation_Full } from '../types/locationTypes';
import css from './EateryCardContent.module.css';
import { useIsMobileContext } from '../contexts/IsMobileContext';

function EateryCardContent({ location, partOfMainGrid }: { location: ILocation_Full; partOfMainGrid: boolean }) {
    const { location: physicalLocation, name, cardViewPreference } = location;
    const isMobile = useIsMobileContext();
    const isPinned = cardViewPreference === 'pinned';

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']} style={isPinned ? { color: 'var(--yellow-300)' } : {}}>
                {isPinned && <Pin size={16} />}
                <span>{name}</span>
            </h3>

            <span className={css['physical-location-text']}>
                <MapPin size={isMobile ? 12 : 13} />
                {physicalLocation}
            </span>

            {partOfMainGrid && !isMobile && (
                <div className={css['action-bar']}>
                    <div className={css.rating}>rating placeholder</div>
                </div>
            )}
        </div>
    );
}

export default EateryCardContent;
