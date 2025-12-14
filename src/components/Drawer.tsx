import { useContext, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { AnimatePresence, motion } from 'motion/react';
import { useDrawerContext } from '../contexts/DrawerContext';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';
import css from './Drawer.module.css';

function Drawer() {
    const { drawerLocation, closeDrawer, setActiveTab, activeTab } = useDrawerContext();
    const drawerRef = useRef<HTMLDivElement | null>(null);

    // `esc` to close the drawer
    useEffect(() => {
        if (drawerLocation === null) return () => {};

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;

            const target = event.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (isTyping) return;

            closeDrawer();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [drawerLocation]);

    return (
        <AnimatePresence mode="popLayout">
            {drawerLocation !== null && (
                <motion.div
                    initial={{ opacity: 0, transform: 'translateX(30px)' }}
                    animate={{ opacity: 1, transform: 'translateX(0)' }}
                    exit={{ opacity: 0 }}
                    // transition={{ duration: 10 }}
                >
                    <div className={css['drawer-box']} ref={drawerRef}>
                        <DrawerHeader location={drawerLocation} closeDrawer={closeDrawer} />
                        <DrawerTabNav setActiveTab={setActiveTab} activeTab={activeTab} />
                        <DrawerTabContent />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Drawer;
