import { DateTime } from 'luxon';
import { getLocationStatus, getStatusMessage } from '../../src/util/locations';
import { describe, expect, it } from 'vitest';
import { ITimeSlotTime } from '../../src/types/locationTypes';

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
	return DateTime.fromObject({ hour, minute, weekday: day === 0 ? 7 : day });
}

test.each([
	{
		isOpen: false,
		nextTime: { day: 2, hour: 2, minute: 2 },
		now: { day: 2, hour: 2, minute: 3 },
		expectedString: 'Opens in 6 days (Tuesday at 2:02 AM)',
	},
	{
		isOpen: false,
		nextTime: { day: 3, hour: 0, minute: 2 },
		now: { day: 2, hour: 23, minute: 3 },
		expectedString: 'Opens in 59 minutes (today at 12:02 AM)',
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
		expectedString: 'Opens in 1 day (today at 12:00 AM)',
	},
	{
		isOpen: false,
		nextTime: { day: 1, hour: 0, minute: 0 },
		now: { day: 0, hour: 23, minute: 30 },
		expectedString: 'Opens in 30 minutes (today at 12:00 AM)',
	},
	{
		isOpen: false,
		nextTime: { day: 1, hour: 0, minute: 0 },
		now: { day: 0, hour: 20, minute: 30 },
		expectedString: 'Opens in 3 hours (today at 12:00 AM)',
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
		expectedString: 'Opens in 1 day (today at 2:00 AM)',
	},
	{
		isOpen: false,
		nextTime: { day: 1, hour: 5, minute: 0 },
		now: { day: 0, hour: 0, minute: 30 },
		expectedString: 'Opens in 1 day (today at 5:00 AM)',
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
		expectedString: 'Opens in 9 hours (today at 5:00 AM)',
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
	expect(status.closedLongTerm).toBeFalsy();
	if (!status.closedLongTerm) {
		// This has to be true given the line above (but TS doesn't know that)
		expect(status.changesSoon).toBeTruthy();
		expect(status.isOpen).toBeTruthy();
		expect(status.timeUntil).toEqual(0);
	}
});