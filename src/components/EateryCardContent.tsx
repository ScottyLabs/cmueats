import { useContext } from 'react';
import { DrawerContext } from '../pages/ListPage';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { MapPin } from 'lucide-react';
import './EateryCardContent.css';

function EateryCardContent({ location }: { location: IReadOnlyLocation_Combined }) {
    const drawerContext = useContext(DrawerContext);
    const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location;

    return (
        <>
            <h6>
                <a href={url}>{name}</a>
            </h6>

            <span className="physical-location-text">
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
            </div>
        </>
    );
}

export default EateryCardContent;
