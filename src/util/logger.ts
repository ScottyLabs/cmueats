/* eslint-disable no-console */

export function logError(...args: unknown[]) {
    if (import.meta.env.DEV) {
        console.error(...args);
    }
}

export function logWarn(...args: unknown[]) {
    if (import.meta.env.DEV) {
        console.warn(...args);
    }
}

export function logInfo(...args: unknown[]) {
    if (import.meta.env.DEV) {
        console.info(...args);
    }
}

/* eslint-enable no-console */
