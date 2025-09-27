import { CardStateMap, CardStatus } from '../components/EateryCard';

export function getStateMap(): CardStateMap {
    try {
        const arr: Object = JSON.parse(localStorage.getItem('eateryStates') ?? '{}');
        // return new Map(arr.map(obj => [obj.key, obj.value]));
        // console.log(new Map(arr))
        return new Map(Object.entries(arr));
    } catch {
        return new Map<string, CardStatus>();
    }
}

export function setLocationStateMap(obj: CardStateMap) {
    const arr = Object.fromEntries(obj);
    localStorage.setItem('eateryStates', JSON.stringify(arr));
}
