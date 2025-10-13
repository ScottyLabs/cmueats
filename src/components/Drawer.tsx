import { useContext, useState } from 'react';
import { DrawerContext, TabType } from '../contexts/DrawerContext';
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
    const [currTab, setCurrTab] = useState<TabType>('description');

    return (
        drawerContext.isDrawerActive && (
            <div className={css['drawer-box']}>
                <DrawerHeader />
                <DrawerTabNav />
                <DrawerTabContent />
            </div>
        )
    );
}

export default Drawer;
