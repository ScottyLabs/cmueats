import { Pin, MapPin } from 'lucide-react';
import { ILocation_Full } from '../types/locationTypes';
import css from './EateryCardContent.module.css';

function EateryCardContent({ location }: { location: ILocation_Full }) {
    const { location: physicalLocation, name, cardViewPreference } = location;
    const isPinned = cardViewPreference === 'pinned';

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']} style={isPinned ? { color: 'var(--yellow-300)' } : {}}>
                {isPinned && <Pin size={16} />}
                <span>{name}</span>
            </h3>

            <div className={css['lower-bar']}>
                <span className={css['physical-location-text']}>
                    <MapPin size={12} />
                    {physicalLocation}
                </span>

                <div className={css.rating}>{location.ratingsAvg}</div>
            </div>
        </div>
    );
}

export default EateryCardContent;
