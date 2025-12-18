import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';
import EyeControlIcon from '../assets/control_buttons/x.svg?react';
import EyeOffControlIcon from '../assets/control_buttons/restore.svg?react';
import { CardViewPreference } from '../util/storage';

function EateryCardHeader({
    location,
    updateViewPreference,
}: {
    location: IReadOnlyLocation_Combined;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
}) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const statusChangesSoon = !location.closedLongTerm && location.changesSoon;
    const isHidden = location.cardViewPreference === 'hidden';

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

    return (
        <div
            className={css['card-header-container']}
            style={{ '--status-color': highlightColors[location.locationState] }}
        >
            <div
                className={clsx(css['card-header-dot'], statusChangesSoon && css['card-header-dot--blinking'])}
                style={{ '--status-color': highlightColors[location.locationState] }}
                ref={dotRef}
            />

            <div className={css['time-container']}>
                <span className={css['card-header-relative-time-text']}>{relativeTime}</span>
                <span className={css['card-header-absolute-time-text']}>{absoluteTime}</span>
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
                        event.stopPropagation();
                        updateViewPreference(isHidden ? 'normal' : 'hidden');
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
