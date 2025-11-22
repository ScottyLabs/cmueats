import { useState } from 'react';

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

export function BlockPeriods() {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const blockPeriods = getBlockPeriodsWithTimes();
    const currentPeriod = getBlockPeriod();

    const handleMouseEnter = () => {
        setPopupVisible(true);
    };

    const handleMouseLeave = () => {
        setPopupVisible(false);
    };
    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div>
                <p>Block Period: </p>
                <p>{currentPeriod} </p>
                <p>({blockPeriods.find((p) => p.period === currentPeriod)?.timeRange})</p>
            </div>
            {isPopupVisible && (
                <div>
                    <p>Block Period: {currentPeriod}</p>
                    {blockPeriods.map(({ period, timeRange }) => (
                        <div key={period}>
                            {period}: {timeRange}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
