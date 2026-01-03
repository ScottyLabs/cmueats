import { DateTime } from 'luxon';

/**
 *
 * @param date string in the format of eg. 11/2/26 9:31 AM
 * @returns millis unix timestamp
 */
export function date(date: string) {
    const parsedDate = DateTime.fromFormat(date, 'M/d/yy h:mm a', {
        zone: 'America/New_York', // important! enforces timezone
    });
    if (!parsedDate.isValid) throw new Error(`Malformed date string ${date}`);
    return parsedDate.toMillis();
}
export function dateObj(date: string) {
    const parsedDate = DateTime.fromFormat(date, 'M/d/yy h:mm a', {
        zone: 'America/New_York', // important! enforces timezone
    });
    if (!parsedDate.isValid) throw new Error(`Malformed date string ${date}`);
    return parsedDate;
}
