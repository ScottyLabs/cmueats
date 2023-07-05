import axios from 'axios';
import { DateTime } from 'luxon';

const BASE_URL = 'https://dining.apis.scottylabs.org/locations';
const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const WEEK_MINUTES = 7 * 24 * 60;
// Remove .setZone('America/New_York') and change time in computer settings when testing
const now = DateTime.now().setZone('America/New_York');

/**
 * Convert a string to title case
 * @param {string} str string to convert to title case
 * @returns the same string, but in title case
 */
function toTitleCase(str) {
  return str
    .trim(' ')
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word.length > 1) {
        return word[0].toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

/**
 * Convert an API time entry to minutes
 * @param {int} days The number of days since Sunday (0 if Sunday)
 * @param {int} hours The number of hours (0-23) since midnight (0 if midnight)
 * @param {int} minutes The number of minutes since the start of the hour (0-59)
 * @returns the number of minutes since the start of the week
 */
function toMinutes(days, hours, minutes) {
  return days * 24 * 60 + hours * 60 + minutes;
}

/**
 * Determine if a given time slot is open, i.e. encompasses the current time
 * @param {int} start The time the location opens (in minutes since midnight on Sunday)
 * @param {int} end The time slot the location closes (in minutes since midnight on Sunday)
 * @returns true if the location is open, false otherwise
 */
function currentlyOpen(start, end) {
  const weekday = now.weekday === 7 ? 0 : now.weekday;
  const nowMinutes = toMinutes(weekday, now.hour, now.minute);

  return start <= nowMinutes && nowMinutes <= end;
}

/**
 * Gets the next available time slot for a given location
 * @param {any[]} times List of time slots for a location
 * @returns The next time slot when the location opens
 */
function getNextTimeSlot(times) {
  const weekday = now.weekday === 7 ? 0 : now.weekday;
  const nowMinutes = toMinutes(weekday, now.hour, now.minute);

  // Find the first time slot that opens after now
  const nextTimeSlot = times.find(({ start }) => start.rawMinutes >= nowMinutes);

  if (nextTimeSlot == null) {
    // End of the week. Return the first time slot instead.
    return times[0];
  }
  return nextTimeSlot;
}

/**
 * Return the status message for a dining location, given the current or next available
 * time slot, and whether or not the location is currently open
 * @param {{ start, end }} timeSlot The current or next available time slot
 * @param {boolean} isOpen whether or not the location is currently open
 * @returns {str} The status message for the location
 */
function getStatusMessage(timeSlot, isOpen) {
  if (timeSlot == null) {
    return 'Closed until further notice';
  }
  const weekday = now.weekday === 7 ? 0 : now.weekday;
  const nowMinutes = toMinutes(weekday, now.hour, now.minute);

  const { start, end } = timeSlot;
  // If open, look at when timeSlot closes. If closed, look at when timeSlot opens.
  const refTime = isOpen ? end : start;
  const timeSlotWeekday = refTime.day;

  // Get difference
  let diff = isOpen
    ? refTime.rawMinutes - nowMinutes
    : refTime.rawMinutes - nowMinutes;
  if (diff < 0) {
    diff += WEEK_MINUTES;
  }
  const diffMinutes = diff % 60;
  const diffHours = Math.floor((diff / 60) % 24);
  let weekdayDiff = timeSlotWeekday - now.weekday;
  if (weekdayDiff < 0) {
    weekdayDiff += 7;
  }

  // Create time string
  const { hour, minute } = refTime;
  const hour12H = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const minutePadded = minute < 10 ? `0${minute}` : minute;
  const time = `${hour12H}:${minutePadded} ${ampm}`;

  const action = isOpen ? 'Closes' : 'Opens';
  const day = WEEKDAYS[timeSlot.start.day];
  const hourLabel = diffHours === 1 ? 'hour' : 'hours';
  const minuteLabel = diffMinutes === 1 ? 'minute' : 'minutes';

  if (weekdayDiff > 1) {
    return `${action} in ${weekdayDiff} days (${day} at ${time})`;
  }

  if (weekdayDiff === 1) {
    if (diffHours >= 24) {
      return `${action} in a day (tomorrow at ${time})`;
    }

    /* Addresses bug for midnight opening/closing times */
    if (diffHours === 0) {
      return `${action} in ${diffMinutes} ${minuteLabel} (today at ${time})`;
    }

    return `${action} in ${diffHours} ${hourLabel} (tomorrow at ${time})`;
  }

  if (weekdayDiff === 0) {
    if (diffHours >= 1) {
      return `${action} in ${diffHours} ${hourLabel} (today at ${time})`;
    }

    return `${action} in ${diffMinutes} ${minuteLabel} (today at ${time})`;
  }

  // Default return statement
  return 'Status not available';
}

async function queryLocations() {
  try {
    // Query locations
    const { data } = await axios.get(BASE_URL);
    if (data == null) {
      return [];
    }

    // Convert names to title case and append "raw time" to each time slot
    const { locations } = data;
    const updatedLocations = locations.map((location) => {
      let updatedName = toTitleCase(location.name);
      if (updatedName === "Ruge Atrium - Rothberg's Roasters Ii") {
        updatedName = "Ruge Atrium - Rothberg's Roasters II";
      }

      const mainURL = (location.url);

      const updatedTimes = location.times.map(({ start, end }) => ({
        start: {
          ...start,
          rawMinutes: toMinutes(start.day, start.hour, start.minute),
        },
        end: {
          ...end,
          rawMinutes: toMinutes(end.day, end.hour, end.minute),
        },
      }));

      return {
        ...location,
        name: updatedName,
        url: mainURL,
        times: updatedTimes,
      };
    });

    // Determine status of locations
    const processedLocations = updatedLocations.map((location) => {
      const { times } = location;
      const timeSlot = times.find(({ start, end }) => currentlyOpen(
        start.rawMinutes,
        end.rawMinutes,
      ));

      if (timeSlot != null) {
        // Location is open
        const diff = (timeSlot.end.rawMinutes
          - toMinutes(now.weekday, now.hour, now.minute)
          + WEEK_MINUTES) % WEEK_MINUTES;

        return {
          ...location,
          isOpen: true,
          statusMsg: getStatusMessage(timeSlot, true),
          changesSoon: diff <= 60,
          timeUntilClosed: diff,
        };
      }

      // Location is closed
      const nextTimeSlot = getNextTimeSlot(times);
      let diff = 0;
      let closedUntilFurtherNotice = false;

      if (!nextTimeSlot) {
        closedUntilFurtherNotice = true;
      }

      if (nextTimeSlot) {
        diff = (nextTimeSlot.start.rawMinutes
          - toMinutes(now.weekday, now.hour, now.minute));
        if (diff < 0) {
          diff += WEEK_MINUTES;
        }
      }

      return {
        ...location,
        isOpen: false,
        statusMsg: getStatusMessage(nextTimeSlot, false),
        changesSoon: diff <= 60 && closedUntilFurtherNotice === false,
        closedTemporarily: closedUntilFurtherNotice,
        timeUntilOpen: diff,
      };
    });

    return processedLocations;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default queryLocations;
