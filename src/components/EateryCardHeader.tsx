import { useRef, useEffect } from 'react';
import { IReadOnlyLocation_Combined, LocationState } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';

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
    const relTime = location.statusMsg.substring(0, location.statusMsg.indexOf('(') - 1);
    const absTime = location.statusMsg.substring(location.statusMsg.indexOf('('));

    return (
        <>
            <div>
                <div
                    className={`card__header__dot ${statusChangesSoon ? 'card__header__dot--blinking' : ''}`}
                    style={{
                        backgroundColor: highlightColors[location.locationState],
                    }}
                    ref={dotRef}
                />
                <div>
                    {relTime} {`(absTime: ${absTime})`} - {location.locationState}(
                    {highlightColors[location.locationState]}){' '}
                </div>
                <div>{'(`more` icon)'}</div>
            </div>
        </>
    );
}

export default EateryCardHeader;
