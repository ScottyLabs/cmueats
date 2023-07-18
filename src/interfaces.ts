interface TextProps {
	variant: 'subtitle1';
	changesSoon: boolean;
	children: React.ReactNode;
}

interface Location {
	name: string;
	location: string;
	url: string;
	shortDescription: string;
	menu: string;
	todaysSpecials: string[];
	isOpen: boolean;
	statusMsg: string;
	conceptId: number;
	todaysSoups: string[];
	changesSoon: boolean;
	closedTemporarily: boolean;
	timeUntilOpen: number;
	timeUntilClosed: number;
}

interface TimeSlot {
	start: {
		rawMinutes: number;
	};
	end: {
		rawMinutes: number;
	};
}

export type { TextProps, Location, TimeSlot };
