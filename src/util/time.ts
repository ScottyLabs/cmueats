/** Pure utility functions that process location (restaurant) timeslots
 */

import { DateTime } from 'luxon';
import { ITimeSlotTime, ITimeSlot, ITimeSlots } from '../types/locationTypes';

import assert from './assert';
import bounded from './misc';

const WEEK_MINUTES = 7 * 24 * 60;

/**
 * @param day The number of days since Sunday (0 if Sunday)
 * @param hour The number of hours (0-23) since midnight (0 if midnight)
 * @param minute The number of minutes since the start of the hour (0-59)
 * @returns Raw minutes since Sun 12am
 */
export function minutesSinceSunday(day: number, hour: number, minute: number) {
	assert(
		bounded(day, 0, 7) && bounded(hour, 0, 24) && bounded(minute, 0, 60),
		'Invalid minutesSinceSunday input!',
	);
	return day * 60 * 24 + hour * 60 + minute;
}
export function minutesSinceSundayDateTime(now: DateTime) {
	return minutesSinceSunday(now.weekday % 7, now.hour, now.minute);
}

/**
 *
 * @param timeSlotTime
 * @returns Whether or not the timeslot has valid/expected values (all property values must be integers)
 */
export function isTimeSlotTime(timeSlotTime: ITimeSlotTime) {
	const { day, hour, minute } = timeSlotTime;
	return (
		Number.isInteger(day) &&
		Number.isInteger(minute) &&
		Number.isInteger(hour) &&
		bounded(day, 0, 7) &&
		bounded(hour, 0, 24) &&
		bounded(minute, 0, 60)
	);
}

export function minutesSinceSundayTimeSlotTime(timeSlot: ITimeSlotTime) {
	assert(isTimeSlotTime(timeSlot));
	return minutesSinceSunday(timeSlot.day, timeSlot.hour, timeSlot.minute);
}
/**
 *
 * @param timeSlot
 * @param allowWrapAround if true, ending time can be <= start time (aka we've gone to the next week), but doesn't have to be
 * @returns true/false
 */
export function isTimeSlot(timeSlot: ITimeSlot, allowWrapAround?: boolean) {
	return (
		isTimeSlotTime(timeSlot.start) &&
		isTimeSlotTime(timeSlot.end) &&
		(allowWrapAround ||
			minutesSinceSundayTimeSlotTime(timeSlot.start) <=
				minutesSinceSundayTimeSlotTime(timeSlot.end))
	);
}

/**
 *
 * @param minutes >=0
 * @returns ("1 day", "32 minutes", "3 hours", etc.)
 */
export function getApproximateTimeStringFromMinutes(minutes: number) {
	assert(minutes >= 0, 'Minutes must be positive!');

	const pluralTag = (strings: TemplateStringsArray, amt: number) =>
		`${strings[0]}${amt}${strings[1]}${amt === 1 ? '' : 's'}`;

	let diff = minutes;
	const minuteCount = diff % 60;
	const hourCondition = Math.floor(diff / 60) > 23 || diff / 60 < 1;
	diff = hourCondition ? Math.floor(diff / 60) : Math.round(diff / 60);
	const hourCount = diff % 24;
	const dayCondition = diff / 24 > 1;
	diff = dayCondition ? Math.round(diff / 24) : Math.floor(diff / 24);
	const dayCount = diff;
	if (dayCount !== 0) return pluralTag`${dayCount} day`;
	if (hourCount !== 0) return pluralTag`${hourCount} hour`;
	return pluralTag`${minuteCount} minute`;
}

/**
 * Converts an ITimeSlotTime to a human-readable string (12-hour time)
 * @param time
 * @returns HH:MM (AM/PM)
 */
export function getTimeString(time: ITimeSlotTime) {
	assert(isTimeSlotTime(time));
	const { hour, minute } = time;
	const hour12H = hour % 12 === 0 ? 12 : hour % 12;
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const minutePadded = minute < 10 ? `0${minute}` : minute;
	return `${hour12H}:${minutePadded} ${ampm}`;
}

/**
 * Converts an ITimeSlotTime to a human-readable string (12-hour time)
 * @param time
 * @returns HH:MM (AM/PM)
 */
export function getTimeSlotString(time: ITimeSlot) {
	assert(isTimeSlot(time));
	const start = getTimeString(time.start);
	const end = getTimeString(time.end);
	return `${start} - ${end}`;
}

/**
 *
 * @param timeSlots
 * @returns Checks if timeslots are non-overlapping (so [a,b],[b,c] is invalid) and properly sorted.
 * (This assumes that the start time of the next slot isn't "jumping forwards" to a new week until
 * possibly timeSlots[-1].end (i.e. time is monotonically increasing as it should))
 * Time slots ordered this way are ambiguous, since Monday will always appear before Tuesday and
 * if the location opens this Tuesday and only next Monday, we wouldn't know. This type of representation
 * is good only if most location opening times operate in weekly predictable cycles, but we shouldn't
 * rely on that assumption. Oh well. It's legacy code, am I right?
 */
export function isValidTimeSlotArray(timeSlots: ITimeSlots) {
	for (let i = 0; i < timeSlots.length; i += 1) {
		const allowWrapAround = i === timeSlots.length - 1;
		if (!isTimeSlot(timeSlots[i], allowWrapAround)) return false;
		if (i > 0) {
			const { start } = timeSlots[i];
			const prevEnd = timeSlots[i - 1].end;
			if (
				minutesSinceSundayTimeSlotTime(prevEnd) >=
				minutesSinceSundayTimeSlotTime(start)
			)
				return false;
		}
	}
	return true;
}

/**
 * Converts an ITimeSlotTime to a human-readable string (12-hour time)
 * @param times
 * @returns HH:MM (AM/PM) Array
 */

export function getTimeSlotsString(times: ITimeSlots) {
	assert(isValidTimeSlotArray(times));
	let index = 0;
	const listByDate = [];
	assert(index !== 1);
	for (let date = 0 ; date < 7 ; date += 1) {
		let concattedString = '';
		for (let i = index;i < times.length && date === times[i].start.day;i += 1) {
			assert(i < times.length);
			// times[i].start.day;
			// assert(!isTimeSlot(times[0]));
			concattedString = concattedString.concat(getTimeSlotString(times[i]));
			concattedString = concattedString.concat(',');
			index += 1;
		}
		if (concattedString.length === 0) {
			concattedString = 'CLOSED';
		} else {
			concattedString = concattedString.substring(0 ,concattedString.length - 1);
		}
		listByDate.push(concattedString);
	}
	return listByDate;
}

/**
 *
 * @param timeSlotTime
 * @param now Whatever time you want to start from
 * @returns (smallest non-negative) time in minutes to get from now to timeSlot
 */
export function diffInMinutes(timeSlotTime: ITimeSlotTime, now: DateTime) {
	assert(isTimeSlotTime(timeSlotTime));
	const diff =
		(minutesSinceSundayTimeSlotTime(timeSlotTime) -
			minutesSinceSundayDateTime(now) +
			WEEK_MINUTES) %
		WEEK_MINUTES;
	assert(diff >= 0);
	return diff;
}

/**
 * Determine if a given time slot is open, i.e. encompasses the current time
 * @param timeSlot Specific timeslot for location (allowed to wrap around) (end can be less than start)
 * @param now "Current" time
 * @returns true if the location is open, false otherwise
 */
export function currentlyOpen(timeSlot: ITimeSlot, now: DateTime) {
	assert(isTimeSlot(timeSlot, true));
	const start = minutesSinceSundayTimeSlotTime(timeSlot.start);
	const nowMinutes = minutesSinceSundayDateTime(now);
	const end = minutesSinceSundayTimeSlotTime(timeSlot.end);
	if (end < start) {
		return start <= nowMinutes || nowMinutes <= end; // we're more flexible with the bounds because time is wrapping around
	}
	return start <= nowMinutes && nowMinutes <= end;
}

/**
 * Gets the next available time slot for a given location
 * @param {ITimeSlots} times List of time slots for a location
 * @returns The next time slot when the location opens (if currently open,
 * then it returns that slot). If there are no available slots, it returns null
 */
export function getNextTimeSlot(times: ITimeSlots, now: DateTime) {
	assert(isValidTimeSlotArray(times));
	if (times.length === 0) return null;
	const nowMinutes = minutesSinceSundayDateTime(now);
	// Find the first time slot that opens after now
	const nextTimeSlot = times.find(
		(time) =>
			currentlyOpen(time, now) ||
			minutesSinceSundayTimeSlotTime(time.start) > nowMinutes,
	);

	if (nextTimeSlot === undefined) {
		// End of the week. Return the first time slot instead.
		return times[0];
	}
	return nextTimeSlot;
}
