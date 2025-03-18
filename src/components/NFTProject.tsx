import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	Grid,
	Typography,
	Card,
	CardContent,
	CardMedia,
	Button,
	Box,
	IconButton,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Tooltip,
	LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PoolIcon from '@mui/icons-material/Pool';
import { styled } from '@mui/material/styles';
import { IS_APRIL_FOOLS } from '../util/constants';

// Styles
const StyledDialog = styled(Dialog)({
	'& .MuiPaper-root': {
		backgroundColor: 'var(--card-bg)',
		color: 'var(--text-primary)',
		maxWidth: '90vw',
		width: '100%',
		maxHeight: '90vh',
		borderRadius: '12px',
		border: '1px solid var(--card-border-color)',
	},
});

const NFTCard = styled(Card)({
	backgroundColor: 'var(--card-header-bg)',
	color: 'var(--text-primary)',
	borderRadius: '12px',
	border: '1px solid var(--card-border-color)',
	transition: 'transform 0.3s ease, box-shadow 0.3s ease',
	'&:hover': {
		transform: 'translateY(-5px)',
		boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
	},
});

const PriceTag = styled(Box)({
	backgroundColor: 'var(--location-closed-text-color)',
	color: 'white',
	padding: '5px 10px',
	borderRadius: '8px',
	fontWeight: 'bold',
	display: 'inline-block',
});

const GasTag = styled(Box)({
	backgroundColor: 'var(--location-opens-soon-text-color)',
	color: 'black',
	padding: '2px 6px',
	borderRadius: '4px',
	fontWeight: 'bold',
	fontSize: '0.7rem',
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
});

const StyledTab = styled(Tab)({
	color: 'var(--text-muted)',
	'&.Mui-selected': {
		color: 'var(--text-primary)',
	},
});

const HeaderBox = styled(Box)({
	background:
		'linear-gradient(90deg, var(--logo-first-half) 0%, var(--logo-second-half) 100%)',
	padding: '30px',
	borderRadius: '8px 8px 0 0',
	textAlign: 'center',
	marginBottom: '20px',
	position: 'relative',
	overflow: 'hidden',
});

const RarityChip = styled(Chip)(({ rarity }: { rarity: string }) => {
	let bgColor = 'gray';
	switch (rarity) {
		case 'common':
			bgColor = '#6E7191';
			break;
		case 'uncommon':
			bgColor = '#3DB670';
			break;
		case 'rare':
			bgColor = '#3B82F6';
			break;
		case 'epic':
			bgColor = '#8B5CF6';
			break;
		case 'legendary':
			bgColor = '#F59E0B';
			break;
		default:
			bgColor = '#6E7191';
	}
	return {
		backgroundColor: bgColor,
		color: 'white',
		fontWeight: 'bold',
		fontSize: '0.65rem',
		height: '20px',
	};
});

const Logo3DContainer = styled(Box)({
	position: 'absolute',
	right: '30px',
	top: '50%',
	transform: 'translateY(-50%)',
	width: '80px',
	height: '80px',
	perspective: '800px',
	'@media (max-width: 600px)': {
		display: 'none',
	},
});

const RotatingLogo = styled(Box)({
	width: '100%',
	height: '100%',
	position: 'relative',
	transformStyle: 'preserve-3d',
	animation: 'rotate 10s infinite linear',
	'@keyframes rotate': {
		'0%': {
			transform: 'rotateY(0deg) rotateX(10deg)',
		},
		'100%': {
			transform: 'rotateY(360deg) rotateX(10deg)',
		},
	},
});

const LogoSide = styled(Box)({
	position: 'absolute',
	width: '100%',
	height: '100%',
	backfaceVisibility: 'hidden',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontWeight: 'bold',
	fontSize: '16px',
	boxShadow: '0 0 10px rgba(0,0,0,0.2)',
	borderRadius: '8px',
});

const StatsBox = styled(Box)({
	backgroundColor: 'var(--card-header-bg)',
	borderRadius: '8px',
	padding: '15px',
	marginBottom: '20px',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
	gap: '10px',
});

const StatItem = styled(Box)({
	textAlign: 'center',
});

// Updated NFT data with additional properties
const nftData = [
	{
		id: 1,
		name: 'CMUEats #001',
		image: 'https://via.placeholder.com/300/6D28D9/FFFFFF?text=CMUEats+NFT+001',
		price: 0.25,
		priceHistory: [0.15, 0.18, 0.22, 0.25],
		description:
			"Ultra rare CMUEats collector's item featuring a legendary dining hall experience.",
		owner: '0x742...1a3b',
		rarity: 'legendary',
		rarityScore: 98,
		lastSold: '2 days ago',
		attributes: [
			{ trait: 'Location', value: 'The Underground' },
			{ trait: 'Food Type', value: 'Coffee' },
			{ trait: 'Time Period', value: 'Morning' },
		],
		sold: false,
	},
	{
		id: 2,
		name: 'CMUEats #042',
		image: 'https://via.placeholder.com/300/4F46E5/FFFFFF?text=CMUEats+NFT+042',
		price: 0.15,
		priceHistory: [0.08, 0.12, 0.15],
		description:
			'Limited edition artwork commemorating the grand opening of the Tepper Quad cafe.',
		owner: '0xf3c...9d21',
		rarity: 'rare',
		rarityScore: 78,
		lastSold: '1 week ago',
		attributes: [
			{ trait: 'Location', value: 'Tepper Quad' },
			{ trait: 'Food Type', value: 'Sandwich' },
			{ trait: 'Time Period', value: 'Lunch' },
		],
		sold: false,
	},
	{
		id: 3,
		name: 'CMUEats #107',
		image: 'https://via.placeholder.com/300/8B5CF6/FFFFFF?text=CMUEats+NFT+107',
		price: 0.4,
		priceHistory: [0.25, 0.3, 0.38, 0.42, 0.39, 0.4],
		description:
			'Rare digital collectible featuring the famous Entropy playlist from the Underground.',
		owner: '0xa12...8e67',
		rarity: 'epic',
		rarityScore: 91,
		lastSold: '4 days ago',
		attributes: [
			{ trait: 'Location', value: 'Entropy' },
			{ trait: 'Food Type', value: 'Pizza' },
			{ trait: 'Time Period', value: 'Evening' },
		],
		sold: false,
	},
	{
		id: 4,
		name: 'CMUEats #233',
		image: 'https://via.placeholder.com/300/3B82F6/FFFFFF?text=CMUEats+NFT+233',
		price: 0.12,
		priceHistory: [0.05, 0.08, 0.1, 0.12],
		description:
			'A historic moment from the ABP line during finals week. Only 3 in existence.',
		owner: '0x098...f4e2',
		rarity: 'uncommon',
		rarityScore: 65,
		lastSold: '2 weeks ago',
		attributes: [
			{ trait: 'Location', value: 'ABP' },
			{ trait: 'Food Type', value: 'Bagel' },
			{ trait: 'Time Period', value: 'Morning' },
		],
		sold: false,
	},
	{
		id: 5,
		name: 'CMUEats #304',
		image: 'https://via.placeholder.com/300/6366F1/FFFFFF?text=CMUEats+NFT+304',
		price: 0.75,
		priceHistory: [0.45, 0.5, 0.6, 0.72, 0.75],
		description:
			'The legendary platinum membership pass. Grants virtual bragging rights.',
		owner: '0xd56...2a89',
		rarity: 'legendary',
		rarityScore: 99,
		lastSold: '3 days ago',
		attributes: [
			{ trait: 'Location', value: 'All Locations' },
			{ trait: 'Food Type', value: 'Premium' },
			{ trait: 'Time Period', value: 'All Day' },
		],
		sold: false,
	},
	{
		id: 6,
		name: 'CMUEats #418',
		image: 'https://via.placeholder.com/300/A855F7/FFFFFF?text=CMUEats+NFT+418',
		price: 0.22,
		priceHistory: [0.15, 0.18, 0.22],
		description:
			'Ultra-limited 3D model of the famous Sushi Too bento box.',
		owner: '0x321...7f40',
		rarity: 'common',
		rarityScore: 42,
		lastSold: '5 days ago',
		attributes: [
			{ trait: 'Location', value: 'Sushi Too' },
			{ trait: 'Food Type', value: 'Sushi' },
			{ trait: 'Time Period', value: 'Lunch' },
		],
		sold: false,
	},
];

// Enhanced transaction data with gas fees
const transactionData = [
	{
		id: 1,
		nft: 'CMUEats #107',
		from: '0xa12...8e67',
		to: '0xb43...92f1',
		price: 0.38,
		gasFee: 0.012,
		time: '2 hours ago',
	},
	{
		id: 2,
		nft: 'CMUEats #001',
		from: '0x742...1a3b',
		to: '0x623...a0f5',
		price: 0.2,
		gasFee: 0.008,
		time: '5 hours ago',
	},
	{
		id: 3,
		nft: 'CMUEats #418',
		from: '0x321...7f40',
		to: '0xe56...4d21',
		price: 0.18,
		gasFee: 0.006,
		time: '1 day ago',
	},
	{
		id: 4,
		nft: 'CMUEats #304',
		from: '0xd56...2a89',
		to: '0x789...c3b2',
		price: 0.6,
		gasFee: 0.015,
		time: '2 days ago',
	},
	{
		id: 5,
		nft: 'CMUEats #042',
		from: '0xf3c...9d21',
		to: '0x458...9e30',
		price: 0.12,
		gasFee: 0.004,
		time: '3 days ago',
	},
];

// Collection stats
const collectionStats = {
	floorPrice: 0.12,
	totalVolume: 8.75,
	owners: 42,
	listed: 6,
	totalSupply: 100,
	sevenDayChange: 15.4, // Percentage
};

// Liquidity pool information
const liquidityPools = [
	{
		id: 1,
		name: 'CMUEats/ETH',
		totalLiquidity: '24.5 ETH',
		apr: '12.4%',
		providers: 18,
	},
	{
		id: 2,
		name: 'CMUEats/USDC',
		totalLiquidity: '15,250 USDC',
		apr: '8.2%',
		providers: 12,
	},
];

// Current gas prices
const currentGasPrices = {
	slow: 20,
	average: 35,
	fast: 50,
};

interface NFTProjectProps {
	open: boolean;
	onClose: () => void;
	onBuyClick: (nftId: number) => void;
}

function NFTProject({ open, onClose, onBuyClick }: NFTProjectProps) {
	const [tabValue, setTabValue] = useState(0);
	const [gasOption, setGasOption] = useState('average');

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number,
	) => {
		setTabValue(newValue);
	};

	const getPriceChangeColor = (history: number[]) => {
		if (history.length < 2) return 'var(--text-muted)';
		return history[history.length - 1] >= history[history.length - 2]
			? 'var(--location-closed-text-color)' // Green in April Fools theme
			: 'var(--location-open-text-color)'; // Red in April Fools theme
	};

	const getPriceChangeIcon = (history: number[]) => {
		if (history.length < 2) return null;
		return history[history.length - 1] >= history[history.length - 2] ? (
			<TrendingUpIcon fontSize="small" />
		) : (
			<TrendingDownIcon fontSize="small" />
		);
	};

	const getPriceChangePercentage = (history: number[]) => {
		if (history.length < 2) return '+0%';
		const current = history[history.length - 1];
		const previous = history[history.length - 2];
		const change = ((current - previous) / previous) * 100;
		return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
	};

	const calculateGasFee = (price: number, option: string) => {
		const baseFee = price * 0.03; // 3% base fee
		let multiplier = 1;

		switch (option) {
			case 'slow':
				multiplier = 0.8;
				break;
			case 'fast':
				multiplier = 1.3;
				break;
			default:
				multiplier = 1;
		}

		return (baseFee * multiplier).toFixed(4);
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
						variant="h3"
						component="h1"
						fontWeight="bold"
						gutterBottom
					>
						CMUEats NFT Marketplace
					</Typography>
					<Typography variant="h6" component="p">
						Exclusive digital collectibles for premium CMUEats users
					</Typography>

					{/* 3D Rotating Logo */}
					<Logo3DContainer>
						<RotatingLogo>
							<LogoSide
								sx={{
									transform: 'rotateY(0deg) translateZ(40px)',
									background: 'var(--logo-first-half)',
								}}
							>
								CMU
							</LogoSide>
							<LogoSide
								sx={{
									transform:
										'rotateY(90deg) translateZ(40px)',
									background: 'var(--logo-second-half)',
								}}
							>
								EATS
							</LogoSide>
							<LogoSide
								sx={{
									transform:
										'rotateY(180deg) translateZ(40px)',
									background: 'var(--logo-first-half)',
								}}
							>
								CMU
							</LogoSide>
							<LogoSide
								sx={{
									transform:
										'rotateY(270deg) translateZ(40px)',
									background: 'var(--logo-second-half)',
								}}
							>
								EATS
							</LogoSide>
						</RotatingLogo>
					</Logo3DContainer>
				</HeaderBox>

				<DialogContent>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="inherit"
						sx={{
							borderBottom: 1,
							borderColor: 'var(--card-border-color)',
							mb: 3,
						}}
					>
						<StyledTab label="Marketplace" />
						<StyledTab label="Transactions" />
						<StyledTab label="Liquidity Pools" />
						<StyledTab label="About" />
					</Tabs>

					{tabValue === 0 && (
						<>
							{/* Collection Stats */}
							<StatsBox>
								<StatItem>
									<Typography
										variant="caption"
										color="var(--text-muted)"
									>
										Floor Price
									</Typography>
									<Typography
										variant="subtitle1"
										fontWeight="bold"
									>
										{collectionStats.floorPrice} ETH
									</Typography>
								</StatItem>
								<StatItem>
									<Typography
										variant="caption"
										color="var(--text-muted)"
									>
										Volume
									</Typography>
									<Typography
										variant="subtitle1"
										fontWeight="bold"
									>
										{collectionStats.totalVolume} ETH
									</Typography>
								</StatItem>
								<StatItem>
									<Typography
										variant="caption"
										color="var(--text-muted)"
									>
										Owners
									</Typography>
									<Typography
										variant="subtitle1"
										fontWeight="bold"
									>
										{collectionStats.owners}
									</Typography>
								</StatItem>
								<StatItem>
									<Typography
										variant="caption"
										color="var(--text-muted)"
									>
										Listed
									</Typography>
									<Typography
										variant="subtitle1"
										fontWeight="bold"
									>
										{collectionStats.listed}/
										{collectionStats.totalSupply}
									</Typography>
								</StatItem>
								<StatItem>
									<Typography
										variant="caption"
										color="var(--text-muted)"
									>
										7d Change
									</Typography>
									<Typography
										variant="subtitle1"
										fontWeight="bold"
										sx={{
											color:
												collectionStats.sevenDayChange >=
												0
													? 'var(--location-closed-text-color)'
													: 'var(--location-open-text-color)',
										}}
									>
										{collectionStats.sevenDayChange >= 0
											? '+'
											: ''}
										{collectionStats.sevenDayChange}%
									</Typography>
								</StatItem>
							</StatsBox>

							{/* Gas Price Info */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mb: 2,
									alignItems: 'center',
								}}
							>
								<Typography
									variant="body2"
									color="var(--text-muted)"
								>
									Current Gas Prices (Gwei):
								</Typography>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<Chip
										icon={<LocalGasStationIcon />}
										label={`Slow: ${currentGasPrices.slow}`}
										size="small"
										onClick={() => setGasOption('slow')}
										color={
											gasOption === 'slow'
												? 'primary'
												: 'default'
										}
									/>
									<Chip
										icon={<LocalGasStationIcon />}
										label={`Average: ${currentGasPrices.average}`}
										size="small"
										onClick={() => setGasOption('average')}
										color={
											gasOption === 'average'
												? 'primary'
												: 'default'
										}
									/>
									<Chip
										icon={<LocalGasStationIcon />}
										label={`Fast: ${currentGasPrices.fast}`}
										size="small"
										onClick={() => setGasOption('fast')}
										color={
											gasOption === 'fast'
												? 'primary'
												: 'default'
										}
									/>
								</Box>
							</Box>

							{/* NFT Grid */}
							<Grid container spacing={3}>
								{nftData.map((nft) => (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										key={nft.id}
									>
										<NFTCard>
											<Box sx={{ position: 'relative' }}>
												<CardMedia
													component="img"
													height="200"
													image={nft.image}
													alt={nft.name}
												/>
												<Box
													sx={{
														position: 'absolute',
														top: 8,
														right: 8,
													}}
												>
													<RarityChip
														rarity={nft.rarity}
														label={`${nft.rarity.toUpperCase()} · ${nft.rarityScore}`}
														size="small"
													/>
												</Box>
											</Box>
											<CardContent>
												<Box
													sx={{
														display: 'flex',
														justifyContent:
															'space-between',
														alignItems: 'center',
														mb: 1,
													}}
												>
													<Typography
														variant="h6"
														gutterBottom={false}
													>
														{nft.name}
													</Typography>
													<Tooltip title="Verified Collection">
														<VerifiedIcon
															sx={{
																color: 'var(--location-closed-highlight)',
															}}
														/>
													</Tooltip>
												</Box>
												<Typography
													variant="body2"
													color="var(--text-muted)"
													sx={{
														height: '40px',
														overflow: 'hidden',
														mb: 2,
													}}
												>
													{nft.description}
												</Typography>

												<Box sx={{ mb: 2 }}>
													<Typography
														variant="caption"
														color="var(--text-muted)"
													>
														Last sold for{' '}
														{nft.lastSold}
													</Typography>
													<Box
														sx={{
															display: 'flex',
															alignItems:
																'center',
															gap: 0.5,
															color: getPriceChangeColor(
																nft.priceHistory,
															),
														}}
													>
														{getPriceChangeIcon(
															nft.priceHistory,
														)}
														<Typography
															variant="caption"
															fontWeight="bold"
														>
															{getPriceChangePercentage(
																nft.priceHistory,
															)}
														</Typography>
													</Box>
												</Box>

												<Box
													sx={{
														display: 'flex',
														justifyContent:
															'space-between',
														alignItems: 'center',
													}}
												>
													<Box>
														<PriceTag>
															{nft.price} ETH
														</PriceTag>
														<Box sx={{ mt: 0.5 }}>
															<GasTag>
																<LocalGasStationIcon fontSize="inherit" />
																~
																{calculateGasFee(
																	nft.price,
																	gasOption,
																)}{' '}
																ETH
															</GasTag>
														</Box>
													</Box>
													<Button
														variant="contained"
														color="primary"
														onClick={() =>
															onBuyClick(nft.id)
														}
														sx={{
															background:
																'linear-gradient(45deg, var(--logo-first-half) 30%, var(--logo-second-half) 90%)',
															boxShadow:
																'0 3px 5px 2px rgba(0, 0, 0, .3)',
														}}
													>
														Buy Now
													</Button>
												</Box>
											</CardContent>
										</NFTCard>
									</Grid>
								))}
							</Grid>
						</>
					)}

					{tabValue === 1 && (
						<>
							<Typography variant="h6" gutterBottom>
								Recent Transactions
							</Typography>
							<TableContainer
								component={Paper}
								sx={{
									bgcolor: 'var(--card-header-bg)',
									color: 'var(--text-primary)',
								}}
							>
								<Table sx={{ minWidth: 650 }}>
									<TableHead>
										<TableRow>
											<TableCell
												sx={{
													color: 'var(--text-primary)',
													fontWeight: 'bold',
												}}
											>
												NFT
											</TableCell>
											<TableCell
												sx={{
													color: 'var(--text-primary)',
													fontWeight: 'bold',
												}}
											>
												From
											</TableCell>
											<TableCell
												sx={{
													color: 'var(--text-primary)',
													fontWeight: 'bold',
												}}
											>
												To
											</TableCell>
											<TableCell
												sx={{
													color: 'var(--text-primary)',
													fontWeight: 'bold',
												}}
											>
												Price
											</TableCell>
											<TableCell
												sx={{
													color: 'var(--text-primary)',
													fontWeight: 'bold',
												}}
											>
												Gas Fee
											</TableCell>
											<TableCell
												sx={{
													color: 'var(--text-primary)',
													fontWeight: 'bold',
												}}
											>
												Time
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{transactionData.map((row) => (
											<TableRow
												key={row.id}
												sx={{
													'&:last-child td, &:last-child th':
														{ border: 0 },
												}}
											>
												<TableCell
													component="th"
													scope="row"
													sx={{
														color: 'var(--text-primary)',
													}}
												>
													{row.nft}
												</TableCell>
												<TableCell
													sx={{
														color: 'var(--text-muted)',
													}}
												>
													{row.from}
												</TableCell>
												<TableCell
													sx={{
														color: 'var(--text-muted)',
													}}
												>
													{row.to}
												</TableCell>
												<TableCell
													sx={{
														color: 'var(--location-closed-text-color)',
														fontWeight: 'bold',
													}}
												>
													{row.price} ETH
												</TableCell>
												<TableCell
													sx={{
														color: 'var(--text-muted)',
													}}
												>
													{row.gasFee} ETH
												</TableCell>
												<TableCell
													sx={{
														color: 'var(--text-muted)',
													}}
												>
													{row.time}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</>
					)}

					{tabValue === 2 && (
						<Box sx={{ mb: 4 }}>
							<Typography variant="h6" gutterBottom>
								Liquidity Pools
							</Typography>
							<Typography
								variant="body2"
								color="var(--text-muted)"
								paragraph
							>
								Provide liquidity to earn rewards and trading
								fees. Stake your NFTs or ETH in these pools.
							</Typography>

							<Grid container spacing={3}>
								{liquidityPools.map((pool) => (
									<Grid item xs={12} md={6} key={pool.id}>
										<Card
											sx={{
												bgcolor:
													'var(--card-header-bg)',
												color: 'var(--text-primary)',
											}}
										>
											<CardContent>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 1,
														mb: 2,
													}}
												>
													<PoolIcon />
													<Typography variant="h6">
														{pool.name}
													</Typography>
												</Box>

												<Grid container spacing={2}>
													<Grid item xs={6}>
														<Typography
															variant="caption"
															color="var(--text-muted)"
														>
															Total Liquidity
														</Typography>
														<Typography
															variant="body1"
															fontWeight="bold"
														>
															{
																pool.totalLiquidity
															}
														</Typography>
													</Grid>
													<Grid item xs={6}>
														<Typography
															variant="caption"
															color="var(--text-muted)"
														>
															APR
														</Typography>
														<Typography
															variant="body1"
															fontWeight="bold"
															color="var(--location-closed-text-color)"
														>
															{pool.apr}
														</Typography>
													</Grid>
													<Grid item xs={12}>
														<Typography
															variant="caption"
															color="var(--text-muted)"
														>
															Providers
														</Typography>
														<Typography variant="body1">
															{pool.providers}
														</Typography>
													</Grid>
													<Grid item xs={12}>
														<Button
															fullWidth
															variant="outlined"
															sx={{
																borderColor:
																	'var(--location-closed-text-color)',
																color: 'var(--location-closed-text-color)',
															}}
														>
															Provide Liquidity
														</Button>
													</Grid>
												</Grid>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>

							<Box
								sx={{
									mt: 4,
									p: 3,
									bgcolor: 'var(--card-header-bg)',
									borderRadius: '8px',
								}}
							>
								<Typography variant="h6" gutterBottom>
									Staking Rewards
								</Typography>
								<Typography variant="body2" paragraph>
									Stake your CMUEats NFTs to earn 0.05 ETH per
									day. Current staking pool: 35 NFTs staked.
								</Typography>
								<Box sx={{ mb: 2 }}>
									<Typography
										variant="body2"
										color="var(--text-muted)"
										gutterBottom
									>
										Pool Capacity
									</Typography>
									<LinearProgress
										variant="determinate"
										value={35}
										sx={{
											height: 10,
											borderRadius: 5,
											backgroundColor: 'var(--card-bg)',
											'& .MuiLinearProgress-bar': {
												backgroundColor:
													'var(--location-closed-text-color)',
											},
										}}
									/>
									<Typography
										variant="caption"
										color="var(--text-muted)"
										align="right"
										sx={{ display: 'block', mt: 0.5 }}
									>
										35/100 NFTs
									</Typography>
								</Box>
								<Button
									variant="contained"
									fullWidth
									sx={{
										background:
											'linear-gradient(45deg, var(--logo-first-half) 30%, var(--logo-second-half) 90%)',
									}}
								>
									Stake Your NFTs
								</Button>
							</Box>
						</Box>
					)}

					{tabValue === 3 && (
						<Box sx={{ color: 'var(--text-primary)', p: 2 }}>
							<Typography variant="h5" gutterBottom>
								About CMUEats NFT Collection
							</Typography>
							<Typography paragraph>
								The CMUEats NFT Collection is a limited series
								of exclusive digital collectibles that
								commemorate the unique dining experiences across
								Carnegie Mellon University&apos;s campus.
							</Typography>
							<Typography paragraph>
								Each NFT is a one-of-a-kind digital asset stored
								on the blockchain, representing ownership of a
								unique piece of CMUEats history. Collectors can
								buy, sell, and trade these NFTs, with each
								transaction being recorded on the blockchain.
							</Typography>

							<Box
								sx={{
									mt: 3,
									mb: 3,
									p: 3,
									bgcolor: 'var(--card-header-bg)',
									borderRadius: '8px',
								}}
							>
								<Typography variant="h6" gutterBottom>
									Collection Information
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6} md={3}>
										<Typography
											variant="caption"
											color="var(--text-muted)"
										>
											Contract Address
										</Typography>
										<Typography variant="body2">
											0x7a2E...
										</Typography>
									</Grid>
									<Grid item xs={6} md={3}>
										<Typography
											variant="caption"
											color="var(--text-muted)"
										>
											Token Standard
										</Typography>
										<Typography variant="body2">
											ERC-721
										</Typography>
									</Grid>
									<Grid item xs={6} md={3}>
										<Typography
											variant="caption"
											color="var(--text-muted)"
										>
											Blockchain
										</Typography>
										<Typography variant="body2">
											Ethereum
										</Typography>
									</Grid>
									<Grid item xs={6} md={3}>
										<Typography
											variant="caption"
											color="var(--text-muted)"
										>
											Release Date
										</Typography>
										<Typography variant="body2">
											April 1, 2024
										</Typography>
									</Grid>
								</Grid>
							</Box>

							<Typography paragraph>
								By owning a CMUEats NFT, you gain access to
								premium features on the CMUEats platform,
								including exclusive restaurant recommendations,
								early access to menus, and special dining
								events.
							</Typography>
							<Typography
								paragraph
								fontWeight="bold"
								color="#F87171"
							>
								Note: This is an April Fools&apos; joke. NFTs
								are not actually available for purchase through
								CMUEats.
							</Typography>
						</Box>
					)}
				</DialogContent>
			</Box>
		</StyledDialog>
	);
}

export default NFTProject;
