import { useContext } from 'react';
import { Grid } from '@mui/material';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { DrawerContext } from '../contexts/DrawerContext';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';
import './EateryCard.css';

function EateryCard({
    location,
    index = 0,
    partOfMainGrid = false,
    animate = false,
    isPinned,
    onTogglePin,
    showPinButton = true,
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

    const isDouble = drawerContext.isDrawerActive ? 2 : 1;
    return (
        <Grid item xs={12} md={4 * isDouble} lg={3 * isDouble} xl={2 * isDouble}>
            <div
                className={`card ${animate ? 'card-animated' : ''} ${partOfMainGrid ? 'card-in-main-grid' : ''}`}
                style={{ '--card-show-delay': `${index * 50}ms` }}
            >
                <EateryCardHeader location={location} />
                <EateryCardContent location={location} />
            </div>
        </Grid>
    );
}

export default EateryCard;
