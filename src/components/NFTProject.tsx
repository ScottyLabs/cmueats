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
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	FormHelperText,
	Slider,
	Switch,
	FormControlLabel,
	Snackbar,
	Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PoolIcon from '@mui/icons-material/Pool';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningIcon from '@mui/icons-material/Warning';
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

// New styles for the contract creation tab
const CodeEditorBox = styled(Box)({
	backgroundColor: '#1E1E1E',
	color: '#D4D4D4',
	fontFamily: 'monospace',
	borderRadius: '4px',
	padding: '16px',
	overflowX: 'auto',
	minHeight: '300px',
	maxHeight: '500px',
	overflowY: 'auto',
	fontSize: '14px',
	lineHeight: 1.5,
	whiteSpace: 'pre',
	border: '1px solid #333',
});

const EditorTextField = styled(TextField)({
	'& .MuiInputBase-root': {
		height: 'auto',
		display: 'flex',
	},
	'& .MuiOutlinedInput-root': {
		backgroundColor: '#1E1E2D', // Darker background for better contrast
		color: '#D4D4D4',
		fontFamily: 'Consolas, Monaco, "Courier New", monospace', // Better coding fonts
		fontSize: '14px',
		lineHeight: 1.6,
		'& fieldset': {
			borderColor: 'transparent',
		},
		'&:hover fieldset': {
			borderColor: 'transparent',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'transparent',
			borderWidth: 0,
		},
	},
	'& .MuiOutlinedInput-input': {
		padding: '16px',
		minHeight: '380px', // Adjust to match container
		whiteSpace: 'pre',
		letterSpacing: 0.5,
		width: '100%',
	},
});

const ParameterCard = styled(Card)({
	backgroundColor: 'var(--card-header-bg)',
	color: 'var(--text-primary)',
	borderRadius: '8px',
	border: '1px solid var(--card-border-color)',
	marginBottom: '16px',
});

const SyntaxHighlight = styled('span')(({ type }: { type: string }) => {
	let color = '#D4D4D4'; // default text color

	switch (type) {
		case 'keyword':
			color = '#569CD6'; // blue for keywords
			break;
		case 'function':
			color = '#DCDCAA'; // yellow for functions
			break;
		case 'type':
			color = '#4EC9B0'; // teal for types
			break;
		case 'comment':
			color = '#608B4E'; // green for comments
			break;
		case 'string':
			color = '#CE9178'; // orange for strings
			break;
		case 'number':
			color = '#B5CEA8'; // light green for numbers
			break;
		case 'variable':
			color = '#9CDCFE'; // light blue for variables
			break;
		default:
			color = '#D4D4D4';
	}

	return {
		color,
		fontFamily: 'monospace',
	};
});

const DeployButton = styled(Button)({
	background:
		'linear-gradient(45deg, var(--logo-first-half) 30%, var(--logo-second-half) 90%)',
	borderRadius: '8px',
	padding: '10px 20px',
	color: 'white',
	fontWeight: 'bold',
	boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
	'&:hover': {
		background:
			'linear-gradient(45deg, var(--logo-first-half) 20%, var(--logo-second-half) 80%)',
		boxShadow: '0 4px 8px 3px rgba(0, 0, 0, .4)',
	},
});

const GasEstimateChip = styled(Chip)({
	backgroundColor: 'var(--card-header-bg)',
	border: '1px solid var(--location-open-text-color)',
	color: 'var(--text-primary)',
	fontWeight: 'bold',
	'& .MuiChip-icon': {
		color: 'var(--location-open-text-color)',
	},
});

// Add styled component for utility badges
const UtilityBadge = styled(Box)({
	backgroundColor: 'rgba(138, 75, 175, 0.1)',
	border: '1px dashed #8A4BAF',
	color: '#8A4BAF',
	padding: '4px 8px',
	borderRadius: '4px',
	fontSize: '0.7rem',
	margin: '4px 0',
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
	fontWeight: 'bold',
});

// Sample template code for different contract types
const contractTemplates = {
	erc721: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CMUEatsNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    uint256 public mintPrice = 0.15 ether;
    uint256 public maxSupply = 100;
    bool public paused = false;
    string public baseUri;
    
    constructor(string memory _name, string memory _symbol, string memory _baseUri) ERC721(_name, _symbol) {
        baseUri = _baseUri;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }
    
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
    
    function safeMint(address to) public payable {
        require(!paused, "Minting is paused");
        require(msg.value >= mintPrice, "Not enough ETH sent");
        require(totalSupply() < maxSupply, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
    
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
    
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Override required functions
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`,
	erc1155: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract CMUEatsMultiToken is ERC1155, Ownable, ERC1155Supply {
    string public name;
    string public symbol;
    
    uint256 public mintPrice = 0.05 ether;
    bool public paused = false;
    
    // Token types
    uint256 public constant COMMON = 0;
    uint256 public constant RARE = 1;
    uint256 public constant LEGENDARY = 2;
    
    mapping(uint256 => uint256) public maxSupply;
    
    constructor(string memory _name, string memory _symbol, string memory _uri) ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
        
        // Set max supply for each token type
        maxSupply[COMMON] = 100;
        maxSupply[RARE] = 50;
        maxSupply[LEGENDARY] = 10;
    }
    
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
    
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
    
    function mint(address account, uint256 id, uint256 amount)
        public
        payable
    {
        require(!paused, "Minting is paused");
        require(id <= LEGENDARY, "Token type does not exist");
        require(msg.value >= mintPrice * amount, "Not enough ETH sent");
        require(totalSupply(id) + amount <= maxSupply[id], "Max supply reached for this token type");
        
        _mint(account, id, amount, "");
    }
    
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
    
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Override required functions
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}`,
	marketplace: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CMUEatsMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 price;
        bool active;
    }
    
    // Platform fee percentage (2.5%)
    uint256 public feePercentage = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Mapping from listing ID to listing information
    mapping(uint256 => Listing) public listings;
    uint256 private _listingIdCounter;
    
    event ItemListed(uint256 listingId, address tokenAddress, uint256 tokenId, uint256 price, address seller);
    event ItemSold(uint256 listingId, address tokenAddress, uint256 tokenId, uint256 price, address seller, address buyer);
    event ItemCanceled(uint256 listingId);
    
    constructor() {
        _listingIdCounter = 1;
    }
    
    function createListing(address tokenAddress, uint256 tokenId, uint256 price) external returns (uint256) {
        require(price > 0, "Price must be greater than zero");
        
        // Transfer the NFT to the marketplace contract
        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);
        
        uint256 listingId = _listingIdCounter++;
        
        listings[listingId] = Listing({
            seller: msg.sender,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            price: price,
            active: true
        });
        
        emit ItemListed(listingId, tokenAddress, tokenId, price, msg.sender);
        
        return listingId;
    }
    
    function buyItem(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing is not active");
        require(msg.value >= listing.price, "Not enough ETH sent");
        
        listing.active = false;
        
        // Calculate platform fee
        uint256 fee = (listing.price * feePercentage) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer funds to seller
        (bool sentToSeller, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sentToSeller, "Failed to send ETH to seller");
        
        // Transfer NFT to buyer
        IERC721(listing.tokenAddress).transferFrom(address(this), msg.sender, listing.tokenId);
        
        emit ItemSold(listingId, listing.tokenAddress, listing.tokenId, listing.price, listing.seller, msg.sender);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refunded, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refunded, "Failed to refund excess payment");
        }
    }
    
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender || msg.sender == owner(), "Not the seller or owner");
        
        listing.active = false;
        
        // Return NFT to seller
        IERC721(listing.tokenAddress).transferFrom(address(this), listing.seller, listing.tokenId);
        
        emit ItemCanceled(listingId);
    }
    
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee too high"); // Max 10%
        feePercentage = _feePercentage;
    }
    
    function withdrawFees() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}`,
	custom: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Create your custom contract here!
contract CustomContract {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Add your custom functions and state variables
}`,
};

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
		// Add utility promises
		utilities: [
			'Grants 0.5% faster walking speed on campus',
			'Telepathic connection with other CMUEats NFT holders',
		],
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
		// Add utility promises
		utilities: [
			'5% chance of extra fries when purchasing at The Underground',
			'Makes you 3% more attractive to CS majors',
		],
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
		// Add utility promises
		utilities: [
			'Telepathic connection with other CMUEats NFT holders',
			'WiFi speed increased by 2.5% while studying',
		],
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
		// Add utility promises
		utilities: [
			'5% chance of extra fries when purchasing at The Underground',
			'Immune to campus geese attacks (mostly)',
		],
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
		// Add utility promises
		utilities: [
			'Grants 0.5% faster walking speed on campus',
			'Professors are 7% more likely to round up your grade',
			"Unlocks secret menu items (please don't ask what they are)",
		],
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
		// Add utility promises
		utilities: [
			'Can summon a virtual Scottie dog that only you can see',
			'Free napkins for life (digital only)',
		],
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
	const [contractType, setContractType] = useState('erc721');
	const [contractCode, setContractCode] = useState(contractTemplates.erc721);
	const [editedCode, setEditedCode] = useState(contractTemplates.erc721);
	const [isCodeEdited, setIsCodeEdited] = useState(false);
	const [contractName, setContractName] = useState('CMUEatsNFT');
	const [contractSymbol, setContractSymbol] = useState('CMUEAT');
	const [maxSupply, setMaxSupply] = useState(100);
	const [mintPrice, setMintPrice] = useState(0.15);
	const [deployStep, setDeployStep] = useState(0);
	const [isDeploying, setIsDeploying] = useState(false);
	const [deployHash, setDeployHash] = useState('');
	const [enableRoyalties, setEnableRoyalties] = useState(true);
	const [royaltyPercentage, setRoyaltyPercentage] = useState(5);
	const [revealable, setRevealable] = useState(false);
	const [whitelistEnabled, setWhitelistEnabled] = useState(false);
	const [showCodeError, setShowCodeError] = useState(false);
	const [codeError, setCodeError] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingTemplateType, setPendingTemplateType] = useState('');

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

	// Add a new function to handle template changes - moved up before it's used
	const applyTemplateChange = (type: string) => {
		const newTemplate =
			contractTemplates[type as keyof typeof contractTemplates];

		setContractType(type);
		setContractCode(newTemplate);
		setEditedCode(newTemplate);
		setIsCodeEdited(false);
		setShowCodeError(false);
		setCodeError('');

		// Reset parameters for different contract types
		if (type === 'erc721') {
			setContractName('CMUEatsNFT');
			setContractSymbol('CMUEAT');
		} else if (type === 'erc1155') {
			setContractName('CMUEatsMultiToken');
			setContractSymbol('CMUMTT');
		} else if (type === 'marketplace') {
			setContractName('CMUEatsMarketplace');
			setContractSymbol(''); // No symbol for marketplace
		} else {
			setContractName('CustomContract');
			setContractSymbol('CUSTOM');
		}
	};

	// Handle Contract Template Change
	const handleContractTypeChange = (
		event: React.ChangeEvent<{ value: unknown }>,
	) => {
		const type = event.target.value as string;

		if (isCodeEdited) {
			// Instead of window.confirm, store the pending change and show dialog
			setPendingTemplateType(type);
			setShowConfirmDialog(true);
		} else {
			// If no custom edits, apply changes directly
			applyTemplateChange(type);
		}
	};

	// Handle code changes in the editor
	const handleCodeChange = (newCode: string) => {
		setEditedCode(newCode);
		setIsCodeEdited(true);

		// Basic validation - check for common syntax errors
		if (!newCode.includes('pragma solidity')) {
			setShowCodeError(true);
			setCodeError('Missing Solidity version pragma statement');
		} else if (
			newCode.includes('contract') &&
			!newCode.includes(contractName)
		) {
			setShowCodeError(true);
			setCodeError(`Contract name should match "${contractName}"`);
		} else {
			setShowCodeError(false);
			setCodeError('');
		}
	};

	// Function to reset code to template
	const resetToTemplate = () => {
		const template =
			contractTemplates[contractType as keyof typeof contractTemplates];
		setEditedCode(template);
		setContractCode(template);
		setIsCodeEdited(false);
		setShowCodeError(false);
		setCodeError('');
	};

	// Function to apply parameter changes to code while preserving edits
	const applyParameterChanges = () => {
		let updatedCode = editedCode;

		// Only apply changes if the code contains the relevant patterns
		if (contractType === 'erc721') {
			if (updatedCode.includes('uint256 public mintPrice =')) {
				updatedCode = updatedCode.replace(
					/uint256 public mintPrice = .*?ether/,
					`uint256 public mintPrice = ${mintPrice} ether`,
				);
			}

			if (updatedCode.includes('uint256 public maxSupply =')) {
				updatedCode = updatedCode.replace(
					/uint256 public maxSupply = \d+/,
					`uint256 public maxSupply = ${maxSupply}`,
				);
			}

			// Update contract name in declaration
			if (updatedCode.includes('contract ')) {
				updatedCode = updatedCode.replace(
					/contract (\w+) is/,
					`contract ${contractName} is`,
				);
			}
		}

		setEditedCode(updatedCode);
	};

	// Function to update code with parameters
	const getUpdatedCode = () => {
		// If code has been edited, return the edited version
		if (isCodeEdited) {
			return editedCode;
		}

		// Otherwise apply parameter changes to the template
		let updatedCode = contractCode;

		if (contractType === 'erc721') {
			updatedCode = updatedCode.replace(
				/uint256 public mintPrice = 0.15 ether/,
				`uint256 public mintPrice = ${mintPrice} ether`,
			);
			updatedCode = updatedCode.replace(
				/uint256 public maxSupply = 100/,
				`uint256 public maxSupply = ${maxSupply}`,
			);
		}

		return updatedCode;
	};

	// Start deployment process
	const handleDeploy = () => {
		setIsDeploying(true);
		setDeployStep(1);

		// Simulate deployment steps with timeouts
		setTimeout(() => {
			setDeployStep(2);
			setTimeout(() => {
				setDeployStep(3);
				setDeployHash(
					`0x${Math.random().toString(16).substring(2, 30)}...`,
				);
				setTimeout(() => {
					setDeployStep(4);
					setTimeout(() => {
						setIsDeploying(false);
						setDeployStep(0);
					}, 3000);
				}, 2000);
			}, 3000);
		}, 2000);
	};

	// Calculate estimated gas fee
	const calculateDeployGas = () => {
		// Base gas based on contract type
		let baseGas = 0;
		switch (contractType) {
			case 'erc721':
				baseGas = 3500000;
				break;
			case 'erc1155':
				baseGas = 2800000;
				break;
			case 'marketplace':
				baseGas = 4200000;
				break;
			case 'custom':
				baseGas = 1500000;
				break;
			default:
				baseGas = 3000000;
		}

		// Add complexity factors
		if (enableRoyalties) baseGas += 500000;
		if (revealable) baseGas += 750000;
		if (whitelistEnabled) baseGas += 350000;

		// Calculate cost based on current gas price
		const gasPriceGwei =
			currentGasPrices[gasOption as keyof typeof currentGasPrices];
		const gasCostEth = (baseGas * gasPriceGwei * 1e-9).toFixed(4);

		return {
			gas: baseGas.toLocaleString(),
			cost: gasCostEth,
		};
	};

	// Function to handle clipboard copy with notifications
	const handleCopyToClipboard = (text: string, successMessage: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setSnackbarMessage(successMessage);
				setSnackbarOpen(true);
			})
			.catch((err: Error) => {
				console.error('Failed to copy text: ', err);
				setSnackbarMessage('Failed to copy to clipboard');
				setSnackbarOpen(true);
			});
	};

	// Function to close snackbar
	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
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
			{/* Notification Snackbar */}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity="success"
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>

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
						<StyledTab label="Create Contract" />
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

												{/* Add Utility Promises section */}
												<Box sx={{ mt: 2 }}>
													<Typography
														variant="caption"
														sx={{
															fontWeight: 'bold',
															color: '#8A4BAF',
														}}
													>
														EXCLUSIVE UTILITY
														PROMISES:
													</Typography>
													{nft.utilities &&
														nft.utilities.map(
															(utility) => (
																<UtilityBadge
																	key={`${nft.id}-${utility}`}
																>
																	✨ {utility}
																</UtilityBadge>
															),
														)}
													<Typography
														variant="caption"
														sx={{
															display: 'block',
															mt: 1,
															color: 'var(--text-muted)',
															fontSize: '0.6rem',
															fontStyle: 'italic',
														}}
													>
													</Typography>
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
						<Box sx={{ color: 'var(--text-primary)' }}>
							<Box sx={{ mb: 3 }}>
								<Typography
									variant="h5"
									gutterBottom
									fontWeight="bold"
								>
									Create Your NFT Smart Contract
								</Typography>
								<Typography
									variant="body2"
									color="var(--text-muted)"
								>
									Design and deploy your own NFT smart
									contract. Customize parameters, review code,
									and simulate deployment.
								</Typography>
							</Box>

							<Grid container spacing={3}>
								<Grid item xs={12} md={4}>
									{/* Contract Parameters */}
									<ParameterCard>
										<CardContent>
											<Typography
												variant="h6"
												gutterBottom
											>
												Contract Settings
											</Typography>

											<FormControl
												fullWidth
												sx={{ mb: 2 }}
											>
												<InputLabel>
													Contract Type
												</InputLabel>
												<Select
													value={contractType}
													label="Contract Type"
													onChange={
														handleContractTypeChange as any
													}
												>
													<MenuItem value="erc721">
														ERC-721 (NFT)
													</MenuItem>
													<MenuItem value="erc1155">
														ERC-1155 (Multi-Token)
													</MenuItem>
													<MenuItem value="marketplace">
														NFT Marketplace
													</MenuItem>
													<MenuItem value="custom">
														Custom Contract
													</MenuItem>
												</Select>
												<FormHelperText>
													Select the type of contract
													to deploy
												</FormHelperText>
											</FormControl>

											<TextField
												label="Contract Name"
												value={contractName}
												onChange={(e) =>
													setContractName(
														e.target.value,
													)
												}
												fullWidth
												margin="normal"
												variant="outlined"
												disabled={
													contractType ===
													'marketplace'
												}
											/>

											{contractType !== 'marketplace' && (
												<TextField
													label="Token Symbol"
													value={contractSymbol}
													onChange={(e) =>
														setContractSymbol(
															e.target.value,
														)
													}
													fullWidth
													margin="normal"
													variant="outlined"
												/>
											)}

											{(contractType === 'erc721' ||
												contractType === 'erc1155') && (
												<>
													<Box sx={{ mt: 2, mb: 1 }}>
														<Typography
															variant="body2"
															gutterBottom
														>
															Maximum Supply
														</Typography>
														<Slider
															value={maxSupply}
															onChange={(
																_,
																value,
															) =>
																setMaxSupply(
																	value as number,
																)
															}
															step={50}
															marks={[
																{
																	value: 100,
																	label: '100',
																},
																{
																	value: 5000,
																	label: '5000',
																},
																{
																	value: 10000,
																	label: '10K',
																},
															]}
															min={100}
															max={10000}
															valueLabelDisplay="auto"
														/>
													</Box>

													<Box sx={{ mt: 3, mb: 1 }}>
														<Typography
															variant="body2"
															gutterBottom
														>
															Mint Price (ETH)
														</Typography>
														<Slider
															value={mintPrice}
															onChange={(
																_,
																value,
															) =>
																setMintPrice(
																	value as number,
																)
															}
															step={0.05}
															marks={[
																{
																	value: 0.05,
																	label: '0.05',
																},
																{
																	value: 0.5,
																	label: '0.5',
																},
																{
																	value: 1,
																	label: '1.0',
																},
															]}
															min={0.01}
															max={1}
															valueLabelDisplay="auto"
														/>
													</Box>
												</>
											)}

											<Box sx={{ mt: 3 }}>
												<Typography
													variant="subtitle2"
													gutterBottom
												>
													Advanced Options
												</Typography>

												<FormControlLabel
													control={
														<Switch
															checked={
																enableRoyalties
															}
															onChange={(e) =>
																setEnableRoyalties(
																	e.target
																		.checked,
																)
															}
														/>
													}
													label="Enable Royalties"
												/>

												{enableRoyalties && (
													<Box sx={{ ml: 3, mt: 1 }}>
														<Typography
															variant="caption"
															color="var(--text-muted)"
														>
															Royalty Percentage
														</Typography>
														<Slider
															value={
																royaltyPercentage
															}
															onChange={(
																_,
																value,
															) =>
																setRoyaltyPercentage(
																	value as number,
																)
															}
															step={1}
															min={1}
															max={10}
															valueLabelDisplay="auto"
															size="small"
															sx={{ mt: 1 }}
														/>
														<Typography
															variant="caption"
															color="var(--text-muted)"
														>
															{royaltyPercentage}%
															royalties on
															secondary sales
														</Typography>
													</Box>
												)}

												<FormControlLabel
													control={
														<Switch
															checked={revealable}
															onChange={(e) =>
																setRevealable(
																	e.target
																		.checked,
																)
															}
														/>
													}
													label="Delayed Reveal"
													sx={{
														mt: 1,
														display: 'block',
													}}
												/>

												<FormControlLabel
													control={
														<Switch
															checked={
																whitelistEnabled
															}
															onChange={(e) =>
																setWhitelistEnabled(
																	e.target
																		.checked,
																)
															}
														/>
													}
													label="Whitelist Presale"
													sx={{
														mt: 1,
														display: 'block',
													}}
												/>
											</Box>
										</CardContent>
									</ParameterCard>

									{/* Deployment Section */}
									<ParameterCard>
										<CardContent>
											<Typography
												variant="h6"
												gutterBottom
											>
												Deploy Contract
											</Typography>

											<Box sx={{ mb: 2 }}>
												<Typography
													variant="body2"
													color="var(--text-muted)"
													gutterBottom
												>
													Gas Price:
												</Typography>
												<Box
													sx={{
														display: 'flex',
														gap: 1,
													}}
												>
													<Chip
														icon={
															<LocalGasStationIcon />
														}
														label={`Slow: ${currentGasPrices.slow}`}
														size="small"
														onClick={() =>
															setGasOption('slow')
														}
														color={
															gasOption === 'slow'
																? 'primary'
																: 'default'
														}
													/>
													<Chip
														icon={
															<LocalGasStationIcon />
														}
														label={`Average: ${currentGasPrices.average}`}
														size="small"
														onClick={() =>
															setGasOption(
																'average',
															)
														}
														color={
															gasOption ===
															'average'
																? 'primary'
																: 'default'
														}
													/>
													<Chip
														icon={
															<LocalGasStationIcon />
														}
														label={`Fast: ${currentGasPrices.fast}`}
														size="small"
														onClick={() =>
															setGasOption('fast')
														}
														color={
															gasOption === 'fast'
																? 'primary'
																: 'default'
														}
													/>
												</Box>
											</Box>

											<Box
												sx={{
													display: 'flex',
													justifyContent:
														'space-between',
													alignItems: 'center',
													mb: 2,
												}}
											>
												<Typography variant="body2">
													Estimated Gas:
												</Typography>
												<GasEstimateChip
													icon={
														<LocalGasStationIcon />
													}
													label={`${calculateDeployGas().gas} gas`}
													size="small"
												/>
											</Box>

											<Box
												sx={{
													display: 'flex',
													justifyContent:
														'space-between',
													alignItems: 'center',
													mb: 3,
												}}
											>
												<Typography variant="body2">
													Estimated Cost:
												</Typography>
												<GasEstimateChip
													icon={
														<LocalGasStationIcon />
													}
													label={`${calculateDeployGas().cost} ETH`}
													size="small"
												/>
											</Box>

											{isDeploying ? (
												<Box
													sx={{ textAlign: 'center' }}
												>
													<LinearProgress
														sx={{ mb: 2 }}
													/>
													<Typography
														variant="body2"
														gutterBottom
													>
														{deployStep === 1 &&
															'Compiling contract...'}
														{deployStep === 2 &&
															'Preparing deployment...'}
														{deployStep === 3 &&
															'Deploying to blockchain...'}
														{deployStep === 4 &&
															'Contract deployed successfully!'}
													</Typography>
													{deployStep >= 3 && (
														<Chip
															label={`Transaction: ${deployHash}`}
															size="small"
															sx={{ mt: 1 }}
															icon={
																<ContentCopyIcon />
															}
															onClick={() =>
																handleCopyToClipboard(
																	deployHash,
																	'Transaction hash copied to clipboard!',
																)
															}
														/>
													)}
												</Box>
											) : (
												<DeployButton
													fullWidth
													variant="contained"
													onClick={handleDeploy}
													disabled={
														!contractName ||
														(contractType !==
															'marketplace' &&
															!contractSymbol)
													}
												>
													Deploy Contract
												</DeployButton>
											)}
										</CardContent>
									</ParameterCard>
								</Grid>

								<Grid item xs={12} md={8}>
									{/* Code Editor */}
									<Box
										sx={{
											mb: 2,
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<Typography variant="h6">
											<CodeIcon
												sx={{
													mr: 1,
													verticalAlign: 'middle',
												}}
											/>
											Smart Contract Code
										</Typography>

										<Box>
											<Tooltip title="Reset to template">
												<IconButton
													size="small"
													sx={{ mr: 1 }}
													onClick={resetToTemplate}
													disabled={!isCodeEdited}
												>
													<WarningIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Apply parameter changes">
												<IconButton
													size="small"
													sx={{ mr: 1 }}
													onClick={
														applyParameterChanges
													}
												>
													<ContentCopyIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Copy code to clipboard">
												<span>
													<IconButton
														size="small"
														onClick={() =>
															handleCopyToClipboard(
																editedCode,
																'Code copied to clipboard!',
															)
														}
													>
														<ContentCopyIcon fontSize="small" />
													</IconButton>
												</span>
											</Tooltip>
										</Box>
									</Box>

									{/* Editable Code Area */}
									<Box
										sx={{
											border: '1px solid #444',
											borderRadius: '4px',
											height: '400px',
											overflow: 'auto',
											backgroundColor: '#1E1E2D',
											mb: 2,
										}}
									>
										<EditorTextField
											multiline
											fullWidth
											value={editedCode}
											onChange={(e) =>
												handleCodeChange(e.target.value)
											}
											variant="outlined"
											sx={{
												'& .MuiOutlinedInput-notchedOutline':
													{
														border: 'none',
													},
												'& .MuiInputBase-root': {
													height: 'auto',
												},
											}}
										/>
									</Box>

									{/* Code Error Display */}
									{showCodeError && (
										<Box
											sx={{
												mb: 2,
												p: 2,
												bgcolor: 'rgba(255, 0, 0, 0.1)',
												borderRadius: '4px',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<WarningIcon
												sx={{ color: 'red', mr: 1 }}
											/>
											<Typography
												variant="body2"
												color="error"
											>
												{codeError}
											</Typography>
										</Box>
									)}

									{/* Original Syntax Highlighted View (hidden) */}
									<Box sx={{ display: 'none' }}>
										<CodeEditorBox>
											{getUpdatedCode()
												.split('\n')
												.map((line, i) => {
													// Create a more stable key that doesn't solely rely on index
													const lineKey = `line-${i}-${line.slice(0, 10).replace(/\s/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
													return (
														<Box
															key={lineKey}
															component="div"
															sx={{
																fontFamily:
																	'monospace',
															}}
														>
															{line.includes(
																'pragma solidity',
															) && (
																<SyntaxHighlight type="keyword">
																	{line}
																</SyntaxHighlight>
															)}
															{line.includes(
																'import',
															) && (
																<SyntaxHighlight type="keyword">
																	{line}
																</SyntaxHighlight>
															)}
															{line.includes(
																'contract',
															) && (
																<>
																	<SyntaxHighlight type="keyword">
																		contract{' '}
																	</SyntaxHighlight>
																	<SyntaxHighlight type="type">
																		{
																			contractName
																		}
																	</SyntaxHighlight>
																	<SyntaxHighlight type="keyword">
																		{' '}
																		is{' '}
																	</SyntaxHighlight>
																	<SyntaxHighlight type="type">
																		{line.substring(
																			line.indexOf(
																				'is ',
																			) +
																				3,
																		)}
																	</SyntaxHighlight>
																</>
															)}
															{line.includes(
																'function',
															) && (
																<SyntaxHighlight type="function">
																	{line}
																</SyntaxHighlight>
															)}
															{line.includes(
																'//',
															) && (
																<SyntaxHighlight type="comment">
																	{line}
																</SyntaxHighlight>
															)}
															{!line.includes(
																'pragma solidity',
															) &&
																!line.includes(
																	'import',
																) &&
																!line.includes(
																	'contract',
																) &&
																!line.includes(
																	'function',
																) &&
																!line.includes(
																	'//',
																) &&
																line}
														</Box>
													);
												})}
										</CodeEditorBox>
									</Box>

									<Box
										sx={{
											mt: 2,
											display: 'flex',
											alignItems: 'center',
											px: 2,
											py: 1,
											bgcolor: isCodeEdited
												? 'rgba(58, 177, 155, 0.1)'
												: 'rgba(255, 152, 0, 0.1)',
											borderRadius: '4px',
											border: isCodeEdited
												? '1px solid var(--logo-second-half)'
												: 'none',
										}}
									>
										{isCodeEdited ? (
											<>
												<CodeIcon
													sx={{
														color: 'var(--logo-second-half)',
														mr: 1,
													}}
												/>
												<Typography
													variant="body2"
													sx={{
														color: 'var(--text-primary)',
													}}
												>
													You&apos;ve made custom
													changes to the contract.
													These changes will be used
													when deploying.
												</Typography>
											</>
										) : (
											<>
												<WarningIcon
													sx={{
														color: 'orange',
														mr: 1,
													}}
												/>
												<Typography
													variant="body2"
													color="text.secondary"
												>
													Note: This is a simulation.
													In a real environment, you
													would need to connect your
													wallet and pay gas fees to
													deploy contracts.
												</Typography>
											</>
										)}
									</Box>
								</Grid>
							</Grid>
						</Box>
					)}

					{tabValue === 4 && (
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
											April 1, 2025
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

			{/* Confirmation Dialog */}
			<Dialog
				open={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
				aria-labelledby="confirm-template-change-dialog"
			>
				<DialogContent>
					<Typography>
						Changing the template will replace your custom code.
						Continue?
					</Typography>
				</DialogContent>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
					<Button
						onClick={() => setShowConfirmDialog(false)}
						sx={{ mr: 1 }}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setShowConfirmDialog(false);
							applyTemplateChange(pendingTemplateType);
						}}
						variant="contained"
						color="primary"
					>
						Confirm
					</Button>
				</Box>
			</Dialog>
		</StyledDialog>
	);
}

export default NFTProject;
