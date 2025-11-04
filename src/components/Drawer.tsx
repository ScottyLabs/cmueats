import { useContext, useEffect, useRef } from 'react';
import { DrawerContext } from '../contexts/DrawerContext';
import { CSSTransition } from 'react-transition-group';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';
import css from './Drawer.module.css';

function Drawer() {
    const { isDrawerActive, setIsDrawerActive } = useContext(DrawerContext);
    const drawerRef = useRef<HTMLDivElement | null>(null);

    // `esc` to close the drawer
    useEffect(() => {
        if (!isDrawerActive) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;

            const target = event.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (isTyping) return;

            setIsDrawerActive(false);
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isDrawerActive, setIsDrawerActive]);

    return (
        <CSSTransition
            in={isDrawerActive}
            timeout={300}
            mountOnEnter
            unmountOnExit
            nodeRef={drawerRef}
            classNames={{
                enter: css['drawer-enter'],
                enterActive: css['drawer-enter-active'],
                enterDone: css['drawer-enter-done'],
                exit: css['drawer-exit'],
                exitActive: css['drawer-exit-active'],
            }}
        >
            <div className={css['drawer-box']} ref={drawerRef}>
                <DrawerHeader />
                <DrawerTabNav />
                <DrawerTabContent />
            </div>
        </CSSTransition>
    );
}

export default Drawer;
