import { BookOpen, Star, TextAlignStart } from 'lucide-react';
import css from './DrawerTabNav.module.css';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';

function DrawerTabNav() {
    const { activeTab, setActiveTab } = useDrawerAPIContext();
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
            <button
                className={`${css['tab-button']} ${activeTab === 'reviews' ? css['tab-button-active'] : ''}`}
                type="button"
                onClick={() => setActiveTab('reviews')}
            >
                <Star size={16} />
                reviews
            </button>
            <button
                className={`${css['tab-button']} ${activeTab === 'menu' ? css['tab-button-active'] : ''}`}
                type="button"
                onClick={() => setActiveTab('menu')}
            >
                <BookOpen size={16} />
                menu
            </button>
        </div>
    );
}

export default DrawerTabNav;
