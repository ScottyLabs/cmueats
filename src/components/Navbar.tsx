import { Link, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CasinoIcon from '@mui/icons-material/Casino';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MapIcon from '@mui/icons-material/Map';
import { useTheme } from '../ThemeProvider';
import { IS_APRIL_FOOLS } from '../util/constants';
import './Navbar.css';

function Navbar() {
	const location = useLocation();
	const { theme } = useTheme();

	// For April Fools, swap the labels but keep the links the same
	const isAprilFools = IS_APRIL_FOOLS && theme === 'april-fools';

	const getActiveClass = (pathname: string) => {
		switch (pathname) {
			case '/map':
				return 'Navbar-active_map';
			case '/nft':
				return 'Navbar-active_nft';
			case '/casino':
				return 'Navbar-active_casino';
			default:
				return '';
		}
	};

	if (isAprilFools) {
		return (
			<nav className="Navbar">
				<div
					className="Navbar-links"
					style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
				>
					<Link to="/">
						<ListAltIcon />
						Map
					</Link>
					<Link to="/map">
						<MapIcon />
						Locations
					</Link>
					<Link to="/nft">
						<StorefrontIcon />
						NFTs
					</Link>
					<Link to="/casino">
						<CasinoIcon />
						Casino
					</Link>
					<div
						className={`Navbar-active ${getActiveClass(location.pathname)} Navbar-active_glow`}
					/>
				</div>
			</nav>
		);
	}

	return (
		<nav className="Navbar">
			<div
				className="Navbar-links"
				style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
			>
				<Link to="/">
					<ListAltIcon />
					Locations
				</Link>
				<Link to="/map">
					<MapIcon />
					Map
				</Link>
				<div
					className={`Navbar-active ${getActiveClass(location.pathname)} Navbar-active_glow`}
					style={{ width: '50%' }}
				/>
			</div>
		</nav>
	);
}

export default Navbar;
