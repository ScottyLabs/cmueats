import { Card, Deck, GameState, Statistics, BlackjackHand } from './types';
import { CARD_COUNTING_SYSTEMS, getCardValueWithSuit } from './systems';

export const shuffleDeck = (deck: Deck): Deck => {
	const shuffled = [...deck];
	for (let i = shuffled.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const createDeck = (numDecks: number = 1): Deck => {
	const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
	const values = [
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'J',
		'Q',
		'K',
		'A',
	];

	const deck: Deck = [];

	Array.from({ length: numDecks }).forEach(() => {
		suits.forEach((suit) => {
			values.forEach((value) => {
				deck.push({
					suit,
					value,
					countValue: 0,
				});
			});
		});
	});

	return shuffleDeck(deck);
};

export const calculateTrueCount = (
	runningCount: number,
	decksRemaining: number,
): number => (decksRemaining > 0 ? runningCount / decksRemaining : 0);

export const initializeGameState = (
	system: (typeof CARD_COUNTING_SYSTEMS)[0],
	numDecks: number = 1,
): GameState => {
	const deck = createDeck(numDecks);
	const updatedDeck = deck.map((card) => ({
		...card,
		countValue: system.values[card.value] || 0,
	}));

	return {
		deck: updatedDeck,
		discardPile: [],
		currentCount: 0,
		trueCount: 0,
		decksRemaining: numDecks,
		isGameActive: false,
		history: [],
	};
};

export const drawCard = (gameState: GameState): GameState => {
	if (gameState.deck.length === 0) {
		return {
			...gameState,
			isGameActive: false,
		};
	}

	const card = gameState.deck.pop()!;
	const newState = {
		...gameState,
		discardPile: [...gameState.discardPile, card],
		currentCount: gameState.currentCount + card.countValue,
		trueCount: calculateTrueCount(
			gameState.currentCount + card.countValue,
			gameState.deck.length / 52,
		),
		lastCard: card,
		history: [...gameState.history, card],
	};

	return newState;
};

export const updateStatistics = (
	currentStats: Statistics,
	isCorrect: boolean,
	timeSpent: number,
): Statistics => {
	const newStreak = isCorrect ? currentStats.currentStreak + 1 : 0;
	const newBestStreak = Math.max(currentStats.bestStreak, newStreak);

	return {
		correctCounts: currentStats.correctCounts + (isCorrect ? 1 : 0),
		totalAttempts: currentStats.totalAttempts + 1,
		averageAccuracy:
			(currentStats.correctCounts + (isCorrect ? 1 : 0)) /
			(currentStats.totalAttempts + 1),
		timePerCard:
			(currentStats.timePerCard * currentStats.totalAttempts +
				timeSpent) /
			(currentStats.totalAttempts + 1),
		bestStreak: newBestStreak,
		currentStreak: newStreak,
	};
};

export const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getCardColor = (suit: Card['suit']): string => {
	switch (suit) {
		case 'hearts':
		case 'diamonds':
			return '#ff0000';
		case 'clubs':
		case 'spades':
			return '#000000';
		default:
			return '#000000';
	}
};

export const calculateHandValue = (cards: Card[]): BlackjackHand => {
	let value = 0;
	let numAces = 0;
	let isSoft = false;

	cards.forEach((card) => {
		const cardValue = card.value;

		if (cardValue === 'A') {
			numAces += 1;
			value += 11;
			isSoft = true;
		} else if (['K', 'Q', 'J'].includes(cardValue)) {
			value += 10;
		} else {
			value += parseInt(cardValue, 10);
		}

		// Adjust for aces if needed
		while (value > 21 && numAces > 0) {
			value -= 10;
			numAces -= 1;
			if (numAces === 0) {
				isSoft = false;
			}
		}
	});

	return {
		cards,
		value,
		isSoft,
		isBlackjack: value === 21 && cards.length === 2,
		isBust: value > 21,
	};
};

export const formatCard = (card: Card): string => {
	const { value, suit } = card;
	const suitSymbol = {
		hearts: '♥',
		diamonds: '♦',
		clubs: '♣',
		spades: '♠',
	}[suit];

	return `${value}${suitSymbol}`;
};

export const updateGameState = (
	state: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		currentSystem: (typeof CARD_COUNTING_SYSTEMS)[0];
	},
	newCard: Card,
	isDealer: boolean = false,
): GameState & { playerHand: BlackjackHand; dealerHand: BlackjackHand } => {
	const newState = { ...state };

	if (isDealer) {
		newState.dealerHand = calculateHandValue([
			...newState.dealerHand.cards,
			newCard,
		]);
	} else {
		newState.playerHand = calculateHandValue([
			...newState.playerHand.cards,
			newCard,
		]);
	}

	// Update count
	const cardValue = getCardValueWithSuit(
		state.currentSystem,
		formatCard(newCard),
	);
	newState.currentCount += cardValue;
	newState.trueCount = calculateTrueCount(
		newState.currentCount,
		newState.decksRemaining,
	);

	// Update deck
	newState.deck = newState.deck.filter((card) => card !== newCard);
	newState.decksRemaining = newState.deck.length / 52;

	return newState;
};

export const calculateWinRate = (wins: number, total: number): number =>
	total > 0 ? (wins / total) * 100 : 0;

export const calculateProfit = (
	bet: number,
	outcome: 'win' | 'lose' | 'push' | 'blackjack' | 'surrender',
): number => {
	const multipliers = {
		win: 1,
		lose: -1,
		push: 0,
		blackjack: 1.5,
		surrender: -0.5,
	};
	return bet * multipliers[outcome];
};

export const generateRandomHand = (numCards: number = 2): Card[] => {
	const deck = createDeck(1);
	return deck.slice(0, numCards);
};

export const generateRandomDealerUpcard = (): Card => {
	const deck = createDeck(1);
	return deck[0];
};

export const generateRandomTrueCount = (): number => Math.random() * 4 - 1;
