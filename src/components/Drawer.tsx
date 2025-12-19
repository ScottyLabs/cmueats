import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';
import css from './Drawer.module.css';
import { DrawerContextProvider } from '../contexts/DrawerContext';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

function Drawer({ locations }: { locations: IReadOnlyLocation_Combined[] | undefined }) {
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const { selectedConceptId, closeDrawer } = useDrawerAPIContext();
    const pickedLocation = locations?.find((loc) => loc.conceptId === selectedConceptId);
    // `esc` to close the drawer
    useEffect(() => {
        if (selectedConceptId === null) return () => {};

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;

            const target = event.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (isTyping) return;

            closeDrawer();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedConceptId]);

    // reset scroll when selected location changes
    useEffect(() => {
        drawerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }, [pickedLocation?.conceptId]);

    return (
        <AnimatePresence mode="popLayout">
            {pickedLocation !== undefined && (
                <motion.div
                    initial={{ opacity: 0, transform: 'translateX(30px)' }}
                    animate={{ opacity: 1, transform: 'translateX(0)' }}
                    exit={{ opacity: 0 }}
                    className={css['drawer-box']}
                    ref={drawerRef}
                    // transition={{ duration: 10 }}
                >
                    <DrawerContextProvider location={pickedLocation} key={pickedLocation.conceptId}>
                        <DrawerHeader />
                        <DrawerTabNav />
                        <DrawerTabContent />
                    </DrawerContextProvider>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Drawer;
