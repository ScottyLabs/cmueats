import { useContext } from 'react';
import { TextAlignStart } from 'lucide-react';
import { DrawerContext } from '../contexts/DrawerContext';
import css from './DrawerTabNav.module.css';

function DrawerTabNav() {
    const drawerContext = useContext(DrawerContext);
    return (
        <div className={css['drawer-tab-nav']}>
            <button type="button" onClick={() => drawerContext.setActiveTab('overview')}>
                <TextAlignStart />
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
