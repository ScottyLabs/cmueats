/** Pure utility functions that process location (restaurant, also called concept) timeslots
 */

import { DateTime } from 'luxon';
import { ITimeRangeList } from '../types/locationTypes';

import assert from './assert';

/**
 * round to the nearest unit, where you round iff `minutes/unit` is between lowerBound and upperBound, inclusive
 */
function round(
    minutes: number,
    { unit, upperBound, lowerBound }: { unit: number; upperBound: number; lowerBound: number },
) {
    const x = minutes / unit;
    if (lowerBound <= x && x <= upperBound) return Math.round(x) * unit;
    return minutes;
}
const pluralTag = (strings: TemplateStringsArray, amt: number) =>
    `${strings[0]}${amt}${strings[1]}${amt === 1 ? '' : 's'}`;

function getExactTimeStringFromMinutes(minutes: number) {
    let remaining = minutes;
    const min = remaining % 60;
    remaining = Math.floor(remaining / 60);
    const hrs = remaining % 24;
    remaining = Math.floor(remaining / 24);
    const days = remaining % 7;
    remaining = Math.floor(remaining / 7);
    const weeks = remaining;

    if (weeks !== 0) {
        if (weeks === 1) return 'a week';
        return pluralTag`${weeks} week`;
    }
    if (days !== 0) return pluralTag`${days} day`;
    if (hrs !== 0) return pluralTag`${hrs} hour`;
    return pluralTag`${min} minute`;
}
/**
 *
 * @param minutes >=0
 * @returns rounds to the nearest human-readable unit, which minimizes the maximum error when converting to lossy human-readable format
 * (eg. 24.2 hrs -> 1 day, 32 minutes -> 1 hr, .8 minutes -> 1 min, etc.)
 * you can imagine drawing a number line where each vertical line corresponds to a valid rounded result
 * | | | | |    |    |    |    |        |        |        |
 * for any point x, we want to find the closest vertical line
 */
export function getApproximateTimeStringFromMinutes(totalMinutes: number) {
    assert(totalMinutes >= 0, 'Minutes must be non-negative!');
    let roundedMinutes = totalMinutes;
    // we have upper bounds because we don't want rounding errors to accumulate, like 35.8 hrs -> 36 hrs -> 2 days (it should be 1 day)
    roundedMinutes = round(roundedMinutes, { unit: 1, lowerBound: 0, upperBound: 60 }); // nearest minute
    roundedMinutes = round(roundedMinutes, { unit: 60, lowerBound: 1, upperBound: 24 }); // nearest hour
    roundedMinutes = round(roundedMinutes, { unit: 60 * 24, lowerBound: 1, upperBound: 7 }); // nearest day
    roundedMinutes = round(roundedMinutes, { unit: 60 * 24 * 7, lowerBound: 1, upperBound: Infinity }); // nearest week
    return getExactTimeStringFromMinutes(roundedMinutes);
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
    const isFullDay = start.hour === 0 && start.minute === 0 && end.hour === 23 && end.minute === 59;
    return isFullDay ? 'Open 24 hours' : fullStr; // just some friendly human conversion
}
/**
 * Converts an sorted time slot array to an array of human-readable strings (12-hour time)
 * @param times
 * @returns HH:MM (AM/PM) Array
 */
export function next7DaysReadableString(times: ITimeRangeList, today: DateTime) {
    assert(isValidTimeSlotArray(times), 'time input is invalid!');

    let timesAsDateTimes = times.map((time) => ({
        start: DateTime.fromMillis(time.start, {
            zone: 'America/New_York',
        }),
        end: DateTime.fromMillis(time.end, {
            zone: 'America/New_York',
        }),
    }));
    let brokenDownTimeSlots: { start: DateTime; end: DateTime }[] = [];

    // This is O(N^2) but it's readable, at least (breaks down timeslots into
    // intervals of less than 24 hrs each, greedily taking at most 24-hr chunks
    // out of earliest interval until no intervals are left)
    // (basically splits the interval down into smaller intervals that can each be represented as a string without the date (like 3:00 PM - 2:00 AM))
    while (timesAsDateTimes.length) {
        const [first, ...rest] = timesAsDateTimes;
        const startDate = first!.start;
        let endDateBoundary = startDate.plus({ days: 1 }).minus({ minutes: 1 });

        // special DST check, where endDateBoundary accidentally overshoots
        if (endDateBoundary.day > startDate.day && endDateBoundary.hour > startDate.hour) {
            // we've accidentally skipped forward an hour due to DST (eg. trying to initialize 2:30 AM on spring forward day gives us 3:30 AM (since 2:30 doesn't exist))
            endDateBoundary = endDateBoundary.minus({ hours: 1 }); // crude subtraction, but it's mostly fine (we just need human-readable times at the end of the day *pun intended* ahahha does anyone read these comments. leave a like if you're reading this in 2027!! can't believe this code has been around for that long. The author has probably graduated now)
        }
        const endDate = first!.end;
        if (endDate <= endDateBoundary) {
            brokenDownTimeSlots.push({ start: startDate, end: endDate });
            timesAsDateTimes = rest;
        } else {
            // cap `first` at midnight
            const midnightOfStart = startDate.endOf('day');
            brokenDownTimeSlots.push({ start: startDate, end: midnightOfStart });
            timesAsDateTimes = [{ start: midnightOfStart.plus({ milliseconds: 1 }), end: endDate }, ...rest];
        }
    }
    brokenDownTimeSlots = brokenDownTimeSlots.filter(
        ({ start, end }) =>
            start.toLocaleString(DateTime.DATETIME_SHORT) !== end.toLocaleString(DateTime.DATETIME_SHORT),
    ); // removes intervals like 10:00 AM - 10:00 AM, for instance
    const listByDate = [];

    for (let ptrI = 0, day = 0; day < 7; day++) {
        const stringsForThatDay: string[] = [];
        const curDay = today.plus({ days: day });
        while (ptrI < brokenDownTimeSlots.length && brokenDownTimeSlots[ptrI]!.start <= curDay.endOf('day')) {
            const curInterval = brokenDownTimeSlots[ptrI]!;
            if (curInterval.start.hasSame(curDay, 'day')) {
                stringsForThatDay.push(timeIntervalToString(curInterval.start, curInterval.end));
            }
            ptrI++;
        }
        listByDate.push(stringsForThatDay.join(', ') || 'CLOSED');
    } // this works because `brokenDownTimeSlots` is sorted

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
