import { tabType } from './Drawer';
import './DrawerTabNav.css';

function DrawerTabNav({ setCurrTab }: { setCurrTab: React.Dispatch<tabType> }) {
    return (
        <div className="drawer-tab-nav">
            <button type="button" onClick={() => setCurrTab('description')}>
                description
            </button>
            <button type="button" onClick={() => setCurrTab('menu')}>
                menu
            </button>
            <button type="button" onClick={() => setCurrTab('hours')}>
                hours
            </button>
            <button type="button" onClick={() => setCurrTab('reviews')}>
                reviews
            </button>
        </div>
    );
}

export default DrawerTabNav;
