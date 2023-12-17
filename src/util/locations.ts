import axios from 'axios';

import { DateTime } from 'luxon';

import {
	IAllLocationData,
	IExtendedLocationData,
	ILocationStatus,
	LocationState,
	ITimeSlotTime,
	ITimeSlot,
} from '../types/locationTypes';
import {
	diffInMinutes,
	currentlyOpen,
	getNextTimeSlot,
	isTimeSlotTime,
	isValidTimeSlotArray,
} from './time';
import toTitleCase from './string';
import assert from './assert';

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
function getStatusMessage(
	isOpen: boolean,
	nextTime: ITimeSlotTime,
	now: DateTime,
): string {
	assert(isTimeSlotTime(nextTime));
	const diff = diffInMinutes(nextTime, now);

	const diffMinutes = diff % 60;
	const diffHours = Math.floor((diff / 60) % 24);
	const diffHoursForMoreThanADay = Math.floor(diff / 60);
	const weekdayDiff = (nextTime.day - now.weekday + 7) % 7;

	// Create time string
	const { hour, minute } = nextTime;
	const hour12H = hour % 12 === 0 ? 12 : hour % 12;
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const minutePadded = minute < 10 ? `0${minute}` : minute;
	const time = `${hour12H}:${minutePadded} ${ampm}`;

	const action = isOpen ? 'Closes' : 'Opens';
	const day = WEEKDAYS[nextTime.day];
	const hourLabel = diffHours === 1 ? 'hour' : 'hours';
	const minuteLabel = diffMinutes === 1 ? 'minute' : 'minutes';

	if (weekdayDiff > 1) {
		return `${action} in ${weekdayDiff} days (${day} at ${time})`;
	}

	if (weekdayDiff === 1) {
		if (diffHoursForMoreThanADay >= 24) {
			return `${action} in a day (tomorrow at ${time})`;
		}

		if (diffHours === 0) {
			return `${action} in ${diffMinutes} ${minuteLabel} (today at ${time})`;
		}

		return `${action} in ${diffHours} ${hourLabel} (tomorrow at ${time})`;
	}

	if (weekdayDiff === 0) {
		if (diffHours >= 1) {
			return `${action} in ${diffHours} ${hourLabel} (today at ${time})`;
		}

		return `${action} in ${diffMinutes} ${minuteLabel} (today at ${time})`;
	}

	// Default return statement
	return 'Status not available';
}
export function getLocationState(location: IExtendedLocationData) {
	if (location.closedLongTerm) {
		return LocationState.CLOSED_LONG_TERM;
	}
	if (location.isOpen)
		return location.changesSoon
			? LocationState.CLOSES_SOON
			: LocationState.OPEN;

	return location.changesSoon
		? LocationState.OPENS_SOON
		: LocationState.CLOSED;
}

export function getLocationStatus(
	timeSlots: ITimeSlot[],
	now: DateTime,
): ILocationStatus {
	assert(isValidTimeSlotArray(timeSlots));
	const nextTimeSlot = getNextTimeSlot(timeSlots, now);
	if (nextTimeSlot === null)
		return {
			statusMsg: 'Closed until further notice',
			closedLongTerm: true,
		};
	const openNow = currentlyOpen(nextTimeSlot, now);
	const relevantTime = openNow ? nextTimeSlot.end : nextTimeSlot.start; // when will the next closing/opening event happen?
	const diff = diffInMinutes(relevantTime, now);
	return {
		isOpen: openNow,
		statusMsg: getStatusMessage(openNow, relevantTime, now),
		timeUntil: diff,
		closedLongTerm: false,
		changesSoon: diff <= 60,
	};
}
async function queryLocations(
	cmuEatsAPIUrl: string,
): Promise<IAllLocationData> {
	try {
		// Query locations
		const { data } = await axios.get(cmuEatsAPIUrl);
		if (!data) {
			return [];
		}

		const { locations }: { locations: IAllLocationData } = data;
		return locations.map((location) => ({
			...location,
			name: toTitleCase(location.name ?? 'Untitled'), // Convert names to title case
		}));
	} catch (err) {
		console.error(err);
		return [];
	}
}

export default queryLocations;
