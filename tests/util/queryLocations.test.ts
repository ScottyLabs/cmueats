import { test, expect, describe } from 'vitest';
import { getLocationStatus, getStatusMessage } from '../../src/util/queryLocations';
import { LocationState } from '../../src/types/locationTypes';
import { DateTime, Interval } from 'luxon';
import { date, dateObj } from './util';

describe('queryLocations.ts', () => {
    describe('getLocationStatus', () => {
        test('basic', () => {
            const status = getLocationStatus(
                [
                    {
                        start: date('1/1/34 2:00 AM'),
                        end: date('1/1/34 3:00 AM'),
                    },
                ],
                dateObj('1/1/34 3:00 AM'),
            );
            expect(status.closedLongTerm).toEqual(false);
            if (!status.closedLongTerm) {
                // This has to be true given the line above (but TS doesn't know that)
                expect(status.changesSoon).toBeTruthy();
                expect(status.isOpen).toBeTruthy();
                expect(status.minutesUntil).toBe(0);
            }
        });
        test('no open times', () => {
            const status = getLocationStatus([], dateObj('1/1/34 1:00 AM'));
            expect(status).toEqual({
                statusMsg: {
                    longStatus: 'Closed until further notice',
                    shortStatus: ['Closed until further notice', ''],
                },
                locationState: LocationState.CLOSED_LONG_TERM,
                closedLongTerm: true,
            });
        });
        test('basic', () => {
            const A = {
                start: date('1/3/34 12:00 AM'), // Tuesday 12AM
                end: date('1/6/34 11:00 PM'), // Friday 11PM
            };
            const B = {
                start: date('1/7/34 12:00 AM'), // Sat 12AM
                end: date('1/8/34 12:00 AM'), // Sun 12AM
            };
            expect(getLocationStatus([A, B], dateObj('1/1/34 12:00 AM'))).toEqual({
                changesSoon: false,
                closedLongTerm: false,
                isOpen: false,
                locationState: LocationState.CLOSED,
                statusMsg: {
                    longStatus: 'Opens in 2 days (tomorrow at 12:00 AM)',
                    shortStatus: ['Opens in 2 days', 'at 12:00 AM'],
                },
                minutesUntil: 2880,
            });
            expect(getLocationStatus([A, B], dateObj('1/2/34 8:00 PM'))).toEqual({
                changesSoon: false,
                closedLongTerm: false,
                isOpen: false,
                locationState: LocationState.CLOSED,
                statusMsg: {
                    longStatus: 'Opens in 4 hours (today at 12:00 AM)',
                    shortStatus: ['Opens in 4 hours', 'at 12:00 AM'],
                },
                minutesUntil: 60 * 4,
            });
            expect(getLocationStatus([A, B], dateObj('1/2/34 11:00 PM'))).toEqual({
                changesSoon: true,
                closedLongTerm: false,
                isOpen: false,
                locationState: LocationState.OPENS_SOON,
                statusMsg: {
                    longStatus: 'Opens in 1 hour (today at 12:00 AM)',
                    shortStatus: ['Opens in 1 hour', 'at 12:00 AM'],
                },
                minutesUntil: 60,
            });
            expect(getLocationStatus([A, B], dateObj('1/3/34 1:00 AM'))).toEqual({
                changesSoon: false,
                closedLongTerm: false,
                isOpen: true,
                locationState: LocationState.OPEN,
                statusMsg: {
                    longStatus: 'Closes in 4 days (Friday at 11:00 PM)',
                    shortStatus: ['Closes in 4 days', 'at 11:00 PM'],
                },
                minutesUntil: 3 * 1440 + 22 * 60,
            });
            expect(getLocationStatus([A, B], dateObj('1/6/34 11:01 PM'))).toEqual({
                changesSoon: true,
                closedLongTerm: false,
                isOpen: false,
                locationState: LocationState.OPENS_SOON,
                statusMsg: {
                    longStatus: 'Opens in 59 minutes (today at 12:00 AM)',
                    shortStatus: ['Opens in 59 minutes', 'at 12:00 AM'],
                },
                minutesUntil: 59,
            });
            expect(getLocationStatus([A, B], dateObj('1/7/34 7:00 AM'))).toEqual({
                changesSoon: false,
                closedLongTerm: false,
                isOpen: true,
                locationState: LocationState.OPEN,
                statusMsg: {
                    longStatus: 'Closes in 17 hours (today at 12:00 AM)',
                    shortStatus: ['Closes in 17 hours', 'at 12:00 AM'],
                },
                minutesUntil: 17 * 60,
            });
            expect(getLocationStatus([A, B], dateObj('1/7/34 11:59 PM'))).toEqual({
                changesSoon: true,
                closedLongTerm: false,
                isOpen: true,
                locationState: LocationState.CLOSES_SOON,
                statusMsg: {
                    longStatus: 'Closes in 1 minute (today at 12:00 AM)',
                    shortStatus: ['Closes in 1 minute', 'at 12:00 AM'],
                },
                minutesUntil: 1,
            });
            expect(getLocationStatus([A, B], dateObj('1/1/34 1:00 AM'))).toEqual({
                changesSoon: false,
                closedLongTerm: false,
                isOpen: false,
                locationState: LocationState.CLOSED,
                statusMsg: {
                    longStatus: 'Opens in 2 days (tomorrow at 12:00 AM)',
                    shortStatus: ['Opens in 2 days', 'at 12:00 AM'],
                },
                minutesUntil: 47 * 60,
            });
            expect(
                getLocationStatus(
                    [{ start: date('1/1/34 12:00 AM'), end: date('1/7/34 11:59 PM') }],
                    dateObj('1/1/34 3:00 AM'),
                ),
            ).toEqual({
                changesSoon: false,
                closedLongTerm: false,
                isOpen: true,
                locationState: LocationState.OPEN,
                statusMsg: {
                    longStatus: 'Open 24/7',
                    shortStatus: ['Open 24/7', ''],
                },
                minutesUntil: (6 * 24 + 21) * 60 - 1,
            });
        });
    });

    const testCases = [
        {
            isOpen: false,
            now: { day: 2, hour: 2, minute: 3 },
            nextTime: { day: 2, hour: 2, minute: 2 },
            expectedString: 'Opens in a week (Tuesday at 2:02 AM)',
        },
        {
            isOpen: false,
            now: { day: 2, hour: 2, minute: 3 },
            nextTime: { day: 3, hour: 2, minute: 2 },
            expectedString: 'Opens in 1 day (tomorrow at 2:02 AM)',
        },
        {
            isOpen: false,
            now: { day: 2, hour: 23, minute: 3 },
            nextTime: { day: 3, hour: 0, minute: 2 },
            expectedString: 'Opens in 59 minutes (tomorrow at 12:02 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 23, minute: 3 },
            nextTime: { day: 3, hour: 0, minute: 3 },
            expectedString: 'Opens in 2 days (Wednesday at 12:03 AM)',
        },
        {
            isOpen: true,
            now: { day: 1, hour: 0, minute: 0 },
            nextTime: { day: 1, hour: 0, minute: 0 },
            expectedString: 'Closes now (today at 12:00 AM)',
        },
        {
            isOpen: true,
            now: { day: 1, hour: 1, minute: 0 },
            nextTime: { day: 1, hour: 1, minute: 0 },
            expectedString: 'Closes now (today at 1:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 0, minute: 0 },
            nextTime: { day: 1, hour: 0, minute: 0 },
            expectedString: 'Opens in 1 day (today at 12:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 23, minute: 30 },
            nextTime: { day: 1, hour: 0, minute: 0 },
            expectedString: 'Opens in 30 minutes (today at 12:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 20, minute: 30 },
            nextTime: { day: 1, hour: 0, minute: 0 },
            expectedString: 'Opens in 4 hours (today at 12:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 20, minute: 30 },
            nextTime: { day: 0, hour: 0, minute: 0 },
            expectedString: 'Opens in 6 days (Sunday at 12:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 0, minute: 30 },
            nextTime: { day: 0, hour: 20, minute: 0 },
            expectedString: 'Opens in 20 hours (today at 8:00 PM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 0, minute: 30 },
            nextTime: { day: 1, hour: 2, minute: 0 },
            expectedString: 'Opens in 1 day (tomorrow at 2:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 0, minute: 30 },
            nextTime: { day: 1, hour: 5, minute: 0 },
            expectedString: 'Opens in 1 day (tomorrow at 5:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 0, minute: 30 },
            nextTime: { day: 1, hour: 5, minute: 1 },
            expectedString: 'Opens in 1 day (tomorrow at 5:01 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 0, minute: 30 },
            nextTime: { day: 1, hour: 6, minute: 0 },
            expectedString: 'Opens in 1 day (tomorrow at 6:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 19, minute: 30 },
            nextTime: { day: 0, hour: 20, minute: 0 },
            expectedString: 'Opens in 30 minutes (today at 8:00 PM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 20, minute: 0 },
            nextTime: { day: 0, hour: 20, minute: 0 },
            expectedString: 'Opens now (today at 8:00 PM)',
        },
        {
            isOpen: false,
            now: { day: 0, hour: 19, minute: 30 },
            nextTime: { day: 1, hour: 5, minute: 0 },
            expectedString: 'Opens in 10 hours (tomorrow at 5:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 4, hour: 23, minute: 59 },
            nextTime: { day: 5, hour: 8, minute: 0 },
            expectedString: 'Opens in 8 hours (tomorrow at 8:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 5, hour: 8, minute: 1 },
            nextTime: { day: 5, hour: 8, minute: 0 },
            expectedString: 'Opens in a week (Friday at 8:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 6, hour: 12, minute: 0 },
            nextTime: { day: 0, hour: 8, minute: 0 },
            expectedString: 'Opens in 20 hours (tomorrow at 8:00 AM)',
        }, // case where 'tomorrow' wraps around
        {
            isOpen: false,
            now: { day: 6, hour: 13, minute: 0 },
            nextTime: { day: 6, hour: 12, minute: 0 },
            expectedString: 'Opens in a week (Saturday at 12:00 PM)',
        },
        {
            isOpen: false,
            now: { day: 6, hour: 12, minute: 0 },
            nextTime: { day: 6, hour: 13, minute: 0 },
            expectedString: 'Opens in 1 hour (today at 1:00 PM)',
        },
        {
            isOpen: false,
            now: { day: 5, hour: 12, minute: 0 },
            nextTime: { day: 0, hour: 8, minute: 0 },
            expectedString: 'Opens in 2 days (Sunday at 8:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 4, hour: 19, minute: 0 },
            nextTime: { day: 5, hour: 8, minute: 0 },
            expectedString: 'Opens in 13 hours (tomorrow at 8:00 AM)',
        },
        {
            isOpen: true,
            now: { day: 4, hour: 19, minute: 0 },
            nextTime: { day: 4, hour: 20, minute: 0 },
            expectedString: 'Closes in 1 hour (today at 8:00 PM)',
        },
        {
            isOpen: true,
            now: { day: 4, hour: 23, minute: 25 },
            nextTime: { day: 5, hour: 0, minute: 0 },
            expectedString: 'Closes in 35 minutes (today at 12:00 AM)', // special regression test for https://github.com/ScottyLabs/cmueats/issues/5
        },
        {
            isOpen: false,
            now: { day: 0, hour: 10, minute: 28 },
            nextTime: { day: 1, hour: 10, minute: 30 },
            expectedString: 'Opens in 1 day (tomorrow at 10:30 AM)', // regression test for https://github.com/ScottyLabs/cmueats/issues/31
        },
        {
            isOpen: false,
            now: { day: 0, hour: 10, minute: 28 },
            nextTime: { day: 1, hour: 17, minute: 0 },
            expectedString: 'Opens in 1 day (tomorrow at 5:00 PM)', // regression test for https://github.com/ScottyLabs/cmueats/issues/31
        },
        {
            isOpen: false,
            now: { day: 6, hour: 10, minute: 28 },
            nextTime: { day: 0, hour: 9, minute: 0 },
            expectedString: 'Opens in 23 hours (tomorrow at 9:00 AM)',
        },
        {
            isOpen: false,
            now: { day: 6, hour: 10, minute: 28 },
            nextTime: { day: 3, hour: 9, minute: 0 },
            expectedString: 'Opens in 4 days (Wednesday at 9:00 AM)',
        },
    ];

    const modifiedTestCases = testCases.map(
        (testCase) => [testCase.isOpen, testCase.nextTime, testCase.now, testCase.expectedString] as const,
    );

    test.each(modifiedTestCases)(
        'getStatusMessage | isOpen: %p, nextTime: %p, now: %p, expected: %p',
        (isOpen, nextTime, now, expectedString) => {
            // TypeScript type assertions
            const isOpenBool = isOpen;
            let nextTimeObj = DateTime.fromObject(
                { year: 2034, month: 1, day: nextTime.day + 1, hour: nextTime.hour, minute: nextTime.minute },
                { zone: 'America/New_York' },
            );
            let nowObj = DateTime.fromObject(
                { year: 2034, month: 1, day: now.day + 1, hour: now.hour, minute: now.minute },
                { zone: 'America/New_York' },
            );
            if (nextTimeObj < nowObj) {
                // these legacy test cases assume wrap-around, so we're just doing this to compensate
                nextTimeObj = nextTimeObj.plus({ week: 1 });
            }

            const locationString = getStatusMessage(isOpenBool, Interval.fromDateTimes(nowObj, nextTimeObj));

            expect(locationString.longStatus).toEqual(expectedString);
        },
    );
});
