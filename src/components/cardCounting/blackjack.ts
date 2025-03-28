import { Card, GameState, CardCountingSystem } from './types';
import { calculateTrueCount, updateGameState } from './utils';

export interface BlackjackHand {
	cards: Card[];
	value: number;
	isSoft: boolean;
	isBlackjack: boolean;
	isBust: boolean;
}

export interface BlackjackGameState extends GameState {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	currentBet: number;
	bankroll: number;
	canHit: boolean;
	canStand: boolean;
	canDouble: boolean;
	canSplit: boolean;
	canSurrender: boolean;
	gamePhase: 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'payout';
}

export const calculateHandValue = (cards: Card[]): BlackjackHand => {
	let value = 0;
	let numAces = 0;
	let isSoft = false;

	// First pass: count non-aces
	cards.forEach((card) => {
		if (card.value === 'A') {
			numAces += 1;
		} else if (['K', 'Q', 'J'].includes(card.value)) {
			value += 10;
		} else {
			value += parseInt(card.value, 10);
		}
	});

	// Second pass: handle aces
	for (let i = 0; i < numAces; i += 1) {
		if (value + 11 <= 21) {
			value += 11;
			isSoft = true;
		} else {
			value += 1;
		}
	}

	return {
		cards,
		value,
		isSoft,
		isBlackjack: cards.length === 2 && value === 21,
		isBust: value > 21,
	};
};

export const initializeBlackjackGame = (
	gameState: GameState,
	bet: number,
): GameState & {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	bet: number;
} => {
	const deck = [...gameState.deck];
	const playerCards = [deck.pop()!, deck.pop()!];
	const dealerCards = [deck.pop()!, deck.pop()!];

	return {
		...gameState,
		deck,
		playerHand: calculateHandValue(playerCards),
		dealerHand: calculateHandValue(dealerCards),
		bet,
	};
};

export const dealInitialCards = (
	gameState: BlackjackGameState,
): BlackjackGameState => {
	// Deal two cards to player and dealer
	const playerCard1 = gameState.deck.pop()!;
	const dealerCard1 = gameState.deck.pop()!;
	const playerCard2 = gameState.deck.pop()!;
	const dealerCard2 = gameState.deck.pop()!;

	const playerHand = calculateHandValue([playerCard1, playerCard2]);
	const dealerHand = calculateHandValue([dealerCard1, dealerCard2]);

	const newState = {
		...gameState,
		playerHand,
		dealerHand,
		currentCount:
			gameState.currentCount +
			playerCard1.countValue +
			playerCard2.countValue +
			dealerCard1.countValue +
			dealerCard2.countValue,
		trueCount: calculateTrueCount(
			gameState.currentCount +
				playerCard1.countValue +
				playerCard2.countValue +
				dealerCard1.countValue +
				dealerCard2.countValue,
			gameState.deck.length / 52,
		),
		history: [
			...gameState.history,
			playerCard1,
			dealerCard1,
			playerCard2,
			dealerCard2,
		],
		gamePhase: 'playerTurn' as const,
		canHit: true,
		canStand: true,
		canDouble: gameState.bankroll >= gameState.currentBet * 2,
		canSplit:
			playerCard1.value === playerCard2.value &&
			gameState.bankroll >= gameState.currentBet * 2,
		canSurrender:
			gameState.gamePhase === 'playerTurn' &&
			gameState.history.length === 4,
	};

	return newState;
};

export const hit = (
	gameState: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
		currentSystem: CardCountingSystem;
	},
): GameState & {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	bet: number;
	currentSystem: CardCountingSystem;
} => {
	const card = gameState.deck.pop()!;
	const newState = {
		...gameState,
		bet: gameState.bet,
		currentSystem: gameState.currentSystem,
		playerHand: gameState.playerHand,
		dealerHand: gameState.dealerHand,
		deck: gameState.deck,
		discardPile: gameState.discardPile,
		currentCount: gameState.currentCount,
		trueCount: gameState.trueCount,
		decksRemaining: gameState.decksRemaining,
		isGameActive: gameState.isGameActive,
		lastCard: gameState.lastCard,
		history: gameState.history,
	};
	return updateGameState(newState, card, false) as GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
		currentSystem: CardCountingSystem;
	};
};

export const stand = (
	gameState: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
	},
): GameState & {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	bet: number;
} => ({
	...gameState,
	isGameActive: false,
});

export const double = (
	gameState: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
		currentSystem: CardCountingSystem;
	},
): GameState & {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	bet: number;
	currentSystem: CardCountingSystem;
} => {
	const card = gameState.deck.pop()!;
	const newState = {
		...gameState,
		bet: gameState.bet * 2,
		currentSystem: gameState.currentSystem,
		playerHand: gameState.playerHand,
		dealerHand: gameState.dealerHand,
		deck: gameState.deck,
		discardPile: gameState.discardPile,
		currentCount: gameState.currentCount,
		trueCount: gameState.trueCount,
		decksRemaining: gameState.decksRemaining,
		isGameActive: gameState.isGameActive,
		lastCard: gameState.lastCard,
		history: gameState.history,
	};
	return updateGameState(newState, card, false) as GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
		currentSystem: CardCountingSystem;
	};
};

export const surrender = (
	gameState: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
	},
): GameState & {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	bet: number;
} => ({
	...gameState,
	isGameActive: false,
	bet: gameState.bet * 0.5,
});

export const dealerPlay = (
	gameState: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
		currentSystem: CardCountingSystem;
	},
): GameState & {
	playerHand: BlackjackHand;
	dealerHand: BlackjackHand;
	bet: number;
	currentSystem: CardCountingSystem;
} => {
	let currentState = { ...gameState };

	while (currentState.dealerHand.value < 17) {
		const card = currentState.deck.pop()!;
		const newState = {
			...currentState,
			bet: currentState.bet,
			currentSystem: currentState.currentSystem,
			playerHand: currentState.playerHand,
			dealerHand: currentState.dealerHand,
			deck: currentState.deck,
			discardPile: currentState.discardPile,
			currentCount: currentState.currentCount,
			trueCount: currentState.trueCount,
			decksRemaining: currentState.decksRemaining,
			isGameActive: currentState.isGameActive,
			lastCard: currentState.lastCard,
			history: currentState.history,
		};
		currentState = updateGameState(newState, card, true) as GameState & {
			playerHand: BlackjackHand;
			dealerHand: BlackjackHand;
			bet: number;
			currentSystem: CardCountingSystem;
		};
	}

	return currentState;
};

export const calculatePayout = (
	gameState: GameState & {
		playerHand: BlackjackHand;
		dealerHand: BlackjackHand;
		bet: number;
	},
): number => {
	const { playerHand, dealerHand, bet } = gameState;

	if (playerHand.isBust) {
		return -bet;
	}

	if (dealerHand.isBust) {
		return bet;
	}

	if (playerHand.value > dealerHand.value) {
		return bet;
	}

	if (playerHand.value < dealerHand.value) {
		return -bet;
	}

	return 0;
};
