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
const graveyardShort = [
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
];
const morningShort = [
	'Fancy some breakfast?',
	'What do you want to eat?',
	'Have a good morning!',
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
];
const afternoonShort = [
	'Have a good afternoon!',
	'Use those blocks!',
	'Fuel up for the afternoon!',
	'Lunch options galore!',
];
const evening = [
	'What do you want for dinner?',
	'What do you want to eat?',
	'Have a good evening!',
	'Grab a bite to eat!',
	'Hungry night owl?',
	"Midnight munchies? We've got you!",
];
const eveningShort = [
	'Have a good evening!',
	'Grab a bite to eat!',
	'Hungry night owl?',
];
interface Special {
	isMikuDay: boolean;
}
const getRandomStringFrom = (greetings: string[]) => {
	if (greetings.length === 0) return 'Welcome to CMUEats!';
	return greetings[Math.floor(Math.random() * greetings.length)];
};
const getGreeting = (hours: number, special?: Special) => {
	assert(bounded(hours, 0, 24));

	if (special?.isMikuDay) return 'Happy Miku Day! (March 9th)';
	if (hours < 6) {
		return getRandomStringFrom(graveyard);
	}
	if (hours < 12) {
		return getRandomStringFrom(morning);
	}
	if (hours < 17) {
		return getRandomStringFrom(afternoon);
	}
	if (hours < 24) {
		return getRandomStringFrom(evening);
	}

	return 'Welcome to CMUEats!';
};
const getGreetingMobile = (hours: number, special?: Special) => {
	if (special?.isMikuDay) return 'Happy Miku Day!';
	if (hours < 6) {
		return getRandomStringFrom(graveyardShort);
	}
	if (hours < 12) {
		return getRandomStringFrom(morningShort);
	}
	if (hours < 17) {
		return getRandomStringFrom(afternoonShort);
	}
	if (hours < 24) {
		return getRandomStringFrom(eveningShort);
	}
	return 'Welcome to CMUEats!';
};
const getGreetings = (hours: number, special?: Special) => ({
	desktopGreeting: getGreeting(hours, special),
	mobileGreeting: getGreetingMobile(hours, special),
});
export { getGreeting, getGreetingMobile, getGreetings };
