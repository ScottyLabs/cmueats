/**
 * Describes either start or end time in any given ITimeSlot
 */
export interface ITimeSlotTime {
	day: number; // 0-6
	hour: number; // 0-23
	minute: number; // 0-59
}

export interface ITimeSlot {
	start: ITimeSlotTime;
	end: ITimeSlotTime;
}
interface ISpecial {
	title: string;
	description?: string;
}

/**
 * Raw type directly from API - types below extend this
 * (note: if you're updating this, you should
 * update the Joi Schema in joiLocationTypes.ts as well)
 */
interface ILocationAPI {
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
export interface IAPIResponse {
	locations: ILocationAPI[];
}

// All of the following are extended from the base API type

// Base type for internal use
export interface ILocation extends ILocationAPI {
	name: string; // This field is now guaranteed to be defined
}

// 'Closed' here refers to closed for the near future (no timeslots available)
interface ILocationStatusBase {
	/** No forseeable opening times after *now* */
	closedLongTerm: boolean;
	statusMsg: string;
}
interface ILocationStatusOpen extends ILocationStatusBase {
	isOpen: boolean;
	timeUntil: number;
	closedLongTerm: false;
	changesSoon: boolean;
}
interface ILocationStatusClosed extends ILocationStatusBase {
	closedLongTerm: true;
}

interface IExtendedLocationOpen extends ILocation, ILocationStatusOpen {}
interface IExtendedLocationClosed extends ILocation, ILocationStatusClosed {}

export type ILocationStatus = ILocationStatusOpen | ILocationStatusClosed;
export type IExtendedLocationData =
	| IExtendedLocationOpen
	| IExtendedLocationClosed;

// Ordered by priority - affects how tiles are displayed in the grid (first to last)
export enum LocationState {
	OPEN,
	CLOSES_SOON,
	OPENS_SOON,
	CLOSED,
	CLOSED_LONG_TERM,
}
