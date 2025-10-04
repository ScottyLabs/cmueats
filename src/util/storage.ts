import { CardStateMap, CardStatus } from '../components/EateryCard';

export function getStateMap(): CardStateMap {
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
