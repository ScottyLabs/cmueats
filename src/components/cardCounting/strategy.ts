import { Card, BlackjackHand } from './types';

export interface StrategyDecision {
	action: 'hit' | 'stand' | 'double' | 'split' | 'surrender';
	explanation: string;
}

export const getBasicStrategyDecision = (
	playerHand: BlackjackHand,
	dealerUpcard: Card,
): StrategyDecision => {
	const playerValue = playerHand.value;
	const dealerValue = parseInt(dealerUpcard.value, 10) || 10;

	if (playerHand.isSoft) {
		if (playerValue <= 17) {
			return {
				action: 'hit',
				explanation: 'Soft hand under 18 - hit to improve',
			};
		}
		if (playerValue === 18 && dealerValue >= 9) {
			return {
				action: 'hit',
				explanation: 'Soft 18 against dealer 9 or higher - hit',
			};
		}
		return {
			action: 'stand',
			explanation: 'Soft 19 or higher - stand',
		};
	}

	if (playerValue <= 11) {
		return {
			action: 'hit',
			explanation: 'Hard hand under 12 - hit to improve',
		};
	}

	if (playerValue === 12 && dealerValue >= 4 && dealerValue <= 6) {
		return {
			action: 'stand',
			explanation: 'Hard 12 against dealer 4-6 - stand',
		};
	}

	if (playerValue >= 13 && playerValue <= 16 && dealerValue <= 6) {
		return {
			action: 'stand',
			explanation: 'Hard 13-16 against dealer 2-6 - stand',
		};
	}

	if (playerValue >= 17) {
		return {
			action: 'stand',
			explanation: 'Hard 17 or higher - stand',
		};
	}

	return {
		action: 'hit',
		explanation: 'Default to hit',
	};
};

export const getOptimalBet = (
	trueCount: number,
	minBet: number,
	maxBet: number,
): number => {
	const betMultiplier = Math.max(1, trueCount);
	const bet = minBet * betMultiplier;
	return Math.min(bet, maxBet);
};

export const shouldTakeInsurance = (trueCount: number): boolean =>
	trueCount >= 3;

export const getOptimalPlay = (
	playerHand: BlackjackHand,
	dealerUpcard: Card,
	trueCount: number,
): StrategyDecision => {
	const basicStrategy = getBasicStrategyDecision(playerHand, dealerUpcard);

	// Deviations based on true count
	if (trueCount >= 1) {
		if (playerHand.value === 15 && dealerUpcard.value === '10') {
			return {
				action: 'stand',
				explanation: 'True count +1 or higher - stand on 15 vs 10',
			};
		}
		if (playerHand.value === 16 && dealerUpcard.value === '10') {
			return {
				action: 'stand',
				explanation: 'True count +1 or higher - stand on 16 vs 10',
			};
		}
	}

	if (trueCount >= 2) {
		if (playerHand.value === 12 && dealerUpcard.value === '2') {
			return {
				action: 'stand',
				explanation: 'True count +2 or higher - stand on 12 vs 2',
			};
		}
	}

	return basicStrategy;
};
