import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as motion from 'motion/react-client';
import clsx from 'clsx';
import css from './Navbar.module.css';

const tabs = [
    {
        icon: (
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
        ),
        text: 'Locations',
        link: '/',
    },
    {
        icon: (
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
        ),
        text: 'Map',
        link: '/map',
    },
    {
        icon: (
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
                    d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 
				 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 
				 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 
				 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 
				 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 
				 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
            </svg>
        ),
        text: 'Feedback and Issues',
        link: 'https://forms.gle/7JxgdgDhWMznQJdk9',
        external: true,
    },
];
function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className={css.navbar}>
            <div className={css['navbar-links']}>
                {tabs.map(({ icon, text, link, external }) => {
                    const isActive = location.pathname === link;
                    const handleNavigate = (e: { preventDefault: () => void }) => {
                        if (!external) {
                            e.preventDefault();
                            navigate(link);
                        }
                    };
                    return (
                        <Link
                            to={link}
                            target={external ? '_blank' : ''}
                            rel="noopener noreferrer"
                            key={link}
                            className={clsx(css['navbar-link'], isActive && css['navbar-link--active'])}
                            // style={{ zIndex: isActive ? 0 : 1 }}
                            // onClick={handleNavigate}
                            // onTouchStart={handleNavigate}
                            // so the bg active indicator slides underneath the old link
                        >
                            {icon}
                            <span>{text}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab-bg"
                                    className={css['navbar-link__active-backdrop']}
                                    transition={{ type: 'spring', damping: 10, mass: 0.6 }}
                                    style={{ borderRadius: 10 }}
                                    // we need to specify border radius here so framer motion doesn't distort it while transitioning
                                    // https://motion.dev/docs/react-layout-animations#scale-correction
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default Navbar;
