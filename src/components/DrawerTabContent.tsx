import { tabType } from './Drawer';
import './DrawerTabContent.css';

function DrawerTabContent({ currTab }: { currTab: tabType }) {
    return (
        <div className="drawer-tab-content">
            {currTab === 'description' && <div>description</div>}
            {currTab === 'menu' && <div>menu</div>}
            {currTab === 'hours' && <div>hours</div>}
            {currTab === 'reviews' && <div>reviews</div>}
        </div>
    );
}

export default DrawerTabContent;
