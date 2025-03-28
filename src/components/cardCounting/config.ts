import { GameConfig } from './types';

export const defaultConfig: GameConfig = {
	minBet: 5,
	maxBet: 500,
	betSpread: 8,
	numDecks: 6,
	penetration: 0.75,
	payoutRatio: {
		blackjack: 1.5,
		win: 1,
		push: 0,
		lose: -1,
		surrender: -0.5,
	},
	dealerRules: {
		hitSoft17: true,
		peekOnAce: true,
		peekOnTen: true,
	},
	playerRules: {
		doubleAfterSplit: true,
		surrender: true,
		resplitAces: false,
	},
};

export const beginnerConfig: GameConfig = {
	...defaultConfig,
	minBet: 1,
	maxBet: 100,
	betSpread: 4,
	numDecks: 1,
	penetration: 0.75,
};

export const intermediateConfig: GameConfig = {
	...defaultConfig,
	minBet: 5,
	maxBet: 250,
	betSpread: 8,
	numDecks: 2,
	penetration: 0.75,
};

export const advancedConfig: GameConfig = {
	...defaultConfig,
	minBet: 10,
	maxBet: 1000,
	betSpread: 16,
	numDecks: 6,
	penetration: 0.85,
};

export const getConfigByDifficulty = (
	difficulty: 'beginner' | 'intermediate' | 'advanced',
): GameConfig => {
	switch (difficulty) {
		case 'beginner':
			return beginnerConfig;
		case 'intermediate':
			return intermediateConfig;
		case 'advanced':
			return advancedConfig;
		default:
			return defaultConfig;
	}
};

export const validateConfig = (config: GameConfig): boolean =>
	config.minBet > 0 &&
	config.maxBet >= config.minBet &&
	config.betSpread > 0 &&
	config.numDecks > 0 &&
	config.penetration > 0 &&
	config.penetration <= 1;
