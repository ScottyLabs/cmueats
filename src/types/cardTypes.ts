export enum CardStatus {
    PINNED,
    NORMAL,
    HIDDEN,
}

export type CardStateMap = Record<string, CardStatus>;
