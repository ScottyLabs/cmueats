import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	Typography,
	Button,
	Box,
	IconButton,
	TextField,
	Stepper,
	Step,
	StepLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { IS_APRIL_FOOLS } from '../util/constants';

// Styles
const StyledDialog = styled(Dialog)({
	'& .MuiPaper-root': {
		backgroundColor: 'white',
		color: '#333',
		maxWidth: '90vw',
		width: '100%',
		maxHeight: '90vh',
		borderRadius: '12px',
	},
});

const HeaderBox = styled(Box)({
	background: 'linear-gradient(90deg, #FF5F6D 0%, #FFC371 100%)',
	padding: '20px',
	borderRadius: '8px 8px 0 0',
	textAlign: 'center',
	marginBottom: '20px',
	color: 'white',
});

const PricingBox = styled(Box)({
	backgroundColor: '#f9f9f9',
	padding: '20px',
	borderRadius: '12px',
	margin: '10px 0',
	border: '1px solid #eee',
	'&:hover': {
		boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
	},
});

const FeatureList = styled(Box)({
	padding: '10px 0',
});

const Feature = styled(Box)({
	display: 'flex',
	alignItems: 'center',
	marginBottom: '10px',
	'& svg': {
		marginRight: '10px',
		color: '#4CAF50',
	},
});

// Subscription plans
const subscriptionPlans = [
	{
		id: 'basic',
		name: 'Basic Access',
		price: '$1.99',
		description: 'View open restaurants only',
		features: [
			'See currently open restaurants',
			'Basic info only',
			'5 restaurant views per day',
			'Ad-supported experience',
		],
	},
	{
		id: 'standard',
		name: 'Standard Access',
		price: '$4.99',
		description: 'All restaurants with basic features',
		features: [
			'View all restaurants',
			'See menus and hours',
			'20 restaurant views per day',
			'Reduced ads',
		],
	},
	{
		id: 'premium',
		name: 'Premium Access',
		price: '$9.99',
		description: 'Full access to all features',
		features: [
			'Unlimited restaurant views',
			'Real-time updates',
			'Special menu items',
			'No advertisements',
			'Priority restaurant notification',
		],
	},
];

// Payment method icons/options
const paymentMethods = [
	{ id: 'paypal', name: 'PayPal' },
	{ id: 'crypto', name: 'Cryptocurrency' },
	{ id: 'meal', name: 'Meal Blocks' },
];

interface MicrotransactionPaywallProps {
	open: boolean;
	onClose: () => void;
	onPaymentComplete: () => void;
}

function MicrotransactionPaywall({
	open,
	onClose,
	onPaymentComplete,
}: MicrotransactionPaywallProps) {
	const [activeStep, setActiveStep] = useState(0);
	const [selectedPlan, setSelectedPlan] = useState('standard');
	const [paymentMethod, setPaymentMethod] = useState('paypal');
	const [cmuEmail, setCmuEmail] = useState('');
	const [cmuPassword, setCmuPassword] = useState('');

	// Mock steps in the payment process
	const steps = ['Choose Plan', 'Payment Method', 'Review & Confirm'];

	const handlePaymentComplete = () => {
		// Simulate a successful payment
		setTimeout(() => {
			onPaymentComplete();
			onClose();
		}, 1000);
	};

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			// Final step, initiate "payment"
			handlePaymentComplete();
		} else {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPlan(event.target.value);
	};

	const handlePaymentMethodChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPaymentMethod(event.target.value);
	};

	const renderPaymentForm = () => {
		switch (paymentMethod) {
			case 'paypal':
				return (
					<Box sx={{ mt: 2 }}>
						<Typography variant="body1" gutterBottom>
							You will be redirected to PayPal to complete your
							payment.
						</Typography>
						<Button
							variant="contained"
							color="primary"
							fullWidth
							sx={{ mt: 2 }}
							onClick={handlePaymentComplete}
						>
							Continue to PayPal
						</Button>
					</Box>
				);
			case 'crypto':
				return (
					<Box sx={{ mt: 2 }}>
						<Typography variant="body1" gutterBottom>
							Send payment to the following address:
						</Typography>
						<Box
							sx={{
								p: 2,
								bgcolor: '#f5f5f5',
								borderRadius: 1,
								wordBreak: 'break-all',
								fontFamily: 'monospace',
							}}
						>
							0x742d35Cc6634C0532925a3b844Bc454e4438f44e
						</Box>
						<Button
							variant="contained"
							color="primary"
							fullWidth
							sx={{ mt: 2 }}
							onClick={handlePaymentComplete}
						>
							I&apos;ve Sent the Payment
						</Button>
					</Box>
				);
			case 'meal':
				return (
					<Box sx={{ mt: 2 }}>
						<TextField
							fullWidth
							label="CMU Email"
							variant="outlined"
							value={cmuEmail}
							onChange={(e) => setCmuEmail(e.target.value)}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="Password"
							type="password"
							variant="outlined"
							value={cmuPassword}
							onChange={(e) => setCmuPassword(e.target.value)}
							sx={{ mb: 2 }}
						/>
						<Button
							variant="contained"
							color="primary"
							fullWidth
							onClick={handlePaymentComplete}
						>
							Verify and Pay with Meal Blocks
						</Button>
					</Box>
				);
			default:
				return null;
		}
	};

	if (!IS_APRIL_FOOLS) return null;

	return (
		<StyledDialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="md"
			scroll="paper"
		>
			<Box sx={{ position: 'relative' }}>
				<IconButton
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: 'white',
						zIndex: 1,
					}}
				>
					<CloseIcon />
				</IconButton>

				<HeaderBox>
					<Typography
						variant="h4"
						component="h1"
						fontWeight="bold"
						gutterBottom
					>
						CMUEats Premium Access
					</Typography>
					<Typography variant="subtitle1">
						Unlock the full dining experience with our premium plans
					</Typography>
				</HeaderBox>

				<DialogContent>
					<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>

					{activeStep === 0 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Select a Subscription Plan
							</Typography>
							<FormControl
								component="fieldset"
								sx={{ width: '100%' }}
							>
								<RadioGroup
									aria-label="subscription plan"
									name="subscription-plan"
									value={selectedPlan}
									onChange={handlePlanChange}
								>
									{subscriptionPlans.map((plan) => (
										<PricingBox key={plan.id}>
											<FormControlLabel
												value={plan.id}
												control={<Radio />}
												label={
													<Box>
														<Typography variant="h6">
															{plan.name} -{' '}
															{plan.price}/month
														</Typography>
														<Typography
															variant="body2"
															color="text.secondary"
														>
															{plan.description}
														</Typography>
														<FeatureList>
															{plan.features.map(
																(feature) => (
																	<Feature
																		key={`${plan.id}-${feature.replace(/\s+/g, '-').toLowerCase()}`}
																	>
																		<span>
																			✓
																		</span>
																		<Typography variant="body2">
																			{
																				feature
																			}
																		</Typography>
																	</Feature>
																),
															)}
														</FeatureList>
													</Box>
												}
												sx={{ width: '100%', m: 0 }}
											/>
										</PricingBox>
									))}
								</RadioGroup>
							</FormControl>
						</Box>
					)}

					{activeStep === 1 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Select Payment Method
							</Typography>
							<FormControl
								component="fieldset"
								sx={{ width: '100%' }}
							>
								<RadioGroup
									aria-label="payment method"
									name="payment-method"
									value={paymentMethod}
									onChange={handlePaymentMethodChange}
								>
									{paymentMethods.map((method) => (
										<Box
											key={method.id}
											sx={{
												p: 2,
												mb: 2,
												border: '1px solid #eee',
												borderRadius: 1,
												'&:hover': {
													bgcolor: '#f9f9f9',
												},
											}}
										>
											<FormControlLabel
												value={method.id}
												control={<Radio />}
												label={
													<Typography variant="subtitle1">
														{method.name}
													</Typography>
												}
											/>
										</Box>
									))}
								</RadioGroup>
							</FormControl>
						</Box>
					)}

					{activeStep === 2 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Review & Confirm
							</Typography>
							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1">
									Selected Plan:{' '}
									{
										subscriptionPlans.find(
											(p) => p.id === selectedPlan,
										)?.name
									}
								</Typography>
								<Typography variant="subtitle1">
									Payment Method:{' '}
									{
										paymentMethods.find(
											(m) => m.id === paymentMethod,
										)?.name
									}
								</Typography>
							</Box>
							{renderPaymentForm()}
						</Box>
					)}

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							mt: 3,
						}}
					>
						{activeStep > 0 && (
							<Button onClick={handleBack} sx={{ mr: 1 }}>
								Back
							</Button>
						)}
						{activeStep < steps.length - 1 && (
							<Button variant="contained" onClick={handleNext}>
								Next
							</Button>
						)}
					</Box>
				</DialogContent>
			</Box>
		</StyledDialog>
	);
}

export default MicrotransactionPaywall;
