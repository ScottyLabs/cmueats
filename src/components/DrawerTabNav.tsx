import { useContext } from 'react';
import css from './DrawerTabNav.module.css';
import { DrawerContext } from '../contexts/DrawerContext';

function DrawerTabNav() {
    const drawerContext = useContext(DrawerContext);
    return (
        <div className={css['drawer-tab-nav']}>
            <button type="button" onClick={() => drawerContext.setActiveTab('overview')}>
                overview
            </button>
            {/* <button type="button" onClick={() => drawerContext.setActiveTab('menu')}>
                menu
            </button>
            <button type="button" onClick={() => drawerContext.setActiveTab('reviews')}>
                reviews
            </button> */}
        </div>
    );
}

export default DrawerTabNav;
