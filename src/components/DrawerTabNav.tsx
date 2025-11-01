import { useContext } from 'react';
import { MessageSquare, Sparkles, TextAlignStart, Utensils } from 'lucide-react';
import { DrawerContext } from '../contexts/DrawerContext';
import css from './DrawerTabNav.module.css';

function DrawerTabNav() {
    const { activeTab, setActiveTab } = useContext(DrawerContext);
    return (
        <div className={css['drawer-tab-nav']}>
            <button
                className={`${css['tab-button']} ${activeTab === 'overview' ? css['tab-button-active'] : ''}`}
                type="button"
                onClick={() => setActiveTab('overview')}
            >
                <TextAlignStart size={16} />
                overview
            </button>
            {/* <button
                className={`${css['tab-button']} ${activeTab === 'menu' ? css['tab-button-active'] : ''}`}
                type="button"
                onClick={() => setActiveTab('menu')}
            >
                <Utensils size={16} />
                menu
            </button>
            <button
                className={`${css['tab-button']} ${activeTab === 'reviews' ? css['tab-button-active'] : ''}`}
                type="button"
                onClick={() => setActiveTab('reviews')}
            >
                <MessageSquare size={16} />
                reviews
            </button> */}
        </div>
    );
}

export default DrawerTabNav;
