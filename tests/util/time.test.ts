import { ITimeRangeList } from '../../src/types/locationTypes';
import {
    isValidTimeSlotArray,
    getNextTimeSlot,
    getApproximateTimeStringFromMinutes,
    getTimeSlotsString,
} from '../../src/util/time';
import makeDateTime, { timeSlotToMillis } from './helper';

describe('getApproximateTimeStringFromMinutes', () => {
    test('basic behavior', () => {
        expect(getApproximateTimeStringFromMinutes(0)).toBe('0 minutes');
        expect(getApproximateTimeStringFromMinutes(1)).toBe('1 minute');
        expect(getApproximateTimeStringFromMinutes(2)).toBe('2 minutes');
        expect(getApproximateTimeStringFromMinutes(59)).toBe('59 minutes');
        expect(getApproximateTimeStringFromMinutes(60)).toBe('1 hour');
        expect(getApproximateTimeStringFromMinutes(61)).toBe('1 hour');
        expect(getApproximateTimeStringFromMinutes(119)).toBe('2 hours');
        expect(getApproximateTimeStringFromMinutes(120)).toBe('2 hours');
        expect(getApproximateTimeStringFromMinutes(1439)).toBe('24 hours');
        expect(getApproximateTimeStringFromMinutes(1440)).toBe('1 day');
        expect(getApproximateTimeStringFromMinutes(1441)).toBe('1 day');
        expect(getApproximateTimeStringFromMinutes(2880)).toBe('2 days');
    });
});

test('isValidTimeSlotArray', () => {
    expect(
        isValidTimeSlotArray([
            {
                start: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 2, hour: 1, day: 1 }),
            },
            {
                start: timeSlotToMillis({ minute: 2, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 3, hour: 1, day: 1 }),
            },
        ]),
    ).toBe(false);
    expect(
        isValidTimeSlotArray([
            {
                start: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 2, hour: 1, day: 1 }),
            },
            {
                start: timeSlotToMillis({ minute: 3, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 4, hour: 1, day: 1 }),
            },
        ]),
    ).toBe(true);
    expect(
        isValidTimeSlotArray([
            {
                start: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 2, hour: 1, day: 1 }),
            },
            {
                start: timeSlotToMillis({ minute: 3, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 2, hour: 1, day: 1 }),
            },
            {
                start: timeSlotToMillis({ minute: 3, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 4, hour: 1, day: 1 }),
            },
        ]),
    ).toBe(false); // don't allow wrap over for entries other than last one

    expect(
        isValidTimeSlotArray([
            {
                start: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 5, hour: 1, day: 1 }),
            },
            {
                start: timeSlotToMillis({ minute: 3, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 6, hour: 1, day: 1 }),
            },
        ]),
    ).toBe(false);
    expect(
        isValidTimeSlotArray([
            {
                start: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 1, hour: 1, day: 3 }),
            },
            {
                start: timeSlotToMillis({ minute: 2, hour: 1, day: 3 }),
                end: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
            },
        ]),
    ).toBe(false); // wrap-around time should not overlap first time
    expect(
        isValidTimeSlotArray([
            {
                start: timeSlotToMillis({ minute: 1, hour: 1, day: 1 }),
                end: timeSlotToMillis({ minute: 1, hour: 1, day: 3 }),
            },
            {
                start: timeSlotToMillis({ minute: 2, hour: 1, day: 3 }),
                end: timeSlotToMillis({ minute: 0, hour: 1, day: 1 }),
            },
        ]),
    ).toBe(true); // wrap-around time does not overlap first time. good.
});

test('getNextTimeSlot', () => {
    const A = {
        start: timeSlotToMillis({ day: 1, hour: 1, minute: 1 }),
        end: timeSlotToMillis({ day: 3, hour: 0, minute: 0 }),
    };
    const B = {
        start: timeSlotToMillis({ day: 3, hour: 1, minute: 2 }),
        end: timeSlotToMillis({ day: 0, hour: 0, minute: 0 }),
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
    expect(getNextTimeSlot([], makeDateTime(0, 0, 0))).toEqual(undefined);
    expect(getNextTimeSlot([A], makeDateTime(6, 0, 0))).toEqual(A);
    expect(
        getNextTimeSlot(
            [
                {
                    start: timeSlotToMillis({
                        day: 6,
                        hour: 0,
                        minute: 0,
                    }),
                    end: timeSlotToMillis({
                        day: 1,
                        hour: 23,
                        minute: 59,
                    }),
                },
            ],
            makeDateTime(6, 0, 0),
        ),
    ).toEqual({
        start: timeSlotToMillis({
            day: 6,
            hour: 0,
            minute: 0,
        }),
        end: timeSlotToMillis({
            day: 1,
            hour: 23,
            minute: 59,
        }),
    });
    expect(() => getNextTimeSlot([B, A], makeDateTime(3, 3, 3))).toThrow(); // [B,A] is improperly sorted
});

test('getTimeSlotsString', () => {
    const today = makeDateTime(0, 0, 0); // Sunday at midnight as reference point
    const testCases: { input: ITimeRangeList; expected: string[] }[] = [
        {
            input: [
                {
                    start: timeSlotToMillis({ day: 0, hour: 0, minute: 0 }),
                    end: timeSlotToMillis({ day: 3, hour: 0, minute: 0 }),
                },
            ],
            // semantically, Wednesday should have 12AM - 12AM, but that doesn't make too much sense
            expected: ['Open 24 hours', 'Open 24 hours', 'Open 24 hours', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
        },
        {
            input: [
                {
                    start: timeSlotToMillis({ day: 0, hour: 0, minute: 0 }),
                    end: timeSlotToMillis({ day: 2, hour: 23, minute: 59 }),
                },
            ],
            expected: ['Open 24 hours', 'Open 24 hours', 'Open 24 hours', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
        },
        {
            // splitting with uneven edges
            input: [
                {
                    start: timeSlotToMillis({ day: 0, hour: 7, minute: 0 }),
                    end: timeSlotToMillis({ day: 3, hour: 7, minute: 0 }),
                },
            ],
            expected: [
                '7:00 AM - 11:59 PM',
                'Open 24 hours',
                'Open 24 hours',
                '12:00 AM - 7:00 AM',
                'CLOSED',
                'CLOSED',
                'CLOSED',
            ],
        },
        {
            // don't split if interval duration is under 24 hours
            input: [
                {
                    start: timeSlotToMillis({ day: 2, hour: 7, minute: 0 }),
                    end: timeSlotToMillis({ day: 3, hour: 6, minute: 0 }),
                },
            ],
            expected: ['CLOSED', 'CLOSED', '7:00 AM - 6:00 AM', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
        },
    ];
    for (const testCase of testCases) {
        expect(getTimeSlotsString(testCase.input, today)).toEqual(testCase.expected);
    }
});
