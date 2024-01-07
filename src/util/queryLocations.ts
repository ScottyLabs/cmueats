import axios from 'axios';

import { DateTime } from 'luxon';

import {
	ILocationStatus,
	LocationState,
	ITimeSlotTime,
	ITimeSlot,
	ILocation,
} from '../types/locationTypes';
import {
	diffInMinutes,
	currentlyOpen,
	getNextTimeSlot,
	isTimeSlotTime,
	isValidTimeSlotArray,
	getTimeString,
	minutesSinceSundayTimeSlotTime,
	minutesSinceSundayDateTime,
	getApproximateTimeStringFromMinutes,
} from './time';
import toTitleCase from './string';
import assert from './assert';
import IAPIResponseJoiSchema from '../types/joiLocationTypes';

const WEEKDAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];
/**
 * Return the status message for a dining location, given the current or next available
 * time slot, and whether or not the location is currently open
 * @param isOpen
 * @param nextTime Time data entry of next closing/opening time
 * @returns {string} The status message for the location
 */
export function getStatusMessage(
	isOpen: boolean,
	nextTime: ITimeSlotTime,
	now: DateTime,
): string {
	assert(isTimeSlotTime(nextTime));
	const diff = diffInMinutes(nextTime, now);

	const weekdayDiff = (nextTime.day - now.weekday + 7) % 7;

	const time = getTimeString(nextTime);

	const action = isOpen ? 'Closes' : 'Opens';
	let day = WEEKDAYS[nextTime.day];

	// It's not a wrap-around time like now is Tue 2AM while nextTime is Tue 1AM
	if (
		minutesSinceSundayTimeSlotTime(nextTime) >=
		minutesSinceSundayDateTime(now)
	) {
		if (weekdayDiff === 1) {
			day = 'tomorrow';
		} else if (weekdayDiff === 0) {
			day = 'today';
		}
	}
	const relTimeDiff = getApproximateTimeStringFromMinutes(diff);
	if (relTimeDiff === '0 minutes') {
		return `${action} now (${day} at ${time})`;
	}
	return `${action} in ${relTimeDiff} (${day} at ${time})`;
}

export function getLocationStatus(
	timeSlots: ITimeSlot[],
	now: DateTime,
): ILocationStatus {
	assert(
		isValidTimeSlotArray(timeSlots),
		`${JSON.stringify(timeSlots)} is invalid!`,
	);
	const nextTimeSlot = getNextTimeSlot(timeSlots, now);
	if (nextTimeSlot === null)
		return {
			statusMsg: 'Closed until further notice',
			closedLongTerm: true,
			locationState: LocationState.CLOSED_LONG_TERM,
		};
	const isOpen = currentlyOpen(nextTimeSlot, now);
	const relevantTime = isOpen ? nextTimeSlot.end : nextTimeSlot.start; // when will the next closing/opening event happen?
	const timeUntil = diffInMinutes(relevantTime, now);
	const statusMsg = getStatusMessage(isOpen, relevantTime, now);
	const changesSoon = timeUntil <= 60;
	// (imo I think this is readable)
	// eslint-disable-next-line no-nested-ternary
	const locationState = isOpen
		? changesSoon
			? LocationState.CLOSES_SOON
			: LocationState.OPEN
		: changesSoon
			? LocationState.OPENS_SOON
			: LocationState.CLOSED;
	return {
		closedLongTerm: false,
		isOpen,
		statusMsg,
		timeUntil,
		changesSoon,
		locationState,
	};
}
export async function queryLocations(
	cmuEatsAPIUrl: string,
): Promise<ILocation[]> {
	try {
		// Query locations
		const { data } = await axios.get(cmuEatsAPIUrl);
		if (!data) {
			return [];
		}
		const { locations } = await IAPIResponseJoiSchema.validateAsync(data);
		return locations.map((location) => ({
			...location,
			name: toTitleCase(location.name ?? 'Untitled'), // Convert names to title case
		}));
	} catch (err) {
		console.error(err);
		return [];
	}
}
