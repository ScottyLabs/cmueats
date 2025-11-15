import { useState } from 'react';
import z from 'zod';

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
    const [preferences, setPreferences] = useState(() => getPreferences());
    return [
        preferences,
        (newPreferences: CardViewPreferencesType) => {
            setPreferences(newPreferences);
            localStorage.setItem('eateryStates', JSON.stringify(newPreferences));
        },
    ] as const;
}
export function getPreferences() {
    const oldPreferences = localStorage.getItem('pinnedEateries');

    if (oldPreferences !== null) {
        localStorage.removeItem('pinnedEateries');
        localStorage.setItem(
            'eateryStates',
            JSON.stringify(upgradeToCardStateMapFromOldFormat(OldCardViewPreferences.parse(oldPreferences))),
        );
        return getPreferences();
    }
    return CardViewPreferences.parse(localStorage.getItem('eateryStates') ?? '{}');
}
