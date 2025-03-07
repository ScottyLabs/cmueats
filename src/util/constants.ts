const today = new Date();

// global conditional for whether or not to render Miku theme toggle
const IS_MIKU_DAY =
	(today.getDate() === 9 && today.getMonth() === 2) ||
	(typeof window !== 'undefined' &&
		window.location.search.endsWith('force-miku-day'));
export default IS_MIKU_DAY;
