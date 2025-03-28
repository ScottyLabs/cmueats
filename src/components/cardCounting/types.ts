export type Card = {
	suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
	value: string;
	countValue: number;
};

export type Deck = Card[];

export interface CardCountingSystem {
	name: string;
	description: string;
	values: {
		[key: string]: number;
	};
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	effectiveness: number;
}

export type GameState = {
	deck: Deck;
	discardPile: Deck;
	currentCount: number;
	trueCount: number;
	decksRemaining: number;
	isGameActive: boolean;
	lastCard?: Card;
	history: Card[];
};

export interface TrainingMode {
	name: string;
	description: string;
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	features: {
		timeLimit: boolean;
		multipleDecks: boolean;
		showTrueCount: boolean;
		showRunningCount: boolean;
		showCardValues: boolean;
		showFeedback: boolean;
	};
	settings: {
		numDecks: number;
		penetration: number;
		speed: 'slow' | 'medium' | 'fast' | 'variable';
		timePerCard?: number;
	};
}

export interface TrainingStats {
	correctDecisions: number;
	totalDecisions: number;
	averageResponseTime: number;
	accuracy: number;
}

export interface GameConfig {
	minBet: number;
	maxBet: number;
	betSpread: number;
	numDecks: number;
	penetration: number;
	payoutRatio: {
		blackjack: number;
		win: number;
		push: number;
		lose: number;
		surrender: number;
	};
	dealerRules: {
		hitSoft17: boolean;
		peekOnAce: boolean;
		peekOnTen: boolean;
	};
	playerRules: {
		doubleAfterSplit: boolean;
		surrender: boolean;
		resplitAces: boolean;
	};
}

export interface Statistics {
	correctCounts: number;
	totalAttempts: number;
	averageAccuracy: number;
	timePerCard: number;
	bestStreak: number;
	currentStreak: number;
}

export interface BlackjackHand {
	cards: Card[];
	value: number;
	isSoft: boolean;
	isBlackjack: boolean;
	isBust: boolean;
}
