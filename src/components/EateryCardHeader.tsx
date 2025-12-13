import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';

function EateryCardHeader({ location }: { location: IReadOnlyLocation_Combined }) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const statusChangesSoon = !location.closedLongTerm && location.changesSoon;
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
                <div className={css['card-header-relative-time-text']}>{relativeTime}</div>
                <div className={css['card-header-absolute-time-text']}>{absoluteTime}</div>
            </div>
        </div>
    );
}

export default EateryCardHeader;
