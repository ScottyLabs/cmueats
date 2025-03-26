import { useState, useEffect } from 'react';
import {
	Switch,
	FormControlLabel,
	Box,
	Typography,
	styled,
	Snackbar,
	Alert,
	Paper,
	Chip,
	Tooltip,
	Badge,
	IconButton,
	LinearProgress,
	Button,
	Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DiamondIcon from '@mui/icons-material/Diamond';
import VerifiedIcon from '@mui/icons-material/Verified';
import CodeIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CasinoIcon from '@mui/icons-material/Casino';
import { useTheme } from '../ThemeProvider';
import { IS_APRIL_FOOLS } from '../util/constants';
import BonziBuddy from './BonziBuddy';
import NFTProject from './NFTProject';
import MicrotransactionPaywall from './MicrotransactionPaywall';
import CasinoGame from './CasinoGame';

// Define Theme type to match what's defined in ThemeProvider
type Theme = 'none' | 'miku' | 'april-fools';

// Transaction type
interface Transaction {
	id: number;
	type: string;
	nftId: number;
	status: string;
	hash: string;
	gasEstimate: string;
	timestamp: string;
}

// Smart contract state type - expanded with more fields
interface SmartContractState {
	totalMinted: number;
	maxSupply: number;
	mintPrice: number;
	paused: boolean;
	whitelistActive: boolean;
	publicSaleActive: boolean;
	ownerAddress: string;
	userBalance?: number;
	userAddress?: string;
	isWhitelisted?: boolean;
	lastMintTimestamp?: number;
	totalSales?: number;
	royaltyPercentage?: number;
	userNFTs?: UserNFT[];
	networkFee?: number;
}

// User's NFT type
interface UserNFT {
	id: number;
	name: string;
	rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
	image: string;
	acquiredAt: string;
	lastValue: number;
	appreciationPercentage: number;
}

// Mock blockchain data - moved to component state to avoid mutations
const initialBlockchainData = {
	currentGasPrice: 35, // in Gwei
	networkCongestion: 'Medium',
	contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
	chainId: 1, // Ethereum Mainnet
	lastBlock: 19284721,
	gasUsed: '68%',
};

// Styled components for the toggle switch
const StyledToggleBox = styled(Box)({
	position: 'fixed',
	bottom: '15px',
	right: '20px',
	zIndex: 10000,
	backgroundColor: 'rgba(34, 34, 36, 0.95)',
	backdropFilter: 'blur(4px)',
	padding: '4px 8px',
	borderRadius: '8px',
	boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
	border: '1px solid var(--card-border-color)',
	display: 'flex',
	alignItems: 'center',
	opacity: 0.95,
	pointerEvents: 'auto',
	transition: 'all 0.3s ease',
	transform: 'translateZ(0)', // Force hardware acceleration
	'&:hover': {
		transform: 'translateY(-2px) translateZ(0)',
		boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
		opacity: 1,
	},
});

const StyledSwitch = styled(Switch)({
	'& .MuiSwitch-switchBase.Mui-checked': {
		color: 'var(--logo-second-half)',
		'&:hover': {
			backgroundColor: 'rgba(213, 51, 105, 0.08)',
		},
	},
	'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
		backgroundColor: 'var(--logo-first-half)',
	},
	'& .MuiSwitch-track': {
		height: 14,
	},
	'& .MuiSwitch-thumb': {
		width: 16,
		height: 16,
	},
	padding: 7,
});

// Premium greeting banner component
const PremiumBanner = styled(Box)({
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	width: '100%',
	zIndex: 9998,
	backgroundColor: 'var(--logo-second-half)',
	color: 'white',
	padding: '8px 0', // Reduced slightly
	textAlign: 'center',
	fontWeight: 'bold',
	boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
	animation: 'fadeIn 0.5s ease',
	'@keyframes fadeIn': {
		'0%': {
			opacity: 0,
		},
		'100%': {
			opacity: 1,
		},
	},
});

// NFT Features UI components
const NFTStatusBar = styled(Paper, {
	shouldForwardProp: (prop) => prop !== 'minimized',
})<{ minimized?: boolean }>(({ minimized }) => {
	// Helper function to determine max height
	const getMaxHeight = () => {
		if (minimized === true) return '32px';
		if (minimized === undefined) return '140px';
		return '460px';
	};

	return {
		position: 'fixed',
		top: '42px', // Moved higher than before
		right: '20px',
		zIndex: 9997,
		backgroundColor: 'var(--card-bg)',
		padding: minimized ? '5px 8px' : '6px 8px',
		borderRadius: '10px',
		boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
		border: '1px solid var(--card-border-color)',
		display: 'flex',
		flexDirection: 'column',
		gap: minimized ? '0' : '4px',
		maxWidth: minimized ? '150px' : '320px',
		maxHeight: getMaxHeight(),
		overflow: 'hidden',
		transition: 'all 0.3s ease',
		transform: 'translateZ(0)', // Force hardware acceleration
		'&:hover': {
			transform: 'translateY(-5px) translateZ(0)',
			boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
		},
		'@media (max-width: 768px)': {
			maxWidth: minimized ? '150px' : '300px',
			right: '10px',
		},
	};
});

const GasPrice = styled(Chip)(({ congestion }: { congestion: string }) => {
	let color = '#10B981'; // green for low
	if (congestion === 'Medium') {
		color = '#F59E0B'; // amber
	} else if (congestion === 'High') {
		color = '#EF4444'; // red
	}
	return {
		backgroundColor: color,
		color: 'white',
		fontWeight: 'bold',
		'& .MuiChip-icon': {
			color: 'white',
		},
	};
});

const WalletButton = styled(IconButton)({
	backgroundColor: 'var(--logo-first-half)',
	color: 'white',
	padding: '4px', // Smaller button
	'&:hover': {
		backgroundColor: 'var(--logo-second-half)',
	},
});

// Portfolio overview component styles
const RarityBadge = styled(Chip)<{ rarity: string }>(({ rarity }) => {
	const rarityColors = {
		common: '#6B7280',
		uncommon: '#10B981',
		rare: '#3B82F6',
		epic: '#8B5CF6',
		legendary: '#F59E0B',
	};

	const color =
		rarityColors[rarity as keyof typeof rarityColors] || '#6B7280';

	return {
		backgroundColor: color,
		color: 'white',
		fontSize: '0.65rem',
		height: '20px',
		fontWeight: 'bold',
	};
});

const SmartContractPanel = styled(Box)({
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	padding: '8px',
	borderRadius: '6px',
	border: '1px solid var(--card-border-color)',
	fontSize: '0.75rem',
	fontFamily: 'monospace',
	color: '#10B981',
	marginTop: '6px',
});

const StatsItem = styled(Box)({
	display: 'flex',
	justifyContent: 'space-between',
	fontSize: '0.75rem',
	padding: '2px 0',
});

// April Fools toggle switch component
function AprilFoolsToggle({
	isEnabled,
	onToggle,
}: {
	isEnabled: boolean;
	onToggle: () => void;
}) {
	return (
		<StyledToggleBox>
			<FormControlLabel
				control={
					<StyledSwitch
						checked={isEnabled}
						onChange={onToggle}
						color="primary"
						size="small"
					/>
				}
				label={
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography
							variant="body2"
							fontWeight="bold"
							color="var(--text-primary)"
							sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
						>
							April Fools Mode
						</Typography>
						<Typography
							variant="caption"
							color="var(--text-muted)"
							sx={{ fontSize: '0.65rem', lineHeight: 1.1 }}
						>
							{isEnabled ? 'ON' : 'OFF'}
						</Typography>
					</Box>
				}
				sx={{ margin: 0 }}
			/>
		</StyledToggleBox>
	);
}

// NFT Marketplace UI Status Bar Component
function NFTStatusBarComponent({
	blockchainData,
	walletConnected,
	pendingTransactions,
	onConnectWallet,
	contractState,
	onOpenCasino,
}: {
	blockchainData: typeof initialBlockchainData;
	walletConnected: boolean;
	pendingTransactions: Transaction[];
	onConnectWallet: () => void;
	contractState: SmartContractState;
	onOpenCasino: () => void;
}) {
	const [minimized, setMinimized] = useState<boolean | undefined>(true);
	const [activeTab, setActiveTab] = useState<
		'dashboard' | 'portfolio' | 'contract'
	>('dashboard');

	const toggleMinimize = () => {
		setMinimized((prev) => {
			if (prev === undefined) return true;
			return !prev;
		});
	};

	const pendingCount = pendingTransactions.filter(
		(tx) => tx.status === 'pending',
	).length;

	const renderTabContent = () => {
		switch (activeTab) {
			case 'portfolio':
				return (
					<Box sx={{ mt: 1 }}>
						<Typography
							variant="subtitle2"
							fontWeight="bold"
							sx={{ mb: 0.5, fontSize: '0.8rem' }}
						>
							Your NFT Portfolio{' '}
							{contractState.userNFTs &&
								`(${contractState.userNFTs.length})`}
						</Typography>

						{contractState.userNFTs &&
						contractState.userNFTs.length > 0 ? (
							<>
								<Box
									sx={{
										maxHeight: '260px',
										overflowY: 'auto',
										pr: 0.5,
										mr: -0.5,
									}}
								>
									{contractState.userNFTs.map((nft) => (
										<Box
											key={nft.id}
											sx={{
												display: 'flex',
												alignItems: 'center',
												p: 1,
												mb: 1,
												borderRadius: '6px',
												backgroundColor:
													'rgba(0, 0, 0, 0.2)',
												border: '1px solid rgba(255, 255, 255, 0.1)',
											}}
										>
											<Box
												sx={{
													width: '30px',
													height: '30px',
													borderRadius: '4px',
													bgcolor: 'gray',
													mr: 1,
													overflow: 'hidden',
												}}
											>
												{/* NFT Image would go here */}
											</Box>
											<Box sx={{ flexGrow: 1 }}>
												<Typography
													variant="caption"
													sx={{
														display: 'block',
														fontWeight: 'bold',
														lineHeight: 1.2,
													}}
												>
													{nft.name}
												</Typography>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 0.5,
													}}
												>
													<RarityBadge
														label={
															nft.rarity
																.charAt(0)
																.toUpperCase() +
															nft.rarity.slice(1)
														}
														rarity={nft.rarity}
														size="small"
													/>
													<Typography
														variant="caption"
														color="var(--text-muted)"
														sx={{
															fontSize: '0.6rem',
														}}
													>
														{nft.acquiredAt}
													</Typography>
												</Box>
											</Box>
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-end',
												}}
											>
												<Typography
													variant="caption"
													sx={{
														fontWeight: 'bold',
														color: 'white',
													}}
												>
													{nft.lastValue} ETH
												</Typography>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
													}}
												>
													{nft.appreciationPercentage >=
													0 ? (
														<TrendingUpIcon
															sx={{
																fontSize:
																	'0.75rem',
																color: '#10B981',
															}}
														/>
													) : (
														<TrendingDownIcon
															sx={{
																fontSize:
																	'0.75rem',
																color: '#EF4444',
															}}
														/>
													)}
													<Typography
														variant="caption"
														sx={{
															fontSize: '0.6rem',
															color:
																nft.appreciationPercentage >=
																0
																	? '#10B981'
																	: '#EF4444',
														}}
													>
														{Math.abs(
															nft.appreciationPercentage,
														)}
														%
													</Typography>
												</Box>
											</Box>
										</Box>
									))}
								</Box>
								<Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
									<Button
										size="small"
										variant="outlined"
										sx={{
											fontSize: '0.7rem',
											borderColor:
												'var(--logo-first-half)',
											color: 'var(--text-primary)',
										}}
										fullWidth
									>
										View All NFTs
									</Button>
									<Button
										size="small"
										variant="contained"
										startIcon={<CasinoIcon />}
										onClick={(e) => {
											e.stopPropagation();
											onOpenCasino();
										}}
										sx={{
											fontSize: '0.7rem',
											bgcolor: '#D30000',
											color: 'white',
											'&:hover': {
												bgcolor: '#FF0000',
											},
										}}
									>
										Casino
									</Button>
								</Box>
							</>
						) : (
							<Box sx={{ textAlign: 'center', py: 1 }}>
								<Typography
									variant="caption"
									color="var(--text-muted)"
								>
									No NFTs in your portfolio yet
								</Typography>
								<Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
									<Button
										size="small"
										variant="contained"
										sx={{
											fontSize: '0.7rem',
											bgcolor: 'var(--logo-first-half)',
											'&:hover': {
												bgcolor:
													'var(--logo-second-half)',
											},
										}}
										fullWidth
									>
										Browse Marketplace
									</Button>
									<Button
										size="small"
										variant="contained"
										startIcon={<CasinoIcon />}
										onClick={(e) => {
											e.stopPropagation();
											onOpenCasino();
										}}
										sx={{
											fontSize: '0.7rem',
											bgcolor: '#D30000',
											color: 'white',
											'&:hover': {
												bgcolor: '#FF0000',
											},
										}}
									>
										Casino
									</Button>
								</Box>
							</Box>
						)}
					</Box>
				);
			case 'contract':
				return (
					<Box sx={{ mt: 1 }}>
						<Typography
							variant="subtitle2"
							fontWeight="bold"
							sx={{ mb: 0.5, fontSize: '0.8rem' }}
						>
							Smart Contract{' '}
							<VerifiedIcon
								sx={{
									fontSize: '0.8rem',
									color: 'var(--location-closed-text-color)',
									ml: 0.5,
								}}
							/>
						</Typography>

						<SmartContractPanel>
							<Typography
								component="div"
								variant="caption"
								sx={{
									fontFamily: 'monospace',
									whiteSpace: 'nowrap',
								}}
							>
								0x742d35Cc6634C0532...
							</Typography>

							<Box sx={{ mt: 0.5, fontSize: '0.7rem' }}>
								{`contract CMUEatsNFT is ERC721, Ownable {`}
								<br />
								{`  uint256 public mintPrice = ${contractState.mintPrice} ether;`}
								<br />
								{`  bool public paused = ${contractState.paused};`}
								<br />
								{`  ... function mint() external payable {`}
								<br />
								{`  ... }`}
							</Box>
						</SmartContractPanel>

						<Box sx={{ mt: 1.5 }}>
							<Typography
								variant="caption"
								fontWeight="bold"
								sx={{ fontSize: '0.75rem' }}
							>
								Contract Functions
							</Typography>
							<Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
								<Button
									size="small"
									variant="outlined"
									sx={{
										fontSize: '0.65rem',
										p: '2px 8px',
										borderColor: 'var(--logo-first-half)',
										color: 'var(--text-primary)',
									}}
								>
									mint()
								</Button>
								<Button
									size="small"
									variant="outlined"
									sx={{
										fontSize: '0.65rem',
										p: '2px 8px',
										borderColor: 'var(--text-muted)',
										color: 'var(--text-muted)',
									}}
								>
									approve()
								</Button>
								<Button
									size="small"
									variant="outlined"
									sx={{
										fontSize: '0.65rem',
										p: '2px 8px',
										borderColor: 'var(--text-muted)',
										color: 'var(--text-muted)',
									}}
								>
									stake()
								</Button>
							</Box>
						</Box>

						<Divider sx={{ mt: 1, mb: 1 }} />

						<StatsItem>
							<Typography
								variant="caption"
								color="var(--text-muted)"
							>
								Gas Used:
							</Typography>
							<Typography variant="caption" fontWeight="bold">
								{blockchainData.gasUsed}
							</Typography>
						</StatsItem>
						<StatsItem>
							<Typography
								variant="caption"
								color="var(--text-muted)"
							>
								Network Fee:
							</Typography>
							<Typography variant="caption" fontWeight="bold">
								{contractState.networkFee} ETH
							</Typography>
						</StatsItem>
						<StatsItem>
							<Typography
								variant="caption"
								color="var(--text-muted)"
							>
								Royalty:
							</Typography>
							<Typography variant="caption" fontWeight="bold">
								{contractState.royaltyPercentage}%
							</Typography>
						</StatsItem>
					</Box>
				);
			default: // dashboard
				return (
					<>
						{/* More compact stats display */}
						<Box
							sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}
						>
							<GasPrice
								icon={<LocalGasStationIcon />}
								label={`${blockchainData.currentGasPrice} Gwei`}
								size="small"
								congestion={blockchainData.networkCongestion}
							/>

							<Tooltip title="Block Number">
								<Chip
									label={`#${blockchainData.lastBlock}`}
									size="small"
									color="primary"
									variant="outlined"
								/>
							</Tooltip>
						</Box>

						<Box
							sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}
						>
							<Tooltip title="Network Load">
								<Chip
									icon={<TrendingUpIcon />}
									label={blockchainData.gasUsed}
									size="small"
									color="secondary"
									variant="outlined"
								/>
							</Tooltip>

							<Tooltip title="Pending Transactions">
								<Badge
									badgeContent={pendingCount}
									color="error"
								>
									<Chip
										icon={<NotificationsIcon />}
										label="Transactions"
										size="small"
										variant="outlined"
									/>
								</Badge>
							</Tooltip>
						</Box>

						{walletConnected && (
							<>
								<Typography
									variant="caption"
									color="var(--location-closed-text-color)"
									noWrap
								>
									Wallet connected:{' '}
									{pendingCount > 0
										? 'Transaction pending...'
										: 'Ready to mint'}
								</Typography>

								<Box sx={{ mt: 1 }}>
									<Typography
										variant="caption"
										sx={{ display: 'block', mb: 0.5 }}
									>
										Collection Progress
									</Typography>
									<LinearProgress
										variant="determinate"
										value={
											(contractState.totalMinted /
												contractState.maxSupply) *
											100
										}
										sx={{
											height: 8,
											borderRadius: 1,
											backgroundColor: 'rgba(0,0,0,0.1)',
											'& .MuiLinearProgress-bar': {
												backgroundColor:
													'var(--logo-first-half)',
											},
										}}
									/>
									<Typography
										variant="caption"
										color="var(--text-muted)"
										sx={{
											display: 'block',
											mt: 0.5,
											textAlign: 'right',
										}}
									>
										{contractState.totalMinted}/
										{contractState.maxSupply} Minted
									</Typography>
								</Box>
							</>
						)}
					</>
				);
		}
	};

	return (
		<NFTStatusBar minimized={minimized}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					cursor: 'pointer',
				}}
				onClick={toggleMinimize}
			>
				<Typography
					variant="subtitle2"
					color="var(--text-primary)"
					noWrap
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						fontSize: minimized ? '0.75rem' : '0.875rem',
					}}
				>
					{minimized ? (
						<>
							<Chip
								size="small"
								label={`${blockchainData.currentGasPrice}G`}
								color="primary"
								sx={{ height: 20, fontSize: '0.65rem' }}
							/>
							NFT {pendingCount > 0 && '⚡'}{' '}
							{minimized ? '▼' : '▲'}
						</>
					) : (
						<>NFT Dashboard {minimized ? '▼' : '▲'}</>
					)}
				</Typography>

				{!minimized && (
					<Tooltip
						title={
							walletConnected
								? 'Wallet Connected'
								: 'Connect Wallet'
						}
					>
						<WalletButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								onConnectWallet();
							}}
						>
							<AccountBalanceWalletIcon fontSize="small" />
						</WalletButton>
					</Tooltip>
				)}
			</Box>

			{!minimized && (
				<>
					{!minimized && minimized !== undefined && (
						<Box
							sx={{ display: 'flex', gap: 0.5, mt: 0.5, mb: 0.5 }}
						>
							<Chip
								icon={
									<BarChartIcon
										sx={{ fontSize: '0.875rem' }}
									/>
								}
								label="Dashboard"
								size="small"
								variant={
									activeTab === 'dashboard'
										? 'filled'
										: 'outlined'
								}
								color={
									activeTab === 'dashboard'
										? 'primary'
										: 'default'
								}
								onClick={(e) => {
									e.stopPropagation();
									setActiveTab('dashboard');
								}}
								sx={{ fontSize: '0.7rem' }}
							/>
							<Chip
								icon={
									<AccountBalanceIcon
										sx={{ fontSize: '0.875rem' }}
									/>
								}
								label="Portfolio"
								size="small"
								variant={
									activeTab === 'portfolio'
										? 'filled'
										: 'outlined'
								}
								color={
									activeTab === 'portfolio'
										? 'primary'
										: 'default'
								}
								onClick={(e) => {
									e.stopPropagation();
									setActiveTab('portfolio');
								}}
								sx={{ fontSize: '0.7rem' }}
							/>
							<Chip
								icon={
									<CodeIcon sx={{ fontSize: '0.875rem' }} />
								}
								label="Contract"
								size="small"
								variant={
									activeTab === 'contract'
										? 'filled'
										: 'outlined'
								}
								color={
									activeTab === 'contract'
										? 'primary'
										: 'default'
								}
								onClick={(e) => {
									e.stopPropagation();
									setActiveTab('contract');
								}}
								sx={{ fontSize: '0.7rem' }}
							/>
						</Box>
					)}

					{renderTabContent()}
				</>
			)}
		</NFTStatusBar>
	);
}

// The main component to manage all April Fools features
function AprilFoolsManager() {
	const { theme, updateTheme } = useTheme();
	const [viewCount, setViewCount] = useState(0);
	const [showPaywall, setShowPaywall] = useState(false);
	const [showNFTProject, setShowNFTProject] = useState(false);
	const [showPremiumBanner, setShowPremiumBanner] = useState(true);
	const [hasSubscribed, setHasSubscribed] = useState(false);
	const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
	const [isAprilFoolsModeEnabled, setIsAprilFoolsModeEnabled] =
		useState(true);
	const [smartContractState, setSmartContractState] =
		useState<SmartContractState>({
			totalMinted: 42,
			maxSupply: 100,
			mintPrice: 0.15,
			paused: false,
			whitelistActive: true,
			publicSaleActive: false,
			ownerAddress: '0x123...456',
			royaltyPercentage: 5.0,
			totalSales: 25.42,
			networkFee: 0.002,
			userNFTs: [
				{
					id: 42,
					name: 'CMUEats Genesis #42',
					rarity: 'epic',
					image: 'https://placeholder.com/400',
					acquiredAt: '2 days ago',
					lastValue: 0.85,
					appreciationPercentage: 27.5,
				},
				{
					id: 107,
					name: 'Campus Collection #107',
					rarity: 'rare',
					image: 'https://placeholder.com/400',
					acquiredAt: '5 days ago',
					lastValue: 0.32,
					appreciationPercentage: -3.8,
				},
			],
		});
	const [pendingTransactions, setPendingTransactions] = useState<
		Transaction[]
	>([]);
	const [walletConnected, setWalletConnected] = useState(false);
	const [originalTheme, setOriginalTheme] = useState<Theme>(
		theme === 'april-fools' ? 'none' : theme,
	);
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [casinoDialogOpen, setCasinoDialogOpen] = useState(false);

	// Display welcome notification
	useEffect(() => {
		if (IS_APRIL_FOOLS) {
			setNotificationMessage(
				'Welcome to the exclusive NFT marketplace! 🎉',
			);
			setShowNotification(true);
		}
	}, []);

	// Simulate wallet connection
	const simulateWalletConnection = () => {
		if (walletConnected) return;

		// Show connecting notification
		setNotificationMessage('Connecting to wallet...');
		setShowNotification(true);

		// Simulate a wallet connecting after a short delay
		setTimeout(() => {
			setWalletConnected(true);
			// Also simulate a small amount of ETH in the wallet
			setSmartContractState((prev) => ({
				...prev,
				userBalance: 0.42,
				userAddress: '0x742...3F1a',
				isWhitelisted: Math.random() > 0.5,
			}));

			// Update notification
			setNotificationMessage(
				'Wallet connected successfully! 0.42 ETH available',
			);
			setShowNotification(true);
		}, 1500);
	};

	// Increment view count and show paywall after a certain number of views
	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;

		if (IS_APRIL_FOOLS && isAprilFoolsModeEnabled && !hasSubscribed) {
			timer = setTimeout(() => {
				setViewCount((prev) => prev + 1);

				// Show paywall after viewing 3 restaurants
				if (viewCount === 2) {
					setShowPaywall(true);
				}
			}, 30000); // Every 30 seconds
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [viewCount, hasSubscribed, isAprilFoolsModeEnabled]);

	// Simulate fluctuating gas prices
	useEffect(() => {
		if (!IS_APRIL_FOOLS || !showNFTProject || !isAprilFoolsModeEnabled)
			return;

		const gasPriceTimer = setInterval(() => {
			// Randomly fluctuate gas price for realism
			const fluctuation = Math.random() > 0.5 ? 1 : -1;
			const changeAmount = Math.floor(Math.random() * 5) + 1;

			// Update blockchain data state
			setBlockchainData((prev) => {
				const newGasPrice = Math.max(
					10,
					prev.currentGasPrice + fluctuation * changeAmount,
				);
				let congestion = prev.networkCongestion;

				if (newGasPrice < 20) {
					congestion = 'Low';
				} else if (newGasPrice < 50) {
					congestion = 'Medium';
				} else {
					congestion = 'High';
				}

				// Increment block number occasionally
				const newBlockNumber =
					Math.random() > 0.7 ? prev.lastBlock + 1 : prev.lastBlock;

				return {
					...prev,
					currentGasPrice: newGasPrice,
					networkCongestion: congestion,
					lastBlock: newBlockNumber,
				};
			});

			// Force a re-render by updating smart contract state slightly
			setSmartContractState((prev) => ({
				...prev,
				mintPrice: Number(
					(prev.mintPrice + (Math.random() * 0.001 - 0.0005)).toFixed(
						3,
					),
				),
			}));
		}, 5000); // Update every 5 seconds

		// eslint-disable-next-line consistent-return
		return () => {
			clearInterval(gasPriceTimer);
		};
	}, [showNFTProject, isAprilFoolsModeEnabled]);

	// Handle completing payment in the paywall
	const handlePaymentComplete = () => {
		setHasSubscribed(true);
		setShowPaywall(false);

		// Show successful payment notification
		setNotificationMessage(
			'Payment successful! You now have CMUEats Premium access',
		);
		setShowNotification(true);
	};

	// Handle clicking subscribe in the Bonzi component
	const handleBonziSubscribeClick = () => {
		setShowNFTProject(true);
		simulateWalletConnection();
	};

	// Handle buying an NFT
	const handleBuyNFT = (nftId: number) => {
		if (!walletConnected) {
			simulateWalletConnection();
			return;
		}

		// Create a fake pending transaction
		const newTransaction: Transaction = {
			id: Date.now(),
			type: 'Purchase',
			nftId,
			status: 'pending',
			hash: `0x${Math.random().toString(16).substring(2, 14)}...${Math.random().toString(16).substring(2, 6)}`,
			gasEstimate: (blockchainData.currentGasPrice * 0.000021).toFixed(5),
			timestamp: new Date().toISOString(),
		};

		// Show transaction notification
		setNotificationMessage(`Transaction initiated: ${newTransaction.hash}`);
		setShowNotification(true);

		setPendingTransactions([newTransaction, ...pendingTransactions]);

		// Simulate transaction confirmation after a delay
		setTimeout(
			() => {
				setPendingTransactions((prev) =>
					prev.map((tx) =>
						tx.id === newTransaction.id
							? { ...tx, status: 'confirmed' }
							: tx,
					),
				);

				// Increment total minted
				setSmartContractState((prev) => ({
					...prev,
					totalMinted: prev.totalMinted + 1,
				}));

				// Show confirmation notification
				setNotificationMessage(
					`Transaction confirmed: NFT #${nftId} purchased!`,
				);
				setShowNotification(true);

				// Show paywall for payment
				setShowPaywall(true);
			},
			3000 + Math.random() * 4000,
		); // Random confirmation time
	};

	// Update the console with blockchain data
	useEffect(() => {
		if (showNFTProject && process.env.NODE_ENV === 'development') {
			// Only log in development environment
			// eslint-disable-next-line no-console
			console.log('Smart Contract State:', smartContractState);
			// eslint-disable-next-line no-console
			console.log('Blockchain Data:', blockchainData);
			// eslint-disable-next-line no-console
			console.log('Pending Transactions:', pendingTransactions);
		}
	}, [
		showNFTProject,
		smartContractState,
		blockchainData,
		pendingTransactions,
	]);

	// Store the original theme when first loaded
	useEffect(() => {
		if (theme !== 'april-fools') {
			setOriginalTheme(theme);
		}
	}, [theme]);

	// Handle April Fools toggle
	const handleAprilFoolsToggle = () => {
		setIsAprilFoolsModeEnabled((prev) => !prev);

		// Toggle theme between April Fools and normal
		if (isAprilFoolsModeEnabled) {
			// Turning OFF April Fools mode - restore original theme
			updateTheme(originalTheme);

			// Reset April Fools features
			setShowPaywall(false);
			setShowNFTProject(false);
			setShowPremiumBanner(false);
		} else {
			// Turning ON April Fools mode
			updateTheme('april-fools');
			setShowPremiumBanner(true);
		}
	};

	// Handle notification close
	const handleNotificationClose = () => {
		setShowNotification(false);
	};

	if (!IS_APRIL_FOOLS) return null;

	return (
		<Box sx={{ width: '100%', position: 'relative' }}>
			{/* Premium subscription banner */}
			{showPremiumBanner && (
				<PremiumBanner>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
						}}
					>
						<DiamondIcon fontSize="small" />
						Welcome to CMUEats Premium!
						<DiamondIcon fontSize="small" />
					</Box>
				</PremiumBanner>
			)}

			{/* Add spacing for content below the banner */}
			<Box sx={{ paddingTop: '34px' }} />

			{/* Notifications */}
			<Snackbar
				open={showNotification}
				autoHideDuration={4000}
				onClose={handleNotificationClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				sx={{ marginTop: '45px' }} // Adjusted to avoid overlap with banner
			>
				<Alert
					onClose={handleNotificationClose}
					severity="success"
					sx={{ width: '100%' }}
				>
					{notificationMessage}
				</Alert>
			</Snackbar>

			{/* Always render the toggle separately from the main layout */}
			<AprilFoolsToggle
				isEnabled={isAprilFoolsModeEnabled}
				onToggle={handleAprilFoolsToggle}
			/>

			{isAprilFoolsModeEnabled && theme === 'april-fools' && (
				<>
					{/* NFT Status Bar */}
					<NFTStatusBarComponent
						blockchainData={blockchainData}
						walletConnected={walletConnected}
						pendingTransactions={pendingTransactions}
						onConnectWallet={simulateWalletConnection}
						contractState={smartContractState}
						onOpenCasino={() => setCasinoDialogOpen(true)}
					/>

					{/* NFT Marketplace Button */}
					<BonziBuddy
						onSubscribeClick={handleBonziSubscribeClick}
						subscribed={hasSubscribed}
					/>

					{/* NFT Marketplace */}
					<NFTProject
						open={showNFTProject}
						onClose={() => setShowNFTProject(false)}
						onBuyClick={handleBuyNFT}
					/>

					{/* Microtransaction Paywall */}
					<MicrotransactionPaywall
						open={showPaywall}
						onClose={() => setShowPaywall(false)}
						onPaymentComplete={handlePaymentComplete}
					/>

					{/* Casino Game */}
					<CasinoGame
						open={casinoDialogOpen}
						onClose={() => setCasinoDialogOpen(false)}
					/>
				</>
			)}
		</Box>
	);
}

export default AprilFoolsManager;
