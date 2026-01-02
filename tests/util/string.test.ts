import { expect, test } from 'vitest';
import toTitleCase from '../../src/util/string';

test.each([
    ['asdf', 'Asdf'],
    ['so trUe', 'So True'],
    ['o K k', 'o k k'],
    ['火鍋', '火鍋'],
    ['', ''],
    ['   ', ''],
    ['  asdf ', 'Asdf'],
    ['ii', 'II'],
])('toTitleCasetest', (before, after) => {
    expect(toTitleCase(before)).toBe(after);
});
