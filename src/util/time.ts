/** Pure utility functions that process location (restaurant, also called concept) timeslots
 */

import { DateTime } from 'luxon';
import { ITimeRange, ITimeRangeList } from '../types/locationTypes';

import assert from './assert';
import bounded from './misc';

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
 *
 * @param timeSlots
 * @returns Checks if timeslots are non-overlapping (so [a,b],[b,c] is invalid) and properly sorted.
 */
export function isValidTimeSlotArray(timeSlots: ITimeRangeList) {
    for (let i = 0; i < timeSlots.length; i += 1) {
        const { start, end } = timeSlots[i]!;
        if (start > end) return false;
        if (i > 0) {
            const prevEnd = timeSlots[i - 1]!.end;
            if (start <= prevEnd) return false;
        }
    }
    return true;
}

function timeIntervalToString(start: DateTime, end: DateTime) {
    const startStr = start.toLocaleString(DateTime.TIME_SIMPLE);
    const endStr = end.toLocaleString(DateTime.TIME_SIMPLE);
    const fullStr = `${startStr} - ${endStr}`;
    return fullStr === '12:00 AM - 11:59 PM' ? 'Open 24 hours' : fullStr; // just some friendly human conversion
}
/**
 * Converts an sorted time slot array to an array of human-readable strings (12-hour time)
 * @param times
 * @returns HH:MM (AM/PM) Array
 */
export function getTimeSlotsString(times: ITimeRangeList, today: DateTime) {
    assert(isValidTimeSlotArray(times));

    let timesAsDateTimes = times.map((time) => ({
        start: DateTime.fromMillis(time.start),
        end: DateTime.fromMillis(time.end),
    }));
    const brokenDownTimeSlots: { start: DateTime; end: DateTime }[] = [];

    // This is O(N^2) but it's readable, at least (breaks down timeslots into
    // intervals of less than 24 hrs each, greedily taking at most 24-hr chunks out of earliest interval until no intervals are left)
    while (timesAsDateTimes.length) {
        const [first, ...rest] = timesAsDateTimes;
        const startDate = first!.start;
        const endDateBoundary = startDate.plus({ days: 1 }).minus({ minutes: 1 });
        const endDate = first!.end;
        if (endDate <= endDateBoundary) {
            brokenDownTimeSlots.push({ start: startDate, end: endDate });
            timesAsDateTimes = rest;
        } else {
            // cap `first` at midnight
            const midnightOfStart = startDate.endOf('day');
            brokenDownTimeSlots.push({ start: startDate, end: midnightOfStart });
            timesAsDateTimes = [{ start: midnightOfStart.plus({ millisecond: 1 }), end: endDate }, ...rest];
        }
    }
    const nontrivialBrokenDownTimeSlots = brokenDownTimeSlots.filter(
        ({ start, end }) => start.toMillis() !== end.toMillis(),
    );
    const listByDate = [];

    for (let ptrI = 0, day = 0; day < 7; day++) {
        const stringsForThatDay: string[] = [];
        const curDay = today.plus({ days: day });
        while (ptrI < nontrivialBrokenDownTimeSlots.length && nontrivialBrokenDownTimeSlots[ptrI]!.start <= curDay) {
            const curInterval = nontrivialBrokenDownTimeSlots[ptrI]!;
            if (curInterval.start.hasSame(curDay, 'day')) {
                stringsForThatDay.push(timeIntervalToString(curInterval.start, curInterval.end));
            }
            ptrI++;
        }
        listByDate.push(stringsForThatDay.join(', ') || 'CLOSED');
    }

    return listByDate;
}

/**
 * Gets the next available time slot for a given location
 * @param {ITimeRangeList} times List of time ranges for a location
 * @returns The next time slot when the location opens (if currently open,
 * then it returns that slot). If there are no available slots, it returns null
 */
export function getNextTimeSlot(times: ITimeRangeList, now: DateTime) {
    assert(isValidTimeSlotArray(times));
    return times.find(
        (time) => (time.start <= now.toMillis() && now.toMillis() <= time.end) || now.toMillis() < time.start,
    );
}
