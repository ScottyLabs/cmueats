import { useContext } from 'react';
import { DateTime } from 'luxon';
import { getTimeSlotsString } from '../util/time';
import { DrawerContext } from '../contexts/DrawerContext';
import css from './DrawerTabContent.module.css';

function DrawerTabContent() {
    const dayOffsetFromSunday = DateTime.now().weekday % 7; // literally will be refreshed every second because location status is. This is fine
    const daysStartingFromSunday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const drawerContext = useContext(DrawerContext);
    const timeSlots = getTimeSlotsString(drawerContext.drawerLocation?.times ?? []);

    const renderDescription = () => {
        return <>{drawerContext.drawerLocation?.shortDescription}</>;
    };

    const renderHours = () => {
        return (
            <>
                <h4 className={css['section-header']}>Hours</h4>

                <div className={css['hours-list']}>
                    {daysStartingFromSunday.map((_, index) => {
                        const realIndex = (index + dayOffsetFromSunday) % 7;
                        const label = daysStartingFromSunday[realIndex];
                        const isToday = realIndex === dayOffsetFromSunday;
                        return (
                            <div
                                key={label}
                                className={`${css['hours-row']} ${isToday ? css['hours-row-active'] : ''}`}
                            >
                                <span className={css['hours-day']}>{label}</span>
                                <span className={css['hours-times']}>{timeSlots[realIndex]}</span>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <div className={css.container}>
            {drawerContext.activeTab === 'overview' && (
                <>
                    {renderDescription()}
                    {renderHours()}
                </>
            )}
            {drawerContext.activeTab === 'menu' && <p>menu</p>}
            {drawerContext.activeTab === 'reviews' && <p>reviews</p>}
        </div>
    );
}

export default DrawerTabContent;
