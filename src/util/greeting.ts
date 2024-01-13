import assert from './assert';
import bounded from './misc';

const graveyard = [
	'Staying up all night?',
	'Want a late-night snack?',
	"Don't stay up too late!",
	'Delivery too expensive?',
];
const morning = [
	'Fancy some breakfast?',
	'Is breakfast really the most important meal of the day?',
	'What do you want to eat?',
	'Have a good morning!',
	'Start your day with a delicious meal!',
	'Time to refuel for the day ahead!',
	'Breakfast is calling your name!',
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
