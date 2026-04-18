import { DateTime, Interval } from 'luxon';

import { LocationState, ITimeRangeList, ILocation_TimeStatusData, IStatusMessage } from '../types/locationTypes';
import { getNextTimeSlot, isValidTimeSlotArray, getApproximateTimeStringFromMinutes } from './time';
import assert from './assert';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Return the status message for a dining location, given the current or next available
 * time slot, and whether or not the location is currently open
 */
export function getStatusMessage(isOpen: boolean, interval: Interval): IStatusMessage {
    if (!interval.isValid || !interval.end)
        return {
            longStatus: 'Who knows? This is a bug',
            shortStatus: ['Who knows?', 'this is a bug'],
        };
    const endTime = interval.end.toLocaleString(DateTime.TIME_SIMPLE);

    const action = isOpen ? 'Closes' : 'Opens';
    const daysSpanned = interval.count('day'); // NOTE: daysSpanned == 0 iff start == end
    // eslint-disable-next-line no-nested-ternary
    const day = daysSpanned <= 1 ? 'today' : daysSpanned === 2 ? 'tomorrow' : WEEKDAYS[interval.end.weekday % 7];

    const humanReadableIntervalDuration = getApproximateTimeStringFromMinutes(interval.length('minute'));

    if (isOpen && interval.length('day') > 6)
        return {
            longStatus: 'Open 24/7',
            shortStatus: ['Open 24/7', ''],
        };

    if (humanReadableIntervalDuration === '0 minutes') {
        return { longStatus: `${action} now (${day} at ${endTime})`, shortStatus: [`${action} now`, ''] };
    }
    return {
        shortStatus: [`${action} in ${humanReadableIntervalDuration}`, `at ${endTime}`],
        longStatus: `${action} in ${humanReadableIntervalDuration} (${day} at ${endTime})`,
    };
}

/**
 * changesSoon is if location closes/opens within 60 minutes
 */
export function getLocationStatus(timeSlots: ITimeRangeList, now: DateTime): ILocation_TimeStatusData {
    assert(isValidTimeSlotArray(timeSlots), `${JSON.stringify(timeSlots)} is invalid!`);
    const nextTimeSlot = getNextTimeSlot(timeSlots, now);
    if (nextTimeSlot === undefined)
        return {
            statusMsg: { longStatus: 'Closed until further notice', shortStatus: ['Closed until further notice', ''] },
            closedLongTerm: true,
            locationState: LocationState.CLOSED_LONG_TERM,
        };

    const isOpen = nextTimeSlot.start <= now.toMillis() && now.toMillis() <= nextTimeSlot.end;
    const relevantNextTime = DateTime.fromMillis(isOpen ? nextTimeSlot.end : nextTimeSlot.start, {
        zone: 'America/New_York',
    }); // when will the next closing/opening event happen?
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
        minutesUntil: interval.length('minute'),
        changesSoon,
        locationState,
    };
}
