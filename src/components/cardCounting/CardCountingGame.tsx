import React, { useState, useEffect } from 'react';
import {
	Container,
	Box,
	Typography,
	Paper,
	Tabs,
	Tab,
	Button,
	Grid,
	Card,
	CardContent,
	CardActions,
	Snackbar,
} from '@mui/material';
import { CARD_COUNTING_SYSTEMS } from './systems';
import { TRAINING_MODES } from './trainingModes';
import TrainingInterface from './TrainingInterface';
import { CardCountingSystem, TrainingMode, TrainingStats } from './types';

interface CardCountingGameProps {
	onWin: (multiplier: number) => void;
	onLose: () => void;
	balance: number;
	betAmount: number;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`card-counting-tabpanel-${index}`}
			aria-labelledby={`card-counting-tab-${index}`}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function CardCountingGame({
	onWin,
	onLose,
	balance,
	betAmount,
}: CardCountingGameProps) {
	// Using balance and betAmount for betting features
	const [currentTab, setCurrentTab] = useState(0);
	const [selectedSystem, setSelectedSystem] = useState<CardCountingSystem>(
		CARD_COUNTING_SYSTEMS[0],
	);
	const [selectedMode, setSelectedMode] = useState<TrainingMode>(
		TRAINING_MODES[0],
	);
	const [showTraining, setShowTraining] = useState(false);
	const [trainingStats, setTrainingStats] = useState<TrainingStats>({
		correctDecisions: 0,
		totalDecisions: 0,
		averageResponseTime: 0,
		accuracy: 0,
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number,
	) => {
		setCurrentTab(newValue);
	};

	const handleSystemChange = (system: CardCountingSystem) => {
		setSelectedSystem(system);
	};

	const handleModeChange = (mode: TrainingMode) => {
		setSelectedMode(mode);
	};

	const handleStartTraining = () => {
		// Check if player has enough balance for the bet
		if (balance < betAmount) {
			setSnackbarMessage(
				"You don't have enough balance for this training session",
			);
			setSnackbarOpen(true);
			return;
		}
		setShowTraining(true);
	};

	const handleTrainingComplete = (stats: TrainingStats) => {
		setTrainingStats(stats);
		setShowTraining(false);
	};

	useEffect(() => {
		if (trainingStats.accuracy > 90) {
			onWin(2);
		} else if (trainingStats.accuracy > 70) {
			onWin(1);
		} else if (trainingStats.totalDecisions > 0) {
			onLose();
		}
	}, [trainingStats, onWin, onLose]);

	if (showTraining) {
		return (
			<TrainingInterface
				system={selectedSystem}
				mode={selectedMode}
				onComplete={handleTrainingComplete}
			/>
		);
	}

	return (
		<Container maxWidth="lg">
			<Box sx={{ width: '100%', mt: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Card Counting Training
				</Typography>

				{/* Display current balance and bet amount */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						mb: 2,
					}}
				>
					<Typography variant="body1">Balance: ${balance}</Typography>
					<Typography variant="body1">
						Current Bet: ${betAmount}
					</Typography>
				</Box>

				<Paper sx={{ width: '100%', mb: 2 }}>
					<Tabs
						value={currentTab}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="inherit"
						centered
						sx={{
							'& .MuiTab-root': {
								color: 'white',
							},
						}}
					>
						<Tab label="Counting Systems" />
						<Tab label="Training Modes" />
						<Tab label="Statistics" />
					</Tabs>

					<TabPanel value={currentTab} index={0}>
						<Grid container spacing={3}>
							{CARD_COUNTING_SYSTEMS.map((system) => (
								<Grid
									item
									xs={12}
									sm={6}
									md={4}
									key={system.name}
								>
									<Card>
										<CardContent>
											<Typography
												variant="h6"
												component="h2"
											>
												{system.name}
											</Typography>
											<Typography
												color="white"
												gutterBottom
											>
												Difficulty: {system.difficulty}
											</Typography>
											<Typography variant="body2">
												{system.description}
											</Typography>
										</CardContent>
										<CardActions>
											<Button
												size="small"
												color="primary"
												onClick={() =>
													handleSystemChange(system)
												}
												variant={
													selectedSystem.name ===
													system.name
														? 'contained'
														: 'outlined'
												}
											>
												Select
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
					</TabPanel>

					<TabPanel value={currentTab} index={1}>
						<Grid container spacing={3}>
							{TRAINING_MODES.map((mode) => (
								<Grid
									item
									xs={12}
									sm={6}
									md={4}
									key={mode.name}
								>
									<Card>
										<CardContent>
											<Typography
												variant="h6"
												component="h2"
											>
												{mode.name}
											</Typography>
											<Typography
												color="white"
												gutterBottom
											>
												Difficulty: {mode.difficulty}
											</Typography>
											<Typography variant="body2">
												{mode.description}
											</Typography>
										</CardContent>
										<CardActions>
											<Button
												size="small"
												color="primary"
												onClick={() =>
													handleModeChange(mode)
												}
												variant={
													selectedMode.name ===
													mode.name
														? 'contained'
														: 'outlined'
												}
											>
												Select
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
					</TabPanel>

					<TabPanel value={currentTab} index={2}>
						<Box>
							<Typography variant="h6" gutterBottom>
								Training Statistics
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Paper sx={{ p: 2 }}>
										<Typography variant="subtitle1">
											Accuracy
										</Typography>
										<Typography variant="h4">
											{trainingStats.accuracy.toFixed(1)}%
										</Typography>
									</Paper>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Paper sx={{ p: 2 }}>
										<Typography variant="subtitle1">
											Average Response Time
										</Typography>
										<Typography variant="h4">
											{trainingStats.averageResponseTime.toFixed(
												1,
											)}
											s
										</Typography>
									</Paper>
								</Grid>
							</Grid>
						</Box>
					</TabPanel>
				</Paper>

				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleStartTraining}
						disabled={balance < betAmount}
					>
						Start Training (Bet: ${betAmount})
					</Button>
				</Box>
			</Box>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				message={snackbarMessage}
			/>
		</Container>
	);
}

export default CardCountingGame;
