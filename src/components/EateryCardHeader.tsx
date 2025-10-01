import { CSSProperties } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import './EateryCardHeader.css';

function EateryCardHeader({ location }: { location: IReadOnlyLocation_Combined }) {
    const statusColor = highlightColors[location.locationState];
    const hasExplicitTime = location.statusMsg.includes('(');
    const relativeTime = hasExplicitTime
        ? location.statusMsg.slice(0, location.statusMsg.indexOf('(')).trim()
        : location.statusMsg;
    const absoluteTime = hasExplicitTime
        ? location.statusMsg.slice(location.statusMsg.indexOf('(') + 1, location.statusMsg.lastIndexOf(')'))
        : '';

    return (
        <div className="card-header-container" style={{ '--status-color': statusColor } as CSSProperties}>
            <div className="card-header-status" aria-label={relativeTime}>
                <span className="card-header-dot" aria-hidden />
                <span className="card-header-relative-time-text">{relativeTime}</span>
                {absoluteTime && <span className="card-header-absolute-time-text">at {absoluteTime}</span>}
            </div>
        </div>
    );
}

export default EateryCardHeader;
