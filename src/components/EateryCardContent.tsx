import { useContext } from 'react';
import { DrawerContext } from '../pages/ListPage';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

function EateryCardContent({ location }: { location: IReadOnlyLocation_Combined }) {
    const drawerContext = useContext(DrawerContext);
    const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location;

    return (
        <>
            <p>
                <a href={url}>{name}</a>
            </p>

            <p>{physicalLocation}</p>

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
