import { ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { next7DaysReadableString } from '../util/time';
import { useCurrentTime } from '../contexts/NowContext';
import css from './DrawerTabContent.module.css';
import { useDrawerTabsContext } from '../contexts/DrawerTabsContext';
import ReviewPage from './ReviewPage';
import { $api } from '../api';

function DrawerTabContent() {
    const queryClient = useQueryClient();
    const now = useCurrentTime();
    const dayOffsetFromSunday = now.weekday % 7;
    const daysStartingFromSunday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const drawerContext = useDrawerTabsContext();
    const { location } = drawerContext;

    queryClient.prefetchQuery(
        $api.queryOptions('get', '/v2/locations/{locationId}/reviews/summary', {
            params: { path: { locationId: location.id } },
        }),
    );
    queryClient.prefetchQuery(
        $api.queryOptions('get', '/v2/locations/{locationId}/reviews/tags', {
            params: { path: { locationId: location.id } },
        }),
    );

    if (!location) {
        return <div className={css.container} />;
    }

    const timeSlots = next7DaysReadableString(location.times, now);
    const specials = location.todaysSpecials ?? [];
    const soups = location.todaysSoups ?? [];
    const menu = location.menu ?? '';

    function renderDescription() {
        return <div className={css.description}>{drawerContext.location.description}</div>;
    }

    function renderHours() {
        return (
            <>
                <h4 className={css['section-header']}>Hours</h4>

                <div className={css['hours-list']}>
                    {timeSlots.map((slot, index) => {
                        const label = daysStartingFromSunday[(index + dayOffsetFromSunday) % 7];
                        const isToday = index === 0;
                        return (
                            <div
                                key={label}
                                className={`${css['hours-row']} ${isToday ? css['hours-row-active'] : ''}`}
                            >
                                <span className={css['hours-day']}>{label}</span>
                                <div className={css['hours-line']} />
                                <span className={css['hours-times']}>{slot}</span>
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
                        <div className={css.special} key={item.name}>
                            <div className={css.special__title}>{item.name}</div>
                            <div className={css.special__desc}>{item.description}</div>
                        </div>
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
            {drawerContext.activeTab === 'reviews' && <ReviewPage locationId={location.id} />}
        </div>
    );
}

export default DrawerTabContent;
