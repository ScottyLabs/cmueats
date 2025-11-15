import z from 'zod';

const stringToJSONSchema = z.string().transform((str, ctx): z.infer<ReturnType<any>> => {
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
export type OldCardViewPreferences = z.infer<typeof OldCardViewPreferences>;
export type CardViewPreferences = z.infer<typeof CardViewPreferences>;
export type CardViewPreference = CardViewPreferences[string];
function upgradeToCardStateMapFromOldFormat(oldPreferences: OldCardViewPreferences): CardViewPreferences {
    return Object.fromEntries(oldPreferences.map((id) => [id, 'pinned']));
}

export function getStateMap() {
    const oldPreferences = localStorage.getItem('pinnedEateries');
    console.log('called');

    if (oldPreferences !== null) {
        localStorage.removeItem('pinnedEateries');
        return upgradeToCardStateMapFromOldFormat(OldCardViewPreferences.parse(oldPreferences));
    }
    return CardViewPreferences.parse(localStorage.getItem('eateryStates') ?? '{}');
}

export function setStateMapInLocalStorage(obj: CardViewPreferences) {
    localStorage.setItem('eateryStates', JSON.stringify(obj));
}
