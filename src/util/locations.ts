import axios from 'axios';

import { DateTime } from 'luxon';

import {
	IAllLocationData,
	IExtendedLocationData,
	ILocationStatus,
	LocationState,
	MomentTimeSchema,
	TimeSchema,
} from '../types/locationTypes';
import assert from './assert';

const BASE_URL = 'https://dining.apis.scottylabs.org/locations';
const WEEKDAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];
const WEEK_MINUTES = 7 * 24 * 60;

/**
 * Convert a string to title case
 * @param {string} str string to convert to title case
 * @returns the same string, but in title case
 */
function toTitleCase(str: string) {
	return str
		.trim()
		.toLowerCase()
		.split(' ')
		.map((word) => {
			if (word.length > 1) {
				return word[0].toUpperCase() + word.slice(1);
			}
			return word;
		})
		.join(' ');
}

/**
 * Convert an API time entry to minutes
 * @param {int} days The number of days since Sunday (0 if Sunday)
 * @param {int} hours The number of hours (0-23) since midnight (0 if midnight)
 * @param {int} minutes The number of minutes since the start of the hour (0-59)
 * @returns the number of minutes since the start of the week
 */

/**
 *
 * @param day Sunday is day 0 (accepts 0-6) as values
 * @param hour 0-23
 * @param minute 0-59
 * @returns Raw minutes since Sun 12am
 */
function minutesSinceSunday(day: number, hour: number, minute: number) {
	assert(
		day >= 0 &&
			day < 7 &&
			hour >= 0 &&
			hour < 24 &&
			minute >= 0 &&
			minute < 60,
	);
	return day * 60 * 24 + hour * 60 + minute;
}
function minutesSinceSundayDateTime(now: DateTime) {
	return minutesSinceSunday(now.weekday % 7, now.hour, now.minute);
}
function minutesSinceSundayTimeData(timeData: MomentTimeSchema) {
	assert(
		timeData.day >= 0 &&
			timeData.day < 7 &&
			timeData.hour >= 0 &&
			timeData.hour < 24 &&
			timeData.minute >= 0 &&
			timeData.minute < 60,
		'Invalid time date!',
	);
	return minutesSinceSunday(timeData.day, timeData.hour, timeData.minute);
}

/**
 * Determine if a given time slot is open, i.e. encompasses the current time
 * @param {int} start The time the location opens (in minutes since midnight on Sunday)
 * @param {int} end The time slot the location closes (in minutes since midnight on Sunday)
 * @returns true if the location is open, false otherwise
 */
function currentlyOpen(timeSlot: TimeSchema, now: DateTime) {
	const start = minutesSinceSundayTimeData(timeSlot.start);
	const nowMinutes = minutesSinceSundayDateTime(now);
	let end = minutesSinceSundayTimeData(timeSlot.end);
	if (end < start) end += WEEK_MINUTES;
	return start <= nowMinutes && nowMinutes <= end;
}

/**
 * Gets the next available time slot for a given location
 * @param {TimeSchema[]} times List of time slots for a location
 * @returns The next time slot when the location opens (if currently open, then take that slot)
 */
function getNextTimeSlot(times: TimeSchema[], now: DateTime) {
	if (times.length === 0) return null;
	const nowMinutes = minutesSinceSundayDateTime(now);
	// Find the first time slot that opens after now
	const nextTimeSlot = times.find(
		(time) =>
			currentlyOpen(time, now) ||
			minutesSinceSundayTimeData(time.start) >= nowMinutes,
	);

	if (nextTimeSlot === undefined) {
		// End of the week. Return the first time slot instead.
		return times[0];
	}
	return nextTimeSlot;
}
/**
 *
 * @param timeSlot
 * @param now Whatever time you want to start from
 * @returns time to get from now to timeSlot (always positive)
 */
function getMinuteDiff(timeSlot: MomentTimeSchema, now: DateTime) {
	const diff =
		(minutesSinceSundayTimeData(timeSlot) -
			minutesSinceSundayDateTime(now) +
			WEEK_MINUTES) %
		WEEK_MINUTES;
	assert(diff >= 0);
	return diff;
}

/**
 * Return the status message for a dining location, given the current or next available
 * time slot, and whether or not the location is currently open
 * @param isOpen
 * @param refTime Time data entry of next closing/opening time
 * @returns {string} The status message for the location
 */
function getStatusMessage(
	isOpen: boolean,
	refTime: MomentTimeSchema,
	now: DateTime,
): string {
	const diff = getMinuteDiff(refTime, now);

	const diffMinutes = diff % 60;
	const diffHours = Math.floor((diff / 60) % 24);
	const diffHoursForMoreThanADay = Math.floor(diff / 60);
	const weekdayDiff = (refTime.day - now.weekday + 7) % 7;

	// Create time string
	const { hour, minute } = refTime;
	const hour12H = hour % 12 === 0 ? 12 : hour % 12;
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const minutePadded = minute < 10 ? `0${minute}` : minute;
	const time = `${hour12H}:${minutePadded} ${ampm}`;

	const action = isOpen ? 'Closes' : 'Opens';
	const day = WEEKDAYS[refTime.day];
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
	} else {
		if (location.isOpen)
			return location.changesSoon
				? LocationState.CLOSES_SOON
				: LocationState.OPEN;

		return location.changesSoon
			? LocationState.OPENS_SOON
			: LocationState.CLOSED;
	}
}
export function getLocationStatus(
	timeSlots: TimeSchema[],
	now: DateTime,
): ILocationStatus {
	const nextTimeSlot = getNextTimeSlot(timeSlots, now);
	if (nextTimeSlot === null)
		return {
			statusMsg: 'Closed until further notice',
			closedLongTerm: true,
		};
	const openNow = currentlyOpen(nextTimeSlot, now);
	const relevantTime = openNow ? nextTimeSlot.end : nextTimeSlot.start; // when will the next closing/opening event happen?
	const diff = getMinuteDiff(relevantTime, now);
	return {
		isOpen: openNow,
		statusMsg: getStatusMessage(openNow, relevantTime, now),
		timeUntil: diff,
		closedLongTerm: false,
		changesSoon: diff <= 60,
	};
}
async function queryLocations() {
	try {
		// Query locations
		const { data } = await axios.get(BASE_URL);
		if (!data) {
			return [];
		}

		// Convert names to title case
		const { locations }: { locations: IAllLocationData } = data;
		const updatedLocations: IAllLocationData = locations.map((location) => {
			let updatedName = toTitleCase(location.name ?? 'Untitled');

			if (updatedName === "Ruge Atrium - Rothberg's Roasters Ii") {
				updatedName = "Ruge Atrium - Rothberg's Roasters II";
			}
			return {
				...location,
				name: updatedName,
			};
		});

		return updatedLocations;
	} catch (err) {
		console.error(err);
		return [];
	}
}

export default queryLocations;
