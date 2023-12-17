/** Pure utility functions that process location (restaurant) timeslots
 */

import { DateTime } from 'luxon';
import { ITimeSlotTime, ITimeSlot } from '../types/locationTypes';
import assert from './assert';

const WEEK_MINUTES = 7 * 24 * 60;

/**
 * @param day The number of days since Sunday (0 if Sunday)
 * @param hour The number of hours (0-23) since midnight (0 if midnight)
 * @param minute The number of minutes since the start of the hour (0-59)
 * @returns Raw minutes since Sun 12am
 */
export function minutesSinceSunday(day: number, hour: number, minute: number) {
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
export function minutesSinceSundayDateTime(now: DateTime) {
	return minutesSinceSunday(now.weekday % 7, now.hour, now.minute);
}
export function minutesSinceSundayTimeData(timeData: ITimeSlotTime) {
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
 *
 * @param timeSlot
 * @param now Whatever time you want to start from
 * @returns (smallest non-negative) time in minutes to get from now to timeSlot
 */
export function diffInMinutes(timeSlot: ITimeSlotTime, now: DateTime) {
	const diff =
		(minutesSinceSundayTimeData(timeSlot) -
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
	const start = minutesSinceSundayTimeData(timeSlot.start);
	const nowMinutes = minutesSinceSundayDateTime(now);
	let end = minutesSinceSundayTimeData(timeSlot.end);
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
