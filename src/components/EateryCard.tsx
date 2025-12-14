import { KeyboardEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { CardViewPreference } from '../util/storage';
import { useDrawerContext } from '../contexts/DrawerContext';
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
    // console.log("render")
    const drawerContext = useDrawerContext();
    const prevSelectedIdRef = useRef<number | null>(null);
    useEffect(() => {
        prevSelectedIdRef.current = drawerContext.drawerLocation?.conceptId ?? null;
    }, [drawerContext]);

    // const { drawerLocation } = drawerContext;
    const isCardSelected = drawerContext.drawerLocation?.conceptId === location.conceptId;
    const cardRef = useRef<HTMLDivElement | null>(null);
    function handleCardSelection() {
        // open default tab "overview"
        drawerContext.setActiveTab('overview');
        // when the drawer is open, click other cards will open that
        // card's detail, instead of closing the drawer;
        // click on the same card will close the drawer.
        if (drawerContext.drawerLocation?.conceptId === location.conceptId) {
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
        let timeoutId: number | undefined;
        console.log(drawerContext);
        if (isCardSelected && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }

        // return () => {
        //     // if click two cards very fast, will only scroll to the second card clicked
        //     if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        // };
    }, [drawerContext.drawerLocation?.conceptId]);

    const cardClassName = useMemo(
        () =>
            clsx(
                css.card,
                // animate ? css['card-animated'] : '',
                isCardSelected ? css['card-active'] : '',
                partOfMainGrid ? css['card-in-main-grid'] : '',
                location.cardViewPreference === 'pinned' ? css['card-pinned'] : '',
            ),
        [animate, isCardSelected, partOfMainGrid, location.cardViewPreference],
    );

    return (
        <motion.div
            layout={
                prevSelectedIdRef.current === (drawerContext.drawerLocation?.conceptId ?? null) ? 'position' : undefined
            }
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
                border: isCardSelected ? '2px solid white' : 'none',
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            ref={cardRef}
            // whole card clickable
            role="button"
            tabIndex={0}
            onClick={handleCardSelection}
            onKeyDown={handleCardKeyDown}
        >
            <EateryCardHeader location={location} />
            <EateryCardContent
                location={location}
                updateViewPreference={updateViewPreference}
                partOfMainGrid={partOfMainGrid}
            />
        </motion.div>
    );
}

export default EateryCard;
