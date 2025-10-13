import { useContext } from 'react';
import { DateTime } from 'luxon';
import { getTimeSlotsString } from '../util/time';
import { DrawerContext, TabType } from '../contexts/DrawerContext';
import css from './DrawerTabContent.module.css';

function DrawerTabContent() {
    const dayOffsetFromSunday = DateTime.now().weekday % 7; // literally will be refreshed every second because location status is. This is fine
    const daysStartingFromSunday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const drawerContext = useContext(DrawerContext);
    const timeSlots = getTimeSlotsString(drawerContext.drawerLocation?.times ?? []);
    return (
        <div className={css['drawer-tab-content']}>
            {drawerContext.activeTab === 'description' && (
                <div>
                    {drawerContext.drawerLocation?.description}

                    <h6>Hours</h6>
                    {Array(7)
                        .fill(true)
                        .map((_, i) => {
                            const realI = (i + dayOffsetFromSunday) % 7;
                            return (
                                <div
                                    style={{
                                        marginBottom: '10px',
                                        fontWeight: realI === dayOffsetFromSunday ? 'bold' : 'normal',
                                        color: realI === dayOffsetFromSunday ? 'white' : '',
                                    }}
                                    key={daysStartingFromSunday[realI]}
                                >
                                    <span style={{ color: 'white' }}>{daysStartingFromSunday[realI]}</span>:{' '}
                                    {timeSlots[realI]}
                                </div>
                            );
                        })}
                </div>
            )}
            {drawerContext.activeTab === 'menu' && <div>menu</div>}
            {drawerContext.activeTab === 'reviews' && <div>reviews</div>}
        </div>
    );
}

export default DrawerTabContent;
