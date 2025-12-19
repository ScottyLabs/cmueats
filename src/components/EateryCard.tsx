import { KeyboardEvent, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
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
    location: IReadOnlyLocation_Combined;
    partOfMainGrid?: boolean;
    animate?: boolean;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
}) {
    const drawerContext = useDrawerAPIContext();
    const prevDrawerSelectedIdRef = useRef<number | null>(null);
    useEffect(() => {
        prevDrawerSelectedIdRef.current = drawerContext.selectedConceptId ?? null;
    }, [drawerContext]);

    const isCardSelected = drawerContext.selectedConceptId === location.conceptId;
    const cardRef = useRef<HTMLDivElement | null>(null);
    function handleCardSelection() {
        // when the drawer is open, click other cards will open that
        // card's detail, instead of closing the drawer;
        // click on the same card will close the drawer.
        if (drawerContext.selectedConceptId === location.conceptId) {
            drawerContext.closeDrawer();
        } else {
            drawerContext.setDrawerConceptId(location.conceptId);
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
        if (isCardSelected && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'center',
            });
        }
    }, [drawerContext.selectedConceptId]);

    const cardClassName = useMemo(
        () =>
            clsx(
                css.card,
                isCardSelected ? css['card-active'] : '',
                partOfMainGrid ? css['card-in-main-grid'] : '',
                location.cardViewPreference === 'pinned' ? css['card-pinned'] : '',
            ),
        [animate, isCardSelected, partOfMainGrid, location.cardViewPreference],
    );
    const shouldAnimatePositionChange = prevDrawerSelectedIdRef.current === (drawerContext.selectedConceptId ?? null); // aka change was not triggered by a drawer select/unselect

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
            onClick={handleCardSelection}
            onKeyDown={handleCardKeyDown}
        >
            <EateryCardHeader location={location} updateViewPreference={updateViewPreference} />
            <EateryCardContent location={location} partOfMainGrid={partOfMainGrid} />
        </motion.div>
    );
}

export default EateryCard;
