import { Grid } from '@mui/material';
import { useState } from 'react';
import EateryCard from '../components/EateryCard';
import EateryCardSkeleton from '../components/EateryCardSkeleton';
import NoResultsError from '../components/NoResultsError';
import { LocationState, IReadOnlyLocation_Combined } from '../types/locationTypes';
import assert from '../util/assert';

import css from './EateryCardGrid.module.css';

import dropdown_arrow from '../assets/control_button/dropdown_arrow.svg';
import { CardViewPreference } from '../util/storage';

const compareLocations = (location1: IReadOnlyLocation_Combined, location2: IReadOnlyLocation_Combined) => {
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
        return location2.timeUntil - location1.timeUntil;
    }
    return location1.timeUntil - location2.timeUntil;
};

export default function EateryCardGrid({
    locations,
    setSearchQuery,
    shouldAnimateCards,
    apiError,
    updateCardViewPreference,
}: {
    locations: IReadOnlyLocation_Combined[] | undefined;
    setSearchQuery: React.Dispatch<string>;
    shouldAnimateCards: boolean;
    apiError: boolean;
    updateCardViewPreference: (id: string, newStatus: CardViewPreference) => void;
}) {
    const [showHiddenSection, setShowHiddenSection] = useState(false);

    if (locations === undefined) {
        // Display skeleton cards while loading
        return (
            <Grid container spacing={2}>
                {Array(36)
                    .fill(null)
                    .map((_, index) => (
                        <EateryCardSkeleton
                            // we can make an exception here since this array won't change
                            key={index} // eslint-disable-line react/no-array-index-key
                            index={index}
                        />
                    ))}
            </Grid>
        );
    }

    if (apiError)
        return (
            <p className="locations__error-text">
                Oops! We received an invalid API response (or no data at all). If this problem persists, please visit
                GrubHub or{' '}
                <a href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/" target="_blank" rel="noreferrer">
                    https://apps.studentaffairs.cmu.edu/dining/conceptinfo/
                </a>{' '}
                for now
            </p>
        );

    if (locations.length === 0) return <NoResultsError onClear={() => setSearchQuery('')} />;

    const sortedLocations = [...locations].sort(compareLocations); // we make a copy to avoid mutating the original array

    function locationToCard(location: IReadOnlyLocation_Combined, i: number) {
        return (
            <EateryCard
                location={location}
                key={location.conceptId}
                index={i}
                animate={shouldAnimateCards}
                partOfMainGrid
                updateStatus={(newPreference: CardViewPreference) => {
                    updateCardViewPreference(location.conceptId.toString(), newPreference);
                }}
            />
        );
    }

    const hiddenLocations = sortedLocations.filter((location) => location.cardViewPreference === 'hidden');

    return (
        <div className={css.supergrid}>
            <Grid container spacing={2}>
                {[
                    ...sortedLocations.filter((location) => location.cardViewPreference === 'pinned'),
                    ...sortedLocations.filter((location) => location.cardViewPreference === 'normal'),
                ].map(locationToCard)}
            </Grid>

            {hiddenLocations.length > 0 && (
                <div className={css.section}>
                    <button
                        className={`${css['dropdown-button']} ${showHiddenSection && css['dropdown-button--up']}`}
                        onClick={() => {
                            setShowHiddenSection(!showHiddenSection);
                        }}
                        type="button"
                    >
                        <img src={dropdown_arrow} height={8} alt="Dropdown arrow" />
                        <p>{showHiddenSection ? 'Hide' : 'Show'} hidden locations</p>
                    </button>
                    {showHiddenSection && (
                        <Grid container spacing={2}>
                            {sortedLocations
                                .filter((location) => location.cardViewPreference === 'hidden')
                                .map(locationToCard)}
                        </Grid>
                    )}
                </div>
            )}
        </div>
    );
}
