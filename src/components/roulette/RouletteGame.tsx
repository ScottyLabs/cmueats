import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	Box,
	Typography,
	Button,
	Grid,
	Chip,
	IconButton,
	Slider,
	Snackbar,
	Alert,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CasinoIcon from '@mui/icons-material/Casino';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import RouletteWheel from './RouletteWheel';
import RouletteBettingLayout, { RouletteBet } from './RouletteBettingLayout';

// Styled components from CasinoGame.tsx (maintaining style consistency)
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

const HistoryTableContainer = styled(TableContainer)({
	backgroundColor: '#272736',
	borderRadius: '8px',
	maxHeight: '250px',
	'& .MuiTableCell-root': {
		color: 'white',
		borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
	},
	'& .MuiTableCell-head': {
		backgroundColor: '#1E1E2D',
		fontWeight: 'bold',
	},
});

// Roulette result history item
interface RouletteResult {
	id: number;
	number: number;
	color: 'red' | 'black' | 'green';
	timestamp: string;
}

// Game state type
type GameState = 'idle' | 'betting' | 'spinning' | 'result';

interface RouletteGameProps {
	open: boolean;
	onClose: () => void;
	initialBalance?: number;
}

export default function RouletteGame({
	open,
	onClose,
	initialBalance = 1000,
}: RouletteGameProps) {
	// Game state
	const [balance, setBalance] = useState(initialBalance);
	const [betAmount, setBetAmount] = useState(25);
	const [selectedBets, setSelectedBets] = useState<RouletteBet[]>([]);
	const [gameState, setGameState] = useState<GameState>('idle');
	const [spinning, setSpinning] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentResult, setResult] = useState<number | null>(null);
	const [resultHistory, setResultHistory] = useState<RouletteResult[]>([]);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [showHistory, setShowHistory] = useState(false);
	const [totalBet, setTotalBet] = useState(0);
	const [lastWinAmount, setLastWinAmount] = useState(0);

	// Helper function to get color code from color name
	const getColorCode = (color: 'red' | 'black' | 'green'): string => {
		switch (color) {
			case 'red':
				return '#D30000';
			case 'black':
				return '#000000';
			case 'green':
				return '#0c4e20';
			default:
				return '#000000';
		}
	};

	// Display an alert message
	const displayAlert = (
		message: string,
		severity: 'success' | 'error' | 'warning' | 'info',
	) => {
		setAlertMessage(message);
		setAlertSeverity(severity);
		setShowAlert(true);
	};

	// Reset game state
	const resetGame = () => {
		setSelectedBets([]);
		setResult(null);
		setGameState('idle');
		setTotalBet(0);
		setLastWinAmount(0);
	};

	// Process the game result, calculate winnings
	const processGameResult = (resultNumber: number) => {
		// Define red and black numbers
		const redNumbers = [
			1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
		];
		const isRed = redNumbers.includes(resultNumber);
		const isBlack = resultNumber !== 0 && !isRed;
		let resultColor: 'red' | 'black' | 'green';

		if (resultNumber === 0) {
			resultColor = 'green';
		} else if (isRed) {
			resultColor = 'red';
		} else {
			resultColor = 'black';
		}

		// Add to history
		const newResult: RouletteResult = {
			id: Date.now(),
			number: resultNumber,
			color: resultColor,
			timestamp: new Date().toLocaleTimeString(),
		};

		setResultHistory((prev) => [newResult, ...prev].slice(0, 20)); // Keep last 20 results

		// Calculate winnings
		let totalWin = 0;

		selectedBets.forEach((bet) => {
			// Check if the bet is a winner based on bet type and numbers
			let isWinner = false;

			switch (bet.type) {
				case 'straight':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'split':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'street':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'corner':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'line':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'column':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'dozen':
					isWinner = bet.numbers.includes(resultNumber);
					break;
				case 'red':
					isWinner = isRed;
					break;
				case 'black':
					isWinner = isBlack;
					break;
				case 'even':
					isWinner = resultNumber !== 0 && resultNumber % 2 === 0;
					break;
				case 'odd':
					isWinner = resultNumber !== 0 && resultNumber % 2 === 1;
					break;
				case 'low':
					isWinner = resultNumber >= 1 && resultNumber <= 18;
					break;
				case 'high':
					isWinner = resultNumber >= 19 && resultNumber <= 36;
					break;
				default:
					break;
			}

			if (isWinner) {
				// Calculate winnings (original bet + winnings)
				totalWin += bet.amount + bet.amount * bet.payout;
			}
		});

		// Update balance
		setLastWinAmount(totalWin);
		setBalance((prev) => prev + totalWin);

		// Display result
		setGameState('result');

		if (totalWin > 0) {
			displayAlert(`You won $${totalWin.toFixed(2)}!`, 'success');
		} else {
			displayAlert(
				`You lost $${totalBet.toFixed(2)}. Better luck next time!`,
				'error',
			);
		}
	};

	// Reset game state when dialog is opened/closed
	useEffect(() => {
		if (open) {
			resetGame();
		}
	}, [open]);

	// Calculate the total bet amount whenever selected bets change
	useEffect(() => {
		const total = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
		setTotalBet(total);
	}, [selectedBets]);

	// Function to handle bet placement
	const handlePlaceBet = (bet: RouletteBet) => {
		if (gameState !== 'betting' && gameState !== 'idle') {
			displayAlert('You cannot place bets right now', 'warning');
			return;
		}

		// Check if player can afford the bet
		if (balance < bet.amount) {
			displayAlert('Insufficient funds to place this bet', 'error');
			return;
		}

		// Add the bet
		setSelectedBets([...selectedBets, bet]);
		setGameState('betting');
	};

	// Function to handle the spin result
	const handleSpinComplete = (resultNumber: number) => {
		setResult(resultNumber);
		processGameResult(resultNumber);
	};

	// Start the game (spin the wheel)
	const handleStartGame = () => {
		if (selectedBets.length === 0) {
			displayAlert('Place at least one bet before spinning', 'warning');
			return;
		}

		setGameState('spinning');
		setSpinning(true);
	};

	// Clear all bets
	const handleClearBets = () => {
		if (gameState === 'spinning') {
			displayAlert(
				'Cannot clear bets while wheel is spinning',
				'warning',
			);
			return;
		}

		setSelectedBets([]);
		setTotalBet(0);
		setGameState('idle');
	};

	// Reset the game for a new round
	const handlePlayAgain = () => {
		resetGame();
	};

	// Handle alert close
	const handleAlertClose = () => {
		setShowAlert(false);
	};

	// Handle bet amount slider change
	const handleBetChange = (_event: Event, newValue: number | number[]) => {
		setBetAmount(newValue as number);
	};

	// Render the history section
	const renderHistory = () => (
		<Box sx={{ mt: 3 }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 1,
				}}
			>
				<Typography variant="h6">
					<HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
					Recent Results
				</Typography>
				<IconButton
					size="small"
					onClick={() => setShowHistory(!showHistory)}
					sx={{ color: 'white', zIndex: 1000 }}
				>
					{showHistory ? <CloseIcon /> : <HistoryIcon />}
				</IconButton>
			</Box>

			{showHistory && (
				<HistoryTableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Number</TableCell>
								<TableCell>Color</TableCell>
								<TableCell>Time</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{resultHistory.length > 0 ? (
								resultHistory.map((item) => (
									<TableRow key={item.id}>
										<TableCell>{item.number}</TableCell>
										<TableCell>
											<Chip
												size="small"
												label={item.color.toUpperCase()}
												sx={{
													backgroundColor:
														getColorCode(
															item.color,
														),
													color: 'white',
												}}
											/>
										</TableCell>
										<TableCell>{item.timestamp}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={3} align="center">
										No history yet
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</HistoryTableContainer>
			)}
		</Box>
	);

	return (
		<StyledDialog
			open={open}
			onClose={onClose}
			maxWidth="xl"
			scroll="paper"
			aria-labelledby="roulette-game-title"
		>
			<GameHeader>
				<Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
					<IconButton
						onClick={onClose}
						sx={{ color: '#fff' }}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<MainTitle variant="h3">CMUEats Private Academy</MainTitle>
				<Typography
					variant="h5"
					sx={{ color: '#ccc', mt: 1, mb: 2, lineHeight: 1.4 }}
				>
					CMUEats: The Ultimate Gambling Experience
				</Typography>
				<Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
					<PlayerChip
						icon={<AttachMoneyIcon />}
						label={`Balance: $${balance.toFixed(2)}`}
					/>
				</Box>
			</GameHeader>

			<DialogContent
				sx={{
					backgroundColor: '#1E1E2D',
					padding: '20px 20px 40px 20px',
				}}
			>
				<Grid container spacing={3}>
					{/* Game Status Info */}
					<Grid item xs={12}>
						<GameInfoBox>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs={12} md={4}>
									<Typography variant="subtitle1">
										Current Bet: ${betAmount}
									</Typography>
									<BetSlider
										value={betAmount}
										onChange={handleBetChange}
										aria-labelledby="bet-amount-slider"
										step={25}
										min={25}
										max={500}
										disabled={gameState === 'spinning'}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									md={4}
									sx={{ textAlign: 'center' }}
								>
									<Typography variant="subtitle1">
										Total Bet: ${totalBet.toFixed(2)}
									</Typography>
									{lastWinAmount > 0 &&
										gameState === 'result' && (
											<Typography
												variant="h6"
												sx={{ color: '#4CAF50' }}
											>
												Last Win: $
												{lastWinAmount.toFixed(2)}
											</Typography>
										)}
								</Grid>
								<Grid
									item
									xs={12}
									md={4}
									sx={{
										display: 'flex',
										justifyContent: 'flex-end',
										gap: 2,
									}}
								>
									<ActionButton
										variant="contained"
										color="primary"
										startIcon={<CasinoIcon />}
										onClick={handleStartGame}
										disabled={
											gameState === 'spinning' ||
											selectedBets.length === 0
										}
									>
										Spin
									</ActionButton>
									<ActionButton
										variant="outlined"
										color="primary"
										onClick={handleClearBets}
										disabled={
											gameState === 'spinning' ||
											selectedBets.length === 0
										}
									>
										Clear Bets
									</ActionButton>
								</Grid>
							</Grid>
						</GameInfoBox>
					</Grid>

					{/* Roulette Wheel */}
					<Grid item xs={12} md={5}>
						<RouletteWheel
							onSpinComplete={handleSpinComplete}
							spinning={spinning}
							setSpinning={setSpinning}
						/>
						{currentResult !== null && (
							<Typography
								variant="h5"
								align="center"
								sx={{
									mt: 2,
									color:
										resultHistory.length > 0
											? getColorCode(
													resultHistory[0].color,
												)
											: 'white',
								}}
							>
								Last Result: {currentResult}
							</Typography>
						)}
					</Grid>

					{/* Betting Layout */}
					<Grid item xs={12} md={7}>
						<RouletteBettingLayout
							onPlaceBet={handlePlaceBet}
							selectedBets={selectedBets}
							currentBetAmount={betAmount}
						/>
					</Grid>

					{/* Result History */}
					<Grid item xs={12}>
						{renderHistory()}
					</Grid>

					{/* Play Again Button (only shown after a spin) */}
					{gameState === 'result' && (
						<Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
							<ActionButton
								variant="contained"
								color="primary"
								size="large"
								startIcon={<CasinoIcon />}
								onClick={handlePlayAgain}
							>
								New Round
							</ActionButton>
						</Grid>
					)}
				</Grid>
			</DialogContent>

			{/* Alerts/Notifications */}
			<Snackbar
				open={showAlert}
				autoHideDuration={5000}
				onClose={handleAlertClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
