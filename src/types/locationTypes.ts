/* eslint-disable @typescript-eslint/naming-convention */

import { CardViewPreference } from '../util/storage';

/** Note that everything being exported here is readonly */

export type RecursiveReadonly<T> = T extends object
    ? {
          readonly [P in keyof T]: RecursiveReadonly<T[P]>;
      }
    : T;

/**
 * Start and end are both inclusive in
 * denoting when a location is open. so [2AM today, 4AM today]
 * includes both 2AM and 4AM. So, [2AM Tue,2AM Tue] is inferred to be open at exactly 2AM.
 * Something like [2AM Tue, 1AM Tue] means open from 2AM Tue
 * this week to 1AM Tue next week (notation: [start,end]), although it seems that the
 * API returns a wrapped around time iff the location closes at midnight on Saturday
 * (ex. dining website says "SATURDAY: 11:00 AM - 12:00 AM" which gets parsed to
 * [Sat 10AM, Sun 12AM] = [day:6,hour:10 -> day:0, hour: 0]) (recall that Sunday has a day-value
 * of 0 while Saturday has a day value of 6, so this is a wrap around) Any other time
 * would be constrained to that day and possibly 12AM on the day after.
 */
export interface ITimeRange {
    readonly start: number;
    readonly end: number;
}

/**
 * We expect this to be sorted (by start time). bounds are inclusive and non-overlapping.
 */
export type ITimeRangeList = ITimeRange[];

interface ISpecial {
    name: string;
    description: string;
}

// Ordered by priority - affects how tiles are displayed in the grid (first to last)
export enum LocationState {
    OPEN,
    CLOSES_SOON,
    OPENS_SOON,
    CLOSED,
    CLOSED_LONG_TERM,
}

export interface ILocation_FromAPI {
    /** unique identifier for this location */
    id: string;
    name: string;
    ratingsAvg: number | null;
    shortDescription: string | null;
    description: string;
    url: string;
    /** Menu link */
    menu: string | null;
    location: string;
    coordinateLat: number | null;
    coordinateLng: number | null;
    acceptsOnlineOrders: boolean;
    times: ITimeRange[];
    todaysSpecials: ISpecial[];
    todaysSoups: ISpecial[];
    /** The id provided on the dining services website */
    conceptId: string | null;
}
export interface IStatusMessage {
    shortStatus: [string, string];
    longStatus: string;
}
// All of the following are extended from the base API type

// 'closedLongTerm' here refers to closed for the next 7 days (no timeslots available)
interface ILocation_TimeStatusData_Base {
    /** No forseeable opening times after *now* */
    closedLongTerm: boolean;
    statusMsg: IStatusMessage;
    locationState: LocationState;
}
interface ILocation_TimeStateData_NotPermanentlyClosed extends ILocation_TimeStatusData_Base {
    closedLongTerm: false;
    isOpen: boolean;
    minutesUntil: number;
    changesSoon: boolean;
    locationState: Exclude<LocationState, LocationState.CLOSED_LONG_TERM>;
}
interface ILocation_TimeStatusData_PermanentlyClosed extends ILocation_TimeStatusData_Base {
    closedLongTerm: true;
    locationState: LocationState.CLOSED_LONG_TERM;
}

export type ILocation_TimeStatusData =
    | ILocation_TimeStateData_NotPermanentlyClosed
    | ILocation_TimeStatusData_PermanentlyClosed;

/** Extra data derived from a single location */
export type ILocation_ExtraData = ILocation_TimeStatusData & {
    cardViewPreference: CardViewPreference;
};

/** we'll typically pass this into components for efficient look-up of extra data (like time until close) */
export type ILocation_ExtraData_Map = {
    [id: number]: ILocation_ExtraData;
};

/** once we combine extraDataMap with our base api data */
export type ILocation_Full = ILocation_FromAPI & ILocation_ExtraData;
