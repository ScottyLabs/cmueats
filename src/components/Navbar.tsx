import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { IS_APRIL_FOOLS } from '../util/constants';
import './Navbar.css';

function Navbar() {
	const location = useLocation();
	const { theme } = useTheme();

	// For April Fools, swap the labels but keep the links the same
	const isAprilFools = IS_APRIL_FOOLS && theme === 'april-fools';

	return (
		<nav className="Navbar">
			<div className="Navbar-links">
				<Link to="/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375
                0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375
                0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375
                0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						/>
					</svg>
					{isAprilFools ? 'Map' : 'Locations'}
				</Link>
				<Link to="/map">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 6.75V15m6-6v8.25m.503
                 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869
                 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24
                 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159
                 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
						/>
					</svg>
					{isAprilFools ? 'Locations' : 'Map'}
				</Link>
				<div
					className={`Navbar-active ${location.pathname === '/map' ? 'Navbar-active_map' : ''} Navbar-active_glow`}
				/>
			</div>
		</nav>
	);
}

export default Navbar;
