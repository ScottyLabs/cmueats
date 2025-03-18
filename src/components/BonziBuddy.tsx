import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
	Button,
	Box,
	Typography,
	Dialog,
	DialogContent,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IS_APRIL_FOOLS } from '../util/constants';

// Styles
const BonziContainer = styled(Box)({
	position: 'fixed',
	bottom: '80px',
	right: '20px',
	zIndex: 9999,
	cursor: 'pointer',
	filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
	transition: 'transform 0.3s ease-in-out',
	'&:hover': {
		transform: 'scale(1.1)',
	},
});

const BonziImage = styled('div')({
	width: '100px',
	height: '100px',
	background: 'linear-gradient(135deg, #8B59FF 0%, #5A3DFF 100%)',
	borderRadius: '50%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: 'white',
	fontWeight: 'bold',
	fontSize: '24px',
	border: '3px solid #9A71FF',
});

const BonziDialog = styled(Dialog)({
	'& .MuiPaper-root': {
		borderRadius: '20px',
		background: 'linear-gradient(160deg, #9A71FF 0%, #724BFF 100%)',
		border: '3px solid #8B59FF',
		maxWidth: '400px',
		minWidth: '300px',
	},
});

const BonziDialogContent = styled(DialogContent)({
	padding: '20px',
	color: 'white',
});

const BonziTitle = styled(Typography)({
	color: 'white',
	fontWeight: 'bold',
	textAlign: 'center',
	marginBottom: '10px',
});

const BonziText = styled(Typography)({
	color: 'white',
	marginBottom: '15px',
});

const BonziButton = styled(Button)({
	backgroundColor: '#ffffff',
	color: '#724BFF',
	fontWeight: 'bold',
	'&:hover': {
		backgroundColor: '#efefef',
	},
});

const CloseButton = styled(IconButton)({
	position: 'absolute',
	right: '5px',
	top: '5px',
	color: 'white',
});

// Array of "helpful" tips
const bonziTips = [
	'Did you know? Premium CMUEats™ subscribers get access to food 30 minutes before anyone else!',
	'Your current plan only allows you to view 5 more restaurants today. Upgrade to Premium for unlimited access!',
	'Feeling hungry? Subscribe to CMUEats Pro for exclusive restaurant recommendations!',
	'Want to remove these messages? Buy our Premium Silence Package for only $4.99/month!',
	'Unlock secret restaurant menus with our Gold Membership subscription!',
	'Tired of these colors? Subscribe to CMUEats Designer to customize your experience!',
	"Your friends are all using CMUEats Premium. Don't miss out!",
	'Get dining hall notifications straight to your phone with our Premium Alert Service!',
	'Our AI can predict what you want to eat! Subscribe to Premium Taste for just $7.99/month!',
	'Exclusive April offer: Buy our Premium NFT collection and get 10% off all future subscriptions!',
];

interface BonziBuddyProps {
	onSubscribeClick: () => void;
}

function BonziBuddy({ onSubscribeClick }: BonziBuddyProps) {
	const [open, setOpen] = useState(false);
	const [currentTip, setCurrentTip] = useState('');

	// Randomly show Bonzi with tips
	useEffect(() => {
		if (!IS_APRIL_FOOLS) return undefined;

		// Show Bonzi after 20-40 seconds
		const initialTimeout = setTimeout(
			() => {
				const randomTip =
					bonziTips[Math.floor(Math.random() * bonziTips.length)];
				setCurrentTip(randomTip);
				setOpen(true);
			},
			20000 + Math.random() * 20000,
		);

		// Setup recurring Bonzi appearances
		const intervalId = setInterval(() => {
			if (Math.random() > 0.7) {
				// 30% chance to appear
				const randomTip =
					bonziTips[Math.floor(Math.random() * bonziTips.length)];
				setCurrentTip(randomTip);
				setOpen(true);
			}
		}, 60000); // Check every minute

		return () => {
			clearTimeout(initialTimeout);
			clearInterval(intervalId);
		};
	}, []);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubscribeClick = () => {
		handleClose();
		onSubscribeClick();
	};

	if (!IS_APRIL_FOOLS) return null;

	return (
		<>
			<BonziContainer onClick={() => setOpen(true)}>
				<BonziImage>😍💰</BonziImage>
			</BonziContainer>

			<BonziDialog open={open} onClose={handleClose}>
				<BonziDialogContent>
					<CloseButton onClick={handleClose}>
						<CloseIcon />
					</CloseButton>
					<BonziTitle variant="h5">CMUEats Premium</BonziTitle>
					<BonziText variant="body1">{currentTip}</BonziText>
					<Box display="flex" justifyContent="center">
						<BonziButton
							variant="contained"
							onClick={handleSubscribeClick}
						>
							Learn More
						</BonziButton>
					</Box>
				</BonziDialogContent>
			</BonziDialog>
		</>
	);
}

export default BonziBuddy;
