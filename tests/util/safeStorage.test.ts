import { vi } from 'vitest';
import { safeGetItem, safeSetItem, safeRemoveItem, isStorageAvailable } from '../../src/util/safeStorage';

// Mock console.warn to avoid noise in test output
const originalWarn = console.warn;
beforeEach(() => {
    console.warn = vi.fn();
});
afterEach(() => {
    console.warn = originalWarn;
});

describe('safeStorage utilities', () => {
    // Store original localStorage methods
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;

    afterEach(() => {
        // Restore original localStorage methods after each test
        Storage.prototype.getItem = originalGetItem;
        Storage.prototype.setItem = originalSetItem;
        Storage.prototype.removeItem = originalRemoveItem;
        localStorage.clear();
    });

    describe('safeGetItem', () => {
        test('returns value when localStorage works', () => {
            localStorage.setItem('testKey', 'testValue');
            expect(safeGetItem('testKey')).toBe('testValue');
        });

        test('returns null when key does not exist', () => {
            expect(safeGetItem('nonExistentKey')).toBeNull();
        });

        test('returns null and logs warning when localStorage.getItem throws', () => {
            Storage.prototype.getItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });

            const result = safeGetItem('testKey');
            expect(result).toBeNull();
            expect(console.warn).toHaveBeenCalledWith(
                'localStorage.getItem failed for key "testKey":',
                expect.any(Error)
            );
        });
    });

    describe('safeSetItem', () => {
        test('returns true and sets value when localStorage works', () => {
            const result = safeSetItem('testKey', 'testValue');
            expect(result).toBe(true);
            expect(localStorage.getItem('testKey')).toBe('testValue');
        });

        test('returns false and logs warning when localStorage.setItem throws', () => {
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });

            const result = safeSetItem('testKey', 'testValue');
            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalledWith(
                'localStorage.setItem failed for key "testKey":',
                expect.any(Error)
            );
        });

        test('handles QuotaExceededError gracefully', () => {
            Storage.prototype.setItem = vi.fn(() => {
                const error = new Error('QuotaExceededError');
                error.name = 'QuotaExceededError';
                throw error;
            });

            const result = safeSetItem('testKey', 'testValue');
            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('safeRemoveItem', () => {
        test('returns true and removes item when localStorage works', () => {
            localStorage.setItem('testKey', 'testValue');
            const result = safeRemoveItem('testKey');
            expect(result).toBe(true);
            expect(localStorage.getItem('testKey')).toBeNull();
        });

        test('returns false and logs warning when localStorage.removeItem throws', () => {
            Storage.prototype.removeItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });

            const result = safeRemoveItem('testKey');
            expect(result).toBe(false);
            expect(console.warn).toHaveBeenCalledWith(
                'localStorage.removeItem failed for key "testKey":',
                expect.any(Error)
            );
        });
    });

    describe('isStorageAvailable', () => {
        test('returns true when localStorage is working', () => {
            expect(isStorageAvailable()).toBe(true);
        });

        test('returns false when localStorage.setItem throws', () => {
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });

            expect(isStorageAvailable()).toBe(false);
        });

        test('returns false when localStorage.removeItem throws', () => {
            Storage.prototype.removeItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });

            expect(isStorageAvailable()).toBe(false);
        });

        test('cleans up test key even when operations fail', () => {
            // This test ensures the function attempts to clean up even when removeItem fails
            const mockRemove = vi.fn(() => {
                throw new Error('removeItem failed');
            });
            Storage.prototype.removeItem = mockRemove;

            const result = isStorageAvailable();
            expect(result).toBe(false);

            // Verify removeItem was called (cleanup attempt was made)
            expect(mockRemove).toHaveBeenCalledWith('__storage_test__');
        });
    });

    describe('integration scenarios', () => {
        test('handles completely disabled localStorage', () => {
            // Simulate completely disabled localStorage
            Storage.prototype.getItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });
            Storage.prototype.removeItem = vi.fn(() => {
                throw new Error('localStorage disabled');
            });

            expect(isStorageAvailable()).toBe(false);
            expect(safeGetItem('key')).toBeNull();
            expect(safeSetItem('key', 'value')).toBe(false);
            expect(safeRemoveItem('key')).toBe(false);

            // Verify warnings were logged
            expect(console.warn).toHaveBeenCalledTimes(3);
        });

        test('handles partial localStorage failures', () => {
            // Only setItem fails (like in private browsing with quota exceeded)
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('QuotaExceededError');
            });

            expect(isStorageAvailable()).toBe(false);
            expect(safeGetItem('existingKey')).toBeNull(); // No existing data
            expect(safeSetItem('key', 'value')).toBe(false);
            expect(safeRemoveItem('key')).toBe(true); // This should still work
        });
    });
});