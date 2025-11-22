/**
 * Convert a string to title case
 * @param {string} str string to convert to title case
 * @returns the same string, but in title case (single characters aren't upper-cased)
 */
export default function toTitleCase(str: string) {
    return str
        .trim()
        .toLowerCase()
        .split(' ')
        .map((word) => {
            if (word === 'ii') return 'II'; // special case
            if (word.length > 1) {
                return word[0]!.toUpperCase() + word.slice(1);
            }
            return word;
        })
        .join(' ');
}
