enum DayOfTheWeek {
	SUNDAY = 0,
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
}

interface MomentTimeSchema {
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

export interface ILocation {
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
