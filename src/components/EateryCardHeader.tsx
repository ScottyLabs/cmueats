import { useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { IReadOnlyLocation_Combined, LocationState } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import './EateryCardHeader.css';

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
                dotAnimation.play();
            }
        }
    }, [statusChangesSoon]);
    const relativeTime = location.statusMsg.substring(0, location.statusMsg.indexOf('(') - 1);
    const absoluteTime = location.statusMsg.substring(location.statusMsg.indexOf('(')).slice(1, -1);

    return (
        <>
            <div
                className="card-header-container"
                style={{ '--status-color': highlightColors[location.locationState] }}
            >
                <div
                    className={`card-header-dot ${statusChangesSoon ? 'card-header-dot-blinking' : ''}`}
                    style={{
                        backgroundColor: highlightColors[location.locationState],
                    }}
                    ref={dotRef}
                />
                <div className="card-header-relative-time-text">{relativeTime}</div>
                <div className="card-header-absolute-time-text">{absoluteTime}</div>
                <MoreHorizontal className="card-header-more-button" />
            </div>
        </>
    );
}

export default EateryCardHeader;
