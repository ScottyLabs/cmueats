import {useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import css from './EateryCardDropdown.module.css';
import { CardStatus } from '../types/cardTypes';
import {MoreHorizontal, Pin, PinOff, Eye, EyeOff } from 'lucide-react';


function EateryCardDropdown(
    {
        currentStatus,
        updateStatus,
    }: {
        currentStatus: CardStatus;
        updateStatus: (newStatus: CardStatus) => void;
    }
) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const moreButtonRef = useRef<HTMLButtonElement | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement | null>(null);
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
                        setIsMenuOpen(false);
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
                        setIsMenuOpen(false);
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
        <div>
            <button
                type="button"
                className={css['card-content-more-button']}
                onClick={handleToggleMenu}
                ref={moreButtonRef}
            >
                <MoreHorizontal size={18} />
            </button>
            {isMenuOpen && renderMenu()}
        </div>
    )
}
export default EateryCardDropdown;
