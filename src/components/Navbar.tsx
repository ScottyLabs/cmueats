import { NavLink } from 'react-router-dom';
import './Navbar.css';
import StarOutlineIcon from '@mui/icons-material/StarOutline'; // Import the empty star icon

function Navbar() {
    return (
        <nav className="Navbar">
            <div className="Navbar-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? "nav-link Navbar-active" : "nav-link"}
                    end>
                    {/* SVG and text for Locations */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Locations
                </NavLink>
                <NavLink
                    to="/map"
                    className={({ isActive }) => isActive ? "nav-link Navbar-active" : "nav-link"}>
                    {/* SVG and text for Map */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    Map
                </NavLink>
                <NavLink
                    to="/rate-restaurant"
                    className={({ isActive }) => isActive ? "nav-link Navbar-active" : "nav-link"}>
                    {/* Empty Star Icon and text for Rate a Restaurant */}
                    <StarOutlineIcon style={{ marginRight: '8px', fontSize: '1.2em', color: 'white' }} /> {/* Empty Star Icon */}
                    Rate a Restaurant
                </NavLink>
                <NavLink
                    to="/review-restaurant"
                    className={({ isActive }) => isActive ? "nav-link Navbar-active" : "nav-link"}>
                    {/* SVG and text for Leave a Review */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2.25c-3.181 0-5.25 2.23-5.25 5.25v.75h10.5v-.75c0-3.02-2.069-5.25-5.25-5.25z" />
                    </svg>
                    Leave a Review
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
