import { useState, useRef, useEffect } from 'react';
import './BlockPeriods.css';
import x from '../assets/control_button/x.svg';

function getBlockPeriodsWithTimes(): { period: string; timeRange: string }[] {
    return [
        { period: 'Breakfast', timeRange: '03:30 AM - 10:29 AM' },
        { period: 'Lunch', timeRange: '10:30 AM - 04:29 PM' },
        { period: 'Dinner', timeRange: '04:30 PM - 08:59 PM' },
        { period: 'Late Night', timeRange: '09:00 PM - 03:29 AM' },
    ];
}

function getBlockPeriod(): string {
    const now = new Date();
    const pittsburghTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const seconds = pittsburghTime.getHours() * 3600 + pittsburghTime.getMinutes() * 60 + pittsburghTime.getSeconds();

    const breakfastStart = 3 * 3600 + 30 * 60;
    const lunchStart = 10 * 3600 + 30 * 60;
    const dinnerStart = 16 * 3600 + 30 * 60;
    const lateNightStart = 21 * 3600;

    if (seconds >= breakfastStart && seconds < lunchStart) {
        return 'Breakfast';
    }
    if (seconds >= lunchStart && seconds < dinnerStart) {
        return 'Lunch';
    }
    if (seconds >= dinnerStart && seconds < lateNightStart) {
        return 'Dinner';
    }
    return 'Late Night';
}

function BlockPeriodsPopup({
    blockPeriods,
    currentPeriod,
    currentRange,
    onClose,
    popupRef,
}: {
    blockPeriods: { period: string; timeRange: string }[];
    currentPeriod: string;
    currentRange: string | undefined;
    onClose: () => void;
    popupRef: React.RefObject<HTMLDivElement>;
}) {
    return (
        <div ref={popupRef} className="block-periods__popup">
            <div className="block-periods__popup-header">
                <div className="block-periods__popup-title">
                    Block Period: <span className="block-periods__period">{currentPeriod}</span>
                    <span className="block-periods__range"> ({currentRange})</span>
                </div>
                <button type="button" className="block-periods__popup-close" onClick={onClose}>
                    <img src={x} alt="close icon" />
                </button>
            </div>

            <div className="block-periods__popup-list">
                {blockPeriods.map(({ period, timeRange }) => (
                    <div
                        key={period}
                        className={
                            'block-periods__row' + (period === currentPeriod ? ' block-periods__row--active' : '')
                        }
                    >
                        <span className="block-periods__row-label">{period}</span>
                        <span className="block-periods__row-time">{timeRange}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BlockPeriods() {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const blockPeriods = getBlockPeriodsWithTimes();
    const currentPeriod = getBlockPeriod();
    const currentRange = blockPeriods.find((p) => p.period === currentPeriod)?.timeRange;

    const mobileButtonRef = useRef<HTMLButtonElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isPopupVisible) return;

        const onClick = (ev: PointerEvent) => {
            if (window.innerWidth >= 900) return;
            if (!popupRef.current || !mobileButtonRef.current) return;
            if (!ev.composedPath().includes(popupRef.current) && !ev.composedPath().includes(mobileButtonRef.current)) {
                setPopupVisible(false);
            }
        };

        document.body.addEventListener('click', onClick);
        return () => document.body.removeEventListener('click', onClick);
    }, [isPopupVisible]);

    return (
        <>
            <div
                className="block-periods__desktop"
                onMouseEnter={() => setPopupVisible(true)}
                onMouseLeave={() => setPopupVisible(false)}
            >
                <button type="button" className="block-periods__desktop-summary">
                    <span className="block-periods__label">Block Period:</span>
                    <span className="block-periods__period">{currentPeriod}</span>
                    <span className="block-periods__range">({currentRange})</span>
                </button>

                {isPopupVisible && (
                    <BlockPeriodsPopup
                        popupRef={popupRef}
                        blockPeriods={blockPeriods}
                        currentPeriod={currentPeriod}
                        currentRange={currentRange}
                        onClose={() => setPopupVisible(false)}
                    />
                )}
            </div>

            <div className="block-periods__mobile">
                <div
                    className={`block-periods__mobile-top-rule ${isPopupVisible ? 'block-periods__mobile-top-rule--active' : ''}`}
                />
                <button
                    ref={mobileButtonRef}
                    type="button"
                    className={`block-periods__mobile-summary ${isPopupVisible ? 'block-periods__mobile-summary--active' : ''}`}
                    onClick={() => setPopupVisible((v) => !v)}
                >
                    <span className="block-periods__label">Block Period:</span>
                    <span className="block-periods__period">{currentPeriod}</span>
                </button>

                {isPopupVisible && (
                    <BlockPeriodsPopup
                        popupRef={popupRef}
                        blockPeriods={blockPeriods}
                        currentPeriod={currentPeriod}
                        currentRange={currentRange}
                        onClose={() => setPopupVisible(false)}
                    />
                )}
                <div
                    className={`block-periods__mobile-bottom-rule ${isPopupVisible ? 'block-periods__mobile-bottom-rule--active' : ''}`}
                />
            </div>
        </>
    );
}
