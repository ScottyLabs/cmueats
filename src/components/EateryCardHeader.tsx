import { useRef } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { highlightColors } from '../constants/colors';
import css from './EateryCardHeader.module.css';
import { CardStatus } from '../types/cardTypes';
import { Pin, PinOff, Eye, EyeOff } from 'lucide-react';

function EateryCardHeader({ 
    location,
    currentStatus,
    updateStatus,
}: { 
    location: IReadOnlyLocation_Combined,
    currentStatus: CardStatus;
    updateStatus: (newStatus: CardStatus) => void;
 }) {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const isMobile = window.innerWidth <= 600;

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
            className = {css['card-header-bar']}
            style={{ '--status-color': highlightColors[location.locationState] }}
        >
            <div
                className={css['card-header-container']}
            >
                <div
                    className={css['card-header-dot']}
                    style={{ '--status-color': highlightColors[location.locationState] }}
                    ref={dotRef}
                />
                <div className={css['time-container']}>
                    <div className={css['card-header-relative-time-text']}>{relativeTime}</div>
                    <div className={css['card-header-absolute-time-text']}>{absoluteTime}</div>
                </div>
            </div>
            {
                isMobile &&
                (
                    <div className={css['card-header-buttons']}>
                        <div
                            onClick={() => {
                                updateStatus(currentStatus === CardStatus.PINNED ? CardStatus.NORMAL : CardStatus.PINNED);
                            }}
                        >
                            {currentStatus === CardStatus.PINNED ? (
                                <Pin size={20} color={"#F6CC5D"}/>
                            ) : (
                                <Pin size={20}/>
                            )}
                        </div>

                        <div
                            className={css['menu-button']}
                            onClick={() => {
                                updateStatus(currentStatus === CardStatus.HIDDEN ? CardStatus.NORMAL : CardStatus.HIDDEN);
                            }}
                        >
                            {currentStatus === CardStatus.HIDDEN ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </div>
                    </div>
                )
            }
            </div>
    );
}

export default EateryCardHeader;
