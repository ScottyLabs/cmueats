import { useEffect, useRef, useState } from 'react';
import z from 'zod';
import { DateTime } from 'luxon';
import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';
import { $api } from '../api';
import { getLocationStatus } from './queryLocations';
import { ILocation_FromAPI, ILocation_Full } from '../types/locationTypes';

const stringToJSONSchema = z.string().transform((str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
});

const OldCardViewPreferences = stringToJSONSchema.pipe(z.array(z.string()).catch([]));
const CardViewPreferences = stringToJSONSchema.pipe(
    z.record(z.string(), z.enum(['pinned', 'normal', 'hidden'])).catch({}),
);

export type OldCardViewPreferencesType = z.infer<typeof OldCardViewPreferences>;
export type CardViewPreferencesType = z.infer<typeof CardViewPreferences>;
export type CardViewPreference = CardViewPreferencesType[string];

function upgradeToCardStateMapFromOldFormat(oldPreferences: OldCardViewPreferencesType): CardViewPreferencesType {
    return Object.fromEntries(oldPreferences.map((id) => [id, 'pinned']));
}
export function useUserCardViewPreferences() {
    const { data: locationData } = $api.useQuery('get', '/v2/locations');
    const [preferences, setPreferences] = useState(() => getPreferences());
    const migrationCompleted = useRef(false);
    useEffect(() => {
        if (locationData?.length && !migrationCompleted.current) {
            const migratedPreferences = Object.fromEntries(
                Object.entries(preferences).map(([id, preference]) => {
                    if (id.length <= 4) {
                        // this was a concept id
                        const replacementId = locationData.find((loc) => loc.conceptId === id)?.id;
                        return [replacementId ?? id, preference]; // use id as fallback if location is missing
                    }
                    return [id, preference];
                }),
            );
            setPreferences(migratedPreferences);
            safeSetItem('eateryStates', JSON.stringify(migratedPreferences));
            migrationCompleted.current = true;
        }
    }, [locationData, preferences]);
    return [
        preferences,
        (newPreferences: CardViewPreferencesType) => {
            setPreferences(newPreferences);
            safeSetItem('eateryStates', JSON.stringify(newPreferences));
        },
    ] as const;
}
/**
 * `pinnedEateries` stored a list of conceptIds that were pinned. it
 * has since been deprecated in favor of `eateryStates`, which
 * stores an object of id -> state ("pinned","normal","hidden") mappings
 */
export function getPreferences() {
    const oldPreferences = safeGetItem('pinnedEateries');

    if (oldPreferences !== null) {
        const newPreferences = upgradeToCardStateMapFromOldFormat(OldCardViewPreferences.parse(oldPreferences));
        safeRemoveItem('pinnedEateries');
        safeSetItem('eateryStates', JSON.stringify(newPreferences));
        return newPreferences;
    }
    return CardViewPreferences.parse(safeGetItem('eateryStates') ?? '{}');
}

export function getLocatationFull(
    locations: ILocation_FromAPI[] | undefined,
    cardViewPreferences: CardViewPreferencesType,
    now: DateTime,
) {
    if (!locations) return undefined;
    return locations.map((location) => ({
        ...location,
        ...getLocationStatus(location.times, now),
        cardViewPreference:
            cardViewPreferences[location.id] ?? cardViewPreferences[location.conceptId ?? ''] ?? 'normal',
        averageRating: 0,
    })) as ILocation_Full[];
}


// export async function getLocationRating(locationId: string): Promise<ILocation_RatingData> {
//     try {
//         const response = await fetchClient.GET('/v2/locations/{locationId}/reviews/summary', {
//             params: { path: { locationId } },
//         });

//         const avg = response.data?.starData?.avg ?? 0;

//         return {
//             averageRating: avg,
//         };
//     } catch {
//         return {
//             averageRating: 0,
//         };
//     }
// }

// export function useFullLocationData(
//     locations: ILocation_FromAPI[] | undefined,
//     cardViewPreferences: CardViewPreferencesType,
//     now: DateTime,
// ) {
//     const [fullLocationData, setFullLocationData] = useState<ILocation_Full[]>();
//     const fetched = useRef(false);

//     useEffect(() => {
//         if (!locations) return;
//         if (fetched.current) return;
//         fetched.current = true;

//         const base = getLocatationFull(locations, cardViewPreferences, now);
//         if(!base) return;
        
//         setFullLocationData(base);

//         (async () => {
//             const ratingResults = await Promise.all(
//                 base.map((loc) => getLocationRating(loc.id))
//             );

//             const updated = base.map((loc, idx) => ({
//                 ...loc,
//                 ...ratingResults[idx],
//             }));
            
//             console.log(updated);
//             setFullLocationData(updated);
//         })();
//     }, [locations]); /** Wait for locations to be available */

//     return fullLocationData;
// }
