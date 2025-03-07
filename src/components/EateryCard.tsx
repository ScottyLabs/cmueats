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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import TextProps from '../types/interfaces';
import {
	IReadOnlyLocation_Combined,
	LocationState,
} from '../types/locationTypes';

const textColors: Record<LocationState, string> = {
	[LocationState.OPEN]: 'var(--location-open-text-color)',
	[LocationState.CLOSED]: 'var(--location-closed-text-color)',
	[LocationState.CLOSED_LONG_TERM]:
		'var(--location-closed-long-term-text-color)',
	[LocationState.OPENS_SOON]: 'var(--location-opens-soon-text-color)',
	[LocationState.CLOSES_SOON]: 'var(--location-closes-soon-text-color)',
};

// highlight is for both the underline and dot color
const highlightColors: Record<LocationState, string> = {
	[LocationState.OPEN]: 'var(--location-open-highlight)',
	[LocationState.CLOSED]: 'var(--location-closed-highlight)',
	[LocationState.CLOSED_LONG_TERM]:
		'var(--location-closed-long-term-highlight)',
	[LocationState.OPENS_SOON]: 'var(--location-opens-soon-highlight)',
	[LocationState.CLOSES_SOON]: 'var(--location-closes-soon-highlight)',
};
const StyledCardHeader = styled(CardHeader)<{ state: LocationState }>(
	({ state }) => ({
		fontWeight: 500,
		alignItems: 'flex-start',
		padding: '13px 16px',
		borderBottom: '2px solid',
		borderBottomColor: highlightColors[state],
	}),
);

const CustomLink = styled(Link)({
	color: 'var(--card-text-title)',
	textDecoration: 'underline',
});

const NameText = styled(Typography)({
	padding: 0,
	marginBottom: 4,
	fontFamily: 'var(--text-primary-font)',
	textTransform: 'capitalize',
});

const LocationText = styled(Typography)({
	color: 'var(--card-text-muted)',
	marginBottom: '10px',
	fontWeight: 500,
	fontSize: 14,
});

const DescriptionText = styled(Typography)({
	color: 'var(--card-text-description)',
});

const OpenText = styled(Typography, {
	shouldForwardProp: (prop) => prop !== 'changesSoon',
})<TextProps>(({ changesSoon }) => ({
	color: changesSoon
		? textColors[LocationState.CLOSES_SOON]
		: textColors[LocationState.OPEN],
	fontSize: '1rem',
	fontWeight: 500,
	fontFamily: 'var(--text-secondary-font)',
}));

const ClosedText = styled(Typography, {
	shouldForwardProp: (prop) => prop !== 'changesSoon',
})<TextProps>(({ changesSoon }) => ({
	color: changesSoon
		? textColors[LocationState.OPENS_SOON]
		: textColors[LocationState.CLOSED],
	fontSize: '1rem',
	fontWeight: 500,
	fontFamily: 'var(--text-secondary-font)',
}));

const ActionButton = styled(Button)({
	fontFamily: 'var(--text-secondary-font)',
	color: 'var(--button-text)',
	backgroundColor: 'var(--button-bg)',
	padding: '5px 10px',

	letterSpacing: -0.2,
	elevation: 30,
	'&:hover': {
		backgroundColor: 'var(--button-bg--hover)',
	},
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

const Dot = styled(Card, {
	shouldForwardProp: (prop) => prop !== 'changesSoon' && prop !== 'state',
})(
	({
		state,
		changesSoon,
	}: {
		state: LocationState;
		changesSoon: boolean;
	}) => ({
		background: highlightColors[state],
		width: '100%',
		height: '100%',
		borderRadius: '50%',
		foregroundColor: highlightColors[state],
		...(changesSoon && blinkingAnimation),
		animationName: changesSoon ? 'blinking' : undefined,
		animationDuration: '1s',
		animationIterationCount: 'infinite',
	}),
);

const SpecialsContent = styled(Accordion)({
	backgroundColor: 'var(--specials-bg)',
});

function EateryCard({
	location,
	index = 0,
	partOfMainGrid = false,
	animate = false,
}: {
	location: IReadOnlyLocation_Combined;
	index?: number;
	partOfMainGrid?: boolean;
	animate?: boolean;
}) {
	const {
		name,
		location: locationText,
		url,
		shortDescription,
		menu,
		todaysSpecials = [],
		statusMsg,
		todaysSoups = [],
	} = location;
	const changesSoon = !location.closedLongTerm && location.changesSoon;
	const isOpen = !location.closedLongTerm && location.isOpen;

	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Grid item xs={12} md={4} lg={3} xl={3}>
				<div
					className={`card ${animate ? 'card--animated' : ''} ${partOfMainGrid ? 'card--in-main-grid' : ''}`}
					style={{ '--card-show-delay': `${index * 50}ms` }}
				>
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
						state={location.locationState}
						avatar={
							<Avatar
								sx={{
									width: 12,
									height: 12,
									backgroundColor: 'transparent',
									marginTop: '8px',
								}}
							>
								<Dot
									state={location.locationState}
									changesSoon={changesSoon}
								/>
							</Avatar>
						}
						className="card__header"
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
					<CardActions sx={{ marginTop: 'auto', padding: '16px' }}>
						{menu && (
							<ActionButton
								onClick={() => {
									window.open(menu, '_blank');
								}}
							>
								Menu
							</ActionButton>
						)}
						{(todaysSpecials.length !== 0 ||
							todaysSoups.length !== 0) && (
							<ActionButton
								onClick={() => {
									setModalOpen(true);
								}}
							>
								Specials
							</ActionButton>
						)}
					</CardActions>
				</div>
			</Grid>

			<Dialog
				open={modalOpen}
				onClose={() => {
					setModalOpen(false);
				}}
				PaperProps={{
					style: {
						backgroundColor: 'transparent',
					},
				}}
			>
				<div className="card card--dialog">
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
									backgroundColor: 'transparent',
									marginTop: '8px',
								}}
							>
								<Dot
									state={location.locationState}
									changesSoon={changesSoon}
								/>
							</Avatar>
						}
						state={location.locationState}
						className="card--dialog__header"
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
					</CardContent>
					{todaysSpecials.concat(todaysSoups).map((special) => (
						<SpecialsContent key={special.title}>
							<AccordionSummary
								expandIcon={
									<ExpandMoreIcon
										style={{
											color: 'var(--card-text-description)',
										}}
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
				</div>
			</Dialog>
		</>
	);
}

export default EateryCard;
