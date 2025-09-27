import { CardStatus } from "../components/EateryCard";
import { LocationStateMap } from "../types/locationTypes";

export function getStateMap(): LocationStateMap {
    try {
        const arr = JSON.parse(localStorage.getItem('eateryStates') ?? '[]');
        // return new Map(arr.map(obj => [obj.key, obj.value]));
        return new Map<string, CardStatus>();
    } catch {
        return new Map<string, CardStatus>();
    }
}

export function setLocationStateMap(obj: LocationStateMap) {
    const arr = Object.fromEntries(obj);
    localStorage.setItem('pinnedEateries', JSON.stringify(arr));
}
