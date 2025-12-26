import { DateTime } from 'luxon';
import {
    isValidTimeSlotArray,
    getApproximateTimeStringFromMinutes,
    next7DaysReadableString,
} from '../../src/util/time';
import { date, dateObj } from './util';

describe('getApproximateTimeStringFromMinutes', () => {
    test.each([
        [0.3, '0 minutes'],
        [0.5, '1 minute'],
        [4, '4 minutes'],
        [0, '0 minutes'],
        [30.5, '31 minutes'],
        [59.5, '1 hour'],
        [59, '59 minutes'],
        [62, '1 hour'],
        [60, '1 hour'],
        [119, '2 hours'],
        [120, '2 hours'],
        [60 * 24 - 1, '1 day'],
        [60 * 24, '1 day'],
        [60 * 24.2, '1 day'],
        [60 * 35.8, '1 day'],
        [60 * 36, '2 days'],
        [60 * 24 * 2, '2 days'],
        [60 * 24 * 5, '5 days'],
        [60 * 24 * 9.2, 'a week'],
        [60 * 24 * 10.4, 'a week'],
        [60 * 24 * 10.5, '2 weeks'],
        [60 * 24 * 365, '52 weeks'],
    ])('basic testing test %#', (minutes: number, expected: string) => {
        expect(getApproximateTimeStringFromMinutes(minutes)).toBe(expected);
    });
    test('edge cases', () => {
        expect(() => getApproximateTimeStringFromMinutes(-1)).toThrow();
    });
});

test.each([
    [
        [
            [1, 2],
            [1, 2],
        ],
        false,
    ],
    [
        [
            [1, 2],
            [2, 3],
        ],
        false,
    ],
    [
        [
            [1, 2],
            [3, 9],
        ],
        true,
    ],
    [[[1, 2]], true],
])('isValidTimeSlotArray', (slots, expectedIsValid) => {
    expect(isValidTimeSlotArray(slots.map((slot) => ({ start: slot[0], end: slot[1] })))).toBe(expectedIsValid);
});

test.each([
    {
        input: [
            {
                start: {
                    day: 0,
                    hour: 0,
                    minute: 0,
                },
                end: {
                    day: 3,
                    hour: 0,
                    minute: 0,
                },
            },
        ],
        // semantically, Wednesday should have 12AM - 12AM, but that doesn't make too much sense
        expected: ['Open 24 hours', 'Open 24 hours', 'Open 24 hours', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
    },
    {
        input: [
            {
                start: {
                    day: 0,
                    hour: 0,
                    minute: 0,
                },
                end: {
                    day: 2,
                    hour: 23,
                    minute: 59,
                },
            },
        ],
        expected: ['Open 24 hours', 'Open 24 hours', 'Open 24 hours', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
    },
    {
        // splitting with uneven edges
        input: [
            {
                start: {
                    day: 0,
                    hour: 7,
                    minute: 0,
                },
                end: {
                    day: 3,
                    hour: 7,
                    minute: 0,
                },
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
                start: {
                    day: 2,
                    hour: 7,
                    minute: 0,
                },
                end: {
                    day: 3,
                    hour: 6,
                    minute: 0,
                },
            },
        ],
        expected: ['CLOSED', 'CLOSED', '7:00 AM - 6:00 AM', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
    },
    {
        // split if interval duration is over (or at) 24 hours
        input: [
            {
                start: {
                    day: 2,
                    hour: 7,
                    minute: 0,
                },
                end: {
                    day: 3,
                    hour: 7,
                    minute: 0,
                },
            },
        ],
        expected: ['CLOSED', 'CLOSED', '7:00 AM - 11:59 PM', '12:00 AM - 7:00 AM', 'CLOSED', 'CLOSED', 'CLOSED'],
    },

    {
        // stress-test
        input: [
            {
                start: {
                    day: 1,
                    hour: 10,
                    minute: 2,
                },
                end: {
                    day: 2,
                    hour: 8,
                    minute: 0,
                },
            },
            {
                start: {
                    day: 2,
                    hour: 9,
                    minute: 2,
                },
                end: {
                    day: 2,
                    hour: 12,
                    minute: 0,
                },
            },
        ],
        expected: ['CLOSED', '10:02 AM - 8:00 AM', '9:02 AM - 12:00 PM', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
    },
    {
        // normal test
        input: [
            {
                start: {
                    day: 1,
                    hour: 8,
                    minute: 0,
                },
                end: {
                    day: 1,
                    hour: 16,
                    minute: 0,
                },
            },
            {
                start: {
                    day: 2,
                    hour: 8,
                    minute: 0,
                },
                end: {
                    day: 2,
                    hour: 16,
                    minute: 0,
                },
            },
            {
                start: {
                    day: 3,
                    hour: 8,
                    minute: 0,
                },
                end: {
                    day: 3,
                    hour: 16,
                    minute: 0,
                },
            },
            {
                start: {
                    day: 4,
                    hour: 8,
                    minute: 0,
                },
                end: {
                    day: 4,
                    hour: 16,
                    minute: 0,
                },
            },
            {
                start: {
                    day: 5,
                    hour: 8,
                    minute: 0,
                },
                end: {
                    day: 5,
                    hour: 16,
                    minute: 0,
                },
            },
        ],
        expected: [
            'CLOSED',
            '8:00 AM - 4:00 PM',
            '8:00 AM - 4:00 PM',
            '8:00 AM - 4:00 PM',
            '8:00 AM - 4:00 PM',
            '8:00 AM - 4:00 PM',
            'CLOSED',
        ],
    },
    {
        input: [
            {
                start: {
                    day: 1,
                    hour: 11,
                    minute: 30,
                },
                end: {
                    day: 1,
                    hour: 13,
                    minute: 30,
                },
            },
            {
                start: {
                    day: 2,
                    hour: 11,
                    minute: 30,
                },
                end: {
                    day: 2,
                    hour: 13,
                    minute: 30,
                },
            },
            {
                start: {
                    day: 3,
                    hour: 11,
                    minute: 30,
                },
                end: {
                    day: 3,
                    hour: 13,
                    minute: 30,
                },
            },
            {
                start: {
                    day: 4,
                    hour: 11,
                    minute: 30,
                },
                end: {
                    day: 4,
                    hour: 13,
                    minute: 30,
                },
            },
            {
                start: {
                    day: 5,
                    hour: 11,
                    minute: 30,
                },
                end: {
                    day: 5,
                    hour: 13,
                    minute: 30,
                },
            },
        ],
        expected: [
            'CLOSED',
            '11:30 AM - 1:30 PM',
            '11:30 AM - 1:30 PM',
            '11:30 AM - 1:30 PM',
            '11:30 AM - 1:30 PM',
            '11:30 AM - 1:30 PM',
            'CLOSED',
        ],
    },
])('next7DaysReadableString test %#', ({ input, expected }) => {
    expect(
        next7DaysReadableString(
            input.map(({ start, end }) => ({
                // picking 2034 since Jan 1st is a Sunday (the above are just legacy test cases that were transferred over)
                start: DateTime.fromObject(
                    {
                        year: 2034,
                        month: 1,
                        day: start.day + 1,
                        hour: start.hour,
                        minute: start.minute,
                    },
                    { zone: 'America/New_York' },
                ).toMillis(),
                end: DateTime.fromObject(
                    {
                        year: 2034,
                        month: 1,
                        day: end.day + 1,
                        hour: end.hour,
                        minute: end.minute,
                    },
                    { zone: 'America/New_York' },
                ).toMillis(),
            })),
            DateTime.fromObject({ year: 2034, month: 1, day: 1 }, { zone: 'America/New_York' }),
        ),
    ).toEqual(expected);
});

test.each([
    {
        input: {
            times: [{ start: date('1/1/25 2:00 PM'), end: date('2/1/25 2:00 PM') }],
            now: dateObj('2/1/25 2:00 PM'),
        },
        expected: ['12:00 AM - 2:00 PM', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'],
    },
    {
        input: {
            times: [{ start: date('1/1/25 2:00 PM'), end: date('1/6/25 2:00 PM') }],
            now: dateObj('1/1/25 2:00 PM'),
        },
        expected: [
            '2:00 PM - 11:59 PM',
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
            '12:00 AM - 2:00 PM',
            'CLOSED',
        ],
    },
    {
        input: {
            times: [{ start: date('1/1/25 2:00 PM'), end: date('1/6/26 2:00 PM') }],
            now: dateObj('3/4/25 2:00 PM'),
        },
        expected: [
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
            'Open 24 hours',
        ],
    },
    {
        input: {
            times: [
                { start: date('1/1/25 2:00 PM'), end: date('1/2/25 2:00 AM') },
                { start: date('1/3/25 2:00 PM'), end: date('1/4/25 2:00 AM') },
                { start: date('1/4/25 2:00 PM'), end: date('1/5/25 2:00 AM') },
            ],
            now: dateObj('1/1/25 12:00 AM'),
        },
        expected: [
            '2:00 PM - 2:00 AM',
            'CLOSED',
            '2:00 PM - 2:00 AM',
            '2:00 PM - 2:00 AM',
            'CLOSED',
            'CLOSED',
            'CLOSED',
        ],
    },
    {
        input: {
            times: [
                { start: date('1/1/25 2:00 PM'), end: date('1/2/25 2:00 AM') },
                { start: date('1/3/25 2:00 PM'), end: date('1/4/25 2:00 AM') },
                { start: date('1/4/25 2:00 PM'), end: date('1/5/25 2:00 AM') },
            ],
            now: dateObj('1/1/25 11:59 PM'),
        },
        expected: [
            '2:00 PM - 2:00 AM',
            'CLOSED',
            '2:00 PM - 2:00 AM',
            '2:00 PM - 2:00 AM',
            'CLOSED',
            'CLOSED',
            'CLOSED',
        ],
    },
    {
        input: {
            times: [{ start: date('3/7/26 2:30 AM'), end: date('3/8/26 3:29 AM') }],
            now: dateObj('3/7/26 11:59 PM'),
        },
        expected: ['2:30 AM - 11:59 PM', '12:00 AM - 3:29 AM', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'], // DST weirdness
    },
    {
        input: {
            times: [{ start: date('10/31/26 1:30 AM'), end: date('11/1/26 3:30 AM') }],
            now: dateObj('10/31/26 11:59 PM'),
        },
        expected: ['1:30 AM - 11:59 PM', '12:00 AM - 3:30 AM', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'], // nothing special
    },
    {
        input: {
            times: [
                { start: date('10/31/26 1:30 AM'), end: date('11/1/26 9:30 AM') },
                { start: date('11/1/26 10:30 AM'), end: date('11/2/26 9:30 AM') },
                { start: date('11/2/26 9:31 AM'), end: date('11/3/26 9:30 AM') },
            ],

            now: dateObj('10/30/26 11:59 PM'),
        },
        expected: [
            'CLOSED',
            '1:30 AM - 11:59 PM',
            '12:00 AM - 9:30 AM, 10:30 AM - 9:30 AM',
            '9:31 AM - 9:30 AM',
            'CLOSED',
            'CLOSED',
            'CLOSED',
        ], // stress test
    },
    {
        input: {
            times: [{ start: date('10/31/26 1:30 AM'), end: date('10/31/26 1:30 AM') }],

            now: dateObj('10/30/26 11:59 PM'),
        },
        expected: ['CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'], // removes trivial time slots
    },
])('getTimeSlotsString, new cases %#', ({ input, expected }) => {
    expect(next7DaysReadableString(input.times, input.now)).toEqual(expected);
});
