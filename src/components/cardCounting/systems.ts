import { CardCountingSystem } from './types';

export const CARD_COUNTING_SYSTEMS: CardCountingSystem[] = [
	{
		name: 'Hi-Lo',
		description:
			'The most popular counting system. Assigns +1 to 2-6, 0 to 7-9, and -1 to 10-A.',
		values: {
			'2': 1,
			'3': 1,
			'4': 1,
			'5': 1,
			'6': 1,
			'7': 0,
			'8': 0,
			'9': 0,
			'10': -1,
			J: -1,
			Q: -1,
			K: -1,
			A: -1,
		},
		difficulty: 'beginner',
		effectiveness: 0.98,
	},
	{
		name: 'KO (Knock Out)',
		description:
			"An unbalanced counting system that doesn't require true count conversion. Assigns +1 to 2-7, 0 to 8-9, and -1 to 10-A.",
		values: {
			'2': 1,
			'3': 1,
			'4': 1,
			'5': 1,
			'6': 1,
			'7': 1,
			'8': 0,
			'9': 0,
			'10': -1,
			J: -1,
			Q: -1,
			K: -1,
			A: -1,
		},
		difficulty: 'beginner',
		effectiveness: 0.97,
	},
	{
		name: 'Omega II',
		description:
			'A more advanced balanced counting system with multiple point values. Assigns +1 to 2,3,7, +2 to 4,5,6, 0 to 8,9, -1 to 10, and -2 to A.',
		values: {
			'2': 1,
			'3': 1,
			'7': 1,
			'4': 2,
			'5': 2,
			'6': 2,
			'8': 0,
			'9': 0,
			'10': -1,
			J: -1,
			Q: -1,
			K: -1,
			A: -2,
		},
		difficulty: 'advanced',
		effectiveness: 0.99,
	},
	{
		name: 'Zen Count',
		description:
			'A balanced counting system that assigns +1 to 2,3,7, +2 to 4,5,6, 0 to 8,9, -1 to 10, and -2 to A.',
		values: {
			'2': 1,
			'3': 1,
			'7': 1,
			'4': 2,
			'5': 2,
			'6': 2,
			'8': 0,
			'9': 0,
			'10': -1,
			J: -1,
			Q: -1,
			K: -1,
			A: -2,
		},
		difficulty: 'intermediate',
		effectiveness: 0.98,
	},
	{
		name: 'Red 7',
		description:
			'A variation of the KO system that treats red 7s differently. Assigns +1 to 2-6 and red 7s, 0 to black 7s and 8-9, and -1 to 10-A.',
		values: {
			'2': 1,
			'3': 1,
			'4': 1,
			'5': 1,
			'6': 1,
			'7': 0, // Special handling for red/black 7s
			'8': 0,
			'9': 0,
			'10': -1,
			J: -1,
			Q: -1,
			K: -1,
			A: -1,
		},
		difficulty: 'beginner',
		effectiveness: 0.97,
	},
];

export const getCardValue = (
	system: CardCountingSystem,
	card: string,
): number => {
	const value = card.replace(/[♠♣♥♦]/, ''); // Remove suit
	return system.values[value] || 0;
};

export const isRedCard = (card: string): boolean =>
	card.includes('♥') || card.includes('♦');

export const getCardValueWithSuit = (
	system: CardCountingSystem,
	card: string,
): number => {
	const value = getCardValue(system, card);

	// Special handling for Red 7 system
	if (system.name === 'Red 7' && card.includes('7')) {
		return isRedCard(card) ? 1 : 0;
	}

	return value;
};
