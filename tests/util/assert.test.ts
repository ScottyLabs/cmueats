import assert from '../../src/util/assert';
import { expect, test } from 'vitest';

test('throw error', () => {
    expect(() => assert(false, 'woot')).toThrow('woot');
});
