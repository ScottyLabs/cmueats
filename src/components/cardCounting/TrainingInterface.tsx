import { useState, useEffect, useCallback } from 'react';
import {
	Container,
	Box,
	Typography,
	Paper,
	Button,
	Grid,
	LinearProgress,
} from '@mui/material';
import {
	CardCountingSystem,
	TrainingMode,
	TrainingStats,
	Card as CardType,
} from './types';
import {
	generateRandomHand,
	generateRandomDealerUpcard,
	generateRandomTrueCount,
} from './utils';
import { getOptimalPlay } from './strategy';

interface TrainingInterfaceProps {
	system: CardCountingSystem;
	mode: TrainingMode;
	onComplete: (stats: TrainingStats) => void;
}

function getCardValue(card: CardType): number {
	if (card.value === 'A') return 11;
	if (['K', 'Q', 'J'].includes(card.value)) return 10;
	return parseInt(card.value, 10);
}

function calculateHandValue(hand: CardType[]): number {
	return hand.reduce((sum, card) => sum + getCardValue(card), 0);
}

function getSpeedMultiplier(
	speed: 'slow' | 'medium' | 'fast' | 'variable',
): number {
	switch (speed) {
		case 'fast':
			return 1.5;
		case 'medium':
			return 1.0;
		default:
			return 0.5;
	}
}

function getSpeedDelay(speed: 'slow' | 'medium' | 'fast' | 'variable'): number {
	switch (speed) {
		case 'fast':
			return 500;
		case 'medium':
			return 1000;
		default:
			return 2000;
	}
}

function TrainingInterface({
	system,
	mode,
	onComplete,
}: TrainingInterfaceProps) {
	const [currentHand, setCurrentHand] = useState<CardType[]>([]);
	const [dealerUpcard, setDealerUpcard] = useState<CardType | null>(null);
	const [trueCount, setTrueCount] = useState(0);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [stats, setStats] = useState<TrainingStats>({
		correctDecisions: 0,
		totalDecisions: 0,
		averageResponseTime: 0,
		accuracy: 0,
	});

	const generateNewHand = useCallback(() => {
		const hand = generateRandomHand();
		const upcard = generateRandomDealerUpcard();
		const count = generateRandomTrueCount();
		setCurrentHand(hand);
		setDealerUpcard(upcard);
		setTrueCount(count);
		setStartTime(Date.now());
	}, []);

	useEffect(() => {
		generateNewHand();
	}, [generateNewHand]);

	const handleDecision = useCallback(
		(decision: string) => {
			if (!startTime || !dealerUpcard) return;

			const responseTime = (Date.now() - startTime) / 1000;
			const handValue = calculateHandValue(currentHand);

			const optimalPlay = getOptimalPlay(
				{
					cards: currentHand,
					value: handValue,
					isSoft: currentHand.some((card) => card.value === 'A'),
					isBlackjack: currentHand.length === 2 && handValue === 21,
					isBust: handValue > 21,
				},
				dealerUpcard,
				trueCount,
			);

			const isCorrect = decision === optimalPlay.action;
			const timeMultiplier = getSpeedMultiplier(mode.settings.speed);

			const newStats = {
				correctDecisions: stats.correctDecisions + (isCorrect ? 1 : 0),
				totalDecisions: stats.totalDecisions + 1,
				averageResponseTime:
					(stats.averageResponseTime * stats.totalDecisions +
						responseTime * timeMultiplier) /
					(stats.totalDecisions + 1),
				accuracy:
					((stats.correctDecisions + (isCorrect ? 1 : 0)) /
						(stats.totalDecisions + 1)) *
					100,
			};

			setStats(newStats);

			const delay = getSpeedDelay(mode.settings.speed);
			setTimeout(generateNewHand, delay);
		},
		[
			currentHand,
			dealerUpcard,
			generateNewHand,
			mode.settings.speed,
			startTime,
			stats,
			trueCount,
		],
	);

	const formatCard = (card: CardType): string => {
		const { value, suit } = card;
		const suitSymbol = {
			hearts: '♥',
			diamonds: '♦',
			clubs: '♣',
			spades: '♠',
		}[suit];

		return `${value}${suitSymbol}`;
	};

	const getCardColor = (suit: CardType['suit']): string => {
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

	return (
		<Container maxWidth="md">
			<Box sx={{ width: '100%', mt: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					{system.name} Training - {mode.name}
				</Typography>

				<Paper sx={{ p: 3, mb: 3 }}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" gutterBottom>
								Your Hand
							</Typography>
							<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
								{currentHand.map((card) => (
									<Paper
										key={`${card.value}-${card.suit}`}
										sx={{
											minWidth: 100,
											height: 140,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: '#fff',
											border: '1px solid #ddd',
										}}
									>
										<Typography
											variant="h5"
											sx={{
												color: getCardColor(card.suit),
											}}
										>
											{formatCard(card)}
										</Typography>
									</Paper>
								))}
							</Box>

							<Typography variant="h6" gutterBottom>
								Dealer&apos;s Upcard
							</Typography>
							<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
								{dealerUpcard && (
									<Paper
										sx={{
											minWidth: 100,
											height: 140,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: '#fff',
											border: '1px solid #ddd',
										}}
									>
										<Typography
											variant="h5"
											sx={{
												color: getCardColor(
													dealerUpcard.suit,
												),
											}}
										>
											{formatCard(dealerUpcard)}
										</Typography>
									</Paper>
								)}
							</Box>

							<Typography variant="h6" gutterBottom>
								True Count: {trueCount.toFixed(1)}
							</Typography>

							<Box sx={{ mt: 3 }}>
								<Typography variant="h6" gutterBottom>
									Your Decision
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6} sm={3}>
										<Button
											fullWidth
											variant="contained"
											onClick={() =>
												handleDecision('hit')
											}
										>
											Hit
										</Button>
									</Grid>
									<Grid item xs={6} sm={3}>
										<Button
											fullWidth
											variant="contained"
											onClick={() =>
												handleDecision('stand')
											}
										>
											Stand
										</Button>
									</Grid>
									<Grid item xs={6} sm={3}>
										<Button
											fullWidth
											variant="contained"
											onClick={() =>
												handleDecision('double')
											}
										>
											Double
										</Button>
									</Grid>
									<Grid item xs={6} sm={3}>
										<Button
											fullWidth
											variant="contained"
											onClick={() =>
												handleDecision('surrender')
											}
										>
											Surrender
										</Button>
									</Grid>
								</Grid>
							</Box>
						</Grid>
					</Grid>
				</Paper>

				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Training Statistics
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Box>
								<Typography variant="subtitle1">
									Accuracy
								</Typography>
								<LinearProgress
									variant="determinate"
									value={stats.accuracy}
									sx={{ height: 10, borderRadius: 5 }}
								/>
								<Typography variant="body2" sx={{ mt: 1 }}>
									{stats.accuracy.toFixed(1)}%
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Box>
								<Typography variant="subtitle1">
									Average Response Time
								</Typography>
								<Typography variant="h4">
									{stats.averageResponseTime.toFixed(1)}s
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Paper>

				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
					<Button
						variant="contained"
						color="secondary"
						size="large"
						onClick={() => onComplete(stats)}
					>
						End Training
					</Button>
				</Box>
			</Box>
		</Container>
	);
}

export default TrainingInterface;
