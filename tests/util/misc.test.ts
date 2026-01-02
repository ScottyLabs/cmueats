import bounded from '../../src/util/misc';
import { expect, test } from 'vitest';

test('bounded', () => {
    expect(bounded(2, 2, 2)).toEqual(false);
    expect(bounded(2, 2, 3)).toEqual(true);
    expect(bounded(2.5, 2.2, 3)).toEqual(true);
    expect(() => bounded(2, 2, -2)).toThrow();
    expect(() => bounded(2, 2, 1.99)).toThrow();
});
