enum DayOfTheWeek {
	SUNDAY = 0,
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
}

export interface MomentTimeSchema {
	day: DayOfTheWeek;
	hour: number;
	minute: number;
}

export interface TimeSchema {
	start: MomentTimeSchema;
	end: MomentTimeSchema;
}
interface Coordinate {
	lat: number;
	lng: number;
}

interface SpecialSchema {
	title: string;
	description?: string;
}

/**
 * Raw type directly from API
 */
export interface ILocationAPI {
	conceptId: number;
	name?: string;
	shortDescription?: string;
	description: string;
	url: string;
	menu?: string;
	location: string;
	coordinates?: Coordinate;
	acceptsOnlineOrders: boolean;
	times: TimeSchema[];
	todaysSpecials?: SpecialSchema[];
	todaysSoups?: SpecialSchema[];
}
export interface ILocation extends ILocationAPI {
	name: string; // This field is now guaranteed to be defined
}

// 'Closed' here refers to closed for the near future (no timeslots available)
interface ILocationStatusBase {
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

export type IAllLocationData = ILocation[];
export type ILocationStatus = ILocationStatusOpen | ILocationStatusClosed;
export type IExtendedLocationData =
	| IExtendedLocationOpen
	| IExtendedLocationClosed;

// Sorted by priority (high to low)
export enum LocationState {
	OPEN,
	CLOSES_SOON,
	OPENS_SOON,
	CLOSED,
	CLOSED_LONG_TERM,
}
