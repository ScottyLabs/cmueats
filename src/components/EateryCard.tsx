import { KeyboardEvent, useContext } from 'react';
import { Grid } from '@mui/material';

import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import './EateryCard.css';
import { DrawerContext } from '../pages/ListPage';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';

function EateryCard({
    location,
    index: _index = 0,
    partOfMainGrid = false,
    animate = false,
    isPinned: _isPinned,
    onTogglePin: _onTogglePin,
    showPinButton: _showPinButton = true,
}: {
    location: IReadOnlyLocation_Combined;
    index?: number;
    partOfMainGrid?: boolean;
    animate?: boolean;
    isPinned: boolean;
    onTogglePin: () => void;
    showPinButton?: boolean;
}) {
    const drawerContext = useContext(DrawerContext);

    const openDrawer = () => {
        drawerContext.setIsDrawerActive(true);
        drawerContext.setDrawerLocation(location);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDrawer();
        }
    };

    const isDouble = drawerContext.isDrawerActive ? 2 : 1;
    return (
        <Grid item xs={12} md={4 * isDouble} lg={3 * isDouble} xl={2 * isDouble}>
            <div
                className={`card ${animate ? 'card-animated' : ''} ${partOfMainGrid ? 'card-in-main-grid' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${location.name} details`}
                onClick={openDrawer}
                onKeyDown={handleKeyDown}
            >
                <EateryCardHeader location={location} />
                <EateryCardContent location={location} />
            </div>
        </Grid>
    );
}

export default EateryCard;
