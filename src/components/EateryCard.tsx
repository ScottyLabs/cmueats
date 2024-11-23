import { useState } from 'react';
import {
	Card,
	CardHeader,
	Typography,
	Link,
	styled,
	Grid,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CardContent,
	CardActions,
	Avatar,
	Dialog,
	keyframes,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import TextProps from '../types/interfaces';
import {
	IReadOnlyExtendedLocation,
	LocationState,
} from '../types/locationTypes';

const colors: Record<LocationState, string> = {
	[LocationState.OPEN]: '#19b875',
	[LocationState.CLOSED]: '#dd3c18',
	[LocationState.CLOSED_LONG_TERM]: '#dd3c18',
	[LocationState.OPENS_SOON]: '#f6cc5d',
	[LocationState.CLOSES_SOON]: '#f3f65d',
};

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(238, 111, 82, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(238, 111, 82, 0.7);
  }
  100% {
    box-shadow: 0 0 5px rgba(238, 111, 82, 0.7);
  }
`;

const StyledCard = styled(Card)({
	backgroundColor: '#23272A',
	border: '2px solid rgba(0, 0, 0, 0.2)',
	textAlign: 'left',
	borderRadius: 7,
	height: '100%',
	justifyContent: 'flex-start',
	transition: 'box-shadow 0.3s ease-in-out',
	'&:hover': {
		animation: `${glowAnimation} 1.5s infinite`,
	},
});

const StyledCardHeader = styled(CardHeader)({
	fontWeight: 500,
	backgroundColor: '#1D1F21',
});

const CustomLink = styled(Link)({
	color: 'white',
	textDecoration: 'underline',
});

const NameText = styled(Typography)({
	color: 'white',
	padding: 0,
	fontFamily:
		'"Zilla Slab", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
		'"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", ' +
		'"Droid Sans", "Helvetica Neue", sans-serif',
	textTransform: 'capitalize',
});

const LocationText = styled(Typography)({
	color: '#8D979F',
	marginBottom: '10px',
	fontWeight: 500,
	fontSize: 14,
});

const DescriptionText = styled(Typography)({
	color: 'white',
});

const LongDescriptionText = styled(Typography)({
	color: 'white',
	marginBottom: '5px',
});

const OpenText = styled(Typography)<TextProps>(({ changesSoon }) => ({
	color: changesSoon
		? colors[LocationState.CLOSES_SOON]
		: colors[LocationState.OPEN],
	fontSize: 14,
	fontWeight: 500,
	fontFamily:
		'"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", ' +
		'"Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", ' +
		'"Helvetica Neue", sans-serif',
}));

const ClosedText = styled(Typography)<TextProps>(({ changesSoon }) => ({
	color: changesSoon
		? colors[LocationState.OPENS_SOON]
		: colors[LocationState.CLOSED],
	fontSize: 14,
	fontWeight: 500,
	fontFamily:
		'"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", ' +
		'"Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", ' +
		'"Helvetica Neue", sans-serif',
}));

const ActionButton = styled(Button)({
	fontWeight: 600,
	fontFamily:
		'"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", ' +
		'"Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", ' +
		'"Helvetica Neue", sans-serif',
	color: 'white',
	backgroundColor: '#1D1F21',
	elevation: 30,
});

const blinkingAnimation = {
	'@keyframes blinking': {
		'0%': {
			opacity: 0,
		},
		'50%': {
			opacity: 1,
		},
		'75%': {
			opacity: 1,
		},
		'100%': {
			opacity: 0,
		},
	},
};

const Dot = styled(Card)(
	({
		state,
		changesSoon,
	}: {
		state: LocationState;
		changesSoon: boolean;
	}) => ({
		background: colors[state],
		width: '100%',
		height: '100%',
		borderRadius: '50%',
		foregroundColor: colors[state],
		...(changesSoon && blinkingAnimation),
		animationName: changesSoon ? 'blinking' : undefined,
		animationDuration: '1s',
		animationIterationCount: 'infinite',
	}),
);

const SpecialsContent = styled(Accordion)({
	backgroundColor: '#23272A',
});

function EateryCard({ location }: { location: IReadOnlyExtendedLocation }) {
	const {
		name,
		location: locationText,
		url,
		description,
		shortDescription,
		menu,
		todaysSpecials = [],
		statusMsg,
		todaysSoups = [],
		timesListDisplay,
		// acceptsOnlineOrders,
	} = location;
	const changesSoon = !location.closedLongTerm && location.changesSoon;
	const isOpen = !location.closedLongTerm && location.isOpen;

	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Grid item xs={12} md={4} lg={3} xl={3}>
				<StyledCard>
					<StyledCardHeader
						title={
							isOpen ? (
								<OpenText
									variant="subtitle1"
									changesSoon={changesSoon}
								>
									{statusMsg}
								</OpenText>
							) : (
								<ClosedText
									variant="subtitle1"
									changesSoon={changesSoon}
								>
									{statusMsg}
								</ClosedText>
							)
						}
						avatar={
							<Avatar
								sx={{
									width: 12,
									height: 12,
									backgroundColor: '#1D1F21',
								}}
							>
								<Dot
									state={location.locationState}
									changesSoon={changesSoon}
								/>
							</Avatar>
						}
					/>
					<CardContent>
						<NameText variant="h6">
							<CustomLink href={url} target="_blank">
								{name}
							</CustomLink>
						</NameText>
						<LocationText variant="subtitle2">
							{locationText}
						</LocationText>
						<DescriptionText>{shortDescription}</DescriptionText>
					</CardContent>
					<CardActions sx={{ marginTop: 'auto' }}>
						{menu && (
							<ActionButton
								onClick={() => {
									window.open(menu, '_blank');
								}}
							>
								Menu
							</ActionButton>
						)}
						{(true) && (//todaysSpecials.length !== 0 || todaysSoups.length !== 0 GO BACK
							<ActionButton
								onClick={() => {
									setModalOpen(true);
								}}
							>
								Specials & Times
							</ActionButton>
						)}
					</CardActions>
				</StyledCard>
			</Grid>

			<Dialog
				open={modalOpen}
				onClose={() => {
					setModalOpen(false);
				}}
				PaperProps={{
					style: {
						backgroundColor: '#23272A',
					},
				}}
			>
				<StyledCard>
					<StyledCardHeader
						title={
							isOpen ? (
								<OpenText
									variant="subtitle1"
									changesSoon={changesSoon}
								>
									{statusMsg}
								</OpenText>
							) : (
								<ClosedText
									variant="subtitle1"
									changesSoon={changesSoon}
								>
									{statusMsg}
								</ClosedText>
							)
						}
						avatar={
							<Avatar
								sx={{
									width: 12,
									height: 12,
									backgroundColor: '#1D1F21',
								}}
							>
								<Dot
									state={location.locationState}
									changesSoon={changesSoon}
								/>
							</Avatar>
						}
					/>
					<CardContent>
						<NameText variant="h6">
							<CustomLink href={url} target="_blank">
								{name}
							</CustomLink>
						</NameText>
						<LocationText variant="subtitle2">
							{locationText}
						</LocationText>
						<LongDescriptionText variant="subtitle2">
							{description}
						</LongDescriptionText>
						<LocationText variant="subtitle2">
							{"Sunday: ".concat(timesListDisplay[0])}
						</LocationText>
						<LocationText variant="subtitle2">
							{"Monday: ".concat(timesListDisplay[1])}
						</LocationText>
						<LocationText variant="subtitle2">
							{"Tuesday: ".concat(timesListDisplay[2])}
						</LocationText>
						<LocationText variant="subtitle2">
							{"Wednesday: ".concat(timesListDisplay[3])}
						</LocationText>
						<LocationText variant="subtitle2">
							{"Thursday: ".concat(timesListDisplay[4])}
						</LocationText>
						<LocationText variant="subtitle2">
							{"Friday: ".concat(timesListDisplay[5])}
						</LocationText>
						<LocationText variant="subtitle2">
							{"Saturday: ".concat(timesListDisplay[6])}
						</LocationText>
						{/* {({acceptsOnlineOrders} ? (
								<OpenText
									variant="subtitle1"
									changesSoon={acceptsOnlineOrders}
								>
									{"Accepts Online Orders"}
								</OpenText>
							) : (
								<ClosedText
									variant="subtitle1"
									changesSoon={acceptsOnlineOrders}
								>
									{"Does Not Accept Online Orders"}
								</ClosedText>
							))} */}
					</CardContent>
					{todaysSpecials.concat(todaysSoups).map((special) => (
						<SpecialsContent style={{}} key={special.title}>
							<AccordionSummary
								expandIcon={
									<ExpandMoreIcon
										style={{ color: 'white' }}
									/>
								}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<DescriptionText>
									{special.title}
								</DescriptionText>
							</AccordionSummary>
							<AccordionDetails>
								<LocationText>
									{special.description}
								</LocationText>
							</AccordionDetails>
						</SpecialsContent>
					))}
				</StyledCard>
			</Dialog>
		</>
	);
}

export default EateryCard;
