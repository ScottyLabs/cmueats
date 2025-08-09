/** Pure utility functions that process location (restaurant, also called concept) timeslots
 */

import { DateTime } from 'luxon';
import { ITimeSlot, ITimeRange, ITimeRangeList } from '../types/locationTypes';

import assert from './assert';
import bounded from './misc';

const WEEK_MINUTES = 7 * 24 * 60;

/**
 * @param day The number of days since Sunday (0 if Sunday)
 * @param hour The number of hours (0-23) since midnight (0 if midnight)
 * @param minute The number of minutes since the start of the hour (0-59)
 * @returns Raw minutes since Sun 12am
 */
export function minutesSinceStartOfSunday(day: number, hour: number, minute: number) {
    assert(bounded(day, 0, 7) && bounded(hour, 0, 24) && bounded(minute, 0, 60), 'Invalid minutesSinceSunday input!');
    return day * 60 * 24 + hour * 60 + minute;
}
export function minutesSinceStartOfSundayDateTime(now: DateTime) {
    return minutesSinceStartOfSunday(now.weekday % 7, now.hour, now.minute);
}

export function minutesSinceStartOfSundayTimeSlot(timeSlot: ITimeSlot) {
    assert(isTimeSlot(timeSlot));
    return minutesSinceStartOfSunday(timeSlot.day, timeSlot.hour, timeSlot.minute);
}
/**
 *
 * @param timeSlotTime
 * @returns Whether or not the timeslot has valid/expected values (all property values must be integers)
 */
export function isTimeSlot(timeSlotTime: ITimeSlot) {
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
function isWrapAroundTimeSlot(timeSlot: ITimeRange) {
    return minutesSinceStartOfSundayTimeSlot(timeSlot.start) > minutesSinceStartOfSundayTimeSlot(timeSlot.end);
}
/**
 *
 * @param timeSlot
 * @param allowWrapAround if true, ending time can be < start time (aka we've gone to the next week), but doesn't have to be
 * @returns true/false
 */
export function isTimeRange(timeSlot: ITimeRange, allowWrapAround: boolean = false) {
    return (
        isTimeSlot(timeSlot.start) && isTimeSlot(timeSlot.end) && (!isWrapAroundTimeSlot(timeSlot) || allowWrapAround)
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
export function getTimeString(time: ITimeSlot) {
    assert(isTimeSlot(time));
    const { hour, minute } = time;
    const hour12H = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const minutePadded = minute < 10 ? `0${minute}` : minute;
    return `${hour12H}:${minutePadded} ${ampm}`;
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
export function isValidTimeSlotArray(timeSlots: ITimeRangeList) {
    for (let i = 0; i < timeSlots.length; i += 1) {
        const allowWrapAround = i === timeSlots.length - 1;
        if (!isTimeRange(timeSlots[i], allowWrapAround)) return false;
        if (i > 0) {
            const { start } = timeSlots[i];
            const prevEnd = timeSlots[i - 1].end;
            if (minutesSinceStartOfSundayTimeSlot(prevEnd) >= minutesSinceStartOfSundayTimeSlot(start)) return false;
        }
        if (i === timeSlots.length - 1 && isWrapAroundTimeSlot(timeSlots[i])) {
            // last time is a wrap-around time, need to check for overlap against first time
            if (
                minutesSinceStartOfSundayTimeSlot(timeSlots[i].end) >=
                minutesSinceStartOfSundayTimeSlot(timeSlots[0].start)
            )
                return false;
        }
    }
    return true;
}
/**
 *
 * @param timeSlot
 * @returns Duration of time slot in minutes. If end is before start, this represents the number of
 * minutes to get from the start time of this week to the end time of next week
 */
function durationOfTimeSlot(timeSlot: ITimeRange) {
    assert(isTimeRange(timeSlot, true));
    const MINUTES_IN_A_WEEK = 60 * 24 * 7;
    const startSecondsOffset = minutesSinceStartOfSundayTimeSlot(timeSlot.start);
    const endSecondsOffset = minutesSinceStartOfSundayTimeSlot(timeSlot.end);
    return (((endSecondsOffset - startSecondsOffset) % MINUTES_IN_A_WEEK) + MINUTES_IN_A_WEEK) % MINUTES_IN_A_WEEK;
}
function splitTimeSlotIfTooLong(timeSlot: ITimeRange) {
    const MINUTES_IN_A_DAY = 24 * 60;
    const brokenUpTimeSlots: ITimeRange[] = [];
    const curStart = { ...timeSlot.start };
    const curEnd = { ...timeSlot.end };
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // repeatedly shave off intervals (of less than 24 hours) included in timeSlot until we get through all of them
        // durationOfTimeSlot deals with wrapped times
        if (durationOfTimeSlot({ start: curStart, end: curEnd }) < MINUTES_IN_A_DAY) {
            // under 24 hours, can keep interval as-is (ex. 8PM - 2AM the next day)
            brokenUpTimeSlots.push({ start: { ...curStart }, end: { ...curEnd } });
            break;
        } else {
            // it's important that we make a copy of curStart since we'll be modifying curStart
            brokenUpTimeSlots.push({ start: { ...curStart }, end: { day: curStart.day, hour: 23, minute: 59 } });
            curStart.day = (curStart.day + 1) % 7;
            curStart.hour = 0;
            curStart.minute = 0;
        }
    }
    return brokenUpTimeSlots;
}
/**
 * Converts an ITimeSlot to a truncated human-readable string (12-hour time)
 * @param time
 * @returns HH:MM (AM/PM), or null if the time slot is degenerate
 */
export function getTimeSlotAsString(time: ITimeRange) {
    const MINUTES_IN_A_DAY = 24 * 60;

    assert(isTimeRange(time, true));

    assert(durationOfTimeSlot(time) < MINUTES_IN_A_DAY); // since we're stripping off day info, any time slot >= 24hrs in duration cannot be represented in this format
    const start = getTimeString(time.start);
    const end = getTimeString(time.end);
    if (start === end) return null; // this is a degenerate time slot (ex. 12:00 AM - 12:00 AM) (most likely generated by splitTimeSlotIfTooLong)
    // we can opt to keep the degenerate time slots in, but they offer no benefit to the end-user so might as well get rid of them /shrug
    const resultString = `${start} - ${end}`;
    return resultString === '12:00 AM - 11:59 PM' ? 'Open 24 hours' : resultString; // just some friendly human conversion
}
/**
 * Converts an sorted time slot array to an array of human-readable strings (12-hour time)
 * @param times
 * @returns HH:MM (AM/PM) Array
 */
export function getTimeSlotsString(times: ITimeRangeList) {
    assert(isValidTimeSlotArray(times));
    const brokenDownTimes = times
        .flatMap(splitTimeSlotIfTooLong)
        .sort((a, b) => minutesSinceStartOfSundayTimeSlot(a.start) - minutesSinceStartOfSundayTimeSlot(b.start)); // re-sort time slots

    assert(isValidTimeSlotArray(brokenDownTimes));

    const listByDate = [];
    for (let day = 0; day < 7; day += 1) {
        const concattedString =
            brokenDownTimes
                .filter((time) => time.start.day === day)
                .map(getTimeSlotAsString)
                .filter((str) => str !== null)
                .join(', ') || 'CLOSED';
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
export function diffInMinutes(timeSlotTime: ITimeSlot, now: DateTime) {
    assert(isTimeSlot(timeSlotTime));
    const diff =
        (minutesSinceStartOfSundayTimeSlot(timeSlotTime) - minutesSinceStartOfSundayDateTime(now) + WEEK_MINUTES) %
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
export function currentlyOpen(timeSlot: ITimeRange, now: DateTime) {
    assert(isTimeRange(timeSlot, true));
    const start = minutesSinceStartOfSundayTimeSlot(timeSlot.start);
    const end = minutesSinceStartOfSundayTimeSlot(timeSlot.end);
    const nowMinutes = minutesSinceStartOfSundayDateTime(now);
    if (end < start) {
        return start <= nowMinutes || nowMinutes <= end; // we're more flexible with the bounds because time is wrapping around
    }
    return start <= nowMinutes && nowMinutes <= end;
}

/**
 * Gets the next available time slot for a given location
 * @param {ITimeRangeList} times List of time ranges for a location
 * @returns The next time slot when the location opens (if currently open,
 * then it returns that slot). If there are no available slots, it returns null
 */
export function getNextTimeSlot(times: ITimeRangeList, now: DateTime) {
    assert(isValidTimeSlotArray(times));
    if (times.length === 0) return null;
    const nowMinutes = minutesSinceStartOfSundayDateTime(now);
    // Find the first time slot that opens after now
    const nextTimeSlot = times.find(
        (time) => currentlyOpen(time, now) || minutesSinceStartOfSundayTimeSlot(time.start) > nowMinutes,
    );

    if (nextTimeSlot === undefined) {
        // End of the week. Return the first time slot instead.
        return times[0];
    }
    return nextTimeSlot;
}
