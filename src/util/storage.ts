import { CardStateMap, CardStatus } from '../components/EateryCard';

function upgradeToCardStateMapFromOldFormat(old: string): CardStateMap {
    const arr = JSON.parse(old);
    return Object.fromEntries((arr as string[]).map((id) => [id, CardStatus.PINNED]));
}

export function getStateMap(): CardStateMap {
    const old = localStorage.getItem("pinnedEateries")
    if (old !== null) {
        localStorage.removeItem("pinnedEateries")
        const ret = upgradeToCardStateMapFromOldFormat(old);
        return ret
    }

    try {
        const arr: CardStateMap = JSON.parse(localStorage.getItem('eateryStates') ?? '{}');
        // return new Map(arr.map(obj => [obj.key, obj.value]));
        // console.log(new Map(arr))
        return arr;
    } catch {
        return {};
    }

}

export function setLocationStateMap(obj: CardStateMap) {
    localStorage.setItem('eateryStates', JSON.stringify(obj));
}
