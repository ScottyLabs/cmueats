import { useContext, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { DrawerContext } from '../contexts/DrawerContext';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';
import css from './EateryCard.module.css';

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
    const { isDrawerActive, drawerLocation } = drawerContext;
    const isCardActiveInDrawer = isDrawerActive && drawerLocation?.conceptId === location.conceptId;
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let timeoutId: number | undefined;
        if (isCardActiveInDrawer && cardRef.current) {
            timeoutId = window.setTimeout(() => {
                cardRef.current!.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        }

        return () => {
            // if click two cards very fast, will only scroll to the second card clicked
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        };
    }, [drawerLocation?.conceptId, isDrawerActive, location.conceptId]);

    const isDouble = isDrawerActive ? 2 : 1;
    return (
        <Grid item xs={12} md={isDrawerActive ? 12 : 4} lg={3 * isDouble} xl={2 * isDouble}>
            <div
                className={`${css.card} ${animate ? css['card-animated'] : ''} ${isCardActiveInDrawer ? css['card-active'] : ''} ${partOfMainGrid ? css['card-in-main-grid'] : ''}`}
                style={{ '--card-show-delay': `${index * 50}ms` }}
                ref={cardRef}
            >
                <EateryCardHeader location={location} />
                <EateryCardContent location={location} />
            </div>
        </Grid>
    );
}

export default EateryCard;
