import { Pin, MapPin } from 'lucide-react';
import { DateTime, Interval } from 'luxon';
import { ILocation_Full } from '../types/locationTypes';
import css from './EateryCardContent.module.css';
import { useCurrentTime } from '../contexts/NowContext';

function EateryCardContent({ location, partOfMainGrid }: { location: ILocation_Full; partOfMainGrid: boolean }) {
    const { location: physicalLocation, name, cardViewPreference } = location;
    const isPinned = cardViewPreference === 'pinned';
    const now = useCurrentTime();
    const GALLO_CLOSING_DATE = DateTime.fromObject({ year: 2026, month: 5, day: 5 }, { zone: 'America/New_York' });
    const interval = Interval.fromDateTimes(now, GALLO_CLOSING_DATE);
    const isGallo = location.name.toLowerCase().includes('gallo');

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']} style={isPinned ? { color: 'var(--yellow-300)' } : {}}>
                {isPinned && <Pin size={16} />}
                <span>{name}</span>
            </h3>

            {isGallo && interval.isValid ? (
                <span className={`${css['physical-location-text']} ${css['physical-location-text--warn']}`}>
                    Permanently closing in {interval.count('day')} days
                </span>
            ) : (
                <span className={css['physical-location-text']}>
                    <MapPin size={14} />
                    <span>{physicalLocation}</span>
                </span>
            )}

            {partOfMainGrid && (
                <div className={css['action-bar']}>
                    <div className={css.rating}>rating placeholder</div>
                </div>
            )}
        </div>
    );
}

export default EateryCardContent;
