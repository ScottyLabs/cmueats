import axios from 'axios';

import { DateTime } from 'luxon';

import {
    LocationState,
    ITimeSlot,
    IReadOnlyLocation_FromAPI_PostProcessed,
    IReadOnlyLocation_ExtraData,
    ITimeRangeList,
    IReadOnlyLocation_FromAPI_PreProcessed,
    IReadOnlyLocation_ExtraData_Map,
    ILocation_TimeStatusData,
} from '../types/locationTypes';
import {
    diffInMinutes,
    currentlyOpen,
    getNextTimeSlot,
    isTimeSlot,
    isValidTimeSlotArray,
    getTimeString,
    minutesSinceStartOfSundayTimeSlot,
    minutesSinceStartOfSundayDateTime,
    getApproximateTimeStringFromMinutes,
} from './time';
import toTitleCase from './string';
import assert from './assert';
import { IAPIResponseJoiSchema, ILocationAPIJoiSchema } from '../types/joiLocationTypes';
import notifySlack from './slack';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/**
 * Return the status message for a dining location, given the current or next available
 * time slot, and whether or not the location is currently open
 * @param isOpen
 * @param nextTime Time data entry of next closing/opening time
 * @returns {string} The status message for the location
 */
export function getStatusMessage(isOpen: boolean, nextTime: ITimeSlot, now: DateTime): string {
    assert(isTimeSlot(nextTime));
    const diff = diffInMinutes(nextTime, now);
    const weekdayDiff =
        nextTime.day -
        (now.weekday % 7) + // now.weekday returns 1-7 [mon-sun] instead of 0-6 [sun-sat]
        (minutesSinceStartOfSundayTimeSlot(nextTime) < minutesSinceStartOfSundayDateTime(now) ? 7 : 0); // nextTime wraps around to next week? Add 7 days to nextTime.day

    const time = getTimeString(nextTime);

    const action = isOpen ? 'Closes' : 'Opens';
    let day = WEEKDAYS[nextTime.day];

    if (weekdayDiff === 1) {
        day = 'tomorrow';
    } else if (weekdayDiff === 0) {
        day = 'today';
    }

    let relTimeDiff = getApproximateTimeStringFromMinutes(diff);
    const weekEdgeCase = Math.round(Math.floor(diff / 60) / 24);

    if (weekEdgeCase === 7) {
        relTimeDiff = 'a week';
    }

    if (relTimeDiff === '0 minutes') {
        return `${action} now (${day} at ${time})`;
    }
    return `${action} in ${relTimeDiff} (${day} at ${time})`;
}

/**
 * changesSoon is if location closes/opens within 60 minutes
 * @param timeSlots
 * @param now
 * @returns
 */
export function getLocationStatus(timeSlots: ITimeRangeList, now: DateTime): ILocation_TimeStatusData {
    assert(isValidTimeSlotArray(timeSlots), `${JSON.stringify(timeSlots)} is invalid!`);
    const MINUTES_IN_A_WEEK = 60 * 24 * 7;
    const nextTimeSlot = getNextTimeSlot(timeSlots, now);
    if (nextTimeSlot === null)
        return {
            statusMsg: 'Closed until further notice',
            closedLongTerm: true,
            locationState: LocationState.CLOSED_LONG_TERM,
        };
    if (
        minutesSinceStartOfSundayTimeSlot(nextTimeSlot.start) === 0 &&
        minutesSinceStartOfSundayTimeSlot(nextTimeSlot.end) === MINUTES_IN_A_WEEK - 1
    ) {
        // the very special case where the time interval represents the entire week
        return {
            statusMsg: 'Open 24/7',
            closedLongTerm: false,
            changesSoon: false,
            timeUntil: Infinity,
            locationState: LocationState.OPEN,
            isOpen: true,
        };
    }
    const isOpen = currentlyOpen(nextTimeSlot, now);
    const relevantTime = isOpen ? nextTimeSlot.end : nextTimeSlot.start; // when will the next closing/opening event happen?
    const timeUntil = diffInMinutes(relevantTime, now);
    const statusMsg = getStatusMessage(isOpen, relevantTime, now);
    const changesSoon = timeUntil <= 60;
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
        timeUntil,
        changesSoon,
        locationState,
    };
}

export async function queryLocations(cmuEatsAPIUrl: string): Promise<IReadOnlyLocation_FromAPI_PostProcessed[]> {
    try {
        // Query locations
        const { data } = await axios.get(cmuEatsAPIUrl);
        if (!data) {
            return [];
        }
        const { locations: rawLocations } = await IAPIResponseJoiSchema.validateAsync(data);

        // Check for invalid location data
        const validLocations = rawLocations.filter((location) => {
            const { error } = ILocationAPIJoiSchema.validate(location);
            if (error !== undefined) {
                console.error('Validation error!', error.details);
                // eslint-disable-next-line no-underscore-dangle
                console.error('original obj', error._original);
                notifySlack(
                    `<!channel> ${location.name} has invalid data! Ignoring location and continuing validation. ${error}`,
                );
            }
            return error === undefined;
        }) as IReadOnlyLocation_FromAPI_PreProcessed[];
        return validLocations.map((location) => ({
            ...location,
            name: toTitleCase(location.name ?? 'Untitled'), // Convert names to title case
        }));
    } catch (err: any) {
        console.error(err);
        notifySlack(`<!channel> queryLocations failed with error ${err}`);
        return [];
    }
}
