/** Pure utility functions that process location (restaurant) timeslots
 */

import { DateTime } from 'luxon';
import { ITimeSlotTime, ITimeSlot } from '../types/locationTypes';

import assert from './assert';

const WEEK_MINUTES = 7 * 24 * 60;

/**
 * @returns true iff n (int) is in [a,b)
 */
function bounded(n: number, a: number, b: number) {
	assert(a <= b);
	return n >= a && n < b;
}
/**
 *
 * @param timeSlotTime
 * @returns Whether or not the timeslot has valid/expected values
 */
export function isTimeSlotTime(timeSlotTime: ITimeSlotTime) {
	const { day, hour, minute } = timeSlotTime;
	return bounded(day, 0, 7) && bounded(hour, 0, 24) && bounded(minute, 0, 60);
}
export function isTimeSlot(timeSlot: ITimeSlot) {
	// Note that we don't check if end is >= start because the closing time could indeed wrap around and be less than the start time (ex. Sat->Sun)
	return isTimeSlotTime(timeSlot.start) && isTimeSlotTime(timeSlot.end);
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
	const m = diff % 60;
	diff = Math.floor(diff / 60);
	const h = diff % 24;
	diff = Math.floor(diff / 24);
	const d = diff;
	if (d !== 0) return pluralTag`${d} day`;
	if (h !== 0) return pluralTag`${h} hour`;
	return pluralTag`${m} minute`;
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
export function minutesSinceSundayTimeSlotTime(timeData: ITimeSlotTime) {
	assert(isTimeSlotTime(timeData), 'Invalid time!');
	return minutesSinceSunday(timeData.day, timeData.hour, timeData.minute);
}

/**
 *
 * @param timeSlots
 * @returns Checks if timeslots are non-overlapping and properly sorted.
 * (This assumes that the start time of the next slot isn't "jumping forwards" to a new week until
 * possibly timeSlots[-1].end (i.e. time is monotonically increasing as it should))
 */
export function isValidTimeSlotArray(timeSlots: ITimeSlot[]) {
	for (let i = 0; i < timeSlots.length; i += 1) {
		if (!isTimeSlot(timeSlots[i])) return false;
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
 * @param timeSlot Specific timeslot for location
 * @param now "Current" time
 * @returns true if the location is open, false otherwise
 */
export function currentlyOpen(timeSlot: ITimeSlot, now: DateTime) {
	assert(isTimeSlot(timeSlot));
	const start = minutesSinceSundayTimeSlotTime(timeSlot.start);
	const nowMinutes = minutesSinceSundayDateTime(now);
	let end = minutesSinceSundayTimeSlotTime(timeSlot.end);
	if (end < start) end += WEEK_MINUTES;
	return start <= nowMinutes && nowMinutes <= end;
}

/**
 * Gets the next available time slot for a given location
 * @param {ITimeSlot[]} times List of time slots for a location
 * @returns The next time slot when the location opens (if currently open,
 * then it returns that slot). If there are no available slots, it returns null
 */
export function getNextTimeSlot(times: ITimeSlot[], now: DateTime) {
	isValidTimeSlotArray(times);
	if (times.length === 0) return null;
	const nowMinutes = minutesSinceSundayDateTime(now);
	// Find the first time slot that opens after now
	const nextTimeSlot = times.find(
		(time) =>
			currentlyOpen(time, now) ||
			minutesSinceSundayTimeSlotTime(time.start) >= nowMinutes,
	);

	if (nextTimeSlot === undefined) {
		// End of the week. Return the first time slot instead.
		return times[0];
	}
	return nextTimeSlot;
}
