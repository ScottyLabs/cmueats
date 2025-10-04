import { useContext, useState } from 'react';
import './Drawer.css';
import { DrawerContext } from '../contexts/DrawerContext';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';

export type tabType = 'description' | 'menu' | 'hours' | 'reviews' | 'specials';

function Drawer() {
    const drawerContext = useContext(DrawerContext);
    // const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location?;

    // on yelp, under their title is "rating (review number)", "location", "isOpen and hours"
    // their order is "add a review / add photos (button)", "menu", "location & hours", "review"
    // for reference <https://www.yelp.com/biz/paris-66-pittsburgh-2?hrid=ffQedKt12wIRLXZX8OTOqA>
    const [currTab, setCurrTab] = useState<tabType>('description');

    return (
        drawerContext.isDrawerActive && (
            <div className="drawer-box">
                <DrawerHeader />
                <DrawerTabNav setCurrTab={setCurrTab} />
                <DrawerTabContent currTab={currTab} />
            </div>
        )
    );
}

export default Drawer;
