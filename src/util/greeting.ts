import assert from './assert';
import bounded from './misc';
import IS_MIKU_DAY from './constants';

// Miku-themed greetings for maximum propaganda
const mikuGreetings = [
    "🎵 Miku wants to know what you're eating! 🎵",
    '🎤 "The voice of hunger calls!" - Hatsune Miku',
    '💙 Fuel your creativity with some food! 💙',
    "🎶 Let's compose a meal together! 🎶",
    '🌟 Even digital divas need real food! 🌟',
    '🎵 "01010010 01100101 01100001 01101100" (Translation: Real food for real hunger!) 🎵',
    '🎤 Your stomach wants to be heard! 🎤',
    '💎 Crystallize your hunger into action! 💎',
];

const graveyard = [
    'Staying up all night?',
    'Want a late-night snack?',
    "Don't stay up too late!",
    'Delivery too expensive?',
    'Pulling an all-nighter? Let us fuel your focus!',
    'Late night genius? Keep it going with a bite!',
    'Need a boost for your midnight grind?',
    ...(IS_MIKU_DAY ? ['🎵 Late-night Miku vibes - keep the energy flowing! 🎵'] : []),
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
    ...(IS_MIKU_DAY ? ['🎤 Good morning! Miku says breakfast hits different! 🎤'] : []),
];
const morningShort = [
    'Fancy some breakfast?',
    'What do you want to eat?',
    'Have a good morning!',
    ...(IS_MIKU_DAY ? ['🎵 Miku morning! 🎵'] : []),
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
    ...(IS_MIKU_DAY ? ['🎶 Miku says: Lunch break = creativity break! 🎶'] : []),
];
const afternoonShort = [
    'Have a good afternoon!',
    'Use those blocks!',
    'Fuel up for the afternoon!',
    'Lunch options galore!',
    ...(IS_MIKU_DAY ? ['🎵 Miku lunch! 🎵'] : []),
];
const evening = [
    'What do you want for dinner?',
    'What do you want to eat?',
    'Have a good evening!',
    'Grab a bite to eat!',
    'Hungry night owl?',
    "Midnight munchies? We've got you!",
    ...(IS_MIKU_DAY ? ['🌙 Evening vibes with Miku! Time for dinner beats! 🌙'] : []),
];
const eveningShort = [
    'Have a good evening!',
    'Grab a bite to eat!',
    'Hungry night owl?',
    ...(IS_MIKU_DAY ? ['🎤 Miku dinner! 🎤'] : []),
];
interface Special {
    isMikuDay: boolean;
}
const getRandomStringFrom = (greetings: string[]) => {
    if (greetings.length === 0) return 'Welcome to CMUEats!';
    return greetings[Math.floor(Math.random() * greetings.length)];
};

// Get random Miku propaganda greeting
const getRandomMikuGreeting = () => getRandomStringFrom(mikuGreetings);

const getGreeting = (hours: number, special?: Special) => {
    assert(bounded(hours, 0, 24));

    if (special?.isMikuDay) return 'Happy Miku Day! (March 9th)';

    // 30% chance to show Miku greeting if it's Miku day
    if (IS_MIKU_DAY && Math.random() < 0.3) {
        return getRandomMikuGreeting();
    }

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

    // 20% chance to show Miku greeting on mobile if it's Miku day
    if (IS_MIKU_DAY && Math.random() < 0.2) {
        return '🎵 Miku says hi! 🎵';
    }

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
export { getGreeting, getGreetingMobile, getGreetings, getRandomMikuGreeting };
