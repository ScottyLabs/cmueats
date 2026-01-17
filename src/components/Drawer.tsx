import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';
import css from './Drawer.module.css';
import { DrawerTabsContextProvider } from '../contexts/DrawerTabsContext';
import { ILocation_Full } from '../types/locationTypes';
import { useWidth, WidthContext } from '../contexts/ScreenWidth';
import BottomSheet from './BottomSheet';
import { useIsMobileContext } from '../contexts/IsMobileContext';

function Drawer({ locations }: { locations: ILocation_Full[] | undefined }) {
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const { selectedId, closeDrawer } = useDrawerAPIContext();
    const pickedLocation = locations?.find((loc) => loc.id === selectedId);
    const drawerWidth = useWidth(drawerRef, pickedLocation !== undefined);

    const isMobile = useIsMobileContext();

    // `esc` to close the drawer
    useEffect(() => {
        if (selectedId === null) return () => {};

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;

            const target = event.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (isTyping) return;

            closeDrawer();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, closeDrawer]);

    // reset scroll when selected location changes
    useEffect(() => {
        drawerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }, [pickedLocation?.id]);

    return isMobile ? (
        <BottomSheet
            active={pickedLocation !== undefined}
            onHide={() => {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        closeDrawer();
                    });
                }, 100);
            }}
        >
            <div className={css['drawer-box-mobile']}>
                {pickedLocation !== undefined && (
                    <DrawerTabsContextProvider location={pickedLocation} key={pickedLocation.id}>
                        <DrawerHeader />
                        <DrawerTabNav />
                        <DrawerTabContent />
                    </DrawerTabsContextProvider>
                )}
            </div>
        </BottomSheet>
    ) : (
        <AnimatePresence mode="popLayout">
            {pickedLocation !== undefined && (
                <motion.div
                    initial={{ opacity: 0, transform: 'translateX(3px)' }}
                    animate={{ opacity: 1, transform: 'translateX(0)', transition: { delay: 0.04 } }} // it just feels right lmao
                    exit={{ opacity: 0, transition: { duration: 0 } }} // hard transition cut so back swipe gesture on mobile isn't jank (can remove once we add the actual mobile drawer)
                    className={css['drawer-box']}
                    ref={drawerRef}
                >
                    <WidthContext.Provider value={drawerWidth}>
                        <DrawerTabsContextProvider location={pickedLocation} key={pickedLocation.id}>
                            <DrawerHeader />
                            <DrawerTabNav />
                            <DrawerTabContent />
                        </DrawerTabsContextProvider>
                    </WidthContext.Provider>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Drawer;
