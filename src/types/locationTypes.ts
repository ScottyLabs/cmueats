/** Note that everything being exported here is readonly */

export type RecursiveReadonly<T> = T extends object
	? {
			readonly [P in keyof T]: RecursiveReadonly<T[P]>;
		}
	: T;

/**
 * Describes either start or end time in any given ITimeSlot
 */
export interface ITimeSlotTime {
	/** 0-6 (0 is Sunday, 6 is Saturday) */
	readonly day: number;
	/** 0-23 - 0 means 12AM */
	readonly hour: number;
	/** 0-59 */
	readonly minute: number;
}

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
export interface ITimeSlot {
	readonly start: ITimeSlotTime;
	readonly end: ITimeSlotTime;
}

/**
 * We expect this to be sorted (by start time), non-overlapping,
 * and not wrapping (aka end time found in minutesFromSunday is less than
 * start time) except for possibly the last entry
 */
export type ITimeSlots = ReadonlyArray<ITimeSlot>;

interface ISpecial {
	title: string;
	description?: string;
}

// Ordered by priority - affects how tiles are displayed in the grid (first to last)
export enum LocationState {
	OPEN,
	CLOSES_SOON,
	OPENS_SOON,
	CLOSED,
	CLOSED_LONG_TERM,
}

/**
 * Raw type directly from API - types below extend this
 * (note: if you're updating this, you should
 * update the Joi Schema in joiLocationTypes.ts as well)
 */
interface IAPILocation_PreProcessed {
	conceptId: number;
	name?: string;
	shortDescription?: string;
	description: string;
	url: string;
	/** Menu link */
	menu?: string;
	location: string;
	coordinates?: {
		lat: number;
		lng: number;
	};
	acceptsOnlineOrders: boolean;
	times: ITimeSlot[];
	todaysSpecials?: ISpecial[];
	todaysSoups?: ISpecial[];
}
interface IAPILocation_PostProcessed extends IAPILocation_PreProcessed {
	name: string; // This field is now guaranteed to be defined
}
// All of the following are extended from the base API type

// ILocationStatus* represents the data added on to IAPILocation
// 'Closed' here refers to closed for the near future (no timeslots available)
interface ILocationExtraData_Base {
	/** No forseeable opening times after *now* */
	closedLongTerm: boolean;
	statusMsg: string;
	locationState: LocationState;
}
interface ILocationExtraDataNotPermanentlyClosed
	extends ILocationExtraData_Base {
	closedLongTerm: false;
	isOpen: boolean;
	timeUntil: number;
	changesSoon: boolean;
	locationState: Exclude<LocationState, LocationState.CLOSED_LONG_TERM>;
}
interface ILocationExtraDataPermanentlyClosed extends ILocationExtraData_Base {
	closedLongTerm: true;
	locationState: LocationState.CLOSED_LONG_TERM;
}
type ILocationStatus =
	| ILocationExtraDataNotPermanentlyClosed
	| ILocationExtraDataPermanentlyClosed;

/** What we get directly from the API (single location data) */
export type IReadOnlyAPILocation_PreProcessed =
	RecursiveReadonly<IAPILocation_PreProcessed>;

export type IReadOnlyLocation_PostProcessed =
	RecursiveReadonly<IAPILocation_PostProcessed>;

export type IReadOnlyLocationExtraData = RecursiveReadonly<ILocationStatus>;

export type IReadOnlyLocationExtraDataMap = {
	[conceptId: number]: IReadOnlyLocationExtraData;
};

/** once we combine extraDataMap with our base api data */
export type IReadOnlyExtendedLocationData = IReadOnlyAPILocation_PreProcessed &
	IReadOnlyLocationExtraData;
