import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Pin, PinOff, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';
import { CardViewPreference } from '../util/storage';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';

function EateryCardHeader({
    location,
    updateViewPreference,
}: {
    location: IReadOnlyLocation_Combined;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
}) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const statusChangesSoon = !location.closedLongTerm && location.changesSoon;
    const isPinned = location.cardViewPreference === 'pinned';
    const isHidden = location.cardViewPreference === 'hidden';
    const { closeDrawer, selectedConceptId } = useDrawerAPIContext();
    useEffect(() => {
        const dotAnimation = dotRef.current?.getAnimations()[0];
        if (!statusChangesSoon) {
            dotAnimation?.cancel(); // delete any dot blinking animation (if it exists)
        } else {
            // eslint-disable-next-line no-lonely-if
            if (dotAnimation !== undefined) {
                dotAnimation.startTime = 0;
                dotAnimation.play(); // keeps the flashing dots between cards in-sync
            }
        }
    });

    const { statusMsg } = location;
    let relativeTime = 'Status unavailable';
    let absoluteTime = '';
    if (statusMsg) {
        const start = statusMsg.indexOf('(');
        const end = statusMsg.lastIndexOf(')');
        if (start >= 0 && end >= 0 && end > start) {
            relativeTime = statusMsg.slice(0, start).trim();
            absoluteTime = statusMsg.slice(statusMsg.indexOf('at'), end).trim();
        } else {
            relativeTime = statusMsg;
        }
    }

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
            // disable linter since this is not a button
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div
                ref={menuRef}
                className={css.menu}
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                id={menuId}
                onClick={(e) => e.preventDefault()}
            >
                <button
                    type="button"
                    className={clsx(css['menu-button'], css['pin-button'])}
                    onClick={(e) => {
                        e.stopPropagation();
                        updateViewPreference(isPinned ? 'normal' : 'pinned');
                        setIsMenuOpen(false);
                    }}
                >
                    {isPinned ? (
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
                    className={clsx(css['menu-button'], css['hide-button'])}
                    onClick={(e) => {
                        e.stopPropagation();
                        updateViewPreference(isHidden ? 'normal' : 'hidden');
                        setIsMenuOpen(false);
                        if (!isHidden && location.conceptId === selectedConceptId) closeDrawer();
                    }}
                >
                    {isHidden ? (
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
        <div
            className={css['card-header-container']}
            style={{ '--status-color': highlightColors[location.locationState] } as React.CSSProperties}
        >
            <div
                className={clsx(css['card-header-dot'], statusChangesSoon && css['card-header-dot--blinking'])}
                style={{ '--status-color': highlightColors[location.locationState] } as React.CSSProperties}
                ref={dotRef}
            />

            <div className={css['time-container']}>
                <span className={css['card-header-relative-time-text']}>{relativeTime}</span>
                <span className={css['card-header-absolute-time-text']}>{absoluteTime}</span>
            </div>
            <div className={css['button-container']}>
                <button
                    type="button"
                    className={css['more-button']}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMenu();
                    }}
                    ref={moreButtonRef}
                >
                    <MoreHorizontal size={13} />
                </button>
                {isMenuOpen && renderMenu()}
            </div>
        </div>
    );
}

export default EateryCardHeader;
