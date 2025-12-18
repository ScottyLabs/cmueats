import { MapPin } from 'lucide-react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import css from './EateryCardContent.module.css';

function EateryCardContent({
    location,
    partOfMainGrid,
}: {
    location: IReadOnlyLocation_Combined;
    partOfMainGrid: boolean;
}) {
    const { location: physicalLocation, name } = location;

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']}>{name}</h3>

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
