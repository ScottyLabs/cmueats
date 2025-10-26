import { useContext, useRef } from 'react';
import { DrawerContext } from '../contexts/DrawerContext';
import { CSSTransition } from 'react-transition-group';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';
import css from './Drawer.module.css';

function Drawer() {
    const drawerContext = useContext(DrawerContext);
    // const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location?;

    // on yelp, under their title is "rating (review number)", "location", "isOpen and hours"
    // their order is "add a review / add photos (button)", "menu", "location & hours", "review"
    // for reference <https://www.yelp.com/biz/paris-66-pittsburgh-2?hrid=ffQedKt12wIRLXZX8OTOqA>
    const drawerRef = useRef<HTMLDivElement | null>(null);

    return (
        <CSSTransition
            in={drawerContext.isDrawerActive}
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
