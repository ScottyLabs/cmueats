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
	/** 0-23 */
	readonly hour: number;
	/** 0-59 */
	readonly minute: number;
}

/**
 * As far as I can tell, start and end are both inclusive in
 * denoting when a location is open. so [2AM today ,4AM today]
 * includes both 2AM and 4AM. So, [2AM Tue,2AM Tue] is inferred to be open at exactly 2AM.
 * Something like [2AM Tue, 1AM Tue] means open from 2AM Tue
 * this week to 1AM Tue next week (notation: [start,end])
 */
export interface ITimeSlot {
	readonly start: ITimeSlotTime;
	readonly end: ITimeSlotTime;
}
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
interface IAPILocation {
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

// All of the following are extended from the base API type

// Base type
interface ILocation extends IAPILocation {
	name: string; // This field is now guaranteed to be defined
}

// 'Closed' here refers to closed for the near future (no timeslots available)
interface ILocationStatusBase {
	/** No forseeable opening times after *now* */
	closedLongTerm: boolean;
	statusMsg: string;
	locationState: LocationState;
}
interface ILocationStatusOpen extends ILocationStatusBase {
	isOpen: boolean;
	timeUntil: number;
	closedLongTerm: false;
	changesSoon: boolean;
	locationState: Exclude<LocationState, LocationState.CLOSED_LONG_TERM>;
}
interface ILocationStatusClosed extends ILocationStatusBase {
	closedLongTerm: true;
	locationState: LocationState.CLOSED_LONG_TERM;
}
interface IExtendedLocationOpen extends ILocation, ILocationStatusOpen {}
interface IExtendedLocationClosed extends ILocation, ILocationStatusClosed {}

type ILocationStatus = ILocationStatusOpen | ILocationStatusClosed;
type IExtendedLocation = IExtendedLocationOpen | IExtendedLocationClosed;

/** What we get directly from the API (single location data) */
export type IReadOnlyAPILocation = RecursiveReadonly<IAPILocation>;

/** Base data for single location */
export type IReadOnlyLocation = RecursiveReadonly<ILocation>;

/** Only extra status portion for location */
export type IReadOnlyLocationStatus = RecursiveReadonly<ILocationStatus>;

/** Combination of base ILocation type and ILocationStatus */
export type IReadOnlyExtendedLocation = RecursiveReadonly<IExtendedLocation>;
