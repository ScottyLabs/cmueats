import { Pin } from 'lucide-react';
import { DateTime, Interval } from 'luxon';
import { ILocation_Full } from '../types/locationTypes';
import css from './EateryCardContent.module.css';
import EmptyStarIcon from '../assets/control_buttons/starEmpty.svg?react';
import FilledStarIcon from '../assets/control_buttons/starFilled.svg?react';
import { useCurrentTime } from '../contexts/NowContext';

function SingleStarDisplay({ starRating }: { starRating: number | null }) {
    // remapping, since 20% looks like 0% and 80% looks like 100%
    const ease = (x: number) => (x - 50) * Math.abs((x - 50) / 50) + 50;
    const fillPercent = ease(starRating !== null ? (starRating / 5) * 100 : 0);

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
    const now = useCurrentTime();
    const GALLO_CLOSING_DATE = DateTime.fromObject({ year: 2026, month: 5, day: 5 }, { zone: 'America/New_York' });
    const interval = Interval.fromDateTimes(now, GALLO_CLOSING_DATE);
    const isGallo = location.name.toLowerCase().includes('gallo');
    const today = new Date();

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']} style={isPinned ? { color: 'var(--yellow-300)' } : {}}>
                {isPinned && <Pin size={16} />}
                <span
                    style={
                        (today.getMonth() === 3 && today.getDate() === 1) || true ? { color: 'var(--yellow-300)' } : {}
                    }
                >
                    {(today.getMonth() === 3 && today.getDate() === 1) || true ? 'El Gallo De Oro' : name}
                </span>
            </h3>

            <div className={css['lower-bar']}>
                {isGallo && interval.isValid ? (
                    <span className={`${css['physical-location-text']} ${css['physical-location-text--warn']}`}>
                        Perm. closing in {interval.count('day')} days
                    </span>
                ) : (
                    <span className={css['physical-location-text']}>
                        <span>{physicalLocation}</span>
                    </span>
                )}

                <div className={css['singlestar-rating-container']}>
                    <span
                        className={css['singlestar-rating-avg-text']}
                        style={ratingsAvg ? {} : { color: 'var(--black-500)' }}
                    >
                        {ratingsAvg?.toFixed(1) ?? '0.0'}
                    </span>
                    <SingleStarDisplay starRating={ratingsAvg} />
                    <span className={css['singlestar-rating-count']}>({ratingsCount ?? '0'})</span>
                </div>
            </div>
        </div>
    );
}

export default EateryCardContent;
