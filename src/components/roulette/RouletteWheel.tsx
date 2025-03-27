import { useState, useEffect, useRef } from 'react';
import { styled, Box, Typography, CircularProgress } from '@mui/material';

// Define types for roulette numbers
interface RouletteNumber {
	number: number;
	color: 'red' | 'black' | 'green';
	position: number; // Angular position on wheel (0-360)
}

// Standard European roulette wheel numbers and their colors
// Numbers are arranged in the standard European roulette wheel order
const ROULETTE_NUMBERS: RouletteNumber[] = [
	{ number: 0, color: 'green', position: 0 },
	{ number: 32, color: 'red', position: 9.73 },
	{ number: 15, color: 'black', position: 19.46 },
	{ number: 19, color: 'red', position: 29.19 },
	{ number: 4, color: 'black', position: 38.92 },
	{ number: 21, color: 'red', position: 48.65 },
	{ number: 2, color: 'black', position: 58.38 },
	{ number: 25, color: 'red', position: 68.11 },
	{ number: 17, color: 'black', position: 77.84 },
	{ number: 34, color: 'red', position: 87.57 },
	{ number: 6, color: 'black', position: 97.3 },
	{ number: 27, color: 'red', position: 107.03 },
	{ number: 13, color: 'black', position: 116.76 },
	{ number: 36, color: 'red', position: 126.49 },
	{ number: 11, color: 'black', position: 136.22 },
	{ number: 30, color: 'red', position: 145.95 },
	{ number: 8, color: 'black', position: 155.68 },
	{ number: 23, color: 'red', position: 165.41 },
	{ number: 10, color: 'black', position: 175.14 },
	{ number: 5, color: 'red', position: 184.87 },
	{ number: 24, color: 'black', position: 194.6 },
	{ number: 16, color: 'red', position: 204.33 },
	{ number: 33, color: 'black', position: 214.06 },
	{ number: 1, color: 'red', position: 223.79 },
	{ number: 20, color: 'black', position: 233.52 },
	{ number: 14, color: 'red', position: 243.25 },
	{ number: 31, color: 'black', position: 252.98 },
	{ number: 9, color: 'red', position: 262.71 },
	{ number: 22, color: 'black', position: 272.44 },
	{ number: 18, color: 'red', position: 282.17 },
	{ number: 29, color: 'black', position: 291.9 },
	{ number: 7, color: 'red', position: 301.63 },
	{ number: 28, color: 'black', position: 311.36 },
	{ number: 12, color: 'red', position: 321.09 },
	{ number: 35, color: 'black', position: 330.82 },
	{ number: 3, color: 'red', position: 340.55 },
	{ number: 26, color: 'black', position: 350.28 },
];

// Styled components
const RouletteContainer = styled(Box)({
	position: 'relative',
	width: '100%',
	maxWidth: '600px',
	height: '600px',
	margin: '0 auto',
	perspective: '1200px',
});

const WheelContainer = styled(Box)({
	position: 'relative',
	width: '400px',
	height: '400px',
	margin: '0 auto',
	perspective: '1200px',
	transformStyle: 'preserve-3d',
});

const Wheel = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'spinning' && prop !== 'rotationDegrees',
})<{ spinning: boolean; rotationDegrees: number }>(
	({ spinning, rotationDegrees }) => ({
		position: 'relative',
		width: '100%',
		height: '100%',
		borderRadius: '50%',
		backgroundImage:
			'radial-gradient(circle, #424242 0%, #212121 70%, #000000 100%)',
		transform: `rotateX(70deg) rotateZ(${rotationDegrees}deg)`,
		transformStyle: 'preserve-3d',
		transition: spinning
			? 'transform 6s cubic-bezier(0.1, 0.7, 0.15, 1)'
			: 'none',
		boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
		'&::after': {
			content: '""',
			position: 'absolute',
			top: '5%',
			left: '5%',
			width: '90%',
			height: '90%',
			borderRadius: '50%',
			backgroundImage:
				'radial-gradient(circle, #572c0e 0%, #3e1e08 100%)',
			boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)',
		},
	}),
);

const NumberSlot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'rotatePosition' && prop !== 'color',
})<{ rotatePosition: number; color: string }>(({ rotatePosition, color }) => ({
	position: 'absolute',
	top: '0',
	left: '50%',
	width: '30px',
	height: '170px',
	transformOrigin: 'bottom center',
	transform: `translateX(-50%) rotate(${rotatePosition}deg)`,
	zIndex: 2,
	'&::before': {
		content: '""',
		position: 'absolute',
		top: '10px',
		left: '0',
		width: '100%',
		height: '60px',
		backgroundColor: color,
		clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
		boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
	},
}));

const NumberText = styled(Typography)({
	position: 'absolute',
	top: '20px',
	width: '100%',
	textAlign: 'center',
	color: 'white',
	fontWeight: 'bold',
	fontSize: '12px',
	textShadow: '0 0 3px rgba(0,0,0,0.8)',
	transform: 'rotateX(-70deg)',
	zIndex: 3,
});

const Ball = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'rotatePosition' && prop !== 'visible' && prop !== 'landed',
})<{ rotatePosition: number; visible: boolean; landed: boolean }>(
	({ rotatePosition, visible, landed }) => ({
		position: 'absolute',
		top: landed ? '80px' : '20px',
		left: '50%',
		width: '12px',
		height: '12px',
		borderRadius: '50%',
		backgroundColor: '#e0e0e0',
		transform: `translateX(-50%) rotate(${rotatePosition}deg) translateX(${landed ? 130 : 155}px)`,
		opacity: visible ? 1 : 0,
		transformOrigin: 'center center',
		transition: landed
			? 'transform 1s ease-out, top 1s ease-out'
			: 'transform 6s cubic-bezier(0.2, 0.8, 0.2, 1)',
		boxShadow: '0 0 5px rgba(255,255,255,0.8)',
		zIndex: 5,
	}),
);

const Center = styled(Box)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	width: '40px',
	height: '40px',
	borderRadius: '50%',
	backgroundColor: '#723f1c',
	transform: 'translate(-50%, -50%)',
	boxShadow: '0 0 10px rgba(0,0,0,0.5)',
	zIndex: 4,
});

const Separator = styled(Box)({
	position: 'absolute',
	top: '0',
	left: '50%',
	width: '2px',
	height: '175px',
	background:
		'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)',
	transformOrigin: 'bottom center',
	zIndex: 3,
});

// Props for the RouletteWheel component
interface RouletteWheelProps {
	onSpinComplete: (result: number) => void;
	spinning: boolean;
	setSpinning: (spinning: boolean) => void;
}

export default function RouletteWheel({
	onSpinComplete,
	spinning,
	setSpinning,
}: RouletteWheelProps) {
	const [rotationDegrees, setRotationDegrees] = useState(0);
	const [ballPosition, setBallPosition] = useState(0);
	const [result, setResult] = useState<number | null>(null);
	const ballVisible = true;
	const [ballLanded, setBallLanded] = useState(false);

	// Refs to track animation state
	const spinCompleted = useRef(false);
	const wheelRef = useRef<HTMLDivElement>(null);

	// Function to calculate the winning number based on final rotation
	const calculateResult = (finalRotation: number) => {
		// Normalize rotation to 0-360 range
		const normalizedRotation = (360 - (finalRotation % 360)) % 360;

		// Find the pocket that matches the ball's position
		for (let i = 0; i < ROULETTE_NUMBERS.length; i += 1) {
			const nextIndex = (i + 1) % ROULETTE_NUMBERS.length;
			const startPos = ROULETTE_NUMBERS[i].position;
			let endPos = ROULETTE_NUMBERS[nextIndex].position;

			if (endPos < startPos) endPos += 360;

			if (normalizedRotation >= startPos && normalizedRotation < endPos) {
				return ROULETTE_NUMBERS[i].number;
			}
		}

		return 0; // Default to 0 if not found
	};

	// Handle spin animation
	useEffect(() => {
		if (spinning && !spinCompleted.current) {
			spinCompleted.current = true;

			// Reset states for new spin
			setBallLanded(false);
			setResult(null);

			// Generate random number of complete rotations (5-10 rotations plus random offset)
			const rotations = 5 + Math.floor(Math.random() * 5);
			const randomOffset = Math.random() * 360;
			const finalRotation =
				rotationDegrees - (rotations * 360 + randomOffset);

			// Set ball to spin in opposite direction
			const ballOffset = Math.random() * 120 - 60; // Ball lands slightly off from wheel position
			const finalBallPosition =
				(rotations * 360 + randomOffset + ballOffset) % 360;

			// Update wheel rotation
			setRotationDegrees(finalRotation);
			setBallPosition(finalBallPosition);

			// After animation completes, calculate result and notify parent
			const spinDuration = 6000; // 6 seconds, matches the CSS transition

			setTimeout(() => {
				const resultNumber = calculateResult(finalRotation);
				setResult(resultNumber);
				setBallLanded(true);

				// Notify parent of result after a delay
				setTimeout(() => {
					setSpinning(false);
					spinCompleted.current = false;
					onSpinComplete(resultNumber);
				}, 1000);
			}, spinDuration);
		}
	}, [spinning, rotationDegrees, setSpinning, onSpinComplete]);

	// Render separators between number slots
	const renderSeparators = () => {
		const separators = [];
		for (let i = 0; i < ROULETTE_NUMBERS.length; i += 1) {
			separators.push(
				<Separator
					key={`sep-${i}`}
					style={{
						transform: `translateX(-50%) rotate(${ROULETTE_NUMBERS[i].position}deg)`,
					}}
				/>,
			);
		}
		return separators;
	};

	return (
		<RouletteContainer>
			<WheelContainer>
				<Wheel
					ref={wheelRef}
					spinning={spinning}
					rotationDegrees={rotationDegrees}
				>
					{ROULETTE_NUMBERS.map((num) => (
						<NumberSlot
							key={num.number}
							rotatePosition={num.position}
							color={num.color}
						>
							<NumberText>{num.number}</NumberText>
						</NumberSlot>
					))}
					{renderSeparators()}
					<Center />
				</Wheel>
				<Ball
					rotatePosition={ballPosition}
					visible={ballVisible}
					landed={ballLanded}
				/>
			</WheelContainer>
			{result !== null && (
				<Typography
					variant="h4"
					align="center"
					sx={{
						marginTop: '20px',
						fontWeight: 'bold',
						color:
							ROULETTE_NUMBERS.find((n) => n.number === result)
								?.color || 'white',
					}}
				>
					{result}
				</Typography>
			)}
			{spinning && !result && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
					<CircularProgress sx={{ color: '#D30000' }} />
				</Box>
			)}
		</RouletteContainer>
	);
}
