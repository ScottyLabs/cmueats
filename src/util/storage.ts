import { useEffect, useRef, useState } from 'react';
import z from 'zod';
import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';
import { $api } from '../api';

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
    const { data: locationData } = $api.useQuery('get', '/api/v2/locations');
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
    }, [locationData]);
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
