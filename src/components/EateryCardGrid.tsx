import { useState } from 'react';
import { Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import EateryCard from './EateryCard';
import EateryCardSkeleton from './EateryCardSkeleton';
import NoResultsError from './NoResultsError';
import { ILocation_Full, IMikuCardData } from '../types/locationTypes';
import css from './EateryCardGrid.module.css';

import DropdownArrow from '../assets/control_buttons/dropdown_arrow.svg?react';
import { CardViewPreference } from '../util/storage';
import mikuSongs from '../data/mikuSongs';
import MikuCard from './MikuCard';
import { useThemeContext } from '../ThemeProvider';

export default function EateryCardGrid({
    locations,
    setSearchQuery,
    shouldAnimateCards,
    apiError,
    updateCardViewPreference,
}: {
    /** locations should already be filtered and sorted - this component is just responsible for rendering the content as-is */
    locations: ILocation_Full[] | undefined;
    setSearchQuery: React.Dispatch<string>;
    /** whether or not to animate card fade in transition on mount. this is set to false when the user performs a search */
    shouldAnimateCards: boolean;
    apiError: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
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
    const pinnedLocations = locations.filter((location) => location.cardViewPreference === 'pinned');
    const normalLocations = locations.filter((location) => location.cardViewPreference === 'normal');
    const hiddenLocations = locations.filter((location) => location.cardViewPreference === 'hidden');
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
