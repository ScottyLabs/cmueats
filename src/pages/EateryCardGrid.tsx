import { Grid } from '@mui/material';
import EateryCard from '../components/EateryCard';
import EateryCardSkeleton from '../components/EateryCardSkeleton';
import NoResultsError from '../components/NoResultsError';
import {
    IReadOnlyLocation_FromAPI_PostProcessed,
    IReadOnlyLocation_ExtraData_Map,
    LocationState,
    IReadOnlyLocation_Combined,
} from '../types/locationTypes';
import assert from '../util/assert';

export default function EateryCardGrid({
    locations,
    extraLocationData,
    setSearchQuery,
    shouldAnimateCards,
    apiError,
    pinnedIds,
    updatePinnedIds,
}: {
    locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
    extraLocationData: IReadOnlyLocation_ExtraData_Map | undefined;
    setSearchQuery: React.Dispatch<string>;
    shouldAnimateCards: boolean;
    apiError: boolean;
    pinnedIds: Record<string, true>;
    updatePinnedIds: (newPinnedIds: Record<string, true>) => void;
}) {
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

    return (
        <Grid container spacing={2}>
            {locations
                .map((location) => ({
                    ...location,
                    ...extraLocationData[location.conceptId], // add on our extra data here
                }))
                .sort((location1, location2) => {
                    const id1 = location1.conceptId.toString();
                    const id2 = location2.conceptId.toString();

                    const isPinned1 = id1 in pinnedIds;
                    const isPinned2 = id2 in pinnedIds;

                    if (isPinned1 && isPinned2) {
                        return compareLocations(location1, location2);
                    }
                    if (isPinned1) return -1;
                    if (isPinned2) return 1;

                    return compareLocations(location1, location2);
                })
                .map((location, i) => (
                    <EateryCard
                        location={location}
                        key={location.conceptId}
                        index={i}
                        animate={shouldAnimateCards}
                        partOfMainGrid
                        isPinned={location.conceptId.toString() in pinnedIds}
                        onTogglePin={() => {
                            const id = location.conceptId.toString();
                            const newPinnedIds = { ...pinnedIds };
                            if (newPinnedIds[id]) {
                                delete newPinnedIds[id];
                            } else {
                                newPinnedIds[id] = true;
                            }
                            updatePinnedIds(newPinnedIds);
                        }}
                    />
                ))}
        </Grid>
    );
}
