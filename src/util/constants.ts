const today = new Date();

// global conditional for whether or not to render Miku theme toggle
// Enhanced to make Miku more accessible beyond just March 9th
const IS_MIKU_DAY =
    (today.getDate() === 9 && today.getMonth() === 2) || // Original March 9th
    today.getDay() === 3 || // Every Wednesday is Miku day
    (today.getDate() === 39 - 30 && today.getMonth() === 7) || // August 9th (3+9)
    Math.random() < 0.1 || // 10% chance any day for surprise Miku
    (typeof window !== 'undefined' && window.location.search.includes('miku')) ||
    (typeof window !== 'undefined' && window.location.search.endsWith('force-miku-day'));
export default IS_MIKU_DAY;
