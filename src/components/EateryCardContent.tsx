import { useContext } from 'react';
import { MapPin, MoreHorizontal } from 'lucide-react';
import { DrawerContext } from '../contexts/DrawerContext';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import css from './EateryCardContent.module.css';

function EateryCardContent({ location }: { location: IReadOnlyLocation_Combined }) {
    const drawerContext = useContext(DrawerContext);
    const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location;

    return (
        <>
            <h4>
                <a href={url}>{name}</a>
            </h4>

            <span className={css['physical-location-text']}>
                <MapPin size={15} />
                {physicalLocation}
            </span>

            <div className="">
                <button
                    onClick={() => {
                        drawerContext.setIsDrawerActive(!drawerContext.isDrawerActive);
                        drawerContext.setDrawerLocation(location);
                    }}
                >
                    details
                </button>

                <MoreHorizontal className={css['card-header-more-button']} />
            </div>
        </>
    );
}

export default EateryCardContent;
