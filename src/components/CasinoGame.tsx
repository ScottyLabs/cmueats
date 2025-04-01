import { useState, useEffect, useRef } from 'react';
import {
	Dialog,
	DialogContent,
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Grid,
	Avatar,
	Chip,
	IconButton,
	Paper,
	Slider,
	styled,
	Snackbar,
	Alert,
	CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { CardCountingGame } from './cardCounting';
import { RouletteGame } from './roulette';

// Styled components for Kakegurui theme
const StyledDialog = styled(Dialog)({
	'& .MuiPaper-root': {
		backgroundColor: '#1E1E2D',
		color: '#fff',
		maxWidth: '90vw',
		width: '100%',
		maxHeight: '90vh',
		borderRadius: '12px',
		border: '2px solid #D30000',
	},
});

const GameHeader = styled(Box)({
	background: 'linear-gradient(135deg, #1E1E2D 0%, #2D0A0A 100%)',
	padding: '20px 20px 40px 20px',
	textAlign: 'center',
	position: 'relative',
	overflow: 'hidden',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background:
			"url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D30000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
		zIndex: 0,
	},
});

const MainTitle = styled(Typography)({
	fontFamily: '"Cinzel", serif',
	color: '#FFD700',
	fontWeight: 'bold',
	textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
	position: 'relative',
	zIndex: 1,
});

const CasinoCard = styled(Card)({
	backgroundColor: '#2E2E40',
	color: '#fff',
	borderRadius: '12px',
	border: '1px solid #3D3D55',
	transition: 'transform 0.3s ease, box-shadow 0.3s ease',
	overflow: 'hidden',
	'&:hover': {
		transform: 'translateY(-5px)',
		boxShadow: '0 10px 20px rgba(211, 0, 0, 0.2)',
	},
});

const GameInfoBox = styled(Box)({
	backgroundColor: '#272736',
	borderRadius: '8px',
	padding: '15px',
	marginBottom: '20px',
});

const BetSlider = styled(Slider)({
	color: '#D30000',
	'& .MuiSlider-thumb': {
		height: 24,
		width: 24,
		backgroundColor: '#fff',
		border: '2px solid #D30000',
		'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
			boxShadow: '0 0 0 8px rgba(211, 0, 0, 0.16)',
		},
	},
	'& .MuiSlider-track': {
		height: 8,
	},
	'& .MuiSlider-rail': {
		height: 8,
		opacity: 0.5,
		backgroundColor: '#3D3D55',
	},
});

const PlayerChip = styled(Chip)({
	backgroundColor: '#D30000',
	color: '#fff',
	fontWeight: 'bold',
	'& .MuiChip-icon': {
		color: '#FFD700',
	},
});

const ActionButton = styled(Button)({
	backgroundColor: '#D30000',
	color: '#fff',
	fontWeight: 'bold',
	borderRadius: '8px',
	padding: '10px 20px',
	'&:hover': {
		backgroundColor: '#FF0000',
	},
	'&.Mui-disabled': {
		backgroundColor: '#3D3D55',
		color: '#aaa',
	},
});

const GameCard = styled(Paper)({
	width: '100px',
	height: '140px',
	margin: '10px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#fff',
	borderRadius: '8px',
	position: 'relative',
	boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
	transition: 'transform 0.3s',
	cursor: 'pointer',
	'&:hover': {
		transform: 'scale(1.05)',
	},
});

const CardValue = styled(Typography)({
	fontSize: '24px',
	fontWeight: 'bold',
});

const CardBack = styled(Box)({
	width: '100%',
	height: '100%',
	backgroundColor: '#D30000',
	borderRadius: '8px',
	backgroundImage:
		"url(\"data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 0h44v44H0V0zm4 4h36v36H4V4zm10 10h16v16H14V14z'/%3E%3C/g%3E%3C/svg%3E\")",
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const GameAnimation = styled(Box)({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '20px 0',
});

const InsanityEffect = styled(Box)({
	animation: 'pulse 1.5s infinite',
	'@keyframes pulse': {
		'0%': {
			transform: 'scale(1)',
			opacity: 1,
		},
		'50%': {
			transform: 'scale(1.05)',
			opacity: 0.8,
		},
		'100%': {
			transform: 'scale(1)',
			opacity: 1,
		},
	},
});

// Mock opponent data
const opponents = [
	{
		id: 1,
		name: 'House',
		avatar: 'https://i.imgur.com/bWcQnAW.jpg',
		difficulty: 'Hard',
		description: 'The house always wins. Play at your own risk.',
		specialty: 'Unbeatable odds',
		winRate: 0.92,
		style: 'High-risk, high-reward',
	},
];

// Games
const GAMES = {
	HIGHER_LOWER: 'higher_lower',
	MATCHING: 'matching',
	COIN_FLIP: 'coin_flip',
	SLOTS: 'slots',
	CARD_COUNTING: 'card_counting',
	ROULETTE: 'roulette',
};

// Card games utils
const cardValues = [
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
const cardSuits = ['♠', '♥', '♦', '♣'];

interface CasinoGameProps {
	open: boolean;
	onClose: () => void;
}

// Define new styled components for the slot machine
const SlotMachineContainer = styled(Box)({
	backgroundColor: '#420000',
	background: 'linear-gradient(135deg, #5c0000 0%, #a10000 100%)',
	borderRadius: '20px',
	padding: '20px',
	maxWidth: '600px',
	margin: '0 auto',
	boxShadow:
		'0 10px 25px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.2)',
	border: '10px solid #2D0A0A',
	position: 'relative',
	overflow: 'hidden',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '10px',
		background:
			'linear-gradient(180deg, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0) 100%)',
		borderRadius: '8px 8px 0 0',
	},
});

const SlotHeader = styled(Box)({
	textAlign: 'center',
	marginBottom: '15px',
	padding: '10px',
	borderRadius: '8px',
	backgroundColor: 'rgba(0,0,0,0.3)',
	border: '1px solid rgba(255,255,255,0.1)',
	boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
});

const SlotTitle = styled(Typography)({
	fontFamily: '"Cinzel", serif',
	color: '#FFD700',
	textShadow:
		'0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
	fontWeight: 'bold',
	letterSpacing: '2px',
});

const SlotDisplayWindow = styled(Box)({
	backgroundColor: '#000',
	borderRadius: '10px',
	padding: '15px 25px',
	margin: '0 auto 20px',
	border: '8px solid #4a3800',
	boxShadow: 'inset 0 0 20px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.5)',
	display: 'flex',
	justifyContent: 'center',
	gap: '15px',
	position: 'relative',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: '-15px',
		left: '10px',
		right: '10px',
		height: '15px',
		background:
			'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)',
		animation: 'lightMovement 3s infinite',
	},
	'&::after': {
		content: '""',
		position: 'absolute',
		bottom: '-15px',
		left: '10px',
		right: '10px',
		height: '15px',
		background:
			'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)',
		animation: 'lightMovement 3s infinite reverse',
	},
	'@keyframes lightMovement': {
		'0%': { transform: 'translateX(-30px)', opacity: 0.3 },
		'50%': { transform: 'translateX(30px)', opacity: 0.7 },
		'100%': { transform: 'translateX(-30px)', opacity: 0.3 },
	},
});

const SlotReel = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSpinning' && prop !== 'spinDelay',
})<{ isSpinning: boolean; spinDelay: number }>(({ isSpinning, spinDelay }) => ({
	width: '100px',
	height: '140px',
	backgroundColor: '#ffffff',
	borderRadius: '8px',
	boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: '4rem',
	position: 'relative',
	overflow: 'hidden',
	animation: isSpinning
		? `slotSpin 0.1s ${spinDelay}ms infinite linear`
		: 'none',
	transition: 'all 0.5s ease',
	'&::after': {
		content: '""',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		background:
			'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.3) 100%)',
		pointerEvents: 'none',
	},
	'@keyframes slotSpin': {
		'0%': { transform: 'translateY(-20px)' },
		'100%': { transform: 'translateY(20px)' },
	},
}));

const SlotSymbol = styled(Box)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '100%',
	height: '100%',
	fontSize: '3.8rem',
	fontWeight: 'bold',
});

const SlotLever = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'pulled',
})<{ pulled: boolean }>(({ pulled }) => ({
	position: 'absolute',
	top: '50%',
	right: '-25px',
	transform: pulled ? 'translateY(-50%) rotate(30deg)' : 'translateY(-50%)',
	width: '30px',
	height: '180px',
	cursor: 'pointer',
	transition: 'transform 0.3s ease',
	'&:hover': {
		transform: pulled
			? 'translateY(-50%) rotate(30deg)'
			: 'translateY(-50%) rotate(-5deg)',
	},
}));

const LeverBase = styled(Box)({
	position: 'absolute',
	top: '50%',
	right: '-10px',
	transform: 'translateY(-50%)',
	width: '25px',
	height: '60px',
	borderRadius: '15px',
	background: 'linear-gradient(90deg, #5c5c5c 0%, #303030 100%)',
	boxShadow: '0 5px 10px rgba(0,0,0,0.5)',
	zIndex: 1,
});

const LeverArm = styled(Box)({
	position: 'absolute',
	top: '0',
	right: '8px',
	width: '15px',
	height: '120px',
	borderRadius: '8px',
	background: 'linear-gradient(90deg, #8B0000 0%, #D30000 100%)',
	boxShadow: '0 5px 8px rgba(0,0,0,0.3)',
});

const LeverKnob = styled(Box)({
	position: 'absolute',
	top: '-30px',
	right: '0',
	width: '30px',
	height: '30px',
	borderRadius: '50%',
	background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
	boxShadow: '0 5px 8px rgba(0,0,0,0.3)',
	border: '2px solid #8B0000',
});

const SlotControls = styled(Box)({
	display: 'flex',
	justifyContent: 'center',
	marginTop: '20px',
	gap: '15px',
});

const SlotButton = styled(Button)({
	backgroundColor: '#D30000',
	color: '#fff',
	fontWeight: 'bold',
	borderRadius: '20px',
	padding: '12px 25px',
	boxShadow:
		'0 5px 10px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)',
	'&:hover': {
		backgroundColor: '#FF0000',
		boxShadow:
			'0 7px 14px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.3)',
	},
	'&.Mui-disabled': {
		backgroundColor: '#3D3D55',
		color: '#aaa',
	},
});

const PaylineBox = styled(Box)({
	position: 'absolute',
	left: '0',
	right: '0',
	top: '50%',
	transform: 'translateY(-50%)',
	height: '5px',
	backgroundColor: '#FFD700',
	opacity: 0.7,
	zIndex: 2,
	pointerEvents: 'none',
});

const CasinoLights = styled(Box)({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	height: '6px',
	display: 'flex',
	justifyContent: 'space-between',
});

const Light = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay: number }>(({ delay }) => ({
	width: '6px',
	height: '6px',
	borderRadius: '50%',
	backgroundColor: '#FFD700',
	animation: `pulse 1s ${delay}ms infinite`,
	'@keyframes pulse': {
		'0%': { opacity: 0.2, boxShadow: '0 0 2px #FFD700' },
		'50%': { opacity: 1, boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700' },
		'100%': { opacity: 0.2, boxShadow: '0 0 2px #FFD700' },
	},
}));

const PayoutTable = styled(Box)({
	marginTop: '20px',
	backgroundColor: 'rgba(0,0,0,0.4)',
	borderRadius: '12px',
	padding: '15px',
	border: '1px solid rgba(255,255,255,0.1)',
	boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)',
});

const WinnerDisplay = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWinning',
})<{ isWinning: boolean }>(({ isWinning }) => ({
	backgroundColor: isWinning ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
	borderRadius: '10px',
	padding: isWinning ? '10px' : '0',
	marginTop: isWinning ? '20px' : '0',
	textAlign: 'center',
	overflow: 'hidden',
	height: isWinning ? 'auto' : '0',
	opacity: isWinning ? 1 : 0,
	transition: 'all 0.5s ease',
	animation: isWinning ? 'winningPulse 2s infinite' : 'none',
	'@keyframes winningPulse': {
		'0%': { boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.3)' },
		'50%': { boxShadow: '0 0 25px 10px rgba(255, 215, 0, 0.7)' },
		'100%': { boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.3)' },
	},
}));

// Add a new state to track winning paylines
const WinningPayline = styled(Box)({
	position: 'absolute',
	left: '0',
	right: '0',
	top: '50%',
	transform: 'translateY(-50%)',
	height: '8px',
	backgroundColor: '#FFD700',
	opacity: 0.9,
	zIndex: 5,
	pointerEvents: 'none',
	animation: 'pulse 1s infinite',
	'@keyframes pulse': {
		'0%': { opacity: 0.7, boxShadow: '0 0 5px 2px #FFD700' },
		'50%': { opacity: 1, boxShadow: '0 0 15px 5px #FFD700' },
		'100%': { opacity: 0.7, boxShadow: '0 0 5px 2px #FFD700' },
	},
});

function CasinoGame({ open, onClose }: CasinoGameProps) {
	// Load balance from localStorage or use default
	const [balance, setBalance] = useState(() => {
		const savedBalance = localStorage.getItem('cmueats-balance');
		return savedBalance ? Number(savedBalance) : 2500;
	});

	// Add state for loan interface
	const [showLoanDialog, setShowLoanDialog] = useState(false);
	const [loanAmount, setLoanAmount] = useState(500);

	// Save balance when it changes
	useEffect(() => {
		localStorage.setItem('cmueats-balance', balance.toString());
	}, [balance]);

	// Game state
	const [selectedGame, setSelectedGame] = useState<string | null>(null);
	const [betAmount, setBetAmount] = useState(50);
	const [gameState, setGameState] = useState('selecting'); // selecting, betting, playing, result
	const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [insanityMode, setInsanityMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Card game specific states
	const [playerCard, setPlayerCard] = useState<string | null>(null);
	const [opponentCard, setOpponentCard] = useState<string | null>(null);
	const [prediction, setPrediction] = useState<'higher' | 'lower' | null>(
		null,
	);
	const [matchingCards, setMatchingCards] = useState<string[]>([]);
	const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
	const [lastRevealedIndex, setLastRevealedIndex] = useState<number | null>(
		null,
	);
	const [coinSide, setCoinSide] = useState<'heads' | 'tails' | null>(null);
	const [playerChoice, setPlayerChoice] = useState<'heads' | 'tails' | null>(
		null,
	);

	// Slots game states
	const [spinning, setSpinning] = useState(false);
	const [spinResult, setSpinResult] = useState<string[]>(['', '', '']);
	const [leverPulled, setLeverPulled] = useState(false);
	const [winningLine, setWinningLine] = useState(false);
	const [pendingResult, setPendingResult] = useState(false);

	// Add game difficulty settings and timer state
	const [memoryGameDifficulty, setMemoryGameDifficulty] = useState<
		'easy' | 'medium' | 'hard'
	>('medium');
	const [timeRemaining, setTimeRemaining] = useState<number>(60);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Add timer refs to properly handle cleanup
	const timerRefs = useRef<NodeJS.Timeout[]>([]);

	// Cleanup function for timers
	useEffect(
		() => () => timerRefs.current.forEach((timer) => clearTimeout(timer)),
		[],
	);

	// Helper function to safely set timeouts
	const safeSetTimeout = (
		callback: () => void,
		delay: number,
	): NodeJS.Timeout => {
		const timer = setTimeout(callback, delay) as NodeJS.Timeout;
		timerRefs.current.push(timer);
		return timer;
	};

	// Place these functions right after all the state declarations
	// After the line: const [pokerResult, setPokerResult] = useState<string>('');

	// Function declarations in the correct order
	const getCardValue = (card: string) => {
		if (!card) return 0;
		const value = card.slice(0, -1); // Remove the suit
		switch (value) {
			case 'J':
				return 11;
			case 'Q':
				return 12;
			case 'K':
				return 13;
			case 'A':
				return 14;
			default:
				return parseInt(value, 10);
		}
	};

	// Helper functions for difficulty modifiers
	const getDifficultyModifier = (difficulty: string): number => {
		if (difficulty === 'Hard') return 0.7;
		return 1;
	};

	const getWinChance = (difficulty: string): number => {
		if (difficulty === 'Hard') return 0.25;
		return 0.55;
	};

	// Helper function for coin flip result
	const getCoinFlipResult = (
		playerWins: boolean,
		choice: 'heads' | 'tails',
	): 'heads' | 'tails' => {
		if (playerWins) return choice;
		return choice === 'heads' ? 'tails' : 'heads';
	};

	const handleGameResult = (
		result: 'win' | 'lose',
		multiplier: number = 1,
	) => {
		setGameResult(result);
		setGameState('result');

		const winnings = result === 'win' ? betAmount * multiplier : -betAmount;

		// Apply opponent difficulty modifier
		let actualWinnings = winnings;
		if (result === 'win' && selectedGame) {
			const opponent = opponents.find(
				(o) => o.id === Number(selectedGame),
			);
			if (opponent) {
				const difficultyModifier = getDifficultyModifier(
					opponent.difficulty,
				);
				actualWinnings = Math.floor(winnings * difficultyModifier);
			}
		}

		setBalance((prev) => prev + actualWinnings);

		// Show result alert
		if (result === 'win') {
			const multiplierText =
				multiplier > 1 ? ` (${multiplier}x multiplier!)` : '';
			setAlertMessage(
				`Congratulations! You won ${actualWinnings} tokens${multiplierText}!`,
			);
			setAlertSeverity('success');
		} else {
			setAlertMessage(`You lost ${betAmount} tokens!`);
			setAlertSeverity('error');
		}
		setShowAlert(true);

		// Random chance for insanity mode after a few games
		if (Math.random() < 0.2 && balance > 1000) {
			setInsanityMode(true);
		}
	};

	// Setup matching game
	const setupMatchingGame = () => {
		// Clear any existing timer
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		// Create a deck of cards
		const allCards = cardSuits.flatMap((suit) =>
			cardValues.map((value) => `${value}${suit}`),
		);

		// Shuffle the full deck
		const shuffled = [...allCards].sort(() => 0.5 - Math.random());

		// Select cards based on difficulty
		let numPairs: number;
		let timeLimit: number;

		switch (memoryGameDifficulty) {
			case 'easy':
				numPairs = 3; // 6 cards total
				timeLimit = 60;
				break;
			case 'hard':
				numPairs = 8; // 16 cards total
				timeLimit = 45;
				break;
			case 'medium':
			default:
				numPairs = 5; // 10 cards total
				timeLimit = 50;
				break;
		}

		// Select cards for the game
		const selected = shuffled.slice(0, numPairs);

		// Create pairs
		setMatchingCards(
			[...selected, ...selected].sort(() => 0.5 - Math.random()),
		);

		// Reset game state
		setRevealedIndices([]);
		setLastRevealedIndex(null);

		// Set timer
		setTimeRemaining(timeLimit);

		// Start the timer
		timerRef.current = setInterval(() => {
			setTimeRemaining((prev) => {
				const newTime = prev - 1;
				if (newTime <= 0) {
					if (timerRef.current) {
						clearInterval(timerRef.current);
					}
					return 0;
				}
				return newTime;
			});
		}, 1000) as NodeJS.Timeout;
	};

	// Make sure to clean up timer when component unmounts or game changes
	useEffect(
		() => () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		},
		[],
	);

	// Update handleCardReveal to stop timer when game ends
	const handleCardReveal = (index: number) => {
		if (revealedIndices.includes(index) || isLoading) return;

		const newRevealedIndices = [...revealedIndices, index];
		setRevealedIndices(newRevealedIndices);

		if (lastRevealedIndex === null) {
			setLastRevealedIndex(index);
		} else {
			setIsLoading(true);
			// Check if the two cards match
			if (matchingCards[lastRevealedIndex] === matchingCards[index]) {
				// Match found
				if (newRevealedIndices.length === matchingCards.length) {
					// All cards matched - player wins
					// Stop timer
					if (timerRef.current) {
						clearInterval(timerRef.current);
					}
					// Calculate bonus based on remaining time
					const timeBonus = Math.floor(timeRemaining / 10);
					const multiplier = timeBonus > 0 ? 1 + timeBonus * 0.1 : 1;

					setTimeout(() => {
						handleGameResult('win', multiplier);
						setIsLoading(false);
					}, 1000);
				} else {
					setIsLoading(false);
				}
			} else {
				// No match - hide cards after a delay
				setTimeout(() => {
					setRevealedIndices(
						newRevealedIndices.filter(
							(i) => i !== lastRevealedIndex && i !== index,
						),
					);

					// Opponent gets a turn based on difficulty
					let opponentMatchChance: number;

					// Adjust opponent skill based on difficulty
					switch (memoryGameDifficulty) {
						case 'easy':
							opponentMatchChance = 0.3; // 30% chance to find a match
							break;
						case 'hard':
							opponentMatchChance = 0.8; // 80% chance to find a match
							break;
						case 'medium':
						default:
							opponentMatchChance = 0.5; // 50% chance to find a match
							break;
					}

					const remainingIndices = Array.from({
						length: matchingCards.length,
					})
						.map((_, i) => i)
						.filter((i) => !newRevealedIndices.includes(i));

					if (
						remainingIndices.length >= 2 &&
						Math.random() < opponentMatchChance
					) {
						// Find matching cards in remaining
						const cardPairs = remainingIndices.reduce(
							(pairs, idx) => {
								const card = matchingCards[idx];
								const updatedPairs = { ...pairs };
								if (!updatedPairs[card])
									updatedPairs[card] = [];
								updatedPairs[card].push(idx);
								return updatedPairs;
							},
							{} as Record<string, number[]>,
						);

						const pairsFound = Object.values(cardPairs).filter(
							(indices) => indices.length === 2,
						);

						if (pairsFound.length > 0) {
							// Opponent found a pair
							const chosenPair =
								pairsFound[
									Math.floor(
										Math.random() * pairsFound.length,
									)
								];
							setTimeout(() => {
								setRevealedIndices([
									...newRevealedIndices.filter(
										(i) =>
											i !== lastRevealedIndex &&
											i !== index,
									),
									...chosenPair,
								]);

								// Check if all cards are now revealed
								if (
									newRevealedIndices.length -
										2 +
										chosenPair.length ===
									matchingCards.length
								) {
									// Game over - player loses
									if (timerRef.current) {
										clearInterval(timerRef.current);
									}
									handleGameResult('lose');
								}
								setIsLoading(false);
							}, 1000);
						} else {
							setIsLoading(false);
						}
					} else {
						setIsLoading(false);
					}
				}, 1000);
			}
			setLastRevealedIndex(null);
		}
	};

	// Reset game state for game selection
	const resetGameState = () => {
		// Original code
		setGameResult(null);
		setPlayerCard(null);
		setOpponentCard(null);
		setPrediction(null);
		setMatchingCards([]);
		setRevealedIndices([]);
		setLastRevealedIndex(null);
		setCoinSide(null);
		setPlayerChoice(null);
		setSpinning(false);
		setSpinResult(['', '', '']);

		// New: Stop any active timers
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
	};

	// Reset game when dialog closes
	const resetGame = () => {
		setSelectedGame(null);
		setBetAmount(50);
		setGameState('selecting');
		resetGameState();
	};

	useEffect(() => {
		if (!open) {
			resetGame();
		}
	}, [open]);

	const handleGameSelect = (game: string) => {
		setSelectedGame(game);
		setGameState('betting');
		setBetAmount(50);
		resetGameState();
	};

	const handleBetChange = (_event: Event, newValue: number | number[]) => {
		setBetAmount(newValue as number);
	};

	// Update handleStartGame to setup the memory game
	const handleStartGame = () => {
		if (betAmount > balance) {
			setAlertMessage("You don't have enough balance for this bet!");
			setAlertSeverity('error');
			setShowAlert(true);
			return;
		}

		setGameState('playing');

		// Set up the specific game
		if (selectedGame === GAMES.HIGHER_LOWER) {
			const randomIdx = Math.floor(Math.random() * cardValues.length);
			const randomSuit =
				cardSuits[Math.floor(Math.random() * cardSuits.length)];
			setPlayerCard(`${cardValues[randomIdx]}${randomSuit}`);
		} else if (selectedGame === GAMES.COIN_FLIP) {
			// No setup needed yet
		} else if (selectedGame === GAMES.MATCHING) {
			setupMatchingGame(); // Start the memory game with timer
		}
	};

	const handleHigherLowerPrediction = (choice: 'higher' | 'lower') => {
		setPrediction(choice);
		setIsLoading(true);

		// Simulate opponent drawing a card with some delay for suspense
		safeSetTimeout(() => {
			const playerValue = getCardValue(playerCard!);
			let opponentValue;
			let result: 'win' | 'lose';

			// Get opponent difficulty factor
			let winChance = 0.5; // default 50/50
			if (selectedGame) {
				const opponent = opponents.find(
					(o) => o.id === Number(selectedGame),
				);
				if (opponent) {
					winChance = getWinChance(opponent.difficulty);
				}
			}

			// Determine result first based on difficulty
			result = Math.random() < winChance ? 'win' : 'lose';

			// Now set the card based on the predetermined result
			if (result === 'win') {
				// Player wins - card should match prediction
				if (choice === 'higher') {
					// Need a higher card
					const possibleValues = cardValues
						.map((v) => getCardValue(`${v}♠`))
						.filter((v) => v > playerValue);

					if (possibleValues.length > 0) {
						// Randomly select a value higher than player's
						opponentValue =
							possibleValues[
								Math.floor(
									Math.random() * possibleValues.length,
								)
							];
					} else {
						// Edge case: player has highest card, force loss instead
						result = 'lose';
						opponentValue =
							playerValue - (1 + Math.floor(Math.random() * 3));
						opponentValue = Math.max(2, opponentValue); // Don't go below 2
					}
				} else {
					// Need a lower card
					const possibleValues = cardValues
						.map((v) => getCardValue(`${v}♠`))
						.filter((v) => v < playerValue);

					if (possibleValues.length > 0) {
						// Randomly select a value lower than player's
						opponentValue =
							possibleValues[
								Math.floor(
									Math.random() * possibleValues.length,
								)
							];
					} else {
						// Edge case: player has lowest card, force loss instead
						result = 'lose';
						opponentValue =
							playerValue + (1 + Math.floor(Math.random() * 3));
						opponentValue = Math.min(14, opponentValue); // Don't go above Ace (14)
					}
				}
			} else {
				// Player loses - card should be opposite of prediction
				const needLowerOrEqual = choice === 'higher';
				const possibleValues = cardValues
					.map((v) => getCardValue(`${v}♠`))
					.filter((v) =>
						needLowerOrEqual ? v <= playerValue : v >= playerValue,
					);

				if (possibleValues.length > 0) {
					// Randomly select a value based on prediction
					opponentValue =
						possibleValues[
							Math.floor(Math.random() * possibleValues.length)
						];
				} else {
					// Edge case: force win instead
					result = 'win';
					opponentValue = needLowerOrEqual
						? playerValue + (1 + Math.floor(Math.random() * 3))
						: playerValue - (1 + Math.floor(Math.random() * 3));
					opponentValue = needLowerOrEqual
						? Math.min(14, opponentValue) // Don't go above Ace (14)
						: Math.max(2, opponentValue); // Don't go below 2
				}
			}

			// Convert opponentValue back to a card
			const opponentValueIndex = cardValues.findIndex(
				(v) => getCardValue(`${v}♠`) === opponentValue,
			);
			const randomSuit =
				cardSuits[Math.floor(Math.random() * cardSuits.length)];
			const opponentCardValue = `${cardValues[opponentValueIndex]}${randomSuit}`;
			setOpponentCard(opponentCardValue);

			handleGameResult(result);
			setIsLoading(false);
		}, 1000);
	};

	const handleCoinFlipChoice = (choice: 'heads' | 'tails') => {
		setPlayerChoice(choice);
		setIsLoading(true);

		// Simulate coin flip with some delay for suspense
		safeSetTimeout(() => {
			// Base win chance adjusted to 49/51 in favor of house
			const winChance = 0.49; // changed from 0.25 to 0.49 for 49/51 odds

			// Determine result first
			const playerWins = Math.random() < winChance;

			// Set coin side based on the result
			const result = getCoinFlipResult(playerWins, choice);
			setCoinSide(result);

			handleGameResult(playerWins ? 'win' : 'lose');
			setIsLoading(false);
		}, 1000);
	};

	const handleSlotSpin = () => {
		if (betAmount > balance) {
			setAlertMessage("You don't have enough balance for this bet!");
			setAlertSeverity('error');
			setShowAlert(true);
			return;
		}

		setSpinning(true);
		setIsLoading(true);
		setWinningLine(false);
		setPendingResult(true);

		// Simulate slot machine spinning with randomized delay
		const symbols = [
			'🧋', // Boba tea (jackpot - 5x)
			'🍕', // Pizza
			'🌮', // Taco
			'🍔', // Hamburger
			'🍣', // Sushi (3x)
			'🍜', // Ramen
			'🍱', // Bento box
			'🥘', // Paella/food in pan
			'🍩', // Donut
			'🍦', // Ice cream
			'🍪', // Cookie
			'🍗', // Chicken
			'🥞', // Pancakes
			'🥨', // Pretzel
			'🍚', // Rice
			'🥐', // Croissant
			'🥪', // Sandwich
			'🧁', // Cupcake (3x)
			'🍟', // French fries (3x)
		];
		const spinDuration = 2000 + Math.random() * 1000;

		// Animate spinning
		const spinInterval = setInterval(() => {
			setSpinResult([
				symbols[Math.floor(Math.random() * symbols.length)],
				symbols[Math.floor(Math.random() * symbols.length)],
				symbols[Math.floor(Math.random() * symbols.length)],
			]);
		}, 100);

		// Stop spinning after duration
		safeSetTimeout(() => {
			clearInterval(spinInterval);

			// Determine final result with varied probabilities
			const finalResult: string[] = [];
			const random = Math.random();

			// Different win probabilities based on opponent difficulty
			const winProbability = 0.15; // default

			if (random < winProbability) {
				// Win - all symbols match or special win patterns
				const winSymbol =
					symbols[Math.floor(Math.random() * symbols.length)];

				// Special case for 🍣 (bigger win) or 🧋 (jackpot)
				if (Math.random() < 0.08) {
					// 3x payout group - one of the 3x symbols
					const specialSymbols = ['🍣', '🧁', '🍟'];
					const chosenSpecial =
						specialSymbols[
							Math.floor(Math.random() * specialSymbols.length)
						];
					finalResult.push(
						chosenSpecial,
						chosenSpecial,
						chosenSpecial,
					);
					setWinningLine(true);

					// Delay before showing result screen
					safeSetTimeout(() => {
						handleGameResult('win', 3); // Triple multiplier
						setPendingResult(false);
					}, 2500);
				} else if (Math.random() < 0.03) {
					finalResult.push('🧋', '🧋', '🧋');
					setWinningLine(true);

					// Delay before showing result screen
					safeSetTimeout(() => {
						handleGameResult('win', 5); // 5x multiplier for boba jackpot
						setPendingResult(false);
					}, 2500);
				} else {
					finalResult.push(winSymbol, winSymbol, winSymbol);
					setWinningLine(true);

					// Delay before showing result screen
					safeSetTimeout(() => {
						handleGameResult('win', 2); // Standard win
						setPendingResult(false);
					}, 2500);
				}
			} else {
				// Loss - random non-matching symbols
				const a = symbols[Math.floor(Math.random() * symbols.length)];
				let b;
				let c;

				do {
					b = symbols[Math.floor(Math.random() * symbols.length)];
				} while (b === a);

				// Occasionally have two matching symbols for "near miss" effect
				if (Math.random() < 0.4) {
					c = a;
					// If a and b match by chance, pick a different c
					if (a === b) {
						do {
							c =
								symbols[
									Math.floor(Math.random() * symbols.length)
								];
						} while (c === a);
					}
				} else {
					do {
						c = symbols[Math.floor(Math.random() * symbols.length)];
					} while (c === a || c === b);
				}

				finalResult.push(a, b, c);

				// Delay before showing result screen
				safeSetTimeout(() => {
					handleGameResult('lose');
					setPendingResult(false);
				}, 2500);
			}

			setSpinResult(finalResult);
			setSpinning(false);
			setIsLoading(false);
		}, spinDuration);
	};

	const handlePlayAgain = () => {
		setGameState('betting');
		setGameResult(null);
		setPlayerCard(null);
		setOpponentCard(null);
		setPrediction(null);
		setCoinSide(null);
		setPlayerChoice(null);

		if (selectedGame === GAMES.MATCHING) {
			setupMatchingGame();
		}
	};

	const handleAlertClose = () => {
		setShowAlert(false);
	};

	// Add a helper function to generate unique card IDs
	const generateCardId = (card: string, position: number): string => {
		const cardValue = card.slice(0, -1); // Remove suit
		const cardSuit = card.slice(-1); // Get suit
		return `match-card-${cardValue}-${cardSuit}-${position}`;
	};

	// Add loan handling function
	const handleLoanRequest = () => {
		if (balance <= 100) {
			setBalance((prev) => prev + loanAmount);
			setAlertMessage(`Successfully borrowed $${loanAmount}!`);
			setAlertSeverity('success');
			setShowAlert(true);
			setShowLoanDialog(false);
		} else {
			setAlertMessage(
				'Loans are only available when your balance falls below $100.',
			);
			setAlertSeverity('error');
			setShowAlert(true);
		}
	};

	const renderGameSelection = () => (
		<Box sx={{ py: 3 }}>
			<MainTitle variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
				Choose Your Game of Chance
			</MainTitle>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.HIGHER_LOWER)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 'bold',
										color: '#D30000',
										mb: 2,
									}}
								>
									Higher or Lower
								</Typography>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Predict if the next card will be higher or
									lower than yours.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.HIGHER_LOWER)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Higher or Lower
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.MATCHING)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 'bold',
										color: '#D30000',
										mb: 2,
									}}
								>
									Memory Match
								</Typography>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Find all matching pairs before your
									opponent.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.MATCHING)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Memory Match
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.COIN_FLIP)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 'bold',
										color: '#D30000',
										mb: 2,
									}}
								>
									Coin Flip
								</Typography>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Bet on heads or tails in this classic game
									of chance.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.COIN_FLIP)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Coin Flip
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard onClick={() => handleGameSelect(GAMES.SLOTS)}>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 'bold',
										color: '#D30000',
										mb: 2,
									}}
								>
									Slots
								</Typography>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Test your luck with the slot machine. Match
									delicious food emojis to win!
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.SLOTS)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Slots
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.CARD_COUNTING)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 'bold',
										color: '#D30000',
										mb: 2,
									}}
								>
									Card Counting
								</Typography>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Learn and practice card counting techniques
									to improve your blackjack game.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.CARD_COUNTING)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Card Counting
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						sx={{
							transform: 'translateY(0)',
							transition: 'transform 0.3s ease',
							'&:hover': {
								transform: 'translateY(-10px)',
							},
						}}
						onClick={() => handleGameSelect(GAMES.ROULETTE)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 'bold',
										color: '#D30000',
										mb: 2,
									}}
								>
									Roulette
								</Typography>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									The classic casino game of chance. Place
									your bets on numbers, colors, or groups and
									watch the wheel spin!
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.ROULETTE)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Roulette
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
			</Grid>
		</Box>
	);

	const renderBettingUI = () => (
		<Box>
			<GameInfoBox>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Place Your Bet
				</Typography>
				<Typography variant="body2" sx={{ mb: 2 }}>
					How much are you willing to risk?
				</Typography>

				<Box sx={{ mb: 2 }}>
					<BetSlider
						value={betAmount}
						onChange={handleBetChange}
						min={10}
						max={Math.min(1000, balance)}
						step={10}
						valueLabelDisplay="on"
						valueLabelFormat={(value) => `$${value}`}
					/>
				</Box>

				{/* Show difficulty selector only for memory game */}
				{selectedGame === GAMES.MATCHING && (
					<Box sx={{ mb: 2 }}>
						<Typography variant="body2" sx={{ mb: 1 }}>
							Select Difficulty:
						</Typography>
						<Box
							sx={{
								display: 'flex',
								gap: 2,
								justifyContent: 'center',
							}}
						>
							<Button
								variant={
									memoryGameDifficulty === 'easy'
										? 'contained'
										: 'outlined'
								}
								color="primary"
								onClick={() => setMemoryGameDifficulty('easy')}
								sx={{ flexGrow: 1 }}
							>
								Easy (6 cards)
							</Button>
							<Button
								variant={
									memoryGameDifficulty === 'medium'
										? 'contained'
										: 'outlined'
								}
								color="primary"
								onClick={() =>
									setMemoryGameDifficulty('medium')
								}
								sx={{ flexGrow: 1 }}
							>
								Medium (10 cards)
							</Button>
							<Button
								variant={
									memoryGameDifficulty === 'hard'
										? 'contained'
										: 'outlined'
								}
								color="primary"
								onClick={() => setMemoryGameDifficulty('hard')}
								sx={{ flexGrow: 1 }}
							>
								Hard (16 cards)
							</Button>
						</Box>
					</Box>
				)}

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<PlayerChip
						icon={<AttachMoneyIcon />}
						label={`Balance: $${balance.toFixed(2)}`}
					/>
					<ActionButton onClick={handleStartGame}>
						Start Game
					</ActionButton>
				</Box>

				{balance < 100 && (
					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Typography
							variant="body2"
							color="error"
							sx={{ mb: 1 }}
						>
							Low on funds? Take a loan!
						</Typography>
						<ActionButton
							onClick={() => setShowLoanDialog(true)}
							size="small"
							variant="outlined"
						>
							Get Loan
						</ActionButton>
					</Box>
				)}
			</GameInfoBox>

			{/* Loan Dialog */}
			<Dialog
				open={showLoanDialog}
				onClose={() => setShowLoanDialog(false)}
				maxWidth="xs"
			>
				<Box sx={{ p: 3, backgroundColor: '#1E1E2D', color: 'white' }}>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Request Loan
					</Typography>
					<Typography variant="body2" sx={{ mb: 2 }}>
						How much would you like to borrow?
					</Typography>
					<BetSlider
						value={loanAmount}
						onChange={(_, value) => setLoanAmount(value as number)}
						min={100}
						max={1000}
						step={100}
						valueLabelDisplay="on"
						valueLabelFormat={(value) => `$${value}`}
						sx={{ mb: 3 }}
					/>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Button
							onClick={() => setShowLoanDialog(false)}
							variant="outlined"
							sx={{ color: 'white', borderColor: 'white' }}
						>
							Cancel
						</Button>
						<ActionButton onClick={handleLoanRequest}>
							Get Loan
						</ActionButton>
					</Box>
				</Box>
			</Dialog>
		</Box>
	);

	const renderHigherLowerGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Your Card
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
				<GameCard>
					<CardValue>{playerCard}</CardValue>
				</GameCard>
			</Box>

			{!prediction ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
					<ActionButton
						onClick={() => handleHigherLowerPrediction('higher')}
					>
						Higher
					</ActionButton>
					<ActionButton
						onClick={() => handleHigherLowerPrediction('lower')}
					>
						Lower
					</ActionButton>
				</Box>
			) : (
				<Box>
					<Typography
						variant="h6"
						sx={{ mb: 2, textAlign: 'center' }}
					>
						You predicted: {prediction.toUpperCase()}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: 3,
						}}
					>
						<GameCard>
							<CardValue>{playerCard}</CardValue>
						</GameCard>

						{isLoading ? (
							<CircularProgress color="secondary" />
						) : (
							<GameCard>
								{opponentCard ? (
									<CardValue>{opponentCard}</CardValue>
								) : (
									<CardBack />
								)}
							</GameCard>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);

	const renderMatchingGame = () => (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 2,
				}}
			>
				<Typography variant="h6" sx={{ textAlign: 'center' }}>
					Find the matching pairs
				</Typography>

				{/* Timer display */}
				<Typography
					variant="h6"
					sx={{
						color: timeRemaining < 10 ? '#D30000' : 'white',
						animation:
							timeRemaining < 10 ? 'pulse 1s infinite' : 'none',
						'@keyframes pulse': {
							'0%': { opacity: 1 },
							'50%': { opacity: 0.5 },
							'100%': { opacity: 1 },
						},
					}}
				>
					Time: {timeRemaining}s
				</Typography>
			</Box>

			{/* Game board */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					flexWrap: 'wrap',
					maxWidth: '600px',
					margin: '0 auto 20px',
				}}
			>
				{matchingCards.map((card, index) => (
					<GameCard
						key={generateCardId(card, index)}
						onClick={() =>
							!revealedIndices.includes(index) &&
							!isLoading &&
							handleCardReveal(index)
						}
						sx={{
							cursor: revealedIndices.includes(index)
								? 'default'
								: 'pointer',
							margin: '5px',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: revealedIndices.includes(index)
									? 'none'
									: 'scale(1.05)',
							},
						}}
					>
						{revealedIndices.includes(index) ? (
							<CardValue>{card}</CardValue>
						) : (
							<CardBack />
						)}
					</GameCard>
				))}
			</Box>
		</Box>
	);

	const renderCoinFlipGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Heads or Tails?
			</Typography>

			{!playerChoice ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mb: 3,
						}}
					>
						<Avatar
							sx={{
								width: 80,
								height: 80,
								bgcolor: 'gold',
								color: 'black',
							}}
						>
							<Typography variant="h5">?</Typography>
						</Avatar>
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 2,
						}}
					>
						<ActionButton
							onClick={() => handleCoinFlipChoice('heads')}
						>
							Heads
						</ActionButton>
						<ActionButton
							onClick={() => handleCoinFlipChoice('tails')}
						>
							Tails
						</ActionButton>
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography variant="body1" sx={{ mb: 2 }}>
						You chose: {playerChoice.toUpperCase()}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mb: 3,
						}}
					>
						{isLoading ? (
							<CircularProgress color="secondary" />
						) : (
							<Avatar
								sx={{
									width: 80,
									height: 80,
									bgcolor: 'gold',
									color: 'black',
								}}
							>
								<Typography variant="h5">
									{coinSide === 'heads' ? 'H' : 'T'}
								</Typography>
							</Avatar>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);

	// Update the renderSlotReels function with the new UI
	const renderSlotReels = (reels: string[], isSpinning: boolean) => {
		const reelPositions = ['left', 'middle', 'right']; // Fixed identifiers for reel positions

		return (
			<>
				{reels.map((symbol, index) => (
					<SlotReel
						key={`slot-reel-${reelPositions[index]}`}
						isSpinning={isSpinning}
						spinDelay={index * 50}
					>
						<SlotSymbol>{symbol || '?'}</SlotSymbol>
					</SlotReel>
				))}
			</>
		);
	};

	const renderSlotsGame = () => {
		const isWinning = gameResult === 'win' && !spinning && !isLoading;

		// Helper function to get spin button text
		const getSpinButtonText = () => {
			if (spinning) return 'SPINNING...';
			if (pendingResult) return 'PROCESSING...';
			return 'SPIN';
		};

		const handleLeverPull = () => {
			if (spinning || isLoading || pendingResult) return;
			setLeverPulled(true);
			safeSetTimeout(() => {
				handleSlotSpin();
				safeSetTimeout(() => setLeverPulled(false), 1000);
			}, 300);
		};

		// Create lights for casino effect
		const renderLights = () => {
			// Use fixed identifiers for lights instead of indexes
			const lightPositions = [
				'top-left',
				'top-center-left',
				'top-center',
				'top-center-right',
				'top-right',
				'middle-left',
				'middle-center-left',
				'middle-center',
				'middle-center-right',
				'middle-right',
				'bottom-left',
				'bottom-center-left',
				'bottom-center',
				'bottom-center-right',
				'bottom-right',
				'border-left',
				'border-center-left',
				'border-center',
				'border-center-right',
				'border-right',
			];

			const lights = [];
			for (let i = 0; i < 20; i += 1) {
				lights.push(
					<Light
						key={`casino-light-${lightPositions[i]}`}
						delay={(i * 100) % 500}
					/>,
				);
			}
			return lights;
		};

		// Check if we have a winning combination - all three symbols are the same
		const hasWinningCombination =
			!spinning &&
			spinResult.length === 3 &&
			spinResult[0] === spinResult[1] &&
			spinResult[1] === spinResult[2] &&
			spinResult[0] !== '';

		return (
			<Box sx={{ pt: 2, pb: 4 }}>
				<SlotMachineContainer>
					<CasinoLights>{renderLights()}</CasinoLights>

					<SlotHeader>
						<SlotTitle variant="h4">CMUEats Lucky Spins</SlotTitle>
						<Typography variant="subtitle1" color="#FFD700">
							Match delicious food emojis to win!
						</Typography>
					</SlotHeader>

					<SlotDisplayWindow>
						<PaylineBox />
						{/* Show winning payline when there's a match */}
						{winningLine && hasWinningCombination && (
							<WinningPayline />
						)}
						{renderSlotReels(spinResult, spinning)}
					</SlotDisplayWindow>

					<SlotLever pulled={leverPulled} onClick={handleLeverPull}>
						<LeverBase />
						<LeverArm />
						<LeverKnob />
					</SlotLever>

					{/* Show message when winning combination appears */}
					{hasWinningCombination && winningLine && (
						<Box
							sx={{
								mt: 2,
								p: 1,
								bgcolor: 'rgba(0, 0, 0, 0.7)',
								borderRadius: '8px',
								textAlign: 'center',
								animation: 'fadeIn 0.5s',
								'@keyframes fadeIn': {
									'0%': { opacity: 0 },
									'100%': { opacity: 1 },
								},
							}}
						>
							<Typography
								variant="h5"
								sx={{
									color: '#FFD700',
									fontWeight: 'bold',
									textShadow: '0 0 10px #FFD700',
								}}
							>
								{spinResult[0] === '🧋'
									? 'JACKPOT!'
									: 'WINNER!'}
							</Typography>
						</Box>
					)}

					<WinnerDisplay isWinning={isWinning}>
						<Typography
							variant="h5"
							sx={{
								color: '#FFD700',
								fontWeight: 'bold',
								textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
							}}
						>
							WINNER!
						</Typography>
					</WinnerDisplay>

					<SlotControls>
						<Typography
							variant="h6"
							sx={{ color: '#FFD700', alignSelf: 'center' }}
						>
							${betAmount.toFixed(2)}
						</Typography>

						<SlotButton
							variant="contained"
							onClick={handleSlotSpin}
							disabled={spinning || isLoading || pendingResult}
							startIcon={<AttachMoneyIcon />}
						>
							{getSpinButtonText()}
						</SlotButton>

						<PlayerChip
							icon={<AttachMoneyIcon />}
							label={`$${balance.toFixed(2)}`}
							sx={{
								alignSelf: 'center',
								display: 'flex',
								justifyContent: 'center',
							}}
						/>
					</SlotControls>

					<PayoutTable>
						<Typography
							variant="subtitle2"
							sx={{
								color: '#FFD700',
								marginBottom: '10px',
								textAlign: 'center',
							}}
						>
							MEAL PAYTABLE
						</Typography>
						<Grid container spacing={1} justifyContent="center">
							<Grid item xs={4}>
								<Chip
									label="🍕🍕🍕 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🌮🌮🌮 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍔🍔🍔 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍜🍜🍜 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍱🍱🍱 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🥘🥘🥘 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍩🍩🍩 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍦🍦🍦 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍪🍪🍪 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍗🍗🍗 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🥞🥞🥞 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🥨🥨🥨 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍚🍚🍚 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🥐🥐🥐 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🥪🥪🥪 = 2×"
									size="small"
									sx={{ bgcolor: '#572424', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🧁🧁🧁 = 3×"
									size="small"
									sx={{ bgcolor: '#8B0000', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍣🍣🍣 = 3×"
									size="small"
									sx={{ bgcolor: '#8B0000', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={4}>
								<Chip
									label="🍟🍟🍟 = 3×"
									size="small"
									sx={{ bgcolor: '#8B0000', width: '100%' }}
								/>
							</Grid>
							<Grid item xs={12}>
								<Chip
									label="🧋🧋🧋 = 5×"
									size="small"
									sx={{
										bgcolor: '#4B0082',
										width: '100%',
										color: '#FFD700',
										fontWeight: 'bold',
										fontSize: '1rem',
										height: '28px',
										mt: 1,
									}}
								/>
							</Grid>
						</Grid>
					</PayoutTable>
				</SlotMachineContainer>
			</Box>
		);
	};

	const renderGameContent = () => {
		if (gameState === 'selecting') {
			return renderGameSelection();
		}

		if (selectedGame === GAMES.CARD_COUNTING) {
			return (
				<CardCountingGame
					onWin={(multiplier: number) =>
						handleGameResult('win', multiplier || 1)
					}
					onLose={() => handleGameResult('lose')}
					balance={balance}
					betAmount={betAmount}
				/>
			);
		}

		if (selectedGame === GAMES.ROULETTE) {
			return (
				<RouletteGame
					open
					onClose={() => {
						resetGame();
						setSelectedGame(null);
						setGameState('selecting');
						// Force a re-render to fully close the dialog
						setTimeout(() => {
							setBalance((prev) => {
								localStorage.setItem(
									'cmueats-balance',
									prev.toString(),
								);
								return prev;
							});
						}, 50);
					}}
					initialBalance={balance}
				/>
			);
		}

		switch (selectedGame) {
			case GAMES.HIGHER_LOWER:
				return renderHigherLowerGame();
			case GAMES.MATCHING:
				return renderMatchingGame();
			case GAMES.COIN_FLIP:
				return renderCoinFlipGame();
			case GAMES.SLOTS:
				return renderSlotsGame();
			case GAMES.CARD_COUNTING:
				return (
					<CardCountingGame
						onWin={(multiplier: number) =>
							handleGameResult('win', multiplier || 1)
						}
						onLose={() => handleGameResult('lose')}
						balance={balance}
						betAmount={betAmount}
					/>
				);
			case GAMES.ROULETTE:
				return (
					<RouletteGame
						open
						onClose={() => {
							resetGame();
							setSelectedGame(null);
							setGameState('selecting');
							// Force a re-render to fully close the dialog
							setTimeout(() => {
								setBalance((prev) => {
									localStorage.setItem(
										'cmueats-balance',
										prev.toString(),
									);
									return prev;
								});
							}, 50);
						}}
						initialBalance={balance}
					/>
				);
			default:
				return null;
		}
	};

	const renderGameResultUI = () => {
		const opponent = selectedGame
			? opponents.find((o) => o.id === Number(selectedGame))
			: null;

		return (
			<Box>
				<GameAnimation>
					{gameResult === 'win' ? (
						<Box sx={{ textAlign: 'center' }}>
							<CelebrationIcon
								sx={{
									fontSize: '4rem',
									color: '#FFD700',
									mb: 2,
								}}
							/>
							<Typography
								variant="h4"
								color="#FFD700"
								fontWeight="bold"
							>
								YOU WIN!
							</Typography>
						</Box>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<SentimentVeryDissatisfiedIcon
								sx={{
									fontSize: '4rem',
									color: '#D30000',
									mb: 2,
								}}
							/>
							<Typography
								variant="h4"
								color="#D30000"
								fontWeight="bold"
							>
								YOU LOSE
							</Typography>
						</Box>
					)}
				</GameAnimation>

				{opponent && (
					<Box sx={{ textAlign: 'center', mb: 3 }}>
						<Typography variant="body1">
							{gameResult === 'win'
								? `You defeated ${opponent.name}!`
								: `${opponent.name} defeated you!`}
						</Typography>
					</Box>
				)}

				<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
					<PlayerChip
						icon={<AttachMoneyIcon />}
						label={`Balance: ${balance} tokens`}
					/>
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
					<ActionButton onClick={handlePlayAgain}>
						Play Again
					</ActionButton>
					<Button
						variant="outlined"
						onClick={() => {
							setGameState('selecting');
							setSelectedGame(null);
						}}
						sx={{
							borderColor: '#D30000',
							color: '#fff',
							'&:hover': {
								borderColor: '#FF0000',
								backgroundColor: 'rgba(211, 0, 0, 0.1)',
							},
						}}
					>
						Change Game
					</Button>
				</Box>

				{insanityMode && gameResult === 'lose' && (
					<InsanityEffect
						sx={{
							mt: 3,
							p: 2,
							borderRadius: '8px',
							border: '1px solid #D30000',
						}}
					>
						<Typography
							variant="body1"
							color="#D30000"
							fontWeight="bold"
							textAlign="center"
						>
							&quot;The greater the risk, the greater the reward.
							Double your bet next time?&quot;
						</Typography>
					</InsanityEffect>
				)}
			</Box>
		);
	};

	// Add a useEffect to reset the winning line when the game result changes
	useEffect(() => {
		if (gameResult !== null) {
			setWinningLine(false);
		}
	}, [gameResult]);

	return (
		<StyledDialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			disableEscapeKeyDown={false}
			onBackdropClick={onClose}
		>
			<GameHeader>
				<Box
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						zIndex: 9999, // Increased from 1000 to 9999
					}}
				>
					<IconButton
						onClick={onClose}
						sx={{ color: '#fff' }}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<MainTitle
					variant="h4"
					sx={{
						textAlign: 'center',
						fontWeight: 700,
						letterSpacing: '0.5px',
					}}
				>
					CMUEats Private Academy
				</MainTitle>
				<Typography
					variant="h5"
					sx={{ color: '#ccc', mt: 1, mb: 2, lineHeight: 1.4 }}
				>
					CMUEats: The Ultimate Gambling Experience
				</Typography>
			</GameHeader>

			<DialogContent
				sx={{
					backgroundColor: '#1E1E2D',
					position: 'relative',
					padding: '20px 20px 40px 20px',
				}}
			>
				{gameState === 'selecting' && renderGameSelection()}

				{gameState === 'betting' && renderBettingUI()}

				{gameState === 'playing' && renderGameContent()}

				{gameState === 'result' && renderGameResultUI()}
			</DialogContent>

			<Snackbar
				open={showAlert}
				autoHideDuration={4000}
				onClose={handleAlertClose}
			>
				<Alert
					onClose={handleAlertClose}
					severity={alertSeverity}
					sx={{ width: '100%' }}
				>
					{alertMessage}
				</Alert>
			</Snackbar>
		</StyledDialog>
	);
}

export default CasinoGame;
