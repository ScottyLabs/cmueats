import assert from '../../src/util/assert';

test('throw error', () => {
	expect(() => assert(false, 'woot')).toThrow('woot');
});
