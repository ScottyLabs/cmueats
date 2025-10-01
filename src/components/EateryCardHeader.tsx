import { CSSProperties } from 'react';
import { Pin } from 'lucide-react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import './EateryCardHeader.css';

type EateryCardHeaderProps = {
    location: IReadOnlyLocation_Combined;
    isPinned: boolean;
    onTogglePin: () => void;
    showPinButton?: boolean;
};

function EateryCardHeader({ location, isPinned, onTogglePin, showPinButton = true }: EateryCardHeaderProps) {
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

            {showPinButton && (
                <button
                    type="button"
                    className={`card-header-pin ${isPinned ? 'card-header-pin--active' : ''}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onTogglePin();
                    }}
                    aria-pressed={isPinned}
                    aria-label={isPinned ? 'Unpin location' : 'Pin location'}
                >
                    <Pin size={18} aria-hidden />
                </button>
            )}
        </div>
    );
}

export default EateryCardHeader;
