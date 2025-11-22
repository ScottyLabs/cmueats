import { useRef } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';

function EateryCardHeader({ location }: { location: IReadOnlyLocation_Combined }) {
    const dotRef = useRef<HTMLDivElement | null>(null);

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
        <div>
            <div
                className={css['card-header-container']}
                style={{ '--status-color': highlightColors[location.locationState] }}
            >
                <div
                    className={css['card-header-dot']}
                    style={{ '--status-color': highlightColors[location.locationState] }}
                    ref={dotRef}
                />
                <div className={css['card-header-relative-time-text']}>{relativeTime}</div>
                <div className={css['card-header-absolute-time-text']}>{absoluteTime}</div>
            </div>
        </div>
    );
}

export default EateryCardHeader;
