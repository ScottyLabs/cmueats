import { useContext } from 'react';
import { ExternalLink } from 'lucide-react';
import { DateTime } from 'luxon';
import { getTimeSlotsString } from '../util/time';
import { useDrawerContext } from '../contexts/DrawerContext';
import css from './DrawerTabContent.module.css';

function DrawerTabContent() {
    const dayOffsetFromSunday = DateTime.now().weekday % 7; // literally will be refreshed every second because location status is. This is fine
    const daysStartingFromSunday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const drawerContext = useDrawerContext();
    const location = drawerContext.drawerLocation;

    if (!location) {
        return <div className={css.container} />;
    }

    const timeSlots = getTimeSlotsString(drawerContext.drawerLocation?.times ?? []);
    const specials = location.todaysSpecials ?? [];
    const soups = location.todaysSoups ?? [];
    const menu = location.menu ?? '';

    function renderDescription() {
        return <div className={css.description}>{drawerContext.drawerLocation?.description}</div>;
    }

    function renderHours() {
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
    }

    function renderTodaysSpecials() {
        return (
            <>
                <h4 className={css['section-header']}>Today&apos;s Specials</h4>
                <div>
                    {specials.concat(soups).map((item) => (
                        <>
                            <div className={css['specials-item-title']}>{item.title}</div>
                            <div className={css['specials-item-dscrp']}>{item.description}</div>
                        </>
                    ))}
                </div>
            </>
        );
    }

    function renderMenu() {
        return (
            <>
                <h4 className={css['section-header']}>Menu</h4>
                <div>
                    {menu ? (
                        <a className={css['inline-link']} href={menu} target="_blank" rel="noreferrer">
                            <span>View menu online</span>
                            <ExternalLink size={14} aria-hidden />
                        </a>
                    ) : (
                        <div>
                            We are working on publishing an online menu for this location!
                            <br /> <br />
                            In the meantime, let us know what you think via{' '}
                            <a
                                className={css['inline-link']}
                                href="https://forms.gle/7JxgdgDhWMznQJdk9"
                                target="_blank"
                                rel="noreferrer"
                            >
                                our feedback form
                            </a>
                            .
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <div className={css.container}>
            {drawerContext.activeTab === 'overview' && (
                <>
                    {renderDescription()}
                    {renderHours()}
                    {(specials.length > 0 || soups.length > 0) && renderTodaysSpecials()}
                </>
            )}
            {drawerContext.activeTab === 'menu' && renderMenu()}
            {drawerContext.activeTab === 'reviews' && <p>reviews</p>}
        </div>
    );
}

export default DrawerTabContent;
