import assert from './assert';
import bounded from './misc';

const graveyard = [
	'Staying up all night?',
	'Want a late-night snack?',
	"Don't stay up too late!",
	'Delivery too expensive?',
	'Pulling an all-nighter? Let us fuel your focus!',
	'When the world sleeps, your snack game is strong!',
	'Late night genius? Keep it going with a bite!',
	'Need a boost for your midnight grind?',
	"It's quiet, but your cravings aren't—time for a snack!",
	"Midnight snack attack? We've got the fix!",
	'The stars are out, and so are the snacks!',
	'Awake while others dream? Power up with a late-night bite!',
];
const morning = [
	'Fancy some breakfast?',
	'Is breakfast really the most important meal of the day?',
	'What do you want to eat?',
	'Have a good morning!',
	'Start your day with a delicious meal!',
	'Time to refuel for the day ahead!',
	'Breakfast is calling your name!',
	"Sun's up, breakfast is served!",
	"Rise and shine, it's breakfast time!",
	'Fuel the morning hustle with something delicious!',
	'The best way to start your day? A tasty breakfast!',
	'Your morning journey starts with breakfast!',
	'The campus is waking up—join in with breakfast!',
	"Your day's first win: a perfect breakfast!",
	'Before you conquer the day, conquer breakfast!',
	'The breakfast bell is ringing—are you answering?',
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
	"What's for lunch? Let's make it awesome!",
	"The afternoon slump's no match for a great lunch!",
	'Hit reset on your day with a satisfying lunch!',
	'Midday fuel-up to keep you moving!',
	'Break away from the books—lunch awaits!',
	'Recharge with the perfect lunch combo!',
	"Afternoon cravings? Let's handle them with style!",
];
const evening = [
	'What do you want for dinner?',
	'What do you want to eat?',
	'Have a good evening!',
	'Grab a bite to eat!',
	'Hungry night owl?',
	"Midnight munchies? We've got you!",
	'Evenings are for unwinding—and great food!',
	'The best part of your day? A delicious dinner!',
	"Make tonight's dinner the highlight of your day!",
	"Evening cravings? Let's turn them into dinner delights!",
	'After a long day, you deserve a feast!',
	'Dinner time—where cravings meet satisfaction!',
	'Dine like a star tonight—what are you in the mood for?',
	"The day's done—now it's time for a dinner victory!",
	"Evenings and comfort food go hand-in-hand—let's get started!",
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
