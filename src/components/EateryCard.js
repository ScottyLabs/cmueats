import React, { useState } from 'react';
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

const StyledCard = styled(Card)({
	backgroundColor: '#23272A',
	border: '2px solid rgba(0, 0, 0, 0.2)',
	textAlign: 'left',
	borderRadius: 7,
	height: '100%',
	justifyContent: 'flex-start',
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

const OpenText = styled(Typography)(({ changesSoon }) => ({
	color: changesSoon ? '#f3f65d' : '#19b875',
	fontSize: 14,
	fontWeight: 500,
	fontFamily:
		'"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", ' +
		'"Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", ' +
		'"Helvetica Neue", sans-serif',
}));

const ClosedText = styled(Typography)(({ changesSoon }) => ({
	color: changesSoon ? '#f6cc5d' : '#dd3c18',
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

const colors = {
	open: '#19b875',
	closed: '#dd3c18',
	soonOpen: '#f3f65d',
	soonClosed: '#f6cc5d',
};

const Dot = styled(Card)(({ color, changesSoon }) => ({
	background: colors[color],
	width: '100%',
	height: '100%',
	borderRadius: '50%',
	foregroundColor: colors[color],
	...(changesSoon && blinkingAnimation),
	animationName: changesSoon && 'blinking',
	animationDuration: '1s',
	animationIterationCount: 'infinite',
}));

const SpecialsContent = styled(Accordion)({
	backgroundColor: '#23272A',
});

export default function EateryCard({ location }) {
	const {
		name,
		location: locationText,
		url,
		shortDescription,
		menu,
		todaysSpecials = [],
		isOpen,
		statusMsg,
		todaysSoups = [],
	} = location;

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
									changesSoon={location.changesSoon}
								>
									{statusMsg}
								</OpenText>
							) : (
								<ClosedText
									variant="subtitle1"
									changesSoon={location.changesSoon}
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
									color={(() => {
										// Location is open/opening
										if (location.isOpen) {
											return location.changesSoon
												? 'soonOpen'
												: 'open';
										}
										// Location is closed/closing
										return location.changesSoon
											? 'soonClosed'
											: 'closed';
									})()}
									changesSoon={location.changesSoon}
								/>
							</Avatar>
						}
					></StyledCardHeader>
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
									changesSoon={location.changesSoon}
								>
									{statusMsg}
								</OpenText>
							) : (
								<ClosedText
									variant="subtitle1"
									changesSoon={location.changesSoon}
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
									color={(() => {
										// Location is open/opening
										if (location.isOpen) {
											return location.changesSoon
												? 'soonOpen'
												: 'open';
										}
										// Location is closed/closing
										return location.changesSoon
											? 'soonClosed'
											: 'closed';
									})()}
									changesSoon={location.changesSoon}
								/>
							</Avatar>
						}
					></StyledCardHeader>
					<CardContent>
						<NameText variant="h6">
							<CustomLink href={url}>{name}</CustomLink>
						</NameText>
						<LocationText variant="subtitle2">
							{locationText}
						</LocationText>
					</CardContent>
					{todaysSpecials.concat(todaysSoups).map((special, idx) => (
						<SpecialsContent style={{}} key={idx}>
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
