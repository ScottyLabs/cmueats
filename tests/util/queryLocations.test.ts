import {
	getLocationStatus,
	getStatusMessage,
} from '../../src/util/queryLocations';
import { describe, expect } from 'vitest';
import { ITimeSlotTime, LocationState } from '../../src/types/locationTypes';
import makeDateTime from './helper';

interface IGetStatusMessageTest {
	isOpen: boolean;
	nextTime: ITimeSlotTime;
	now: ITimeSlotTime;
	expectedString?: string;
}

describe('queryLocations.ts', () => {
	describe('getLocationStatus', () => {
		test('basic', () => {
			const status = getLocationStatus(
				[
					{
						start: { day: 0, hour: 2, minute: 2 },
						end: { day: 0, hour: 3, minute: 0 },
					},
				],
				makeDateTime(0, 3, 0),
			);
			expect(status.closedLongTerm).toEqual(false);
			if (!status.closedLongTerm) {
				// This has to be true given the line above (but TS doesn't know that)
				expect(status.changesSoon).toBeTruthy();
				expect(status.isOpen).toBeTruthy();
				expect(status.timeUntil).toBe(0);
			}
		});
		test('no open times', () => {
			const status = getLocationStatus([], makeDateTime(0, 0, 1));
			expect(status).toEqual({
				statusMsg: 'Closed until further notice',
				locationState: LocationState.CLOSED_LONG_TERM,
				closedLongTerm: true,
			});
		});
		test('wrap-over for last time slot', () => {
			const A = {
				start: { day: 2, hour: 0, minute: 0 }, // Tuesday 12AM
				end: { day: 5, hour: 23, minute: 0 }, // Friday 11PM
			};
			const B = {
				start: { day: 6, hour: 0, minute: 0 }, // Sat 12AM
				end: { day: 0, hour: 0, minute: 0 }, // Sun 12AM
			};
			expect(getLocationStatus([A, B], makeDateTime(0, 0, 0))).toEqual({
				changesSoon: false,
				closedLongTerm: false,
				isOpen: false,
				locationState: LocationState.CLOSED,
				statusMsg: 'Opens in 2 days (Tuesday at 12:00 AM)',
				timeUntil: 2880,
			});
			expect(getLocationStatus([A, B], makeDateTime(1, 20, 0))).toEqual({
				changesSoon: false,
				closedLongTerm: false,
				isOpen: false,
				locationState: LocationState.CLOSED,
				statusMsg: 'Opens in 4 hours (tomorrow at 12:00 AM)',
				timeUntil: 60 * 4,
			});
			expect(getLocationStatus([A, B], makeDateTime(1, 23, 0))).toEqual({
				changesSoon: true,
				closedLongTerm: false,
				isOpen: false,
				locationState: LocationState.OPENS_SOON,
				statusMsg: 'Opens in 1 hour (tomorrow at 12:00 AM)',
				timeUntil: 60,
			});
			expect(getLocationStatus([A, B], makeDateTime(2, 1, 0))).toEqual({
				changesSoon: false,
				closedLongTerm: false,
				isOpen: true,
				locationState: LocationState.OPEN,
				statusMsg: 'Closes in 3 days (Friday at 11:00 PM)',
				timeUntil: 3 * 1440 + 22 * 60,
			});
			expect(getLocationStatus([A, B], makeDateTime(5, 23, 1))).toEqual({
				changesSoon: true,
				closedLongTerm: false,
				isOpen: false,
				locationState: LocationState.OPENS_SOON,
				statusMsg: 'Opens in 59 minutes (tomorrow at 12:00 AM)',
				timeUntil: 59,
			});
			expect(getLocationStatus([A, B], makeDateTime(6, 7, 0))).toEqual({
				changesSoon: false,
				closedLongTerm: false,
				isOpen: true,
				locationState: LocationState.OPEN,
				statusMsg: 'Closes in 17 hours (tomorrow at 12:00 AM)',
				timeUntil: 17 * 60,
			});
			expect(getLocationStatus([A, B], makeDateTime(6, 23, 59))).toEqual({
				changesSoon: true,
				closedLongTerm: false,
				isOpen: true,
				locationState: LocationState.CLOSES_SOON,
				statusMsg: 'Closes in 1 minute (tomorrow at 12:00 AM)',
				timeUntil: 1,
			});
			expect(getLocationStatus([A, B], makeDateTime(0, 1, 0))).toEqual({
				changesSoon: false,
				closedLongTerm: false,
				isOpen: false,
				locationState: LocationState.CLOSED,
				statusMsg: 'Opens in 1 day (Tuesday at 12:00 AM)',
				timeUntil: 47 * 60,
			});
			expect(1).toBe(2);
		});
	});
	test.each([
		{
			isOpen: false,
			nextTime: { day: 2, hour: 2, minute: 2 },
			now: { day: 2, hour: 2, minute: 3 },
			expectedString: 'Opens in 6 days (Tuesday at 2:02 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 3, hour: 2, minute: 2 },
			now: { day: 2, hour: 2, minute: 3 },
			expectedString: 'Opens in 23 hours (tomorrow at 2:02 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 3, hour: 0, minute: 2 },
			now: { day: 2, hour: 23, minute: 3 },
			expectedString: 'Opens in 59 minutes (tomorrow at 12:02 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 3, hour: 0, minute: 3 },
			now: { day: 0, hour: 23, minute: 3 },
			expectedString: 'Opens in 2 days (Wednesday at 12:03 AM)',
		},
		{
			isOpen: true,
			nextTime: { day: 1, hour: 0, minute: 0 },
			now: { day: 1, hour: 0, minute: 0 },
			expectedString: 'Closes now (today at 12:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 0, minute: 0 },
			now: { day: 0, hour: 0, minute: 0 },
			expectedString: 'Opens in 1 day (tomorrow at 12:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 0, minute: 0 },
			now: { day: 0, hour: 23, minute: 30 },
			expectedString: 'Opens in 30 minutes (tomorrow at 12:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 0, minute: 0 },
			now: { day: 0, hour: 20, minute: 30 },
			expectedString: 'Opens in 3 hours (tomorrow at 12:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 0, hour: 0, minute: 0 },
			now: { day: 0, hour: 20, minute: 30 },
			expectedString: 'Opens in 6 days (Sunday at 12:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 0, hour: 20, minute: 0 },
			now: { day: 0, hour: 0, minute: 30 },
			expectedString: 'Opens in 19 hours (today at 8:00 PM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 2, minute: 0 },
			now: { day: 0, hour: 0, minute: 30 },
			expectedString: 'Opens in 1 day (tomorrow at 2:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 5, minute: 0 },
			now: { day: 0, hour: 0, minute: 30 },
			expectedString: 'Opens in 1 day (tomorrow at 5:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 5, minute: 1 },
			now: { day: 0, hour: 0, minute: 30 },
			expectedString: 'Opens in 1 day (tomorrow at 5:01 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 6, minute: 0 },
			now: { day: 0, hour: 0, minute: 30 },
			expectedString: 'Opens in 1 day (tomorrow at 6:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 0, hour: 20, minute: 0 },
			now: { day: 0, hour: 19, minute: 30 },
			expectedString: 'Opens in 30 minutes (today at 8:00 PM)',
		},
		{
			isOpen: false,
			nextTime: { day: 0, hour: 20, minute: 0 },
			now: { day: 0, hour: 20, minute: 0 },
			expectedString: 'Opens now (today at 8:00 PM)',
		},
		{
			isOpen: false,
			nextTime: { day: 1, hour: 5, minute: 0 },
			now: { day: 0, hour: 19, minute: 30 },
			expectedString: 'Opens in 9 hours (tomorrow at 5:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 5, hour: 8, minute: 0 },
			now: { day: 4, hour: 23, minute: 59 },
			expectedString: 'Opens in 8 hours (tomorrow at 8:00 AM)',
		},
		{
			isOpen: false,
			nextTime: { day: 5, hour: 8, minute: 0 },
			now: { day: 5, hour: 8, minute: 1 },
			expectedString: 'Opens in 6 days (Friday at 8:00 AM)',
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
			expectedString: 'Opens in 6 days (Saturday at 12:00 PM)',
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
			expectedString: 'Opens in 1 day (Sunday at 8:00 AM)',
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
			expectedString: 'Closes in 35 minutes (tomorrow at 12:00 AM)', // special regression test for https://github.com/ScottyLabs/cmueats/issues/5
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
			expectedString: 'Opens in 22 hours (tomorrow at 9:00 AM)',
		},
		{
			isOpen: false,
			now: { day: 6, hour: 10, minute: 28 },
			nextTime: { day: 3, hour: 9, minute: 0 },
			expectedString: 'Opens in 3 days (Wednesday at 9:00 AM)',
		},
	] satisfies IGetStatusMessageTest[])(
		'#%# test of getStatusMessage | Now: $now | Next Time: $nextTime',
		({ isOpen, nextTime, now, expectedString }) => {
			const locationString = getStatusMessage(
				isOpen,
				nextTime,
				makeDateTime(now.day, now.hour, now.minute),
			);
			if (expectedString === undefined) console.log(locationString);
			else expect(locationString).toEqual(expectedString);
		},
	);
});
