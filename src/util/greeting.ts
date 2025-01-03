import assert from './assert';
import bounded from './misc';

const graveyard = [
	'Staying up all night?',
	'Want a late-night snack?',
	"Don't stay up too late!",
	'Delivery too expensive?',
	'Pulling an all-nighter? Let us fuel your focus!',
	'Late night genius? Keep it going with a bite!',
	'Need a boost for your midnight grind?',
];
const morning = [
	'Fancy some breakfast?',
	'Is breakfast really the most important meal of the day?',
	'What do you want to eat?',
	'Have a good morning!',
	'Start your day with a delicious meal!',
	'Time to refuel for the day ahead!',
];

const afternoon = [
	'What do you want for lunch?',
	'What do you want to eat?',
	'Have a good afternoon!',
	'Use those blocks!',
	'Fuel up for the afternoon!',
	'Lunch options galore!',
	'Satisfy your midday hunger!',
	'Craving something savory for lunch?',
	"Midday munchies? We've got you covered!",
	'Halfway through the day—time for a lunch break!',
	'Anyone here a yoasobi fan?',
];
const evening = [
	'What do you want for dinner?',
	'What do you want to eat?',
	'Have a good evening!',
	'Grab a bite to eat!',
	'Hungry night owl?',
	"Midnight munchies? We've got you!",
];

const getGreeting = (hours: number) => {
	assert(bounded(hours, 0, 24));
	if (hours < 6) {
		return graveyard[Math.floor(Math.random() * graveyard.length)];
	}
	if (hours < 12) {
		return morning[Math.floor(Math.random() * morning.length)];
	}
	if (hours < 17) {
		return afternoon[Math.floor(Math.random() * afternoon.length)];
	}
	if (hours < 24) {
		return evening[Math.floor(Math.random() * evening.length)];
	}

	return 'Welcome to CMUEats!';
};

export default getGreeting;
