import { KeyboardEvent, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { ILocation_Full } from '../types/locationTypes';
import { CardViewPreference } from '../util/storage';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import EateryCardHeader from './EateryCardHeader';
import EateryCardContent from './EateryCardContent';
import css from './EateryCard.module.css';

function EateryCard({
    location,
    partOfMainGrid = false,
    animate = false,
    updateViewPreference,
}: {
    location: ILocation_Full;
    partOfMainGrid?: boolean;
    animate?: boolean;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
}) {
    const drawerAPIContext = useDrawerAPIContext();
    const prevDrawerSelectedIdRef = useRef<string | null>(null);
    const cardWasPreviouslySelected = useRef(false);
    useEffect(() => {
        prevDrawerSelectedIdRef.current = drawerAPIContext.selectedId ?? null;
    }, [drawerAPIContext.selectedId]);

    const cardRef = useRef<HTMLDivElement | null>(null);
    function handleCardSelection() {
        // when the drawer is open, click other cards will open that
        // card's detail, instead of closing the drawer;
        // click on the same card will close the drawer.
        if (drawerAPIContext.selectedId === location.id) {
            drawerAPIContext.closeDrawer();
        } else {
            drawerAPIContext.setDrawerActiveId(location.id);
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
        const isCardSelected = drawerAPIContext.selectedId === location.id;
        if (
            (isCardSelected || (cardWasPreviouslySelected.current && drawerAPIContext.selectedId === null)) &&
            cardRef.current
        ) {
            // on deselect, scroll to approximate location as well
            cardRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
            });
        }
        cardWasPreviouslySelected.current = isCardSelected;
    }, [drawerAPIContext.selectedId, location.id]);

    const cardClassName = useMemo(
        () =>
            clsx(
                css.card,
                drawerAPIContext.selectedId === location.id ? css['card-active'] : '',
                partOfMainGrid ? css['card-in-main-grid'] : '',
                location.cardViewPreference === 'pinned' ? css['card-pinned'] : '',
            ),
        [drawerAPIContext.selectedId, location.id, partOfMainGrid, location.cardViewPreference],
    );
    const shouldAnimatePositionChange = prevDrawerSelectedIdRef.current === (drawerAPIContext.selectedId ?? null); // aka change was not triggered by a drawer select/unselect
    return (
        <motion.div
            layout
            className={cardClassName}
            initial={
                animate
                    ? {
                          opacity: 0,
                          transform: 'translate(-10px,0)',
                          filter: 'blur(3px)',
                          transition: { duration: 0.7, ease: [0.08, 0.67, 0.64, 1.01] },
                      }
                    : false
            }
            animate={{
                transform: 'translate(0,0)',
                opacity: 1,
                filter: 'blur(0)',
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            ref={cardRef}
            transition={
                shouldAnimatePositionChange
                    ? undefined // default transition animation
                    : {
                          layout: {
                              type: false,
                          },
                      }
            }
            // whole card clickable
            role="button"
            tabIndex={0}
            onClick={(ev) => {
                if (!ev.defaultPrevented) {
                    handleCardSelection();
                    ev.preventDefault();
                }
            }}
            onKeyDown={handleCardKeyDown}
        >
            <EateryCardHeader location={location} updateViewPreference={updateViewPreference} />
            <EateryCardContent location={location} partOfMainGrid={partOfMainGrid} />
        </motion.div>
    );
}

export default EateryCard;
