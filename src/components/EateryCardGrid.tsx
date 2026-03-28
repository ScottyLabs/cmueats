import { useState } from 'react';
import { Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import EateryCard from './EateryCard';
import EateryCardSkeleton from './EateryCardSkeleton';
import NoResultsError from './NoResultsError';
import { ILocation_Full, IMikuCardData, LocationState } from '../types/locationTypes';
import css from './EateryCardGrid.module.css';
import { SelectSort } from './SelectSort';

import DropdownArrow from '../assets/control_buttons/dropdown_arrow.svg?react';
import { CardViewPreference } from '../util/storage';
import mikuSongs from '../data/mikuSongs';
import MikuCard from './MikuCard';
import { useThemeContext } from '../ThemeProvider';
import assert from '../util/assert';

const compareLocationsByTime = (location1: ILocation_Full, location2: ILocation_Full) => {
    const state1 = location1.locationState;
    const state2 = location2.locationState;

    if (state1 !== state2) return state1 - state2;

    // this if statement is janky but otherwise TS won't
    // realize that the timeUntil property exists on both l1 and l2
    if (location1.closedLongTerm || location2.closedLongTerm) {
        assert(location1.closedLongTerm && location2.closedLongTerm);
        return location1.name.localeCompare(location2.name);
    }
    if (state1 === LocationState.OPEN || state1 === LocationState.CLOSES_SOON) {
        return location2.minutesUntil - location1.minutesUntil;
    }
    return location1.minutesUntil - location2.minutesUntil;
};


const compareLocationsByRating = (l1: ILocation_Full, l2: ILocation_Full, type: SelectSort) => {
    // kind of confusing but asc means lowest to highest and desc means highest to lowest  

    const o1 = l1.locationState === LocationState.OPEN || l1.locationState === LocationState.CLOSES_SOON;
    const o2 = l2.locationState === LocationState.OPEN || l2.locationState === LocationState.CLOSES_SOON;       
    
    const state1 = l1.locationState;    
    const state2 = l2.locationState;

    if (o1 !== o2 && (type === 'stars-desc-open')) return state1 - state2; // keep same sorting by open/closed status as the default time sorting
    if (!o1 && !o2) return compareLocationsByTime(l1, l2); // if both are closed, sort by closed time like normal

    const r1 = l1.averageRating ?? null;
    const r2 = l2.averageRating ?? null;

    if (r1 === null && r2 === null) return compareLocationsByTime(l1, l2);
    if (r1 === null) return 1;
    if (r2 === null) return -1;

    if (r1 === r2) return compareLocationsByTime(l1, l2);

    return (type === 'stars-asc') ? r1 - r2 : r2 - r1;
};

export default function EateryCardGrid({
    locations,
    setSearchQuery,
    shouldAnimateCards,
    apiError,
    updateCardViewPreference,
    sortOption,
}: {
    /** locations should already be filtered and sorted - this component is just responsible for rendering the content as-is */
    locations: ILocation_Full[] | undefined;
    setSearchQuery: React.Dispatch<string>;
    /** whether or not to animate card fade in transition on mount. this is set to false when the user performs a search */
    shouldAnimateCards: boolean;
    apiError: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
    sortOption: SelectSort;
}) {
    const [showHiddenSection, setShowHiddenSection] = useState(false);
    const { theme } = useThemeContext();
    if (apiError)
        return (
            <p className={css['locations__error-text']}>
                Oops! We received an invalid API response (or no data at all). If this problem persists, please visit
                GrubHub or{' '}
                <a href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/" target="_blank" rel="noreferrer">
                    https://apps.studentaffairs.cmu.edu/dining/conceptinfo/
                </a>{' '}
                for now
            </p>
        );
    if (locations === undefined) {
        // Display skeleton cards while loading
        return (
            <div className={css.supergrid__grid}>
                {Array(36)
                    .fill(null)
                    .map((_, index) => (
                        <EateryCardSkeleton
                            // we can make an exception here since this array won't change
                            key={index} // eslint-disable-line react/no-array-index-key
                            index={index}
                        />
                    ))}
            </div>
        );
    }

    if (locations.length === 0) return <NoResultsError onClear={() => setSearchQuery('')} />;

    const sortedLocations = [...locations].sort((location1, location2) => {
        if (sortOption !== 'time') return compareLocationsByRating(location1, location2, sortOption);
        return compareLocationsByTime(location1, location2);
    }); // we make a copy to avoid mutating the original array

    function locationToCard(data: ILocation_Full | IMikuCardData) {
        if (data.id === undefined) {
            // janky type discrimination
            return <MikuCard songData={data} key={data.songUrl} animate={shouldAnimateCards} />;
        }
        return (
            <EateryCard
                location={data}
                key={data.id}
                animate={shouldAnimateCards}
                partOfMainGrid
                updateViewPreference={(newPreference: CardViewPreference) => {
                    updateCardViewPreference(data.id, newPreference);
                }}
            />
        );
    }
    const pinnedLocations = sortedLocations.filter((location) => location.cardViewPreference === 'pinned');
    const normalLocations = sortedLocations.filter((location) => location.cardViewPreference === 'normal');
    const hiddenLocations = sortedLocations.filter((location) => location.cardViewPreference === 'hidden');
    const mainCards = [...pinnedLocations, ...normalLocations];
    const mainCardsWithMikuSongs: (ILocation_Full | IMikuCardData)[] = [];
    if (theme === 'miku') {
        mainCardsWithMikuSongs.push(...mainCards.splice(0, 1));
        for (let i = 0; i < Math.min(7, mikuSongs.length); i++) {
            mainCardsWithMikuSongs.push(mikuSongs[i]!);
            mainCardsWithMikuSongs.push(...mainCards.splice(0, 5));
        }
    }
    mainCardsWithMikuSongs.push(...mainCards); // rest

    return (
        <div className={css.supergrid}>
            <div className={css['supergrid__help-text']}>
                <div>
                    <Info size={16} aria-hidden="true" />
                    <span>
                        {theme === 'miku' ? (
                            <>
                                See the full Miku playlist{' '}
                                <a
                                    target="_blank"
                                    href="https://open.spotify.com/playlist/3SMANeNbyWci6ZveHBZMK2?si=edeb9eb3c83747ba"
                                    rel="noreferrer"
                                >
                                    here!
                                </a>
                            </>
                        ) : (
                            'Tap or click on the cards for more information!'
                        )}
                    </span>
                </div>
            </div>
            <div className={css.supergrid__section}>
                <div className={css.supergrid__grid}>
                    <AnimatePresence mode="popLayout">{mainCardsWithMikuSongs.map(locationToCard)}</AnimatePresence>
                </div>
            </div>

            {hiddenLocations.length > 0 && (
                <div className={css.supergrid__section}>
                    <button
                        type="button"
                        className={css['hidden-section__toggle']}
                        aria-expanded={showHiddenSection}
                        onClick={() => {
                            setShowHiddenSection(!showHiddenSection);
                        }}
                    >
                        <DropdownArrow height={8} />
                        <span>
                            {showHiddenSection ? 'Hide' : 'Show'} hidden locations ({hiddenLocations.length})
                        </span>
                    </button>

                    <motion.div
                        className={css['hidden-grid-container']}
                        initial={{
                            height: showHiddenSection ? 'auto' : 0,
                            opacity: showHiddenSection ? 1 : 0,
                            pointerEvents: showHiddenSection ? 'all' : 'none',
                        }}
                        animate={{
                            height: showHiddenSection ? 'auto' : 0,
                            opacity: showHiddenSection ? 1 : 0,
                            pointerEvents: showHiddenSection ? 'all' : 'none',
                        }}
                        transition={{ ease: [0.25, 0.8, 0.25, 1], duration: 0.6 }}
                        aria-hidden={!showHiddenSection}
                    >
                        <div className={clsx(css.supergrid__grid, css['hidden-grid'])}>
                            <AnimatePresence mode="popLayout">{hiddenLocations.map(locationToCard)}</AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
