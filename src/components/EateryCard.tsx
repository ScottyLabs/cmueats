import { KeyboardEvent, useContext } from 'react';
import { Grid } from '@mui/material';

import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import './EateryCard.css';
import DrawerContext from '../contexts/DrawerContext';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';

type EateryCardProps = {
    location: IReadOnlyLocation_Combined;
    index: number;
    partOfMainGrid?: boolean;
    animate?: boolean;
    isPinned?: boolean;
    onTogglePin?: () => void;
    isHidden?: boolean;
    onToggleHide?: () => void;
};

function EateryCard({
    location,
    index = 0,
    partOfMainGrid = false,
    animate = false,
    isPinned = false,
    onTogglePin = () => {},
    isHidden = false,
    onToggleHide = () => {},
}: EateryCardProps) {
    const drawerContext = useContext(DrawerContext);

    const displayName = location.name.split(' - ')[0];

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
                style={{ '--card-show-delay': `${index * 50}ms` }}
                role="button"
                tabIndex={0}
                aria-label={`${displayName} details`}
                onClick={openDrawer}
                onKeyDown={handleKeyDown}
            >
                <EateryCardHeader location={location} />
                <EateryCardContent
                    location={location}
                    isPinned={isPinned}
                    onTogglePin={onTogglePin}
                    isHidden={isHidden}
                    onToggleHide={onToggleHide}
                />
            </div>
        </Grid>
    );
}

export default EateryCard;
