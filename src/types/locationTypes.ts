import Joi from 'joi';
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
 * update the Joi Schema below as well)
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
interface IAPIResponse {
	locations: ILocationAPI[];
}
const { string, number, boolean } = Joi.types();

const ITimeSlotTimeJoiSchema = Joi.object({
	day: number.min(0).max(6).required(),
	hour: number.min(0).max(23).required(),
	minute: number.min(0).max(59).required(),
});
const ITimeSlotJoiSchema = Joi.object({
	start: ITimeSlotTimeJoiSchema.required(),
	end: ITimeSlotTimeJoiSchema.required(),
});
const ISpecialJoiSchema = Joi.object({
	title: string.required(),
	description: string,
});

// Keys without .required() are optional by default
const ILocationApiJoiSchema = Joi.object({
	conceptId: number.required(),
	name: string,
	shortDescription: string,
	description: string.required(),
	url: string.required(),
	menu: string,
	location: string.required(),
	coordinates: {
		lat: number.required(),
		lng: number.required(),
	},
	acceptsOnlineOrders: boolean.required(),
	times: Joi.array().items(ITimeSlotJoiSchema).required(),
	todaysSpecials: Joi.array().items(ISpecialJoiSchema),
	todaysSoups: Joi.array().items(ISpecialJoiSchema),
});

export const IAPIResponseJoiSchema = Joi.object<IAPIResponse>({
	locations: Joi.array().items(ILocationApiJoiSchema).required(),
});
// All of the following are extended from the base API type

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
