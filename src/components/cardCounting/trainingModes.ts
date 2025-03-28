import { TrainingMode } from './types';

export const TRAINING_MODES: TrainingMode[] = [
	{
		name: 'Card Counting Practice',
		description:
			'Learn the basics of card counting in a stress-free environment.',
		difficulty: 'beginner',
		features: {
			timeLimit: false,
			multipleDecks: false,
			showTrueCount: true,
			showRunningCount: true,
			showCardValues: true,
			showFeedback: true,
		},
		settings: {
			numDecks: 1,
			penetration: 1,
			speed: 'slow',
			timePerCard: 3,
		},
	},
	{
		name: 'Speed Counting',
		description:
			'Count cards quickly with a time limit. Helps build speed and accuracy.',
		difficulty: 'intermediate',
		features: {
			timeLimit: true,
			multipleDecks: true,
			showTrueCount: true,
			showRunningCount: true,
			showCardValues: false,
			showFeedback: true,
		},
		settings: {
			numDecks: 2,
			penetration: 0.75,
			speed: 'fast',
			timePerCard: 2, // seconds
		},
	},
	{
		name: 'True Count Practice',
		description:
			'Focus on calculating true count accurately with multiple decks.',
		difficulty: 'intermediate',
		features: {
			timeLimit: false,
			multipleDecks: true,
			showTrueCount: true,
			showRunningCount: true,
			showCardValues: false,
			showFeedback: true,
		},
		settings: {
			numDecks: 4,
			penetration: 0.75,
			speed: 'medium',
		},
	},
	{
		name: 'Advanced Training',
		description:
			'Complex scenarios with multiple decks, varying penetration, and no visual aids.',
		difficulty: 'advanced',
		features: {
			timeLimit: true,
			multipleDecks: true,
			showTrueCount: false,
			showRunningCount: false,
			showCardValues: false,
			showFeedback: true,
		},
		settings: {
			numDecks: 6,
			penetration: 0.85,
			speed: 'fast',
			timePerCard: 1.5, // seconds
		},
	},
	{
		name: 'Real Casino Simulation',
		description:
			'Simulate real casino conditions with distractions and varying speeds.',
		difficulty: 'advanced',
		features: {
			timeLimit: true,
			multipleDecks: true,
			showTrueCount: false,
			showRunningCount: false,
			showCardValues: false,
			showFeedback: false,
		},
		settings: {
			numDecks: 6,
			penetration: 0.75,
			speed: 'variable',
			timePerCard: 1, // second
		},
	},
];

export const getTrainingMode = (name: string): TrainingMode | undefined =>
	TRAINING_MODES.find((mode) => mode.name === name);

export const getTrainingModesByDifficulty = (
	difficulty: 'beginner' | 'intermediate' | 'advanced',
): TrainingMode[] =>
	TRAINING_MODES.filter((mode) => mode.difficulty === difficulty);

export const getDefaultTrainingMode = (): TrainingMode => TRAINING_MODES[0];
