import { useEffect, useRef, useState } from 'react';
import {
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
	Dialog,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getTimeSlotsString } from '../util/time';
import TextProps from '../types/interfaces';
import {
	IReadOnlyLocation_Combined,
	LocationState,
} from '../types/locationTypes';
import './EateryCard.css';

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
	textUnderlineOffset: '2px',
});

const NameText = styled(Typography)({
	padding: 0,
	marginBottom: 5,
	fontFamily: 'var(--text-primary-font)',
	textTransform: 'capitalize',
	lineHeight: 1.2,
});

const LocationText = styled(Typography)({
	color: 'var(--card-text-muted)',
	marginBottom: 16,
	fontWeight: 500,
	fontSize: 14,
});

const DescriptionText = styled(Typography)({
	color: 'var(--card-text-description)',
});

const LongDescriptionText = styled(Typography)({
	color: 'var(--text-muted)',
	marginBottom: '5px',
});
const StyledAccordion = styled(Accordion)({});
const StyledAccordionSummary = styled(AccordionSummary)({
	backgroundColor: 'hsl(206 9% 12%)',
	color: 'var(--card-text-description)',
	// fontWeight: 'bold',
	'&:hover': {
		backgroundColor: 'hsl(206 9% 9%)',
		'&:active': {
			backgroundColor: 'hsl(206 9% 8%)',
		},
	},
	'&.Mui-expanded': {
		backgroundColor: 'hsl(206 9% 8%)',
	},
});
const StyledAccordionDetails = styled(AccordionDetails)({
	backgroundColor: 'hsl(206 9% 11% / 1)',
	color: 'hsl(206 9% 75% / 1)',
	fontSize: 16,
	paddingTop: 20,
});
const StatusText = styled(Typography, {
	shouldForwardProp: (prop) => prop !== 'state',
})<TextProps>(({ state }) => ({
	color: textColors[state],
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
	'&:hover': {
		backgroundColor: 'var(--button-bg--hover)',
	},
});

const ExitButton = styled(Button)({
	fontFamily: 'var(--text-secondary-font)',
	color: 'var(--button-text)',
	backgroundColor: 'hsl(0 45.1% 30.2%)',
	padding: '15px 4px',

	letterSpacing: -0.2,
	elevation: 30,
	'&:hover': {
		backgroundColor: 'hsl(0 65.1% 30.2%)',
	},
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
		location: physicalLocation,
		url,
		shortDescription,
		menu,
		todaysSpecials = [],
		todaysSoups = [],
	} = location;

	const [openedModal, setOpenedModal] = useState<
		'none' | 'specials' | 'description'
	>('none');

	return (
		<Grid item xs={12} md={4} lg={3} xl={3}>
			<div
				className={`card ${animate ? 'card--animated' : ''} ${partOfMainGrid ? 'card--in-main-grid' : ''}`}
				style={{ '--card-show-delay': `${index * 50}ms` }}
			>
				<EateryCardHeader location={location} />
				<CardContent className="card__content">
					<NameText variant="h6">
						<CustomLink href={url} target="_blank">
							{name}
						</CustomLink>
					</NameText>
					<LocationText variant="subtitle2">
						{physicalLocation}
					</LocationText>
					<DescriptionText>{shortDescription}</DescriptionText>
				</CardContent>
				<div className="card__actions">
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
								setOpenedModal('specials');
							}}
						>
							Specials
						</ActionButton>
					)}
					<ActionButton
						onClick={() => {
							setOpenedModal('description');
						}}
					>
						Details
					</ActionButton>
				</div>
				<EateryCardDialog
					open={openedModal === 'specials'}
					onClose={() => setOpenedModal('none')}
					location={location}
					type="specials"
				/>
				<EateryCardDialog
					open={openedModal === 'description'}
					onClose={() => setOpenedModal('none')}
					location={location}
					type="description"
				/>
			</div>
		</Grid>
	);
}
function EateryCardHeader({
	location,
}: {
	location: IReadOnlyLocation_Combined;
}) {
	const dotRef = useRef<HTMLDivElement | null>(null);
	const changesSoon = !location.closedLongTerm && location.changesSoon;
	useEffect(() => {
		const dotAnimation = dotRef.current?.getAnimations()[0];
		if (dotAnimation === undefined) return;
		dotAnimation.startTime = 0;
		dotAnimation.play();
	}, [changesSoon]);
	return (
		<StyledCardHeader
			title={
				<StatusText
					variant="subtitle1"
					state={location.locationState}
					className="card__header__text"
				>
					{location.statusMsg}
				</StatusText>
			}
			state={location.locationState}
			avatar={
				<div
					className={`card__header__dot ${changesSoon ? 'card__header__dot--blinking' : ''}`}
					style={{
						backgroundColor:
							highlightColors[location.locationState],
					}}
					ref={dotRef}
				/>
			}
			className="card__header"
		/>
	);
}
function EateryCardDialog({
	open,
	type,
	onClose,
	location,
}: {
	open: boolean;
	type: 'specials' | 'description';
	onClose: () => void;
	location: IReadOnlyLocation_Combined;
}) {
	const {
		location: physicalLocation,
		name,
		url,
		todaysSoups = [],
		todaysSpecials = [],
		description,
	} = location;
	const timeSlots = getTimeSlotsString(location.times);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				style: {
					backgroundColor: 'transparent',
					margin: 15,
				},
			}}
			style={{}}
		>
			<div className="card card--dialog">
				<EateryCardHeader location={location} />
				<CardContent
					className="card__content"
					sx={{ overflowY: 'auto' }}
				>
					<NameText variant="h6">
						<CustomLink href={url} target="_blank">
							{name}
						</CustomLink>
					</NameText>
					<LocationText variant="subtitle2">
						{physicalLocation}
					</LocationText>
					{type === 'specials' &&
						todaysSpecials.concat(todaysSoups).map((special) => (
							<StyledAccordion key={special.title}>
								<StyledAccordionSummary
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
								</StyledAccordionSummary>
								<StyledAccordionDetails>
									<LocationText>
										{special.description}
									</LocationText>
								</StyledAccordionDetails>
							</StyledAccordion>
						))}
					{type === 'description' && (
						<>
							<LongDescriptionText variant="subtitle1">
								{description}
							</LongDescriptionText>
							<StyledAccordion
								disableGutters
								style={{ marginTop: 24 }}
							>
								<StyledAccordionSummary
									className="accordion__summary"
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
									Show weekly hours
								</StyledAccordionSummary>

								<StyledAccordionDetails>
									{[
										'Sunday',
										'Monday',
										'Tuesday',
										'Wednesday',
										'Thursday',
										'Friday',
										'Saturday',
									].map((day, i) => (
										<div style={{ marginBottom: '10px' }}>
											<span style={{ color: 'white' }}>
												{day}
											</span>
											: {timeSlots[i]}
										</div>
									))}
								</StyledAccordionDetails>
							</StyledAccordion>
						</>
					)}
				</CardContent>
				<ExitButton onClick={onClose}>Close</ExitButton>
			</div>
		</Dialog>
	);
}

export default EateryCard;
