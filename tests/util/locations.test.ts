import { DateTime, WeekdayNumbers } from 'luxon';
import {
	getLocationStatus,
	getStatusMessage,
} from '../../src/util/queryLocations';
import { assert, describe, expect, it } from 'vitest';
import { ITimeSlotTime } from '../../src/types/locationTypes';
import {
	bounded,
	currentlyOpen,
	getNextTimeSlot,
	getTimeString,
	isTimeSlot,
	isTimeSlotTime,
	isValidTimeSlotArray,
	minutesSinceSundayDateTime,
} from '../../src/util/time';

interface IGetStatusMessageTest {
	isOpen: boolean;
	nextTime: ITimeSlotTime;
	now: ITimeSlotTime;
	expectedString?: string;
}

/**
 *
 * @param day 0-6 (0 is Sunday)
 * @param hour 0-23
 * @param minute 0-59
 * @returns
 */
function makeDateTime(day: number, hour: number, minute: number) {
	return DateTime.fromObject({
		hour,
		minute,
		weekday: (day === 0 ? 7 : day) as WeekdayNumbers,
	});
}

describe('queryLocations.ts', () => {
	test('getLocationStatus', () => {
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
			expect(status.timeUntil).toEqual(0);
		}
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

describe('time.ts', () => {
	describe('currentlyOpen', () => {
		test('wrap-around testing', () => {
			expect(
				currentlyOpen(
					{
						start: { day: 0, hour: 0, minute: 0 },
						end: { day: 0, hour: 0, minute: 0 },
					},
					makeDateTime(1, 1, 1),
				),
			).toBe(false); //no wrap-around here
			expect(
				currentlyOpen(
					{
						start: { day: 0, hour: 0, minute: 0 },
						end: { day: 0, hour: 0, minute: 0 },
					},
					makeDateTime(0, 0, 0),
				),
			).toBe(true); //no wrap-around here
			expect(
				currentlyOpen(
					{
						start: { day: 1, hour: 8, minute: 0 },
						end: { day: 1, hour: 7, minute: 59 },
					},
					makeDateTime(2, 1, 1),
				),
			).toBe(true); //we wrap-around here
		});
		test('bounds are inclusive', () => {
			expect(
				currentlyOpen(
					{
						start: { day: 0, hour: 0, minute: 0 },
						end: { day: 0, hour: 0, minute: 1 },
					},
					makeDateTime(0, 0, 1),
				),
			).toBe(true);
			expect(
				currentlyOpen(
					{
						start: { day: 0, hour: 0, minute: 0 },
						end: { day: 0, hour: 0, minute: 1 },
					},
					makeDateTime(0, 0, 0),
				),
			).toBe(true);
			expect(
				currentlyOpen(
					{
						start: { day: 0, hour: 0, minute: 0 },
						end: { day: 0, hour: 0, minute: 1 },
					},
					makeDateTime(0, 0, 2),
				),
			).toBe(false);
		});
		test('basic behavior', () => {
			expect(
				currentlyOpen(
					{
						start: { day: 1, hour: 8, minute: 0 },
						end: { day: 2, hour: 13, minute: 1 },
					},
					makeDateTime(1, 7, 1),
				),
			).toBe(false);
			expect(
				currentlyOpen(
					{
						start: { day: 1, hour: 8, minute: 0 },
						end: { day: 2, hour: 13, minute: 1 },
					},
					makeDateTime(2, 1, 1),
				),
			).toBe(true);
			expect(
				currentlyOpen(
					{
						start: { day: 1, hour: 8, minute: 0 },
						end: { day: 2, hour: 13, minute: 1 },
					},
					makeDateTime(1, 8, 2),
				),
			).toBe(true);
		});
		test('error handling', () => {
			expect(() =>
				currentlyOpen(
					{
						start: { day: 1, hour: 8, minute: 0 },
						end: { day: 2, hour: 13, minute: 1 },
					},
					makeDateTime(8, 1, 1), //invalid datetime
				),
			).toThrow();
		});
	});

	test('bounded', () => {
		expect(bounded(2, 2, 2)).toEqual(false);
		expect(bounded(2, 2, 3)).toEqual(true);
		expect(bounded(2.5, 2.2, 3)).toEqual(true);
		expect(() => bounded(2, 2, -2)).toThrow();
		expect(() => bounded(2, 2, 1.99)).toThrow();
	});
	test('isTimeSlotTime', () => {
		expect(isTimeSlotTime({ minute: 59, hour: 23, day: 6 })).toEqual(true);
		expect(isTimeSlotTime({ minute: 0, hour: 0, day: 0 })).toEqual(true);
		expect(isTimeSlotTime({ minute: 60, hour: 0, day: 0 })).toEqual(false);
		expect(isTimeSlotTime({ minute: 0, hour: 24, day: 0 })).toEqual(false);
		expect(isTimeSlotTime({ minute: 0, hour: 0, day: 7 })).toEqual(false);
		expect(isTimeSlotTime({ minute: 0, hour: 0, day: -2 })).toEqual(false);
		expect(isTimeSlotTime({ minute: 0, hour: 0, day: 1.2 })).toEqual(false);
		expect(isTimeSlotTime({ minute: 0, hour: 1.1, day: 1 })).toEqual(false);
		expect(isTimeSlotTime({ minute: 0.0, hour: 1, day: 1 })).toEqual(true);
	});
	test('minutesSinceSundayDateTime', () => {
		expect(minutesSinceSundayDateTime(makeDateTime(1, 1, 1))).toEqual(
			60 * 24 + 60 + 1,
		);
	});
	test('isTimeSlot', () => {
		expect(
			isTimeSlot({
				start: { minute: 1, hour: 1, day: 1 },
				end: { minute: 1, hour: 1, day: 1 },
			}),
		).toEqual(true);
		expect(
			isTimeSlot({
				start: { minute: 1, hour: 1, day: 1 },
				end: { minute: 0, hour: 1, day: 1 },
			}),
		).toEqual(false);
		expect(
			isTimeSlot(
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 0, hour: 1, day: 1 },
				},
				true,
			),
		).toEqual(true);
		expect(
			isTimeSlot({
				start: { minute: 1, hour: 1, day: 1 },
				end: { minute: 1, hour: 1, day: 2 },
			}),
		).toEqual(true);
		expect(
			isTimeSlot({
				start: { minute: 1, hour: 1, day: 1 },
				end: { minute: 1, hour: 1, day: 7 },
			}),
		).toEqual(false);
	});

	test('getTimeString', () => {
		expect(getTimeString({ day: 1, hour: 0, minute: 0 })).toBe('12:00 AM');
		expect(getTimeString({ day: 1, hour: 0, minute: 2 })).toBe('12:02 AM');
		expect(getTimeString({ day: 1, hour: 2, minute: 2 })).toBe('2:02 AM');
		expect(getTimeString({ day: 1, hour: 11, minute: 2 })).toBe('11:02 AM');
		expect(getTimeString({ day: 1, hour: 12, minute: 2 })).toBe('12:02 PM');
		expect(getTimeString({ day: 1, hour: 23, minute: 59 })).toBe(
			'11:59 PM',
		);
		expect(() => getTimeString({ day: 1, hour: 23, minute: 60 })).toThrow();
		expect(() =>
			getTimeString({ day: 1, hour: 23, minute: 59.5 }),
		).toThrow();
	});

	test('isValidTimeSlotArray', () => {
		expect(
			isValidTimeSlotArray([
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 2, hour: 1, day: 1 },
				},
				{
					start: { minute: 2, hour: 1, day: 1 },
					end: { minute: 3, hour: 1, day: 1 },
				},
			]),
		).toBe(false);
		expect(
			isValidTimeSlotArray([
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 2, hour: 1, day: 1 },
				},
				{
					start: { minute: 3, hour: 1, day: 1 },
					end: { minute: 4, hour: 1, day: 1 },
				},
			]),
		).toBe(true);
		expect(
			isValidTimeSlotArray([
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 2, hour: 1, day: 1 },
				},
				{
					start: { minute: 3, hour: 1, day: 1 },
					end: { minute: 2, hour: 1, day: 1 },
				},
			]),
			'allow last entry wrap over',
		).toBe(true);
		expect(
			isValidTimeSlotArray([
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 2, hour: 1, day: 1 },
				},
				{
					start: { minute: 3, hour: 1, day: 1 },
					end: { minute: 2, hour: 1, day: 1 },
				},
				{
					start: { minute: 3, hour: 1, day: 1 },
					end: { minute: 4, hour: 1, day: 1 },
				},
			]),
			"don't allow wrap over for entries other than last one",
		).toBe(false);
		expect(
			isValidTimeSlotArray([
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 5, hour: 1, day: 1 },
				},
				{
					start: { minute: 3, hour: 1, day: 1 },
					end: { minute: 6, hour: 1, day: 1 },
				},
			]),
		).toBe(false);
		expect(
			isValidTimeSlotArray([
				{
					start: { minute: 1, hour: 1, day: 1 },
					end: { minute: 1, hour: 1, day: 3 },
				},
				{
					start: { minute: 2, hour: 1, day: 3 },
					end: { minute: 1, hour: 1, day: 1 },
				},
			]),
		).toBe(true);
	});
	test('getNextTimeSlot', () => {
		const A = {
			start: { day: 1, hour: 1, minute: 1 },
			end: { day: 3, hour: 0, minute: 0 },
		};
		const B = {
			start: { day: 3, hour: 1, minute: 2 },
			end: { day: 2, hour: 1, minute: 1 },
		}; // the next week of B actually contains A (Sunday, Monday, and Tuesday)
		expect(getNextTimeSlot([A, B], makeDateTime(3, 3, 3))).toEqual(B);
		expect(getNextTimeSlot([A, B], makeDateTime(3, 1, 2))).toEqual(B);
		expect(getNextTimeSlot([A, B], makeDateTime(3, 1, 1))).toEqual(B);
		expect(getNextTimeSlot([A, B], makeDateTime(3, 0, 1))).toEqual(B);
		expect(getNextTimeSlot([A, B], makeDateTime(3, 0, 0))).toEqual(A);
		expect(getNextTimeSlot([A, B], makeDateTime(2, 0, 0))).toEqual(A);
		expect(getNextTimeSlot([A, B], makeDateTime(0, 0, 0))).toEqual(A);
		expect(getNextTimeSlot([], makeDateTime(0, 0, 0))).toEqual(null);
		expect(getNextTimeSlot([A], makeDateTime(6, 0, 0))).toEqual(A);
		expect(() => getNextTimeSlot([B, A], makeDateTime(3, 3, 3))).toThrow();
	});
});
