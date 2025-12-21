import { DateTime, WeekdayNumbers } from "luxon";

/**
 *
 * @param day 0-6 (0 is Sunday)
 * @param hour 0-23
 * @param minute 0-59
 * @returns
 */
export default function makeDateTime(day: number, hour: number, minute: number) {
	return DateTime.fromObject({
		hour,
		minute,
		weekday: (day === 0 ? 7 : day) as WeekdayNumbers,
	});
}

/**
 * Converts a time slot object to Unix timestamp (milliseconds)
 */
export function timeSlotToMillis(timeSlot: { day: number; hour: number; minute: number }): number {
	return makeDateTime(timeSlot.day, timeSlot.hour, timeSlot.minute).toMillis();
}