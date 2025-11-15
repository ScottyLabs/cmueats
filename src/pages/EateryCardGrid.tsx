import { Grid } from '@mui/material';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import EateryCard, { CardStateMap, CardStatus } from '../components/EateryCard';
import EateryCardSkeleton from '../components/EateryCardSkeleton';
import NoResultsError from '../components/NoResultsError';
import {
    IReadOnlyLocation_FromAPI_PostProcessed,
    IReadOnlyLocation_ExtraData_Map,
    LocationState,
    IReadOnlyLocation_Combined,
} from '../types/locationTypes';
import assert from '../util/assert';

import css from './EateryCardGrid.module.css';

import dropdown_arrow from '../assets/control_button/dropdown_arrow.svg';

export default function EateryCardGrid({
    locations,
    extraLocationData,
    setSearchQuery,
    shouldAnimateCards,
    apiError,
    stateMap,
    updateStateMap: updatePinnedIds,
}: {
    locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
    extraLocationData: IReadOnlyLocation_ExtraData_Map | undefined;
    setSearchQuery: React.Dispatch<string>;
    shouldAnimateCards: boolean;
    apiError: boolean;
    stateMap: CardStateMap;
    updateStateMap: (newPinnedIds: CardStateMap) => void;
}) {
    const [showHiddens, setShowHiddens] = useState(false);
    // const [showPinned, setShowPinned] = useState(true);

    if (locations === undefined || extraLocationData === undefined) {
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

    const sortedLocations = locations
        .map((location) => ({
            ...location,
            ...extraLocationData[location.conceptId], // add on our extra data here
        }))
        .sort((location1, location2) => {
            const state1 = stateMap[location1.conceptId.toString()] ?? CardStatus.NORMAL;
            const state2 = stateMap[location2.conceptId.toString()] ?? CardStatus.NORMAL;

            const delta = state1 - state2;

            if (delta !== 0) return delta;

            return compareLocations(location1, location2);
        });

    function locationToCard(location: IReadOnlyLocation_Combined, i: number) {
        return (
            <EateryCard
                location={location}
                key={location.conceptId}
                animate={shouldAnimateCards}
                partOfMainGrid
                currentStatus={stateMap[location.conceptId.toString()] ?? CardStatus.NORMAL}
                updateStatus={(newStatus: CardStatus) => {
                    const id = location.conceptId.toString();

                    // TODO: investigate clone performance
                    const clone = { ...stateMap };
                    clone[id] = newStatus;
                    updatePinnedIds(clone);
                }}
            />
        );
    }

    const hiddenLocations = sortedLocations.filter(
        (location) => (stateMap[location.conceptId.toString()] ?? CardStatus.NORMAL) === CardStatus.HIDDEN,
    );

    return (
        <div className={css.supergrid}>
            <Grid container spacing={2}>
                <AnimatePresence>
                    {sortedLocations
                        .filter(
                            (location) =>
                                (stateMap[location.conceptId.toString()] ?? CardStatus.NORMAL) !== CardStatus.HIDDEN,
                        )
                        .map(locationToCard)}
                </AnimatePresence>
            </Grid>

            <div className={css.section}>
                {hiddenLocations.length > 0 && (
                    <button
                        className={`${css['dropdown-button']} ${showHiddens && css['dropdown-button--up']}`}
                        onClick={() => {
                            setShowHiddens(!showHiddens);
                        }}
                        type="button"
                    >
                        <img src={dropdown_arrow} height={8} alt="Dropdown arrow" />
                        <p>{showHiddens ? 'Hide' : 'Show'} hidden locations</p>
                    </button>
                )}

                {showHiddens && (
                    <Grid container spacing={2}>
                        <AnimatePresence>{hiddenLocations.map(locationToCard)}</AnimatePresence>
                    </Grid>
                )}
            </div>
        </div>
    );
}
