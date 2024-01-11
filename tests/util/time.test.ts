import {
	currentlyOpen,
	isTimeSlotTime,
	minutesSinceSundayDateTime,
	isTimeSlot,
	getTimeString,
	isValidTimeSlotArray,
	getNextTimeSlot,
} from '../../src/util/time';
import makeDateTime from './helper';

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
		for (let d = 0; d < 7; d++)
			for (let h = 0; h < 23; h++)
				for (let m = 0; m < 60; m++) {
					expect(
						currentlyOpen(
							{
								start: { day: 1, hour: 8, minute: 0 },
								end: { day: 1, hour: 7, minute: 58 },
							}, //basically every moment is open
							makeDateTime(d, h, m),
						),
					).toBe(!(d === 1 && h === 7 && m === 59)); //except for this one
				}
	});
	test('closes Sat midnight', () => {
		const openSlot = {
			start: { day: 6, hour: 10, minute: 0 },
			end: { day: 0, hour: 0, minute: 0 },
		};
		expect(currentlyOpen(openSlot, makeDateTime(2, 1, 1))).toBe(false);
		expect(currentlyOpen(openSlot, makeDateTime(6, 10, 0))).toBe(true);
		expect(currentlyOpen(openSlot, makeDateTime(6, 23, 59))).toBe(true);
		expect(currentlyOpen(openSlot, makeDateTime(0, 0, 0))).toBe(true);
		expect(currentlyOpen(openSlot, makeDateTime(0, 0, 1))).toBe(false);
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
	expect(getTimeString({ day: 1, hour: 23, minute: 59 })).toBe('11:59 PM');
	expect(() => getTimeString({ day: 1, hour: 23, minute: 60 })).toThrow();
	expect(() => getTimeString({ day: 1, hour: 23, minute: 59.5 })).toThrow();
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
	).toBe(true); // allow last entry wrap over
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
	).toBe(false); //	don't allow wrap over for entries other than last one

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
		end: { day: 0, hour: 0, minute: 0 },
	}; // B wraps around
	expect(getNextTimeSlot([A, B], makeDateTime(3, 3, 3))).toEqual(B);
	expect(getNextTimeSlot([A, B], makeDateTime(3, 1, 2))).toEqual(B);
	expect(getNextTimeSlot([A, B], makeDateTime(3, 1, 1))).toEqual(B);
	expect(getNextTimeSlot([A, B], makeDateTime(6, 23, 59))).toEqual(B);
	expect(getNextTimeSlot([A, B], makeDateTime(3, 0, 1))).toEqual(B);
	expect(getNextTimeSlot([A, B], makeDateTime(3, 0, 0))).toEqual(A);
	expect(getNextTimeSlot([A, B], makeDateTime(2, 0, 0))).toEqual(A);
	expect(getNextTimeSlot([A, B], makeDateTime(1, 1, 1))).toEqual(A);
	expect(getNextTimeSlot([A, B], makeDateTime(0, 0, 0))).toEqual(A);
	expect(getNextTimeSlot([], makeDateTime(0, 0, 0))).toEqual(null);
	expect(getNextTimeSlot([A], makeDateTime(6, 0, 0))).toEqual(A);
	expect(() => getNextTimeSlot([B, A], makeDateTime(3, 3, 3))).toThrow(); //[B,A] is improperly sorted
});
