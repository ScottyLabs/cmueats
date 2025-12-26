import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ILocation_Full } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';
import EyeControlIcon from '../assets/control_buttons/x.svg?react';
import EyeOffControlIcon from '../assets/control_buttons/restore.svg?react';
import { CardViewPreference } from '../util/storage';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';

function EateryCardHeader({
    location,
    updateViewPreference,
}: {
    location: ILocation_Full;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
}) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const statusChangesSoon = !location.closedLongTerm && location.changesSoon;
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
                <span className={css['card-header-relative-time-text']}>{statusMsg.shortStatus[0]}</span>
                <span className={css['card-header-absolute-time-text']}>{statusMsg.shortStatus[1]}</span>
            </div>
            <div className={css['button-container']}>
                {/* <button
                    type="button"
                    className={css['action-button']}
                    aria-label={isPinned ? 'Unpin Card' : 'Pin Card'}
                    onClick={(event) => {
                        event.stopPropagation();
                        updateViewPreference(isPinned ? 'normal' : 'pinned');
                    }}
                >
                    {isPinned ? (
                        <PinnedControlIcon className={css['action-button__icon']} />
                    ) : (
                        <UnpinnedControlIcon className={css['action-button__icon']} />
                    )}
                </button> */}

                <button
                    type="button"
                    className={css['action-button']}
                    aria-label={isHidden ? 'Show Card' : 'Hide Card'}
                    onClick={(event) => {
                        event.preventDefault();
                        updateViewPreference(isHidden ? 'normal' : 'hidden');
                        if (!isHidden && location.conceptId === selectedConceptId) closeDrawer();
                    }}
                >
                    {isHidden ? (
                        <EyeOffControlIcon className={css['action-button__icon']} />
                    ) : (
                        <EyeControlIcon className={css['action-button__icon']} />
                    )}
                </button>
            </div>
        </div>
    );
}

export default EateryCardHeader;
