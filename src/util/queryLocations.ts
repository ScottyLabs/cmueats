import { DateTime, Interval } from 'luxon';

import { LocationState, ITimeRangeList, ILocation_TimeStatusData } from '../types/locationTypes';
import { getNextTimeSlot, isValidTimeSlotArray, getApproximateTimeStringFromMinutes } from './time';
import assert from './assert';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/**
 * Return the status message for a dining location, given the current or next available
 * time slot, and whether or not the location is currently open
 * @param isOpen
 * @param nextTime Unix timestamp of next closing/opening time
 * @returns {string} The status message for the location
 */
export function getStatusMessage(isOpen: boolean, interval: Interval): string {
    if (!interval.isValid || !interval.end) return 'Who knows lmao';
    const daysSpanned = interval.count('day');
    const time = interval.end.toLocaleString(DateTime.TIME_SIMPLE);

    const action = isOpen ? 'Closes' : 'Opens';
    const day = daysSpanned === 1 ? 'today' : daysSpanned === 2 ? 'tomorrow' : WEEKDAYS[interval.end.weekday % 7];
    const humanReadableIntervalDuration = getApproximateTimeStringFromMinutes(Math.floor(interval.length('minute')));
    if (interval.length('day') > 6) return 'Open 24/7';

    if (humanReadableIntervalDuration === '0 minutes') {
        return `${action} now (${day} at ${time})`;
    }
    return `${action} in ${humanReadableIntervalDuration} (${day} at ${time})`;
}

/**
 * changesSoon is if location closes/opens within 60 minutes
 * @param timeSlots
 * @param now
 * @returns
 */
export function getLocationStatus(timeSlots: ITimeRangeList, now: DateTime): ILocation_TimeStatusData {
    assert(isValidTimeSlotArray(timeSlots), `${JSON.stringify(timeSlots)} is invalid!`);
    const nextTimeSlot = getNextTimeSlot(timeSlots, now);
    if (nextTimeSlot === undefined)
        return {
            statusMsg: 'Closed until further notice',
            closedLongTerm: true,
            locationState: LocationState.CLOSED_LONG_TERM,
        };

    const isOpen = nextTimeSlot.start <= now.toMillis() && now.toMillis() <= nextTimeSlot.end;
    const relevantNextTime = DateTime.fromMillis(isOpen ? nextTimeSlot.end : nextTimeSlot.start); // when will the next closing/opening event happen?
    const interval = Interval.fromDateTimes(now, relevantNextTime);
    const statusMsg = getStatusMessage(isOpen, interval);
    const changesSoon = interval.length('minute') <= 60;
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
        timeUntil: Math.floor(interval.length('second')),
        changesSoon,
        locationState,
    };
}
