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
	Divider,
	Checkbox,
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
	{ id: 'credit', name: 'Credit Card' },
	{ id: 'paypal', name: 'PayPal' },
	{ id: 'crypto', name: 'Cryptocurrency' },
	{ id: 'meal', name: 'Meal Plan Points' },
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
	const [paymentMethod, setPaymentMethod] = useState('credit');
	const [termsAccepted, setTermsAccepted] = useState(false);

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

	const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTermsAccepted(event.target.checked);
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
								Payment Method
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
												mb: 2,
												p: 2,
												border: '1px solid #eee',
												borderRadius: '8px',
											}}
										>
											<FormControlLabel
												value={method.id}
												control={<Radio />}
												label={method.name}
											/>
										</Box>
									))}
								</RadioGroup>
							</FormControl>

							{paymentMethod === 'credit' && (
								<Box sx={{ mt: 3 }}>
									<TextField
										label="Card Number"
										fullWidth
										sx={{ mb: 2 }}
										placeholder="1234 5678 9012 3456"
									/>
									<Box sx={{ display: 'flex', gap: 2 }}>
										<TextField
											label="Expiration Date"
											placeholder="MM/YY"
											sx={{ flex: 1 }}
										/>
										<TextField
											label="CVV"
											placeholder="123"
											sx={{ flex: 1 }}
										/>
									</Box>
								</Box>
							)}
						</Box>
					)}

					{activeStep === 2 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Review Your Order
							</Typography>

							<Box
								sx={{
									bgcolor: '#f9f9f9',
									p: 3,
									borderRadius: '8px',
									mb: 3,
								}}
							>
								<Typography
									variant="subtitle1"
									fontWeight="bold"
								>
									{
										subscriptionPlans.find(
											(plan) => plan.id === selectedPlan,
										)?.name
									}
								</Typography>
								<Typography
									variant="h5"
									color="primary"
									sx={{ my: 1 }}
								>
									{
										subscriptionPlans.find(
											(plan) => plan.id === selectedPlan,
										)?.price
									}
									/month
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Billed monthly. Cancel anytime.
								</Typography>
							</Box>

							<Divider sx={{ my: 2 }} />

							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mb: 2,
								}}
							>
								<Typography>Payment Method:</Typography>
								<Typography fontWeight="bold">
									{
										paymentMethods.find(
											(method) =>
												method.id === paymentMethod,
										)?.name
									}
								</Typography>
							</Box>

							<Box sx={{ mt: 4 }}>
								<FormControlLabel
									control={
										<Checkbox
											checked={termsAccepted}
											onChange={handleTermsChange}
										/>
									}
									label={
										<Typography variant="body2">
											I agree to the Terms of Service and
											acknowledge that this is just an
											April Fools&apos; Day prank.
										</Typography>
									}
								/>
							</Box>
						</Box>
					)}

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							mt: 4,
						}}
					>
						<Button
							disabled={activeStep === 0}
							onClick={handleBack}
						>
							Back
						</Button>
						<Button
							variant="contained"
							onClick={handleNext}
							disabled={
								activeStep === steps.length - 1 &&
								!termsAccepted
							}
							sx={{
								background:
									'linear-gradient(45deg, #FF5F6D 30%, #FFC371 90%)',
								boxShadow:
									'0 3px 5px 2px rgba(255, 105, 135, .3)',
							}}
						>
							{activeStep === steps.length - 1
								? 'Complete Payment'
								: 'Next'}
						</Button>
					</Box>
				</DialogContent>
			</Box>
		</StyledDialog>
	);
}

export default MicrotransactionPaywall;
