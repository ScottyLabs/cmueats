const today = new Date();
const MIKU_DAY =
	(today.getDate() === 9 && today.getMonth() === 2) ||
	(typeof window !== 'undefined' && window.location.search.endsWith('miku'));
export default MIKU_DAY;
