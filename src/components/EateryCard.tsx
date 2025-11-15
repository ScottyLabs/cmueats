import { KeyboardEvent, useContext, useEffect, useMemo, useRef } from 'react';
import { Grid } from '@mui/material';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { CardStatus } from '../types/cardTypes';
import { DrawerContext } from '../contexts/DrawerContext';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';
import css from './EateryCard.module.css';

function EateryCard({
    location,
    index = 0,
    partOfMainGrid = false,
    animate = false,
    currentStatus,
    updateStatus,
    showControlButtons = true,
}: {
    location: IReadOnlyLocation_Combined;
    index?: number;
    partOfMainGrid?: boolean;
    animate?: boolean;
    currentStatus: CardStatus;
    updateStatus: (newStatus: CardStatus) => void;
    showControlButtons?: boolean;
}) {
    const drawerContext = useContext(DrawerContext);
    const { isDrawerActive, drawerLocation } = drawerContext;
    const isCardActiveInDrawer = isDrawerActive && drawerLocation?.conceptId === location.conceptId;
    const cardRef = useRef<HTMLDivElement | null>(null);
    function handleCardSelection() {
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
    }

    const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardSelection();
        }
    };

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
    const cardClassName = useMemo(
        () =>
            [
                css.card,
                animate ? css['card-animated'] : '',
                isCardActiveInDrawer ? css['card-active'] : '',
                partOfMainGrid ? css['card-in-main-grid'] : '',
                currentStatus === CardStatus.PINNED ? css['card-pinned'] : '',
            ]
                .filter(Boolean)
                .join(' '),
        [animate, isCardActiveInDrawer, partOfMainGrid, currentStatus],
    );

    return (
        <Grid item xs={12} md={isDrawerActive ? 12 : 4} lg={3 * isDouble} xl={2 * isDouble}>
            <div
                className={cardClassName}
                style={{ '--card-show-delay': `${index * 50}ms` }}
                ref={cardRef}
                role="button"
                tabIndex={0}
                onClick={handleCardSelection}
                onKeyDown={handleCardKeyDown}
            >
                <EateryCardHeader location={location} />
                <EateryCardContent
                    location={location}
                    currentStatus={currentStatus}
                    updateStatus={updateStatus}
                    showControlButtons={showControlButtons}
                />
            </div>
        </Grid>
    );
}

export default EateryCard;
