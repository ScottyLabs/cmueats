import { useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, MoreHorizontal, Pin, PinOff, Eye, EyeOff } from 'lucide-react';
import { DrawerContext } from '../contexts/DrawerContext';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { CardStatus } from './EateryCard';
import css from './EateryCardContent.module.css';

function EateryCardContent({
    location,
    currentStatus,
    updateStatus,
    showControlButtons,
}: {
    location: IReadOnlyLocation_Combined;
    currentStatus: CardStatus;
    updateStatus: (newStatus: CardStatus) => void;
    showControlButtons?: boolean;
}) {
    const drawerContext = useContext(DrawerContext);
    const { location: physicalLocation, name, url } = location;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const moreButtonRef = useRef<HTMLButtonElement | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuId = useId();

    function handleToggleMenu() {
        if (isMenuOpen) {
            setIsMenuOpen(false);
            return;
        }

        if (moreButtonRef.current) {
            const rect = moreButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX,
            });
        }

        setIsMenuOpen(true);
    }

    function renderMenu() {
        return createPortal(
            <div
                ref={menuRef}
                className={css['card-content-menu']}
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                id={menuId}
            >
                <button
                    type="button"
                    className={css['menu-button']}
                    onClick={() => {
                        updateStatus(currentStatus === CardStatus.PINNED ? CardStatus.NORMAL : CardStatus.PINNED);
                    }}
                >
                    {currentStatus === CardStatus.PINNED ? (
                        <>
                            <PinOff size={16} />
                            <div>Unpin Card</div>
                        </>
                    ) : (
                        <>
                            <Pin size={16} />
                            <div>Pin Card</div>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className={css['menu-button']}
                    onClick={() => {
                        updateStatus(currentStatus === CardStatus.HIDDEN ? CardStatus.NORMAL : CardStatus.HIDDEN);
                    }}
                >
                    {currentStatus === CardStatus.HIDDEN ? (
                        <>
                            <Eye size={16} />
                            <div>Show Card</div>
                        </>
                    ) : (
                        <>
                            <EyeOff size={16} />
                            <div>Hide Card</div>
                        </>
                    )}
                </button>
            </div>,
            document.body,
        );
    }

    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const handlePointerDown = (event: PointerEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !moreButtonRef.current?.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsMenuOpen(false);
        };

        const handleWindowChange = () => setIsMenuOpen(false);

        document.addEventListener('pointerdown', handlePointerDown, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleWindowChange);
        window.addEventListener('scroll', handleWindowChange, true);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleWindowChange);
            window.removeEventListener('scroll', handleWindowChange, true);
        };
    }, [isMenuOpen]);

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']}>
                <a href={url}>{name}</a>
            </h3>

            <span className={css['physical-location-text']}>
                <MapPin size={13} />
                {physicalLocation}
            </span>

            {showControlButtons && (
                <div className={css['card-action-bar']}>
                    <button
                        type="button"
                        className={css['details-button']}
                        onClick={() => {
                            // open default tab "overview"
                            drawerContext.setActiveTab('overview');
                            // when the drawer is open, click other cards will open that
                            // card's detail, instead of closing the drawer;
                            // click on the same card will close the drawer.
                            if (drawerContext.drawerLocation?.conceptId === location.conceptId) {
                                drawerContext.setIsDrawerActive(!drawerContext.isDrawerActive);
                            } else {
                                drawerContext.setDrawerLocation(location);
                                drawerContext.setIsDrawerActive(true);
                            }
                        }}
                    >
                        details
                    </button>

                    <button
                        type="button"
                        className={css['card-content-more-button']}
                        onClick={handleToggleMenu}
                        ref={moreButtonRef}
                    >
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            )}
            {isMenuOpen && renderMenu()}
        </div>
    );
}

export default EateryCardContent;
