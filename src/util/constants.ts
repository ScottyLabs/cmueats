const today = new Date();

// global conditional for whether or not to render Miku theme toggle
const IS_MIKU_DAY =
	(today.getDate() === 9 && today.getMonth() === 2) ||
	(typeof window !== 'undefined' &&
		window.location.search.endsWith('force-miku-day'));

// global conditional for whether or not to render April Fools features
const IS_APRIL_FOOLS =
	(today.getDate() === 1 && today.getMonth() === 3) ||
	(typeof window !== 'undefined' &&
		window.location.search.endsWith('force-april-fools'));

export { IS_APRIL_FOOLS };
export default IS_MIKU_DAY;
