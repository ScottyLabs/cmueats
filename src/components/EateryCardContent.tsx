import { useContext } from 'react';
import { MapPin, MoreHorizontal } from 'lucide-react';
import { DrawerContext } from '../contexts/DrawerContext';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import css from './EateryCardContent.module.css';

function EateryCardContent({ location }: { location: IReadOnlyLocation_Combined }) {
    const drawerContext = useContext(DrawerContext);
    const { location: physicalLocation, name, url } = location;

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']}>
                <a href={url}>{name}</a>
            </h3>

            <span className={css['physical-location-text']}>
                <MapPin size={13} />
                {physicalLocation}
            </span>

            <div className={css['card-action-bar']}>
                <button
                    type="button"
                    className={css['details-button']}
                    onClick={() => {
                        // open default tab "overview"
                        drawerContext.setActiveTab('overview');
                        // when the drawer is open, click other cards will open that
                        // card's detail, instead of closing the drawer;
                        // click on the same card will close the drawer.
                        if (drawerContext.drawerLocation?.conceptId === location.conceptId) {
                            drawerContext.setIsDrawerActive(!drawerContext.isDrawerActive);
                        } else {
                            drawerContext.setDrawerLocation(location);
                            drawerContext.setIsDrawerActive(true);
                        }
                    }}
                >
                    details
                </button>

                <MoreHorizontal className={css['card-content-more-button']} />
            </div>
        </div>
    );
}

export default EateryCardContent;
