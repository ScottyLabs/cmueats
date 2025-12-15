/**
 * Safe localStorage utilities that handle disabled cookies/storage gracefully
 */

export function safeGetItem(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`localStorage.getItem failed for key "${key}":`, error);
        return null;
    }
}

export function safeSetItem(key: string, value: string): boolean {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`localStorage.setItem failed for key "${key}":`, error);
        return false;
    }
}

export function safeRemoveItem(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`localStorage.removeItem failed for key "${key}":`, error);
        return false;
    }
}

/**
 * Check if localStorage is available and working
 */
export function isStorageAvailable(): boolean {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}
