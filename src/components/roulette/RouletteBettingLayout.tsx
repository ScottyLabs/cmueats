import { styled, Box, Typography, Paper, Grid, Chip } from '@mui/material';

// Define bet types
export type BetType =
	| 'straight'
	| 'split'
	| 'street'
	| 'corner'
	| 'line'
	| 'column'
	| 'dozen'
	| 'red'
	| 'black'
	| 'even'
	| 'odd'
	| 'low'
	| 'high';

// Roulette bet interface
export interface RouletteBet {
	id: string;
	type: BetType;
	numbers: number[];
	amount: number;
	payout: number; // Multiplier for winning
	label?: string;
}

// Cell sizes constants
const CELL_WIDTH = 60;
const CELL_HEIGHT = 60;

// Styled components
const BettingTable = styled(Paper)({
	width: '100%',
	backgroundColor: '#0c4e20',
	borderRadius: '10px',
	padding: '20px',
	border: '8px solid #723f1c',
	boxShadow: '0 10px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.5)',
	overflow: 'auto',
	maxWidth: '800px',
	margin: '0 auto',
});

const NumberCell = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'isRed' &&
		prop !== 'isBlack' &&
		prop !== 'isGreen' &&
		prop !== 'isSelected',
})<{
	isRed?: boolean;
	isBlack?: boolean;
	isGreen?: boolean;
	isSelected: boolean;
}>(({ isRed, isBlack, isGreen, isSelected }) => {
	let bgColor = 'transparent';
	if (isGreen) {
		bgColor = '#0c4e20';
	} else if (isRed) {
		bgColor = '#D30000';
	} else if (isBlack) {
		bgColor = '#000000';
	}

	let hoverBgColor = 'rgba(255, 255, 255, 0.1)';
	if (isGreen) {
		hoverBgColor = 'rgba(12, 78, 32, 0.8)';
	} else if (isRed) {
		hoverBgColor = 'rgba(211, 0, 0, 0.8)';
	} else if (isBlack) {
		hoverBgColor = 'rgba(0, 0, 0, 0.8)';
	}

	return {
		width: CELL_WIDTH,
		height: CELL_HEIGHT,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: bgColor,
		border: `1px solid ${isSelected ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}`,
		color: 'white',
		fontWeight: 'bold',
		position: 'relative',
		cursor: 'pointer',
		transition: 'all 0.2s',
		boxShadow: isSelected ? '0 0 10px 2px #FFD700' : 'none',
		'&:hover': {
			backgroundColor: hoverBgColor,
			boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
		},
		'&::after': isSelected
			? {
					content: '""',
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: '20px',
					height: '20px',
					backgroundColor: 'rgba(255, 215, 0, 0.5)',
					borderRadius: '50%',
					transform: 'translate(-50%, -50%)',
					pointerEvents: 'none',
				}
			: {},
	};
});

const OutsideBetCell = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ isSelected }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: `1px solid ${isSelected ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}`,
	color: 'white',
	fontWeight: 'bold',
	padding: '8px',
	cursor: 'pointer',
	transition: 'all 0.2s',
	boxShadow: isSelected ? '0 0 10px 2px #FFD700' : 'none',
	'&:hover': {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
	},
	'&::after': isSelected
		? {
				content: '""',
				position: 'absolute',
				width: '20px',
				height: '20px',
				backgroundColor: 'rgba(255, 215, 0, 0.5)',
				borderRadius: '50%',
				pointerEvents: 'none',
			}
		: {},
}));

const ColumnBetCell = styled(OutsideBetCell)({
	height: CELL_HEIGHT,
	width: CELL_WIDTH,
	textAlign: 'center',
});

const DozenBetCell = styled(OutsideBetCell)({
	flex: 1,
	height: CELL_HEIGHT,
	textAlign: 'center',
});

const OddEvenBetCell = styled(OutsideBetCell)({
	flex: 1,
	height: CELL_HEIGHT,
	textAlign: 'center',
});

const BetChip = styled(Chip)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	backgroundColor: '#FFD700',
	color: '#000',
	fontWeight: 'bold',
	zIndex: 5,
	boxShadow: '0 0 5px rgba(0,0,0,0.5)',
});

const ZeroBetCell = styled(NumberCell)({
	width: CELL_WIDTH,
	height: CELL_HEIGHT * 3,
	writingMode: 'vertical-rl',
	textOrientation: 'mixed',
	transform: 'rotate(180deg)',
});

// Interface for component props
interface RouletteBettingLayoutProps {
	onPlaceBet: (bet: RouletteBet) => void;
	selectedBets: RouletteBet[];
	currentBetAmount: number;
}

export default function RouletteBettingLayout({
	onPlaceBet,
	selectedBets,
	currentBetAmount,
}: RouletteBettingLayoutProps) {
	// Red numbers on a standard roulette wheel
	const redNumbers = [
		1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
	];

	// Get chips to display on the board
	const getBetChips = (type: BetType, numbers: number[]): RouletteBet[] =>
		selectedBets.filter(
			(bet) =>
				bet.type === type &&
				JSON.stringify(bet.numbers.sort()) ===
					JSON.stringify(numbers.sort()),
		);

	// Function to place bets
	const handlePlaceBet = (
		type: BetType,
		numbers: number[],
		payout: number,
		label?: string,
	) => {
		if (currentBetAmount <= 0) return;

		const betId = `${type}-${numbers.join('-')}-${Date.now()}`;
		onPlaceBet({
			id: betId,
			type,
			numbers,
			amount: currentBetAmount,
			payout,
			label,
		});
	};

	// Check if a straight (single number) bet is selected
	const isStraightBetSelected = (number: number): boolean =>
		selectedBets.some(
			(bet) => bet.type === 'straight' && bet.numbers.includes(number),
		);

	// Check if a specific bet is selected
	const isBetSelected = (type: BetType, numbers: number[]): boolean =>
		selectedBets.some(
			(bet) =>
				bet.type === type &&
				JSON.stringify(bet.numbers.sort()) ===
					JSON.stringify(numbers.sort()),
		);

	// Render a grid of numbers 1-36
	const renderNumberGrid = () => {
		const rows = [];

		for (let row = 0; row < 12; row += 1) {
			const cells = [];

			for (let col = 0; col < 3; col += 1) {
				const number = (12 - row) * 3 - col;
				const isRed = redNumbers.includes(number);
				const isBlack = !isRed;
				const isSelected = isStraightBetSelected(number);

				// Each number cell
				cells.push(
					<NumberCell
						key={number}
						isRed={isRed}
						isBlack={isBlack}
						isSelected={isSelected}
						onClick={() => handlePlaceBet('straight', [number], 35)}
					>
						{number}
						{getBetChips('straight', [number]).map((bet) => (
							<BetChip
								key={bet.id}
								label={bet.amount.toString()}
								size="small"
							/>
						))}
					</NumberCell>,
				);
			}

			rows.push(
				<Box key={row} sx={{ display: 'flex' }}>
					{cells}
				</Box>,
			);
		}

		return (
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>{rows}</Box>
		);
	};

	// Render the zero cell
	const renderZeroCell = () => {
		const isSelected = isStraightBetSelected(0);

		return (
			<ZeroBetCell
				isGreen
				isSelected={isSelected}
				onClick={() => handlePlaceBet('straight', [0], 35)}
			>
				0
				{getBetChips('straight', [0]).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</ZeroBetCell>
		);
	};

	// Render column bets
	const renderColumnBets = () => (
		<Box sx={{ display: 'flex' }}>
			<ColumnBetCell
				isSelected={isBetSelected(
					'column',
					[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
				)}
				onClick={() =>
					handlePlaceBet(
						'column',
						[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
						2,
						'1st column',
					)
				}
			>
				2:1
				{getBetChips(
					'column',
					[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
				).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</ColumnBetCell>
			<ColumnBetCell
				isSelected={isBetSelected(
					'column',
					[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
				)}
				onClick={() =>
					handlePlaceBet(
						'column',
						[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
						2,
						'2nd column',
					)
				}
			>
				2:1
				{getBetChips(
					'column',
					[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
				).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</ColumnBetCell>
			<ColumnBetCell
				isSelected={isBetSelected(
					'column',
					[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
				)}
				onClick={() =>
					handlePlaceBet(
						'column',
						[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
						2,
						'3rd column',
					)
				}
			>
				2:1
				{getBetChips(
					'column',
					[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
				).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</ColumnBetCell>
		</Box>
	);

	// Render dozen bets
	const renderDozenBets = () => (
		<Box sx={{ display: 'flex' }}>
			<DozenBetCell
				isSelected={isBetSelected(
					'dozen',
					Array.from({ length: 12 }, (_, i) => i + 1),
				)}
				onClick={() =>
					handlePlaceBet(
						'dozen',
						Array.from({ length: 12 }, (_, i) => i + 1),
						2,
						'1st dozen',
					)
				}
			>
				1st 12
				{getBetChips(
					'dozen',
					Array.from({ length: 12 }, (_, i) => i + 1),
				).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</DozenBetCell>
			<DozenBetCell
				isSelected={isBetSelected(
					'dozen',
					Array.from({ length: 12 }, (_, i) => i + 13),
				)}
				onClick={() =>
					handlePlaceBet(
						'dozen',
						Array.from({ length: 12 }, (_, i) => i + 13),
						2,
						'2nd dozen',
					)
				}
			>
				2nd 12
				{getBetChips(
					'dozen',
					Array.from({ length: 12 }, (_, i) => i + 13),
				).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</DozenBetCell>
			<DozenBetCell
				isSelected={isBetSelected(
					'dozen',
					Array.from({ length: 12 }, (_, i) => i + 25),
				)}
				onClick={() =>
					handlePlaceBet(
						'dozen',
						Array.from({ length: 12 }, (_, i) => i + 25),
						2,
						'3rd dozen',
					)
				}
			>
				3rd 12
				{getBetChips(
					'dozen',
					Array.from({ length: 12 }, (_, i) => i + 25),
				).map((bet) => (
					<BetChip
						key={bet.id}
						label={bet.amount.toString()}
						size="small"
					/>
				))}
			</DozenBetCell>
		</Box>
	);

	// Render even/odd, red/black, high/low bets
	const renderOutsideBets = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Box sx={{ display: 'flex' }}>
				<OddEvenBetCell
					isSelected={isBetSelected(
						'low',
						Array.from({ length: 18 }, (_, i) => i + 1),
					)}
					onClick={() =>
						handlePlaceBet(
							'low',
							Array.from({ length: 18 }, (_, i) => i + 1),
							1,
							'1-18',
						)
					}
				>
					1 to 18
					{getBetChips(
						'low',
						Array.from({ length: 18 }, (_, i) => i + 1),
					).map((bet) => (
						<BetChip
							key={bet.id}
							label={bet.amount.toString()}
							size="small"
						/>
					))}
				</OddEvenBetCell>
				<OddEvenBetCell
					isSelected={isBetSelected(
						'even',
						Array.from({ length: 18 }, (_, i) => (i + 1) * 2),
					)}
					onClick={() =>
						handlePlaceBet(
							'even',
							Array.from({ length: 18 }, (_, i) => (i + 1) * 2),
							1,
							'EVEN',
						)
					}
				>
					EVEN
					{getBetChips(
						'even',
						Array.from({ length: 18 }, (_, i) => (i + 1) * 2),
					).map((bet) => (
						<BetChip
							key={bet.id}
							label={bet.amount.toString()}
							size="small"
						/>
					))}
				</OddEvenBetCell>
			</Box>
			<Box sx={{ display: 'flex' }}>
				<OddEvenBetCell
					isSelected={isBetSelected('red', redNumbers)}
					onClick={() => handlePlaceBet('red', redNumbers, 1, 'RED')}
					sx={{ backgroundColor: 'rgba(211, 0, 0, 0.5)' }}
				>
					RED
					{getBetChips('red', redNumbers).map((bet) => (
						<BetChip
							key={bet.id}
							label={bet.amount.toString()}
							size="small"
						/>
					))}
				</OddEvenBetCell>
				<OddEvenBetCell
					isSelected={isBetSelected(
						'black',
						Array.from({ length: 36 }, (_, i) => i + 1).filter(
							(n) => !redNumbers.includes(n),
						),
					)}
					onClick={() =>
						handlePlaceBet(
							'black',
							Array.from({ length: 36 }, (_, i) => i + 1).filter(
								(n) => !redNumbers.includes(n),
							),
							1,
							'BLACK',
						)
					}
					sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
				>
					BLACK
					{getBetChips(
						'black',
						Array.from({ length: 36 }, (_, i) => i + 1).filter(
							(n) => !redNumbers.includes(n),
						),
					).map((bet) => (
						<BetChip
							key={bet.id}
							label={bet.amount.toString()}
							size="small"
						/>
					))}
				</OddEvenBetCell>
			</Box>
			<Box sx={{ display: 'flex' }}>
				<OddEvenBetCell
					isSelected={isBetSelected(
						'odd',
						Array.from({ length: 18 }, (_, i) => i * 2 + 1),
					)}
					onClick={() =>
						handlePlaceBet(
							'odd',
							Array.from({ length: 18 }, (_, i) => i * 2 + 1),
							1,
							'ODD',
						)
					}
				>
					ODD
					{getBetChips(
						'odd',
						Array.from({ length: 18 }, (_, i) => i * 2 + 1),
					).map((bet) => (
						<BetChip
							key={bet.id}
							label={bet.amount.toString()}
							size="small"
						/>
					))}
				</OddEvenBetCell>
				<OddEvenBetCell
					isSelected={isBetSelected(
						'high',
						Array.from({ length: 18 }, (_, i) => i + 19),
					)}
					onClick={() =>
						handlePlaceBet(
							'high',
							Array.from({ length: 18 }, (_, i) => i + 19),
							1,
							'19-36',
						)
					}
				>
					19 to 36
					{getBetChips(
						'high',
						Array.from({ length: 18 }, (_, i) => i + 19),
					).map((bet) => (
						<BetChip
							key={bet.id}
							label={bet.amount.toString()}
							size="small"
						/>
					))}
				</OddEvenBetCell>
			</Box>
		</Box>
	);

	return (
		<BettingTable>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography
						variant="h6"
						textAlign="center"
						sx={{ color: 'white', mb: 2 }}
					>
						Place Your Bets
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Box sx={{ display: 'flex', mb: 2 }}>
						{renderZeroCell()}
						{renderNumberGrid()}
					</Box>
					{renderColumnBets()}
					{renderDozenBets()}
					<Box sx={{ mt: 2 }}>{renderOutsideBets()}</Box>
				</Grid>
			</Grid>
		</BettingTable>
	);
}
