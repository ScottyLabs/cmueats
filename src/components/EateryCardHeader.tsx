import { useRef } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';

function EateryCardHeader({ location }: { location: IReadOnlyLocation_Combined }) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const relativeTime =
        location.statusMsg === 'Closed until further notice'
            ? location.statusMsg
            : location.statusMsg === 'Open 24/7'
              ? location.statusMsg
              : location.statusMsg.substring(0, location.statusMsg.indexOf('(') - 1);
    const absoluteTime =
        location.statusMsg === 'Closed until further notice'
            ? ''
            : location.statusMsg === 'Open 24/7'
              ? ''
              : location.statusMsg.substring(location.statusMsg.indexOf('(')).slice(1, -1);

    return (
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
    );
}

export default EateryCardHeader;
