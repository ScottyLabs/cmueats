import { Pin, MapPin } from 'lucide-react';
import { ILocation_Full } from '../types/locationTypes';
import css from './EateryCardContent.module.css';
import EmptyStarIcon from '../assets/control_buttons/starEmpty.svg?react';
import FilledStarIcon from '../assets/control_buttons/starFilled.svg?react';

function SingleStarDisplay({ starRating }: { starRating: number | null }) {
    // remapping, since 20% looks like 0% and 80% looks like 100%
    const lerp = (x: number) => (x - 50) * Math.abs((x - 50) / 50) + 50;
    const fillPercent = lerp(starRating !== null ? (starRating / 5) * 100 : 0);

    return (
        <div className={css['star-container']}>
            <EmptyStarIcon className={css['empty-star']} />
            <FilledStarIcon className={css['filled-star']} style={{ '--star-cutoff': `${fillPercent}%` }} />
        </div>
    );
}

function EateryCardContent({ location }: { location: ILocation_Full }) {
    const { location: physicalLocation, name, cardViewPreference, ratingsAvg, ratingsCount } = location;
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

                <div className={css['rating-container']}>
                    <span className={css['rating-avg']}>{ratingsAvg?.toFixed(1) ?? '0.0'}</span>
                    <span className={css['rating-count']}>({ratingsCount ?? '0'})</span>
                    <SingleStarDisplay starRating={ratingsAvg} />
                </div>
            </div>
        </div>
    );
}

export default EateryCardContent;
