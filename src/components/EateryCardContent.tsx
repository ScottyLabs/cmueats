import { useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, MoreHorizontal, Pin, PinOff, Eye, EyeOff } from 'lucide-react';
import { DrawerContext } from '../contexts/DrawerContext';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { CardStatus } from '../types/cardTypes';
import css from './EateryCardContent.module.css';
import EateryCardDropdown from "./EateryCardDropdown.tsx";

function EateryCardContent({
    location,
    currentStatus,
    updateStatus,
    showControlButtons,
}: {
    location: IReadOnlyLocation_Combined;
    currentStatus: CardStatus;
    updateStatus: (newStatus: CardStatus) => void;
    showControlButtons?: boolean;
}) {
    const drawerContext = useContext(DrawerContext);
    const { location: physicalLocation, name, url } = location;
    const isMobile = window.innerWidth <= 600;

    const mobileLocation = physicalLocation.split(',').slice(0,1).join(",");

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']}>
                <a href={url}>{name}</a>
            </h3>

            <span className={css['physical-location-text']}>
                <MapPin size={isMobile ? 12 : 13} />
                {isMobile ? mobileLocation : physicalLocation}
            </span>

            {showControlButtons && !isMobile && (
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

                    <EateryCardDropdown
                        currentStatus={currentStatus}
                        updateStatus={updateStatus}
                    />
                </div>
            )}
        </div>
    );
}

export default EateryCardContent;
