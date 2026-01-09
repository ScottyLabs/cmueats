import { Pin, MapPin } from 'lucide-react';
import { ILocation_Full } from '../types/locationTypes';
import css from './EateryCardContent.module.css';

function EateryCardContent({ location, partOfMainGrid }: { location: ILocation_Full; partOfMainGrid: boolean }) {
    const { location: physicalLocation, name, cardViewPreference } = location;

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']}>
                {cardViewPreference === 'pinned' && <Pin size={16} />}
                {name}
            </h3>

            <span className={css['physical-location-text']}>
                <MapPin size={12} />
                {physicalLocation}
            </span>

            {partOfMainGrid && (
                <div className={css['action-bar']}>
                    <div className={css.rating}>rating placeholder</div>
                </div>
            )}
        </div>
    );
}

export default EateryCardContent;
