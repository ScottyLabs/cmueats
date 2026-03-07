import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Pin, PinOff, EyeOff, Eye } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import FlagIcon from '../assets/control_buttons/flag.svg?react';
import { ILocation_Full } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';
import { CardViewPreference } from '../util/storage';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import Popup from './Popup';
import { fetchClient } from '../api';

function EateryCardHeader({
    location,
    updateViewPreference,
}: {
    location: ILocation_Full;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
}) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const [reportPopupOpen, setReportPopupOpen] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const statusChangesSoon = !location.closedLongTerm && location.changesSoon;
    const isPinned = location.cardViewPreference === 'pinned';
    const isHidden = location.cardViewPreference === 'hidden';
    const { closeDrawer, selectedId } = useDrawerAPIContext();

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

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const moreButtonRef = useRef<HTMLButtonElement | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

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
                className={css.menu}
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
            >
                <button
                    type="button"
                    className={clsx(css['menu-button'], css['pin-button'])}
                    onClick={() => {
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
                    className={clsx(css['menu-button'], isHidden ? css['hide-button--show'] : css['hide-button--hide'])}
                    onClick={() => {
                        updateViewPreference(isHidden ? 'normal' : 'hidden');
                        setIsMenuOpen(false);
                        if (!isHidden && location.id === selectedId) closeDrawer();
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
                <button
                    type="button"
                    className={clsx(css['menu-button'], css['report-button'])}
                    onClick={() => {
                        setIsMenuOpen(false);
                        setReportPopupOpen(true);
                    }}
                >
                    <FlagIcon height={16} width={16} />
                    Report
                </button>
            </div>,
            document.body,
        );
    }

    useEffect(() => {
        if (!isMenuOpen) return undefined;
        const controller = new AbortController();
        const handlePointerDown = (event: PointerEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !moreButtonRef.current?.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            } else {
                event.preventDefault();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsMenuOpen(false);
        };

        const handleWindowChange = () => setIsMenuOpen(false);

        window.addEventListener('click', handlePointerDown, { signal: controller.signal, capture: true });
        window.addEventListener('keydown', handleKeyDown, { signal: controller.signal });
        window.addEventListener('resize', handleWindowChange, { signal: controller.signal });
        window.addEventListener('scroll', handleWindowChange, { signal: controller.signal, capture: true });

        return () => controller.abort(); // cleanup
    }, [isMenuOpen]);

    useEffect(() => {
        textAreaRef.current?.focus();
    }, [reportPopupOpen]);

    return (
        <>
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
                    <span className={css['card-header-relative-time-text']}>{statusMsg.shortStatus[0]}</span>
                    <span className={css['card-header-absolute-time-text']}>{statusMsg.shortStatus[1]}</span>
                </div>
                <div className={css['button-container']}>
                    <button
                        type="button"
                        className={css['more-button']}
                        onClick={(e) => {
                            e.preventDefault();
                            handleToggleMenu();
                        }}
                        ref={moreButtonRef}
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    {isMenuOpen && renderMenu()}
                </div>
            </div>
            <Popup popupOpen={reportPopupOpen} closePopup={() => setReportPopupOpen(false)}>
                <p className={css.report__header}>Report wrong info or other issue for {location.name}</p>

                <textarea
                    name=""
                    className={css.report__input}
                    placeholder="Issue with open hours, other info, staff, etc."
                    ref={textAreaRef}
                    maxLength={300}
                />
                <div className={css['report__button-container']}>
                    <button
                        className={css['report__cancel-button']}
                        onClick={() => setReportPopupOpen(false)}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className={css['report__report-button']}
                        onClick={async () => {
                            const msg = textAreaRef.current?.value;
                            if (!msg) return;
                            const { error } = await fetchClient
                                .POST('/report', {
                                    body: { locationId: location.id, message: msg },
                                })
                                .catch((e) => ({ error: e }));
                            if (error) {
                                // eslint-disable-next-line no-console
                                console.error(error);
                                toast.error(`Failed to submit report: ${error}`);
                            } else {
                                setReportPopupOpen(false);
                                toast.success("Thanks for taking the time to report this! We'll address it ASAP");
                            }
                        }}
                        type="button"
                    >
                        Send Report
                    </button>
                </div>
            </Popup>
        </>
    );
}

export default EateryCardHeader;
